import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppNavbar } from "./AppNavbar";
import { ThemeProvider } from "@/components/theme/theme-provider";

export function MainLayout() {
  // Inside MainLayout
  const location = useLocation();
  const isPosPage = location.pathname.startsWith("/pos");

  return (
    <ThemeProvider>
      <SidebarProvider defaultOpen={!isPosPage}>
        <div className="flex min-h-screen w-full">
          {/* Hide sidebar only if not on POS page */}
          {!isPosPage && <AppSidebar />}
          <div className="flex flex-1 flex-col">
            <AppNavbar isPosPage={isPosPage} />
            <main className="flex-1 bg-muted/30 p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
