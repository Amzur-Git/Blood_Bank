import React from 'react';

const BloodAvailability: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Blood Availability</h1>
        <p className="mt-2 text-gray-600">Real-time blood availability across all blood banks</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Blood Availability Dashboard</h3>
            <p className="mt-1 text-sm text-gray-500">
              This page will show real-time blood availability data from all connected blood banks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodAvailability;
