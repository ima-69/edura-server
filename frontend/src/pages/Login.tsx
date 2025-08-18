import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon } from 'lucide-react';
interface LoginProps {
  onLogin: (role: 'student' | 'admin') => void;
}
const Login: React.FC<LoginProps> = ({
  onLogin
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const {
    theme,
    toggleTheme
  } = useTheme();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    // Mock login - in a real app, you would validate credentials with an API
    if (email === 'admin@example.com' && password === 'admin') {
      onLogin('admin');
    } else if (email === 'demo@example.com' && password === 'password') {
      onLogin('student');
    } else {
      setError('Invalid credentials. Try demo@example.com / password or admin@example.com / admin');
    }
  };
  return <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-bg transition-colors duration-200">
      <div className="absolute top-4 right-4">
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-border transition-colors" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          {theme === 'light' ? <MoonIcon className="h-5 w-5 text-gray-600" /> : <SunIcon className="h-5 w-5 text-yellow-300" />}
        </button>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-center text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              Learning MS
            </h1>
            <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
              Or{' '}
              <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                create a new account
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-md text-sm">
                {error}
              </div>}
            <div className="space-y-4">
              <Input label="Email address" type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your.email@example.com" required fullWidth />
              <Input label="Password" type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required fullWidth />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                  Forgot your password?
                </a>
              </div>
            </div>
            <div>
              <Button type="submit" fullWidth>
                Sign in
              </Button>
            </div>
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Demo credentials:
              <br />
              Student: demo@example.com / password
              <br />
              Admin: admin@example.com / admin
            </div>
          </form>
        </div>
      </div>
    </div>;
};
export default Login;