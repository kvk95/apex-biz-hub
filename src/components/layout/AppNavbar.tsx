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
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { ThemeCustomizer } from "@/components/theme/theme-customizer";
import { useTheme } from "../theme/theme-provider";

const addnewItems = [
  { name: "Category", icon: "fa-tags", key: "/inventory/categories" },
  { name: "Product", icon: "fa-boxes", key: "/inventory/products/create" },
  { name: "Sale", icon: "fa-globe", key: "/sales/online-orders" },
  { name: "User", icon: "fa-user", key: "/peoples/customers" },
  { name: "Supplier", icon: "fa-truck", key: "/peoples/suppliers" },
  { name: "Sales Return", icon: "fa-undo-alt", key: "/sales/return" },
];

export function DropdownTable({ dropdownOpen, setDropdownOpen }) {
  const navigate = useNavigate();
  const dropdownRef = useRef();

  // Optional: click outside to close
  useEffect(() => {
    function handleClick(event) {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen, setDropdownOpen]);

  return (
    <div
      ref={dropdownRef}
      id="dropdownRadioHelper"
      className={`z-10 absolute left-100 -top-10 mt-0 ${
        dropdownOpen ? "" : "hidden"
      } bg-white rounded shadow w-[400px]  `}
      style={{ top: "100%" }} // Ensures it appears just below the button
    >
      <table className="w-full table-fixed">
        <tbody>
          {/* 2 rows */}
          {[0, 1].map((row) => (
            <tr key={row}>
              {/* 3 cols in each row */}
              {addnewItems.slice(row * 3, row * 3 + 3).map((item) => (
                <td key={item.key} className="p-1 align-top items-center justify-center border last:border-0">
                  <button
                    className=" items-center justify-center w-full p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate(`${item.key}`, {
                        state: { mode: "create" },
                      });
                    }
                  }
                  >
                    <i
                      className={`fa ${item.icon} text-xl mr-2 selected_color_text`}
                    />
                    <br/>
                    <span className="font-medium">{item.name}</span>
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AppNavbar({ isPosPage }) {
  const [language, setLanguage] = useState("EN");
  const { theme } = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
      // Only exit fullscreen if currently in fullscreen mode
      if (document.fullscreenElement) {
        document
          .exitFullscreen()
          .then(() => {
            setIsFullscreen(false);
          })
          .catch((err) => {
            console.error("Failed to exit fullscreen:", err);
          });
      } else {
        // Not in fullscreen, ensure state is synced
        setIsFullscreen(false);
      }
    }
  };

  return (
    <>
      <style>{selectionStyle}</style>
      <header
        className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background px-6"
        style={headerStyle}
      >
        {!isPosPage ? (
          <SidebarTrigger
            className="h-8 w-8 absolute selected_color hover:bg-primary-dark"
            style={{
              left: "-13px",
              width: "25px",
              height: "25px",
              fontSize: "11px",
            }}
          />
        ) : (
          <>
            <img
              src="/assets/images/logo1.png"
              alt="NyaBuy"
              className=" "
              style={{ width: "150px", height: "40px" }}
            />
          </>
        )}

        <div className="flex flex-1 items-center gap-4">
          {!isPosPage && (
            <>
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
              </div>{" "}
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isPosPage && (
            <>
              <button
                id="dropdownRadioHelperButton"
                className="selected_color hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
              >
                <i className="fa fa-plus-circle me-2 "></i>Add New{" "}
                <i className="fa fa-chevron-down ms-2"></i>
              </button>
              <DropdownTable
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
              />
            </>
          )}

          {isPosPage && (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="bg-gray-500 text-white hover:bg-primary hover:text-primary-foreground p-2"
              >
                <i className="fa fa-dashboard "></i>
                Dashboard
              </Button>
            </>
          )}

          {!isPosPage && (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/sales/pos1")}
                className="bg-gray-800 text-white hover:bg-primary hover:text-primary-foreground py-2 px-3 text-xs"
              >
                <i className="fa fa-cash-register"></i>
                POS
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="pt-2 hover:bg-primary hover:text-primary-foreground"
          >
            {isFullscreen ? (
              <i className="fa fa-compress fa-light h-5 w-5"></i>
            ) : (
              <i className="fa fa-expand fa-light h-5 w-5"></i>
            )}
          </Button>

          {!isPosPage && (
            <>
              <ThemeCustomizer />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="pt-2 hover:bg-primary hover:text-primary-foreground"
                  >
                    <i className="fa fa-globe fa-light h-5 w-5"></i>
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
                    <i className="fa fa-bell fa-light h-5 w-5"></i>
                    <Badge className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center p">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex size-3 rounded-full bg-sky-500 text-white text-xs items-center justify-between">
                        2
                      </span>
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
            </>
          )}
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
              <DropdownMenuItem
                onClick={() => navigate("/settings/general/profile")}
              >
                <i className="fa fa-user-circle fa-light me-2"></i> Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/settings/website/system")}
              >
                <i className="fa fa-cog fa-light me-2"></i> Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <i className="fa fa-life-ring fa-light me-2"></i> Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => navigate("/logout")}
              >
                <i className="fa fa-sign-out-alt fa-light me-2"></i> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}
