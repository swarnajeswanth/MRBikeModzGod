export type Theme = "dark" | "light" | "auto";

export interface ThemeColors {
  // Background colors
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  bgCard: string;
  bgOverlay: string;

  // Text colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textMuted: string;
  textInverse: string;

  // Border colors
  borderPrimary: string;
  borderSecondary: string;
  borderAccent: string;

  // Accent colors
  accentPrimary: string;
  accentSecondary: string;
  accentSuccess: string;
  accentWarning: string;
  accentError: string;
  accentInfo: string;

  // Interactive colors
  interactivePrimary: string;
  interactiveSecondary: string;
  interactiveHover: string;
  interactiveActive: string;
  interactiveDisabled: string;

  // Special colors
  shadow: string;
  backdrop: string;
  divider: string;
}

export const darkTheme: ThemeColors = {
  // Background colors
  bgPrimary: "bg-black",
  bgSecondary: "bg-gray-900",
  bgTertiary: "bg-gray-800",
  bgCard: "bg-gray-800/50",
  bgOverlay: "bg-black/80",

  // Text colors
  textPrimary: "text-white",
  textSecondary: "text-gray-300",
  textTertiary: "text-gray-400",
  textMuted: "text-gray-500",
  textInverse: "text-black",

  // Border colors
  borderPrimary: "border-gray-700",
  borderSecondary: "border-gray-600",
  borderAccent: "border-red-600/20",

  // Accent colors
  accentPrimary: "text-red-400",
  accentSecondary: "text-red-500",
  accentSuccess: "text-green-400",
  accentWarning: "text-yellow-400",
  accentError: "text-red-400",
  accentInfo: "text-blue-400",

  // Interactive colors
  interactivePrimary: "bg-red-600",
  interactiveSecondary: "bg-gray-700",
  interactiveHover: "hover:bg-red-700",
  interactiveActive: "active:bg-red-800",
  interactiveDisabled: "bg-gray-600",

  // Special colors
  shadow: "shadow-gray-900/50",
  backdrop: "backdrop-blur-sm",
  divider: "border-gray-800",
};

export const lightTheme: ThemeColors = {
  // Background colors
  bgPrimary: "bg-white",
  bgSecondary: "bg-gray-50",
  bgTertiary: "bg-gray-100",
  bgCard: "bg-white/90",
  bgOverlay: "bg-white/90",

  // Text colors
  textPrimary: "text-gray-900",
  textSecondary: "text-gray-700",
  textTertiary: "text-gray-600",
  textMuted: "text-gray-500",
  textInverse: "text-white",

  // Border colors
  borderPrimary: "border-gray-200",
  borderSecondary: "border-gray-300",
  borderAccent: "border-red-200",

  // Accent colors
  accentPrimary: "text-red-600",
  accentSecondary: "text-red-700",
  accentSuccess: "text-green-600",
  accentWarning: "text-yellow-600",
  accentError: "text-red-600",
  accentInfo: "text-blue-600",

  // Interactive colors
  interactivePrimary: "bg-red-600",
  interactiveSecondary: "bg-gray-200",
  interactiveHover: "hover:bg-red-700",
  interactiveActive: "active:bg-red-800",
  interactiveDisabled: "bg-gray-300",

  // Special colors
  shadow: "shadow-gray-200/50",
  backdrop: "backdrop-blur-sm",
  divider: "border-gray-200",
};

export const getThemeColors = (theme: Theme): ThemeColors => {
  if (theme === "auto") {
    // Check system preference
    if (typeof window !== "undefined") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return isDark ? darkTheme : lightTheme;
    }
    return darkTheme; // Default to dark theme
  }

  return theme === "dark" ? darkTheme : lightTheme;
};

export const getThemeClass = (
  theme: Theme,
  colorKey: keyof ThemeColors
): string => {
  const colors = getThemeColors(theme);
  return colors[colorKey];
};

export const getThemeClasses = (
  theme: Theme,
  ...colorKeys: (keyof ThemeColors)[]
): string => {
  const colors = getThemeColors(theme);
  return colorKeys.map((key) => colors[key]).join(" ");
};

