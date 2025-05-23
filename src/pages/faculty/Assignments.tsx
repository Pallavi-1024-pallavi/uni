import { useState } from 'react';
import { FileText, PlusCircle, Edit, Trash2, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDataContext } from '../../context/DataContext';
import { Assignment, Faculty } from '../../types';

const FacultyAssignments = () => {
  const { currentUser } = useAuth();
  const faculty = currentUser as Faculty;
  const { courses, assignments, addAssignment, updateAssignment, deleteAssignment } = useDataContext();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({
    title: '',
    description: '',
    courseId: '',
    dueDate: '',
    maxMarks: 100,
  });
  
  // Get only courses taught by this faculty
  const facultyCourses = courses.filter(course => course.faculty === faculty.name);
  const facultyAssignments = assignments.filter(assignment => 
    facultyCourses.some(course => course.id === assignment.courseId)
  );

  const handleAddAssignment = () => {
    if (newAssignment.title && newAssignment.courseId && newAssignment.dueDate) {
      const assignment: Assignment = {
        id: `A${Math.floor(1000 + Math.random() * 9000)}`,
        title: newAssignment.title,
        description: newAssignment.description || '',
        courseId: newAssignment.courseId,
        dueDate: newAssignment.dueDate,
        maxMarks: newAssignment.maxMarks || 100,
        createdAt: new Date().toISOString(),
      };
      
      addAssignment(assignment);
      setNewAssignment({
        title: '',
        description: '',
        courseId: '',
        dueDate: '',
        maxMarks: 100,
      });
      setShowAddModal(false);
    }
  };

  const handleEditAssignment = () => {
    if (currentAssignment && currentAssignment.title && currentAssignment.courseId && currentAssignment.dueDate) {
      updateAssignment(currentAssignment.id, currentAssignment);
      setShowEditModal(false);
    }
  };

  const openEditModal = (assignment: Assignment) => {
    setCurrentAssignment({ ...assignment });
    setShowEditModal(true);
  };

  const handleDeleteAssignment = (id: string) => {
    if (confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
      deleteAssignment(id);
    }
  };

  // Get course name from courseId
  const getCourseName = (courseId: string) => {
    const course = facultyCourses.find(c => c.id === courseId);
    return course ? course.name : 'Unknown Course';
  };
  
  // Sort assignments by due date (most recent first)
  const sortedAssignments = [...facultyAssignments].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Assignments</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          disabled={facultyCourses.length === 0}
        >
          <PlusCircle className="h-5 w-5 mr-1" />
          Add Assignment
        </button>
      </div>

      {facultyCourses.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No courses available</h3>
          <p className="mt-1 text-gray-500">You need to create a course before you can add assignments.</p>
        </div>
      ) : facultyAssignments.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No assignments yet</h3>
          <p className="mt-1 text-gray-500">You haven't created any assignments yet. Click the button above to add your first assignment.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Max Marks
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAssignments.map((assignment) => {
                  const dueDate = new Date(assignment.dueDate);
                  const isPastDue = dueDate < new Date();
                  const isCloseToDue = !isPastDue && (dueDate.getTime() - new Date().getTime()) < (3 * 24 * 60 * 60 * 1000); // 3 days
                  
                  return (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {assignment.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {assignment.description ? (
                                assignment.description.length > 50 
                                  ? `${assignment.description.substring(0, 50)}...` 
                                  : assignment.description
                              ) : 'No description'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{getCourseName(assignment.courseId)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center text-sm ${
                          isPastDue ? 'text-red-600' : isCloseToDue ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            {new Date(assignment.dueDate).toLocaleDateString()} 
                            {isPastDue ? ' (Past due)' : ''}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{assignment.maxMarks}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditModal(assignment)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAssignment(assignment.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Assignment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Assignment</h3>
              <div className="mt-4">
                <form className="space-y-4">
                  <div className="text-left">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title*
                    </label>
                    <input
                      type="text"
                      id="title"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newAssignment.title || ''}
                      onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="text-left">
                    <label htmlFor="courseId" className="block text-sm font-medium text-gray-700">
                      Course*
                    </label>
                    <select
                      id="courseId"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newAssignment.courseId || ''}
                      onChange={(e) => setNewAssignment({ ...newAssignment, courseId: e.target.value })}
                      required
                    >
                      <option value="">Select Course</option>
                      {facultyCourses.map((course) => (
                        <option key={course.id} value={course.id}>{course.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="text-left">
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                      Due Date*
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newAssignment.dueDate || ''}
                      onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="text-left">
                    <label htmlFor="maxMarks" className="block text-sm font-medium text-gray-700">
                      Maximum Marks
                    </label>
                    <input
                      type="number"
                      id="maxMarks"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newAssignment.maxMarks || 100}
                      onChange={(e) => setNewAssignment({ ...newAssignment, maxMarks: parseInt(e.target.value) })}
                      min={1}
                    />
                  </div>
                  <div className="text-left">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newAssignment.description || ''}
                      onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="mr-2 px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAssignment}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Assignment Modal */}
      {showEditModal && currentAssignment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Assignment</h3>
              <div className="mt-4">
                <form className="space-y-4">
                  <div className="text-left">
                    <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700">
                      Title*
                    </label>
                    <input
                      type="text"
                      id="edit-title"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={currentAssignment.title}
                      onChange={(e) => setCurrentAssignment({ ...currentAssignment, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="text-left">
                    <label htmlFor="edit-courseId" className="block text-sm font-medium text-gray-700">
                      Course*
                    </label>
                    <select
                      id="edit-courseId"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={currentAssignment.courseId}
                      onChange={(e) => setCurrentAssignment({ ...currentAssignment, courseId: e.target.value })}
                      required
                    >
                      {facultyCourses.map((course) => (
                        <option key={course.id} value={course.id}>{course.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="text-left">
                    <label htmlFor="edit-dueDate" className="block text-sm font-medium text-gray-700">
                      Due Date*
                    </label>
                    <input
                      type="date"
                      id="edit-dueDate"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={currentAssignment.dueDate.substring(0, 10)}
                      onChange={(e) => setCurrentAssignment({ ...currentAssignment, dueDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="text-left">
                    <label htmlFor="edit-maxMarks" className="block text-sm font-medium text-gray-700">
                      Maximum Marks
                    </label>
                    <input
                      type="number"
                      id="edit-maxMarks"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={currentAssignment.maxMarks}
                      onChange={(e) => setCurrentAssignment({ ...currentAssignment, maxMarks: parseInt(e.target.value) })}
                      min={1}
                    />
                  </div>
                  <div className="text-left">
                    <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="edit-description"
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={currentAssignment.description || ''}
                      onChange={(e) => setCurrentAssignment({ ...currentAssignment, description: e.target.value })}
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="mr-2 px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleEditAssignment}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyAssignments;