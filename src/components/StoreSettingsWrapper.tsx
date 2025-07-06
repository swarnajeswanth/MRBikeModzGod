"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/components/store";
import {
  selectFeatures,
  selectPages,
  selectCustomerExperience,
} from "@/components/store/storeSettingsSlice";

interface StoreSettingsWrapperProps {
  feature?: keyof ReturnType<typeof selectFeatures>;
  page?: keyof ReturnType<typeof selectPages>;
  customerExperience?: keyof ReturnType<typeof selectCustomerExperience>;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const StoreSettingsWrapper: React.FC<StoreSettingsWrapperProps> = ({
  feature,
  page,
  customerExperience,
  children,
  fallback = null,
}) => {
  const features = useSelector(selectFeatures);
  const pages = useSelector(selectPages);
  const customerExp = useSelector(selectCustomerExperience);

  // Check if the feature/page/experience is enabled
  const isEnabled = () => {
    if (feature && features) {
      const enabled = features[feature];
      console.log(`Feature ${feature}: ${enabled}`, features);
      return enabled;
    }
    if (page && pages) {
      const enabled = pages[page];
      console.log(`Page ${page}: ${enabled}`, pages);
      return enabled;
    }
    if (customerExperience && customerExp) {
      const enabled = customerExp[customerExperience];
      console.log(
        `Customer Experience ${customerExperience}: ${enabled}`,
        customerExp
      );
      return enabled;
    }
    console.log("No feature/page/experience specified, defaulting to enabled");
    return true; // Default to enabled if no check specified or data not available
  };

  const enabled = isEnabled();
  console.log(
    `StoreSettingsWrapper: ${
      feature || page || customerExperience
    } = ${enabled}`
  );

  return enabled ? <>{children}</> : <>{fallback}</>;
};

export default StoreSettingsWrapper;
