import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppNavbar } from "./AppNavbar";
import { ThemeProvider } from "@/components/theme/theme-provider";

export function MainLayout() {
  return (
    <ThemeProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <AppNavbar />
            <main className="flex-1 bg-muted/30 p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
