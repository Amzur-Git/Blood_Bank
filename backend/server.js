const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Basic health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Emergency Blood Bank API is running',
    timestamp: new Date().toISOString()
  });
});

// Mock API endpoints for testing
app.get('/api/cities', (req, res) => {
  res.json({ 
    success: true, 
    data: [
      { id: '1', name: 'Mumbai', state: 'Maharashtra', country: 'India' },
      { id: '2', name: 'Delhi', state: 'Delhi', country: 'India' },
      { id: '3', name: 'Bangalore', state: 'Karnataka', country: 'India' },
      { id: '4', name: 'Chennai', state: 'Tamil Nadu', country: 'India' }
    ]
  });
});

app.get('/api/hospitals', (req, res) => {
  res.json({ 
    success: true, 
    data: [
      {
        id: '1',
        name: 'All India Institute of Medical Sciences (AIIMS)',
        address: 'Ansari Nagar, New Delhi',
        city: { name: 'Delhi', state: 'Delhi' },
        phone: '011-26588500',
        emergency_phone: '011-26588700',
        is_government: true,
        has_blood_bank: true
      },
      {
        id: '2',
        name: 'Kokilaben Dhirubhai Ambani Hospital',
        address: 'Four Bunglows, Andheri West, Mumbai',
        city: { name: 'Mumbai', state: 'Maharashtra' },
        phone: '022-42696969',
        emergency_phone: '022-42696700',
        is_government: false,
        has_blood_bank: true
      }
    ]
  });
});

app.get('/api/blood-banks', (req, res) => {
  res.json({ 
    success: true, 
    data: [
      {
        id: '1',
        name: 'AIIMS Blood Bank',
        address: 'AIIMS, New Delhi',
        city: { name: 'Delhi', state: 'Delhi' },
        phone: '011-26588500',
        is_24x7: true,
        blood_inventory: [
          { blood_type: 'O_POSITIVE', quantity: 45, availability_status: 'AVAILABLE' },
          { blood_type: 'A_POSITIVE', quantity: 30, availability_status: 'AVAILABLE' },
          { blood_type: 'B_POSITIVE', quantity: 25, availability_status: 'AVAILABLE' },
          { blood_type: 'AB_POSITIVE', quantity: 8, availability_status: 'LIMITED' },
          { blood_type: 'O_NEGATIVE', quantity: 5, availability_status: 'LIMITED' }
        ]
      },
      {
        id: '2',
        name: 'Kokilaben Hospital Blood Bank',
        address: 'Andheri West, Mumbai',
        city: { name: 'Mumbai', state: 'Maharashtra' },
        phone: '022-42696969',
        is_24x7: true,
        blood_inventory: [
          { blood_type: 'O_POSITIVE', quantity: 35, availability_status: 'AVAILABLE' },
          { blood_type: 'A_POSITIVE', quantity: 20, availability_status: 'AVAILABLE' },
          { blood_type: 'B_NEGATIVE', quantity: 3, availability_status: 'CRITICAL' },
          { blood_type: 'AB_NEGATIVE', quantity: 0, availability_status: 'UNAVAILABLE' }
        ]
      }
    ]
  });
});

app.get('/api/blood-availability', (req, res) => {
  const { city_id, blood_type } = req.query;
  
  let availability = [
    {
      id: '1',
      blood_type: 'O_POSITIVE',
      units_available: 45,
      cost_per_unit: 0,
      is_free: true,
      availability_status: 'AVAILABLE',
      blood_bank: {
        id: '1',
        name: 'AIIMS Blood Bank',
        phone: '011-26588500',
        is_24x7: true,
        city: { name: 'Delhi', state: 'Delhi' }
      }
    },
    {
      id: '2',
      blood_type: 'A_POSITIVE',
      units_available: 30,
      cost_per_unit: 0,
      is_free: true,
      availability_status: 'AVAILABLE',
      blood_bank: {
        id: '1',
        name: 'AIIMS Blood Bank',
        phone: '011-26588500',
        is_24x7: true,
        city: { name: 'Delhi', state: 'Delhi' }
      }
    },
    {
      id: '3',
      blood_type: 'O_POSITIVE',
      units_available: 35,
      cost_per_unit: 500,
      is_free: false,
      availability_status: 'AVAILABLE',
      blood_bank: {
        id: '2',
        name: 'Kokilaben Hospital Blood Bank',
        phone: '022-42696969',
        is_24x7: true,
        city: { name: 'Mumbai', state: 'Maharashtra' }
      }
    },
    {
      id: '4',
      blood_type: 'B_NEGATIVE',
      units_available: 3,
      cost_per_unit: 500,
      is_free: false,
      availability_status: 'CRITICAL',
      blood_bank: {
        id: '2',
        name: 'Kokilaben Hospital Blood Bank',
        phone: '022-42696969',
        is_24x7: true,
        city: { name: 'Mumbai', state: 'Maharashtra' }
      }
    }
  ];

  // Filter by blood type if provided
  if (blood_type) {
    availability = availability.filter(item => item.blood_type === blood_type);
  }

  res.json({ success: true, data: availability });
});

// Authentication endpoints (mock)
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Username, email, and password are required' 
    });
  }

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: { id: '1', username, email, role: 'USER' },
      token: 'mock_jwt_token_' + Date.now()
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and password are required' 
    });
  }

  // Mock successful login
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: { id: '1', username: 'test_user', email, role: 'USER' },
      token: 'mock_jwt_token_' + Date.now()
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

app.get('/api/auth/profile', (req, res) => {
  res.json({
    success: true,
    data: {
      id: '1',
      username: 'test_user',
      email: 'test@example.com',
      role: 'USER'
    }
  });
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Emergency Blood Bank API server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Frontend URL: http://localhost:3000`);
  console.log(`\n📋 Available API endpoints:`);
  console.log(`   GET  /health`);
  console.log(`   GET  /api/cities`);
  console.log(`   GET  /api/hospitals`);
  console.log(`   GET  /api/blood-banks`);
  console.log(`   GET  /api/blood-availability`);
  console.log(`   POST /api/auth/register`);
  console.log(`   POST /api/auth/login`);
  console.log(`   POST /api/auth/logout`);
  console.log(`   GET  /api/auth/profile`);
});

module.exports = app;
