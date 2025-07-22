import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">B+</span>
              </div>
              <span className="ml-2 text-xl font-bold">BloodBank</span>
            </div>
            <p className="text-gray-400">
              Connecting lives through blood donation and emergency medical services.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Blood Bank Directory</li>
              <li>Hospital Network</li>
              <li>Emergency Search</li>
              <li>Blood Donation</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Help Center</li>
              <li>Emergency Contacts</li>
              <li>Medical Guidelines</li>
              <li>Blood Types Guide</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Emergency: 911</li>
              <li>Support: +1-800-BLOOD</li>
              <li>Email: help@bloodbank.com</li>
              <li>24/7 Available</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 BloodBank. All rights reserved. Saving lives, one donation at a time.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
