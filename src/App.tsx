import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Admin1Dashboard from "./pages/dashboard/Admin1Dashboard";
import SalesDashboard from "./pages/dashboard/SalesDashboard";
import SuperadminDashboard from "./pages/super-admin/SuperadminDashboard";
import Companies from "./pages/super-admin/Companies";
import Domain from "./pages/super-admin/Domain";
import Packages from "./pages/super-admin/Packages";
import PurchaseTransaction from "./pages/super-admin/PurchaseTransaction";
import Subscriptions from "./pages/super-admin/Subscriptions";
import GenericPage from "./pages/GenericPage";
import Employees from "./pages/hrm/Employees";
import Products from "./pages/inventory/Products";
import LoginPage from "./pages/LoginPage";
import Customers from "./pages/peoples/Customers";
import POSPage from "./pages/pos/POSPage";
import OnlineOrders from "./pages/sales/OnlineOrders";
import Users from "./pages/user-management/Users";
import RolesPermissions from "./pages/user-management/RolesPermissions";
import DeleteAccountRequest from "./pages/user-management/DeleteAccountRequest";
import AnnualReport from "./pages/reports/AnnualReport";
import BestSeller from "./pages/reports/BestSeller";
import CustomerDueReport from "./pages/reports/CustomerDueReport";
import CustomerReport from "./pages/reports/CustomerReport";
import ExpenseReport from "./pages/reports/ExpenseReport";
import IncomeReport from "./pages/reports/IncomeReport";
import InventoryReport from "./pages/reports/InventoryReport";
import InvoiceReport from "./pages/reports/InvoiceReport";
import ProductExpiryReport from "./pages/reports/ProductExpiryReport";
import ProductQuantityAlert from "./pages/reports/ProductQuantityAlert";
import ProductReport from "./pages/reports/ProductReport";
import ProfitLoss from "./pages/reports/ProfitLoss";
import PurchaseReport from "./pages/reports/PurchaseReport";
import SalesReport from "./pages/reports/SalesReport";
import SoldStock from "./pages/reports/SoldStock";
import StockHistory from "./pages/reports/StockHistory";
import SupplierDueReport from "./pages/reports/SupplierDueReport";
import SupplierReport from "./pages/reports/SupplierReport";
import Billers from "./pages/peoples/Billers"; 
import Stores from "./pages/peoples/Stores";
import Suppliers from "./pages/peoples/Suppliers";
import Warehouses from "./pages/peoples/Warehouses"; 
import TaxReport from "./pages/reports/TaxReport";
import AdminAttendance from "./pages/hrm/AdminAttendance";
import AdminLeaves from "./pages/hrm/AdminLeaves";
import Departments from "./pages/hrm/Departments";
import Designation from "./pages/hrm/Designation";
import EmployeeAttendance from "./pages/hrm/EmployeeAttendance";
import EmployeeLeaves from "./pages/hrm/EmployeeLeaves"; 
import EmployeeSalary from "./pages/hrm/EmployeeSalary";
import Holidays from "./pages/hrm/Holidays";
import LeaveTypes from "./pages/hrm/LeaveTypes";
import Payslip from "./pages/hrm/Payslip";
import Shifts from "./pages/hrm/Shifts";



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
                <Route index element={<Admin1Dashboard />} />
                <Route path="dashboard/admin-1" element={<Admin1Dashboard />} />
                <Route path="dashboard/admin-2" element={<Admin1Dashboard />} />
                <Route path="dashboard/sales" element={<SalesDashboard />} />

                {/* Super Admin */}
                <Route path="super-admin/dashboard" element={<SuperadminDashboard />} />
                <Route path="super-admin/companies" element={<Companies />} />
                <Route path="super-admin/subscriptions" element={<Subscriptions />} />
                <Route path="super-admin/packages" element={<Packages />} />
                <Route path="super-admin/domain" element={<Domain />} />
                <Route path="super-admin/purchase-transaction" element={<PurchaseTransaction />} />

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
                <Route path="sales/online-orders" element={<OnlineOrders />} />
                <Route path="sales/pos-orders" element={<OnlineOrders />} />
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
                <Route path="peoples/billers" element={<Billers />} />
                <Route path="peoples/suppliers" element={<Suppliers/>} />
                <Route path="peoples/stores" element={<Stores />} />
                <Route path="peoples/warehouses" element={<Warehouses />} />

                {/* HRM */}
                <Route path="hrm/employees" element={<Employees />} />
                <Route path="hrm/departments" element={<Departments/>} />
                <Route path="hrm/designations" element={<Designation />} />
                <Route path="hrm/shifts" element={<Shifts />} />
                <Route path="hrm/attendance/employee" element={<EmployeeAttendance />} />
                <Route path="hrm/attendance/admin" element={<AdminAttendance />} />
                <Route path="hrm/leaves/admin" element={<AdminLeaves />} />
                <Route path="hrm/leaves/employee" element={<EmployeeLeaves />} />
                <Route path="hrm/leaves/types" element={<LeaveTypes/>} />
                <Route path="hrm/holidays" element={<Holidays />} />
                <Route path="hrm/payroll/salary" element={<EmployeeSalary />} />
                <Route path="hrm/payroll/payslip" element={<Payslip />} />

                {/* Reports */}
                <Route path="reports/sales/report" element={<SalesReport/>} />
                <Route path="reports/sales/best-seller" element={<BestSeller />} />
                <Route path="reports/purchase" element={<PurchaseReport/>} />
                <Route path="reports/inventory/report" element={<InventoryReport />} />
                <Route path="reports/inventory/stock-history" element={<StockHistory />} />
                <Route path="reports/inventory/sold-stock" element={<SoldStock />} />
                <Route path="reports/invoice" element={<InvoiceReport/>} />
                <Route path="reports/supplier/report" element={<SupplierReport />} />
                <Route path="reports/supplier/due" element={<SupplierDueReport/>} />
                <Route path="reports/customer/report" element={<CustomerReport/>} />
                <Route path="reports/customer/due" element={<CustomerDueReport />} />
                <Route path="reports/product/report" element={<ProductReport />} />
                <Route path="reports/product/expiry" element={<ProductExpiryReport />} />
                <Route path="reports/product/quantity-alert" element={<ProductQuantityAlert />} />
                <Route path="reports/expense" element={<ExpenseReport />} />
                <Route path="reports/income" element={<IncomeReport />} />
                <Route path="reports/tax" element={<TaxReport />} />
                <Route path="reports/profit-loss" element={<ProfitLoss />} />
                <Route path="reports/annual" element={<AnnualReport />} />

                {/* User Management */}
                <Route path="user-management/users" element={<Users />} />
                <Route path="user-management/roles-permissions" element={<RolesPermissions/>} />
                <Route path="user-management/delete-account-request" element={<DeleteAccountRequest/>} />

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