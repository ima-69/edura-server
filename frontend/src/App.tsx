import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Course from './pages/Course';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCourses from './pages/admin/AdminCourses';
import AdminLessons from './pages/admin/AdminLessons';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';
export function App() {
  // Mock authentication state - in a real app, this would come from a proper auth system
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'admin'>('student');
  const handleLogin = (role: 'student' | 'admin' = 'student') => {
    setIsAuthenticated(true);
    setUserRole(role);
  };
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('student');
  };
  // Admin route protection
  const AdminRoute = ({
    children
  }: {
    children: React.ReactNode;
  }) => {
    return isAuthenticated && userRole === 'admin' ? <>{children}</> : <Navigate to="/dashboard" />;
  };
  return <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to={userRole === 'admin' ? '/admin/dashboard' : '/dashboard'} />} />
          <Route path="/register" element={!isAuthenticated ? <Register onRegister={handleLogin} /> : <Navigate to={userRole === 'admin' ? '/admin/dashboard' : '/dashboard'} />} />
          {/* Student Routes */}
          <Route path="/" element={isAuthenticated ? <Layout onLogout={handleLogout} userRole={userRole} /> : <Navigate to="/login" />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="course/:id" element={<Course />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute>
                <AdminLayout onLogout={handleLogout} />
              </AdminRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="lessons/:courseId" element={<AdminLessons />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>;
}