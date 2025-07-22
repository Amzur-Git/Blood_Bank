import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger';
import { io } from '../index';

const prisma = new PrismaClient();

export interface BloodAvailabilityQuery {
  city_id?: string;
  blood_type?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  only_available?: boolean;
}

export interface BloodAvailabilityResult {
  id: string;
  name: string;
  address: string;
  phone: string;
  emergency_phone?: string;
  is_24x7: boolean;
  distance?: number;
  blood_inventory: {
    blood_type: string;
    quantity: number;
    cost_per_unit: number;
    is_free: boolean;
    availability_status: string;
    last_updated: Date;
  }[];
  hospital?: {
    name: string;
    phone: string;
    is_government: boolean;
  };
  city: {
    name: string;
    state: string;
  };
}

export class BloodAvailabilityService {
  
  /**
   * Get real-time blood availability across blood banks
   */
  async getBloodAvailability(query: BloodAvailabilityQuery): Promise<BloodAvailabilityResult[]> {
    try {
      const {
        city_id,
        blood_type,
        latitude,
        longitude,
        radius = 50,
        only_available = false
      } = query;

      // Build where clause
      const whereClause: any = {
        is_active: true
      };

      if (city_id) {
        whereClause.city_id = city_id;
      }

      if (blood_type) {
        whereClause.blood_inventory = {
          some: {
            blood_type: blood_type,
            ...(only_available && { quantity: { gt: 0 } })
          }
        };
      }

      // Get blood banks with inventory
      const bloodBanks = await prisma.bloodBank.findMany({
        where: whereClause,
        include: {
          blood_inventory: {
            where: blood_type ? { blood_type: blood_type } : undefined,
            orderBy: { last_updated: 'desc' }
          },
          hospital: {
            select: {
              name: true,
              phone: true,
              is_government: true
            }
          },
          city: {
            select: {
              name: true,
              state: true
            }
          }
        }
      });

      // Transform results and calculate distances if coordinates provided
      const results: BloodAvailabilityResult[] = bloodBanks.map(bank => {
        const result: BloodAvailabilityResult = {
          id: bank.id,
          name: bank.name,
          address: bank.address,
          phone: bank.phone,
          emergency_phone: bank.emergency_phone || undefined,
          is_24x7: bank.is_24x7,
          blood_inventory: bank.blood_inventory.map(inv => ({
            blood_type: inv.blood_type,
            quantity: inv.quantity,
            cost_per_unit: inv.cost_per_unit,
            is_free: inv.is_free,
            availability_status: inv.availability_status,
            last_updated: inv.last_updated
          })),
          hospital: bank.hospital || undefined,
          city: bank.city
        };

        // Calculate distance if coordinates provided
        if (latitude && longitude) {
          // This would require actual lat/lng in database
          // For now, we'll use a placeholder
          result.distance = Math.random() * radius;
        }

        return result;
      });

      // Sort by distance if coordinates provided, otherwise by name
      if (latitude && longitude) {
        results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      } else {
        results.sort((a, b) => a.name.localeCompare(b.name));
      }

      return results;
    } catch (error) {
      logger.error('Error getting blood availability:', error);
      throw new Error('Failed to get blood availability');
    }
  }

  /**
   * Update blood inventory and notify connected clients
   */
  async updateBloodInventory(
    bloodBankId: string,
    bloodType: string,
    quantity: number,
    updatedBy?: string
  ): Promise<void> {
    try {
      // Calculate availability status
      let availabilityStatus = 'UNAVAILABLE';
      if (quantity > 10) {
        availabilityStatus = 'AVAILABLE';
      } else if (quantity > 0) {
        availabilityStatus = quantity <= 3 ? 'CRITICAL' : 'LIMITED';
      }

      // Update inventory
      const updatedInventory = await prisma.bloodInventory.upsert({
        where: {
          blood_bank_id_blood_type: {
            blood_bank_id: bloodBankId,
            blood_type: bloodType as any
          }
        },
        update: {
          quantity,
          availability_status: availabilityStatus as any,
          last_updated: new Date(),
          updated_by: updatedBy
        },
        create: {
          blood_bank_id: bloodBankId,
          blood_type: bloodType as any,
          quantity,
          availability_status: availabilityStatus as any,
          updated_by: updatedBy
        },
        include: {
          blood_bank: {
            include: {
              city: true
            }
          }
        }
      });

      // Emit real-time update
      io.to(`city-${updatedInventory.blood_bank.city_id}`).emit('blood-inventory-update', {
        bloodBankId,
        bloodType,
        quantity,
        availabilityStatus,
        lastUpdated: updatedInventory.last_updated,
        cityId: updatedInventory.blood_bank.city_id
      });

      io.to(`blood-bank-${bloodBankId}`).emit('inventory-update', {
        bloodType,
        quantity,
        availabilityStatus,
        lastUpdated: updatedInventory.last_updated
      });

      logger.info(`Blood inventory updated: ${bloodBankId} - ${bloodType} - ${quantity} units`);
    } catch (error) {
      logger.error('Error updating blood inventory:', error);
      throw new Error('Failed to update blood inventory');
    }
  }

