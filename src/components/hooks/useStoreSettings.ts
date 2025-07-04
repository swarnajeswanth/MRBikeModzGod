import { useSelector } from "react-redux";
import { RootState } from "@/components/store";
import {
  selectStoreSettings,
  selectFeatures,
  selectPages,
  selectStoreInfo,
  selectCustomerExperience,
  selectIsFeatureEnabled,
  selectIsPageAccessible,
  selectIsCustomerExperienceEnabled,
} from "@/components/store/storeSettingsSlice";

export const useStoreSettings = () => {
  const storeSettings = useSelector(selectStoreSettings);
  const features = useSelector(selectFeatures);
  const pages = useSelector(selectPages);
  const storeInfo = useSelector(selectStoreInfo);
  const customerExperience = useSelector(selectCustomerExperience);

  const isFeatureEnabled = (feature: keyof typeof features) => {
    return useSelector(selectIsFeatureEnabled(feature));
  };

  const isPageAccessible = (page: keyof typeof pages) => {
    return useSelector(selectIsPageAccessible(page));
  };

  const isCustomerExperienceEnabled = (
    setting: keyof typeof customerExperience
  ) => {
    return useSelector(selectIsCustomerExperienceEnabled(setting));
  };

  return {
    storeSettings: storeSettings || null,
    features: features || {},
    pages: pages || {},
    storeInfo: storeInfo || {},
    customerExperience: customerExperience || {},
    isFeatureEnabled,
    isPageAccessible,
    isCustomerExperienceEnabled,
  };
};
