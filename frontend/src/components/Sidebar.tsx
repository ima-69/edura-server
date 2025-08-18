import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, UserIcon, SettingsIcon, UsersIcon, FolderIcon } from 'lucide-react';
interface SidebarProps {
  userRole: 'student' | 'admin';
}
const Sidebar: React.FC<SidebarProps> = ({
  userRole
}) => {
  return <aside className="flex flex-col h-full bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border transition-colors duration-200">
      <div className="p-4 border-b border-gray-200 dark:border-dark-border">
        <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
          {userRole === 'admin' ? 'Admin Panel' : 'Learning MS'}
        </h1>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        {userRole === 'admin' ? <ul className="space-y-2">
            <li>
              <NavLink to="/admin/dashboard" className={({
            isActive
          }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'}`}>
                <HomeIcon className="h-5 w-5 mr-3" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/courses" className={({
            isActive
          }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'}`}>
                <FolderIcon className="h-5 w-5 mr-3" />
                <span>Courses</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/users" className={({
            isActive
          }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'}`}>
                <UsersIcon className="h-5 w-5 mr-3" />
                <span>Users</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/settings" className={({
            isActive
          }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'}`}>
                <SettingsIcon className="h-5 w-5 mr-3" />
                <span>Settings</span>
              </NavLink>
            </li>
          </ul> : <ul className="space-y-2">
            <li>
              <NavLink to="/dashboard" className={({
            isActive
          }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'}`}>
                <HomeIcon className="h-5 w-5 mr-3" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                My Learning
              </div>
              <ul className="mt-1 space-y-1">
                <li>
                  <NavLink to="/course/grade-10" className={({
                isActive
              }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'}`}>
                    <BookOpenIcon className="h-5 w-5 mr-3" />
                    <span>Grade 10</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/course/grade-11" className={({
                isActive
              }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'}`}>
                    <BookOpenIcon className="h-5 w-5 mr-3" />
                    <span>Grade 11</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/course/grade-12" className={({
                isActive
              }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'}`}>
                    <BookOpenIcon className="h-5 w-5 mr-3" />
                    <span>Grade 12</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/course/grade-14" className={({
                isActive
              }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'}`}>
                    <BookOpenIcon className="h-5 w-5 mr-3" />
                    <span>Grade 14</span>
                  </NavLink>
                </li>
              </ul>
            </li>
            <li>
              <NavLink to="/profile" className={({
            isActive
          }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'}`}>
                <UserIcon className="h-5 w-5 mr-3" />
                <span>Profile</span>
              </NavLink>
            </li>
          </ul>}
      </nav>
    </aside>;
};
export default Sidebar;