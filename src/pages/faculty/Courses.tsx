import { useState } from 'react';
import { BookOpen, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDataContext } from '../../context/DataContext';
import { Course, Faculty } from '../../types';

const FacultyCourses = () => {
  const { currentUser } = useAuth();
  const faculty = currentUser as Faculty;
  const { courses, addCourse, updateCourse, deleteCourse } = useDataContext();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    name: '',
    code: '',
    department: faculty.department,
    semester: '1',
    credits: 3,
    description: '',
    faculty: faculty.name,
    enrolledStudents: []
  });
  
  // Get only courses taught by this faculty
  const facultyCourses = courses.filter(course => course.faculty === faculty.name);

  const handleAddCourse = () => {
    if (newCourse.name && newCourse.code && newCourse.department) {
      const course: Course = {
        id: `C${Math.floor(1000 + Math.random() * 9000)}`,
        name: newCourse.name,
        code: newCourse.code,
        department: newCourse.department || faculty.department,
        semester: newCourse.semester || '1',
        credits: newCourse.credits || 3,
        description: newCourse.description || '',
        faculty: faculty.name,
        enrolledStudents: []
      };
      
      addCourse(course);
      setNewCourse({
        name: '',
        code: '',
        department: faculty.department,
        semester: '1',
        credits: 3,
        description: '',
        faculty: faculty.name,
        enrolledStudents: []
      });
      setShowAddModal(false);
    }
  };

  const handleEditCourse = () => {
    if (currentCourse && currentCourse.name && currentCourse.code) {
      updateCourse(currentCourse.id, currentCourse);
      setShowEditModal(false);
    }
  };

  const openEditModal = (course: Course) => {
    setCurrentCourse({ ...course });
    setShowEditModal(true);
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      deleteCourse(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="h-5 w-5 mr-1" />
          Add Course
        </button>
      </div>

      {facultyCourses.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No courses yet</h3>
          <p className="mt-1 text-gray-500">You haven't created any courses yet. Click the button above to add your first course.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facultyCourses.map((course) => (
            <div key={course.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                    <p className="text-gray-600">{course.code}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(course)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-gray-700">{course.description || 'No description provided.'}</p>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                    {course.department}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
                    Semester {course.semester}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
                    {course.credits} Credits
                  </span>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {course.enrolledStudents?.length || 0} Students Enrolled
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Course</h3>
              <div className="mt-4">
                <form className="space-y-4">
                  <div className="text-left">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Course Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newCourse.name || ''}
                      onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="text-left">
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                      Course Code*
                    </label>
                    <input
                      type="text"
                      id="code"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newCourse.code || ''}
                      onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                      required
                    />
                  </div>
                  <div className="text-left">
                    <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                      Semester
                    </label>
                    <select
                      id="semester"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newCourse.semester || '1'}
                      onChange={(e) => setNewCourse({ ...newCourse, semester: e.target.value })}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem.toString()}>{sem}</option>
                      ))}
                    </select>
                  </div>
                  <div className="text-left">
                    <label htmlFor="credits" className="block text-sm font-medium text-gray-700">
                      Credits
                    </label>
                    <input
                      type="number"
                      id="credits"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newCourse.credits || 3}
                      onChange={(e) => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) })}
                      min={1}
                      max={5}
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
                      value={newCourse.description || ''}
                      onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
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
                onClick={handleAddCourse}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditModal && currentCourse && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Course</h3>
              <div className="mt-4">
                <form className="space-y-4">
                  <div className="text-left">
                    <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                      Course Name*
                    </label>
                    <input
                      type="text"
                      id="edit-name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={currentCourse.name}
                      onChange={(e) => setCurrentCourse({ ...currentCourse, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="text-left">
                    <label htmlFor="edit-code" className="block text-sm font-medium text-gray-700">
                      Course Code*
                    </label>
                    <input
                      type="text"
                      id="edit-code"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={currentCourse.code}
                      onChange={(e) => setCurrentCourse({ ...currentCourse, code: e.target.value })}
                      required
                    />
                  </div>
                  <div className="text-left">
                    <label htmlFor="edit-semester" className="block text-sm font-medium text-gray-700">
                      Semester
                    </label>
                    <select
                      id="edit-semester"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={currentCourse.semester}
                      onChange={(e) => setCurrentCourse({ ...currentCourse, semester: e.target.value })}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem.toString()}>{sem}</option>
                      ))}
                    </select>
                  </div>
                  <div className="text-left">
                    <label htmlFor="edit-credits" className="block text-sm font-medium text-gray-700">
                      Credits
                    </label>
                    <input
                      type="number"
                      id="edit-credits"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={currentCourse.credits}
                      onChange={(e) => setCurrentCourse({ ...currentCourse, credits: parseInt(e.target.value) })}
                      min={1}
                      max={5}
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
                      value={currentCourse.description || ''}
                      onChange={(e) => setCurrentCourse({ ...currentCourse, description: e.target.value })}
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
                onClick={handleEditCourse}
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

export default FacultyCourses;