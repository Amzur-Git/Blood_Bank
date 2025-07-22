import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export class BloodBankController {
  /**
   * Get all blood banks with optional filtering
   */
  getBloodBanks = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search, city_id, is_24x7 } = req.query;
    
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

    if (is_24x7 !== undefined) {
      whereClause.is_24x7 = is_24x7 === 'true';
    }

    const [bloodBanks, total] = await Promise.all([
      prisma.bloodBank.findMany({
        where: whereClause,
        include: {
          city: true,
          hospital: {
            select: { id: true, name: true }
          },
          blood_inventory: {
            select: {
              blood_type: true,
              quantity: true,
              availability_status: true
            }
          }
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { name: 'asc' }
      }),
      prisma.bloodBank.count({ where: whereClause })
    ]);

    res.json({
      success: true,
      data: {
        data: bloodBanks,
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
   * Get blood bank by ID
   */
  getBloodBankById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const bloodBank = await prisma.bloodBank.findUnique({
      where: { id },
      include: {
        city: true,
        hospital: true,
        blood_inventory: true
      }
    });

    if (!bloodBank) {
      return res.status(404).json({
        success: false,
        message: 'Blood bank not found'
      });
    }

    res.json({
      success: true,
      data: bloodBank
    });
  });

  /**
   * Create new blood bank
   */
  createBloodBank = asyncHandler(async (req: AuthRequest, res: Response) => {
    const bloodBankData = req.body;

    const bloodBank = await prisma.bloodBank.create({
      data: {
        ...bloodBankData,
        created_by: req.user?.id
      },
      include: {
        city: true,
        hospital: true
      }
    });

    logger.info(`Blood bank created: ${bloodBank.name} by user ${req.user?.id}`);

    res.status(201).json({
      success: true,
      data: bloodBank,
      message: 'Blood bank created successfully'
    });
  });

  /**
   * Update blood bank
   */
  updateBloodBank = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const existingBloodBank = await prisma.bloodBank.findUnique({
      where: { id }
    });

    if (!existingBloodBank) {
      return res.status(404).json({
        success: false,
        message: 'Blood bank not found'
      });
    }

    const bloodBank = await prisma.bloodBank.update({
      where: { id },
      data: {
        ...updateData,
        updated_by: req.user?.id
      },
      include: {
        city: true,
        hospital: true
      }
    });

    logger.info(`Blood bank updated: ${bloodBank.name} by user ${req.user?.id}`);

    res.json({
      success: true,
      data: bloodBank,
      message: 'Blood bank updated successfully'
    });
  });

  /**
   * Delete blood bank
   */
  deleteBloodBank = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const bloodBank = await prisma.bloodBank.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            blood_inventory: true
          }
        }
      }
    });

    if (!bloodBank) {
      return res.status(404).json({
        success: false,
        message: 'Blood bank not found'
      });
    }

    // Check if blood bank has associated inventory
    if (bloodBank._count.blood_inventory > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete blood bank with existing inventory. Please clear inventory first.'
      });
    }

    await prisma.bloodBank.delete({ where: { id } });

    logger.info(`Blood bank deleted: ${id} by user ${req.user?.id}`);

    res.json({
      success: true,
      message: 'Blood bank deleted successfully'
    });
  });
}

export default new BloodBankController();
