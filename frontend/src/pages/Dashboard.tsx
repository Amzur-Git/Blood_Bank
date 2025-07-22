import React from 'react';
import { useAppSelector } from '../hooks/redux';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const quickStats = [
    { 
      label: 'Blood Requests', 
      value: '24', 
      change: '+12%', 
      color: 'primary-blue', 
      icon: '🩸',
      tooltip: 'Active blood requests in the last 24 hours. 12% increase from yesterday.'
    },
    { 
      label: 'Hospitals', 
      value: '156', 
      change: '+5%', 
      color: 'primary-blue', 
      icon: '🏥',
      tooltip: 'Connected hospitals in your network. 5% growth this month.'
    },
    { 
      label: 'Blood Banks', 
      value: '89', 
      change: '+8%', 
      color: 'success-green', 
      icon: '🏦',
      tooltip: 'Active blood banks with live inventory updates. 8% increase in network.'
    },
    { 
      label: 'Emergency Alerts', 
      value: '7', 
      change: '+2%', 
      color: 'warning-amber', 
      icon: '⚡',
      tooltip: 'Critical blood shortage alerts requiring immediate attention.'
    },
  ];

  const recentRequests = [
    { type: 'O+', hospital: 'City General Hospital', units: 2, urgency: 'Critical', time: '2 min ago' },
    { type: 'A-', hospital: 'General Hospital', units: 1, urgency: 'High', time: '5 min ago' },
    { type: 'B+', hospital: 'Medical Center', units: 3, urgency: 'Medium', time: '12 min ago' },
  ];

  const quickActions = [
    { 
      label: 'Search Blood', 
      icon: '🔍', 
      link: '/blood-availability', 
      color: 'btn-emergency',
      tooltip: 'Search blood inventory across all connected blood banks and hospitals'
    },
    { 
      label: 'New Request', 
      icon: '➕', 
      link: '/blood-requests', 
      color: 'btn-secondary',
      tooltip: 'Create a new blood request for your facility'
    },
    { 
      label: 'Update Inventory', 
      icon: '✅', 
      link: '/blood-banks', 
      color: 'btn-success',
      tooltip: 'Update blood inventory levels and availability status'
    },
    { 
      label: 'Emergency Alert', 
      icon: '🚨', 
      link: '/emergency-search', 
      color: 'btn-emergency',
      tooltip: 'Find immediate blood availability for emergency situations'
    },
  ];

  return (
    <div className="container py-xl">
      {/* Welcome Header */}
      <div className="mb-2xl">
        <h1 className="text-4xl font-bold mb-sm">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-xl text-neutral-600">
          Monitor blood availability and manage emergency requests across your network
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 mb-2xl">
        {quickStats.map((stat, index) => (
          <div 
            key={index} 
            className="stats-card"
            title={stat.tooltip}
          >
            <div className="flex items-center justify-between mb-md">
              <div className="text-2xl">{stat.icon}</div>
              <div 
                className={`text-xs font-semibold px-sm py-xs rounded-full ${
                  stat.change.startsWith('+') ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                }`}
                title={`${stat.change} change from previous period`}
              >
                {stat.change}
              </div>
            </div>
            <div className="stats-number">{stat.value}</div>
            <div className="stats-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        {/* Recent Blood Requests */}
        <div className="card">
          <div className="flex justify-between items-center mb-lg">
            <h2 className="text-xl font-bold">Recent Blood Requests</h2>
            <Link 
              to="/blood-requests" 
              className="text-sm text-primary-blue-600 hover:text-primary-blue-700 font-medium"
              title="View all blood requests and manage approval status"
            >
              View All →
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentRequests.map((request, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-lg border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                title={`${request.urgency} urgency request for ${request.units} units of ${request.type} blood from ${request.hospital} - ${request.time}`}
              >
                <div className="flex items-center gap-md">
                  <div 
                    className="w-10 h-10 rounded-full bg-gradient-emergency text-white flex items-center justify-center font-bold"
                    title={`Blood type: ${request.type}`}
                  >
                    {request.type}
                  </div>
                  <div>
                    <p className="font-semibold">{request.hospital}</p>
                    <p className="text-sm text-neutral-600">{request.units} units • {request.time}</p>
                  </div>
                </div>
                <div 
                  className={`badge ${
                    request.urgency === 'Critical' ? 'badge-critical' :
                    request.urgency === 'High' ? 'badge-high' :
                    'badge-medium'
                  }`}
                  title={`${request.urgency} priority level - ${
                    request.urgency === 'Critical' ? 'Immediate action required' :
                    request.urgency === 'High' ? 'High priority, respond soon' :
                    'Standard priority'
                  }`}
                >
                  {request.urgency}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="mb-lg">
            <h2 className="text-xl font-bold">Quick Actions</h2>
            <p className="text-sm text-neutral-600">Frequently used features and emergency tools</p>
          </div>
          
          <div className="grid grid-cols-2 gap-md">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`btn ${action.color} flex-col p-lg h-auto text-center hover:transform hover:scale-105 transition-all`}
                title={action.tooltip}
              >
                <div className="text-2xl mb-sm">{action.icon}</div>
                <div className="font-semibold">{action.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="card card-emergency mt-2xl">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-md">Emergency Contacts</h3>
          <div className="grid grid-cols-3 gap-lg">
            <div>
              <div className="text-sm text-neutral-600 mb-sm">Emergency Services</div>
              <a 
                href="tel:911" 
                className="btn btn-emergency w-full"
                title="Call 911 for immediate emergency services and life-threatening situations"
              >
                📞 911
              </a>
            </div>
            <div>
              <div className="text-sm text-neutral-600 mb-sm">Blood Bank Hotline</div>
              <a 
                href="tel:+1-800-BLOOD" 
                className="btn btn-secondary w-full"
                title="Call national blood bank hotline for urgent blood requests and coordination"
              >
                📞 1-800-BLOOD
              </a>
            </div>
            <div>
              <div className="text-sm text-neutral-600 mb-sm">Medical Emergency</div>
              <a 
                href="tel:+1-800-EMERGENCY" 
                className="btn btn-outline w-full"
                title="Call medical emergency line for non-911 medical emergencies and consultations"
              >
                📞 Medical Line
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
