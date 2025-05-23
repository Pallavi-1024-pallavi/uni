import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, ClipboardList, User, CheckCircle, AlertCircle } from 'lucide-react';
import { useDataContext } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Student } from '../../types';

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { courses, assignments } = useDataContext();
  const { currentUser } = useAuth();
  const student = currentUser as Student;
  
  // Find the course
  const course = courses.find(c => c.id === id);
  
  // Find assignments for this course
  const courseAssignments = assignments.filter(a => a.courseId === id);
  
  // Calculate attendance for this course
  const courseAttendance = student.attendanceRecords.filter(record => record.courseId === id);
  const totalClasses = courseAttendance.length;
  const attendedClasses = courseAttendance.filter(record => record.present).length;
  const attendancePercentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;
  
  if (!course) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600">Course not found</p>
        <button
          onClick={() => navigate('/student')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate('/student')}
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </button>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">{course.name}</h1>
          <div className="flex items-center mt-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
              {course.code}
            </span>
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
              {course.department}
            </span>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
              Semester {course.semester}
            </span>
            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {course.credits} Credits
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <User className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-md font-medium text-gray-900">Faculty</h3>
              </div>
              <p className="mt-2 text-gray-700">{course.faculty}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <ClipboardList className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-md font-medium text-gray-900">Assignments</h3>
              </div>
              <p className="mt-2 text-gray-700">{courseAssignments.length} assignments</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-orange-600 mr-2" />
                <h3 className="text-md font-medium text-gray-900">Attendance</h3>
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>{attendedClasses}/{totalClasses} classes</span>
                  <span className={`font-medium ${attendancePercentage < 75 ? 'text-red-600' : 'text-green-600'}`}>
                    {attendancePercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div 
                    className={`h-2.5 rounded-full ${
                      attendancePercentage < 75 ? 'bg-red-600' : 'bg-green-600'
                    }`}
                    style={{ width: `${attendancePercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Course Description</h3>
            <p className="text-gray-700">
              {course.description || 'No description provided for this course.'}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Assignments</h3>
            {courseAssignments.length > 0 ? (
              <div className="space-y-4">
                {courseAssignments
                  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                  .map((assignment) => {
                    const dueDate = new Date(assignment.dueDate);
                    const isPastDue = dueDate < new Date();
                    const isCloseToDue = !isPastDue && (dueDate.getTime() - new Date().getTime()) < (3 * 24 * 60 * 60 * 1000); // 3 days
                    
                    // Check if student has been graded for this assignment
                    const grade = student.grades.find(g => g.assignmentId === assignment.id);
                    
                    return (
                      <div 
                        key={assignment.id} 
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => navigate(`/student/grades/${assignment.id}`)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-md font-medium text-gray-900">{assignment.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {assignment.description ? (
                                assignment.description.length > 100 
                                  ? `${assignment.description.substring(0, 100)}...` 
                                  : assignment.description
                              ) : 'No description'}
                            </p>
                          </div>
                          <div className="flex items-center">
                            {grade ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Graded: {grade.marks}/{assignment.maxMarks}
                              </span>
                            ) : (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                isPastDue 
                                  ? 'bg-red-100 text-red-800' 
                                  : isCloseToDue 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : 'bg-blue-100 text-blue-800'
                              }`}>
                                {isPastDue ? (
                                  <>
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Past Due
                                  </>
                                ) : (
                                  <>Due: {dueDate.toLocaleDateString()}</>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-xs text-gray-500">Max Marks: {assignment.maxMarks}</span>
                          <span className="text-xs text-gray-500">
                            Posted on: {new Date(assignment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-gray-500">No assignments have been posted for this course yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;