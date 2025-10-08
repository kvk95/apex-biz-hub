import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import POSPage from "./pages/POSPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="sales-dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/create" element={<Products />} />
            <Route path="pos-1" element={<POSPage />} />
            <Route path="pos-2" element={<POSPage />} />
            <Route path="pos-3" element={<POSPage />} />
            
            {/* Placeholder routes for all modules */}
            <Route path="companies" element={<Dashboard />} />
            <Route path="subscriptions" element={<Dashboard />} />
            <Route path="packages" element={<Dashboard />} />
            <Route path="domain" element={<Dashboard />} />
            <Route path="chat" element={<Dashboard />} />
            <Route path="call" element={<Dashboard />} />
            <Route path="calendar" element={<Dashboard />} />
            <Route path="email" element={<Dashboard />} />
            <Route path="todo" element={<Dashboard />} />
            <Route path="notes" element={<Dashboard />} />
            <Route path="files" element={<Dashboard />} />
            <Route path="low-stocks" element={<Products />} />
            <Route path="categories" element={<Dashboard />} />
            <Route path="brands" element={<Dashboard />} />
            <Route path="units" element={<Dashboard />} />
            <Route path="barcode" element={<Dashboard />} />
            <Route path="qr-code" element={<Dashboard />} />
            <Route path="stock" element={<Dashboard />} />
            <Route path="stock-adjustment" element={<Dashboard />} />
            <Route path="stock-transfer" element={<Dashboard />} />
            <Route path="orders" element={<Dashboard />} />
            <Route path="pos-orders" element={<Dashboard />} />
            <Route path="invoices" element={<Dashboard />} />
            <Route path="sales-return" element={<Dashboard />} />
            <Route path="quotations" element={<Dashboard />} />
            <Route path="coupons" element={<Dashboard />} />
            <Route path="gift-cards" element={<Dashboard />} />
            <Route path="discount-plan" element={<Dashboard />} />
            <Route path="purchases" element={<Dashboard />} />
            <Route path="purchase-order" element={<Dashboard />} />
            <Route path="purchase-return" element={<Dashboard />} />
            <Route path="expenses" element={<Dashboard />} />
            <Route path="income" element={<Dashboard />} />
            <Route path="bank-accounts" element={<Dashboard />} />
            <Route path="balance-sheet" element={<Dashboard />} />
            <Route path="cash-flow" element={<Dashboard />} />
            <Route path="customers" element={<Dashboard />} />
            <Route path="suppliers" element={<Dashboard />} />
            <Route path="stores" element={<Dashboard />} />
            <Route path="warehouses" element={<Dashboard />} />
            <Route path="employees" element={<Dashboard />} />
            <Route path="departments" element={<Dashboard />} />
            <Route path="attendance" element={<Dashboard />} />
            <Route path="leaves" element={<Dashboard />} />
            <Route path="holidays" element={<Dashboard />} />
            <Route path="payroll" element={<Dashboard />} />
            <Route path="reports/*" element={<Dashboard />} />
            <Route path="cms/*" element={<Dashboard />} />
            <Route path="settings/*" element={<Dashboard />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
