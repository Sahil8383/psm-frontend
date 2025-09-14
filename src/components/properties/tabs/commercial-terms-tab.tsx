"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { updateCommercialTerms, clearError } from "@/lib/slices/propertySlice";
import { commercialTermsSchema } from "@/lib/schemas/propertySchemas";
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
  Calculator,
  AlertCircle,
  Info,
  IndianRupee,
  Percent,
  Calendar,
} from "lucide-react";

const CommercialTermsTab: React.FC = () => {
  const dispatch = useDispatch();
  const { commercialTerms, propertyDetails, errors } = useSelector(
    (state: RootState) => state.property
  );

  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [autoCalculate, setAutoCalculate] = useState(true);

  // Calculate derived values
  const calculateDerivedValues = useCallback(() => {
    if (!autoCalculate || !propertyDetails.chargeableArea) return;

    const monthlyRent =
      commercialTerms.monthlyRentPerSqFt * propertyDetails.chargeableArea;
    const monthlyMaintenance =
      commercialTerms.maintenanceChargesPerSqFt *
      propertyDetails.chargeableArea;
    const totalMonthlyAmount = monthlyRent + monthlyMaintenance;
    const securityDepositAmount =
      monthlyRent * commercialTerms.securityDepositMonths;
    const totalRentPerAnnum = monthlyRent * 12;

    dispatch(
      updateCommercialTerms({
        monthlyRent,
        monthlyMaintenance,
        totalMonthlyAmount,
        securityDepositAmount,
        totalRentPerAnnum,
      })
    );
  }, [
    autoCalculate,
    propertyDetails.chargeableArea,
    commercialTerms.monthlyRentPerSqFt,
    commercialTerms.maintenanceChargesPerSqFt,
    commercialTerms.securityDepositMonths,
    dispatch,
  ]);

  // Auto-calculate when dependencies change
  useEffect(() => {
    calculateDerivedValues();
  }, [calculateDerivedValues]);

  // Validate form data
  const validateForm = useCallback(() => {
    try {
      commercialTermsSchema.parse(commercialTerms);
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
  }, [commercialTerms]);

  // Handle input changes
  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    dispatch(updateCommercialTerms({ [field]: value }));
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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
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

      {/* Auto-calculation Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calculation Settings
          </CardTitle>
          <CardDescription>
            Enable automatic calculations based on area and rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-calculate"
              checked={autoCalculate}
              onCheckedChange={setAutoCalculate}
            />
            <Label htmlFor="auto-calculate">
              Auto-calculate rent and maintenance based on area
            </Label>
          </div>
          {autoCalculate && propertyDetails.chargeableArea && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <Info className="h-4 w-4 inline mr-1" />
                Calculations will be based on chargeable area:{" "}
                {propertyDetails.chargeableArea} sq ft
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rent Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5" />
            Rent Details
          </CardTitle>
          <CardDescription>Monthly rent rates and calculations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyRentPerSqFt">
                Monthly Rent per Sq Ft *
              </Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="monthlyRentPerSqFt"
                  type="number"
                  min="0"
                  step="0.01"
                  value={commercialTerms.monthlyRentPerSqFt}
                  onChange={(e) =>
                    handleInputChange(
                      "monthlyRentPerSqFt",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="Enter rent per sq ft"
                  className={`pl-10 ${
                    getFieldError("monthlyRentPerSqFt") ? "border-red-500" : ""
                  }`}
                />
              </div>
              {getFieldError("monthlyRentPerSqFt") && (
                <p className="text-sm text-red-500">
                  {getFieldError("monthlyRentPerSqFt")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyRent">Total Monthly Rent *</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="monthlyRent"
                  type="number"
                  min="0"
                  value={commercialTerms.monthlyRent}
                  onChange={(e) =>
                    handleInputChange(
                      "monthlyRent",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="Enter total monthly rent"
                  className={`pl-10 ${
                    getFieldError("monthlyRent") ? "border-red-500" : ""
                  } ${autoCalculate ? "bg-gray-50" : ""}`}
                  disabled={autoCalculate}
                />
              </div>
              {getFieldError("monthlyRent") && (
                <p className="text-sm text-red-500">
                  {getFieldError("monthlyRent")}
                </p>
              )}
              {autoCalculate && (
                <p className="text-xs text-gray-500">
                  Auto-calculated: {formatCurrency(commercialTerms.monthlyRent)}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalRentPerAnnum">Total Rent per Annum *</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="totalRentPerAnnum"
                type="number"
                min="0"
                value={commercialTerms.totalRentPerAnnum}
                onChange={(e) =>
                  handleInputChange(
                    "totalRentPerAnnum",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="Enter total annual rent"
                className={`pl-10 ${
                  getFieldError("totalRentPerAnnum") ? "border-red-500" : ""
                } ${autoCalculate ? "bg-gray-50" : ""}`}
                disabled={autoCalculate}
              />
            </div>
            {getFieldError("totalRentPerAnnum") && (
              <p className="text-sm text-red-500">
                {getFieldError("totalRentPerAnnum")}
              </p>
            )}
            {autoCalculate && (
              <p className="text-xs text-gray-500">
                Auto-calculated:{" "}
                {formatCurrency(commercialTerms.totalRentPerAnnum)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Maintenance Details
          </CardTitle>
          <CardDescription>
            Monthly maintenance charges and calculations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maintenanceChargesPerSqFt">
                Maintenance per Sq Ft *
              </Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="maintenanceChargesPerSqFt"
                  type="number"
                  min="0"
                  step="0.01"
                  value={commercialTerms.maintenanceChargesPerSqFt}
                  onChange={(e) =>
                    handleInputChange(
                      "maintenanceChargesPerSqFt",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="Enter maintenance per sq ft"
                  className={`pl-10 ${
                    getFieldError("maintenanceChargesPerSqFt")
                      ? "border-red-500"
                      : ""
                  }`}
                />
              </div>
              {getFieldError("maintenanceChargesPerSqFt") && (
                <p className="text-sm text-red-500">
                  {getFieldError("maintenanceChargesPerSqFt")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyMaintenance">
                Total Monthly Maintenance *
              </Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="monthlyMaintenance"
                  type="number"
                  min="0"
                  value={commercialTerms.monthlyMaintenance}
                  onChange={(e) =>
                    handleInputChange(
                      "monthlyMaintenance",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="Enter total monthly maintenance"
                  className={`pl-10 ${
                    getFieldError("monthlyMaintenance") ? "border-red-500" : ""
                  } ${autoCalculate ? "bg-gray-50" : ""}`}
                  disabled={autoCalculate}
                />
              </div>
              {getFieldError("monthlyMaintenance") && (
                <p className="text-sm text-red-500">
                  {getFieldError("monthlyMaintenance")}
                </p>
              )}
              {autoCalculate && (
                <p className="text-xs text-gray-500">
                  Auto-calculated:{" "}
                  {formatCurrency(commercialTerms.monthlyMaintenance)}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalMonthlyAmount">Total Monthly Amount *</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="totalMonthlyAmount"
                type="number"
                min="0"
                value={commercialTerms.totalMonthlyAmount}
                onChange={(e) =>
                  handleInputChange(
                    "totalMonthlyAmount",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="Enter total monthly amount"
                className={`pl-10 ${
                  getFieldError("totalMonthlyAmount") ? "border-red-500" : ""
                } ${autoCalculate ? "bg-gray-50" : ""}`}
                disabled={autoCalculate}
              />
            </div>
            {getFieldError("totalMonthlyAmount") && (
              <p className="text-sm text-red-500">
                {getFieldError("totalMonthlyAmount")}
              </p>
            )}
            {autoCalculate && (
              <p className="text-xs text-gray-500">
                Auto-calculated:{" "}
                {formatCurrency(commercialTerms.totalMonthlyAmount)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Deposit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5" />
            Security Deposit
          </CardTitle>
          <CardDescription>
            Security deposit terms and calculations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="securityDepositMonths">
                Security Deposit (Months) *
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="securityDepositMonths"
                  type="number"
                  min="0"
                  value={commercialTerms.securityDepositMonths}
                  onChange={(e) =>
                    handleInputChange(
                      "securityDepositMonths",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="Enter months"
                  className={`pl-10 ${
                    getFieldError("securityDepositMonths")
                      ? "border-red-500"
                      : ""
                  }`}
                />
              </div>
              {getFieldError("securityDepositMonths") && (
                <p className="text-sm text-red-500">
                  {getFieldError("securityDepositMonths")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="securityDepositAmount">
                Security Deposit Amount *
              </Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="securityDepositAmount"
                  type="number"
                  min="0"
                  value={commercialTerms.securityDepositAmount}
                  onChange={(e) =>
                    handleInputChange(
                      "securityDepositAmount",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="Enter deposit amount"
                  className={`pl-10 ${
                    getFieldError("securityDepositAmount")
                      ? "border-red-500"
                      : ""
                  } ${autoCalculate ? "bg-gray-50" : ""}`}
                  disabled={autoCalculate}
                />
              </div>
              {getFieldError("securityDepositAmount") && (
                <p className="text-sm text-red-500">
                  {getFieldError("securityDepositAmount")}
                </p>
              )}
              {autoCalculate && (
                <p className="text-xs text-gray-500">
                  Auto-calculated:{" "}
                  {formatCurrency(commercialTerms.securityDepositAmount)}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Additional Terms
          </CardTitle>
          <CardDescription>
            Rent escalation and advance rent requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rentEscalationPercentage">
              Rent Escalation Percentage *
            </Label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="rentEscalationPercentage"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={commercialTerms.rentEscalationPercentage}
                onChange={(e) =>
                  handleInputChange(
                    "rentEscalationPercentage",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="Enter escalation percentage"
                className={`pl-10 ${
                  getFieldError("rentEscalationPercentage")
                    ? "border-red-500"
                    : ""
                }`}
              />
            </div>
            {getFieldError("rentEscalationPercentage") && (
              <p className="text-sm text-red-500">
                {getFieldError("rentEscalationPercentage")}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="advanceRentRequired"
              checked={commercialTerms.advanceRentRequired}
              onCheckedChange={(checked) =>
                handleInputChange("advanceRentRequired", checked)
              }
            />
            <Label htmlFor="advanceRentRequired">Advance rent required</Label>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Calculator className="h-5 w-5" />
            Financial Summary
          </CardTitle>
          <CardDescription className="text-green-700">
            Overview of all financial terms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Monthly Rent:</span>
                <span className="text-sm font-semibold">
                  {formatCurrency(commercialTerms.monthlyRent)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">
                  Monthly Maintenance:
                </span>
                <span className="text-sm font-semibold">
                  {formatCurrency(commercialTerms.monthlyMaintenance)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium">Total Monthly:</span>
                <span className="text-sm font-bold text-green-800">
                  {formatCurrency(commercialTerms.totalMonthlyAmount)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Annual Rent:</span>
                <span className="text-sm font-semibold">
                  {formatCurrency(commercialTerms.totalRentPerAnnum)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Security Deposit:</span>
                <span className="text-sm font-semibold">
                  {formatCurrency(commercialTerms.securityDepositAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Rent Escalation:</span>
                <span className="text-sm font-semibold">
                  {commercialTerms.rentEscalationPercentage}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommercialTermsTab;
