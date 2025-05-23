import { useState, useEffect } from 'react';
import { ClipboardCheck, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDataContext } from '../../context/DataContext';
import { Faculty, Grade } from '../../types';

const FacultyGrading = () => {
  const { currentUser } = useAuth();
  const faculty = currentUser as Faculty;
  const { courses, students, assignments, addGrade } = useDataContext();
  
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedAssignment, setSelectedAssignment] = useState<string>('');
  const [grades, setGrades] = useState<{[studentId: string]: number}>({});
  const [comments, setComments] = useState<{[studentId: string]: string}>({});
  
  // Get only courses taught by this faculty
  const facultyCourses = courses.filter(course => course.faculty === faculty.name);
  
  // Get assignments for the selected course
  const courseAssignments = selectedCourse 
    ? assignments.filter(assignment => assignment.courseId === selectedCourse)
    : [];
  
  // Get students enrolled in the selected course
  const enrolledStudents = selectedCourse 
    ? students.filter(student => student.courses.includes(selectedCourse))
    : [];

  // Get the max marks for the selected assignment
  const selectedAssignmentDetails = assignments.find(a => a.id === selectedAssignment);
  const maxMarks = selectedAssignmentDetails?.maxMarks || 100;

  useEffect(() => {
    if (selectedAssignment && enrolledStudents.length > 0) {
      // Initialize grades and comments for all enrolled students
      const initialGrades: {[studentId: string]: number} = {};
      const initialComments: {[studentId: string]: string} = {};
      
      enrolledStudents.forEach(student => {
        // Check if student already has grades for this assignment
        const existingGrade = student.grades.find(
          grade => grade.assignmentId === selectedAssignment
        );
        
        initialGrades[student.id] = existingGrade ? existingGrade.marks : 0;
        initialComments[student.id] = existingGrade ? existingGrade.comments || '' : '';
      });
      
      setGrades(initialGrades);
      setComments(initialComments);
    } else {
      setGrades({});
      setComments({});
    }
  }, [selectedAssignment, enrolledStudents]);

  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    setSelectedAssignment('');
  };

  const handleGradeChange = (studentId: string, value: string) => {
    const numValue = Math.min(Math.max(0, parseInt(value) || 0), maxMarks);
    setGrades(prev => ({
      ...prev,
      [studentId]: numValue
    }));
  };

  const handleCommentChange = (studentId: string, value: string) => {
    setComments(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  const handleSubmitGrades = () => {
    // Create grade records
    Object.entries(grades).forEach(([studentId, marks]) => {
      const grade: Grade = {
        id: `G${Math.floor(1000 + Math.random() * 9000)}`,
        assignmentId: selectedAssignment,
        marks,
        comments: comments[studentId] || '',
        submittedOn: new Date().toISOString()
      };
      
      addGrade(studentId, grade);
    });
    
    alert('Grades have been submitted successfully!');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Grading</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                Select Course
              </label>
              <select
                id="course"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedCourse}
                onChange={(e) => handleCourseChange(e.target.value)}
              >
                <option value="">Select a Course</option>
                {facultyCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="assignment" className="block text-sm font-medium text-gray-700">
                Select Assignment
              </label>
              <select
                id="assignment"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedAssignment}
                onChange={(e) => setSelectedAssignment(e.target.value)}
                disabled={!selectedCourse}
              >
                <option value="">Select an Assignment</option>
                {courseAssignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.title} (Due: {new Date(assignment.dueDate).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleSubmitGrades}
                disabled={!selectedAssignment || enrolledStudents.length === 0}
                className={`w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${!selectedAssignment || enrolledStudents.length === 0 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
              >
                Submit Grades
              </button>
            </div>
          </div>
        </div>

        {selectedAssignment && (
          <div className="overflow-x-auto">
            {enrolledStudents.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marks (out of {maxMarks})
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comments
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrolledStudents.map((student) => {
                    // Check if student already has grades for this assignment
                    const existingGrade = student.grades.find(
                      grade => grade.assignmentId === selectedAssignment
                    );
                    
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {student.profileImage ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={student.profileImage}
                                  alt={student.name}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-500">
                                    {student.name.substring(0, 2).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {student.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {student.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <input
                              type="number"
                              min="0"
                              max={maxMarks}
                              value={grades[student.id] || 0}
                              onChange={(e) => handleGradeChange(student.id, e.target.value)}
                              className="block w-20 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            
                            {existingGrade && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <Check className="h-3 w-3 mr-1" />
                                Graded
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <textarea
                            rows={2}
                            value={comments[student.id] || ''}
                            onChange={(e) => handleCommentChange(student.id, e.target.value)}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Add feedback comments here..."
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center">
                <ClipboardCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No students enrolled</h3>
                <p className="mt-1 text-gray-500">There are no students enrolled in this course yet.</p>
              </div>
            )}
          </div>
        )}
        
        {(!selectedCourse || !selectedAssignment) && (
          <div className="p-6 text-center">
            <ClipboardCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Select a course and assignment</h3>
            <p className="mt-1 text-gray-500">Please select a course and assignment to start grading students.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyGrading;