import React from 'react';

const BloodBanks: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Blood Banks</h1>
        <p className="mt-2 text-gray-600">Manage blood bank network and inventory</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Blood Bank Management</h3>
            <p className="mt-1 text-sm text-gray-500">
              This page will manage blood bank information and inventory tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodBanks;
