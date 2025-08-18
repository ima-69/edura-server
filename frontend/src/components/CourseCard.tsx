import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpenIcon, ClockIcon, UsersIcon } from 'lucide-react';
interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  lessons: number;
  duration: string;
  students: number;
  image?: string;
  progress?: number;
}
const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  lessons,
  duration,
  students,
  image,
  progress
}) => {
  return <Link to={`/course/${id}`} className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      {image && <div className="h-40 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {description}
        </p>
        {progress !== undefined && <div className="mb-3">
            <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{
            width: `${progress}%`
          }}></div>
            </div>
          </div>}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <BookOpenIcon className="h-4 w-4 mr-1" />
            <span>{lessons} lessons</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center">
            <UsersIcon className="h-4 w-4 mr-1" />
            <span>{students}</span>
          </div>
        </div>
      </div>
    </Link>;
};
export default CourseCard;