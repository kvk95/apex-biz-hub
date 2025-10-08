"use client";

import { Settings } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";
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
    { name: "Dark", value: "240 10% 3.9%" },
    { name: "Indigo", value: "265 47% 44%" },
  ],
  sidebar: [
    { name: "White", value: "0 0% 100%" },
    { name: "Light Gray", value: "0 0% 96.1%" },
    { name: "Dark", value: "240 10% 3.9%" },
    { name: "Indigo", value: "265 47% 44%" },
  ],
  primary: [
    { name: "Indigo", value: "265 47% 44%" },
    { name: "Purple", value: "283 85% 65%" },
    { name: "Blue", value: "221.2 83.2% 53.3%" },
    { name: "Green", value: "142.1 76.2% 36.3%" },
    { name: "Orange", value: "24.6 95% 53.1%" },
  ],
};

function ColorSwatch({
  color,
  isActive,
  onClick,
}: {
  color: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-8 h-8 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
        isActive ? "ring-2 ring-ring ring-offset-2" : ""
      }`}
      style={{ backgroundColor: `hsl(${color})` }}
      aria-label={`Set color to hsl(${color})`}
    />
  );
}

export function ThemeCustomizer() {
  const { theme, setTheme } = useTheme();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Customize Theme</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-white">
        <SheetHeader>
          <SheetTitle>Customize Theme</SheetTitle>
        </SheetHeader>
        <div className="py-4 space-y-6 ">
          <div className="space-y-3">
            <Label>Header Color</Label>
            <div className="flex flex-wrap gap-2">
              {colors.header.map((c) => (
                <ColorSwatch
                  key={c.name}
                  color={c.value}
                  isActive={theme.headerColor === c.value}
                  onClick={() => setTheme({ headerColor: c.value })}
                />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Label>Sidebar Color</Label>
            <div className="flex flex-wrap gap-2">
              {colors.sidebar.map((c) => (
                <ColorSwatch
                  key={c.name}
                  color={c.value}
                  isActive={theme.sidebarColor === c.value}
                  onClick={() => setTheme({ sidebarColor: c.value })}
                />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Label>Theme Color</Label>
            <div className="flex flex-wrap gap-2">
              {colors.primary.map((c) => (
                <ColorSwatch
                  key={c.name}
                  color={c.value}
                  isActive={theme.primaryColor === c.value}
                  onClick={() => setTheme({ primaryColor: c.value })}
                />
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
