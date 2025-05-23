import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, FileText, CheckSquare, BarChart2 } from 'lucide-react';
import DashboardCard from '../../components/common/DashboardCard';
import { useAuth } from '../../context/AuthContext';
import { useDataContext } from '../../context/DataContext';
import { Faculty } from '../../types';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { courses, students, assignments } = useDataContext();
  const faculty = currentUser as Faculty;
  
  // Filter data relevant to this faculty
  const facultyCourses = courses.filter(course => course.faculty === faculty.name);
  const courseIds = facultyCourses.map(course => course.id);
  
  const departmentStudents = students.filter(student => student.department === faculty.department);
  const enrolledStudents = departmentStudents.filter(student => 
    student.courses.some(courseId => courseIds.includes(courseId))
  );
  
  const facultyAssignments = assignments.filter(assignment => 
    facultyCourses.some(course => course.id === assignment.courseId)
  );

  // Calculate pending grades
  const pendingGrades = facultyAssignments.reduce((count, assignment) => {
    // Count students who have not been graded for this assignment
    const ungradedStudents = enrolledStudents.filter(student => {
      const studentGrade = student.grades.find(grade => grade.assignmentId === assignment.id);
      return !studentGrade;
    }).length;
    return count + ungradedStudents;
  }, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Faculty Dashboard</h1>
        <p className="text-gray-600">Welcome back, {faculty.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="My Courses"
          value={facultyCourses.length}
          icon={<BookOpen className="h-6 w-6 text-blue-600" />}
          onClick={() => navigate('/faculty/courses')}
        />
        <DashboardCard
          title="My Students"
          value={enrolledStudents.length}
          icon={<Users className="h-6 w-6 text-teal-600" />}
          onClick={() => navigate('/faculty/students')}
        />
        <DashboardCard
          title="Assignments"
          value={facultyAssignments.length}
          icon={<FileText className="h-6 w-6 text-orange-600" />}
          onClick={() => navigate('/faculty/assignments')}
        />
        <DashboardCard
          title="Pending Grades"
          value={pendingGrades}
          icon={<CheckSquare className="h-6 w-6 text-purple-600" />}
          onClick={() => navigate('/faculty/grading')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">New Assignment Created</p>
                  <p className="text-sm text-gray-500">Midterm Project for Advanced Programming</p>
                  <p className="mt-1 text-xs text-gray-400">1 hour ago</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckSquare className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Attendance Updated</p>
                  <p className="text-sm text-gray-500">Database Management Systems - 10/15/2023</p>
                  <p className="mt-1 text-xs text-gray-400">3 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <BarChart2 className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Grades Updated</p>
                  <p className="text-sm text-gray-500">15 students graded for Quiz 2</p>
                  <p className="mt-1 text-xs text-gray-400">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Upcoming Deadlines</h2>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              {facultyAssignments.length > 0 ? (
                facultyAssignments
                  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                  .slice(0, 3)
                  .map((assignment, index) => {
                    const course = facultyCourses.find(c => c.id === assignment.courseId);
                    const daysLeft = Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                        <p className="text-sm font-medium text-gray-900">{assignment.title}</p>
                        <p className="text-sm text-gray-500">{course?.name}</p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-400">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            daysLeft < 2 ? 'bg-red-100 text-red-800' : 
                            daysLeft < 5 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {daysLeft <= 0 ? 'Overdue' : `${daysLeft} days left`}
                          </span>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <p className="text-sm text-gray-500">No upcoming deadlines</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;