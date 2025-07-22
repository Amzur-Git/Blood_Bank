import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { PrismaClient } from '@prisma/client';
import { logger } from './config/logger';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';

// Route imports
import cityRoutes from './routes/cityRoutes';
import hospitalRoutes from './routes/hospitalRoutes';
import bloodBankRoutes from './routes/bloodBankRoutes';
import bloodInventoryRoutes from './routes/bloodInventoryRoutes';
import doctorRoutes from './routes/doctorRoutes';
import patientRoutes from './routes/patientRoutes';
import bloodRequestRoutes from './routes/bloodRequestRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Emergency endpoints with higher rate limits
const emergencyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Emergency request limit exceeded'
});
app.use('/api/emergency/', emergencyLimiter);

app.use(morgan('combined', { stream: { write: (message: string) => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/blood-banks', bloodBankRoutes);
app.use('/api/blood-inventory', bloodInventoryRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/blood-requests', bloodRequestRoutes);

// Emergency blood availability endpoint
app.get('/api/emergency/blood-availability', async (req, res) => {
  try {
    const { city_id, blood_type, latitude, longitude } = req.query;
    
    // Get all blood banks with availability for the requested blood type
    const bloodBanks = await prisma.bloodBank.findMany({
      where: {
        city_id: city_id as string,
        is_active: true,
        blood_inventory: {
          some: {
            blood_type: blood_type as any,
            quantity: { gt: 0 },
            availability_status: {
              in: ['AVAILABLE', 'LIMITED', 'CRITICAL']
            }
          }
        }
      },
      include: {
        blood_inventory: {
          where: {
            blood_type: blood_type as any
          }
        },
        city: true,
        hospital: true
      }
    });

    res.json({
      success: true,
      data: bloodBanks,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Emergency blood availability error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);
  
  // Join room for specific city updates
  socket.on('join-city', (cityId) => {
    socket.join(`city-${cityId}`);
    logger.info(`User ${socket.id} joined city room: ${cityId}`);
  });

  // Join room for specific blood bank updates
  socket.on('join-blood-bank', (bloodBankId) => {
    socket.join(`blood-bank-${bloodBankId}`);
    logger.info(`User ${socket.id} joined blood bank room: ${bloodBankId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// Export io for use in other modules
export { io };

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

const PORT = process.env.PORT || 5000;

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

server.listen(PORT, () => {
  logger.info(`🚀 Emergency Blood Bank Server running on port ${PORT}`);
  logger.info(`🏥 Environment: ${process.env.NODE_ENV || 'development'}`);
});
