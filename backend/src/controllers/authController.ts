import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import config from '../config/config';

const prisma = new PrismaClient();

export class AuthController {
  
  /**
   * Register new user
   */
  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { username, email, password, role = 'USER' } = req.body;

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
      config.jwt.secret || 'fallback-secret',
      { expiresIn: config.jwt.expiresIn }
    );

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      success: true,
      data: {
        user,
        token
      },
      message: 'User registered successfully'
    });
  });

  /**
   * Login user
   */
  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        password_hash: true,
        role: true,
        is_active: true,
        created_at: true
      }
    });

    if (!user || !user.is_active) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials or inactive account'
      });
      return;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
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
      config.jwt.secret || 'fallback-secret',
      { expiresIn: config.jwt.expiresIn }
    );

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user;

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      },
      message: 'Login successful'
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
    const { username, email } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    // Check if new email/username already exists
    if (email || username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: userId } },
            {
              OR: [
                ...(email ? [{ email }] : []),
                ...(username ? [{ username }] : [])
              ]
            }
          ]
        }
      });

      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'Email or username already exists'
        });
        return;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        email
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

    res.json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully'
    });
  });

  /**
   * Change password
   */
  changePassword = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { current_password, new_password } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password_hash: true }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(current_password, user.password_hash);

    if (!isCurrentPasswordValid) {
      res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
      return;
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(new_password, saltRounds);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password_hash: newPasswordHash }
    });

    logger.info(`Password changed for user: ${req.user?.email}`);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  });

  /**
   * Refresh token
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
        message: 'User not found or inactive'
      });
      return;
    }

    // Generate new token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      },
      config.jwt.secret || 'fallback-secret',
      { expiresIn: config.jwt.expiresIn }
    );

    res.json({
      success: true,
      data: {
        user,
        token
      },
      message: 'Token refreshed successfully'
    });
  });

  /**
   * Logout user (client-side token removal)
   */
  logout = asyncHandler(async (req: AuthRequest, res: Response) => {
    logger.info(`User logged out: ${req.user?.email}`);

    res.json({
      success: true,
      message: 'Logout successful'
    });
  });
}

export default new AuthController();
