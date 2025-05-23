import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Menu, LogOut, Book, Users, GraduationCap, Calendar, FileText, ClipboardList } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
  const { currentUser, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const getNavLinks = () => {
    switch (role) {
      case 'admin':
        return [
          { path: '/admin', label: 'Dashboard', icon: <GraduationCap className="w-5 h-5" /> },
          { path: '/admin/faculty', label: 'Faculty', icon: <Users className="w-5 h-5" /> },
          { path: '/admin/students', label: 'Students', icon: <Users className="w-5 h-5" /> },
          { path: '/admin/courses', label: 'Courses', icon: <Book className="w-5 h-5" /> },
          { path: '/admin/assign-students', label: 'Assign Students', icon: <ClipboardList className="w-5 h-5" /> },
        ];
      case 'faculty':
        return [
          { path: '/faculty', label: 'Dashboard', icon: <GraduationCap className="w-5 h-5" /> },
          { path: '/faculty/courses', label: 'Courses', icon: <Book className="w-5 h-5" /> },
          { path: '/faculty/students', label: 'Students', icon: <Users className="w-5 h-5" /> },
        ];
      case 'student':
        return [
          { path: '/student', label: 'Dashboard', icon: <GraduationCap className="w-5 h-5" /> },
          { path: '/student/courses', label: 'Available Courses', icon: <Book className="w-5 h-5" /> },
          { path: '/student/enrolled-courses', label: 'My Courses', icon: <ClipboardList className="w-5 h-5" /> },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const profilePath = role === 'admin' 
    ? '/admin/profile' 
    : role === 'faculty' 
      ? '/faculty/profile' 
      : '/student/profile';

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to={role ? `/${role}` : '/'} className="text-2xl font-bold text-blue-600">
                EduMaster
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === link.path
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-1">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={toggleProfileDropdown}
                  className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  {currentUser?.profileImage ? (
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={currentUser.profileImage}
                      alt={currentUser.name}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                </button>
              </div>
              {profileDropdownOpen && (
                <ProfileDropdown 
                  profilePath={profilePath} 
                  onLogout={handleLogout}
                  onClose={() => setProfileDropdownOpen(false)}
                />
              )}
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  location.pathname === link.path
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </div>
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                {currentUser?.profileImage ? (
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={currentUser.profileImage}
                    alt={currentUser.name}
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{currentUser?.name}</div>
                <div className="text-sm font-medium text-gray-500">{currentUser?.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                to={profilePath}
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  My Profile
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <LogOut className="mr-2 h-5 w-5" />
                  Sign out
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;