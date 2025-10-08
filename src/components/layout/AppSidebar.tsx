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
  useSidebar
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowLeftRight,
  BarChart3,
  Barcode,
  BookOpen,
  Box,
  Building2,
  Calendar,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  CreditCard,
  DollarSign,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Gift,
  Globe,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Package,
  PackageSearch,
  Percent,
  Phone,
  QrCode,
  Receipt,
  RotateCcw,
  Settings,
  Shield,
  ShoppingCart,
  StickyNote,
  Store,
  Tags,
  TrendingUp,
  Truck,
  UserCog,
  Users,
  Wallet
} from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../theme/theme-provider";

interface MenuItem {
  title: string;
  url?: string;
  icon: any;
  badge?: string;
  items?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    items: [
      { title: "Admin Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Sales Dashboard", url: "/sales-dashboard", icon: TrendingUp },
    ],
  },
  {
    title: "Super Admin",
    icon: Shield,
    items: [
      { title: "Companies", url: "/companies", icon: Building2 },
      { title: "Subscriptions", url: "/subscriptions", icon: CreditCard },
      { title: "Packages", url: "/packages", icon: Box },
      { title: "Domain", url: "/domain", icon: Globe },
    ],
  },
  {
    title: "Application",
    icon: MessageSquare,
    items: [
      { title: "Chat", url: "/chat", icon: MessageSquare },
      { title: "Call", url: "/call", icon: Phone },
      { title: "Calendar", url: "/calendar", icon: Calendar },
      { title: "Email", url: "/email", icon: Mail },
      { title: "To-Do", url: "/todo", icon: ClipboardList },
      { title: "Notes", url: "/notes", icon: StickyNote },
      { title: "File Manager", url: "/files", icon: FolderOpen },
    ],
  },
  {
    title: "Inventory",
    icon: Package,
    items: [
      { title: "Products", url: "/products", icon: Package },
      { title: "Create Product", url: "/products/create", icon: Package },
      {
        title: "Low Stocks",
        url: "/low-stocks",
        icon: AlertCircle,
        badge: "5",
      },
      { title: "Category", url: "/categories", icon: Tags },
      { title: "Brands", url: "/brands", icon: Tags },
      { title: "Units", url: "/units", icon: Box },
      { title: "Print Barcode", url: "/barcode", icon: Barcode },
      { title: "Print QR Code", url: "/qr-code", icon: QrCode },
    ],
  },
  {
    title: "Stock",
    icon: PackageSearch,
    items: [
      { title: "Manage Stock", url: "/stock", icon: PackageSearch },
      {
        title: "Stock Adjustment",
        url: "/stock-adjustment",
        icon: ArrowLeftRight,
      },
      { title: "Stock Transfer", url: "/stock-transfer", icon: Truck },
    ],
  },
  {
    title: "Sales",
    icon: ShoppingCart,
    items: [
      { title: "Online Orders", url: "/orders", icon: ShoppingCart },
      { title: "POS Orders", url: "/pos-orders", icon: Store },
      { title: "Invoices", url: "/invoices", icon: Receipt },
      { title: "Sales Return", url: "/sales-return", icon: RotateCcw },
      { title: "Quotations", url: "/quotations", icon: FileSpreadsheet },
    ],
  },
  {
    title: "POS",
    icon: Store,
    items: [
      { title: "POS 1", url: "/pos-1", icon: Store },
      { title: "POS 2", url: "/pos-2", icon: Store },
      { title: "POS 3", url: "/pos-3", icon: Store },
    ],
  },
  {
    title: "Promo",
    icon: Gift,
    items: [
      { title: "Coupons", url: "/coupons", icon: Gift },
      { title: "Gift Cards", url: "/gift-cards", icon: CreditCard },
      { title: "Discount Plan", url: "/discount-plan", icon: Percent },
    ],
  },
  {
    title: "Purchase",
    icon: Truck,
    items: [
      { title: "Purchases", url: "/purchases", icon: Truck },
      {
        title: "Purchase Order",
        url: "/purchase-order",
        icon: FileSpreadsheet,
      },
      { title: "Purchase Return", url: "/purchase-return", icon: RotateCcw },
    ],
  },
  {
    title: "Finance & Accounts",
    icon: Wallet,
    items: [
      { title: "Expenses", url: "/expenses", icon: DollarSign },
      { title: "Income", url: "/income", icon: DollarSign },
      { title: "Bank Accounts", url: "/bank-accounts", icon: CreditCard },
      { title: "Balance Sheet", url: "/balance-sheet", icon: FileText },
      { title: "Cash Flow", url: "/cash-flow", icon: TrendingUp },
    ],
  },
  {
    title: "Peoples",
    icon: Users,
    items: [
      { title: "Customers", url: "/customers", icon: Users },
      { title: "Suppliers", url: "/suppliers", icon: Truck },
      { title: "Stores", url: "/stores", icon: Store },
      { title: "Warehouses", url: "/warehouses", icon: Building2 },
    ],
  },
  {
    title: "HRM",
    icon: UserCog,
    items: [
      { title: "Employees", url: "/employees", icon: Users },
      { title: "Departments", url: "/departments", icon: Building2 },
      { title: "Attendance", url: "/attendance", icon: CalendarDays },
      { title: "Leaves", url: "/leaves", icon: Calendar },
      { title: "Holidays", url: "/holidays", icon: Calendar },
      { title: "Payroll", url: "/payroll", icon: DollarSign },
    ],
  },
  {
    title: "Reports",
    icon: BarChart3,
    items: [
      { title: "Sales Report", url: "/reports/sales", icon: BarChart3 },
      { title: "Purchase Report", url: "/reports/purchase", icon: BarChart3 },
      { title: "Inventory Report", url: "/reports/inventory", icon: BarChart3 },
      { title: "Profit & Loss", url: "/reports/profit-loss", icon: BarChart3 },
    ],
  },
  {
    title: "CMS",
    icon: BookOpen,
    items: [
      { title: "Pages", url: "/cms/pages", icon: FileText },
      { title: "Blog", url: "/cms/blog", icon: BookOpen },
      { title: "FAQ", url: "/cms/faq", icon: MessageSquare },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    items: [
      { title: "General Settings", url: "/settings/general", icon: Settings },
      { title: "Website Settings", url: "/settings/website", icon: Globe },
      { title: "App Settings", url: "/settings/app", icon: Settings },
      { title: "User Management", url: "/settings/users", icon: Users },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>(["Dashboard"]);
  const { theme } = useTheme();

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
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
      className="border-r border-border sidebar"
      style={sidebarStyle}
    >
      <SidebarContent className="bg-sidebar">
        {/* Fixed Header */}
        <div
          className="flex h-16 items-center justify-center border-b border-sidebar-border px-5 sticky top-0 z-10 bg-sidebar w-full sidebar-top"
          style={{ padding: "17px", color: `#000000` }}
        >
          {state === "expanded" ? (
            <h1 className="text-xl font-bold text-sidebar-foreground ">
              NyaBuy POS
            </h1>
          ) : (
            <LayoutDashboard className="h-6 w-6 text-sidebar-primary" />
          )}
        </div>

        {/* Scrollable Menu Section */}
        <div className="flex-grow overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) =>
                  item.items ? (
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
                              "w-full transition-colors",
                              hasActiveChild(item.items) &&
                                "bg-sidebar-accent text-sidebar-accent-foreground"
                            )}
                          >
                            <item.icon className="h-4 w-4" />
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
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActive(subItem.url)}
                                  className="transition-colors"
                                >
                                  <NavLink to={subItem.url || "#"}>
                                    <subItem.icon className="h-4 w-4" />
                                    <span>{subItem.title}</span>
                                    {subItem.badge && (
                                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                                        {subItem.badge}
                                      </span>
                                    )}
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <NavLink to={item.url || "#"}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
