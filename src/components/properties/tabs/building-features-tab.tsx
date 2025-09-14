"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  updateBuildingFeatures,
  updatePropertyType,
  updateTags,
  clearError,
} from "@/lib/slices/propertySlice";
import { buildingFeaturesSchema } from "@/lib/schemas/propertySchemas";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  AlertCircle,
  Plus,
  X,
  Tag,
  Users,
  Star,
  FileText,
  IndianRupee,
} from "lucide-react";

const BuildingFeaturesTab: React.FC = () => {
  const dispatch = useDispatch();
  const { buildingFeatures, propertyType, tags, errors } = useSelector(
    (state: RootState) => state.property
  );

  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [newSalientFeature, setNewSalientFeature] = useState("");
  const [newOccupant, setNewOccupant] = useState("");
  const [newTag, setNewTag] = useState("");

  // Validate form data
  const validateForm = useCallback(() => {
    try {
      buildingFeaturesSchema.parse(buildingFeatures);
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
  }, [buildingFeatures]);

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    dispatch(updateBuildingFeatures({ [field]: value }));
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

  // Handle property type change
  const handlePropertyTypeChange = (value: string) => {
    dispatch(
      updatePropertyType(value as "commercial" | "residential" | "mixed")
    );
    dispatch(clearError("propertyType"));
  };

  // Add salient feature
  const addSalientFeature = () => {
    if (newSalientFeature.trim()) {
      const updatedFeatures = [
        ...(buildingFeatures.salientFeatures || []),
        newSalientFeature.trim(),
      ];
      dispatch(updateBuildingFeatures({ salientFeatures: updatedFeatures }));
      setNewSalientFeature("");
    }
  };

  // Remove salient feature
  const removeSalientFeature = (index: number) => {
    const updatedFeatures =
      buildingFeatures.salientFeatures?.filter((_, i) => i !== index) || [];
    dispatch(updateBuildingFeatures({ salientFeatures: updatedFeatures }));
  };

  // Add occupant
  const addOccupant = () => {
    if (newOccupant.trim()) {
      const updatedOccupants = [
        ...(buildingFeatures.otherOccupants || []),
        newOccupant.trim(),
      ];
      dispatch(updateBuildingFeatures({ otherOccupants: updatedOccupants }));
      setNewOccupant("");
    }
  };

  // Remove occupant
  const removeOccupant = (index: number) => {
    const updatedOccupants =
      buildingFeatures.otherOccupants?.filter((_, i) => i !== index) || [];
    dispatch(updateBuildingFeatures({ otherOccupants: updatedOccupants }));
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim()) {
      const updatedTags = [...tags, newTag.trim()];
      dispatch(updateTags(updatedTags));
      setNewTag("");
    }
  };

  // Remove tag
  const removeTag = (index: number) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    dispatch(updateTags(updatedTags));
  };

  // Handle Enter key for adding items
  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
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

      {/* Property Type */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Property Type
          </CardTitle>
          <CardDescription>
            Select the type of property being listed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="propertyType">Property Type *</Label>
            <Select
              value={propertyType}
              onValueChange={handlePropertyTypeChange}
            >
              <SelectTrigger
                className={
                  getFieldError("propertyType") ? "border-red-500" : ""
                }
              >
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="mixed">Mixed Use</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("propertyType") && (
              <p className="text-sm text-red-500">
                {getFieldError("propertyType")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Salient Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Salient Features
          </CardTitle>
          <CardDescription>
            Key features and highlights of the property
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSalientFeature}
              onChange={(e) => setNewSalientFeature(e.target.value)}
              placeholder="Enter a salient feature"
              onKeyPress={(e) => handleKeyPress(e, addSalientFeature)}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={addSalientFeature}
              disabled={!newSalientFeature.trim()}
              className="px-3"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {buildingFeatures.salientFeatures &&
            buildingFeatures.salientFeatures.length > 0 && (
              <div className="space-y-2">
                <Label>Added Features:</Label>
                <div className="flex flex-wrap gap-2">
                  {buildingFeatures.salientFeatures.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1 pr-1"
                    >
                      {feature}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSalientFeature(index)}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      {/* Other Occupants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Other Occupants
          </CardTitle>
          <CardDescription>
            List of other tenants or occupants in the building
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newOccupant}
              onChange={(e) => setNewOccupant(e.target.value)}
              placeholder="Enter occupant name or business"
              onKeyPress={(e) => handleKeyPress(e, addOccupant)}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={addOccupant}
              disabled={!newOccupant.trim()}
              className="px-3"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {buildingFeatures.otherOccupants &&
            buildingFeatures.otherOccupants.length > 0 && (
              <div className="space-y-2">
                <Label>Added Occupants:</Label>
                <div className="flex flex-wrap gap-2">
                  {buildingFeatures.otherOccupants.map((occupant, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="flex items-center gap-1 pr-1"
                    >
                      {occupant}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOccupant(index)}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      {/* Tax and Legal Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5" />
            Tax and Legal Details
          </CardTitle>
          <CardDescription>
            GST and tax responsibility information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gstDetails">GST Details</Label>
            <Input
              id="gstDetails"
              value={buildingFeatures.gstDetails || ""}
              onChange={(e) => handleInputChange("gstDetails", e.target.value)}
              placeholder="Enter GST number or details"
              className={getFieldError("gstDetails") ? "border-red-500" : ""}
            />
            {getFieldError("gstDetails") && (
              <p className="text-sm text-red-500">
                {getFieldError("gstDetails")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxResponsibility">Tax Responsibility</Label>
            <Select
              value={buildingFeatures.taxResponsibility || ""}
              onValueChange={(value) =>
                handleInputChange("taxResponsibility", value)
              }
            >
              <SelectTrigger
                className={
                  getFieldError("taxResponsibility") ? "border-red-500" : ""
                }
              >
                <SelectValue placeholder="Select tax responsibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Landlord">Landlord</SelectItem>
                <SelectItem value="Tenant">Tenant</SelectItem>
                <SelectItem value="Shared">Shared</SelectItem>
                <SelectItem value="As per agreement">
                  As per agreement
                </SelectItem>
                <SelectItem value="Not applicable">Not applicable</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("taxResponsibility") && (
              <p className="text-sm text-red-500">
                {getFieldError("taxResponsibility")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Property Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Property Tags
          </CardTitle>
          <CardDescription>
            Add tags to categorize and make the property easily searchable
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Enter a tag (e.g., 'Prime Location', 'Near Metro')"
              onKeyPress={(e) => handleKeyPress(e, addTag)}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={addTag}
              disabled={!newTag.trim()}
              className="px-3"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {tags.length > 0 && (
            <div className="space-y-2">
              <Label>Added Tags:</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="default"
                    className="flex items-center gap-1 pr-1"
                  >
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTag(index)}
                      className="h-4 w-4 p-0 hover:bg-transparent text-white"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Suggested tags:</strong> Prime Location, Near Metro,
              Parking Available, Security, Lift, Power Backup, Near Hospital,
              Near School, Shopping Mall, IT Hub, Business District, Residential
              Area
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <FileText className="h-5 w-5" />
            Building Features Summary
          </CardTitle>
          <CardDescription className="text-green-700">
            Overview of all building features and amenities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Property Type:</span>
                <span className="text-sm font-semibold capitalize">
                  {propertyType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Salient Features:</span>
                <span className="text-sm font-semibold">
                  {buildingFeatures.salientFeatures?.length || 0} features
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Other Occupants:</span>
                <span className="text-sm font-semibold">
                  {buildingFeatures.otherOccupants?.length || 0} occupants
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Property Tags:</span>
                <span className="text-sm font-semibold">
                  {tags.length} tags
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">GST Details:</span>
                <span className="text-sm font-semibold">
                  {buildingFeatures.gstDetails ? "Provided" : "Not provided"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Tax Responsibility:</span>
                <span className="text-sm font-semibold">
                  {buildingFeatures.taxResponsibility || "Not specified"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuildingFeaturesTab;
