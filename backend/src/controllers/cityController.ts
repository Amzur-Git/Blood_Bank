import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export class CityController {
  
  /**
   * Get all cities
   */
  getCities = asyncHandler(async (req: Request, res: Response) => {
    const { search, is_active, page = 1, limit = 10 } = req.query;

    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { state: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (is_active !== undefined) {
      whereClause.is_active = is_active === 'true';
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [cities, total] = await Promise.all([
      prisma.city.findMany({
        where: whereClause,
        include: {
          _count: {
            select: {
              hospitals: true,
              blood_banks: true
            }
          }
        },
        orderBy: { name: 'asc' },
        skip,
        take: parseInt(limit as string)
      }),
      prisma.city.count({ where: whereClause })
    ]);

    res.json({
      success: true,
      data: cities,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  });

  /**
   * Get city by ID
   */
  getCityById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const city = await prisma.city.findUnique({
      where: { id },
      include: {
        hospitals: {
          where: { is_active: true },
          select: {
            id: true,
            name: true,
            has_blood_bank: true,
            is_government: true
          }
        },
        blood_banks: {
          where: { is_active: true },
          select: {
            id: true,
            name: true,
            is_24x7: true
          }
        },
        _count: {
          select: {
            hospitals: true,
            blood_banks: true
          }
        }
      }
    });

    if (!city) {
      res.status(404).json({
        success: false,
        message: 'City not found'
      });
      return;
    }

    res.json({
      success: true,
      data: city
    });
  });

  /**
   * Create new city
   */
  createCity = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { name, state, country, latitude, longitude } = req.body;

    // Check if city already exists
    const existingCity = await prisma.city.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        state: { equals: state, mode: 'insensitive' }
      }
    });

    if (existingCity) {
      res.status(400).json({
        success: false,
        message: 'City already exists in this state'
      });
      return;
    }

    const city = await prisma.city.create({
      data: {
        name,
        state,
        country: country || 'India',
        latitude,
        longitude
      }
    });

    logger.info(`New city created: ${name}, ${state} by user ${req.user?.id}`);

    res.status(201).json({
      success: true,
      data: city,
      message: 'City created successfully'
    });
  });

  /**
   * Update city
   */
  updateCity = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, state, country, latitude, longitude, is_active } = req.body;

    const city = await prisma.city.findUnique({ where: { id } });

    if (!city) {
      res.status(404).json({
        success: false,
        message: 'City not found'
      });
      return;
    }

    const updatedCity = await prisma.city.update({
      where: { id },
      data: {
        name,
        state,
        country,
        latitude,
        longitude,
        is_active
      }
    });

    logger.info(`City updated: ${id} by user ${req.user?.id}`);

    res.json({
      success: true,
      data: updatedCity,
      message: 'City updated successfully'
    });
  });

  /**
   * Delete city
   */
  deleteCity = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    const city = await prisma.city.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            hospitals: true,
            blood_banks: true
          }
        }
      }
    });

    if (!city) {
      res.status(404).json({
        success: false,
        message: 'City not found'
      });
      return;
    }

    // Check if city has associated hospitals or blood banks
    if (city._count.hospitals > 0 || city._count.blood_banks > 0) {
      res.status(400).json({
        success: false,
        message: 'Cannot delete city with associated hospitals or blood banks'
      });
      return;
    }

    await prisma.city.delete({ where: { id } });

    logger.info(`City deleted: ${id} by user ${req.user?.id}`);

    res.json({
      success: true,
      message: 'City deleted successfully'
    });
  });

  /**
   * Get cities with blood availability
   */
  getCitiesWithBloodAvailability = asyncHandler(async (req: Request, res: Response) => {
    const { blood_type } = req.query;

    const whereClause: any = {
      is_active: true,
      blood_banks: {
        some: {
          is_active: true
        }
      }
    };

    if (blood_type) {
      whereClause.blood_banks.some.blood_inventory = {
        some: {
          blood_type: blood_type,
          quantity: { gt: 0 }
        }
      };
    }

    const cities = await prisma.city.findMany({
      where: whereClause,
      include: {
        blood_banks: {
          where: { is_active: true },
          include: {
            blood_inventory: {
              where: blood_type ? { blood_type: blood_type as any } : {},
              select: {
                blood_type: true,
                quantity: true,
                availability_status: true
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: cities
    });
  });
}

export default new CityController();
