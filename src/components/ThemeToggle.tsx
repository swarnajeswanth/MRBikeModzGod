"use client";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/components/hooks/useTheme";
import { Theme } from "@/components/lib/themeUtils";

interface ThemeToggleProps {
  className?: string;
  showLabels?: boolean;
  variant?: "button" | "dropdown";
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  showLabels = false,
  variant = "button",
}) => {
  const { theme, setTheme, isDark, isLight, isAuto } = useTheme();

  const getThemeIcon = (themeType: Theme) => {
    switch (themeType) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      case "auto":
        return <Monitor className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  const getThemeLabel = (themeType: Theme) => {
    switch (themeType) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "auto":
        return "Auto";
      default:
        return "Theme";
    }
  };

  if (variant === "dropdown") {
    return (
      <div className={`relative ${className}`}>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as Theme)}
          className={`appearance-none cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${useTheme().getClasses(
            "bgSecondary",
            "textPrimary",
            "borderPrimary"
          )} focus:outline-none focus:ring-2 focus:ring-offset-2 ${useTheme()
            .getClass("borderAccent")
            .replace("border-", "focus:ring-")}`}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {getThemeIcon(theme)}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {showLabels && (
        <span
          className={`text-sm font-medium ${useTheme().getClass(
            "textSecondary"
          )}`}
        >
          Theme:
        </span>
      )}

      <div className="flex rounded-lg border overflow-hidden">
        {(["light", "dark", "auto"] as Theme[]).map((themeType) => (
          <button
            key={themeType}
            onClick={() => setTheme(themeType)}
            className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
              theme === themeType
                ? useTheme().getClasses("interactivePrimary", "textInverse")
                : `${useTheme().getClasses(
                    "bgSecondary",
                    "textSecondary",
                    "borderPrimary"
                  )} hover:bg-gray-100 dark:hover:bg-gray-700`
            }`}
            title={`Switch to ${getThemeLabel(themeType)} theme`}
          >
            {getThemeIcon(themeType)}
            {showLabels && <span>{getThemeLabel(themeType)}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeToggle;
