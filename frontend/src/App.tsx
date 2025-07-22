import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { getCurrentUser } from './store/slices/authSlice';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Loading from './components/common/Loading';
import NotificationContainer from './components/common/NotificationContainer';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import BloodAvailability from './pages/BloodAvailability';
import Hospitals from './pages/Hospitals';
import BloodBanks from './pages/BloodBanks';
import BloodRequests from './pages/BloodRequests';
import Profile from './pages/Profile';
import EmergencySearch from './pages/EmergencySearch';

// Route Guards
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, token, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token, user]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/emergency-search" element={<EmergencySearch />} />
          
          {/* Auth Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/blood-availability" 
            element={
              <ProtectedRoute>
                <BloodAvailability />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/hospitals" 
            element={
              <ProtectedRoute>
                <Hospitals />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/blood-banks" 
            element={
              <ProtectedRoute>
                <BloodBanks />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/blood-requests" 
            element={
              <ProtectedRoute>
                <BloodRequests />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect to dashboard if authenticated, otherwise to home */}
          <Route 
            path="*" 
            element={<Navigate to={user ? "/dashboard" : "/"} replace />} 
          />
        </Routes>
      </main>
      <Footer />
      <NotificationContainer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
};

export default App;
