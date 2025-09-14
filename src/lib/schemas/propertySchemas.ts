import { z } from "zod";

// Lessor Detail Schema
export const lessorDetailSchema = z.object({
  name: z.string().min(1, "Lessor name is required"),
  propertyHoldingPercentage: z
    .number()
    .min(0, "Property holding percentage must be at least 0")
    .max(100, "Property holding percentage cannot exceed 100"),
});

// Property Details Schema
export const propertyDetailsSchema = z.object({
  landlordName: z.string().min(1, "Landlord name is required"),
  landlordContact: z.string().min(1, "Landlord contact is required"),
  landlordEmail: z.string().email("Invalid email address"),
  numberOfLessors: z.number().min(1, "Number of lessors must be at least 1"),
  lessorDetails: z
    .array(lessorDetailSchema)
    .min(1, "At least one lessor detail is required"),
  buildingName: z.string().min(1, "Building name is required"),
  completeAddress: z.string().min(1, "Complete address is required"),
  pinCode: z.string().min(1, "Pin code is required"),
  carpetArea: z.number().min(0, "Carpet area must be at least 0"),
  chargeableArea: z.number().min(0, "Chargeable area must be at least 0"),
  propertyVintageYears: z
    .number()
    .min(0, "Property vintage years must be at least 0"),
});

// Media Schema
export const mediaSchema = z.object({
  images: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  documents: z.array(z.string()).optional(),
});

// Commercial Terms Schema
export const commercialTermsSchema = z.object({
  advanceRentRequired: z.boolean(),
  monthlyRentPerSqFt: z
    .number()
    .min(0, "Monthly rent per sq ft must be at least 0"),
  maintenanceChargesPerSqFt: z
    .number()
    .min(0, "Maintenance charges per sq ft must be at least 0"),
  monthlyRent: z.number().min(0, "Monthly rent must be at least 0"),
  monthlyMaintenance: z
    .number()
    .min(0, "Monthly maintenance must be at least 0"),
  totalMonthlyAmount: z
    .number()
    .min(0, "Total monthly amount must be at least 0"),
  securityDepositMonths: z
    .number()
    .min(0, "Security deposit months must be at least 0"),
  securityDepositAmount: z
    .number()
    .min(0, "Security deposit amount must be at least 0"),
  rentEscalationPercentage: z
    .number()
    .min(0, "Rent escalation percentage must be at least 0"),
  totalRentPerAnnum: z
    .number()
    .min(0, "Total rent per annum must be at least 0"),
});

// Parking Details Schema
export const parkingDetailsSchema = z.object({
  fourWheelerSpaces: z
    .number()
    .min(0, "Four wheeler spaces must be at least 0"),
  twoWheelerSpaces: z.number().min(0, "Two wheeler spaces must be at least 0"),
  additionalCost: z.boolean(),
});

// Selection Criteria Schema
export const selectionCriteriaSchema = z.object({
  notUnderSublease: z.boolean(),
  originalAgreementCopyRetained: z.boolean(),
  notInLowLyingArea: z.boolean(),
  hasSprinklerSystem: z.boolean(),
  hasHydrantSystem: z.boolean(),
  hasStructuralStabilityCertificate: z.boolean(),
  hasFASSystem: z.string().min(1, "FAS system details are required"),
  numberOfFireExits: z
    .number()
    .min(0, "Number of fire exits must be at least 0"),
  rentFreePeriodDays: z
    .number()
    .min(0, "Rent free period days must be at least 0"),
  agreementRegistrationSplit: z
    .string()
    .min(1, "Agreement registration split is required"),
  leasePeriodYears: z.number().min(0, "Lease period years must be at least 0"),
  terminationFromLesseeSide: z.boolean(),
  terminationNoticePeriodMonths: z
    .number()
    .min(0, "Termination notice period months must be at least 0"),
  lockInPeriodMonths: z
    .number()
    .min(0, "Lock in period months must be at least 0"),
  glowSignBoardPermission: z
    .string()
    .min(1, "Glow sign board permission is required"),
  shutterProvision: z.string().min(1, "Shutter provision is required"),
  safetyGrillProvision: z.string().min(1, "Safety grill provision is required"),
  flooringType: z.string().min(1, "Flooring type is required"),
  numberOfLifts: z.number().min(0, "Number of lifts must be at least 0"),
  liftLicenseStatus: z.string().min(1, "Lift license status is required"),
  distanceToPublicTransport: z
    .string()
    .min(1, "Distance to public transport is required"),
  electricityConnection: z
    .string()
    .min(1, "Electricity connection is required"),
  electricityKW: z.number().min(0, "Electricity KW must be at least 0"),
  hasDedicatedEarthing: z.boolean(),
  electricityMeterProvided: z.boolean(),
  stayPermissionForWorkers: z
    .string()
    .min(1, "Stay permission for workers is required"),
  interiorWorkPermission: z
    .string()
    .min(1, "Interior work permission is required"),
  dgPowerBackup: z.string().min(1, "DG power backup is required"),
  dgSpaceProvision: z.string().min(1, "DG space provision is required"),
  antennaInstallationPermission: z
    .string()
    .min(1, "Antenna installation permission is required"),
  washroomDetails: z.string().min(1, "Washroom details are required"),
  acODUPlatform: z.string().min(1, "AC ODU platform is required"),
  windowReplacement: z.string().min(1, "Window replacement is required"),
  parkingDetails: parkingDetailsSchema,
});

