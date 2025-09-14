"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  setSubmitting,
  setErrors,
  clearAllErrors,
} from "@/lib/slices/propertySlice";
import { createPropertySchema } from "@/lib/schemas/propertySchemas";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  AlertCircle,
  Building,
  Image as ImageIcon,
  Video,
  FileText,
  IndianRupee,
  Shield,
  Car,
  Star,
  Tag,
  Users,
  Calendar,
  Zap,
  FileCheck,
  Send,
} from "lucide-react";

const ReviewSubmitTab: React.FC = () => {
  const dispatch = useDispatch();
  const {
    propertyDetails,
    media,
    commercialTerms,
    selectionCriteria,
    buildingFeatures,
    propertyType,
    tags,
    isSubmitting,
    errors,
  } = useSelector((state: RootState) => state.property);

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Validate entire form
  const validateEntireForm = useCallback(() => {
    try {
      const formData = {
        propertyDetails,
        media,
        commercialTerms,
        selectionCriteria,
        buildingFeatures,
        tags,
        propertyType,
      };

      createPropertySchema.parse(formData);
      setValidationErrors({});
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
      setValidationErrors(newErrors);
      return false;
    }
  }, [
    propertyDetails,
    media,
    commercialTerms,
    selectionCriteria,
    buildingFeatures,
    tags,
    propertyType,
  ]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateEntireForm()) {
      return;
    }

    setShowConfirmation(true);
  };

  // Confirm submission
  const confirmSubmission = async () => {
    dispatch(setSubmitting(true));
    setShowConfirmation(false);

    try {
      // TODO: Implement API call to submit property
      const formData = {
        propertyDetails,
        media,
        commercialTerms,
        selectionCriteria,
        buildingFeatures,
        tags,
        propertyType,
      };

      console.log("Submitting property data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Handle successful submission
      console.log("Property submitted successfully!");
    } catch (error) {
      console.error("Error submitting property:", error);
      // TODO: Handle submission error
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  // Validate on component mount
  useEffect(() => {
    validateEntireForm();
  }, [validateEntireForm]);

  const hasValidationErrors = Object.keys(validationErrors).length > 0;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="space-y-6">
      {/* Validation Summary */}
      {hasValidationErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fix the validation errors below before submitting the
            property.
            <div className="mt-2">
              <strong>Errors found in:</strong>
              <ul className="list-disc list-inside mt-1">
                {Object.keys(validationErrors)
                  .slice(0, 5)
                  .map((field) => (
                    <li key={field} className="text-sm">
                      {field
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </li>
                  ))}
                {Object.keys(validationErrors).length > 5 && (
                  <li className="text-sm">
                    ... and {Object.keys(validationErrors).length - 5} more
                  </li>
                )}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            There are some errors in the form. Please review and fix them before
            submitting.
          </AlertDescription>
        </Alert>
      )}

      {/* Property Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Property Overview
          </CardTitle>
          <CardDescription>
            Complete summary of your property listing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Building className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-semibold text-blue-800">{propertyType}</h3>
              <p className="text-sm text-blue-600 capitalize">
                {propertyType} Property
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <IndianRupee className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-semibold text-green-800">
                {formatCurrency(commercialTerms.totalMonthlyAmount)}
              </h3>
              <p className="text-sm text-green-600">Monthly Rent</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Calendar className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-semibold text-purple-800">
                {selectionCriteria.leasePeriodYears} Years
              </h3>
              <p className="text-sm text-purple-600">Lease Period</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Details Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Property Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Landlord Information</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Name:</strong> {propertyDetails.landlordName}
                </p>
                <p>
                  <strong>Contact:</strong> {propertyDetails.landlordContact}
                </p>
                <p>
                  <strong>Email:</strong> {propertyDetails.landlordEmail}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Property Information</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Building:</strong> {propertyDetails.buildingName}
                </p>
                <p>
                  <strong>Address:</strong> {propertyDetails.completeAddress}
                </p>
                <p>
                  <strong>Pin Code:</strong> {propertyDetails.pinCode}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-2">Area Details</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Carpet Area:</strong> {propertyDetails.carpetArea} sq
                  ft
                </p>
                <p>
                  <strong>Chargeable Area:</strong>{" "}
                  {propertyDetails.chargeableArea} sq ft
                </p>
                <p>
                  <strong>Vintage:</strong>{" "}
                  {propertyDetails.propertyVintageYears} years
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Lessor Details</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Number of Lessors:</strong>{" "}
                  {propertyDetails.numberOfLessors}
                </p>
                {propertyDetails.lessorDetails.map((lessor, index) => (
                  <p key={index} className="text-xs">
                    {lessor.name}: {lessor.propertyHoldingPercentage}%
                  </p>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Media Files</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Images:</strong> {media.images?.length || 0}
                </p>
                <p>
                  <strong>Videos:</strong> {media.videos?.length || 0}
                </p>
                <p>
                  <strong>Documents:</strong> {media.documents?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commercial Terms Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5" />
            Commercial Terms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Rent Details</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Monthly Rent:</strong>{" "}
                  {formatCurrency(commercialTerms.monthlyRent)}
                </p>
                <p>
                  <strong>Annual Rent:</strong>{" "}
                  {formatCurrency(commercialTerms.totalRentPerAnnum)}
                </p>
                <p>
                  <strong>Rent per Sq Ft:</strong> ₹
                  {commercialTerms.monthlyRentPerSqFt}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Additional Costs</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Maintenance:</strong>{" "}
                  {formatCurrency(commercialTerms.monthlyMaintenance)}
                </p>
                <p>
                  <strong>Total Monthly:</strong>{" "}
                  {formatCurrency(commercialTerms.totalMonthlyAmount)}
                </p>
                <p>
                  <strong>Security Deposit:</strong>{" "}
                  {formatCurrency(commercialTerms.securityDepositAmount)}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Terms</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Rent Escalation:</strong>{" "}
                  {commercialTerms.rentEscalationPercentage}%
                </p>
                <p>
                  <strong>Advance Rent:</strong>{" "}
                  {commercialTerms.advanceRentRequired
                    ? "Required"
                    : "Not Required"}
                </p>
                <p>
                  <strong>Security Deposit:</strong>{" "}
                  {commercialTerms.securityDepositMonths} months
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Lease Terms</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Lease Period:</strong>{" "}
                  {selectionCriteria.leasePeriodYears} years
                </p>
                <p>
                  <strong>Rent Free Period:</strong>{" "}
                  {selectionCriteria.rentFreePeriodDays} days
                </p>
                <p>
                  <strong>Lock-in Period:</strong>{" "}
                  {selectionCriteria.lockInPeriodMonths} months
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety & Features Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Safety & Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Safety Features</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Fire Alarm System:</strong>{" "}
                  {selectionCriteria.hasFASSystem}
                </p>
                <p>
                  <strong>Fire Exits:</strong>{" "}
                  {selectionCriteria.numberOfFireExits}
                </p>
                <p>
                  <strong>Sprinkler System:</strong>{" "}
                  {selectionCriteria.hasSprinklerSystem ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Hydrant System:</strong>{" "}
                  {selectionCriteria.hasHydrantSystem ? "Yes" : "No"}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Building Features</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Lifts:</strong> {selectionCriteria.numberOfLifts}
                </p>
                <p>
                  <strong>Lift License:</strong>{" "}
                  {selectionCriteria.liftLicenseStatus}
                </p>
                <p>
                  <strong>Flooring:</strong> {selectionCriteria.flooringType}
                </p>
                <p>
                  <strong>Public Transport:</strong>{" "}
                  {selectionCriteria.distanceToPublicTransport}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Parking</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Four Wheeler:</strong>{" "}
                  {selectionCriteria.parkingDetails.fourWheelerSpaces} spaces
                </p>
                <p>
                  <strong>Two Wheeler:</strong>{" "}
                  {selectionCriteria.parkingDetails.twoWheelerSpaces} spaces
                </p>
                <p>
                  <strong>Additional Cost:</strong>{" "}
                  {selectionCriteria.parkingDetails.additionalCost
                    ? "Yes"
                    : "No"}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Electrical</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Connection:</strong>{" "}
                  {selectionCriteria.electricityConnection}
                </p>
                <p>
                  <strong>Load:</strong> {selectionCriteria.electricityKW} KW
                </p>
                <p>
                  <strong>Meter Provided:</strong>{" "}
                  {selectionCriteria.electricityMeterProvided ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Dedicated Earthing:</strong>{" "}
                  {selectionCriteria.hasDedicatedEarthing ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Building Features Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Building Features & Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Salient Features</h4>
              {buildingFeatures.salientFeatures &&
              buildingFeatures.salientFeatures.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {buildingFeatures.salientFeatures.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No features added</p>
              )}
            </div>
            <div>
              <h4 className="font-medium mb-2">Other Occupants</h4>
              {buildingFeatures.otherOccupants &&
              buildingFeatures.otherOccupants.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {buildingFeatures.otherOccupants.map((occupant, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {occupant}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No occupants listed</p>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Property Tags</h4>
              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="default" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No tags added</p>
              )}
            </div>
            <div>
              <h4 className="font-medium mb-2">Tax & Legal</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>GST Details:</strong>{" "}
                  {buildingFeatures.gstDetails || "Not provided"}
                </p>
                <p>
                  <strong>Tax Responsibility:</strong>{" "}
                  {buildingFeatures.taxResponsibility || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Section */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Send className="h-5 w-5" />
            Ready to Submit
          </CardTitle>
          <CardDescription className="text-green-700">
            Review all information above and submit your property listing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="text-sm text-green-700">
              {hasValidationErrors ? (
                <p className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Please fix validation errors before submitting
                </p>
              ) : (
                <p className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  All information looks good!
                </p>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={hasValidationErrors || isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white px-8"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Property
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Confirm Submission
              </CardTitle>
              <CardDescription>
                Are you sure you want to submit this property listing? This
                action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Property:</strong> {propertyDetails.buildingName}
                  <br />
                  <strong>Type:</strong> {propertyType}
                  <br />
                  <strong>Monthly Rent:</strong>{" "}
                  {formatCurrency(commercialTerms.totalMonthlyAmount)}
                </p>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmSubmission}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? "Submitting..." : "Confirm & Submit"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReviewSubmitTab;
