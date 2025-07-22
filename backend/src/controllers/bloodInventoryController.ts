import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import bloodAvailabilityService from '../services/bloodAvailabilityService';

const prisma = new PrismaClient();

export class BloodInventoryController {
  
  /**
   * Get blood inventory for a specific blood bank
   */
  getBloodInventory = asyncHandler(async (req: Request, res: Response) => {
    const { bloodBankId } = req.params;
    const { blood_type } = req.query;

    const whereClause: any = {
      blood_bank_id: bloodBankId
    };

    if (blood_type) {
      whereClause.blood_type = blood_type;
    }

    const inventory = await prisma.bloodInventory.findMany({
      where: whereClause,
      include: {
        blood_bank: {
          select: {
            name: true,
            address: true,
            phone: true
          }
        }
      },
      orderBy: { blood_type: 'asc' }
    });

    res.json({
      success: true,
      data: inventory
    });
  });

  /**
   * Update blood inventory
   */
  updateBloodInventory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { quantity, cost_per_unit, is_free, expiry_date } = req.body;

    // Check if inventory exists
    const existingInventory = await prisma.bloodInventory.findUnique({
      where: { id },
      include: { blood_bank: true }
    });

    if (!existingInventory) {
      return res.status(404).json({
        success: false,
        message: 'Blood inventory not found'
      });
    }

    // Calculate availability status
    let availabilityStatus = 'UNAVAILABLE';
    if (quantity > 10) {
      availabilityStatus = 'AVAILABLE';
    } else if (quantity > 0) {
      availabilityStatus = quantity <= 3 ? 'CRITICAL' : 'LIMITED';
    }

    // Update inventory
    const updatedInventory = await prisma.bloodInventory.update({
      where: { id },
      data: {
        quantity,
        cost_per_unit,
        is_free,
        expiry_date: expiry_date ? new Date(expiry_date) : undefined,
        availability_status: availabilityStatus as any,
        last_updated: new Date(),
        updated_by: req.user?.id
      },
      include: {
        blood_bank: {
          include: {
            city: true
          }
        }
      }
    });

    // Update real-time availability
    await bloodAvailabilityService.updateBloodInventory(
      existingInventory.blood_bank_id,
      existingInventory.blood_type,
      quantity,
      req.user?.id
    );

