import React from 'react';
import CourseCard from '../components/CourseCard';
import { courses } from '../utils/data';
const Dashboard: React.FC = () => {
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Courses
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
        </div>
      </div>
      <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Welcome back, Alex!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Continue where you left off or explore new courses. Your learning
          journey awaits!
        </p>
        <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="mb-3 sm:mb-0">
            <h3 className="font-medium text-indigo-700 dark:text-indigo-300">
              Grade 10 Mathematics
            </h3>
            <p className="text-sm text-indigo-600 dark:text-indigo-400">
              Next lesson: Quadratic Equations
            </p>
          </div>
          <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Continue
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map(course => <CourseCard key={course.id} id={course.id} title={course.title} description={course.description} lessons={course.lessons} duration={course.duration} students={course.students} image={course.image} progress={course.progress} />)}
      </div>
    </div>;
};
export default Dashboard;