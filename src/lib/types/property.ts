export interface Landlord {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export interface LessorDetail {
  name: string;
  propertyHoldingPercentage: number;
}

export interface PropertyDetails {
  landlordName: string;
  landlordContact: string;
  landlordEmail: string;
  numberOfLessors: number;
  lessorDetails: LessorDetail[];
  buildingName: string;
  completeAddress: string;
  pinCode: string;
  carpetArea: number;
  chargeableArea: number;
  propertyVintageYears: number;
}

export interface Media {
  images: string[];
  videos: string[];
  documents: string[];
}

export interface CommercialTerms {
  advanceRentRequired: boolean;
  monthlyRentPerSqFt: number;
  maintenanceChargesPerSqFt: number;
  monthlyRent: number;
  monthlyMaintenance: number;
  totalMonthlyAmount: number;
  securityDepositMonths: number;
  securityDepositAmount: number;
  rentEscalationPercentage: number;
  totalRentPerAnnum: number;
}

export interface ParkingDetails {
  fourWheelerSpaces: number;
  twoWheelerSpaces: number;
  additionalCost: boolean;
}

export interface SelectionCriteria {
  notUnderSublease: boolean;
  originalAgreementCopyRetained: boolean;
  notInLowLyingArea: boolean;
  hasSprinklerSystem: boolean;
  hasHydrantSystem: boolean;
  hasStructuralStabilityCertificate: boolean;
  hasFASSystem: string;
  numberOfFireExits: number;
  rentFreePeriodDays: number;
  agreementRegistrationSplit: string;
  leasePeriodYears: number;
  terminationFromLesseeSide: boolean;
  terminationNoticePeriodMonths: number;
  lockInPeriodMonths: number;
  glowSignBoardPermission: string;
  shutterProvision: string;
  safetyGrillProvision: string;
  flooringType: string;
  numberOfLifts: number;
  liftLicenseStatus: string;
  distanceToPublicTransport: string;
  electricityConnection: string;
  electricityKW: number;
  hasDedicatedEarthing: boolean;
  electricityMeterProvided: boolean;
  stayPermissionForWorkers: string;
  interiorWorkPermission: string;
  dgPowerBackup: string;
  dgSpaceProvision: string;
  antennaInstallationPermission: string;
  washroomDetails: string;
  acODUPlatform: string;
  windowReplacement: string;
  parkingDetails: ParkingDetails;
}

export interface BuildingFeatures {
  salientFeatures: string[];
  otherOccupants: string[];
  gstDetails: string;
  taxResponsibility: string;
}

export interface Property {
  _id: string;
  landlordId: Landlord;
  propertyDetails: PropertyDetails;
  media: Media;
  commercialTerms: CommercialTerms;
  selectionCriteria: SelectionCriteria;
  buildingFeatures: BuildingFeatures;
  status: string;
  isActive: boolean;
  viewCount: number;
  inquiryCount: number;
  tags: string[];
  propertyType: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PropertyFilterDto {
  page?: number;
  limit?: number;
  propertyType?: string;
  minRent?: number;
  maxRent?: number;
  location?: string;
  carpetAreaMin?: number;
  carpetAreaMax?: number;
  parkingRequired?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PropertiesResponse {
  properties: Property[];
  total: number;
  page: number;
  totalPages: number;
}
