import React, { useState } from 'react';
import Button from '../../components/Button';
import { PaletteIcon, ImageIcon, CameraIcon, UserIcon } from 'lucide-react';
import Input from '../../components/Input';
interface PersonalSettingsData {
  name: string;
  email: string;
  phone: string;
  designation: string;
  avatar?: string;
}
interface SystemSettingsData {
  siteName: string;
  siteDescription: string;
  primaryColor: string;
  logoUrl: string;
  watermarkText: string;
  enableWatermark: boolean;
}
const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'personal' | 'system'>('personal');
  const [personalData, setPersonalData] = useState<PersonalSettingsData>({
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+1 (555) 123-4567',
    designation: 'System Administrator',
    avatar: ''
  });
  const [systemData, setSystemData] = useState<SystemSettingsData>({
    siteName: 'Learning Management System',
    siteDescription: 'A modern platform for online education',
    primaryColor: '#6366F1',
    logoUrl: '',
    watermarkText: 'Learning MS',
    enableWatermark: true
  });
  // Validation states
  const [errors, setErrors] = useState({
    email: '',
    phone: ''
  });
  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setPersonalData(prev => ({
      ...prev,
      [name]: value
    }));
    // Validate on change
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value) && value) {
        setErrors(prev => ({
          ...prev,
          email: 'Please enter a valid email address'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          email: ''
        }));
      }
    }
    if (name === 'phone') {
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      if (!phoneRegex.test(value) && value) {
        setErrors(prev => ({
          ...prev,
          phone: 'Please enter a valid phone number'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          phone: ''
        }));
      }
    }
  };
  const handleSystemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value,
      type
    } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setSystemData(prev => ({
      ...prev,
      [name]: val
    }));
  };
  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate before submission
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    const newErrors = {
      email: !emailRegex.test(personalData.email) ? 'Please enter a valid email address' : '',
      phone: !phoneRegex.test(personalData.phone) ? 'Please enter a valid phone number' : ''
    };
    setErrors(newErrors);
    if (!newErrors.email && !newErrors.phone) {
      // In a real app, this would save the settings to a database
      alert('Personal settings saved successfully!');
    }
  };
  const handleSystemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the settings to a database
    alert('System settings saved successfully!');
  };
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload the file to a server
      // For now, we'll create a local URL
      const reader = new FileReader();
      reader.onload = () => {
        setPersonalData(prev => ({
          ...prev,
          avatar: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  return <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button onClick={() => setActiveTab('personal')} className={`py-4 px-6 font-medium text-sm focus:outline-none ${activeTab === 'personal' ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
          Personal Settings
        </button>
        <button onClick={() => setActiveTab('system')} className={`py-4 px-6 font-medium text-sm focus:outline-none ${activeTab === 'system' ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
          System Settings
        </button>
      </div>

      {/* Personal Settings */}
      {activeTab === 'personal' && <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden p-6">
          <form onSubmit={handlePersonalSubmit} className="space-y-8">
            {/* Avatar section */}
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden relative">
                {personalData.avatar ? <img src={personalData.avatar} alt="User avatar" className="w-full h-full object-cover" /> : <UserIcon className="h-10 w-10 text-gray-400" />}
                <label htmlFor="avatar-upload" className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <CameraIcon className="h-8 w-8 text-white" />
                  <input type="file" id="avatar-upload" className="sr-only" accept="image/*" onChange={handleAvatarUpload} />
                </label>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Profile Picture
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  JPG or PNG. Max size of 1MB
                </p>
                <div className="flex space-x-2">
                  <label htmlFor="avatar-upload-btn" className="cursor-pointer">
                    <Button variant="outline" size="sm">
                      <CameraIcon className="h-4 w-4 mr-2" />
                      Change
                      <input type="file" id="avatar-upload-btn" className="sr-only" accept="image/*" onChange={handleAvatarUpload} />
                    </Button>
                  </label>
                  <Button variant="ghost" size="sm" onClick={() => setPersonalData(prev => ({
                ...prev,
                avatar: ''
              }))} type="button">
                    Remove
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <Input label="Full Name" name="name" value={personalData.name} onChange={handlePersonalChange} placeholder="Your full name" required fullWidth />
                </div>
                <div className="sm:col-span-4">
                  <Input label="Email Address" type="email" name="email" value={personalData.email} onChange={handlePersonalChange} placeholder="admin@example.com" required fullWidth error={errors.email} />
                </div>
                <div className="sm:col-span-4">
                  <Input label="Phone Number" name="phone" value={personalData.phone} onChange={handlePersonalChange} placeholder="+1 (555) 123-4567" fullWidth error={errors.phone} />
                </div>
                <div className="sm:col-span-4">
                  <Input label="Designation" name="designation" value={personalData.designation} onChange={handlePersonalChange} placeholder="System Administrator" fullWidth />
                </div>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <Button type="button" variant="outline" className="mr-3">
                  Cancel
                </Button>
                <Button type="submit">Save Settings</Button>
              </div>
            </div>
          </form>
        </div>}

      {/* System Settings */}
      {activeTab === 'system' && <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden p-6">
          <form onSubmit={handleSystemSubmit} className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                General Settings
              </h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Site Name
                  </label>
                  <div className="mt-1">
                    <input type="text" name="siteName" id="siteName" value={systemData.siteName} onChange={handleSystemChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-bg text-gray-900 dark:text-white" />
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Site Description
                  </label>
                  <div className="mt-1">
                    <textarea id="siteDescription" name="siteDescription" rows={3} value={systemData.siteDescription} onChange={handleSystemChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-bg text-gray-900 dark:text-white"></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Branding
              </h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Primary Color
                  </label>
                  <div className="mt-1 flex items-center">
                    <input type="color" name="primaryColor" id="primaryColor" value={systemData.primaryColor} onChange={handleSystemChange} className="h-8 w-8 rounded-full overflow-hidden" />
                    <input type="text" value={systemData.primaryColor} onChange={handleSystemChange} name="primaryColor" className="ml-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-bg text-gray-900 dark:text-white" />
                    <PaletteIcon className="ml-2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Logo URL
                  </label>
                  <div className="mt-1 flex items-center">
                    <input type="text" name="logoUrl" id="logoUrl" value={systemData.logoUrl} onChange={handleSystemChange} placeholder="https://example.com/logo.png" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-bg text-gray-900 dark:text-white" />
                    <div className="ml-4">
                      <Button type="button" variant="outline" size="sm">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Recommended size: 200x50 pixels
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Content Security
              </h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="watermarkText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Video Watermark Text
                  </label>
                  <div className="mt-1">
                    <input type="text" name="watermarkText" id="watermarkText" value={systemData.watermarkText} onChange={handleSystemChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-bg text-gray-900 dark:text-white" />
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="enableWatermark" name="enableWatermark" type="checkbox" checked={systemData.enableWatermark} onChange={handleSystemChange} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="enableWatermark" className="font-medium text-gray-700 dark:text-gray-300">
                        Enable video watermark
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Display a watermark on all video content to discourage
                        unauthorized copying.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <Button type="button" variant="outline" className="mr-3">
                  Cancel
                </Button>
                <Button type="submit">Save Settings</Button>
              </div>
            </div>
          </form>
        </div>}
    </div>;
};
export default AdminSettings;