import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon, ArrowLeftIcon, YoutubeIcon, FileTextIcon } from 'lucide-react';
import Button from '../../components/Button';
import { courses, lessons } from '../../utils/data';
interface LessonFormData {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  description: string;
  notes: string;
  isLocked: boolean;
}
const AdminLessons: React.FC = () => {
  const {
    courseId
  } = useParams<{
    courseId: string;
  }>();
  const [course, setCourse] = useState<any>(null);
  const [courseLessons, setCourseLessons] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any | null>(null);
  const [formData, setFormData] = useState<LessonFormData>({
    id: '',
    title: '',
    duration: '',
    videoUrl: '',
    description: '',
    notes: '',
    isLocked: false
  });
  useEffect(() => {
    // Find course and its lessons
    const foundCourse = courses.find(c => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
      const foundLessons = lessons[courseId as keyof typeof lessons] || [];
      setCourseLessons(foundLessons);
    }
  }, [courseId]);
  const handleOpenModal = (lesson: any = null) => {
    if (lesson) {
      setFormData({
        id: lesson.id,
        title: lesson.title,
        duration: lesson.duration,
        videoUrl: lesson.videoUrl,
        description: lesson.description,
        notes: lesson.notes || '',
        isLocked: lesson.isLocked
      });
      setEditingLesson(lesson);
    } else {
      setFormData({
        id: `${courseId}-lesson${courseLessons.length + 1}`,
        title: '',
        duration: '',
        videoUrl: '',
        description: '',
        notes: '',
        isLocked: false
      });
      setEditingLesson(null);
    }
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLesson(null);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value,
      type
    } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the lesson to a database
    alert(`Lesson ${editingLesson ? 'updated' : 'created'}: ${formData.title}`);
    handleCloseModal();
  };
  if (!course) {
    return <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        Loading...
      </div>;
  }
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/admin/courses" className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-2">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Courses
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {course.title} - Lessons
          </h1>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Lesson
        </Button>
      </div>
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
            <thead className="bg-gray-50 dark:bg-dark-border">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Lesson
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Content
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-dark-border">
              {courseLessons.map((lesson, index) => <tr key={lesson.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {lesson.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {lesson.duration}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${lesson.isLocked ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'}`}>
                      {lesson.isLocked ? 'Locked' : 'Unlocked'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {lesson.videoUrl && <span className="inline-flex items-center text-blue-600 dark:text-blue-400">
                          <YoutubeIcon className="h-4 w-4 mr-1" />
                          Video
                        </span>}
                      {lesson.notes && <span className="inline-flex items-center text-green-600 dark:text-green-400">
                          <FileTextIcon className="h-4 w-4 mr-1" />
                          Notes
                        </span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleOpenModal(lesson)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <PencilIcon className="h-5 w-5" />
                        <span className="sr-only">Edit</span>
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        <TrashIcon className="h-5 w-5" />
                        <span className="sr-only">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>)}
              {courseLessons.length === 0 && <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No lessons found. Add your first lesson.
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>
      {/* Lesson Form Modal */}
      {isModalOpen && <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white dark:bg-dark-card rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-dark-card px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                  {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Title
                    </label>
                    <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-dark-bg text-gray-900 dark:text-white" required />
                  </div>
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Duration
                    </label>
                    <input type="text" name="duration" id="duration" value={formData.duration} onChange={handleChange} placeholder="e.g. 45 min" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-dark-bg text-gray-900 dark:text-white" required />
                  </div>
                  <div>
                    <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      YouTube Video URL
                    </label>
                    <input type="url" name="videoUrl" id="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="https://www.youtube.com/watch?v=..." className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-dark-bg text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <textarea name="description" id="description" rows={3} value={formData.description} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-dark-bg text-gray-900 dark:text-white" required></textarea>
                  </div>
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Additional Notes (optional)
                    </label>
                    <textarea name="notes" id="notes" rows={2} value={formData.notes} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-dark-bg text-gray-900 dark:text-white"></textarea>
                  </div>
                  <div className="flex items-center">
                    <input id="isLocked" name="isLocked" type="checkbox" checked={formData.isLocked} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                    <label htmlFor="isLocked" className="ml-2 block text-sm text-gray-900 dark:text-white">
                      Lock this lesson (requires payment or admin approval)
                    </label>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <Button type="submit">
                      {editingLesson ? 'Save Changes' : 'Create Lesson'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleCloseModal}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};
export default AdminLessons;