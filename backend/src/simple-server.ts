import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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

// Basic API routes
app.get('/api/cities', async (req, res) => {
  try {
    const cities = await prisma.city.findMany({
      select: {
        id: true,
        name: true,
        state: true,
        country: true
      }
    });
    res.json({ success: true, data: cities });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/hospitals', async (req, res) => {
  try {
    const hospitals = await prisma.hospital.findMany({
      include: {
        city: true
      }
    });
    res.json({ success: true, data: hospitals });
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/blood-banks', async (req, res) => {
  try {
    const bloodBanks = await prisma.bloodBank.findMany({
      include: {
        city: true,
        blood_inventory: true
      }
    });
    res.json({ success: true, data: bloodBanks });
  } catch (error) {
    console.error('Error fetching blood banks:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/blood-availability', async (req, res) => {
  try {
    const { city_id, blood_type } = req.query;
    
    let whereClause: any = {
      units_available: {
        gt: 0
      }
    };

    if (city_id) {
      whereClause.blood_bank = {
        city_id: parseInt(city_id as string)
      };
    }

    if (blood_type) {
      whereClause.blood_type = blood_type;
    }

    const availability = await prisma.bloodInventory.findMany({
      where: whereClause,
      include: {
        blood_bank: {
          include: {
            city: true
          }
        }
      }
    });

    res.json({ success: true, data: availability });
  } catch (error) {
    console.error('Error fetching blood availability:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Basic authentication routes (simplified)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, email, and password are required' 
      });
    }

    // For now, just return a success message without creating a user
    res.status(201).json({
      success: true,
      message: 'User registration endpoint is working. Database setup pending.',
      data: { username, email }
    });
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    // For now, return a mock successful login
    res.json({
      success: true,
      message: 'Login endpoint is working. Full authentication pending.',
      data: {
        user: { email, username: 'test_user' },
        token: 'mock_jwt_token'
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Emergency Blood Bank API server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

export default app;
