import React from 'react';
import { useAppSelector } from '../hooks/redux';

const Profile: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 font-bold text-lg">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{user?.email}</p>
            <p className="mt-1 text-sm text-gray-500">Role: {user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
