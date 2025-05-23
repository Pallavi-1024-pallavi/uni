import { GraduationCap, UserCog, BookOpen, GraduationCap as StudentIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

interface RoleSelectionProps {
  onLogin: () => void;
}

const RoleSelection = ({ onLogin }: RoleSelectionProps) => {
  const { setDemoRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    setDemoRole(role);
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <GraduationCap className="h-16 w-16 text-blue-600 mx-auto" />
        <h1 className="mt-4 text-4xl font-bold text-gray-900">
          Welcome to EduMaster
        </h1>
        <p className="mt-2 text-xl text-gray-600">
          University Management System
        </p>
      </div>

      <div className="max-w-5xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">Select a role to continue</h2>
          <p className="mt-2 text-gray-600">
            Choose one of the following roles to explore the system features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-500"
            onClick={() => handleRoleSelect('admin')}
          >
            <div className="flex flex-col items-center">
              <div className="p-4 bg-blue-100 rounded-full">
                <UserCog className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Admin</h3>
              <p className="mt-2 text-center text-gray-600">
                Manage faculty, students, courses, and system settings
              </p>
              <button
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                onClick={() => handleRoleSelect('admin')}
              >
                Continue as Admin
              </button>
            </div>
          </div>

          <div 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-teal-500"
            onClick={() => handleRoleSelect('faculty')}
          >
            <div className="flex flex-col items-center">
              <div className="p-4 bg-teal-100 rounded-full">
                <BookOpen className="h-10 w-10 text-teal-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Faculty</h3>
              <p className="mt-2 text-center text-gray-600">
                Manage courses, attendance, assignments, and grade students
              </p>
              <button
                className="mt-6 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md"
                onClick={() => handleRoleSelect('faculty')}
              >
                Continue as Faculty
              </button>
            </div>
          </div>

          <div 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-orange-500"
            onClick={() => handleRoleSelect('student')}
          >
            <div className="flex flex-col items-center">
              <div className="p-4 bg-orange-100 rounded-full">
                <StudentIcon className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Student</h3>
              <p className="mt-2 text-center text-gray-600">
                View courses, attendance, assignments, and grades
              </p>
              <button
                className="mt-6 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md"
                onClick={() => handleRoleSelect('student')}
              >
                Continue as Student
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onLogin}
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            Have an account? Sign in here
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;