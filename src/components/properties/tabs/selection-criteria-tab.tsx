"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  updateSelectionCriteria,
  updateParkingDetails,
  clearError,
} from "@/lib/slices/propertySlice";
import { selectionCriteriaSchema } from "@/lib/schemas/propertySchemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  AlertCircle,
  Car,
  Building,
  Zap,
  Calendar,
  FileText,
  CheckCircle,
} from "lucide-react";

const SelectionCriteriaTab: React.FC = () => {
  const dispatch = useDispatch();
  const { selectionCriteria, errors } = useSelector(
    (state: RootState) => state.property
  );

  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  // Validate form data
  const validateForm = useCallback(() => {
    try {
      selectionCriteriaSchema.parse(selectionCriteria);
      setLocalErrors({});
      return true;
    } catch (error: unknown) {
      const newErrors: Record<string, string> = {};
      if (error && typeof error === "object" && "errors" in error) {
        const zodError = error as {
          errors: Array<{ path: string[]; message: string }>;
        };
        zodError.errors.forEach((err) => {
          const fieldPath = err.path.join(".");
          newErrors[fieldPath] = err.message;
        });
      }
      setLocalErrors(newErrors);
      return false;
    }
  }, [selectionCriteria]);

  // Handle input changes
  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    dispatch(updateSelectionCriteria({ [field]: value }));
    dispatch(clearError(field));

    // Clear local error for this field
    if (localErrors[field]) {
      setLocalErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle parking details changes
  const handleParkingChange = (
    field: string,
    value: string | number | boolean
  ) => {
    dispatch(updateParkingDetails({ [field]: value }));
    dispatch(clearError(`parkingDetails.${field}`));

    // Clear local error for this field
    if (localErrors[`parkingDetails.${field}`]) {
      setLocalErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`parkingDetails.${field}`];
        return newErrors;
      });
    }
  };

  // Validate on component mount and when data changes
  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const getFieldError = (field: string) => {
    return errors[field] || localErrors[field];
  };

  const hasErrors = Object.keys(localErrors).length > 0;

  return (
    <div className="space-y-6">
      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fix the validation errors below before proceeding.
          </AlertDescription>
        </Alert>
      )}

      {/* Basic Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Basic Requirements
          </CardTitle>
          <CardDescription>
            Fundamental property requirements and conditions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="notUnderSublease"
                checked={selectionCriteria.notUnderSublease}
                onCheckedChange={(checked) =>
                  handleInputChange("notUnderSublease", checked)
                }
              />
              <Label htmlFor="notUnderSublease">Not under sublease</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="originalAgreementCopyRetained"
                checked={selectionCriteria.originalAgreementCopyRetained}
                onCheckedChange={(checked) =>
                  handleInputChange("originalAgreementCopyRetained", checked)
                }
              />
              <Label htmlFor="originalAgreementCopyRetained">
                Original agreement copy retained
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="notInLowLyingArea"
                checked={selectionCriteria.notInLowLyingArea}
                onCheckedChange={(checked) =>
                  handleInputChange("notInLowLyingArea", checked)
                }
              />
              <Label htmlFor="notInLowLyingArea">Not in low lying area</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="hasStructuralStabilityCertificate"
                checked={selectionCriteria.hasStructuralStabilityCertificate}
                onCheckedChange={(checked) =>
                  handleInputChange(
                    "hasStructuralStabilityCertificate",
                    checked
                  )
                }
              />
              <Label htmlFor="hasStructuralStabilityCertificate">
                Has structural stability certificate
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Safety Features
          </CardTitle>
          <CardDescription>Fire safety and emergency systems</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="hasSprinklerSystem"
                checked={selectionCriteria.hasSprinklerSystem}
                onCheckedChange={(checked) =>
                  handleInputChange("hasSprinklerSystem", checked)
                }
              />
              <Label htmlFor="hasSprinklerSystem">Has sprinkler system</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="hasHydrantSystem"
                checked={selectionCriteria.hasHydrantSystem}
                onCheckedChange={(checked) =>
                  handleInputChange("hasHydrantSystem", checked)
                }
              />
              <Label htmlFor="hasHydrantSystem">Has hydrant system</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hasFASSystem">Fire Alarm System (FAS) *</Label>
            <Select
              value={selectionCriteria.hasFASSystem}
              onValueChange={(value) =>
                handleInputChange("hasFASSystem", value)
              }
            >
              <SelectTrigger
                className={
                  getFieldError("hasFASSystem") ? "border-red-500" : ""
                }
              >
                <SelectValue placeholder="Select FAS system status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Not Available">Not Available</SelectItem>
                <SelectItem value="Under Installation">
                  Under Installation
                </SelectItem>
                <SelectItem value="Needs Repair">Needs Repair</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("hasFASSystem") && (
              <p className="text-sm text-red-500">
                {getFieldError("hasFASSystem")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfFireExits">Number of Fire Exits *</Label>
            <Input
              id="numberOfFireExits"
              type="number"
              min="0"
              value={selectionCriteria.numberOfFireExits}
              onChange={(e) =>
                handleInputChange(
                  "numberOfFireExits",
                  parseInt(e.target.value) || 0
                )
              }
              placeholder="Enter number of fire exits"
              className={
                getFieldError("numberOfFireExits") ? "border-red-500" : ""
              }
            />
            {getFieldError("numberOfFireExits") && (
              <p className="text-sm text-red-500">
                {getFieldError("numberOfFireExits")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lease Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Lease Terms
          </CardTitle>
          <CardDescription>
            Lease period, termination, and lock-in conditions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leasePeriodYears">Lease Period (Years) *</Label>
              <Input
                id="leasePeriodYears"
                type="number"
                min="0"
                value={selectionCriteria.leasePeriodYears}
                onChange={(e) =>
                  handleInputChange(
                    "leasePeriodYears",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="Enter lease period in years"
                className={
                  getFieldError("leasePeriodYears") ? "border-red-500" : ""
                }
              />
              {getFieldError("leasePeriodYears") && (
                <p className="text-sm text-red-500">
                  {getFieldError("leasePeriodYears")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rentFreePeriodDays">
                Rent Free Period (Days) *
              </Label>
              <Input
                id="rentFreePeriodDays"
                type="number"
                min="0"
                value={selectionCriteria.rentFreePeriodDays}
                onChange={(e) =>
                  handleInputChange(
                    "rentFreePeriodDays",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="Enter rent free period in days"
                className={
                  getFieldError("rentFreePeriodDays") ? "border-red-500" : ""
                }
              />
              {getFieldError("rentFreePeriodDays") && (
                <p className="text-sm text-red-500">
                  {getFieldError("rentFreePeriodDays")}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agreementRegistrationSplit">
              Agreement Registration Split *
            </Label>
            <Select
              value={selectionCriteria.agreementRegistrationSplit}
              onValueChange={(value) =>
                handleInputChange("agreementRegistrationSplit", value)
              }
            >
              <SelectTrigger
                className={
                  getFieldError("agreementRegistrationSplit")
                    ? "border-red-500"
                    : ""
                }
              >
                <SelectValue placeholder="Select registration split" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Landlord">Landlord</SelectItem>
                <SelectItem value="Tenant">Tenant</SelectItem>
                <SelectItem value="50-50 Split">50-50 Split</SelectItem>
                <SelectItem value="As per agreement">
                  As per agreement
                </SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("agreementRegistrationSplit") && (
              <p className="text-sm text-red-500">
                {getFieldError("agreementRegistrationSplit")}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="terminationFromLesseeSide"
              checked={selectionCriteria.terminationFromLesseeSide}
              onCheckedChange={(checked) =>
                handleInputChange("terminationFromLesseeSide", checked)
              }
            />
            <Label htmlFor="terminationFromLesseeSide">
              Termination allowed from lessee side
            </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="terminationNoticePeriodMonths">
                Termination Notice Period (Months) *
              </Label>
              <Input
                id="terminationNoticePeriodMonths"
                type="number"
                min="0"
                value={selectionCriteria.terminationNoticePeriodMonths}
                onChange={(e) =>
                  handleInputChange(
                    "terminationNoticePeriodMonths",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="Enter notice period in months"
                className={
                  getFieldError("terminationNoticePeriodMonths")
                    ? "border-red-500"
                    : ""
                }
              />
              {getFieldError("terminationNoticePeriodMonths") && (
                <p className="text-sm text-red-500">
                  {getFieldError("terminationNoticePeriodMonths")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lockInPeriodMonths">
                Lock-in Period (Months) *
              </Label>
              <Input
                id="lockInPeriodMonths"
                type="number"
                min="0"
                value={selectionCriteria.lockInPeriodMonths}
                onChange={(e) =>
                  handleInputChange(
                    "lockInPeriodMonths",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="Enter lock-in period in months"
                className={
                  getFieldError("lockInPeriodMonths") ? "border-red-500" : ""
                }
              />
              {getFieldError("lockInPeriodMonths") && (
                <p className="text-sm text-red-500">
                  {getFieldError("lockInPeriodMonths")}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Building Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Building Features
          </CardTitle>
          <CardDescription>Building amenities and facilities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numberOfLifts">Number of Lifts *</Label>
              <Input
                id="numberOfLifts"
                type="number"
                min="0"
                value={selectionCriteria.numberOfLifts}
                onChange={(e) =>
                  handleInputChange(
                    "numberOfLifts",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="Enter number of lifts"
                className={
                  getFieldError("numberOfLifts") ? "border-red-500" : ""
                }
              />
              {getFieldError("numberOfLifts") && (
                <p className="text-sm text-red-500">
                  {getFieldError("numberOfLifts")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="liftLicenseStatus">Lift License Status *</Label>
              <Select
                value={selectionCriteria.liftLicenseStatus}
                onValueChange={(value) =>
                  handleInputChange("liftLicenseStatus", value)
                }
              >
                <SelectTrigger
                  className={
                    getFieldError("liftLicenseStatus") ? "border-red-500" : ""
                  }
                >
                  <SelectValue placeholder="Select lift license status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Valid">Valid</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Under Renewal">Under Renewal</SelectItem>
                  <SelectItem value="Not Available">Not Available</SelectItem>
                </SelectContent>
              </Select>
              {getFieldError("liftLicenseStatus") && (
                <p className="text-sm text-red-500">
                  {getFieldError("liftLicenseStatus")}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="flooringType">Flooring Type *</Label>
            <Select
              value={selectionCriteria.flooringType}
              onValueChange={(value) =>
                handleInputChange("flooringType", value)
              }
            >
              <SelectTrigger
                className={
                  getFieldError("flooringType") ? "border-red-500" : ""
                }
              >
                <SelectValue placeholder="Select flooring type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Marble">Marble</SelectItem>
                <SelectItem value="Granite">Granite</SelectItem>
                <SelectItem value="Vitrified Tiles">Vitrified Tiles</SelectItem>
                <SelectItem value="Cement">Cement</SelectItem>
                <SelectItem value="Wooden">Wooden</SelectItem>
                <SelectItem value="Carpet">Carpet</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("flooringType") && (
              <p className="text-sm text-red-500">
                {getFieldError("flooringType")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="distanceToPublicTransport">
              Distance to Public Transport *
            </Label>
            <Select
              value={selectionCriteria.distanceToPublicTransport}
              onValueChange={(value) =>
                handleInputChange("distanceToPublicTransport", value)
              }
            >
              <SelectTrigger
                className={
                  getFieldError("distanceToPublicTransport")
                    ? "border-red-500"
                    : ""
                }
              >
                <SelectValue placeholder="Select distance to public transport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Less than 100m">Less than 100m</SelectItem>
                <SelectItem value="100m - 500m">100m - 500m</SelectItem>
                <SelectItem value="500m - 1km">500m - 1km</SelectItem>
                <SelectItem value="1km - 2km">1km - 2km</SelectItem>
                <SelectItem value="More than 2km">More than 2km</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("distanceToPublicTransport") && (
              <p className="text-sm text-red-500">
                {getFieldError("distanceToPublicTransport")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Electrical Systems */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Electrical Systems
          </CardTitle>
          <CardDescription>
            Power supply and electrical infrastructure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="electricityConnection">
              Electricity Connection *
            </Label>
            <Select
              value={selectionCriteria.electricityConnection}
              onValueChange={(value) =>
                handleInputChange("electricityConnection", value)
              }
            >
              <SelectTrigger
                className={
                  getFieldError("electricityConnection") ? "border-red-500" : ""
                }
              >
                <SelectValue placeholder="Select electricity connection type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single Phase">Single Phase</SelectItem>
                <SelectItem value="Three Phase">Three Phase</SelectItem>
                <SelectItem value="High Tension">High Tension</SelectItem>
                <SelectItem value="Not Available">Not Available</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("electricityConnection") && (
              <p className="text-sm text-red-500">
                {getFieldError("electricityConnection")}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="electricityKW">Electricity Load (KW) *</Label>
              <Input
                id="electricityKW"
                type="number"
                min="0"
                step="0.1"
                value={selectionCriteria.electricityKW}
                onChange={(e) =>
                  handleInputChange(
                    "electricityKW",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="Enter electricity load in KW"
                className={
                  getFieldError("electricityKW") ? "border-red-500" : ""
                }
              />
              {getFieldError("electricityKW") && (
                <p className="text-sm text-red-500">
                  {getFieldError("electricityKW")}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="hasDedicatedEarthing"
                checked={selectionCriteria.hasDedicatedEarthing}
                onCheckedChange={(checked) =>
                  handleInputChange("hasDedicatedEarthing", checked)
                }
              />
              <Label htmlFor="hasDedicatedEarthing">
                Has dedicated earthing
              </Label>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="electricityMeterProvided"
              checked={selectionCriteria.electricityMeterProvided}
              onCheckedChange={(checked) =>
                handleInputChange("electricityMeterProvided", checked)
              }
            />
            <Label htmlFor="electricityMeterProvided">
              Electricity meter provided
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Permissions and Provisions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Permissions and Provisions
          </CardTitle>
          <CardDescription>
            Various permissions and provisions for the property
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="glowSignBoardPermission">
                Glow Sign Board Permission *
              </Label>
              <Select
                value={selectionCriteria.glowSignBoardPermission}
                onValueChange={(value) =>
                  handleInputChange("glowSignBoardPermission", value)
                }
              >
                <SelectTrigger
                  className={
                    getFieldError("glowSignBoardPermission")
                      ? "border-red-500"
                      : ""
                  }
                >
                  <SelectValue placeholder="Select sign board permission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Allowed">Allowed</SelectItem>
                  <SelectItem value="Not Allowed">Not Allowed</SelectItem>
                  <SelectItem value="With Conditions">
                    With Conditions
                  </SelectItem>
                  <SelectItem value="To be discussed">
                    To be discussed
                  </SelectItem>
                </SelectContent>
              </Select>
              {getFieldError("glowSignBoardPermission") && (
                <p className="text-sm text-red-500">
                  {getFieldError("glowSignBoardPermission")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shutterProvision">Shutter Provision *</Label>
              <Select
                value={selectionCriteria.shutterProvision}
                onValueChange={(value) =>
                  handleInputChange("shutterProvision", value)
                }
              >
                <SelectTrigger
                  className={
                    getFieldError("shutterProvision") ? "border-red-500" : ""
                  }
                >
                  <SelectValue placeholder="Select shutter provision" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Provided">Provided</SelectItem>
                  <SelectItem value="Not Provided">Not Provided</SelectItem>
                  <SelectItem value="To be installed by tenant">
                    To be installed by tenant
                  </SelectItem>
                  <SelectItem value="Cost sharing">Cost sharing</SelectItem>
                </SelectContent>
              </Select>
              {getFieldError("shutterProvision") && (
                <p className="text-sm text-red-500">
                  {getFieldError("shutterProvision")}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="safetyGrillProvision">
                Safety Grill Provision *
              </Label>
              <Select
                value={selectionCriteria.safetyGrillProvision}
                onValueChange={(value) =>
                  handleInputChange("safetyGrillProvision", value)
                }
              >
                <SelectTrigger
                  className={
                    getFieldError("safetyGrillProvision")
                      ? "border-red-500"
                      : ""
                  }
                >
                  <SelectValue placeholder="Select safety grill provision" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Provided">Provided</SelectItem>
                  <SelectItem value="Not Provided">Not Provided</SelectItem>
                  <SelectItem value="To be installed by tenant">
                    To be installed by tenant
                  </SelectItem>
                  <SelectItem value="Cost sharing">Cost sharing</SelectItem>
                </SelectContent>
              </Select>
              {getFieldError("safetyGrillProvision") && (
                <p className="text-sm text-red-500">
                  {getFieldError("safetyGrillProvision")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="windowReplacement">Window Replacement *</Label>
              <Select
                value={selectionCriteria.windowReplacement}
                onValueChange={(value) =>
                  handleInputChange("windowReplacement", value)
                }
              >
                <SelectTrigger
                  className={
                    getFieldError("windowReplacement") ? "border-red-500" : ""
                  }
                >
                  <SelectValue placeholder="Select window replacement policy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Allowed">Allowed</SelectItem>
                  <SelectItem value="Not Allowed">Not Allowed</SelectItem>
                  <SelectItem value="With Approval">With Approval</SelectItem>
                  <SelectItem value="Cost sharing">Cost sharing</SelectItem>
                </SelectContent>
              </Select>
              {getFieldError("windowReplacement") && (
                <p className="text-sm text-red-500">
                  {getFieldError("windowReplacement")}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stayPermissionForWorkers">
                Stay Permission for Workers *
              </Label>
              <Select
                value={selectionCriteria.stayPermissionForWorkers}
                onValueChange={(value) =>
                  handleInputChange("stayPermissionForWorkers", value)
                }
              >
                <SelectTrigger
                  className={
                    getFieldError("stayPermissionForWorkers")
                      ? "border-red-500"
                      : ""
                  }
                >
                  <SelectValue placeholder="Select worker stay permission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Allowed">Allowed</SelectItem>
                  <SelectItem value="Not Allowed">Not Allowed</SelectItem>
                  <SelectItem value="With Conditions">
                    With Conditions
                  </SelectItem>
                  <SelectItem value="Limited Period">Limited Period</SelectItem>
                </SelectContent>
              </Select>
              {getFieldError("stayPermissionForWorkers") && (
                <p className="text-sm text-red-500">
                  {getFieldError("stayPermissionForWorkers")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="interiorWorkPermission">
                Interior Work Permission *
              </Label>
              <Select
                value={selectionCriteria.interiorWorkPermission}
                onValueChange={(value) =>
                  handleInputChange("interiorWorkPermission", value)
                }
              >
                <SelectTrigger
                  className={
                    getFieldError("interiorWorkPermission")
                      ? "border-red-500"
                      : ""
                  }
                >
                  <SelectValue placeholder="Select interior work permission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Allowed">Allowed</SelectItem>
                  <SelectItem value="Not Allowed">Not Allowed</SelectItem>
                  <SelectItem value="With Approval">With Approval</SelectItem>
                  <SelectItem value="Limited Scope">Limited Scope</SelectItem>
                </SelectContent>
              </Select>
              {getFieldError("interiorWorkPermission") && (
                <p className="text-sm text-red-500">
                  {getFieldError("interiorWorkPermission")}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Power Backup and Utilities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Power Backup and Utilities
          </CardTitle>
          <CardDescription>
            DG power backup and utility provisions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dgPowerBackup">DG Power Backup *</Label>
              <Select
                value={selectionCriteria.dgPowerBackup}
                onValueChange={(value) =>
                  handleInputChange("dgPowerBackup", value)
                }
              >
                <SelectTrigger
                  className={
                    getFieldError("dgPowerBackup") ? "border-red-500" : ""
                  }
                >
                  <SelectValue placeholder="Select DG power backup" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Not Available">Not Available</SelectItem>
                  <SelectItem value="Under Installation">
                    Under Installation
                  </SelectItem>
                  <SelectItem value="Needs Repair">Needs Repair</SelectItem>
                </SelectContent>
              </Select>
              {getFieldError("dgPowerBackup") && (
                <p className="text-sm text-red-500">
                  {getFieldError("dgPowerBackup")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dgSpaceProvision">DG Space Provision *</Label>
              <Select
                value={selectionCriteria.dgSpaceProvision}
                onValueChange={(value) =>
                  handleInputChange("dgSpaceProvision", value)
                }
              >
                <SelectTrigger
                  className={
                    getFieldError("dgSpaceProvision") ? "border-red-500" : ""
                  }
                >
                  <SelectValue placeholder="Select DG space provision" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Provided">Provided</SelectItem>
                  <SelectItem value="Not Provided">Not Provided</SelectItem>
                  <SelectItem value="To be arranged">To be arranged</SelectItem>
                  <SelectItem value="Cost sharing">Cost sharing</SelectItem>
                </SelectContent>
              </Select>
              {getFieldError("dgSpaceProvision") && (
                <p className="text-sm text-red-500">
                  {getFieldError("dgSpaceProvision")}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="antennaInstallationPermission">
                Antenna Installation Permission *
              </Label>
              <Select
                value={selectionCriteria.antennaInstallationPermission}
                onValueChange={(value) =>
                  handleInputChange("antennaInstallationPermission", value)
                }
              >
                <SelectTrigger
                  className={
                    getFieldError("antennaInstallationPermission")
                      ? "border-red-500"
                      : ""
                  }
                >
                  <SelectValue placeholder="Select antenna installation permission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Allowed">Allowed</SelectItem>
                  <SelectItem value="Not Allowed">Not Allowed</SelectItem>
                  <SelectItem value="With Approval">With Approval</SelectItem>
                  <SelectItem value="Designated Area">
                    Designated Area
                  </SelectItem>
                </SelectContent>
              </Select>
              {getFieldError("antennaInstallationPermission") && (
                <p className="text-sm text-red-500">
                  {getFieldError("antennaInstallationPermission")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="acODUPlatform">AC ODU Platform *</Label>
              <Select
                value={selectionCriteria.acODUPlatform}
                onValueChange={(value) =>
                  handleInputChange("acODUPlatform", value)
                }
              >
                <SelectTrigger
                  className={
                    getFieldError("acODUPlatform") ? "border-red-500" : ""
                  }
                >
                  <SelectValue placeholder="Select AC ODU platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Provided">Provided</SelectItem>
                  <SelectItem value="Not Provided">Not Provided</SelectItem>
                  <SelectItem value="To be installed">
                    To be installed
                  </SelectItem>
                  <SelectItem value="Cost sharing">Cost sharing</SelectItem>
                </SelectContent>
              </Select>
              {getFieldError("acODUPlatform") && (
                <p className="text-sm text-red-500">
                  {getFieldError("acODUPlatform")}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="washroomDetails">Washroom Details *</Label>
            <Select
              value={selectionCriteria.washroomDetails}
              onValueChange={(value) =>
                handleInputChange("washroomDetails", value)
              }
            >
              <SelectTrigger
                className={
                  getFieldError("washroomDetails") ? "border-red-500" : ""
                }
              >
                <SelectValue placeholder="Select washroom details" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Not Available">Not Available</SelectItem>
                <SelectItem value="To be constructed">
                  To be constructed
                </SelectItem>
                <SelectItem value="Shared">Shared</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("washroomDetails") && (
              <p className="text-sm text-red-500">
                {getFieldError("washroomDetails")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Parking Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Parking Details
          </CardTitle>
          <CardDescription>Parking spaces and associated costs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fourWheelerSpaces">Four Wheeler Spaces *</Label>
              <Input
                id="fourWheelerSpaces"
                type="number"
                min="0"
                value={selectionCriteria.parkingDetails.fourWheelerSpaces}
                onChange={(e) =>
                  handleParkingChange(
                    "fourWheelerSpaces",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="Enter number of four wheeler spaces"
                className={
                  getFieldError("parkingDetails.fourWheelerSpaces")
                    ? "border-red-500"
                    : ""
                }
              />
              {getFieldError("parkingDetails.fourWheelerSpaces") && (
                <p className="text-sm text-red-500">
                  {getFieldError("parkingDetails.fourWheelerSpaces")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="twoWheelerSpaces">Two Wheeler Spaces *</Label>
              <Input
                id="twoWheelerSpaces"
                type="number"
                min="0"
                value={selectionCriteria.parkingDetails.twoWheelerSpaces}
                onChange={(e) =>
                  handleParkingChange(
                    "twoWheelerSpaces",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="Enter number of two wheeler spaces"
                className={
                  getFieldError("parkingDetails.twoWheelerSpaces")
                    ? "border-red-500"
                    : ""
                }
              />
              {getFieldError("parkingDetails.twoWheelerSpaces") && (
                <p className="text-sm text-red-500">
                  {getFieldError("parkingDetails.twoWheelerSpaces")}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="additionalCost"
              checked={selectionCriteria.parkingDetails.additionalCost}
              onCheckedChange={(checked) =>
                handleParkingChange("additionalCost", checked)
              }
            />
            <Label htmlFor="additionalCost">Additional cost for parking</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectionCriteriaTab;
