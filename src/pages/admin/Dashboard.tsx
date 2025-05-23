import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCog, BookOpen, GraduationCap } from 'lucide-react';
import DashboardCard from '../../components/common/DashboardCard';
import { departments } from '../../data/mockData';
import { useDataContext } from '../../context/DataContext';

const AdminDashboard = () => {
  const { faculties, students, courses } = useDataContext();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const navigate = useNavigate();

  const filteredFaculties = selectedDepartment === 'All' 
    ? faculties 
    : faculties.filter(faculty => faculty.department === selectedDepartment);

  const filteredStudents = selectedDepartment === 'All' 
    ? students 
    : students.filter(student => student.department === selectedDepartment);

  const filteredCourses = selectedDepartment === 'All' 
    ? courses 
    : courses.filter(course => course.department === selectedDepartment);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex items-center">
          <label htmlFor="department" className="mr-2 text-gray-700">
            Department:
          </label>
          <select
            id="department"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="All">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Students"
          value={filteredStudents.length}
          icon={<GraduationCap className="h-6 w-6 text-blue-600" />}
          onClick={() => navigate('/admin/students')}
        />
        <DashboardCard
          title="Total Faculty"
          value={filteredFaculties.length}
          icon={<UserCog className="h-6 w-6 text-teal-600" />}
          onClick={() => navigate('/admin/faculty')}
        />
        <DashboardCard
          title="Total Courses"
          value={filteredCourses.length}
          icon={<BookOpen className="h-6 w-6 text-orange-600" />}
          onClick={() => navigate('/admin/courses')}
        />
        <DashboardCard
          title="Departments"
          value={departments.length}
          icon={<Users className="h-6 w-6 text-purple-600" />}
        />
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Updates</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserCog className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">New Faculty Member Added</p>
                  <p className="text-sm text-gray-500">Dr. Sarah Johnson joined the Computer Science department</p>
                  <p className="mt-1 text-xs text-gray-400">1 hour ago</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">New Course Approved</p>
                  <p className="text-sm text-gray-500">Advanced Machine Learning (CS-401) added to curriculum</p>
                  <p className="mt-1 text-xs text-gray-400">3 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Graduation Ceremony Scheduled</p>
                  <p className="text-sm text-gray-500">Spring 2023 graduation ceremony set for May 15</p>
                  <p className="mt-1 text-xs text-gray-400">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;