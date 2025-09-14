"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  setCurrentTab,
  setSubmitting,
  clearAllErrors,
} from "@/lib/slices/propertySlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ArrowRight, Save, AlertCircle } from "lucide-react";
import PropertyDetailsTab from "./tabs/property-details-tab";
import MediaTab from "./tabs/media-tab";
import CommercialTermsTab from "./tabs/commercial-terms-tab";
import SelectionCriteriaTab from "./tabs/selection-criteria-tab";
import BuildingFeaturesTab from "./tabs/building-features-tab";
import ReviewSubmitTab from "./tabs/review-submit-tab";

const CreatePropertyForm: React.FC = () => {
  const dispatch = useDispatch();
  const { currentTab, isSubmitting, errors } = useSelector(
    (state: RootState) => state.property
  );

  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const tabs = [
    {
      id: 0,
      title: "Property Details",
      description: "Basic property information and landlord details",
      component: PropertyDetailsTab,
    },
    {
      id: 1,
      title: "Media",
      description: "Images, videos, and documents",
      component: MediaTab,
    },
    {
      id: 2,
      title: "Commercial Terms",
      description: "Rent, maintenance, and financial details",
      component: CommercialTermsTab,
    },
    {
      id: 3,
      title: "Selection Criteria",
      description: "Property requirements and specifications",
      component: SelectionCriteriaTab,
    },
    {
      id: 4,
      title: "Building Features",
      description: "Additional features and amenities",
      component: BuildingFeaturesTab,
    },
    {
      id: 5,
      title: "Review & Submit",
      description: "Review all information and submit",
      component: ReviewSubmitTab,
    },
  ];

  const handleTabChange = (value: string) => {
    const tabIndex = parseInt(value);
    dispatch(setCurrentTab(tabIndex));
    dispatch(clearAllErrors());
    setLocalErrors({});
  };

  const handlePrevious = () => {
    if (currentTab > 0) {
      dispatch(setCurrentTab(currentTab - 1));
      dispatch(clearAllErrors());
      setLocalErrors({});
    }
  };

  const handleNext = () => {
    if (currentTab < tabs.length - 1) {
      dispatch(setCurrentTab(currentTab + 1));
      dispatch(clearAllErrors());
      setLocalErrors({});
    }
  };

  const handleSaveDraft = () => {
    // TODO: Implement save draft functionality
    console.log("Saving draft...");
  };

  const handleSubmit = async () => {
    dispatch(setSubmitting(true));
    try {
      // TODO: Implement form submission
      console.log("Submitting form...");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  const currentTabData = tabs[currentTab];
  const CurrentTabComponent = currentTabData.component;

  const hasErrors =
    Object.keys(errors).length > 0 || Object.keys(localErrors).length > 0;

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Property</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the property details step by step. You can save your progress
          at any time.
        </p>
      </div>

      {hasErrors && (
        <Alert className="mb-6" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fix the errors below before proceeding to the next step.
          </AlertDescription>
        </Alert>
      )}

      <Tabs
        value={currentTab.toString()}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-6 mb-6">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id.toString()}>
              <div className="text-center">
                <div className="font-medium">{tab.title}</div>
                <div className="text-xs text-muted-foreground hidden sm:block">
                  Step {tab.id + 1}
                </div>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        <Card>
          <CardHeader>
            <CardTitle>{currentTabData.title}</CardTitle>
            <CardDescription>{currentTabData.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <TabsContent value={currentTab.toString()} className="mt-0">
              <CurrentTabComponent />
            </TabsContent>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mt-6">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentTab === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
          </div>

          <div className="flex gap-2">
            {currentTab === tabs.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || hasErrors}
                className="min-w-[120px]"
              >
                {isSubmitting ? "Submitting..." : "Submit Property"}
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={hasErrors}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Step {currentTab + 1} of {tabs.length}
        </div>
      </Tabs>
    </div>
  );
};

export default CreatePropertyForm;
