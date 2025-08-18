import React, { useState, useRef } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, KeyIcon, UploadIcon, CheckCircleIcon, XCircleIcon, FileIcon, AlertCircleIcon, UsersIcon, CheckIcon, XIcon } from 'lucide-react';
import Button from '../../components/Button';
import { users, courses } from '../../utils/data';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
interface UserFormData {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  status: 'active' | 'inactive';
  assignedCourses: string[];
  paymentStatus: 'paid' | 'unpaid' | 'n/a';
}
interface ImportUserData {
  name: string;
  email: string;
  grade?: string;
  paymentStatus: 'paid' | 'unpaid';
  selected: boolean;
  error?: string;
  assignedCourses: string[];
}
const AdminUsers: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importStep, setImportStep] = useState<'upload' | 'preview' | 'result'>('upload');
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    id: '',
    name: '',
    email: '',
    role: 'student',
    status: 'active',
    assignedCourses: [],
    paymentStatus: 'unpaid'
  });
  const [importData, setImportData] = useState<ImportUserData[]>([]);
  const [fileName, setFileName] = useState('');
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: number;
    messages: {
      type: 'success' | 'error';
      message: string;
    }[];
  }>({
    success: 0,
    errors: 0,
    messages: []
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleOpenModal = (user: any = null) => {
    if (user) {
      setFormData({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        assignedCourses: user.assignedCourses || [],
        paymentStatus: user.paymentStatus
      });
      setEditingUser(user);
    } else {
      setFormData({
        id: `user${users.length + 1}`,
        name: '',
        email: '',
        role: 'student',
        status: 'active',
        assignedCourses: [],
        paymentStatus: 'unpaid'
      });
      setEditingUser(null);
    }
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
  const handleCourseChange = (courseId: string) => {
    setFormData(prev => {
      const courseIndex = prev.assignedCourses.indexOf(courseId);
      if (courseIndex > -1) {
        return {
          ...prev,
          assignedCourses: prev.assignedCourses.filter(id => id !== courseId)
        };
      } else {
        return {
          ...prev,
          assignedCourses: [...prev.assignedCourses, courseId]
        };
      }
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the user to a database
    alert(`User ${editingUser ? 'updated' : 'created'}: ${formData.name}`);
    handleCloseModal();
  };
  // Import functionality
  const handleOpenImportModal = () => {
    setIsImportModalOpen(true);
    setImportStep('upload');
    setImportData([]);
    setFileName('');
    setImportResults({
      success: 0,
      errors: 0,
      messages: []
    });
  };
  const handleCloseImportModal = () => {
    setIsImportModalOpen(false);
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: results => {
          processImportData(results.data);
        }
      });
    } else if (['xlsx', 'xls'].includes(fileExtension || '')) {
      const reader = new FileReader();
      reader.onload = e => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, {
          type: 'array'
        });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        processImportData(jsonData);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Please upload a CSV or Excel file');
    }
  };
  const processImportData = (data: any[]) => {
    const processedData: ImportUserData[] = data.map(row => {
      // Validate required fields
      const errors: string[] = [];
      if (!row.name && !row.Name) errors.push('Missing name');
      if (!row.email && !row.Email) errors.push('Missing email');
      // Normalize field names (handle different case variations)
      const name = row.name || row.Name || '';
      const email = row.email || row.Email || '';
      const grade = row.grade || row.Grade || '';
      const paymentStatus = (row.paymentStatus || row.PaymentStatus || 'unpaid').toLowerCase() === 'paid' ? 'paid' : 'unpaid';
      // Check for duplicate emails in the existing users
      if (email && users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
        errors.push('Email already exists');
      }
      return {
        name,
        email,
        grade,
        paymentStatus,
        selected: errors.length === 0,
        error: errors.length > 0 ? errors.join(', ') : undefined,
        assignedCourses: []
      };
    });
    setImportData(processedData);
    setImportStep('preview');
  };
  const toggleSelectUser = (index: number) => {
    setImportData(prev => {
      const newData = [...prev];
      newData[index].selected = !newData[index].selected;
      return newData;
    });
  };
  const toggleSelectAll = () => {
    const allSelected = importData.every(user => user.selected);
    setImportData(prev => prev.map(user => ({
      ...user,
      selected: !allSelected && !user.error
    })));
  };
  const handleCourseAssignment = (userIndex: number, courseId: string) => {
    setImportData(prev => {
      const newData = [...prev];
      const user = newData[userIndex];
      if (!user.assignedCourses.includes(courseId)) {
        user.assignedCourses = [...user.assignedCourses, courseId];
      } else {
        user.assignedCourses = user.assignedCourses.filter(id => id !== courseId);
      }
      return newData;
    });
  };
  const handleImportUsers = () => {
    // In a real app, this would send the data to the server
    const selectedUsers = importData.filter(user => user.selected && !user.error);
    const results = {
      success: selectedUsers.length,
      errors: importData.filter(user => user.error).length,
      messages: [] as {
        type: 'success' | 'error';
        message: string;
      }[]
    };
    if (selectedUsers.length > 0) {
      results.messages.push({
        type: 'success',
        message: `Successfully imported ${selectedUsers.length} users.`
      });
    }
    if (results.errors > 0) {
      results.messages.push({
        type: 'error',
        message: `${results.errors} users had validation errors and were skipped.`
      });
    }
    // Check for users with payment status "unpaid" but assigned courses
    const unpaidWithCourses = selectedUsers.filter(user => user.paymentStatus === 'unpaid' && user.assignedCourses.length > 0);
    if (unpaidWithCourses.length > 0) {
      results.messages.push({
        type: 'error',
        message: `${unpaidWithCourses.length} unpaid users have courses assigned. Payment verification required.`
      });
    }
    setImportResults(results);
    setImportStep('result');
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          User Management
        </h1>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleOpenImportModal}>
            <UploadIcon className="h-4 w-4 mr-2" />
            Import Users
          </Button>
          <Button onClick={() => handleOpenModal()}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
            <thead className="bg-gray-50 dark:bg-dark-border">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Courses
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Payment
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-dark-border">
              {users.map(user => <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {user.assignedCourses?.length || 0} courses
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.paymentStatus === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : user.paymentStatus === 'unpaid' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                      {user.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleOpenModal(user)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <PencilIcon className="h-5 w-5" />
                        <span className="sr-only">Edit</span>
                      </button>
                      <button className="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300">
                        <KeyIcon className="h-5 w-5" />
                        <span className="sr-only">Reset Password</span>
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        <TrashIcon className="h-5 w-5" />
                        <span className="sr-only">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
      {/* User Form Modal */}
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
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-dark-bg text-gray-900 dark:text-white" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address
                    </label>
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-dark-bg text-gray-900 dark:text-white" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Role
                      </label>
                      <select id="role" name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-dark-bg text-gray-900 dark:text-white">
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Status
                      </label>
                      <select id="status" name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-dark-bg text-gray-900 dark:text-white">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  {formData.role === 'student' && <>
                      <div>
                        <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Payment Status
                        </label>
                        <select id="paymentStatus" name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-dark-bg text-gray-900 dark:text-white">
                          <option value="unpaid">Unpaid</option>
                          <option value="paid">Paid</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Assigned Courses
                        </label>
                        <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-dark-bg">
                          {courses.map(course => <div key={course.id} className="flex items-center py-1">
                              <input type="checkbox" id={`course-${course.id}`} checked={formData.assignedCourses.includes(course.id)} onChange={() => handleCourseChange(course.id)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                              <label htmlFor={`course-${course.id}`} className="ml-2 block text-sm text-gray-900 dark:text-white">
                                {course.title}
                              </label>
                            </div>)}
                        </div>
                      </div>
                    </>}
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <Button type="submit">
                      {editingUser ? 'Save Changes' : 'Create User'}
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
      {/* Import Users Modal */}
      {isImportModalOpen && <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white dark:bg-dark-card rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white dark:bg-dark-card px-4 pt-5 pb-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                    Import Users
                  </h3>
                  <button type="button" onClick={handleCloseImportModal} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                    <span className="sr-only">Close</span>
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>
                {/* Upload Step */}
                {importStep === 'upload' && <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-dark-border p-4 rounded-md">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <FileIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            Upload CSV or Excel File
                          </h3>
                          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <p>
                              File should contain columns for name, email,
                              grade, and payment status.
                            </p>
                            <p className="mt-1">
                              Example format:
                              <code className="ml-1 px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                Name,Email,Grade,PaymentStatus
                              </code>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-dark-bg rounded-md font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 focus-within:outline-none">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" ref={fileInputRef} accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          CSV, XLSX or XLS up to 10MB
                        </p>
                      </div>
                    </div>
                    {fileName && <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                        <div className="flex items-center">
                          <FileIcon className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-2" />
                          <span className="text-sm text-indigo-700 dark:text-indigo-300">
                            {fileName}
                          </span>
                        </div>
                      </div>}
                    <div className="flex justify-end mt-4">
                      <Button type="button" variant="secondary" onClick={handleCloseImportModal} className="mr-3">
                        Cancel
                      </Button>
                      <Button type="button" disabled={!fileName} onClick={() => fileInputRef.current?.click()}>
                        {fileName ? 'Change File' : 'Select File'}
                      </Button>
                    </div>
                  </div>}
                {/* Preview Step */}
                {importStep === 'preview' && <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertCircleIcon className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                            Preview Data
                          </h3>
                          <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                            <p>
                              Review the data below before importing. You can
                              deselect rows with errors or that you don't want
                              to import.
                            </p>
                            <p className="mt-1">
                              Only users with payment status "paid" can be
                              assigned courses.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-dark-border">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                <div className="flex items-center">
                                  <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={importData.length > 0 && importData.every(user => user.selected || user.error)} onChange={toggleSelectAll} />
                                  <span className="ml-2">Select</span>
                                </div>
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Name
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Email
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Grade
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Payment
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
                            {importData.map((user, index) => <tr key={index} className={user.error ? 'bg-red-50 dark:bg-red-900/10' : ''}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <input type="checkbox" disabled={!!user.error} checked={user.selected} onChange={() => toggleSelectUser(index)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                  {user.name || <span className="text-red-500 dark:text-red-400">
                                      Missing
                                    </span>}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {user.email || <span className="text-red-500 dark:text-red-400">
                                      Missing
                                    </span>}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {user.grade || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.paymentStatus === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                    {user.paymentStatus}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {user.error ? <div className="flex items-center">
                                      <XCircleIcon className="h-5 w-5 text-red-500 dark:text-red-400 mr-1" />
                                      <span className="text-xs text-red-500 dark:text-red-400">
                                        {user.error}
                                      </span>
                                    </div> : <div className="flex items-center">
                                      <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400 mr-1" />
                                      <span className="text-xs text-green-500 dark:text-green-400">
                                        Valid
                                      </span>
                                    </div>}
                                </td>
                              </tr>)}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* Course Assignment Section */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Assign Courses (Only for Paid Users)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {importData.filter(user => user.selected && !user.error && user.paymentStatus === 'paid').map((user, userIndex) => <div key={userIndex} className="border border-gray-200 dark:border-gray-700 rounded-md p-3">
                              <div className="font-medium text-sm text-gray-900 dark:text-white mb-2">
                                {user.name} ({user.email})
                              </div>
                              <div className="space-y-1 max-h-32 overflow-y-auto">
                                {courses.map(course => <div key={course.id} className="flex items-center">
                                    <input type="checkbox" id={`user-${userIndex}-course-${course.id}`} checked={user.assignedCourses.includes(course.id)} onChange={() => handleCourseAssignment(importData.findIndex(u => u.email === user.email), course.id)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                                    <label htmlFor={`user-${userIndex}-course-${course.id}`} className="ml-2 block text-xs text-gray-800 dark:text-gray-200">
                                      {course.title}
                                    </label>
                                  </div>)}
                              </div>
                            </div>)}
                        {importData.filter(user => user.selected && !user.error && user.paymentStatus === 'paid').length === 0 && <div className="col-span-2 text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                            No paid users selected for course assignment
                          </div>}
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button type="button" variant="secondary" onClick={() => setImportStep('upload')} className="mr-3">
                        Back
                      </Button>
                      <Button type="button" onClick={handleImportUsers} disabled={importData.filter(user => user.selected && !user.error).length === 0}>
                        Import Users
                      </Button>
                    </div>
                  </div>}
                {/* Result Step */}
                {importStep === 'result' && <div className="space-y-4">
                    <div className="text-center py-4">
                      {importResults.success > 0 ? <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30">
                          <CheckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div> : <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30">
                          <XIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>}
                      <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                        Import Complete
                      </h3>
                      <div className="mt-2 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Successfully imported {importResults.success} users.
                          {importResults.errors > 0 && ` ${importResults.errors} users had errors.`}
                        </p>
                      </div>
                    </div>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-md divide-y divide-gray-200 dark:divide-gray-700">
                      {importResults.messages.map((message, index) => <div key={index} className={`p-4 flex ${message.type === 'error' ? 'bg-red-50 dark:bg-red-900/10' : 'bg-green-50 dark:bg-green-900/10'}`}>
                          {message.type === 'error' ? <XCircleIcon className="h-5 w-5 text-red-400 dark:text-red-500 mr-3" /> : <CheckCircleIcon className="h-5 w-5 text-green-400 dark:text-green-500 mr-3" />}
                          <p className={`text-sm ${message.type === 'error' ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}>
                            {message.message}
                          </p>
                        </div>)}
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button type="button" onClick={handleCloseImportModal}>
                        Close
                      </Button>
                    </div>
                  </div>}
              </div>
            </div>
          </div>
        </div>}
    </div>;
};
export default AdminUsers;