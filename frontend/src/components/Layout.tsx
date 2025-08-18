import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
interface LayoutProps {
  onLogout: () => void;
  userRole: 'student' | 'admin';
}
const Layout: React.FC<LayoutProps> = ({
  onLogout,
  userRole
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return <div className="flex h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-200">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}>
        <div className="absolute inset-0 bg-gray-600 dark:bg-black opacity-75"></div>
      </div>
      <div className={`fixed inset-y-0 left-0 z-40 w-64 transition duration-300 transform bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute top-0 right-0 -mr-12 pt-2 md:hidden">
          <button className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" onClick={() => setSidebarOpen(false)}>
            <span className="sr-only">Close sidebar</span>
            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <Sidebar userRole={userRole} />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar onLogout={onLogout} onMenuClick={() => setSidebarOpen(true)} userRole={userRole} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>;
};
export default Layout;