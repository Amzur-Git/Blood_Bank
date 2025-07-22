import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export class HospitalController {
  /**
   * Get all hospitals with optional filtering
   */
  getHospitals = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search, city_id, has_blood_bank } = req.query;
    
    const whereClause: any = {
      is_active: true
    };

    if (search) {
      whereClause.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { address: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (city_id) {
      whereClause.city_id = city_id;
    }

    if (has_blood_bank !== undefined) {
      whereClause.has_blood_bank = has_blood_bank === 'true';
    }

    const [hospitals, total] = await Promise.all([
      prisma.hospital.findMany({
        where: whereClause,
        include: {
          city: true,
          blood_banks: {
            where: { is_active: true },
            select: { id: true, name: true }
          }
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { name: 'asc' }
      }),
      prisma.hospital.count({ where: whereClause })
    ]);

    res.json({
      success: true,
      data: {
        data: hospitals,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  });

  /**
   * Get hospital by ID
   */
  getHospitalById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const hospital = await prisma.hospital.findUnique({
      where: { id },
      include: {
        city: true,
        blood_banks: {
          where: { is_active: true }
        },
        doctors: {
          where: { is_active: true },
          select: {
            id: true,
            first_name: true,
            last_name: true,
            specialization: true,
            phone: true
          }
        }
      }
    });

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }

    res.json({
      success: true,
      data: hospital
    });
  });

  /**
   * Create new hospital
   */
  createHospital = asyncHandler(async (req: AuthRequest, res: Response) => {
    const hospitalData = req.body;

    const hospital = await prisma.hospital.create({
      data: {
        ...hospitalData,
        created_by: req.user?.id
      },
      include: {
        city: true
      }
    });

    logger.info(`Hospital created: ${hospital.name} by user ${req.user?.id}`);

    res.status(201).json({
      success: true,
      data: hospital,
      message: 'Hospital created successfully'
    });
  });

  /**
   * Update hospital
   */
  updateHospital = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const existingHospital = await prisma.hospital.findUnique({
      where: { id }
    });

    if (!existingHospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }

    const hospital = await prisma.hospital.update({
      where: { id },
      data: {
        ...updateData,
        updated_by: req.user?.id
      },
      include: {
        city: true
      }
    });

    logger.info(`Hospital updated: ${hospital.name} by user ${req.user?.id}`);

    res.json({
      success: true,
      data: hospital,
      message: 'Hospital updated successfully'
    });
  });

  /**
   * Delete hospital
   */
  deleteHospital = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const hospital = await prisma.hospital.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            blood_banks: true,
            doctors: true
          }
        }
      }
    });

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }

    // Check if hospital has associated blood banks or doctors
    if (hospital._count.blood_banks > 0 || hospital._count.doctors > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete hospital with associated blood banks or doctors'
      });
    }

    await prisma.hospital.delete({ where: { id } });

    logger.info(`Hospital deleted: ${id} by user ${req.user?.id}`);

    res.json({
      success: true,
      message: 'Hospital deleted successfully'
    });
  });
}

export default new HospitalController();
