import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppNavbar } from "./AppNavbar";
import { ThemeProvider } from "@/components/theme/theme-provider";

export function MainLayout() {
  // Inside MainLayout
  const location = useLocation();
  const isPosPage = location.pathname.includes("/pos1");

  return (
    <ThemeProvider>
      <SidebarProvider defaultOpen={!isPosPage}>
        <div className="flex min-h-screen w-full">
          {/* Hide sidebar only if not on POS page */}
          {!isPosPage && <AppSidebar />}
          <div className="flex flex-1 flex-col">
            <AppNavbar isPosPage={isPosPage} />
            <main className={`flex-1 bg-muted/30 ${isPosPage ? "p-1" : "p-4"}`}>
              <Outlet />
            </main>
            {!isPosPage && (
              <div className="w-full bg-white py-3 px-4 mt-3">
                <div className="flex flex-row justify-between items-center">
                  <span className="text-gray-600 text-sm">
                    2014 - 2025 © NyaBuy POS. All Rights Reserved.
                  </span>
                  <span className="text-gray-800 font-semibold text-sm">
                    NyaBuy Technologies Pvt. Ltd.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
