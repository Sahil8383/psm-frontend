"use client";

import { useState, useEffect } from "react";
import { Property } from "@/lib/types/property";
import { propertyService } from "@/lib/api/property-service";
import { PropertyCard } from "./property-card";
import { Loader2, AlertCircle } from "lucide-react";

interface PropertiesListProps {
  onPropertySelect?: (property: Property) => void;
}

export function PropertiesList({ onPropertySelect }: PropertiesListProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await propertyService.getProperties({
        page: 1,
        limit: 20,
      });
      setProperties(response.properties);
    } catch (err) {
      setError("Failed to fetch properties. Please try again.");
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handlePropertyView = (property: Property) => {
    onPropertySelect?.(property);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading properties...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <span className="ml-2 text-red-500">{error}</span>
        <button
          onClick={fetchProperties}
          className="ml-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Properties Grid */}
      {properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No properties found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              onViewDetails={handlePropertyView}
            />
          ))}
        </div>
      )}
    </div>
  );
}
