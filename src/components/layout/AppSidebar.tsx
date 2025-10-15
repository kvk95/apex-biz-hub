import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../theme/theme-provider";

interface MenuItem {
  title: string;
  url?: string;
  icon: string; // FontAwesome class name, e.g. "fa fa-tachometer-alt"
  badge?: string;
  items?: MenuItem[];
}

interface MenuItemComponentProps {
  item: MenuItem;
  openMenus: string[];
  toggleMenu: (title: string) => void;
  isActive: (url?: string) => boolean;
  hasActiveChild: (items?: MenuItem[]) => boolean;
  level?: number;
}

function MenuItemComponent({
  item,
  openMenus,
  toggleMenu,
  isActive,
  hasActiveChild,
  level = 0,
}: MenuItemComponentProps) {
  const isOpen = openMenus.includes(item.title);
  const isSelected = isActive(item.url);
  const IconClass = item.icon;

  const { theme } = useTheme();
  // Get primary color for selection background
  const primaryHsl = theme.primaryColor ?? "220 98% 61%";
  const selectionBg = `hsl(${primaryHsl})`;
  const selectionText = "white";

  // Get sidebar color for hover state if sidebar is dark
  const sidebarHsl = theme.sidebarColor ?? "0 0% 100%";
  const sidebarLightness = parseFloat(sidebarHsl.split(" ")[2]);
  // Use a different hover color if the sidebar is dark
  const hoverBgClass = sidebarLightness < 50 
    ? "hover:bg-white/10" // Lighter hover for dark backgrounds
    : "hover:bg-[hsl(var(--primary)/0.1)]"; // Default for light backgrounds
  
  // Determine if the item text should be light (if sidebar is dark)
  const isSidebarDark = sidebarLightness < 50;
  const defaultTextColor = isSidebarDark ? 'text-white' : 'text-gray-800';


  if (item.items && item.items.length > 0) {
    return (
      <div className="sidebarOuter">
        <SidebarMenuItem>
          <SidebarMenuButton
            className={cn(
              "w-full transition-colors",
              hoverBgClass, // Use dynamic hover background
              defaultTextColor, // Use dynamic text color
              hasActiveChild(item.items) && [
                "border-l-4",
                `border-[hsl(${theme.primaryColor || "220 98% 61%"})]`,
                "bg-[hsl(var(--primary)/0.05)]",
                "text-[hsl(var(--primary))]", // Active child link text color
              ],
              `pl-${4 + level * 2}`
            )}
            onClick={() => toggleMenu(item.title)}
            style={
              isSelected
                ? {
                    // Selected state: use primary color background and white text
                    backgroundColor: selectionBg,
                    color: selectionText,
                    // Note: borderColor is handled by class names, but the color is correctly set via theme
                    borderColor: `hsl(${theme.primaryColor || "220 98% 61%"})`,
                  }
                : undefined
            }
          >
            <i
              className={`${IconClass} fa-light mr-2`}
              aria-hidden="true"
              style={isSelected ? { color: selectionText } : undefined}
            />
            <span>{item.title}</span>
            <i
              className={`fa fa-light ${
                isOpen ? "fa-chevron-down" : "fa-chevron-right"
              } ml-auto`}
              style={{ fontSize: "10px" }}
              aria-hidden="true"
            />
          </SidebarMenuButton>
        </SidebarMenuItem>
        {isOpen && (
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <MenuItemComponent
                key={subItem.title}
                item={subItem}
                openMenus={openMenus}
                toggleMenu={toggleMenu}
                isActive={isActive}
                hasActiveChild={hasActiveChild}
                level={level + 1}
              />
            ))}
          </SidebarMenuSub>
        )}
      </div>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className={cn(
          "w-full transition-colors",
          hoverBgClass, // Use dynamic hover background
          defaultTextColor, // Use dynamic text color
          `pl-${2 + level * 2}`
        )}
        style={
          isSelected
            ? { backgroundColor: selectionBg, color: selectionText }
            : undefined
        }
      >
        <NavLink to={item.url || "#"} className="flex items-center">
          <i className={`${IconClass} fa-light mr-2`} aria-hidden="true" />
          <span>{item.title}</span>
          {item.badge && (
            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {item.badge}
            </span>
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

// ------------------------------------------------------------------
// Main Sidebar Component
// ------------------------------------------------------------------

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    fetch("/data/menuItems.json")
      .then((res) => res.json())
      .then((data) => {
        setMenuItems(data);

        const findActivePath = (
          items: MenuItem[],
          path: string[] = []
        ): string[] => {
          for (const item of items) {
            if (item.url && location.pathname === item.url) {
              return [...path, item.title];
            }
            if (item.items && item.items.length > 0) {
              const subPath = findActivePath(item.items, [...path, item.title]);
              if (subPath.length > 0) return subPath;
            }
          }
          return [];
        };

        const activePath = findActivePath(data);
        setOpenMenus(activePath);
      })
      .catch(console.error);
  }, [location.pathname]);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isActive = (url?: string) => {
    if (!url) return false;
    return location.pathname === url;
  };

  const hasActiveChild = (items?: MenuItem[]) => {
    if (!items) return false;
    return items.some(
      (item) => isActive(item.url) || hasActiveChild(item.items)
    );
  };

  // 1. Calculate theme-based styles for the sidebar
  const sidebarHsl = theme.sidebarColor ?? "0 0% 100%";
  const sidebarStyle = {
    backgroundColor: `hsl(${sidebarHsl})`,
  };

  // Determine text color for the sidebar content (logo, etc.)
  const sidebarLightness = parseFloat(sidebarHsl.split(" ")[2]);
  const contentTextColor =
    sidebarLightness < 50
      ? "hsl(0 0% 98%)" // Light text for dark sidebar
      : "hsl(240 10% 3.9%)"; // Dark text for light sidebar


  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-gray-200"
      // Apply primary sidebar color and border from theme to the main wrapper
      style={sidebarStyle} 
    >
      {/* 2. Apply theme-based background and remove fixed 'bg-white' from SidebarContent */}
      <SidebarContent 
        className="flex flex-col"
        style={sidebarStyle} 
      >
        {/* 3. Apply theme-based background and text color to the sticky header */}
        <div
          className="h-16 flex items-center justify-center sticky top-0 border-b border-gray-200 z-10 px-4"
          style={{ 
            backgroundColor: `hsl(${sidebarHsl})`,
            color: contentTextColor,
            // Ensure border is visible against the sidebar color
            borderColor: sidebarLightness < 50 ? 'hsl(0 0% 30%)' : 'hsl(240 5% 90%)' 
          }}
        >
          <h1 className="font-bold text-xl" style={{ color: contentTextColor }}>
            NyaBuy POS
          </h1>
        </div>
        <div className="overflow-y-auto flex-1 custom-scroll1">
          <SidebarMenu>
            {menuItems.map((item) => (
              <MenuItemComponent
                key={item.title}
                item={item}
                openMenus={openMenus}
                toggleMenu={toggleMenu}
                isActive={isActive}
                hasActiveChild={hasActiveChild}
                level={0}
              />
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}