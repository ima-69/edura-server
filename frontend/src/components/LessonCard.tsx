import React from 'react';
import { PlayIcon, LockIcon, CheckIcon } from 'lucide-react';
interface LessonCardProps {
  title: string;
  duration: string;
  isCompleted?: boolean;
  isLocked?: boolean;
  onClick: () => void;
  active?: boolean;
}
const LessonCard: React.FC<LessonCardProps> = ({
  title,
  duration,
  isCompleted = false,
  isLocked = false,
  onClick,
  active = false
}) => {
  return <button onClick={onClick} disabled={isLocked} className={`w-full flex items-center justify-between p-4 rounded-lg mb-2 transition-colors ${active ? 'bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-indigo-500' : isLocked ? 'bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed' : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'} border border-gray-200 dark:border-gray-700`}>
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${isCompleted ? 'bg-green-100 dark:bg-green-900/30' : isLocked ? 'bg-gray-100 dark:bg-gray-700' : 'bg-indigo-100 dark:bg-indigo-900/30'}`}>
          {isCompleted ? <CheckIcon className="h-4 w-4 text-green-600 dark:text-green-400" /> : isLocked ? <LockIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" /> : <PlayIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
        </div>
        <div className="text-left">
          <h4 className={`font-medium ${isLocked ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
            {title}
          </h4>
        </div>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{duration}</div>
    </button>;
};
export default LessonCard;