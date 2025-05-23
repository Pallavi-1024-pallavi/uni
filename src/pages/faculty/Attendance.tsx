import { useState } from 'react';
import { Calendar, Check, X, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDataContext } from '../../context/DataContext';
import { Faculty, AttendanceRecord } from '../../types';

const FacultyAttendance = () => {
  const { currentUser } = useAuth();
  const faculty = currentUser as Faculty;
  const { courses, students, markAttendance } = useDataContext();
  
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [attendanceData, setAttendanceData] = useState<{[studentId: string]: boolean}>({});
  
  // Get only courses taught by this faculty
  const facultyCourses = courses.filter(course => course.faculty === faculty.name);
  
  // Get students enrolled in the selected course
  const enrolledStudents = selectedCourse 
    ? students.filter(student => student.courses.includes(selectedCourse))
    : [];

  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    
    // Initialize attendance data for all enrolled students
    const initialAttendance: {[studentId: string]: boolean} = {};
    students.filter(student => student.courses.includes(courseId))
      .forEach(student => {
        // Check if student already has attendance for this date and course
        const existingAttendance = student.attendanceRecords.find(
          record => record.courseId === courseId && record.date === attendanceDate
        );
        
        initialAttendance[student.id] = existingAttendance ? existingAttendance.present : true;
      });
    
    setAttendanceData(initialAttendance);
  };

  const toggleAttendance = (studentId: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleSubmitAttendance = () => {
    // Create attendance records
    Object.entries(attendanceData).forEach(([studentId, present]) => {
      const attendanceRecord: AttendanceRecord = {
        id: `ATT${Math.floor(1000 + Math.random() * 9000)}`,
        courseId: selectedCourse,
        date: attendanceDate,
        present
      };
      
      markAttendance(studentId, attendanceRecord);
    });
    
    alert('Attendance has been marked successfully!');
  };

  const calculateAttendanceStats = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return { total: 0, present: 0, percentage: 0 };
    
    const courseAttendance = student.attendanceRecords.filter(
      record => record.courseId === selectedCourse
    );
    
    const total = courseAttendance.length;
    const present = courseAttendance.filter(record => record.present).length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { total, present, percentage };
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Attendance Management</h1>
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
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="date"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleSubmitAttendance}
                disabled={!selectedCourse || enrolledStudents.length === 0}
                className={`w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${!selectedCourse || enrolledStudents.length === 0 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
              >
                Save Attendance
              </button>
            </div>
          </div>
        </div>

        {selectedCourse && (
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
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Overall Attendance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrolledStudents.map((student) => {
                    const isPresent = attendanceData[student.id] ?? true;
                    const stats = calculateAttendanceStats(student.id);
                    
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
                          <button
                            onClick={() => toggleAttendance(student.id)}
                            className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded-full 
                              ${isPresent 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                          >
                            {isPresent ? (
                              <>
                                <Check className="h-4 w-4 mr-1" />
                                Present
                              </>
                            ) : (
                              <>
                                <X className="h-4 w-4 mr-1" />
                                Absent
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-blue-500" />
                            <div>
                              <div className="text-sm text-gray-900">
                                {stats.present} / {stats.total} classes
                              </div>
                              <div className="mt-1 w-24 bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className={`h-2.5 rounded-full ${
                                    stats.percentage < 75 ? 'bg-red-600' : 'bg-green-600'
                                  }`}
                                  style={{ width: `${stats.percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">{stats.percentage}%</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No students enrolled</h3>
                <p className="mt-1 text-gray-500">There are no students enrolled in this course yet.</p>
              </div>
            )}
          </div>
        )}
        
        {!selectedCourse && (
          <div className="p-6 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Select a course</h3>
            <p className="mt-1 text-gray-500">Please select a course to manage attendance.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyAttendance;