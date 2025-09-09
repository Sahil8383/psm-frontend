"use client";

import { useState } from "react";
import { Property } from "@/lib/types/property";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

interface AdminPropertyCardProps {
  property: Property;
  onDelete: (propertyId: string) => void;
  isDeleting: boolean;
}

export default function AdminPropertyCard({
  property,
  onDelete,
  isDeleting,
}: AdminPropertyCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handlePreviousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.media.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === property.media.images.length - 1 ? 0 : prev + 1
    );
  };

  const hasMultipleImages = property.media.images.length > 1;

  return (
    <div className="w-full duration-200">
      <div className="p-0">
        <div className="relative h-64 w-full rounded-lg overflow-hidden group">
          {property.media.images.length > 0 ? (
            <Image
              src={property.media.images[currentImageIndex]}
              alt={property.propertyDetails.buildingName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}

          <button
            onClick={handleFavoriteClick}
            className="absolute cursor-pointer top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200 z-10"
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorited
                  ? "fill-red-500 text-red-500"
                  : "text-gray-700 hover:text-red-500"
              }`}
            />
          </button>

          {/* Delete Button */}
          <div className="absolute top-3 left-3 z-10">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isDeleting}
                  className="p-2 rounded-full bg-red-500/80 hover:bg-red-500 text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Property</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this property? This action
                    cannot be undone.
                    <br />
                    <br />
                    <strong>{property.propertyDetails.buildingName}</strong>
                    <br />
                    {property.propertyDetails.completeAddress}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(property._id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Property
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Navigation Buttons - Only show if multiple images */}
          {hasMultipleImages && (
            <>
              <button
                onClick={handlePreviousImage}
                className="absolute cursor-pointer left-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
              >
                <ChevronLeft className="h-4 w-4 text-gray-700" />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
              >
                <ChevronRight className="h-4 w-4 text-gray-700" />
              </button>
            </>
          )}
        </div>

        <div className="p-3 space-y-2">
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {property.propertyDetails.buildingName}
          </h3>

          <div className="flex items-center space-x-1">
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(property.commercialTerms.monthlyRent)}
            </span>
            <span className="text-sm text-gray-500">/month</span>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={property.status === "active" ? "default" : "secondary"}
              className="text-xs"
            >
              {property.status}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {property.propertyDetails.carpetArea} sq ft
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
