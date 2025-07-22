import Joi from 'joi';

// Blood type validation
export const bloodTypeSchema = Joi.string().valid(
  'A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE',
  'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE'
);

// Gender validation
export const genderSchema = Joi.string().valid('MALE', 'FEMALE', 'OTHER');

// Urgency level validation
export const urgencyLevelSchema = Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

// Request status validation
export const requestStatusSchema = Joi.string().valid('PENDING', 'APPROVED', 'REJECTED', 'FULFILLED', 'CANCELLED');

// User role validation
export const userRoleSchema = Joi.string().valid('USER', 'HOSPITAL_ADMIN', 'BLOOD_BANK_ADMIN', 'SYSTEM_ADMIN');

// Availability status validation
export const availabilityStatusSchema = Joi.string().valid('AVAILABLE', 'LIMITED', 'CRITICAL', 'UNAVAILABLE');

// Common field validations
export const phoneSchema = Joi.string().pattern(/^[+]?[0-9]{10,15}$/).message('Invalid phone number format');
export const emailSchema = Joi.string().email().message('Invalid email format');
export const idSchema = Joi.string().required().message('ID is required');

// City validation schemas
export const createCitySchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  state: Joi.string().required().min(2).max(100),
  country: Joi.string().default('India').max(100),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional()
});

export const updateCitySchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  state: Joi.string().min(2).max(100).optional(),
  country: Joi.string().max(100).optional(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
  is_active: Joi.boolean().optional()
});

// Hospital validation schemas
export const createHospitalSchema = Joi.object({
  name: Joi.string().required().min(2).max(200),
  address: Joi.string().required().min(10).max(500),
  city_id: idSchema,
  phone: phoneSchema.required(),
  emergency_phone: phoneSchema.optional(),
  email: emailSchema.optional(),
  is_government: Joi.boolean().default(false),
  has_blood_bank: Joi.boolean().default(false),
  has_emergency_unit: Joi.boolean().default(true),
  license_number: Joi.string().optional().max(100)
});

export const updateHospitalSchema = Joi.object({
  name: Joi.string().min(2).max(200).optional(),
  address: Joi.string().min(10).max(500).optional(),
  city_id: idSchema.optional(),
  phone: phoneSchema.optional(),
  emergency_phone: phoneSchema.optional(),
  email: emailSchema.optional(),
  is_government: Joi.boolean().optional(),
  has_blood_bank: Joi.boolean().optional(),
  has_emergency_unit: Joi.boolean().optional(),
  license_number: Joi.string().max(100).optional(),
  is_active: Joi.boolean().optional()
});

// Blood Bank validation schemas
export const createBloodBankSchema = Joi.object({
  name: Joi.string().required().min(2).max(200),
  hospital_id: idSchema.optional(),
  city_id: idSchema.required(),
  address: Joi.string().required().min(10).max(500),
  phone: phoneSchema.required(),
  emergency_phone: phoneSchema.optional(),
  email: emailSchema.optional(),
  license_number: Joi.string().required().max(100),
  is_24x7: Joi.boolean().default(false)
});

export const updateBloodBankSchema = Joi.object({
  name: Joi.string().min(2).max(200).optional(),
  hospital_id: idSchema.optional(),
  city_id: idSchema.optional(),
  address: Joi.string().min(10).max(500).optional(),
  phone: phoneSchema.optional(),
  emergency_phone: phoneSchema.optional(),
  email: emailSchema.optional(),
  license_number: Joi.string().max(100).optional(),
  is_24x7: Joi.boolean().optional(),
  is_active: Joi.boolean().optional()
});

// Blood Inventory validation schemas
export const createBloodInventorySchema = Joi.object({
  blood_bank_id: idSchema.required(),
  blood_type: bloodTypeSchema.required(),
  quantity: Joi.number().integer().min(0).required(),
  cost_per_unit: Joi.number().min(0).default(0),
  is_free: Joi.boolean().default(false),
  expiry_date: Joi.date().optional(),
  updated_by: idSchema.optional()
});

