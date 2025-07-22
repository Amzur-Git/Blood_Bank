import dotenv from 'dotenv';

dotenv.config();

interface DatabaseConfig {
  url: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

interface Config {
  port: number;
  nodeEnv: string;
  database: DatabaseConfig;
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
  };
  email: {
    host: string;
    port: number;
    secure: boolean;
    username: string;
    password: string;
  };
  sms: {
    apiKey: string;
    apiSecret: string;
  };
  cors: {
    origin: string;
  };
  maps: {
    googleApiKey: string;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '5000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/emergency_blood_bank',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'emergency_blood_bank'
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD
  },
  
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    username: process.env.EMAIL_USERNAME || '',
    password: process.env.EMAIL_PASSWORD || ''
  },
  
  sms: {
    apiKey: process.env.SMS_API_KEY || '',
    apiSecret: process.env.SMS_API_SECRET || ''
  },
  
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000'
  },
  
  maps: {
    googleApiKey: process.env.GOOGLE_MAPS_API_KEY || ''
  }
};

export default config;
