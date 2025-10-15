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
    // Colors from the referenced image for Header
    { name: "White", value: "0 0% 100%" }, // White
    { name: "Light Gray", value: "0 0% 96.1%" }, // Very Light Gray
    { name: "Slate Gray", value: "217 19% 35%" }, // A shade of slate gray
    { name: "Dark Grey", value: "240 6% 20%" }, // A darker grey/almost black
    { name: "Strong Blue", value: "221 83% 40%" }, // A strong blue
    { name: "Deep Purple", value: "265 47% 44%" }, // Deep purple (similar to original primary)
    { name: "Teal", value: "178 70% 30%" }, // A teal color
  ],
  sidebar: [
    // Colors from the referenced image for Sidebar
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
    { name: "Orange", value: "24.6 95% 53.1%" },
    { name: "Red", value: "0 84% 60%" },
    { name: "Pink", value: "330 100% 71%" },
    { name: "Teal", value: "170 100% 40%" },
  ],
};

function ColorSwatch({ color, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      // Made swatches smaller (w-8 h-8)
      className={`w-8 h-8 rounded-full transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 ${
        isActive
          ? "ring-primary ring-4 ring-offset-2 border-2 border-white"
          : "ring-1 ring-offset-1 border border-muted-foreground/50 hover:ring-2 hover:ring-muted-foreground/75"
      }`}
      style={{ backgroundColor: `hsl(${color})` }}
      aria-label={`Set color to hsl(${color})`}
    />
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

  // Determine appropriate text color for the SheetHeader title based on the primary color's lightness
  const isLight = parseFloat(theme.primaryColor?.split(' ')[1]) > 50;
  const headerTextColor = isLight ? 'hsl(240 10% 3.9%)' : 'hsl(0 0% 100%)';

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
      <SheetContent className="bg-white">
        <SheetHeader
          style={{
            backgroundColor: `hsl(${theme.primaryColor})`,
            color: headerTextColor,
            padding: '1rem',
            margin: '-1rem -1rem 1rem -1rem',
            borderRadius: '0.375rem 0.375rem 0 0'
          }}
        >
          <SheetTitle
            className="text-white"
            style={{ color: headerTextColor }}
          >
            Customize Theme
          </SheetTitle>
        </SheetHeader>
        <div className="py-4 space-y-6">
          {/* Header Color Section */}
          <div className="space-y-3 border border-muted rounded-md p-4">
            <Label>Header Color</Label>
            <div className="flex flex-wrap gap-3">
              {colors.header.map((c) => (
                <ColorSwatch
                  key={c.name}
                  color={c.value}
                  isActive={theme.headerColor === c.value}
                  onClick={() => setTheme({ ...theme, headerColor: c.value })}
                />
              ))}
            </div>
          </div>
          {/* Sidebar Color Section */}
          <div className="space-y-3 border border-muted rounded-md p-4">
            <Label>Sidebar Color</Label>
            <div className="flex flex-wrap gap-3">
              {colors.sidebar.map((c) => (
                <ColorSwatch
                  key={c.name}
                  color={c.value}
                  isActive={theme.sidebarColor === c.value}
                  onClick={() => setTheme({ ...theme, sidebarColor: c.value })}
                />
              ))}
            </div>
          </div>
          {/* Theme Color (Primary) Section */}
          <div className="space-y-3 border border-muted rounded-md p-4">
            <Label>Theme Color</Label>
            <div className="flex flex-wrap gap-3">
              {colors.primary.map((c) => (
                <ColorSwatch
                  key={c.name}
                  color={c.value}
                  isActive={theme.primaryColor === c.value}
                  onClick={() => setTheme({ ...theme, primaryColor: c.value })}
                />
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}