"use client";

import { Property } from "@/lib/types/property";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface PropertyCardProps {
  property: Property;
  onViewDetails?: (property: Property) => void;
  onInquire?: (property: Property) => void;
}

export function PropertyCard({ property, onViewDetails }: PropertyCardProps) {
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
    <div
      className="w-full duration-200 cursor-pointer"
      onClick={() => onViewDetails?.(property)}
    >
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
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200 z-10"
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorited
                  ? "fill-red-500 text-red-500"
                  : "text-gray-700 hover:text-red-500"
              }`}
            />
          </button>

          {/* Navigation Buttons - Only show if multiple images */}
          {hasMultipleImages && (
            <>
              {/* Previous Button */}
              <button
                onClick={handlePreviousImage}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
              >
                <ChevronLeft className="h-4 w-4 text-gray-700" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
              >
                <ChevronRight className="h-4 w-4 text-gray-700" />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
                {property.media.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-3 space-y-1">
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {property.propertyDetails.buildingName}
          </h3>

          <div className="flex items-center space-x-1">
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(property.commercialTerms.monthlyRent)}
            </span>
            <span className="text-sm text-gray-500">/month</span>
          </div>
        </div>
      </div>
    </div>
  );
}
