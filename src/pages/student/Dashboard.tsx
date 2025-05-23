import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, BarChart2, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDataContext } from '../../context/DataContext';
import { Student } from '../../types';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const student = currentUser as Student;
  const { courses, assignments } = useDataContext();
  
  // Get courses the student is enrolled in
  const enrolledCourses = courses?.filter(course => 
    student?.courses?.includes(course.id)
  ) || [];
  
  // Get assignments for enrolled courses
  const courseAssignments = assignments?.filter(assignment => 
    student?.courses?.includes(assignment.courseId)
  ) || [];

  // Calculate attendance percentage with proper null checks
  const calculateAttendancePercentage = () => {
    if (!student?.attendanceRecords || !Array.isArray(student.attendanceRecords) || student.attendanceRecords.length === 0) {
      return 0;
    }
    
    const present = student.attendanceRecords.filter(record => record.present).length;
    return Math.round((present / student.attendanceRecords.length) * 100);
  };

  const attendancePercentage = calculateAttendancePercentage();

  const getGradeForAssignment = (assignmentId: string) => {
    return student?.grades?.find(grade => grade.assignmentId === assignmentId);
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/student/course/${courseId}`);
  };

  const handleGradeClick = (assignmentId: string) => {
    navigate(`/student/grades/${assignmentId}`);
  };

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading student data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
        <p className="text-gray-600">Welcome back, {student.name || 'Student'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Attendance</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{attendancePercentage}%</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  attendancePercentage < 75 ? 'bg-red-600' : 'bg-green-600'
                }`}
                style={{ width: `${attendancePercentage}%` }}
              ></div>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {attendancePercentage < 75 
                ? 'Warning: Your attendance is below 75%'
                : 'Good: Your attendance is above 75%'}
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Enrolled Courses</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{enrolledCourses.length}</p>
            </div>
            <div className="p-3 bg-teal-50 rounded-full">
              <BookOpen className="h-6 w-6 text-teal-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              {enrolledCourses.length > 0 
                ? `You are enrolled in ${enrolledCourses.length} course${enrolledCourses.length > 1 ? 's' : ''}`
                : 'You are not enrolled in any courses yet'}
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Upcoming Assignments</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{courseAssignments.length}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-full">
              <BarChart2 className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              {courseAssignments.length > 0 
                ? `You have ${courseAssignments.length} upcoming assignment${courseAssignments.length > 1 ? 's' : ''}`
                : 'No upcoming assignments'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">My Courses</h2>
          </div>
          <div className="px-6 py-4">
            {enrolledCourses.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {enrolledCourses.map((course) => (
                  <div 
                    key={course.id} 
                    className="py-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 -mx-6 px-6 transition-colors duration-200"
                    onClick={() => handleCourseClick(course.id)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-base font-medium text-gray-900">{course.name}</p>
                        <p className="text-sm text-gray-500">{course.code} • {course.faculty}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-gray-500">You are not enrolled in any courses yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Recent Grades</h2>
          </div>
          <div className="px-6 py-4">
            {student.grades && student.grades.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {student.grades.slice(0, 5).map((grade) => {
                  const assignment = assignments?.find(a => a.id === grade.assignmentId);
                  if (!assignment) return null;
                  
                  const course = courses?.find(c => c.id === assignment.courseId);
                  const percentage = Math.round((grade.marks / assignment.maxMarks) * 100);
                  
                  let statusColor = 'bg-green-100 text-green-800';
                  if (percentage < 60) statusColor = 'bg-red-100 text-red-800';
                  else if (percentage < 75) statusColor = 'bg-yellow-100 text-yellow-800';
                  
                  return (
                    <div 
                      key={grade.id} 
                      className="py-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 -mx-6 px-6 transition-colors duration-200"
                      onClick={() => handleGradeClick(assignment.id)}
                    >
                      <div className="flex-1">
                        <p className="text-base font-medium text-gray-900">{assignment.title}</p>
                        <p className="text-sm text-gray-500">{course?.name || 'Unknown Course'}</p>
                      </div>
                      <div className="ml-4 flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                          {grade.marks}/{assignment.maxMarks} ({percentage}%)
                        </span>
                        <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-gray-500">No grades available yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;