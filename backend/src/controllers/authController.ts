import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger';
import config from '../config/config';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export class AuthController {
  /**
   * Register a new user
   */
  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const {
      username,
      email,
      password,
      role = 'USER'
    } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
      return;
    }

    // Check for password complexity
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      res.status(400).json({
        success: false,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)'
      });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      logger.warn(`Registration attempt with existing email/username: ${email}/${username}`);
      res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
      return;
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password_hash,
        role: role as any
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      },
      config.jwt.secret,
      { expiresIn: '24h' }
    );

    logger.info(`New user registered: ${user.username} (${user.email})`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });
  });

  /**
   * Login user
   */
  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
      return;
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.is_active) {
      logger.warn(`Login attempt with invalid credentials: ${email}`);
      res.status(401).json({
        success: false,
        message: 'Invalid credentials or inactive account'
      });
      return;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      logger.warn(`Login attempt with invalid password: ${email}`);
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      },
      config.jwt.secret,
      { expiresIn: '24h' }
    );

    // Remove sensitive information from user object
    const { password_hash, ...userWithoutPassword } = user;

    logger.info(`User logged in: ${user.username} (${user.email})`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  });

  /**
   * Get current user profile
   */
  getProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true,
        updated_at: true
      }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      data: user
    });
  });

  /**
   * Update user profile
   */
  updateProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const { username, email } = req.body;

    // Validate required fields
    if (!username && !email) {
      res.status(400).json({
        success: false,
        message: 'At least one field (username or email) is required'
      });
      return;
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
        return;
      }

      // Check if email is already taken by another user
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: userId }
        }
      });

      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
        return;
      }
    }

    // Check if username is already taken by another user
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          id: { not: userId }
        }
      });

      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'Username already exists'
        });
        return;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(username && { username }),
        ...(email && { email })
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true,
        updated_at: true
      }
    });

    logger.info(`User profile updated: ${updatedUser.username} (${updatedUser.email})`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  });

  /**
   * Change user password
   */
  changePassword = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
      return;
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      });
      return;
    }

    // Check for password complexity
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*]/.test(newPassword);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      res.status(400).json({
        success: false,
        message: 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)'
      });
      return;
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isCurrentPasswordValid) {
      logger.warn(`Password change attempt with invalid current password: ${user.email}`);
      res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
      return;
    }

    // Hash new password
    const saltRounds = 12;
    const new_password_hash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password_hash: new_password_hash }
    });

    logger.info(`Password changed for user: ${user.username} (${user.email})`);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  });

  /**
   * Refresh JWT token
   */
  refreshToken = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        is_active: true
      }
    });

    if (!user || !user.is_active) {
      res.status(401).json({
        success: false,
        message: 'Invalid user or inactive account'
      });
      return;
    }

    // Generate new JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      },
      config.jwt.secret,
      { expiresIn: '24h' }
    );

    logger.info(`Token refreshed for user: ${user.username} (${user.email})`);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        user,
        token
      }
    });
  });

  /**
   * Logout user (client-side token invalidation)
   */
  logout = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true, email: true }
      });

      if (user) {
        logger.info(`User logged out: ${user.username} (${user.email})`);
      }
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
}

export const authController = new AuthController();
export default authController;
