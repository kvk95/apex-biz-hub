import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../theme/theme-provider";

// ------------------------------------------------------------------
// 1. Direct import of the JSON file (placed in src/data/menuItems.json)
// ------------------------------------------------------------------
import menuItems from "@/data/menuItems.json";

interface MenuItem {
  title: string;
  url?: string;
  icon: string; // FontAwesome class name, e.g. "fa fa-tachometer-alt"
  badge?: string;
  items?: MenuItem[];
}

// ------------------------------------------------------------------
// 2. Recursive menu-item component
// ------------------------------------------------------------------
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

  // ---- primary selection colour -------------------------------------------------
  const primaryHsl = theme.primaryColor ?? "220 98% 61%";
  const selectionBg = `hsl(${primaryHsl})`;
  const selectionText = "white";

  // ---- sidebar colour (hover / text) -------------------------------------------
  const sidebarHsl = theme.sidebarColor ?? "0 0% 100%";
  const sidebarLightness = parseFloat(sidebarHsl.split(" ")[2]);

  const hoverBgClass =
    sidebarLightness < 50
      ? "hover:bg-white/10"
      : "hover:bg-[hsl(var(--primary)/0.1)]";

  const defaultTextColor = sidebarLightness < 50 ? "text-white" : "text-gray-800";

  // ---------------------------------------------------------------------------
  // Parent item (has children)
  // ---------------------------------------------------------------------------
  if (item.items && item.items.length > 0) {
    return (
      <div className="sidebarOuter">
        <SidebarMenuItem>
          <SidebarMenuButton
            className={cn(
              "w-full transition-colors",
              hoverBgClass,
              defaultTextColor,
              hasActiveChild(item.items) && [
                "border-l-4",
                `border-[hsl(${theme.primaryColor || "220 98% 61%"})]`,
                "bg-[hsl(var(--primary)/0.05)]",
                "text-[hsl(var(--primary))]",
              ],
              `pl-${4 + level * 2}`
            )}
            onClick={() => toggleMenu(item.title)}
            style={
              isSelected
                ? {
                    backgroundColor: selectionBg,
                    color: selectionText,
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

  // ---------------------------------------------------------------------------
  // Leaf item
  // ---------------------------------------------------------------------------
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className={cn(
          "w-full transition-colors",
          hoverBgClass,
          defaultTextColor,
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
// 3. Main Sidebar component
// ------------------------------------------------------------------
export function AppSidebar() {
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const { theme } = useTheme();

  // Hover-based temporary expansion
  const [isHovered, setIsHovered] = useState(false);
  const [isTemporaryExpanded, setIsTemporaryExpanded] = useState(false);
  const isOpen = open;

  // --------------------------------------------------------------
  // Hover expansion logic
  // --------------------------------------------------------------
  useEffect(() => {
    if (isHovered && !open) {
      setOpen(true);
      setIsTemporaryExpanded(true);
    }
  }, [isHovered, open, setOpen]);

  useEffect(() => {
    if (!isHovered && isTemporaryExpanded) {
      setOpen(false);
      setIsTemporaryExpanded(false);
    }
  }, [isHovered, isTemporaryExpanded, setOpen]);

  // --------------------------------------------------------------
  // Auto-open menus that contain the current route
  // --------------------------------------------------------------
  useEffect(() => {
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

    const activePath = findActivePath(menuItems);
    setOpenMenus(activePath);
  }, [location.pathname]);

  // --------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------
  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isActive = (url?: string) => !!url && location.pathname === url;

  const hasActiveChild = (items?: MenuItem[]): boolean => {
    if (!items) return false;
    return items.some(
      (it) => isActive(it.url) || hasActiveChild(it.items)
    );
  };

  // --------------------------------------------------------------
  // Theme-based sidebar styles
  // --------------------------------------------------------------
  const sidebarHsl = theme.sidebarColor ?? "0 0% 100%";
  const sidebarStyle = { backgroundColor: `hsl(${sidebarHsl})` };

  const sidebarLightness = parseFloat(sidebarHsl.split(" ")[2]);
  const contentTextColor =
    sidebarLightness < 50 ? "hsl(0 0% 98%)" : "hsl(240 10% 3.9%)";

  // --------------------------------------------------------------
  // Render
  // --------------------------------------------------------------
  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-gray-200"
      style={sidebarStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <SidebarContent className="flex flex-col" style={sidebarStyle}>
        {/* Header / Logo */}
        <div
          className={`h-16 flex items-center justify-center sticky top-0 border-b border-gray-200 z-10 ${
            isOpen ? "px-4" : "pe-1"
          }`}
          style={{
            backgroundColor: `hsl(${sidebarHsl})`,
            color: contentTextColor,
            borderColor:
              sidebarLightness < 50 ? "hsl(0 0% 30%)" : "hsl(240 5% 90%)",
          }}
        >
          {isOpen ? (
            <img
              src="/assets/images/logo1.png"
              alt="NyaBuy"
              style={{ width: "150px", height: "40px" }}
            />
          ) : (
            <img
              src="/assets/images/logo2.png"
              alt="NyaBuy"
              style={{ width: "40px", height: "40px" }}
            />
          )}
        </div>

        {/* Menu */}
        <div className="overflow-y-auto flex-1 sidebar-scroll1">
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