// Utility functions for common theme patterns
export const getCardClasses = (theme: Theme): string => {
  return getThemeClasses(
    theme,
    "bgCard",
    "borderPrimary",
    "shadow",
    "backdrop"
  );
};

export const getButtonClasses = (
  theme: Theme,
  variant: "primary" | "secondary" = "primary"
): string => {
  const baseClasses = "transition-colors duration-200 font-semibold rounded-lg";
  const variantClasses =
    variant === "primary"
      ? getThemeClasses(
          theme,
          "interactivePrimary",
          "interactiveHover",
          "textInverse"
        )
      : getThemeClasses(
          theme,
          "interactiveSecondary",
          "textPrimary",
          "borderPrimary"
        );

  return `${baseClasses} ${variantClasses}`;
};

export const getInputClasses = (theme: Theme): string => {
  const baseClasses = getThemeClasses(
    theme,
    "bgSecondary",
    "textPrimary",
    "borderPrimary"
  );
  const focusClass = getThemeClass(theme, "borderAccent").replace(
    "border-",
    "focus:border-"
  );
  return `${baseClasses} ${focusClass}`;
};

export const getHeaderClasses = (theme: Theme): string => {
  return getThemeClasses(theme, "bgSecondary", "borderPrimary", "backdrop");
};

export const getFooterClasses = (theme: Theme): string => {
  return getThemeClasses(
    theme,
    "bgSecondary",
    "borderPrimary",
    "textSecondary"
  );
};

// CSS Variables for dynamic theming
export const getThemeCSSVariables = (theme: Theme): Record<string, string> => {
  const colors = getThemeColors(theme);

  return {
    "--bg-primary": colors.bgPrimary.replace("bg-", ""),
    "--bg-secondary": colors.bgSecondary.replace("bg-", ""),
    "--bg-tertiary": colors.bgTertiary.replace("bg-", ""),
    "--bg-card": colors.bgCard.replace("bg-", ""),
    "--text-primary": colors.textPrimary.replace("text-", ""),
    "--text-secondary": colors.textSecondary.replace("text-", ""),
    "--text-tertiary": colors.textTertiary.replace("text-", ""),
    "--border-primary": colors.borderPrimary.replace("border-", ""),
    "--border-secondary": colors.borderSecondary.replace("border-", ""),
    "--accent-primary": colors.accentPrimary.replace("text-", ""),
    "--accent-secondary": colors.accentSecondary.replace("text-", ""),
  };
};

// Theme-aware component classes
export const themeComponents = {
  page: (theme: Theme) => getThemeClasses(theme, "bgPrimary", "textPrimary"),
  card: (theme: Theme) => getCardClasses(theme),
  button: {
    primary: (theme: Theme) => getButtonClasses(theme, "primary"),
    secondary: (theme: Theme) => getButtonClasses(theme, "secondary"),
  },
  input: (theme: Theme) => getInputClasses(theme),
  header: (theme: Theme) => getHeaderClasses(theme),
  footer: (theme: Theme) => getFooterClasses(theme),
  navigation: (theme: Theme) =>
    getThemeClasses(theme, "bgSecondary", "borderPrimary", "backdrop"),
  sidebar: (theme: Theme) =>
    getThemeClasses(theme, "bgSecondary", "borderPrimary"),
  modal: (theme: Theme) =>
    getThemeClasses(theme, "bgCard", "borderPrimary", "shadow", "backdrop"),
  dropdown: (theme: Theme) =>
    getThemeClasses(theme, "bgCard", "borderPrimary", "shadow"),
  tooltip: (theme: Theme) =>
    getThemeClasses(theme, "bgTertiary", "textPrimary", "shadow"),
  badge: (theme: Theme) =>
    getThemeClasses(theme, "bgSecondary", "textSecondary", "borderPrimary"),
  alert: {
    success: (theme: Theme) =>
      getThemeClasses(theme, "bgCard", "accentSuccess", "borderPrimary"),
    warning: (theme: Theme) =>
      getThemeClasses(theme, "bgCard", "accentWarning", "borderPrimary"),
    error: (theme: Theme) =>
      getThemeClasses(theme, "bgCard", "accentError", "borderPrimary"),
    info: (theme: Theme) =>
      getThemeClasses(theme, "bgCard", "accentInfo", "borderPrimary"),
  },
};
