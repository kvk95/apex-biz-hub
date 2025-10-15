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
  const primaryHsl = theme.primaryColor ?? "220 98% 61%";
  const selectionBg = `hsl(${primaryHsl})`;
  const selectionText = "white";

  if (item.items && item.items.length > 0) {
    return (
      <div className="sidebarOuter">
        <SidebarMenuItem>
          <SidebarMenuButton
            className={cn(
              "w-full transition-colors hover:bg-[hsl(var(--primary)/0.1)]",
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
                    borderColor: " `hsl(${theme.primaryColor})`",
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
          "w-full transition-colors hover:bg-gray-100 ",
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

  const sidebarStyle = {
    backgroundColor: `hsl(${theme.sidebarColor})`,
    color:
      parseFloat(theme.sidebarColor.split(" ")[2]) < 50
        ? "hsl(0 0% 98%)"
        : "hsl(240 10% 3.9%)",
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-gray-200 "
      style={sidebarStyle}
    >
      <SidebarContent className="bg-white">
        <div className="h-16 flex items-center justify-center sticky top-0 bg-white border-b border-gray-200 z-10 px-4">
          <h1 className="font-bold text-xl text-gray-800">NyaBuy POS</h1>
        </div>
        <div className="overflow-y-auto flex-1 custom-scroll1 ">
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
