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
  fontFamily: string;
};

type ThemeContextType = {
  theme: ThemeConfig;
  setTheme: (theme: Partial<ThemeConfig>) => void;
};

const defaultTheme: ThemeConfig = {
  headerColor: "0 0% 100%",
  sidebarColor: "0 0% 100%",
  primaryColor: "32.4 99% 63%",
  fontFamily: "Nunito, sans-serif",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: ReactNode;
  initialTheme?: Partial<ThemeConfig> | null;
}) {
  const [theme, setThemeState] = useState<ThemeConfig>(defaultTheme);

  // Apply initial theme from user.profile.theme (from backend)
  useEffect(() => {
    if (initialTheme) {
      setThemeState((prev) => ({
        ...prev,
        ...initialTheme,
        fontFamily: initialTheme.fontFamily || prev.fontFamily,
      }));
    }
  }, [initialTheme]);

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty("--header-background", theme.headerColor);
    root.style.setProperty("--sidebar-background", theme.sidebarColor);
    root.style.setProperty("--primary", theme.primaryColor);
    root.style.setProperty("--ring", theme.primaryColor);
    root.style.setProperty("--font-family", theme.fontFamily);

    const getLuminance = (hsl: string) => parseFloat(hsl.split(" ")[2]);
    const headerLum = getLuminance(theme.headerColor);
    root.style.setProperty(
      "--header-foreground",
      headerLum < 50 ? "0 0% 98%" : "240 10% 3.9%"
    );

    const sidebarLum = getLuminance(theme.sidebarColor);
    const sidebarFg = sidebarLum < 50 ? "0 0% 98%" : "240 10% 3.9%";
    root.style.setProperty("--sidebar-foreground", sidebarFg);

    const primaryLum = getLuminance(theme.primaryColor);
    root.style.setProperty(
      "--primary-foreground",
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
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
