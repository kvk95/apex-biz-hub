import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import POSPage from "./pages/POSPage";
import Companies from "./pages/Companies";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import Employees from "./pages/Employees";
import GenericPage from "./pages/GenericPage";
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
            
            {/* Super Admin */}
            <Route path="companies" element={<Companies />} />
            <Route path="subscriptions" element={<GenericPage title="Subscriptions" description="Manage subscription plans" />} />
            <Route path="packages" element={<GenericPage title="Packages" description="Manage pricing packages" />} />
            <Route path="domain" element={<GenericPage title="Domain Settings" description="Configure domain settings" />} />
            
            {/* Application */}
            <Route path="chat" element={<GenericPage title="Chat" description="Real-time messaging" />} />
            <Route path="call" element={<GenericPage title="Calls" description="Video & audio calls" />} />
            <Route path="calendar" element={<GenericPage title="Calendar" description="Schedule and events" />} />
            <Route path="email" element={<GenericPage title="Email" description="Inbox and email management" />} />
            <Route path="todo" element={<GenericPage title="To-Do" description="Task management" />} />
            <Route path="notes" element={<GenericPage title="Notes" description="Quick notes and memos" />} />
            <Route path="files" element={<GenericPage title="File Manager" description="Document storage" />} />
            
            {/* Inventory */}
            <Route path="low-stocks" element={<Products />} />
            <Route path="categories" element={<GenericPage title="Categories" description="Product categories" />} />
            <Route path="brands" element={<GenericPage title="Brands" description="Manage brands" />} />
            <Route path="units" element={<GenericPage title="Units" description="Measurement units" />} />
            <Route path="barcode" element={<GenericPage title="Barcode" description="Generate barcodes" />} />
            <Route path="qr-code" element={<GenericPage title="QR Code" description="Generate QR codes" />} />
            
            {/* Stock */}
            <Route path="stock" element={<GenericPage title="Manage Stock" description="Stock levels management" />} />
            <Route path="stock-adjustment" element={<GenericPage title="Stock Adjustment" description="Adjust inventory" />} />
            <Route path="stock-transfer" element={<GenericPage title="Stock Transfer" description="Transfer between locations" />} />
            
            {/* Sales */}
            <Route path="orders" element={<Orders />} />
            <Route path="pos-orders" element={<Orders />} />
            <Route path="invoices" element={<GenericPage title="Invoices" description="Manage invoices" />} />
            <Route path="sales-return" element={<GenericPage title="Sales Return" description="Process returns" />} />
            <Route path="quotations" element={<GenericPage title="Quotations" description="Price quotes" />} />
            
            {/* Promo */}
            <Route path="coupons" element={<GenericPage title="Coupons" description="Discount coupons" />} />
            <Route path="gift-cards" element={<GenericPage title="Gift Cards" description="Gift card management" />} />
            <Route path="discount-plan" element={<GenericPage title="Discount Plan" description="Discount strategies" />} />
            
            {/* Purchase */}
            <Route path="purchases" element={<GenericPage title="Purchases" description="Purchase orders" />} />
            <Route path="purchase-order" element={<GenericPage title="Purchase Order" description="Create purchase orders" />} />
            <Route path="purchase-return" element={<GenericPage title="Purchase Return" description="Return to suppliers" />} />
            
            {/* Finance */}
            <Route path="expenses" element={<GenericPage title="Expenses" description="Track expenses" />} />
            <Route path="income" element={<GenericPage title="Income" description="Track income" />} />
            <Route path="bank-accounts" element={<GenericPage title="Bank Accounts" description="Banking information" />} />
            <Route path="balance-sheet" element={<GenericPage title="Balance Sheet" description="Financial statement" />} />
            <Route path="cash-flow" element={<GenericPage title="Cash Flow" description="Cash flow analysis" />} />
            
            {/* Peoples */}
            <Route path="customers" element={<Customers />} />
            <Route path="suppliers" element={<GenericPage title="Suppliers" description="Supplier management" />} />
            <Route path="stores" element={<GenericPage title="Stores" description="Store locations" />} />
            <Route path="warehouses" element={<GenericPage title="Warehouses" description="Warehouse management" />} />
            
            {/* HRM */}
            <Route path="employees" element={<Employees />} />
            <Route path="departments" element={<GenericPage title="Departments" description="Department structure" />} />
            <Route path="attendance" element={<GenericPage title="Attendance" description="Track attendance" />} />
            <Route path="leaves" element={<GenericPage title="Leaves" description="Leave management" />} />
            <Route path="holidays" element={<GenericPage title="Holidays" description="Holiday calendar" />} />
            <Route path="payroll" element={<GenericPage title="Payroll" description="Salary processing" />} />
            
            {/* Reports & Settings */}
            <Route path="reports/*" element={<GenericPage title="Reports" description="Business analytics" />} />
            <Route path="cms/*" element={<GenericPage title="CMS" description="Content management" />} />
            <Route path="settings/*" element={<GenericPage title="Settings" description="System configuration" />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
