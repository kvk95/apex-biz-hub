import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import GenericPage from "./pages/GenericPage";
import Employees from "./pages/hrm/Employees";
import Products from "./pages/inventory/Products";
import LoginPage from "./pages/LoginPage";
import Customers from "./pages/peoples/Customers";
import POSPage from "./pages/pos/POSPage";
import Orders from "./pages/sales/Orders";
import Companies from "./pages/super-admin/Companies";
import Users from "./pages/user-management/Users";
import RolesPermissions from "./pages/user-management/RolesPermissions";
import DeleteAccountRequest from "./pages/user-management/DeleteAccountRequest";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public login route */}
            <Route
              path="/login"
              element={<LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />}
            />

            {/* Protected Routes */}
            {isLoggedIn ? (
              <Route path="/" element={<MainLayout />}>
                {/* Dashboard */}
                <Route index element={<Dashboard />} />
                <Route path="dashboard/admin-1" element={<Dashboard />} />
                <Route path="dashboard/admin-2" element={<Dashboard />} />
                <Route path="dashboard/sales" element={<Dashboard />} />

                {/* Super Admin */}
                <Route path="super-admin/dashboard" element={<GenericPage title="Super Admin Dashboard" description="Overview for super admins" />} />
                <Route path="super-admin/companies" element={<Companies />} />
                <Route path="super-admin/subscriptions" element={<GenericPage title="Subscriptions" description="Manage subscription plans" />} />
                <Route path="super-admin/packages" element={<GenericPage title="Packages" description="Manage pricing packages" />} />
                <Route path="super-admin/domain" element={<GenericPage title="Domain Settings" description="Configure domain settings" />} />
                <Route path="super-admin/purchase-transaction" element={<GenericPage title="Purchase Transaction" description="View purchase transactions" />} />

                {/* Inventory */}
                <Route path="inventory/products" element={<Products />} />
                <Route path="inventory/products/create" element={<Products />} />
                <Route path="inventory/expired-products" element={<GenericPage title="Expired Products" description="Manage expired products" />} />
                <Route path="inventory/low-stocks" element={<Products />} />
                <Route path="inventory/categories" element={<GenericPage title="Categories" description="Product categories" />} />
                <Route path="inventory/sub-categories" element={<GenericPage title="Sub Categories" description="Manage sub-categories" />} />
                <Route path="inventory/brands" element={<GenericPage title="Brands" description="Manage brands" />} />
                <Route path="inventory/units" element={<GenericPage title="Units" description="Measurement units" />} />
                <Route path="inventory/variant-attributes" element={<GenericPage title="Variant Attributes" description="Manage product variants" />} />
                <Route path="inventory/warranties" element={<GenericPage title="Warranties" description="Manage product warranties" />} />
                <Route path="inventory/barcode" element={<GenericPage title="Print Barcode" description="Generate barcodes" />} />
                <Route path="inventory/qr-code" element={<GenericPage title="Print QR Code" description="Generate QR codes" />} />

                {/* Stock */}
                <Route path="stock/manage" element={<GenericPage title="Manage Stock" description="Stock levels management" />} />
                <Route path="stock/adjustment" element={<GenericPage title="Stock Adjustment" description="Adjust inventory" />} />
                <Route path="stock/transfer" element={<GenericPage title="Stock Transfer" description="Transfer between locations" />} />

                {/* Sales */}
                <Route path="sales/online-orders" element={<Orders />} />
                <Route path="sales/pos-orders" element={<Orders />} />
                <Route path="sales/invoices" element={<GenericPage title="Invoices" description="Manage invoices" />} />
                <Route path="sales/return" element={<GenericPage title="Sales Return" description="Process returns" />} />
                <Route path="sales/quotations" element={<GenericPage title="Quotations" description="Price quotes" />} />
                <Route path="pos/pos-1" element={<POSPage />} />
                <Route path="pos/pos-2" element={<POSPage />} />

                {/* Promo */}
                <Route path="promo/coupons" element={<GenericPage title="Coupons" description="Discount coupons" />} />
                <Route path="promo/gift-cards" element={<GenericPage title="Gift Cards" description="Gift card management" />} />
                <Route path="promo/discount/plan" element={<GenericPage title="Discount Plan" description="Discount strategies" />} />
                <Route path="promo/discount/single" element={<GenericPage title="Discount" description="Single discount management" />} />

                {/* Purchases */}
                <Route path="purchases/list" element={<GenericPage title="Purchases" description="Purchase orders" />} />
                <Route path="purchases/order" element={<GenericPage title="Purchase Order" description="Create purchase orders" />} />
                <Route path="purchases/return" element={<GenericPage title="Purchase Return" description="Return to suppliers" />} />

                {/* Finance & Accounts */}
                <Route path="finance/expenses/list" element={<GenericPage title="Expenses" description="Track expenses" />} />
                <Route path="finance/expenses/categories" element={<GenericPage title="Expense Category" description="Manage expense categories" />} />
                <Route path="finance/income/list" element={<GenericPage title="Income" description="Track income" />} />
                <Route path="finance/income/categories" element={<GenericPage title="Income Category" description="Manage income categories" />} />
                <Route path="finance/bank-accounts" element={<GenericPage title="Bank Accounts" description="Banking information" />} />
                <Route path="finance/money-transfer" element={<GenericPage title="Money Transfer" description="Transfer funds" />} />
                <Route path="finance/balance-sheet" element={<GenericPage title="Balance Sheet" description="Financial statement" />} />
                <Route path="finance/trial-balance" element={<GenericPage title="Trial Balance" description="Account balances" />} />
                <Route path="finance/cash-flow" element={<GenericPage title="Cash Flow" description="Cash flow analysis" />} />
                <Route path="finance/account-statement" element={<GenericPage title="Account Statement" description="Account transactions" />} />

                {/* Peoples */}
                <Route path="peoples/customers" element={<Customers />} />
                <Route path="peoples/billers" element={<GenericPage title="Billers" description="Manage billers" />} />
                <Route path="peoples/suppliers" element={<GenericPage title="Suppliers" description="Supplier management" />} />
                <Route path="peoples/stores" element={<GenericPage title="Stores" description="Store locations" />} />
                <Route path="peoples/warehouses" element={<GenericPage title="Warehouses" description="Warehouse management" />} />

                {/* HRM */}
                <Route path="hrm/employees" element={<Employees />} />
                <Route path="hrm/departments" element={<GenericPage title="Departments" description="Department structure" />} />
                <Route path="hrm/designations" element={<GenericPage title="Designation" description="Employee roles" />} />
                <Route path="hrm/shifts" element={<GenericPage title="Shifts" description="Work schedules" />} />
                <Route path="hrm/attendance/employee" element={<GenericPage title="Employee Attendance" description="Track employee attendance" />} />
                <Route path="hrm/attendance/admin" element={<GenericPage title="Admin Attendance" description="Manage attendance" />} />
                <Route path="hrm/leaves/admin" element={<GenericPage title="Admin Leaves" description="Manage admin leaves" />} />
                <Route path="hrm/leaves/employee" element={<GenericPage title="Employee Leaves" description="Employee leave requests" />} />
                <Route path="hrm/leaves/types" element={<GenericPage title="Leave Types" description="Define leave categories" />} />
                <Route path="hrm/holidays" element={<GenericPage title="Holidays" description="Holiday calendar" />} />
                <Route path="hrm/payroll/salary" element={<GenericPage title="Employee Salary" description="Manage salaries" />} />
                <Route path="hrm/payroll/payslip" element={<GenericPage title="Payslip" description="Generate payslips" />} />

                {/* Reports */}
                <Route path="reports/sales/report" element={<GenericPage title="Sales Report" description="Sales analytics" />} />
                <Route path="reports/sales/best-seller" element={<GenericPage title="Best Seller" description="Top-selling products" />} />
                <Route path="reports/purchase" element={<GenericPage title="Purchase Report" description="Purchase analytics" />} />
                <Route path="reports/inventory/report" element={<GenericPage title="Inventory Report" description="Stock overview" />} />
                <Route path="reports/inventory/stock-history" element={<GenericPage title="Stock History" description="Stock movement" />} />
                <Route path="reports/inventory/sold-stock" element={<GenericPage title="Sold Stock" description="Sold inventory" />} />
                <Route path="reports/invoice" element={<GenericPage title="Invoice Report" description="Invoice analytics" />} />
                <Route path="reports/supplier/report" element={<GenericPage title="Supplier Report" description="Supplier performance" />} />
                <Route path="reports/supplier/due" element={<GenericPage title="Supplier Due Report" description="Supplier dues" />} />
                <Route path="reports/customer/report" element={<GenericPage title="Customer Report" description="Customer analytics" />} />
                <Route path="reports/customer/due" element={<GenericPage title="Customer Due Report" description="Customer dues" />} />
                <Route path="reports/product/report" element={<GenericPage title="Product Report" description="Product performance" />} />
                <Route path="reports/product/expiry" element={<GenericPage title="Product Expiry Report" description="Expired products" />} />
                <Route path="reports/product/quantity-alert" element={<GenericPage title="Product Quantity Alert" description="Low stock alerts" />} />
                <Route path="reports/expense" element={<GenericPage title="Expense Report" description="Expense analytics" />} />
                <Route path="reports/income" element={<GenericPage title="Income Report" description="Income analytics" />} />
                <Route path="reports/tax" element={<GenericPage title="Tax Report" description="Tax calculations" />} />
                <Route path="reports/profit-loss" element={<GenericPage title="Profit & Loss" description="Financial performance" />} />
                <Route path="reports/annual" element={<GenericPage title="Annual Report" description="Yearly summary" />} />

                {/* User Management */}
                <Route path="user-management/users" element={<Users />} />
                <Route path="user-management/roles-permissions" element={<RolesPermissions/>} />
                <Route path="user-management/delete-account-request" element={<GenericPage title="Delete Account Request" description="Manage account deletion" />} />

                {/* Settings */} 
                <Route path="settings/general" element={<GenericPage title="General Settings" description="System configuration" />} />
                <Route path="settings/general/profile" element={<GenericPage title="Profile" description="User profile settings" />} />
                <Route path="settings/general/security" element={<GenericPage title="Security" description="Security settings" />} />
                <Route path="settings/general/notifications" element={<GenericPage title="Notifications" description="Notification preferences" />} />
                <Route path="settings/general/connected-apps" element={<GenericPage title="Connected Apps" description="Manage connected applications" />} />
                <Route path="settings/website" element={<GenericPage title="Website Settings" description="Website configuration" />} />
                <Route path="settings/website/system" element={<GenericPage title="System Settings" description="Website system settings" />} />
                <Route path="settings/website/company" element={<GenericPage title="Company Settings" description="Company configuration" />} />
                <Route path="settings/website/localization" element={<GenericPage title="Localization" description="Regional settings" />} />
                <Route path="settings/website/prefixes" element={<GenericPage title="Prefixes" description="Prefix configuration" />} />
                <Route path="settings/website/preference" element={<GenericPage title="Preference" description="User preferences" />} />
                <Route path="settings/website/appearance" element={<GenericPage title="Appearance" description="Visual settings" />} />
                <Route path="settings/website/social-auth" element={<GenericPage title="Social Authentication" description="Social login settings" />} />
                <Route path="settings/website/language" element={<GenericPage title="Language" description="Language settings" />} />
                <Route path="settings/app" element={<GenericPage title="App Settings" description="App configuration" />} />
                <Route path="settings/app/invoice-settings" element={<GenericPage title="Invoice Settings" description="Invoice configuration" />} />
                <Route path="settings/app/invoice-templates" element={<GenericPage title="Invoice Templates" description="Invoice template management" />} />
                <Route path="settings/app/printer" element={<GenericPage title="Printer" description="Printer settings" />} />
                <Route path="settings/app/pos" element={<GenericPage title="POS" description="Point of Sale settings" />} />
                <Route path="settings/app/signatures" element={<GenericPage title="Signatures" description="Signature settings" />} />
                <Route path="settings/app/custom-fields" element={<GenericPage title="Custom Fields" description="Custom field configuration" />} />
                <Route path="settings/system" element={<GenericPage title="System Settings" description="System preferences" />} />
                <Route path="settings/system/email/settings" element={<GenericPage title="Email Settings" description="Email configuration" />} />
                <Route path="settings/system/email/templates" element={<GenericPage title="Email Templates" description="Email template management" />} />
                <Route path="settings/system/sms/settings" element={<GenericPage title="SMS Settings" description="SMS configuration" />} />
                <Route path="settings/system/sms/templates" element={<GenericPage title="SMS Templates" description="SMS template management" />} />
                <Route path="settings/system/otp" element={<GenericPage title="OTP" description="One-Time Password settings" />} />
                <Route path="settings/system/gdpr-cookies" element={<GenericPage title="GDPR Cookies" description="GDPR cookie settings" />} />
                <Route path="settings/financial" element={<GenericPage title="Financial Settings" description="Financial configurations" />} />
                <Route path="settings/financial/payment-gateway" element={<GenericPage title="Payment Gateway" description="Payment gateway settings" />} />
                <Route path="settings/financial/bank-accounts" element={<GenericPage title="Bank Accounts" description="Bank account management" />} />
                <Route path="settings/financial/tax-rates" element={<GenericPage title="Tax Rates" description="Tax rate configuration" />} />
                <Route path="settings/financial/currencies" element={<GenericPage title="Currencies" description="Currency settings" />} />
                <Route path="settings/other" element={<GenericPage title="Other Settings" description="Miscellaneous settings" />} />
                <Route path="settings/other/storage" element={<GenericPage title="Storage" description="Storage settings" />} />
                <Route path="settings/other/ban-ip" element={<GenericPage title="Ban IP Address" description="IP address blocking" />} />

                {/* Logout */}
                <Route path="logout" element={<Navigate to="/login" replace  />} />
              </Route>
            ) : (
             // Redirect any other route to login if not logged in
              <Route path="*" element={<Navigate to="/login" replace />} />

            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;