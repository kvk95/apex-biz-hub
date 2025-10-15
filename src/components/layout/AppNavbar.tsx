// Icons replaced with Font Awesome
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { ThemeCustomizer } from "@/components/theme/theme-customizer";
import { useTheme } from "../theme/theme-provider";

export function AppNavbar() {
  const [language, setLanguage] = useState("EN");
  const { theme } = useTheme();

  const notifications = [
    { id: 1, title: "New order received", time: "2 min ago", unread: true },
    { id: 2, title: "Low stock alert", time: "1 hour ago", unread: true },
    { id: 3, title: "Payment received", time: "3 hours ago", unread: false },
  ];

  const headerStyle = {
    backgroundColor: `hsl(${theme.headerColor})`,
    color:
      parseFloat(theme.headerColor.split(" ")[2]) < 50
        ? "hsl(0 0% 98%)"
        : "hsl(240 10% 3.9%)",
  };

  const inputBgStyle = {
    backgroundColor:
      parseFloat(theme.headerColor.split(" ")[2]) < 50
        ? "hsl(240 3.7% 15.9%)"
        : "hsl(240 4.8% 95.9%)",
  };

  return (
    <header
      className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background px-6"
      style={headerStyle}
    >
      <SidebarTrigger className="h-8 w-8" />

      <div className="flex flex-1 items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            placeholder="Search products, orders, customers..."
            className="w-full pl-10 bg-muted/50"
            style={inputBgStyle}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeCustomizer />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <i className="fa fa-globe h-5 w-5" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuLabel>Language</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setLanguage("EN")}>
              English {language === "EN" && "✓"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("AR")}>
              العربية {language === "AR" && "✓"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <i className="fa fa-bell h-5 w-5" aria-hidden="true" />
              <Badge className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs bg-destructive">
                2
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-popover">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Badge variant="secondary">2 New</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start p-3"
              >
                <div className="flex w-full items-start justify-between">
                  <p className={notification.unread ? "font-medium" : ""}>
                    {notification.title}
                  </p>
                  {notification.unread && (
                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {notification.time}
                </span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary">
              View All
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <img src="/assets/images/avathar1.png" alt="Img" className="rounded-pill" style={{width:"2rem", height:"2rem"}}></img> 
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover">
            <DropdownMenuLabel>              
              <div className="hidden text-left lg:block">
                 <img src="/assets/images/avathar1.png" alt="Img" className="rounded-pill" style={{width:"3rem", height:"3rem"}}></img> 
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@pos.com</p>
              </div></DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Help & Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
