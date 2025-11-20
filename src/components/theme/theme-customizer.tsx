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

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h / 360 + 1 / 3);
    g = hue2rgb(p, q, h / 360);
    b = hue2rgb(p, q, h / 360 - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hexToHsl(hex: string): string {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / d + 2) * 60;
        break;
      case b:
        h = ((r - g) / d + 4) * 60;
        break;
    }
  }
  return `hsl(${h.toFixed(0)}, ${Math.round(s * 100)}%, ${Math.round(
    l * 100
  )}%)`;
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0")
  );
}

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

export function ThemeCustomizer({
  initialTheme,
  onClose, // <-- callback prop
}) {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Merge initialTheme → context theme → defaults
  const resolvedTheme = {
    headerColor: initialTheme?.headerColor ?? theme.headerColor ?? "0 0% 100%",
    sidebarColor:
      initialTheme?.sidebarColor ?? theme.sidebarColor ?? "0 0% 100%",
    primaryColor:
      initialTheme?.primaryColor ?? theme.primaryColor ?? "32.4 99% 63%",
    fontFamily:
      initialTheme?.fontFamily ?? theme.fontFamily ?? "Nunito, sans-serif",
  };

  // Apply resolved theme on mount or when initialTheme changes
  useEffect(() => {
    setTheme(resolvedTheme);
  }, [
    initialTheme?.headerColor,
    initialTheme?.sidebarColor,
    initialTheme?.primaryColor,
    initialTheme?.fontFamily,
  ]);

  // When sheet closes, trigger callback with latest theme
  useEffect(() => {
    if (open && typeof onClose === "function") {
      onClose(theme);
    }
  }, [open, onClose]);

  const isLight = parseFloat(theme.primaryColor?.split(" ")[1]) > 50;
  const headerTextColor = isLight ? "hsl(240 10% 3.9%)" : "hsl(0 0% 100%)";

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
              {/* Add color picker */}
              <input
                type="color"
                className="p-1 h-8 w-8 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700"
                value={`#${(() => {
                  // Convert current hsl to hex for input value
                  // Simple parser for hsl string expected format "h s% l%"
                  const hsl = theme.primaryColor || "221.2 83.2% 53.3%";
                  const [hStr, sStr, lStr] = hsl.split(" ");
                  const h = parseFloat(hStr);
                  const s = parseFloat(sStr);
                  const l = parseFloat(lStr);
                  // Convert HSL to RGB then HEX
                  const rgb = hslToRgb(h, s / 100, l / 100);
                  return rgbToHex(rgb[0], rgb[1], rgb[2]);
                })()}`}
                title="Choose your color"
                onChange={(e) => {
                  const hex = e.target.value;
                  const hsl = hexToHsl(hex);
                  // hsl returns "hsl(h, s%, l%)" string
                  // Remove "hsl(" and ")" and commas for theme.primaryColor format "h s% l%"
                  const cleaned = hsl
                    .replace(/hsl\(/, "")
                    .replace(/\)/, "")
                    .replace(/,/g, "");
                  setTheme({ ...theme, primaryColor: cleaned });
                }}
              />
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