  /**
   * Get emergency blood availability (optimized for speed)
   */
  async getEmergencyBloodAvailability(
    cityId: string,
    bloodType: string,
    latitude?: number,
    longitude?: number
  ): Promise<BloodAvailabilityResult[]> {
    try {
      // For emergency requests, only return available blood
      const bloodBanks = await prisma.bloodBank.findMany({
        where: {
          city_id: cityId,
          is_active: true,
          blood_inventory: {
            some: {
              blood_type: bloodType as any,
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
              blood_type: bloodType as any,
              quantity: { gt: 0 }
            }
          },
          hospital: {
            select: {
              name: true,
              phone: true,
              is_government: true
            }
          },
          city: {
            select: {
              name: true,
              state: true
            }
          }
        },
        take: 20 // Limit for emergency speed
      });

      // Transform and sort by availability status (AVAILABLE first)
      const results: BloodAvailabilityResult[] = bloodBanks.map(bank => ({
        id: bank.id,
        name: bank.name,
        address: bank.address,
        phone: bank.phone,
        emergency_phone: bank.emergency_phone || undefined,
        is_24x7: bank.is_24x7,
        blood_inventory: bank.blood_inventory.map(inv => ({
          blood_type: inv.blood_type,
          quantity: inv.quantity,
          cost_per_unit: inv.cost_per_unit,
          is_free: inv.is_free,
          availability_status: inv.availability_status,
          last_updated: inv.last_updated
        })),
        hospital: bank.hospital || undefined,
        city: bank.city
      }));

      // Sort by availability status and quantity
      results.sort((a, b) => {
        const statusOrder = { 'AVAILABLE': 0, 'LIMITED': 1, 'CRITICAL': 2 };
        const aStatus = a.blood_inventory[0]?.availability_status || 'UNAVAILABLE';
        const bStatus = b.blood_inventory[0]?.availability_status || 'UNAVAILABLE';
        
        if (statusOrder[aStatus as keyof typeof statusOrder] !== statusOrder[bStatus as keyof typeof statusOrder]) {
          return statusOrder[aStatus as keyof typeof statusOrder] - statusOrder[bStatus as keyof typeof statusOrder];
        }
        
        return (b.blood_inventory[0]?.quantity || 0) - (a.blood_inventory[0]?.quantity || 0);
      });

      return results;
    } catch (error) {
      logger.error('Error getting emergency blood availability:', error);
      throw new Error('Failed to get emergency blood availability');
    }
  }

  /**
   * Get blood bank statistics
   */
  async getBloodBankStats(bloodBankId: string): Promise<any> {
    try {
      const stats = await prisma.bloodInventory.groupBy({
        by: ['blood_type', 'availability_status'],
        where: {
          blood_bank_id: bloodBankId
        },
        _sum: {
          quantity: true
        },
        _count: {
          id: true
        }
      });

      return {
        totalBloodTypes: stats.length,
        inventoryByType: stats.reduce((acc, stat) => {
          acc[stat.blood_type] = {
            quantity: stat._sum.quantity || 0,
            status: stat.availability_status
          };
          return acc;
        }, {} as any),
        lastUpdated: new Date()
      };
    } catch (error) {
      logger.error('Error getting blood bank stats:', error);
      throw new Error('Failed to get blood bank statistics');
    }
  }

  /**
   * Get city-wise blood availability summary
   */
  async getCityBloodSummary(cityId: string): Promise<any> {
    try {
      const summary = await prisma.bloodInventory.groupBy({
        by: ['blood_type', 'availability_status'],
        where: {
          blood_bank: {
            city_id: cityId,
            is_active: true
          }
        },
        _sum: {
          quantity: true
        },
        _count: {
          id: true
        }
      });

      return {
        cityId,
        totalBloodBanks: await prisma.bloodBank.count({
          where: { city_id: cityId, is_active: true }
        }),
        bloodTypesSummary: summary.reduce((acc, stat) => {
          if (!acc[stat.blood_type]) {
            acc[stat.blood_type] = {
              total_quantity: 0,
              blood_banks: 0,
              available_count: 0
            };
          }
          acc[stat.blood_type].total_quantity += stat._sum.quantity || 0;
          acc[stat.blood_type].blood_banks += stat._count;
          if (stat.availability_status !== 'UNAVAILABLE') {
            acc[stat.blood_type].available_count += stat._count;
          }
          return acc;
        }, {} as any),
        lastUpdated: new Date()
      };
    } catch (error) {
      logger.error('Error getting city blood summary:', error);
      throw new Error('Failed to get city blood summary');
    }
  }
}

export default new BloodAvailabilityService();
