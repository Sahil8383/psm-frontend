"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/lib/hooks";
import { propertyService } from "@/lib/api/property-service";
import { Property } from "@/lib/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AdminPropertyCard from "@/components/admin/admin-property-card";

export default function AdminPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user?.role !== "admin") {
      router.push("/");
      return;
    }

    fetchProperties();
  }, [isAuthenticated, user, router]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyService.getProperties({ limit: 100 });
      setProperties(response.properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      setDeletingId(propertyId);
      await propertyService.deleteProperty(propertyId);
      setProperties(properties.filter((p) => p._id !== propertyId));
      toast.success("Property deleted successfully");
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property");
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You don&apos;t have permission to access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage properties and system settings
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Properties Management
                <Badge variant="secondary">{properties.length} total</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {properties.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No properties found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {properties.map((property) => (
                    <AdminPropertyCard
                      key={property._id}
                      property={property}
                      onDelete={handleDeleteProperty}
                      isDeleting={deletingId === property._id}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