export const updateBloodInventorySchema = Joi.object({
  quantity: Joi.number().integer().min(0).optional(),
  cost_per_unit: Joi.number().min(0).optional(),
  is_free: Joi.boolean().optional(),
  expiry_date: Joi.date().optional(),
  updated_by: idSchema.optional(),
  availability_status: availabilityStatusSchema.optional()
});

// Doctor validation schemas
export const createDoctorSchema = Joi.object({
  name: Joi.string().required().min(2).max(200),
  hospital_id: idSchema.required(),
  specialization: Joi.string().required().min(2).max(200),
  registration_number: Joi.string().required().max(100),
  phone: phoneSchema.required(),
  email: emailSchema.optional(),
  is_available: Joi.boolean().default(true)
});

export const updateDoctorSchema = Joi.object({
  name: Joi.string().min(2).max(200).optional(),
  hospital_id: idSchema.optional(),
  specialization: Joi.string().min(2).max(200).optional(),
  registration_number: Joi.string().max(100).optional(),
  phone: phoneSchema.optional(),
  email: emailSchema.optional(),
  is_available: Joi.boolean().optional(),
  is_active: Joi.boolean().optional()
});

// Patient validation schemas
export const createPatientSchema = Joi.object({
  name: Joi.string().required().min(2).max(200),
  age: Joi.number().integer().min(0).max(150).required(),
  gender: genderSchema.required(),
  blood_type: bloodTypeSchema.required(),
  phone: phoneSchema.required(),
  emergency_contact: phoneSchema.required(),
  address: Joi.string().max(500).optional(),
  medical_history: Joi.string().max(2000).optional()
});

export const updatePatientSchema = Joi.object({
  name: Joi.string().min(2).max(200).optional(),
  age: Joi.number().integer().min(0).max(150).optional(),
  gender: genderSchema.optional(),
  blood_type: bloodTypeSchema.optional(),
  phone: phoneSchema.optional(),
  emergency_contact: phoneSchema.optional(),
  address: Joi.string().max(500).optional(),
  medical_history: Joi.string().max(2000).optional(),
  is_active: Joi.boolean().optional()
});

// Blood Request validation schemas
export const createBloodRequestSchema = Joi.object({
  patient_id: idSchema.required(),
  doctor_id: idSchema.optional(),
  blood_bank_id: idSchema.required(),
  blood_type: bloodTypeSchema.required(),
  units_needed: Joi.number().integer().min(1).max(20).required(),
  urgency_level: urgencyLevelSchema.default('MEDIUM'),
  reason: Joi.string().required().min(10).max(1000),
  notes: Joi.string().max(1000).optional()
});

export const updateBloodRequestSchema = Joi.object({
  doctor_id: idSchema.optional(),
  blood_bank_id: idSchema.optional(),
  blood_type: bloodTypeSchema.optional(),
  units_needed: Joi.number().integer().min(1).max(20).optional(),
  urgency_level: urgencyLevelSchema.optional(),
  status: requestStatusSchema.optional(),
  reason: Joi.string().min(10).max(1000).optional(),
  notes: Joi.string().max(1000).optional(),
  approved_by: idSchema.optional()
});

// User authentication schemas
export const registerUserSchema = Joi.object({
  username: Joi.string().required().min(3).max(50).alphanum(),
  email: emailSchema.required(),
  password: Joi.string().required().min(8).max(100)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])')),
  role: userRoleSchema.default('USER')
});

export const loginUserSchema = Joi.object({
  email: emailSchema.required(),
  password: Joi.string().required()
});

// Query parameter schemas
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().optional(),
  order: Joi.string().valid('asc', 'desc').default('asc')
});

export const searchSchema = Joi.object({
  search: Joi.string().min(2).max(100).optional(),
  city_id: idSchema.optional(),
  blood_type: bloodTypeSchema.optional(),
  is_active: Joi.boolean().optional()
});

// Emergency search schema
export const emergencySearchSchema = Joi.object({
  city_id: idSchema.required(),
  blood_type: bloodTypeSchema.required(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
  radius: Joi.number().min(1).max(100).default(50) // km
});

// Validation middleware
export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Query Validation Error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};
