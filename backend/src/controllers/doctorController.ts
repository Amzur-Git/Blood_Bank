import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger';
import { asyncHandler } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export class DoctorController {
  // Get all doctors
  getDoctors = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { page = 1, limit = 10, search, hospitalId } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const where: any = {};
    
    if (search) {
      where.OR = [
        { username: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { specialization: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    
    if (hospitalId) {
      where.hospitalId = hospitalId as string;
    }

    const [doctors, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          role: 'DOCTOR' as any,
          ...where
        },
        skip: offset,
        take: Number(limit),
        orderBy: { created_at: 'desc' }
      }),
      prisma.user.count({
        where: {
          role: 'DOCTOR' as any,
          ...where
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        doctors,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  });

  // Get doctor by ID
  getDoctorById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const doctor = await prisma.user.findFirst({
      where: {
        id,
        role: 'DOCTOR' as any
      }
    });

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
      return;
    }

    res.json({
      success: true,
      data: doctor
    });
  });

  // Update doctor profile
  updateDoctor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { email, phone, specialization, licenseNumber, hospitalId } = req.body;

    // Check if doctor exists
    const existingDoctor = await prisma.user.findFirst({
      where: { id, role: 'DOCTOR' as any }
    });

    if (!existingDoctor) {
      res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
      return;
    }

    // Check if email is already taken by another user
    if (email && email !== existingDoctor.email) {
      const emailExists = await prisma.user.findFirst({
        where: {
          email,
          id: { not: id }
        }
      });

      if (emailExists) {
        res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
        return;
      }
    }

    const updatedDoctor = await prisma.user.update({
      where: { id },
      data: {
        ...(email && { email }),
        ...(phone && { phone }),
        ...(specialization && { specialization }),
        ...(licenseNumber && { licenseNumber }),
        ...(hospitalId && { hospitalId })
      }
    });

    res.json({
      success: true,
      data: updatedDoctor,
      message: 'Doctor updated successfully'
    });
  });

  // Get doctor's blood requests
  getDoctorBloodRequests = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const where: any = {
      doctor_id: id
    };

    if (status) {
      where.status = status as any;
    }

    const [bloodRequests, total] = await Promise.all([
      prisma.bloodRequest.findMany({
        where,
        include: {
          patient: true,
          blood_bank: true,
          doctor: true
        },
        skip: offset,
        take: Number(limit)
      }),
      prisma.bloodRequest.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        bloodRequests,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  });

  // Get doctor statistics
  getDoctorStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const [
      totalRequests,
      pendingRequests,
      completedRequests
    ] = await Promise.all([
      prisma.bloodRequest.count({
        where: { doctor_id: id }
      }),
      prisma.bloodRequest.count({
        where: { doctor_id: id, status: 'PENDING' as any }
      }),
      prisma.bloodRequest.count({
        where: { doctor_id: id, status: 'COMPLETED' as any }
      })
    ]);

    res.json({
      success: true,
      data: {
        totalRequests,
        pendingRequests,
        completedRequests
      }
    });
  });
}

export const doctorController = new DoctorController();
