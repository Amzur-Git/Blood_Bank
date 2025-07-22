import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const NavLink = ({ to, children, className = "", title }: { to: string, children: React.ReactNode, className?: string, title?: string }) => (
    <Link
      to={to}
      className={`nav-link ${isActivePath(to) ? 'nav-link-active' : ''} ${className}`}
      onClick={() => setIsMobileMenuOpen(false)}
      title={title}
    >
      {children}
    </Link>
  );

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link 
            to="/" 
            className="navbar-brand" 
            onClick={() => setIsMobileMenuOpen(false)}
            title="BloodSave - Emergency Blood Bank Network | Go to Home"
          >
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span className="brand-text">BloodSave</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-nav desktop-nav">
            <NavLink 
              to="/emergency-search" 
              className="nav-emergency"
              title="Emergency Blood Search - Find blood banks and hospitals with immediate availability"
            >
              🚨 Emergency Search
            </NavLink>
            
            {user ? (
              <>
                <NavLink 
                  to="/dashboard" 
                  title="Dashboard - View blood request statistics, quick actions, and emergency contacts"
                >
                  Dashboard
                </NavLink>
                <NavLink 
                  to="/blood-availability" 
                  title="Blood Availability Search - Search blood inventory across all connected facilities"
                >
                  Blood Search
                </NavLink>
                <NavLink 
                  to="/hospitals" 
                  title="Hospitals Directory - View and manage hospital network connections"
                >
                  Hospitals
                </NavLink>
                <NavLink 
                  to="/blood-banks" 
                  title="Blood Banks Directory - Manage blood bank inventory and locations"
                >
                  Blood Banks
                </NavLink>
                <NavLink 
                  to="/profile" 
                  title="User Profile - Manage your account settings and preferences"
                >
                  Profile
                </NavLink>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-primary nav-logout"
                  title="Sign out of your BloodSave account"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  title="Sign In - Access your BloodSave account for healthcare professionals"
                >
                  Sign In
                </NavLink>
                <Link 
                  to="/register" 
                  className="btn btn-primary" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  title="Join Network - Register your hospital or blood bank with BloodSave"
                >
                  Join Network
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            title={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${isMobileMenuOpen ? 'mobile-nav-open' : ''}`}>
          <div className="mobile-nav-content">
            <NavLink 
              to="/emergency-search" 
              className="mobile-nav-emergency"
              title="Emergency Blood Search - Find blood banks and hospitals with immediate availability"
            >
              🚨 Emergency Search
            </NavLink>
            
            {user ? (
              <>
                <NavLink 
                  to="/dashboard"
                  title="Dashboard - View blood request statistics, quick actions, and emergency contacts"
                >
                  Dashboard
                </NavLink>
                <NavLink 
                  to="/blood-availability"
                  title="Blood Availability Search - Search blood inventory across all connected facilities"
                >
                  Blood Search
                </NavLink>
                <NavLink 
                  to="/hospitals"
                  title="Hospitals Directory - View and manage hospital network connections"
                >
                  Hospitals
                </NavLink>
                <NavLink 
                  to="/blood-banks"
                  title="Blood Banks Directory - Manage blood bank inventory and locations"
                >
                  Blood Banks
                </NavLink>
                <NavLink 
                  to="/profile"
                  title="User Profile - Manage your account settings and preferences"
                >
                  Profile
                </NavLink>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-primary w-full"
                  title="Sign out of your BloodSave account"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink 
                  to="/login"
                  title="Sign In - Access your BloodSave account for healthcare professionals"
                >
                  Sign In
                </NavLink>
                <Link 
                  to="/register" 
                  className="btn btn-primary w-full" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  title="Join Network - Register your hospital or blood bank with BloodSave"
                >
                  Join Network
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <style>{`
        .navbar {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: var(--shadow-md);
          position: sticky;
          top: 0;
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: var(--spacing-md) var(--spacing-lg);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          text-decoration: none;
          color: var(--primary-blue-600);
          font-weight: 800;
          font-size: 1.5rem;
          transition: all 0.2s ease;
        }

        .navbar-brand:hover {
          transform: scale(1.05);
        }

        .brand-icon {
          width: 2.5rem;
          height: 2.5rem;
          background: var(--gradient-emergency);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .brand-icon svg {
          width: 1.5rem;
          height: 1.5rem;
        }

        .brand-text {
          font-family: 'Poppins', sans-serif;
          background: var(--gradient-emergency);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .navbar-nav {
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
        }

        .desktop-nav {
          display: flex;
        }

        .nav-link {
          color: var(--neutral-700);
          text-decoration: none;
          font-weight: 500;
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          transition: all 0.2s ease;
          position: relative;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          width: 0;
          height: 2px;
          background: var(--gradient-emergency);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        .nav-link:hover,
        .nav-link-active {
          color: var(--primary-blue-600);
          background: rgba(59, 130, 246, 0.05);
        }

        .nav-link:hover::before,
        .nav-link-active::before {
          width: 80%;
        }

        .nav-emergency {
          background: var(--gradient-emergency);
          color: white !important;
          font-weight: 600;
          animation: pulse-glow 2s infinite;
        }

        .nav-emergency::before {
          display: none;
        }

        .nav-emergency:hover {
          background: var(--gradient-emergency) !important;
          transform: translateY(-1px);
          box-shadow: var(--shadow-emergency);
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(220, 38, 38, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(220, 38, 38, 0.5);
          }
        }

        .nav-logout {
          padding: var(--spacing-sm) var(--spacing-lg);
          font-size: 0.875rem;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--spacing-sm);
          z-index: 1001;
        }

        .hamburger {
          width: 24px;
          height: 18px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .hamburger span {
          width: 100%;
          height: 2px;
          background: var(--primary-blue-600);
          transition: all 0.3s ease;
          transform-origin: center;
        }

        .hamburger.open span:nth-child(1) {
          transform: rotate(45deg) translate(6px, 6px);
        }

        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.open span:nth-child(3) {
          transform: rotate(-45deg) translate(6px, -6px);
        }

        .mobile-nav {
          display: none;
          position: fixed;
          top: 0;
          right: 0;
          height: 100vh;
          width: 300px;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          transform: translateX(100%);
          transition: transform 0.3s ease;
          z-index: 1000;
          padding-top: 80px;
        }

        .mobile-nav-open {
          transform: translateX(0);
        }

        .mobile-nav-content {
          padding: var(--spacing-xl);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .mobile-nav .nav-link {
          display: block;
          padding: var(--spacing-lg);
          text-align: center;
          border-radius: var(--radius-lg);
          font-size: 1.125rem;
        }

        .mobile-nav-emergency {
          background: var(--gradient-emergency);
          color: white !important;
          animation: pulse-glow 2s infinite;
        }

        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          backdrop-filter: blur(5px);
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }

          .mobile-menu-btn,
          .mobile-nav {
            display: block;
          }

          .navbar-container {
            padding: var(--spacing-md);
          }

          .brand-text {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
