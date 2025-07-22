import React, { useState, useEffect } from 'react';

interface SearchResult {
  id: string;
  name: string;
  type: 'hospital' | 'blood_bank';
  address: string;
  distance: string;
  bloodAvailable: boolean;
  unitsAvailable: number;
  contactNumber: string;
  emergencyContact?: string;
  status: 'available' | 'limited' | 'critical' | 'unavailable';
  lastUpdated: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  operatingHours: string;
  specialties?: string[];
  notes?: string;
}

const EmergencySearch: React.FC = () => {
  const [searchData, setSearchData] = useState({
    bloodType: '',
    city: '',
    urgency: 'HIGH',
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: '1',
      name: 'City General Hospital',
      type: 'hospital',
      address: '123 Medical Center Dr, Downtown',
      distance: '0.8 km',
      bloodAvailable: true,
      unitsAvailable: 12,
      contactNumber: '+44-20-7946-0958',
      emergencyContact: '+44-999',
      status: 'available',
      lastUpdated: '2 minutes ago',
      coordinates: { lat: 51.5074, lng: -0.1278 },
      operatingHours: '24/7 Emergency Services',
      specialties: ['Emergency Medicine', 'Blood Transfusion', 'Critical Care'],
      notes: 'Major trauma center with dedicated blood bank facility'
    },
    {
      id: '2',
      name: 'Central Blood Bank',
      type: 'blood_bank',
      address: '456 Health Plaza, Medical District',
      distance: '1.2 km',
      bloodAvailable: true,
      unitsAvailable: 5,
      contactNumber: '+33-1-45-67-89-01',
      emergencyContact: '+33-15',
      status: 'limited',
      lastUpdated: '5 minutes ago',
      coordinates: { lat: 48.8566, lng: 2.3522 },
      operatingHours: 'Mon-Fri: 6AM-10PM, Sat-Sun: 8AM-8PM',
      specialties: ['Blood Storage', 'Component Separation', 'Emergency Supply'],
      notes: 'Largest blood bank in the region with rapid processing'
    },
    {
      id: '3',
      name: 'Metropolitan Medical Center',
      type: 'hospital',
      address: '789 Care Avenue, Uptown',
      distance: '2.1 km',
      bloodAvailable: true,
      unitsAvailable: 2,
      contactNumber: '+1-555-0125',
      emergencyContact: '+1-555-METRO',
      status: 'critical',
      lastUpdated: '1 minute ago',
      coordinates: { lat: 40.7831, lng: -73.9712 },
      operatingHours: '24/7 Emergency & Critical Care',
      specialties: ['Cardiac Surgery', 'Neurosurgery', 'Emergency Medicine'],
      notes: 'Specialized in critical care with limited blood reserves'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchData.bloodType || !searchData.city) return;

    setIsSearching(true);
    setHasSearched(false);

    // Simulate API call
    setTimeout(() => {
      setSearchResults(mockResults);
      setIsSearching(false);
      setHasSearched(true);
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'badge-available';
      case 'limited': return 'badge-medium';
      case 'critical': return 'badge-high';
      case 'unavailable': return 'badge-critical';
      default: return 'badge-critical';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'limited': return 'Limited Stock';
      case 'critical': return 'Critical Low';
      case 'unavailable': return 'Unavailable';
      default: return 'Unknown';
    }
  };

  // Enhanced call function with better phone dialing support
  const handleCall = (contactNumber: string, emergencyContact?: string, isEmergency: boolean = false) => {
    const numberToCall = isEmergency && emergencyContact ? emergencyContact : contactNumber;
    
    // Clean the number for better compatibility
    const cleanNumber = numberToCall.replace(/[^\d+]/g, '');
    
    // Try multiple approaches for better device compatibility
    try {
      // Primary: Direct tel: link
      window.location.href = `tel:${cleanNumber}`;
      
      // Fallback: Create a hidden link and click it
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = `tel:${cleanNumber}`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 100);
      
      // Show notification for desktop users
      if (!/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // For desktop, show a notification instead of alert
        console.log(`Attempting to dial ${numberToCall}...`);
        
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: var(--primary-blue-600);
          color: white;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          z-index: 10000;
          max-width: 300px;
          font-family: inherit;
        `;
        notification.innerHTML = `
          <div><strong>Dialing ${numberToCall}</strong></div>
          <div style="font-size: 0.9em; margin-top: 0.5rem;">
            If your device supports calling, the dialer should open automatically.
          </div>
          <div style="font-size: 0.8em; margin-top: 0.5rem; opacity: 0.9;">
            Manual dial: ${numberToCall}
          </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove notification after 5 seconds
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 5000);
      }
    } catch (error) {
      // Manual fallback - copy to clipboard if available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(numberToCall).then(() => {
          // Create success notification
          const notification = document.createElement('div');
          notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-green);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 300px;
            font-family: inherit;
          `;
          notification.innerHTML = `
            <div><strong>Phone number copied!</strong></div>
            <div style="font-size: 0.9em; margin-top: 0.5rem;">
              ${numberToCall} has been copied to your clipboard.
            </div>
          `;
          
          document.body.appendChild(notification);
          
          setTimeout(() => {
            if (document.body.contains(notification)) {
              document.body.removeChild(notification);
            }
          }, 3000);
        }).catch(() => {
          console.error('Failed to copy number to clipboard');
        });
      } else {
        console.error('Phone dialing not supported on this device');
      }
    }
  };

  // GPS directions function
  const handleGetDirections = (result: SearchResult) => {
    const { coordinates, address, name } = result;
    
    // Try to open in native maps app first, then fallback to web
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}&destination_place_id=${encodeURIComponent(name)}&travelmode=driving`;
    
    // For mobile devices, try to open native maps app
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      const nativeMapsUrl = `maps://maps.google.com/maps?daddr=${coordinates.lat},${coordinates.lng}&amp;ll=`;
      
      // Try native app first
      const link = document.createElement('a');
      link.href = nativeMapsUrl;
      link.click();
      
      // Fallback to web version after a short delay
      setTimeout(() => {
        window.open(mapsUrl, '_blank');
      }, 1000);
    } else {
      // Desktop - open Google Maps in new tab
      window.open(mapsUrl, '_blank');
    }
  };

  // View details function
  const handleViewDetails = (result: SearchResult) => {
    setSelectedResult(result);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedResult(null);
  };

  return (
    <div className="container py-xl">
      {/* Header */}
      <div className="text-center mb-2xl">
        <h1 className="text-4xl font-black mb-lg" style={{ color: 'var(--blood-red-600)' }}>
          🚨 Emergency Blood Search
        </h1>
        <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
          Find blood availability in your area immediately. Every second counts in emergency situations.
        </p>
      </div>

      {/* Search Form */}
      <div className="max-w-4xl mx-auto mb-2xl">
        <div className="card card-emergency">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 mb-xl">
              <div className="form-group">
                <label 
                  htmlFor="bloodType" 
                  className="form-label"
                  title="Select the specific blood type needed for the patient"
                >
                  Blood Type Required *
                </label>
                <select
                  id="bloodType"
                  name="bloodType"
                  value={searchData.bloodType}
                  onChange={handleInputChange}
                  className="form-input form-select"
                  required
                  title="Choose the exact blood type needed - this affects compatibility and availability"
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+ (Positive)</option>
                  <option value="A-">A- (Negative)</option>
                  <option value="B+">B+ (Positive)</option>
                  <option value="B-">B- (Negative)</option>
                  <option value="AB+">AB+ (Universal Plasma Donor)</option>
                  <option value="AB-">AB- (Negative)</option>
                  <option value="O+">O+ (Positive)</option>
                  <option value="O-">O- (Universal Blood Donor)</option>
                </select>
              </div>

              <div className="form-group">
                <label 
                  htmlFor="city" 
                  className="form-label"
                  title="Enter your current location to find nearby blood banks and hospitals"
                >
                  City/Location *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={searchData.city}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your city"
                  required
                  title="Your current city or location to search for nearby medical facilities"
                />
              </div>

              <div className="form-group">
                <label 
                  htmlFor="urgency" 
                  className="form-label"
                  title="Select the urgency level to prioritize search results appropriately"
                >
                  Urgency Level
                </label>
                <select
                  id="urgency"
                  name="urgency"
                  value={searchData.urgency}
                  onChange={handleInputChange}
                  className="form-input form-select"
                  title="Urgency level affects search priority and response time expectations"
                >
                  <option value="CRITICAL">🔴 Critical (Life-threatening)</option>
                  <option value="HIGH">🟠 High (Urgent)</option>
                  <option value="MEDIUM">🟡 Medium (Important)</option>
                  <option value="LOW">🟢 Low (Planned)</option>
                </select>
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSearching || !searchData.bloodType || !searchData.city}
                className="btn btn-large btn-emergency"
                style={{ minWidth: '200px' }}
                title={!searchData.bloodType || !searchData.city ? 
                  "Please fill in blood type and location to search" : 
                  "Search all connected blood banks and hospitals for immediate availability"
                }
              >
                {isSearching ? (
                  <>
                    <div className="loading"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    🔍 Search Blood Banks
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Loading State */}
      {isSearching && (
        <div className="text-center py-2xl">
          <div className="loading-spinner mx-auto"></div>
          <p className="loading-text mt-lg">
            Searching blood banks and hospitals in your area...
          </p>
        </div>
      )}

      {/* Search Results */}
      {hasSearched && !isSearching && (
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-xl">
            <h2 className="text-2xl font-bold">
              Search Results for {searchData.bloodType} in {searchData.city}
            </h2>
            <div className="text-sm text-neutral-600">
              Found {searchResults.length} locations • Updated just now
            </div>
          </div>

          {searchResults.length === 0 ? (
            <div className="card text-center py-2xl">
              <div className="text-6xl mb-lg">😔</div>
              <h3 className="text-xl font-bold mb-md">No Results Found</h3>
              <p className="text-neutral-600 mb-lg">
                We couldn't find any blood banks or hospitals with {searchData.bloodType} blood in {searchData.city}.
              </p>
              <div className="flex gap-md justify-center">
                <button className="btn btn-secondary">
                  📞 Call Emergency Services
                </button>
                <button className="btn btn-primary">
                  🔄 Search Nearby Cities
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-lg">
              {searchResults.map((result, index) => (
                <div 
                  key={result.id} 
                  className={`card ${index === 0 ? 'card-success' : result.status === 'critical' ? 'card-emergency' : result.status === 'limited' ? 'card-warning' : ''}`}
                  style={{ 
                    animation: `slideInUp 0.6s ease forwards ${index * 0.1}s`,
                    opacity: 0,
                    transform: 'translateY(20px)'
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-md mb-md">
                        <div className="flex items-center gap-sm">
                          <div className="text-2xl">
                            {result.type === 'hospital' ? '🏥' : '🩸'}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{result.name}</h3>
                            <p className="text-sm text-neutral-600 capitalize">
                              {result.type.replace('_', ' ')} • {result.distance} away
                            </p>
                          </div>
                        </div>
                        <div className={`badge ${getStatusColor(result.status)}`}>
                          {getStatusText(result.status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-lg mb-lg">
                        <div>
                          <div className="text-sm text-neutral-600 mb-sm">Address</div>
                          <div className="font-medium">{result.address}</div>
                        </div>
                        <div>
                          <div className="text-sm text-neutral-600 mb-sm">Blood Units Available</div>
                          <div className="font-bold text-2xl" style={{ color: 'var(--blood-red-600)' }}>
                            {result.unitsAvailable} units
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-neutral-600 mb-sm">Last Updated</div>
                          <div className="font-medium text-green-600">{result.lastUpdated}</div>
                        </div>
                      </div>

                      <div className="flex gap-md flex-wrap">
                        <div className="flex gap-sm">
                          <button 
                            onClick={() => handleCall(result.contactNumber)}
                            className="btn btn-emergency"
                            title="Call main number"
                          >
                            📞 Call Now
                          </button>
                          {result.emergencyContact && (
                            <button 
                              onClick={() => handleCall(result.contactNumber, result.emergencyContact, true)}
                              className="btn btn-critical"
                              title="Call emergency line"
                            >
                              🚨 Emergency
                            </button>
                          )}
                        </div>
                        <button 
                          onClick={() => handleGetDirections(result)}
                          className="btn btn-secondary"
                          title="Open GPS navigation"
                        >
                          📍 Get Directions
                        </button>
                        <button 
                          onClick={() => handleViewDetails(result)}
                          className="btn btn-outline"
                          title="View detailed information"
                        >
                          📋 View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Emergency Contacts */}
          <div className="card card-emergency mt-2xl">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-md">Emergency Contacts</h3>
              <div className="grid grid-cols-3 gap-lg">
                <div>
                  <div className="text-sm text-neutral-600 mb-sm">Emergency Services</div>
                  <a href="tel:911" className="btn btn-emergency w-full">
                    📞 911
                  </a>
                </div>
                <div>
                  <div className="text-sm text-neutral-600 mb-sm">Blood Bank Hotline</div>
                  <a href="tel:+1-800-BLOOD" className="btn btn-secondary w-full">
                    📞 1-800-BLOOD
                  </a>
                </div>
                <div>
                  <div className="text-sm text-neutral-600 mb-sm">Medical Emergency</div>
                  <a href="tel:+1-800-EMERGENCY" className="btn btn-outline w-full">
                    📞 Medical Line
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedResult && (
        <div className="modal-overlay" onClick={closeDetailsModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-md">
                <div className="text-3xl">
                  {selectedResult.type === 'hospital' ? '🏥' : '🩸'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedResult.name}</h2>
                  <p className="text-lg text-neutral-600 capitalize">
                    {selectedResult.type.replace('_', ' ')} • {selectedResult.distance} away
                  </p>
                </div>
              </div>
              <button onClick={closeDetailsModal} className="btn-close">
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* Status and Availability */}
              <div className="detail-section">
                <h3 className="detail-title">Blood Availability</h3>
                <div className="grid grid-cols-2 gap-md">
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className={`badge ${getStatusColor(selectedResult.status)}`}>
                      {getStatusText(selectedResult.status)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Units Available:</span>
                    <span className="detail-value text-blood-red-600 font-bold">
                      {selectedResult.unitsAvailable} units
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Updated:</span>
                  <span className="detail-value text-green-600">{selectedResult.lastUpdated}</span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="detail-section">
                <h3 className="detail-title">Contact Information</h3>
                <div className="detail-item">
                  <span className="detail-label">Main Number:</span>
                  <div className="flex items-center gap-sm">
                    <span className="detail-value">{selectedResult.contactNumber}</span>
                    <button 
                      onClick={() => handleCall(selectedResult.contactNumber)}
                      className="btn btn-small btn-secondary"
                    >
                      📞 Call
                    </button>
                  </div>
                </div>
                {selectedResult.emergencyContact && (
                  <div className="detail-item">
                    <span className="detail-label">Emergency Line:</span>
                    <div className="flex items-center gap-sm">
                      <span className="detail-value">{selectedResult.emergencyContact}</span>
                      <button 
                        onClick={() => handleCall(selectedResult.contactNumber, selectedResult.emergencyContact, true)}
                        className="btn btn-small btn-emergency"
                      >
                        🚨 Emergency Call
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="detail-section">
                <h3 className="detail-title">Location</h3>
                <div className="detail-item">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{selectedResult.address}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Coordinates:</span>
                  <span className="detail-value">
                    {selectedResult.coordinates.lat}, {selectedResult.coordinates.lng}
                  </span>
                </div>
                <button 
                  onClick={() => handleGetDirections(selectedResult)}
                  className="btn btn-secondary w-full mt-md"
                >
                  📍 Open in Maps & Get Directions
                </button>
              </div>

              {/* Operating Hours */}
              <div className="detail-section">
                <h3 className="detail-title">Operating Hours</h3>
                <div className="detail-item">
                  <span className="detail-value">{selectedResult.operatingHours}</span>
                </div>
              </div>

              {/* Specialties */}
              {selectedResult.specialties && selectedResult.specialties.length > 0 && (
                <div className="detail-section">
                  <h3 className="detail-title">Specialties & Services</h3>
                  <div className="flex flex-wrap gap-sm">
                    {selectedResult.specialties.map((specialty, index) => (
                      <span key={index} className="badge badge-info">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedResult.notes && (
                <div className="detail-section">
                  <h3 className="detail-title">Additional Information</h3>
                  <div className="detail-item">
                    <span className="detail-value">{selectedResult.notes}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <div className="flex gap-md justify-center">
                <button 
                  onClick={() => handleCall(selectedResult.contactNumber)}
                  className="btn btn-emergency"
                >
                  📞 Call Now
                </button>
                <button 
                  onClick={() => handleGetDirections(selectedResult)}
                  className="btn btn-secondary"
                >
                  📍 Get Directions
                </button>
                <button onClick={closeDetailsModal} className="btn btn-outline">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: var(--spacing-lg);
        }

        .modal-content {
          background: white;
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-xl);
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: var(--spacing-xl);
          border-bottom: 1px solid var(--neutral-200);
        }

        .modal-body {
          padding: var(--spacing-xl);
        }

        .modal-footer {
          padding: var(--spacing-xl);
          border-top: 1px solid var(--neutral-200);
          background: var(--neutral-50);
        }

        .btn-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--neutral-500);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .btn-close:hover {
          background: var(--neutral-100);
          color: var(--neutral-700);
        }

        .detail-section {
          margin-bottom: var(--spacing-xl);
        }

        .detail-title {
          font-size: 1.2rem;
          font-weight: bold;
          color: var(--blood-red-600);
          margin-bottom: var(--spacing-md);
          padding-bottom: var(--spacing-sm);
          border-bottom: 2px solid var(--blood-red-100);
        }

        .detail-item {
          display: flex;
          align-items: center;
          margin-bottom: var(--spacing-sm);
          flex-wrap: wrap;
          gap: var(--spacing-sm);
        }

        .detail-label {
          font-weight: 600;
          color: var(--neutral-700);
          min-width: 150px;
        }

        .detail-value {
          color: var(--neutral-900);
          flex: 1;
        }

        .btn-small {
          padding: var(--spacing-xs) var(--spacing-sm);
          font-size: 0.85rem;
        }

        .btn-critical {
          background: linear-gradient(135deg, #1e40af, #1e3a8a);
          color: white;
          border: none;
          animation: pulse 2s infinite;
        }

        .btn-critical:hover {
          background: linear-gradient(135deg, #1d4ed8, #1e40af);
          transform: translateY(-1px);
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        @media (max-width: 768px) {
          .modal-content {
            margin: var(--spacing-sm);
            max-height: calc(100vh - 2rem);
          }
          
          .detail-item {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .detail-label {
            min-width: unset;
          }
        }
      `}</style>
    </div>
  );
};

export default EmergencySearch;
