import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';
import { UserIcon, CameraIcon } from 'lucide-react';
interface ProfileFormProps {
  initialData?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onSubmit: (data: any) => void;
}
const ProfileForm: React.FC<ProfileFormProps> = ({
  initialData = {
    name: '',
    email: ''
  },
  onSubmit
}) => {
  const [formData, setFormData] = useState(initialData);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    if (newPassword && newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    setPasswordError('');
    // Handle password change logic here
    alert('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  return <div className="space-y-8">
      {/* Avatar section */}
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
          {formData.avatar ? <img src={formData.avatar} alt="User avatar" className="w-full h-full object-cover" /> : <UserIcon className="h-10 w-10 text-gray-400" />}
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">
            Profile Picture
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            JPG or PNG. Max size of 1MB
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <CameraIcon className="h-4 w-4 mr-2" />
              Change
            </Button>
            <Button variant="ghost" size="sm">
              Remove
            </Button>
          </div>
        </div>
      </div>
      {/* Personal information form */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Personal Information
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required fullWidth />
            <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your.email@example.com" required fullWidth />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
      {/* Password change form */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Change Password
        </h3>
        <div className="space-y-4">
          <Input label="Current Password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Enter your current password" fullWidth />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" fullWidth />
            <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" error={passwordError} fullWidth />
          </div>
          <div className="flex justify-end">
            <Button type="button" onClick={handlePasswordChange} disabled={!currentPassword || !newPassword || !confirmPassword}>
              Update Password
            </Button>
          </div>
        </div>
      </div>
    </div>;
};
export default ProfileForm;