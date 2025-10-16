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
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const selectionStyle = `
    header::selection {
      background-color: hsl(${theme.headerColor});
      color: ${
        parseFloat(theme.headerColor.split(" ")[2]) < 50
          ? "hsl(0 0% 98%)"
          : "hsl(240 10% 3.9%)"
      };
    }
  `;

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.error("Failed to enter fullscreen:", err);
        });
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(false);
        })
        .catch((err) => {
          console.error("Failed to exit fullscreen:", err);
        });
    }
  };

  return (
    <>
      <style>{selectionStyle}</style>
      <header
        className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background px-6"
        style={headerStyle}
      >
        <SidebarTrigger
          className="h-8 w-8 absolute bg-primary text-white hover:bg-primary-dark"
          style={{ left: "-13px", width: "25px", height: "25px", fontSize: "11px" }}
        />

        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <i className="fa-light fa-magnifying-glass absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"></i>
            </div>
            <input
              type="search"
              placeholder="Search products, orders, customers..."
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              style={inputBgStyle}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="pt-2 hover:bg-primary hover:text-primary-foreground"
          >
            {isFullscreen ? (
              <i className="fa-solid fa-compress fa-light h-5 w-5"></i>
            ) : (
              <i className="fa-solid fa-expand fa-light h-5 w-5"></i>
            )}
          </Button>

          <ThemeCustomizer />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="pt-2 hover:bg-primary hover:text-primary-foreground"
              >
                <i className="fa-solid fa-globe fa-light h-5 w-5"></i>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover">
              <DropdownMenuLabel>Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setLanguage("EN")}>
                English {language === "EN" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("TA")}>
                தமிழ் {language === "TA" && "✓"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative pt-2 hover:bg-primary hover:text-primary-foreground"
              >
                <i className="fa-solid fa-bell fa-light h-5 w-5"></i>
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
              <Button
                variant="ghost"
                className="gap-2 hover:bg-primary hover:text-primary-foreground"
              >
                <img
                  src="/assets/images/avathar1.png"
                  alt="Img"
                  className="rounded-pill"
                  style={{ width: "2rem", height: "2rem" }}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover">
              <DropdownMenuLabel>
                <div className="hidden text-left lg:block">
                  <img
                    src="/assets/images/avathar1.png"
                    alt="Img"
                    className="rounded-pill"
                    style={{ width: "3rem", height: "3rem" }}
                  />
                  <span className="text-sm font-medium">Admin User</span>
                  <br />
                  <span className="text-xs text-muted-foreground">
                    admin@pos.com
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.location.href = "/auth/profile"}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = "/settings/general-settings"}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>Help & Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => window.location.href = "/auth/logout"}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}