    res.json({
      success: true,
      data: updatedInventory,
      message: 'Blood inventory updated successfully'
    });
  });

  /**
   * Create new blood inventory entry
   */
  createBloodInventory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { blood_bank_id, blood_type, quantity, cost_per_unit, is_free, expiry_date } = req.body;

    // Check if blood bank exists
    const bloodBank = await prisma.bloodBank.findUnique({
      where: { id: blood_bank_id }
    });

    if (!bloodBank) {
      return res.status(404).json({
        success: false,
        message: 'Blood bank not found'
      });
    }

    // Check if inventory for this blood type already exists
    const existingInventory = await prisma.bloodInventory.findUnique({
      where: {
        blood_bank_id_blood_type: {
          blood_bank_id,
          blood_type
        }
      }
    });

    if (existingInventory) {
      return res.status(400).json({
        success: false,
        message: 'Blood inventory for this type already exists. Use update instead.'
      });
    }

    // Calculate availability status
    let availabilityStatus = 'UNAVAILABLE';
    if (quantity > 10) {
      availabilityStatus = 'AVAILABLE';
    } else if (quantity > 0) {
      availabilityStatus = quantity <= 3 ? 'CRITICAL' : 'LIMITED';
    }

    // Create inventory
    const inventory = await prisma.bloodInventory.create({
      data: {
        blood_bank_id,
        blood_type,
        quantity,
        cost_per_unit: cost_per_unit || 0,
        is_free: is_free || false,
        expiry_date: expiry_date ? new Date(expiry_date) : undefined,
        availability_status: availabilityStatus as any,
        updated_by: req.user?.id
      },
      include: {
        blood_bank: {
          include: {
            city: true
          }
        }
      }
    });

    // Update real-time availability
    await bloodAvailabilityService.updateBloodInventory(
      blood_bank_id,
      blood_type,
      quantity,
      req.user?.id
    );

    res.status(201).json({
      success: true,
      data: inventory,
      message: 'Blood inventory created successfully'
    });
  });

  /**
   * Get blood availability across all blood banks
   */
  getBloodAvailability = asyncHandler(async (req: Request, res: Response) => {
    const { city_id, blood_type, latitude, longitude, radius, only_available } = req.query;

    const availability = await bloodAvailabilityService.getBloodAvailability({
      city_id: city_id as string,
      blood_type: blood_type as string,
      latitude: latitude ? parseFloat(latitude as string) : undefined,
      longitude: longitude ? parseFloat(longitude as string) : undefined,
      radius: radius ? parseFloat(radius as string) : undefined,
      only_available: only_available === 'true'
    });

    res.json({
      success: true,
      data: availability,
      timestamp: new Date().toISOString()
    });
  });

  /**
   * Get emergency blood availability (optimized for speed)
   */
  getEmergencyBloodAvailability = asyncHandler(async (req: Request, res: Response) => {
    const { city_id, blood_type, latitude, longitude } = req.query;

    if (!city_id || !blood_type) {
      return res.status(400).json({
        success: false,
        message: 'city_id and blood_type are required for emergency search'
      });
    }

    const availability = await bloodAvailabilityService.getEmergencyBloodAvailability(
      city_id as string,
      blood_type as string,
      latitude ? parseFloat(latitude as string) : undefined,
      longitude ? parseFloat(longitude as string) : undefined
    );

    res.json({
      success: true,
      data: availability,
      timestamp: new Date().toISOString(),
      emergency: true
    });
  });

  /**
   * Get blood bank statistics
   */
  getBloodBankStats = asyncHandler(async (req: Request, res: Response) => {
    const { bloodBankId } = req.params;

    const stats = await bloodAvailabilityService.getBloodBankStats(bloodBankId);

    res.json({
      success: true,
      data: stats
    });
  });

  /**
   * Get city-wise blood availability summary
   */
  getCityBloodSummary = asyncHandler(async (req: Request, res: Response) => {
    const { cityId } = req.params;

    const summary = await bloodAvailabilityService.getCityBloodSummary(cityId);

    res.json({
      success: true,
      data: summary
    });
  });

  /**
   * Delete blood inventory entry
   */
  deleteBloodInventory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const inventory = await prisma.bloodInventory.findUnique({
      where: { id },
      include: { blood_bank: true }
    });

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Blood inventory not found'
      });
    }

    await prisma.bloodInventory.delete({
      where: { id }
    });

    // Update real-time availability (set to 0)
    await bloodAvailabilityService.updateBloodInventory(
      inventory.blood_bank_id,
      inventory.blood_type,
      0,
      req.user?.id
    );

    res.json({
      success: true,
      message: 'Blood inventory deleted successfully'
    });
  });

  /**
   * Get expired blood inventory
   */
  getExpiredBloodInventory = asyncHandler(async (req: Request, res: Response) => {
    const { blood_bank_id } = req.query;

    const whereClause: any = {
      expiry_date: {
        lt: new Date()
      },
      quantity: {
        gt: 0
      }
    };

    if (blood_bank_id) {
      whereClause.blood_bank_id = blood_bank_id;
    }

    const expiredInventory = await prisma.bloodInventory.findMany({
      where: whereClause,
      include: {
        blood_bank: {
          select: {
            name: true,
            address: true,
            phone: true
          }
        }
      },
      orderBy: { expiry_date: 'asc' }
    });

    res.json({
      success: true,
      data: expiredInventory
    });
  });

  /**
   * Get low stock alerts
   */
  getLowStockAlerts = asyncHandler(async (req: Request, res: Response) => {
    const { blood_bank_id, threshold = 5 } = req.query;

    const whereClause: any = {
      quantity: {
        lte: parseInt(threshold as string),
        gt: 0
      }
    };

    if (blood_bank_id) {
      whereClause.blood_bank_id = blood_bank_id;
    }

    const lowStockInventory = await prisma.bloodInventory.findMany({
      where: whereClause,
      include: {
        blood_bank: {
          select: {
            name: true,
            address: true,
            phone: true,
            emergency_phone: true
          }
        }
      },
      orderBy: { quantity: 'asc' }
    });

    res.json({
      success: true,
      data: lowStockInventory
    });
  });
}

export default new BloodInventoryController();
