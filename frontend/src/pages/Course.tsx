import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpenIcon, ClockIcon, UsersIcon, ChevronLeftIcon, ChevronRightIcon, ArrowLeftIcon } from 'lucide-react';
import { courses, lessons } from '../utils/data';
import LessonCard from '../components/LessonCard';
import VideoPlayer from '../components/VideoPlayer';
import Button from '../components/Button';
const Course: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const [course, setCourse] = useState<any>(null);
  const [courseLessons, setCourseLessons] = useState<any[]>([]);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  useEffect(() => {
    // Find the course by id
    const foundCourse = courses.find(c => c.id === id);
    if (foundCourse) {
      setCourse(foundCourse);
      // Get lessons for this course
      const foundLessons = lessons[id as keyof typeof lessons] || [];
      setCourseLessons(foundLessons);
      // Set first unlocked lesson as active by default
      const firstUnlockedIndex = foundLessons.findIndex(lesson => !lesson.isLocked);
      if (firstUnlockedIndex !== -1) {
        setActiveLesson(foundLessons[firstUnlockedIndex]);
        setActiveLessonIndex(firstUnlockedIndex);
      }
    }
  }, [id]);
  const navigateToLesson = (direction: 'next' | 'prev') => {
    const newIndex = direction === 'next' ? activeLessonIndex + 1 : activeLessonIndex - 1;
    if (newIndex >= 0 && newIndex < courseLessons.length && !courseLessons[newIndex].isLocked) {
      setActiveLesson(courseLessons[newIndex]);
      setActiveLessonIndex(newIndex);
    }
  };
  // Extract YouTube ID from URL
  const getYoutubeId = (url: string): string => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : '';
  };
  if (!course) {
    return <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">
          Loading course...
        </div>
      </div>;
  }
  return <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link to="/dashboard" className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>
      <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {course.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {course.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <BookOpenIcon className="h-5 w-5 mr-2" />
              <span>{course.lessons} lessons</span>
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <ClockIcon className="h-5 w-5 mr-2" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <UsersIcon className="h-5 w-5 mr-2" />
              <span>{course.students} students</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lesson content area */}
        <div className="lg:col-span-2">
          {activeLesson ? <div className="space-y-4">
              <VideoPlayer youtubeId={getYoutubeId(activeLesson.videoUrl)} title={activeLesson.title} />
              <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {activeLesson.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {activeLesson.description}
                </p>
                {/* Next/Previous navigation */}
                <div className="flex flex-col sm:flex-row justify-between pt-4 border-t border-gray-100 dark:border-dark-border">
                  <Button variant="outline" onClick={() => navigateToLesson('prev')} disabled={activeLessonIndex === 0 || courseLessons[activeLessonIndex - 1]?.isLocked} className="mb-2 sm:mb-0">
                    <ChevronLeftIcon className="h-4 w-4 mr-2" />
                    Previous Lesson
                  </Button>
                  <Button variant="primary" onClick={() => navigateToLesson('next')} disabled={activeLessonIndex === courseLessons.length - 1 || courseLessons[activeLessonIndex + 1]?.isLocked}>
                    Next Lesson
                    <ChevronRightIcon className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div> : <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Select a lesson to start learning
                </p>
                <Button variant="outline">Start First Lesson</Button>
              </div>
            </div>}
        </div>
        {/* Lesson list sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-sm border border-gray-200 dark:border-dark-border">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Course Content
            </h3>
            <div className="space-y-2">
              {courseLessons.map((lesson, index) => <LessonCard key={lesson.id} title={lesson.title} duration={lesson.duration} isCompleted={lesson.isCompleted} isLocked={lesson.isLocked} active={activeLesson && activeLesson.id === lesson.id} onClick={() => {
              if (!lesson.isLocked) {
                setActiveLesson(lesson);
                setActiveLessonIndex(index);
              }
            }} />)}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Course;