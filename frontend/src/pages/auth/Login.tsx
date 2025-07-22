import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { login } from '../../store/slices/authSlice';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login(formData)).unwrap();
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by Redux
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-2xl px-md">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-2xl">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-emergency text-white mb-lg">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-sm">Welcome Back</h1>
          <p className="text-neutral-600">
            Sign in to access your emergency blood network account
          </p>
        </div>

        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="alert alert-error">
                <div className="flex items-center gap-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <div className="form-group">
              <label 
                htmlFor="email" 
                className="form-label"
                title="Enter the email address associated with your BloodSave account"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                title="Your registered email address for BloodSave account access"
              />
            </div>

            <div className="form-group">
              <label 
                htmlFor="password" 
                className="form-label"
                title="Enter your secure password for BloodSave account"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                title="Your secure BloodSave account password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  title="Keep me signed in on this device for faster access"
                />
                <label 
                  htmlFor="remember-me" 
                  className="ml-2 text-sm text-neutral-600"
                  title="Stay logged in for convenience and faster emergency access"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link 
                  to="/forgot-password" 
                  className="font-medium text-primary-blue-600 hover:text-primary-blue-500"
                  title="Reset your password if you've forgotten it"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full btn-large"
              title={isLoading ? "Signing you in..." : "Sign in to access your BloodSave dashboard and emergency tools"}
            >
              {isLoading ? (
                <>
                  <div className="loading"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-xl text-center">
            <p className="text-neutral-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-semibold text-primary-blue-600 hover:text-primary-blue-500"
                title="Register your hospital or blood bank to join the BloodSave network"
              >
                Join the Network
              </Link>
            </p>
          </div>
        </div>

        {/* Emergency Access */}
        <div className="mt-lg text-center">
          <div className="card card-emergency">
            <h3 className="font-bold mb-sm">Emergency Access</h3>
            <p className="text-sm text-neutral-600 mb-md">
              In case of medical emergency, you can search for blood banks without an account
            </p>
            <Link to="/emergency-search" className="btn btn-outline w-full">
              🚨 Emergency Blood Search
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .alert {
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          margin-bottom: var(--spacing-lg);
        }

        .alert-error {
          background: linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(255, 255, 255, 0.95) 100%);
          border: 1px solid rgba(30, 64, 175, 0.3);
          color: var(--primary-blue-700);
        }

        input[type="checkbox"] {
          accent-color: var(--primary-blue-600);
        }
      `}</style>
    </div>
  );
};

export default Login;
