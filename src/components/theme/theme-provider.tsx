"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";

type ThemeConfig = {
  headerColor: string;
  sidebarColor: string;
  primaryColor: string;
  mode: string;
};

type ThemeContextType = {
  theme: ThemeConfig;
  setTheme: (theme: Partial<ThemeConfig>) => void;
};

const defaultTheme: ThemeConfig = {
  headerColor: "0 0% 100%", // white
  sidebarColor: "0 0% 100%", // white
  primaryColor: "32.4 99% 63%", // Orange
  mode: "light",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeConfig>(defaultTheme);

  useEffect(() => {
    const root = document.documentElement;

    // Set colors
    root.style.setProperty("--header-background", theme.headerColor);
    root.style.setProperty("--sidebar-background", theme.sidebarColor);
    root.style.setProperty("--primary", theme.primaryColor);
    root.style.setProperty("--ring", theme.primaryColor);

    // Auto-adjust foregrounds for contrast
    const getLuminance = (hsl: string) => parseFloat(hsl.split(" ")[2]);

    const headerLum = getLuminance(theme.headerColor);
    root.style.setProperty(
      "--header-foreground",
      headerLum < 50 ? "0 0% 98%" : "240 10% 3.9%"
    );

    const sidebarLum = getLuminance(theme.sidebarColor);
    const sidebarFg = sidebarLum < 50 ? "0 0% 98%" : "240 10% 3.9%";
    const sidebarAccent = sidebarLum < 50 ? "240 3.7% 15.9%" : "240 4.8% 95.9%";
    root.style.setProperty("--sidebar-foreground", sidebarFg);
    root.style.setProperty("--sidebar-accent", sidebarAccent);
    root.style.setProperty("--sidebar-accent-foreground", sidebarFg);

    const primaryLum = getLuminance(theme.primaryColor);
    root.style.setProperty(
      "--primary-foreground",
      primaryLum < 40 ? "0 0% 98%" : "240 10% 3.9%"
    );

    // Sync sidebar primary color with theme
    root.style.setProperty("--sidebar-primary", theme.primaryColor);
    root.style.setProperty(
      "--sidebar-primary-foreground",
      primaryLum < 40 ? "0 0% 98%" : "240 10% 3.9%"
    );
  }, [theme]);

  const setTheme = (newConfig: Partial<ThemeConfig>) => {
    setThemeState((prev) => ({ ...prev, ...newConfig }));
  };

  const contextValue = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
