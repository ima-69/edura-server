import React from 'react';
import ProfileForm from '../components/ProfileForm';
import { userData } from '../utils/data';
const Profile: React.FC = () => {
  const handleProfileUpdate = (data: any) => {
    // In a real app, this would send the data to an API
    console.log('Profile updated:', data);
    alert('Profile updated successfully!');
  };
  return <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Manage your account settings and profile information
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <ProfileForm initialData={userData} onSubmit={handleProfileUpdate} />
      </div>
    </div>;
};
export default Profile;