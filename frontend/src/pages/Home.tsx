import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Save Lives with
            <br />
            Emergency Blood Search
          </h1>
          <p className="hero-subtitle">
            Real-time blood availability across 500+ blood banks and 1,200+ hospitals worldwide. 
            Connect patients with life-saving donations in critical moments, anywhere you are.
          </p>
          <div className="hero-actions">
            <Link 
              to="/emergency-search" 
              className="btn btn-large btn-emergency"
              title="Find blood availability immediately - Search across all connected blood banks and hospitals for emergency situations"
            >
              🚨 Emergency Search
            </Link>
            <Link 
              to="/register" 
              className="btn btn-large btn-outline"
              title="Register your hospital or blood bank to join the BloodSave network and help save lives"
            >
              Join the Network
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-2xl">
        <div className="container">
          <div className="grid grid-cols-4">
            <div className="stats-card" title="Active blood banks connected to the BloodSave network with real-time inventory">
              <div className="stats-number">500+</div>
              <div className="stats-label">Blood Banks</div>
            </div>
            <div className="stats-card" title="Partner hospitals using BloodSave for emergency blood requests and coordination">
              <div className="stats-number">1,200+</div>
              <div className="stats-label">Hospitals</div>
            </div>
            <div className="stats-card" title="Cities and regions covered by the BloodSave emergency network worldwide">
              <div className="stats-number">150+</div>
              <div className="stats-label">Countries</div>
            </div>
            <div className="stats-card" title="Lives saved through our emergency blood coordination and search system">
              <div className="stats-number">25K+</div>
              <div className="stats-label">Lives Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-2xl">
        <div className="container">
          <div className="text-center mb-2xl">
            <h2 className="text-4xl font-bold mb-lg">
              Comprehensive Blood Bank Network
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Advanced emergency response system connecting patients, hospitals, and blood banks nationwide
            </p>
          </div>

          <div className="grid grid-cols-3">
            {/* Real-Time Search */}
            <div 
              className="card card-emergency"
              title="Advanced search system providing instant results across all blood banks with real-time inventory tracking"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-emergency text-white mb-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-md">Instant Blood Search</h3>
                <p className="text-neutral-600">
                  Real-time blood availability across all registered blood banks with live inventory updates and emergency priority system.
                </p>
              </div>
            </div>

            {/* City Coverage */}
            <div 
              className="card card-success"
              title="Comprehensive geographic coverage spanning major cities with detailed facility information"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary text-white mb-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-md">Global Coverage</h3>
                <p className="text-neutral-600">
                  Comprehensive network spanning 150+ countries with detailed hospital and blood bank information worldwide.
                </p>
              </div>
            </div>

            {/* 24/7 Emergency */}
            <div 
              className="card card-warning"
              title="24/7 emergency response system with priority access to blood banks and medical facilities"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-success text-white mb-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-md">24/7 Emergency Response</h3>
                <p className="text-neutral-600">
                  Round-the-clock emergency support with priority access to blood banks, medical facilities, and emergency services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-2xl" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
        <div className="container">
          <div className="text-center mb-2xl">
            <h2 className="text-4xl font-bold mb-lg">How It Works</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Simple, fast, and effective emergency blood search process
            </p>
          </div>

          <div className="grid grid-cols-3">
            <div className="text-center" title="Step 1: Start your emergency blood search by entering required blood type and location">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-emergency text-white mb-lg text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-md">Emergency Search</h3>
              <p className="text-neutral-600">
                Enter blood type, location, and urgency level to instantly search all available blood banks and hospitals.
              </p>
            </div>

            <div className="text-center" title="Step 2: View real-time results with live inventory data and facility contact information">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary text-white mb-lg text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-md">Real-Time Results</h3>
              <p className="text-neutral-600">
                Get live inventory data, contact information, and availability status from nearby medical facilities.
              </p>
            </div>

            <div className="text-center" title="Step 3: Connect immediately with blood banks and coordinate emergency medical services">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-success text-white mb-lg text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-md">Immediate Contact</h3>
              <p className="text-neutral-600">
                Connect directly with blood banks, schedule pickup, or coordinate with emergency medical services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency CTA */}
      <section className="hero" style={{ padding: 'var(--spacing-3xl) 0' }}>
        <div className="hero-content">
          <h2 className="text-4xl font-bold mb-lg">Every Second Counts</h2>
          <p className="text-xl mb-2xl" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Join our life-saving network and help connect patients with critical blood donations. 
            Together, we can make the difference between life and death.
          </p>
          <div className="hero-actions">
            <Link 
              to="/register" 
              className="btn btn-large" 
              style={{ background: 'white', color: 'var(--primary-blue-600)' }}
              title="Register your hospital or blood bank to join the life-saving BloodSave network"
            >
              Register Now
            </Link>
            <Link 
              to="/emergency-search" 
              className="btn btn-large btn-outline"
              title="Access emergency blood search to find immediate blood availability"
            >
              Emergency Search
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
