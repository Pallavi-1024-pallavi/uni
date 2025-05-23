import { User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

interface ProfileDropdownProps {
  profilePath: string;
  onLogout: () => void;
  onClose: () => void;
}

const ProfileDropdown = ({ profilePath, onLogout, onClose }: ProfileDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div 
      ref={dropdownRef}
      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="user-menu-button"
      tabIndex={-1}
    >
      <Link
        to={profilePath}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        role="menuitem"
        tabIndex={-1}
        id="user-menu-item-0"
        onClick={onClose}
      >
        <div className="flex items-center">
          <User className="mr-2 h-4 w-4" />
          My Profile
        </div>
      </Link>
      <button
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        role="menuitem"
        tabIndex={-1}
        id="user-menu-item-2"
        onClick={() => {
          onLogout();
          onClose();
        }}
      >
        <div className="flex items-center">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </div>
      </button>
    </div>
  );
};

export default ProfileDropdown;