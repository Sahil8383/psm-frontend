import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  PropertyDetails,
  Media,
  CommercialTerms,
  SelectionCriteria,
  BuildingFeatures,
  ParkingDetails,
} from "../types/property";

export interface PropertyFormState {
  // Property Details
  propertyDetails: PropertyDetails;

  // Media
  media: Media;

  // Commercial Terms
  commercialTerms: CommercialTerms;

  // Selection Criteria
  selectionCriteria: SelectionCriteria;

  // Building Features
  buildingFeatures: BuildingFeatures;

  // Additional fields
  tags: string[];
  propertyType: "commercial" | "residential" | "mixed";

  // Form state
  currentTab: number;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

const initialLessorDetail = {
  name: "",
  propertyHoldingPercentage: 0,
};

const initialPropertyDetails: PropertyDetails = {
  landlordName: "",
  landlordContact: "",
  landlordEmail: "",
  numberOfLessors: 1,
  lessorDetails: [initialLessorDetail],
  buildingName: "",
  completeAddress: "",
  pinCode: "",
  carpetArea: 0,
  chargeableArea: 0,
  propertyVintageYears: 0,
};

const initialMedia: Media = {
  images: [],
  videos: [],
  documents: [],
};

const initialCommercialTerms: CommercialTerms = {
  advanceRentRequired: false,
  monthlyRentPerSqFt: 0,
  maintenanceChargesPerSqFt: 0,
  monthlyRent: 0,
  monthlyMaintenance: 0,
  totalMonthlyAmount: 0,
  securityDepositMonths: 0,
  securityDepositAmount: 0,
  rentEscalationPercentage: 0,
  totalRentPerAnnum: 0,
};

const initialParkingDetails: ParkingDetails = {
  fourWheelerSpaces: 0,
  twoWheelerSpaces: 0,
  additionalCost: false,
};

const initialSelectionCriteria: SelectionCriteria = {
  notUnderSublease: false,
  originalAgreementCopyRetained: false,
  notInLowLyingArea: false,
  hasSprinklerSystem: false,
  hasHydrantSystem: false,
  hasStructuralStabilityCertificate: false,
  hasFASSystem: "",
  numberOfFireExits: 0,
  rentFreePeriodDays: 0,
  agreementRegistrationSplit: "",
  leasePeriodYears: 0,
  terminationFromLesseeSide: false,
  terminationNoticePeriodMonths: 0,
  lockInPeriodMonths: 0,
  glowSignBoardPermission: "",
  shutterProvision: "",
  safetyGrillProvision: "",
  flooringType: "",
  numberOfLifts: 0,
  liftLicenseStatus: "",
  distanceToPublicTransport: "",
  electricityConnection: "",
  electricityKW: 0,
  hasDedicatedEarthing: false,
  electricityMeterProvided: false,
  stayPermissionForWorkers: "",
  interiorWorkPermission: "",
  dgPowerBackup: "",
  dgSpaceProvision: "",
  antennaInstallationPermission: "",
  washroomDetails: "",
  acODUPlatform: "",
  windowReplacement: "",
  parkingDetails: initialParkingDetails,
};

const initialBuildingFeatures: BuildingFeatures = {
  salientFeatures: [],
  otherOccupants: [],
  gstDetails: "",
  taxResponsibility: "",
};

const initialState: PropertyFormState = {
  propertyDetails: initialPropertyDetails,
  media: initialMedia,
  commercialTerms: initialCommercialTerms,
  selectionCriteria: initialSelectionCriteria,
  buildingFeatures: initialBuildingFeatures,
  tags: [],
  propertyType: "commercial",
  currentTab: 0,
  isSubmitting: false,
  errors: {},
};

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    // Property Details actions
    updatePropertyDetails: (
      state,
      action: PayloadAction<Partial<PropertyDetails>>
    ) => {
      state.propertyDetails = { ...state.propertyDetails, ...action.payload };
    },

    updateLessorDetail: (
      state,
      action: PayloadAction<{
        index: number;
        lessorDetail: Partial<PropertyDetails["lessorDetails"][0]>;
      }>
    ) => {
      const { index, lessorDetail } = action.payload;
      if (state.propertyDetails.lessorDetails[index]) {
        state.propertyDetails.lessorDetails[index] = {
          ...state.propertyDetails.lessorDetails[index],
          ...lessorDetail,
        };
      }
    },

    addLessorDetail: (state) => {
      state.propertyDetails.lessorDetails.push(initialLessorDetail);
    },

    removeLessorDetail: (state, action: PayloadAction<number>) => {
      state.propertyDetails.lessorDetails.splice(action.payload, 1);
    },

    // Media actions
    updateMedia: (state, action: PayloadAction<Partial<Media>>) => {
      state.media = { ...state.media, ...action.payload };
    },

    // Commercial Terms actions
    updateCommercialTerms: (
      state,
      action: PayloadAction<Partial<CommercialTerms>>
    ) => {
      state.commercialTerms = { ...state.commercialTerms, ...action.payload };
    },

    // Selection Criteria actions
    updateSelectionCriteria: (
      state,
      action: PayloadAction<Partial<SelectionCriteria>>
    ) => {
      state.selectionCriteria = {
        ...state.selectionCriteria,
        ...action.payload,
      };
    },

    updateParkingDetails: (
      state,
      action: PayloadAction<Partial<ParkingDetails>>
    ) => {
      state.selectionCriteria.parkingDetails = {
        ...state.selectionCriteria.parkingDetails,
        ...action.payload,
      };
    },

    // Building Features actions
    updateBuildingFeatures: (
      state,
      action: PayloadAction<Partial<BuildingFeatures>>
    ) => {
      state.buildingFeatures = { ...state.buildingFeatures, ...action.payload };
    },

    // General actions
    updatePropertyType: (
      state,
      action: PayloadAction<"commercial" | "residential" | "mixed">
    ) => {
      state.propertyType = action.payload;
    },

    updateTags: (state, action: PayloadAction<string[]>) => {
      state.tags = action.payload;
    },

    setCurrentTab: (state, action: PayloadAction<number>) => {
      state.currentTab = action.payload;
    },

    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },

    setErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.errors = action.payload;
    },

    clearError: (state, action: PayloadAction<string>) => {
      delete state.errors[action.payload];
    },

    clearAllErrors: (state) => {
      state.errors = {};
    },

    resetForm: () => {
      return initialState;
    },
  },
});

export const {
  updatePropertyDetails,
  updateLessorDetail,
  addLessorDetail,
  removeLessorDetail,
  updateMedia,
  updateCommercialTerms,
  updateSelectionCriteria,
  updateParkingDetails,
  updateBuildingFeatures,
  updatePropertyType,
  updateTags,
  setCurrentTab,
  setSubmitting,
  setErrors,
  clearError,
  clearAllErrors,
  resetForm,
} = propertySlice.actions;

export default propertySlice.reducer;
