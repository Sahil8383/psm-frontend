"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  updatePropertyDetails,
  updateLessorDetail,
  addLessorDetail,
  removeLessorDetail,
  clearError,
} from "@/lib/slices/propertySlice";
import { propertyDetailsSchema } from "@/lib/schemas/propertySchemas";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, AlertCircle } from "lucide-react";

const PropertyDetailsTab: React.FC = () => {
  const dispatch = useDispatch();
  const { propertyDetails, errors } = useSelector(
    (state: RootState) => state.property
  );

  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  // Validate form data
  const validateForm = useCallback(() => {
    try {
      propertyDetailsSchema.parse(propertyDetails);
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
  }, [propertyDetails]);

  // Handle input changes
  const handleInputChange = (field: string, value: string | number) => {
    dispatch(updatePropertyDetails({ [field]: value }));
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

  // Handle lessor detail changes
  const handleLessorDetailChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    dispatch(updateLessorDetail({ index, lessorDetail: { [field]: value } }));

    const errorKey = `lessorDetails.${index}.${field}`;
    dispatch(clearError(errorKey));

    if (localErrors[errorKey]) {
      setLocalErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Add new lessor detail
  const handleAddLessorDetail = () => {
    dispatch(addLessorDetail());
  };

  // Remove lessor detail
  const handleRemoveLessorDetail = (index: number) => {
    if (propertyDetails.lessorDetails.length > 1) {
      dispatch(removeLessorDetail(index));
    }
  };

  // Update number of lessors and adjust lessor details array
  const handleNumberOfLessorsChange = (value: number) => {
    const currentCount = propertyDetails.lessorDetails.length;

    if (value > currentCount) {
      // Add new lessor details
      for (let i = currentCount; i < value; i++) {
        dispatch(addLessorDetail());
      }
    } else if (value < currentCount) {
      // Remove excess lessor details
      for (let i = currentCount - 1; i >= value; i--) {
        dispatch(removeLessorDetail(i));
      }
    }

    handleInputChange("numberOfLessors", value);
  };

  // Validate on component mount and when data changes
  useEffect(() => {
    validateForm();
  }, [propertyDetails, validateForm]);

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

      {/* Landlord Information */}
      <Card>
        <CardHeader>
          <CardTitle>Landlord Information</CardTitle>
          <CardDescription>
            Provide the primary landlord&apos;s contact details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="landlordName">Landlord Name *</Label>
              <Input
                id="landlordName"
                value={propertyDetails.landlordName}
                onChange={(e) =>
                  handleInputChange("landlordName", e.target.value)
                }
                placeholder="Enter landlord's full name"
                className={
                  getFieldError("landlordName") ? "border-red-500" : ""
                }
              />
              {getFieldError("landlordName") && (
                <p className="text-sm text-red-500">
                  {getFieldError("landlordName")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="landlordContact">Contact Number *</Label>
              <Input
                id="landlordContact"
                type="tel"
                value={propertyDetails.landlordContact}
                onChange={(e) => {
                  // Only allow numbers, +, -, (, ), and spaces
                  const value = e.target.value.replace(/[^0-9+\-() ]/g, "");
                  handleInputChange("landlordContact", value);
                }}
                placeholder="Enter contact number"
                className={
                  getFieldError("landlordContact") ? "border-red-500" : ""
                }
              />
              {getFieldError("landlordContact") && (
                <p className="text-sm text-red-500">
                  {getFieldError("landlordContact")}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="landlordEmail">Email Address *</Label>
            <Input
              id="landlordEmail"
              type="email"
              value={propertyDetails.landlordEmail}
              onChange={(e) =>
                handleInputChange("landlordEmail", e.target.value)
              }
              placeholder="Enter email address"
              className={getFieldError("landlordEmail") ? "border-red-500" : ""}
            />
            {getFieldError("landlordEmail") && (
              <p className="text-sm text-red-500">
                {getFieldError("landlordEmail")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lessor Details */}
      <Card>
        <CardHeader>
          <CardTitle>Lessor Details</CardTitle>
          <CardDescription>
            Information about all lessors and their property holding percentages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numberOfLessors">Number of Lessors *</Label>
            <Input
              id="numberOfLessors"
              type="number"
              min="1"
              value={propertyDetails.numberOfLessors}
              onChange={(e) =>
                handleNumberOfLessorsChange(parseInt(e.target.value) || 1)
              }
              className={
                getFieldError("numberOfLessors") ? "border-red-500" : ""
              }
            />
            {getFieldError("numberOfLessors") && (
              <p className="text-sm text-red-500">
                {getFieldError("numberOfLessors")}
              </p>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            {propertyDetails.lessorDetails.map((lessor, index) => (
              <Card key={index} className="border-dashed">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">
                      Lessor {index + 1}
                    </CardTitle>
                    {propertyDetails.lessorDetails.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveLessorDetail(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`lessorName-${index}`}>
                        Lessor Name *
                      </Label>
                      <Input
                        id={`lessorName-${index}`}
                        value={lessor.name}
                        onChange={(e) =>
                          handleLessorDetailChange(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="Enter lessor's name"
                        className={
                          getFieldError(`lessorDetails.${index}.name`)
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {getFieldError(`lessorDetails.${index}.name`) && (
                        <p className="text-sm text-red-500">
                          {getFieldError(`lessorDetails.${index}.name`)}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`propertyHolding-${index}`}>
                        Property Holding % *
                      </Label>
                      <Input
                        id={`propertyHolding-${index}`}
                        type="number"
                        min="0"
                        max="100"
                        value={lessor.propertyHoldingPercentage}
                        onChange={(e) =>
                          handleLessorDetailChange(
                            index,
                            "propertyHoldingPercentage",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="Enter percentage"
                        className={
                          getFieldError(
                            `lessorDetails.${index}.propertyHoldingPercentage`
                          )
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {getFieldError(
                        `lessorDetails.${index}.propertyHoldingPercentage`
                      ) && (
                        <p className="text-sm text-red-500">
                          {getFieldError(
                            `lessorDetails.${index}.propertyHoldingPercentage`
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={handleAddLessorDetail}
              className="w-full border-dashed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Lessor
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Property Information */}
      <Card>
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
          <CardDescription>Basic details about the property</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="buildingName">Building Name *</Label>
            <Input
              id="buildingName"
              value={propertyDetails.buildingName}
              onChange={(e) =>
                handleInputChange("buildingName", e.target.value)
              }
              placeholder="Enter building name"
              className={getFieldError("buildingName") ? "border-red-500" : ""}
            />
            {getFieldError("buildingName") && (
              <p className="text-sm text-red-500">
                {getFieldError("buildingName")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="completeAddress">Complete Address *</Label>
            <Input
              id="completeAddress"
              value={propertyDetails.completeAddress}
              onChange={(e) =>
                handleInputChange("completeAddress", e.target.value)
              }
              placeholder="Enter complete address"
              className={
                getFieldError("completeAddress") ? "border-red-500" : ""
              }
            />
            {getFieldError("completeAddress") && (
              <p className="text-sm text-red-500">
                {getFieldError("completeAddress")}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pinCode">Pin Code *</Label>
              <Input
                id="pinCode"
                value={propertyDetails.pinCode}
                onChange={(e) => {
                  // Only allow numbers
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  handleInputChange("pinCode", value);
                }}
                placeholder="Enter pin code"
                className={getFieldError("pinCode") ? "border-red-500" : ""}
              />
              {getFieldError("pinCode") && (
                <p className="text-sm text-red-500">
                  {getFieldError("pinCode")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="carpetArea">Carpet Area (sq ft) *</Label>
              <Input
                id="carpetArea"
                type="number"
                min="0"
                value={propertyDetails.carpetArea}
                onChange={(e) =>
                  handleInputChange(
                    "carpetArea",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="Enter carpet area"
                className={getFieldError("carpetArea") ? "border-red-500" : ""}
              />
              {getFieldError("carpetArea") && (
                <p className="text-sm text-red-500">
                  {getFieldError("carpetArea")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="chargeableArea">Chargeable Area (sq ft) *</Label>
              <Input
                id="chargeableArea"
                type="number"
                min="0"
                value={propertyDetails.chargeableArea}
                onChange={(e) =>
                  handleInputChange(
                    "chargeableArea",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="Enter chargeable area"
                className={
                  getFieldError("chargeableArea") ? "border-red-500" : ""
                }
              />
              {getFieldError("chargeableArea") && (
                <p className="text-sm text-red-500">
                  {getFieldError("chargeableArea")}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="propertyVintageYears">
              Property Vintage (Years) *
            </Label>
            <Input
              id="propertyVintageYears"
              type="number"
              min="0"
              value={propertyDetails.propertyVintageYears}
              onChange={(e) =>
                handleInputChange(
                  "propertyVintageYears",
                  parseInt(e.target.value) || 0
                )
              }
              placeholder="Enter property vintage in years"
              className={
                getFieldError("propertyVintageYears") ? "border-red-500" : ""
              }
            />
            {getFieldError("propertyVintageYears") && (
              <p className="text-sm text-red-500">
                {getFieldError("propertyVintageYears")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyDetailsTab;
