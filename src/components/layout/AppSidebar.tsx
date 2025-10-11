import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowLeftRight,
  BarChart3,
  Barcode,
  Building2,
  Calendar,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CreditCard,
  DollarSign,
  FileSpreadsheet,
  FileText,
  Gift,
  Globe,
  LayoutDashboard,
  LogOut,
  Package,
  PackageSearch,
  Percent,
  Receipt,
  RotateCcw,
  Settings,
  Shield,
  ShoppingCart,
  Store,
  Tags,
  TrendingUp,
  Truck,
  UserCog,
  Users,
  Wallet,
  QrCode,
  User,
  Lock,
  Bell,
  Plug,
  Tag,
  Sliders,
  Palette,
  LogIn,
  Languages,
  Printer,
  PenTool,
  FormInput,
  Mail,
  MessageSquare,
  Key,
  Cookie,
  Database,
  Ban,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../theme/theme-provider";

interface MenuItem {
  title: string;
  url?: string;
  icon: any;
  badge?: string;
  items?: MenuItem[];
}

const iconMap: { [key: string]: any } = {
  LayoutDashboard,
  TrendingUp,
  Shield,
  Building2,
  CreditCard,
  Package,
  Globe,
  FileSpreadsheet,
  AlertCircle,
  Tags,
  Settings,
  Barcode,
  PackageSearch,
  ArrowLeftRight,
  Truck,
  ShoppingCart,
  Store,
  Receipt,
  RotateCcw,
  Gift,
  Percent,
  DollarSign,
  FileText,
  Wallet,
  Users,
  UserCog,
  Calendar,
  CalendarDays,
  BarChart3,
  LogOut,
  QrCode,
  User,
  Lock,
  Bell,
  Plug,
  Tag,
  Sliders,
  Palette,
  LogIn,
  Languages,
  Printer,
  PenTool,
  FormInput,
  Mail,
  MessageSquare,
  Key,
  Cookie,
  Database,
  Ban,
};

interface MenuItemComponentProps {
  item: MenuItem;
  openMenus: string[];
  toggleMenu: (title: string) => void;
  isActive: (url?: string) => boolean;
  hasActiveChild: (items?: MenuItem[]) => boolean;
  theme: { primary?: string; sidebarColor: string };
  state: "expanded" | "collapsed";
  level?: number;
}

function MenuItemComponent({
  item,
  openMenus,
  toggleMenu,
  isActive,
  hasActiveChild,
  theme,
  state,
  level = 0,
}: MenuItemComponentProps) {
  const Icon = item.icon;

  if (item.items) {
    return (
      <Collapsible
        key={item.title}
        open={openMenus.includes(item.title)}
        onOpenChange={() => toggleMenu(item.title)}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              className={cn(
                "w-full transition-colors hover:bg-[hsl(var(--primary)/0.1)]",
                hasActiveChild(item.items) && [
                  "border-l-4",
                  `border-[hsl(${theme.primary || "220 98% 61%"})]`,
                  "bg-[hsl(var(--primary)/0.05)]",
                  "text-[hsl(var(--primary))]",
                ],
                `pl-${4 + level * 2}`
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
              {item.badge && state === "expanded" && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                  {item.badge}
                </span>
              )}
              {state === "expanded" &&
                (openMenus.includes(item.title) ? (
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform" />
                ) : (
                  <ChevronRight className="ml-auto h-4 w-4 transition-transform" />
                ))}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items.map((subItem) => (
                <MenuItemComponent
                  key={subItem.title}
                  item={subItem}
                  openMenus={openMenus}
                  toggleMenu={toggleMenu}
                  isActive={isActive}
                  hasActiveChild={hasActiveChild}
                  theme={theme}
                  state={state}
                  level={level + 1}
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive(item.url)}
        className={cn(
          "transition-colors hover:bg-[hsl(var(--primary)/0.1)]",
          isActive(item.url) && ["bg-[hsl(var(--primary))]", "text-white"],
          `pl-${4 + level * 2}`
        )}
      >
        <NavLink to={item.url || "#"}>
          <Icon className={cn("h-4 w-4", isActive(item.url) && "text-white")} />
          <span>{item.title}</span>
          {item.badge && (
            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
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
  const [openMenus, setOpenMenus] = useState<string[]>(["Dashboard"]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    fetch("/data/menuItems.json")
      .then((response) => response.json())
      .then((data) => {
        const mapIcons = (items: any[]): MenuItem[] => {
          return items.map((item) => ({
            ...item,
            icon: iconMap[item.icon],
            items: item.items ? mapIcons(item.items) : undefined,
          }));
        };
        const items = mapIcons(data);
        setMenuItems(items);

        const findActiveParents = (
          items: MenuItem[],
          parents: string[] = []
        ): string[] => {
          for (const item of items) {
            if (item.url && location.pathname === item.url) {
              return parents;
            }
            if (item.items) {
              const subParents = findActiveParents(item.items, [
                ...parents,
                item.title,
              ]);
              if (subParents.length > 0) {
                return subParents;
              }
            }
          }
          return [];
        };

        const activeParents = findActiveParents(items);
        setOpenMenus(["Dashboard", ...activeParents]);
      })
      .catch((error) => console.error("Error loading menuItems:", error));
  }, [location.pathname]);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => {
      if (prev.includes(title)) {
        return prev.filter((item) => item !== title);
      }
      return [...prev, title];
    });
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
  "--sidebar-background": theme.sidebarColor, // Add to CSS variables
};

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border sidebar"
      style={sidebarStyle}
    >
      <SidebarContent className="bg-sidebar">
        <div
          className="flex h-16 items-center justify-center border-b border-sidebar-border px-5 sticky top-0 z-10 bg-sidebar w-full sidebar-top"
          style={{ padding: "17px", color: `#000000` }}
        >
          {state === "expanded" ? (
            <h1 className="text-xl font-bold text-sidebar-foreground">
              NyaBuy POS
            </h1>
          ) : (
            <LayoutDashboard className="h-6 w-6 text-sidebar-primary" />
          )}
        </div>
        <div className="flex-grow overflow-y-auto custom-scroll1">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <MenuItemComponent
                    key={item.title}
                    item={item}
                    openMenus={openMenus}
                    toggleMenu={toggleMenu}
                    isActive={isActive}
                    hasActiveChild={hasActiveChild}
                    theme={theme}
                    state={state}
                    level={0}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
