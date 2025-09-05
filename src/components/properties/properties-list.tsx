"use client";

import { useState, useEffect, useCallback } from "react";
import { Property, PropertyFilterDto } from "@/lib/types/property";
import { propertyService } from "@/lib/api/property-service";
import { PropertyCard } from "./property-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Loader2, AlertCircle } from "lucide-react";

interface PropertiesListProps {
  onPropertySelect?: (property: Property) => void;
}

export function PropertiesList({ onPropertySelect }: PropertiesListProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState<PropertyFilterDto>({
    page: 1,
    limit: 12,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await propertyService.getProperties(filters);
      setProperties(response.properties);
      setTotal(response.total);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError("Failed to fetch properties. Please try again.");
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProperties();
  }, [filters, fetchProperties]);

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      location: searchTerm || undefined,
      page: 1,
    }));
  };

  const handleFilterChange = (
    key: keyof PropertyFilterDto,
    value: string | number | boolean | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortOrder:
        prev.sortBy === sortBy && prev.sortOrder === "desc" ? "asc" : "desc",
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const handlePropertyView = (property: Property) => {
    onPropertySelect?.(property);
  };

  const handlePropertyInquire = (property: Property) => {
    // Handle inquiry logic here
    console.log("Inquiring about property:", property._id);
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setSearchTerm("");
  };

  if (loading && properties.length === 0) {
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
        <Button onClick={fetchProperties} className="ml-4" variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600">
            {total} properties found
            {filters.location && ` in ${filters.location}`}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch}>Search</Button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Property Type
                  </label>
                  <Select
                    value={filters.propertyType || "all"}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "propertyType",
                        value === "all" ? undefined : value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Min Rent
                  </label>
                  <Input
                    type="number"
                    placeholder="Min rent"
                    value={filters.minRent || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "minRent",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Max Rent
                  </label>
                  <Input
                    type="number"
                    placeholder="Max rent"
                    value={filters.maxRent || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "maxRent",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Sort By
                  </label>
                  <Select
                    value={filters.sortBy || "createdAt"}
                    onValueChange={handleSortChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">Date Added</SelectItem>
                      <SelectItem value="rent">Rent</SelectItem>
                      <SelectItem value="area">Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2">
              {filters.propertyType && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Type: {filters.propertyType}
                  <button
                    onClick={() =>
                      handleFilterChange("propertyType", undefined)
                    }
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.minRent && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Min: ₹{filters.minRent.toLocaleString()}
                  <button
                    onClick={() => handleFilterChange("minRent", undefined)}
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.maxRent && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Max: ₹{filters.maxRent.toLocaleString()}
                  <button
                    onClick={() => handleFilterChange("maxRent", undefined)}
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.location && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {filters.location}
                  <button
                    onClick={() => handleFilterChange("location", undefined)}
                  >
                    ×
                  </button>
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No properties found matching your criteria.
          </p>
          <Button onClick={clearFilters} className="mt-4" variant="outline">
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                onViewDetails={handlePropertyView}
                onInquire={handlePropertyInquire}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 pt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => handlePageChange(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