// Building Features Schema
export const buildingFeaturesSchema = z.object({
  salientFeatures: z.array(z.string()).optional(),
  otherOccupants: z.array(z.string()).optional(),
  gstDetails: z.string().optional(),
  taxResponsibility: z.string().optional(),
});

// Main Create Property Schema
export const createPropertySchema = z.object({
  propertyDetails: propertyDetailsSchema,
  media: mediaSchema.optional(),
  commercialTerms: commercialTermsSchema,
  selectionCriteria: selectionCriteriaSchema,
  buildingFeatures: buildingFeaturesSchema.optional(),
  tags: z.array(z.string()).optional(),
  propertyType: z.enum(["commercial", "residential", "mixed"]),
});

// Update Property Schema (all fields optional except propertyType)
export const updatePropertySchema = z.object({
  propertyDetails: propertyDetailsSchema.partial().optional(),
  media: mediaSchema.optional(),
  commercialTerms: commercialTermsSchema.partial().optional(),
  selectionCriteria: selectionCriteriaSchema.partial().optional(),
  buildingFeatures: buildingFeaturesSchema.optional(),
  tags: z.array(z.string()).optional(),
  propertyType: z.enum(["commercial", "residential", "mixed"]).optional(),
  status: z
    .enum(["available", "rented", "under_negotiation", "withdrawn"])
    .optional(),
  isActive: z.boolean().optional(),
});

// Property Filter Schema
export const propertyFilterSchema = z.object({
  propertyType: z.enum(["commercial", "residential", "mixed"]).optional(),
  minRent: z.number().optional(),
  maxRent: z.number().optional(),
  location: z.string().optional(),
  carpetAreaMin: z.number().optional(),
  carpetAreaMax: z.number().optional(),
  parkingRequired: z.boolean().optional(),
  sortBy: z.enum(["rent", "area", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

// Bulk Create Property Schema
export const bulkCreatePropertySchema = z.object({
  properties: z.array(createPropertySchema),
  skipValidation: z.boolean().optional(),
});

// Type exports
export type LessorDetailFormData = z.infer<typeof lessorDetailSchema>;
export type PropertyDetailsFormData = z.infer<typeof propertyDetailsSchema>;
export type MediaFormData = z.infer<typeof mediaSchema>;
export type CommercialTermsFormData = z.infer<typeof commercialTermsSchema>;
export type ParkingDetailsFormData = z.infer<typeof parkingDetailsSchema>;
export type SelectionCriteriaFormData = z.infer<typeof selectionCriteriaSchema>;
export type BuildingFeaturesFormData = z.infer<typeof buildingFeaturesSchema>;
export type CreatePropertyFormData = z.infer<typeof createPropertySchema>;
export type UpdatePropertyFormData = z.infer<typeof updatePropertySchema>;
export type PropertyFilterFormData = z.infer<typeof propertyFilterSchema>;
export type BulkCreatePropertyFormData = z.infer<
  typeof bulkCreatePropertySchema
>;
