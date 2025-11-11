"use client";

// Icons replaced with Font Awesome
import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "../ui/label";

const colors = {
  header: [
    { name: "White", value: "0 0% 100%" },
    { name: "Light Gray", value: "0 0% 96.1%" },
    { name: "Slate Gray", value: "217 19% 35%" },
    { name: "Dark Grey", value: "240 6% 20%" },
    { name: "Strong Blue", value: "221 83% 40%" },
    { name: "Deep Purple", value: "265 47% 44%" },
    { name: "Teal", value: "178 70% 30%" },
  ],
  sidebar: [
    { name: "White", value: "0 0% 100%" },
    { name: "Light Gray", value: "0 0% 96.1%" },
    { name: "Slate Gray", value: "217 19% 35%" },
    { name: "Dark Grey", value: "240 6% 20%" },
    { name: "Strong Blue", value: "221 83% 40%" },
    { name: "Deep Purple", value: "265 47% 44%" },
    { name: "Teal", value: "178 70% 30%" },
  ],
  primary: [
    { name: "Indigo", value: "265 47% 44%" },
    { name: "Purple", value: "283 85% 65%" },
    { name: "Blue", value: "221.2 83.2% 53.3%" },
    { name: "Green", value: "142.1 76.2% 36.3%" },
    { name: "Orange", value: "32.4 99% 63%" },
    { name: "Red", value: "0 84% 60%" },
    { name: "Pink", value: "330 100% 71%" },
    { name: "Teal", value: "170 100% 40%" },
  ],
};

const fontOptions = [
  { name: "Nunito", value: "Nunito, sans-serif" },
  { name: "Oswald", value: "Oswald, sans-serif" },
  { name: "Poppins", value: "Poppins, sans-serif" },
  { name: "Ubuntu", value: "Ubuntu, sans-serif" },
];

// Function to darken a given HSL color by reducing its lightness
const darkenHSL = (hsl: string, amount: number) => {
  const [h, s, l] = hsl.split(" ").map((value) => parseFloat(value));
  const newLightness = Math.max(0, l - amount); // Ensure lightness doesn't go below 0
  return `${h} ${s}% ${newLightness}%`; // Return the new HSL with darkened lightness
};

function ColorSwatch({ color, isActive, primaryColor, onClick }) {
  // Darken the primary color for the tick mark
  const darkPrimaryColor = darkenHSL(primaryColor, 20); // Darken by 20% (adjust as needed)

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-8 h-8 rounded-full transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 ${
        isActive
          ? "border-4 border-dark-foreground ring-primary"
          : "border border-muted-foreground/50 hover:ring-4 hover:ring-offset-2 hover:ring-gray-300 shadow-md"
      } relative`}
      style={{ backgroundColor: `hsl(${color})` }}
      aria-label={`Set color to hsl(${color})`}
    >
      {/* Tick mark for selected color */}
      {isActive && (
        <i
          className="fa fa-check rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm"
          style={{ color: `hsl(${darkPrimaryColor})` }} // Apply darkened primary color to the tick icon
          aria-hidden="true"
        />
      )}
    </button>
  );
}

export function ThemeCustomizer() {
  const { theme, setTheme } = useTheme();

  const initializeTheme = () => {
    const defaults = {
      headerColor: theme.headerColor || colors.header[0].value,
      sidebarColor: theme.sidebarColor || colors.sidebar[0].value,
      primaryColor: theme.primaryColor || colors.primary[0].value,
    };
    if (!theme.headerColor || !theme.sidebarColor || !theme.primaryColor) {
      setTheme(defaults);
    }
  };

  useEffect(() => {
    initializeTheme();
  }, [theme, setTheme]);

  const isLight = parseFloat(theme.primaryColor?.split(" ")[1]) > 50;
  const headerTextColor = isLight ? "hsl(240 10% 3.9%)" : "hsl(0 0% 100%)";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary hover:text-primary-foreground"
        >
          <i
            className="fa fa-palette fa-light h-5 w-5 mt-2"
            aria-hidden="true"
          />
          <span className="sr-only">Customize Theme</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-white rounded-lg ">
        <SheetHeader
          style={{
            backgroundColor: `hsl(${theme.primaryColor})`,
            color: headerTextColor,
            padding: "1rem",
            margin: "-1rem -1rem 1rem -1rem",
            borderRadius: "0.375rem 0.375rem 0 0",
          }}
        >
          <SheetTitle className="text-white" style={{ color: headerTextColor }}>
            Customize Theme
          </SheetTitle>
        </SheetHeader>
        <div className="  space-y-4">
          {/* Header Color Section */}
          <div className="space-y-3 border border-muted rounded-md p-2">
            <Label>Header Color</Label>
            <div className="flex flex-wrap gap-3">
              {colors.header.map((c) => (
                <ColorSwatch
                  key={c.name}
                  color={c.value}
                  isActive={theme.headerColor === c.value}
                  primaryColor={theme.primaryColor} // Pass the primary color
                  onClick={() => setTheme({ ...theme, headerColor: c.value })}
                />
              ))}
            </div>
          </div>
          {/* Sidebar Color Section */}
          <div className="space-y-3 border border-muted rounded-md p-2">
            <Label>Sidebar Color</Label>
            <div className="flex flex-wrap gap-3">
              {colors.sidebar.map((c) => (
                <ColorSwatch
                  key={c.name}
                  color={c.value}
                  isActive={theme.sidebarColor === c.value}
                  primaryColor={theme.primaryColor} // Pass the primary color
                  onClick={() => setTheme({ ...theme, sidebarColor: c.value })}
                />
              ))}
            </div>
          </div>
          {/* Theme Color (Primary) Section */}
          <div className="space-y-3 border border-muted rounded-md p-2">
            <Label>Theme Color</Label>
            <div className="flex flex-wrap gap-3">
              {colors.primary.map((c) => (
                <ColorSwatch
                  key={c.name}
                  color={c.value}
                  isActive={theme.primaryColor === c.value}
                  primaryColor={theme.primaryColor} // Pass the primary color
                  onClick={() => setTheme({ ...theme, primaryColor: c.value })}
                />
              ))}
            </div>
          </div>

          {/* Font Family Dropdown */}
          <div className="space-y-3 border border-muted rounded-md p-2">
            <Label>Font</Label>
            <select
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              value={theme.fontFamily || fontOptions[0].value}
              onChange={(e) =>
                setTheme({ ...theme, fontFamily: e.target.value })
              }
            >
              {fontOptions.map((f) => (
                <option
                  key={f.name}
                  value={f.value}
                  style={{ fontFamily: f.value }}
                >
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
