import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import LoginPage from "./pages/auth/LoginPage";
import Admin1Dashboard from "./pages/dashboard/Admin1Dashboard";
import SalesDashboard from "./pages/dashboard/SalesDashboard";
import AccountStatement from "./pages/finance/AccountStatement";
import BalanceSheet from "./pages/finance/BalanceSheet";
import BankAccounts from "./pages/finance/BankAccounts";
import CashFlow from "./pages/finance/CashFlow";
import ExpenseCategory from "./pages/finance/ExpenseCategory";
import Expenses from "./pages/finance/Expenses";
import Income from "./pages/finance/Income";
import IncomeCategory from "./pages/finance/IncomeCategory";
import MoneyTransfer from "./pages/finance/MoneyTransfer";
import TrialBalance from "./pages/finance/TrialBalance";
import AdminAttendance from "./pages/hrm/AdminAttendance";
import AdminLeaves from "./pages/hrm/AdminLeaves";
import Departments from "./pages/hrm/Departments";
import Designation from "./pages/hrm/Designation";
import EmployeeAttendance from "./pages/hrm/EmployeeAttendance";
import EmployeeLeaves from "./pages/hrm/EmployeeLeaves";
import Employees from "./pages/hrm/Employees";
import EmployeeSalary from "./pages/hrm/EmployeeSalary";
import Holidays from "./pages/hrm/Holidays";
import LeaveTypes from "./pages/hrm/LeaveTypes";
import Payslip from "./pages/hrm/Payslip";
import Shifts from "./pages/hrm/Shifts";
import Brands from "./pages/inventory/Brands";
import Category from "./pages/inventory/Category";
import CreateProduct from "./pages/inventory/CreateProduct";
import ExpiredProducts from "./pages/inventory/ExpiredProducts";
import LowStocks from "./pages/inventory/LowStocks";
import PrintBarcode from "./pages/inventory/PrintBarcode";
import PrintQrCode from "./pages/inventory/PrintQrCode";
import Products from "./pages/inventory/Products";
import SubCategory from "./pages/inventory/SubCategory";
import Units from "./pages/inventory/Units";
import VariantAttributes from "./pages/inventory/VariantAttributes";
import Warranties from "./pages/inventory/Warranties";
import Billers from "./pages/peoples/Billers";
import Customers from "./pages/peoples/Customers";
import Stores from "./pages/peoples/Stores";
import Suppliers from "./pages/peoples/Suppliers";
import Warehouses from "./pages/peoples/WareHouses";
import Coupons from "./pages/promo/Coupons";
import Discount from "./pages/promo/Discount";
import DiscountPlan from "./pages/promo/DiscountPlan";
import GiftCards from "./pages/promo/GiftCards";
import PurchaseOrder from "./pages/purchases/PurchaseOrder";
import PurchaseReturn from "./pages/purchases/PurchaseReturn";
import Purchases from "./pages/purchases/Purchases";
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
import TaxReport from "./pages/reports/TaxReport";
import Invoices from "./pages/sales/Invoices";
import OnlineOrders from "./pages/sales/OnlineOrders";
import Pos1 from "./pages/sales/Pos1";
import PosOrders from "./pages/sales/PosOrders";
import Quotation from "./pages/sales/Quotation";
import SalesReturn from "./pages/sales/SalesReturn";
import Appearance from "./pages/settings/Appearance";
import BanIpAddress from "./pages/settings/BanIpAddress";
import BankSettingsGrid from "./pages/settings/BankSettingsGrid";
import CompanySettings from "./pages/settings/CompanySettings";
import ConnectedApps from "./pages/settings/ConnectedApps";
import CurrencySettings from "./pages/settings/CurrencySettings";
import CustomFields from "./pages/settings/CustomFields";
import EmailSettings from "./pages/settings/EmailSettings";
import EmailTemplates from "./pages/settings/EmailTemplates";
import GdprSettings from "./pages/settings/GdprSettings";
import GeneralSettings from "./pages/settings/GeneralSettings";
import InvoiceSettings from "./pages/settings/InvoiceSettings";
import InvoiceTemplates from "./pages/settings/InvoiceTemplates";
import LanguageSettings from "./pages/settings/LanguageSettings";
import LocalizationSettings from "./pages/settings/LocalizationSettings";
import Notification from "./pages/settings/Notification";
import OtpSettings from "./pages/settings/OtpSettings";
import PaymentGatewaySettings from "./pages/settings/PaymentGatewaySettings";
import PosSettings from "./pages/settings/PosSettings";
import Preference from "./pages/settings/Preference";
import Prefixes from "./pages/settings/Prefixes";
import PrinterSettings from "./pages/settings/PrinterSettings";
import SecuritySettings from "./pages/settings/SecuritySettings";
import Signatures from "./pages/settings/Signatures";
import SmsSettings from "./pages/settings/SmsSettings";
import SmsTemplates from "./pages/settings/SmsTemplates";
import SocialAuthentication from "./pages/settings/SocialAuthentication";
import StorageSettings from "./pages/settings/StorageSettings";
import SystemSettings from "./pages/settings/SystemSettings";
import TaxRates from "./pages/settings/TaxRates";
import ManageStock from "./pages/stock/ManageStock";
import StockAdjustment from "./pages/stock/StockAdjustment";
import StockTransfer from "./pages/stock/StockTransfer";
import Companies from "./pages/super-admin/Companies";
import Domain from "./pages/super-admin/Domain";
import Packages from "./pages/super-admin/Packages";
import PurchaseTransaction from "./pages/super-admin/PurchaseTransaction";
import Subscriptions from "./pages/super-admin/Subscriptions";
import SuperadminDashboard from "./pages/super-admin/SuperadminDashboard";
import DeleteAccountRequest from "./pages/user-management/DeleteAccountRequest";
import RolesPermissions from "./pages/user-management/RolesPermissions";
import Users from "./pages/user-management/Users";

