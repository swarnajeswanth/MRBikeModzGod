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
      return features[feature];
    }
    if (page && pages) {
      return pages[page];
    }
    if (customerExperience && customerExp) {
      return customerExp[customerExperience];
    }
    return true; // Default to enabled if no check specified or data not available
  };

  return isEnabled() ? <>{children}</> : <>{fallback}</>;
};

export default StoreSettingsWrapper;
