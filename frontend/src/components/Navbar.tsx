import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, UserIcon, ChevronDownIcon, LogOutIcon, MenuIcon } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
interface NavbarProps {
  onLogout: () => void;
  onMenuClick: () => void;
  userRole: 'student' | 'admin';
}
const Navbar: React.FC<NavbarProps> = ({
  onLogout,
  onMenuClick,
  userRole
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  return <header className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border shadow-sm transition-colors duration-200">
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border" onClick={onMenuClick}>
            <MenuIcon className="h-6 w-6" />
          </button>
          <div className="flex items-center ml-2 md:ml-0">
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              {userRole === 'admin' ? 'LMS Admin' : 'LMS'}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-border transition-colors">
            <BellIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div className="relative">
            <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-border transition-colors">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-200">
                {userRole === 'admin' ? 'Admin User' : 'Student Name'}
              </span>
              <ChevronDownIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            {profileMenuOpen && <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-md shadow-lg border border-gray-200 dark:border-dark-border z-10">
                <div className="py-1">
                  <Link to={userRole === 'admin' ? '/admin/settings' : '/profile'} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border" onClick={() => setProfileMenuOpen(false)}>
                    Profile Settings
                  </Link>
                  <button onClick={() => {
                setProfileMenuOpen(false);
                onLogout();
              }} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border">
                    <div className="flex items-center">
                      <LogOutIcon className="h-4 w-4 mr-2" />
                      Logout
                    </div>
                  </button>
                </div>
              </div>}
          </div>
        </div>
      </div>
    </header>;
};
export default Navbar;