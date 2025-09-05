"use client";

import { Property } from "@/lib/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Building,
  Car,
  Square,
  IndianRupee,
  Calendar,
  Phone,
  Mail,
  Eye,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";

interface PropertyCardProps {
  property: Property;
  onViewDetails?: (property: Property) => void;
  onInquire?: (property: Property) => void;
}

export function PropertyCard({
  property,
  onViewDetails,
  onInquire,
}: PropertyCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatArea = (area: number) => {
    return `${area.toLocaleString()} sq ft`;
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {property.propertyDetails.buildingName}
            </CardTitle>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{property.propertyDetails.completeAddress}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Building className="h-4 w-4 mr-1" />
              <span>Pin: {property.propertyDetails.pinCode}</span>
            </div>
          </div>
          <Badge
            variant={property.status === "available" ? "default" : "secondary"}
            className="ml-2"
          >
            {property.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Property Image */}
        {property.media.images.length > 0 && (
          <div className="relative h-48 w-full rounded-lg overflow-hidden">
            {/* <img
              src={""}
              alt={property.propertyDetails.buildingName}
              className="object-cover"
            /> */}
          </div>
        )}

        {/* Key Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <IndianRupee className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Monthly Rent</p>
              <p className="font-semibold text-green-600">
                {formatCurrency(property.commercialTerms.monthlyRent)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Square className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Carpet Area</p>
              <p className="font-semibold text-blue-600">
                {formatArea(property.propertyDetails.carpetArea)}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Car className="h-4 w-4 text-purple-600" />
            <span>
              {property.selectionCriteria.parkingDetails.fourWheelerSpaces} Car
              Spaces
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-orange-600" />
            <span>
              {property.selectionCriteria.leasePeriodYears} Years Lease
            </span>
          </div>
        </div>

        {/* Rent per sq ft */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Rent per sq ft:</span>
            <span className="font-semibold">
              {formatCurrency(property.commercialTerms.monthlyRentPerSqFt)}/sq
              ft
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-gray-600">Security Deposit:</span>
            <span className="font-semibold">
              {formatCurrency(property.commercialTerms.securityDepositAmount)}
            </span>
          </div>
        </div>

        {/* Landlord Contact */}
        <div className="border-t pt-3">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Landlord Contact
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{property.propertyDetails.landlordContact}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{property.propertyDetails.landlordEmail}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {property.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {property.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {property.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{property.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3">
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span>{property.viewCount} views</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4" />
            <span>{property.inquiryCount} inquiries</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onViewDetails?.(property)}
          >
            View Details
          </Button>
          <Button className="flex-1" onClick={() => onInquire?.(property)}>
            Inquire Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
