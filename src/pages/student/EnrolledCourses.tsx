import { useState } from 'react';
import { BookOpen, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDataContext } from '../../context/DataContext';
import { Student } from '../../types';

const EnrolledCourses = () => {
  const { currentUser } = useAuth();
  const student = currentUser as Student;
  const { courses, removeStudentFromCourse } = useDataContext();

  // Get enrolled courses with safety check for student.courses
  const enrolledCourses = courses.filter(course => 
    student?.courses && Array.isArray(student.courses) && student.courses.includes(course.id)
  );

  const handleDrop = (courseId: string) => {
    if (confirm('Are you sure you want to drop this course?')) {
      removeStudentFromCourse(student.id, courseId);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Enrolled Courses</h1>
        <p className="text-gray-600">Manage your course enrollments</p>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Enrolled Courses</h3>
          <p className="mt-1 text-gray-500">You haven't enrolled in any courses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
                      <p className="text-sm text-gray-500">{course.code}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {course.description || 'No description available'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
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

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Faculty: {course.faculty}
                  </div>
                  <button
                    onClick={() => handleDrop(course.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Drop Course
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;