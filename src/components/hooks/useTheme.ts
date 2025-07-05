import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/components/store";
import {
  selectStoreInfo,
  updateStoreInfo,
} from "@/components/store/storeSettingsSlice";
import {
  Theme,
  getThemeColors,
  getThemeClass,
  getThemeClasses,
  themeComponents,
} from "@/components/lib/themeUtils";
import { useEffect, useState } from "react";

export const useTheme = () => {
  const dispatch = useDispatch<AppDispatch>();
  const storeInfo = useSelector(selectStoreInfo);
  const currentTheme = storeInfo.theme;

  // State for system theme detection
  const [systemTheme, setSystemTheme] = useState<"dark" | "light">("dark");

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    setSystemTheme(mediaQuery.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", updateSystemTheme);

    return () => mediaQuery.removeEventListener("change", updateSystemTheme);
  }, []);

  // Get the effective theme (handles auto mode)
  const getEffectiveTheme = (): "dark" | "light" => {
    if (currentTheme === "auto") {
      return systemTheme;
    }
    return currentTheme;
  };

  // Get theme colors for the effective theme
  const getColors = () => {
    const effectiveTheme = getEffectiveTheme();
    return getThemeColors(effectiveTheme);
  };

  // Get a single theme class
  const getClass = (colorKey: keyof ReturnType<typeof getThemeColors>) => {
    const effectiveTheme = getEffectiveTheme();
    return getThemeClass(effectiveTheme, colorKey);
  };

  // Get multiple theme classes
  const getClasses = (
    ...colorKeys: (keyof ReturnType<typeof getThemeColors>)[]
  ) => {
    const effectiveTheme = getEffectiveTheme();
    return getThemeClasses(effectiveTheme, ...colorKeys);
  };

  // Change theme
  const setTheme = async (theme: Theme) => {
    try {
      await dispatch(updateStoreInfo({ theme }));
    } catch (error) {
      console.error("Failed to update theme:", error);
    }
  };

  // Toggle between dark and light themes
  const toggleTheme = () => {
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  // Check if current theme is dark
  const isDark = getEffectiveTheme() === "dark";

  // Check if current theme is light
  const isLight = getEffectiveTheme() === "light";

  // Check if auto mode is enabled
  const isAuto = currentTheme === "auto";

  return {
    // Theme state
    theme: currentTheme,
    effectiveTheme: getEffectiveTheme(),
    isDark,
    isLight,
    isAuto,
    systemTheme,

    // Theme utilities
    colors: getColors(),
    getClass,
    getClasses,
    components: themeComponents,

    // Theme actions
    setTheme,
    toggleTheme,

    // Helper functions
    getCardClasses: () => themeComponents.card(getEffectiveTheme()),
    getButtonClasses: (variant: "primary" | "secondary" = "primary") =>
      themeComponents.button[variant](getEffectiveTheme()),
    getInputClasses: () => themeComponents.input(getEffectiveTheme()),
    getHeaderClasses: () => themeComponents.header(getEffectiveTheme()),
    getFooterClasses: () => themeComponents.footer(getEffectiveTheme()),
    getPageClasses: () => themeComponents.page(getEffectiveTheme()),
  };
};