const queryClient = new QueryClient();

function RouteChangeHandler() {
  const location = useLocation();

  useEffect(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    let page = parts.length > 0 ? parts[parts.length - 1] : "Dashboard";
    page = page.charAt(0).toUpperCase() + page.slice(1);
    document.title = `${page} - NyaBuy POS`;
  }, [location]);

  return null; // No UI output, just side-effects
}

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteChangeHandler />
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
                <Route
                  path="super-admin/dashboard"
                  element={<SuperadminDashboard />}
                />
                <Route path="super-admin/companies" element={<Companies />} />
                <Route
                  path="super-admin/subscriptions"
                  element={<Subscriptions />}
                />
                <Route path="super-admin/packages" element={<Packages />} />
                <Route path="super-admin/domain" element={<Domain />} />
                <Route
                  path="super-admin/purchase-transaction"
                  element={<PurchaseTransaction />}
                />

                {/* Inventory */}
                <Route path="inventory/products" element={<Products />} />
                <Route
                  path="inventory/products/create"
                  element={<CreateProduct />}
                />
                <Route
                  path="inventory/expired-products"
                  element={<ExpiredProducts />}
                />
                <Route path="inventory/low-stocks" element={<LowStocks />} />
                <Route path="inventory/categories" element={<Category />} />
                <Route
                  path="inventory/sub-categories"
                  element={<SubCategory />}
                />
                <Route path="inventory/brands" element={<Brands />} />
                <Route path="inventory/units" element={<Units />} />
                <Route
                  path="inventory/variant-attributes"
                  element={<VariantAttributes />}
                />
                <Route path="inventory/warranties" element={<Warranties />} />
                <Route path="inventory/barcode" element={<PrintBarcode />} />
                <Route path="inventory/qr-code" element={<PrintQrCode />} />

                {/* Stock */}
                <Route path="stock/manage" element={<ManageStock />} />
                <Route path="stock/adjustment" element={<StockAdjustment />} />
                <Route path="stock/transfer" element={<StockTransfer />} />

                {/* Sales */}
                <Route path="sales/online-orders" element={<OnlineOrders />} />
                <Route path="sales/pos-orders" element={<PosOrders />} />
                <Route path="sales/invoices" element={<Invoices />} />
                <Route path="sales/return" element={<SalesReturn />} />
                <Route path="sales/quotations" element={<Quotation />} />
                <Route path="pos/pos-1" element={<Pos1 />} />
                <Route path="pos/pos-2" element={<Pos1 />} />

                {/* Promo */}
                <Route path="promo/coupons" element={<Coupons />} />
                <Route path="promo/gift-cards" element={<GiftCards />} />
                <Route path="promo/discount/plan" element={<DiscountPlan />} />
                <Route path="promo/discount/single" element={<Discount />} />

                {/* Purchases */}
                <Route path="purchases/list" element={<Purchases />} />
                <Route path="purchases/order" element={<PurchaseOrder />} />
                <Route path="purchases/return" element={<PurchaseReturn />} />

                {/* Finance & Accounts */}
                <Route path="finance/expenses/list" element={<Expenses />} />
                <Route
                  path="finance/expenses/categories"
                  element={<ExpenseCategory />}
                />
                <Route path="finance/income/list" element={<Income />} />
                <Route
                  path="finance/income/categories"
                  element={<IncomeCategory />}
                />
                <Route
                  path="finance/bank-accounts"
                  element={<BankAccounts />}
                />
                <Route
                  path="finance/money-transfer"
                  element={<MoneyTransfer />}
                />
                <Route
                  path="finance/balance-sheet"
                  element={<BalanceSheet />}
                />
                <Route
                  path="finance/trial-balance"
                  element={<TrialBalance />}
                />
                <Route path="finance/cash-flow" element={<CashFlow />} />
                <Route
                  path="finance/account-statement"
                  element={<AccountStatement />}
                />

                {/* Peoples */}
                <Route path="peoples/customers" element={<Customers />} />
                <Route path="peoples/billers" element={<Billers />} />
                <Route path="peoples/suppliers" element={<Suppliers />} />
                <Route path="peoples/stores" element={<Stores />} />
                <Route path="peoples/warehouses" element={<Warehouses />} />

                {/* HRM */}
                <Route path="hrm/employees" element={<Employees />} />
                <Route path="hrm/departments" element={<Departments />} />
                <Route path="hrm/designations" element={<Designation />} />
                <Route path="hrm/shifts" element={<Shifts />} />
                <Route
                  path="hrm/attendance/employee"
                  element={<EmployeeAttendance />}
                />
                <Route
                  path="hrm/attendance/admin"
                  element={<AdminAttendance />}
                />
                <Route path="hrm/leaves/admin" element={<AdminLeaves />} />
                <Route
                  path="hrm/leaves/employee"
                  element={<EmployeeLeaves />}
                />
                <Route path="hrm/leaves/types" element={<LeaveTypes />} />
                <Route path="hrm/holidays" element={<Holidays />} />
                <Route path="hrm/payroll/salary" element={<EmployeeSalary />} />
                <Route path="hrm/payroll/payslip" element={<Payslip />} />

                {/* Reports */}
                <Route path="reports/sales/report" element={<SalesReport />} />
                <Route
                  path="reports/sales/best-seller"
                  element={<BestSeller />}
                />
                <Route path="reports/purchase" element={<PurchaseReport />} />
                <Route
                  path="reports/inventory/report"
                  element={<InventoryReport />}
                />
                <Route
                  path="reports/inventory/stock-history"
                  element={<StockHistory />}
                />
                <Route
                  path="reports/inventory/sold-stock"
                  element={<SoldStock />}
                />
                <Route path="reports/invoice" element={<InvoiceReport />} />
                <Route
                  path="reports/supplier/report"
                  element={<SupplierReport />}
                />
                <Route
                  path="reports/supplier/due"
                  element={<SupplierDueReport />}
                />
                <Route
                  path="reports/customer/report"
                  element={<CustomerReport />}
                />
                <Route
                  path="reports/customer/due"
                  element={<CustomerDueReport />}
                />
                <Route
                  path="reports/product/report"
                  element={<ProductReport />}
                />
                <Route
                  path="reports/product/expiry"
                  element={<ProductExpiryReport />}
                />
                <Route
                  path="reports/product/quantity-alert"
                  element={<ProductQuantityAlert />}
                />
                <Route path="reports/expense" element={<ExpenseReport />} />
                <Route path="reports/income" element={<IncomeReport />} />
                <Route path="reports/tax" element={<TaxReport />} />
                <Route path="reports/profit-loss" element={<ProfitLoss />} />
                <Route path="reports/annual" element={<AnnualReport />} />

                {/* User Management */}
                <Route path="user-management/users" element={<Users />} />
                <Route
                  path="user-management/roles-permissions"
                  element={<RolesPermissions />}
                />
                <Route
                  path="user-management/delete-account-request"
                  element={<DeleteAccountRequest />}
                />

                {/* Settings */}
                <Route
                  path="settings/general/profile"
                  element={<GeneralSettings />}
                />
                <Route
                  path="settings/general/security"
                  element={<SecuritySettings />}
                />
                <Route
                  path="settings/general/notifications"
                  element={<Notification />}
                />
                <Route
                  path="settings/general/connected-apps"
                  element={<ConnectedApps />}
                />
                <Route
                  path="settings/website/system"
                  element={<SystemSettings />}
                />
                <Route
                  path="settings/website/company"
                  element={<CompanySettings />}
                />
                <Route
                  path="settings/website/localization"
                  element={<LocalizationSettings />}
                />
                <Route
                  path="settings/website/prefixes"
                  element={<Prefixes />}
                />
                <Route
                  path="settings/website/preference"
                  element={<Preference />}
                />
                <Route
                  path="settings/website/appearance"
                  element={<Appearance />}
                />
                <Route
                  path="settings/website/social-auth"
                  element={<SocialAuthentication />}
                />
                <Route
                  path="settings/website/language"
                  element={<LanguageSettings />}
                />
                <Route
                  path="settings/app/invoice-settings"
                  element={<InvoiceSettings />}
                />
                <Route
                  path="settings/app/invoice-templates"
                  element={<InvoiceTemplates />}
                />
                <Route
                  path="settings/app/printer"
                  element={<PrinterSettings />}
                />
                <Route path="settings/app/pos" element={<PosSettings />} />
                <Route
                  path="settings/app/signatures"
                  element={<Signatures />}
                />
                <Route
                  path="settings/app/custom-fields"
                  element={<CustomFields />}
                />
                <Route
                  path="settings/system/email/settings"
                  element={<EmailSettings />}
                />
                <Route
                  path="settings/system/email/templates"
                  element={<EmailTemplates />}
                />
                <Route
                  path="settings/system/sms/settings"
                  element={<SmsSettings />}
                />
                <Route
                  path="settings/system/sms/templates"
                  element={<SmsTemplates />}
                />
                <Route path="settings/system/otp" element={<OtpSettings />} />
                <Route
                  path="settings/system/gdpr-cookies"
                  element={<GdprSettings />}
                />
                <Route
                  path="settings/financial/payment-gateway"
                  element={<PaymentGatewaySettings />}
                />
                <Route
                  path="settings/financial/bank-accounts"
                  element={<BankSettingsGrid />}
                />
                <Route
                  path="settings/financial/tax-rates"
                  element={<TaxRates />}
                />
                <Route
                  path="settings/financial/currencies"
                  element={<CurrencySettings />}
                />
                <Route
                  path="settings/other/storage"
                  element={<StorageSettings />}
                />
                <Route
                  path="settings/other/ban-ip"
                  element={<BanIpAddress />}
                />

                {/* Logout */}
                <Route
                  path="logout"
                  element={<Navigate to="/login" replace />}
                />
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
