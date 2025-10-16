import React, { useEffect, useState } from "react";
import { apiService } from "@/services/ApiService";

const roles = ["Admin", "User", "Manager"];
const statuses = ["Active", "Inactive"];

const Preference: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Preference");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []); 

  // General Settings state
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [currency, setCurrency] = useState("");
  const [timezone, setTimezone] = useState("");
  const [dateFormat, setDateFormat] = useState("");
  const [timeFormat, setTimeFormat] = useState("");
  const [language, setLanguage] = useState("");

  // Invoice Settings state
  const [invoicePrefix, setInvoicePrefix] = useState("");
  const [invoiceStartNumber, setInvoiceStartNumber] = useState<number | undefined>(undefined);
  const [invoiceFooterNote, setInvoiceFooterNote] = useState("");
  const [invoiceTerms, setInvoiceTerms] = useState("");

  // User Preferences state
  const [theme, setTheme] = useState("");
  const [notifications, setNotifications] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Users table state with pagination
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // When data changes, update states accordingly
  useEffect(() => {
    if (!loading && !error && data) {
      // Assuming data has the same structure as preferenceData.sections
      const sections = (data as any).sections || {};

      const generalSettings = sections.generalSettings || {};
      setCompanyName(generalSettings.companyName || "");
      setCompanyEmail(generalSettings.companyEmail || "");
      setCompanyPhone(generalSettings.companyPhone || "");
      setCompanyAddress(generalSettings.companyAddress || "");
      setCurrency(generalSettings.currency || "");
      setTimezone(generalSettings.timezone || "");
      setDateFormat(generalSettings.dateFormat || "");
      setTimeFormat(generalSettings.timeFormat || "");
      setLanguage(generalSettings.language || "");

      const invoiceSettings = sections.invoiceSettings || {};
      setInvoicePrefix(invoiceSettings.invoicePrefix || "");
      setInvoiceStartNumber(invoiceSettings.invoiceStartNumber || undefined);
      setInvoiceFooterNote(invoiceSettings.invoiceFooterNote || "");
      setInvoiceTerms(invoiceSettings.invoiceTerms || "");

      const userPreferences = sections.userPreferences || {};
      setTheme(userPreferences.theme || "");
      setNotifications(userPreferences.notifications || false);
      setAutoSave(userPreferences.autoSave || false);
      setItemsPerPage(userPreferences.itemsPerPage || 10);

      setUsers(sections.users || []);
      setCurrentPage(1);
    }
  }, [data, loading, error]);

  // Pagination calculations
  const totalUsers = users.length;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  const paginatedUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Handlers for pagination buttons
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Handlers for buttons (Save, Refresh, Report)
  const handleSave = () => {
    alert("Settings saved successfully.");
  };

  const handleRefresh = () => {
    if (data) {
      const sections = (data as any).sections || {};

      const generalSettings = sections.generalSettings || {};
      setCompanyName(generalSettings.companyName || "");
      setCompanyEmail(generalSettings.companyEmail || "");
      setCompanyPhone(generalSettings.companyPhone || "");
      setCompanyAddress(generalSettings.companyAddress || "");
      setCurrency(generalSettings.currency || "");
      setTimezone(generalSettings.timezone || "");
      setDateFormat(generalSettings.dateFormat || "");
      setTimeFormat(generalSettings.timeFormat || "");
      setLanguage(generalSettings.language || "");

      const invoiceSettings = sections.invoiceSettings || {};
      setInvoicePrefix(invoiceSettings.invoicePrefix || "");
      setInvoiceStartNumber(invoiceSettings.invoiceStartNumber || undefined);
      setInvoiceFooterNote(invoiceSettings.invoiceFooterNote || "");
      setInvoiceTerms(invoiceSettings.invoiceTerms || "");

      const userPreferences = sections.userPreferences || {};
      setTheme(userPreferences.theme || "");
      setNotifications(userPreferences.notifications || false);
      setAutoSave(userPreferences.autoSave || false);
      setItemsPerPage(userPreferences.itemsPerPage || 10);

      setUsers(sections.users || []);
      setCurrentPage(1);
    }
  };

  const handleReport = () => {
    alert("Report generated.");
  };

  // Handlers for editing user status and role inline
  const handleUserRoleChange = (id: number, role: string) => {
    setUsers((prev) =>
      prev.map((user: any) => (user.id === id ? { ...user, role } : user))
    );
  };

  const handleUserStatusChange = (id: number, status: string) => {
    setUsers((prev) =>
      prev.map((user: any) => (user.id === id ? { ...user, status } : user))
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Title */}
      <h1 className="text-lg font-semibold mb-6">Preference</h1>

      {/* General Settings Section */}
      <section className="mb-10 bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">General Settings</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium mb-1">Company Name</label>
            <input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="companyEmail" className="block text-sm font-medium mb-1">Company Email</label>
            <input
              id="companyEmail"
              type="email"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="companyPhone" className="block text-sm font-medium mb-1">Company Phone</label>
            <input
              id="companyPhone"
              type="tel"
              value={companyPhone}
              onChange={(e) => setCompanyPhone(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="companyAddress" className="block text-sm font-medium mb-1">Company Address</label>
            <input
              id="companyAddress"
              type="text"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium mb-1">Currency</label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
              <option>INR</option>
              <option>JPY</option>
            </select>
          </div>
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium mb-1">Timezone</label>
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>GMT-12</option>
              <option>GMT-11</option>
              <option>GMT-10</option>
              <option>GMT-9</option>
              <option>GMT-8</option>
              <option>GMT-7</option>
              <option>GMT-6</option>
              <option>GMT-5</option>
              <option>GMT-4</option>
              <option>GMT-3</option>
              <option>GMT-2</option>
              <option>GMT-1</option>
              <option>GMT+0</option>
              <option>GMT+1</option>
              <option>GMT+2</option>
              <option>GMT+3</option>
              <option>GMT+4</option>
              <option>GMT+5</option>
              <option>GMT+6</option>
              <option>GMT+7</option>
              <option>GMT+8</option>
              <option>GMT+9</option>
              <option>GMT+10</option>
              <option>GMT+11</option>
              <option>GMT+12</option>
            </select>
          </div>
          <div>
            <label htmlFor="dateFormat" className="block text-sm font-medium mb-1">Date Format</label>
            <select
              id="dateFormat"
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY/MM/DD</option>
            </select>
          </div>
          <div>
            <label htmlFor="timeFormat" className="block text-sm font-medium mb-1">Time Format</label>
            <select
              id="timeFormat"
              value={timeFormat}
              onChange={(e) => setTimeFormat(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>12 Hour</option>
              <option>24 Hour</option>
            </select>
          </div>
          <div>
            <label htmlFor="language" className="block text-sm font-medium mb-1">Language</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Chinese</option>
            </select>
          </div>
        </form>
      </section>

      {/* Invoice Settings Section */}
      <section className="mb-10 bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">Invoice Settings</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="invoicePrefix" className="block text-sm font-medium mb-1">Invoice Prefix</label>
            <input
              id="invoicePrefix"
              type="text"
              value={invoicePrefix}
              onChange={(e) => setInvoicePrefix(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="invoiceStartNumber" className="block text-sm font-medium mb-1">Invoice Start Number</label>
            <input
              id="invoiceStartNumber"
              type="number"
              min={1}
              value={invoiceStartNumber || ""}
              onChange={(e) => setInvoiceStartNumber(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="invoiceFooterNote" className="block text-sm font-medium mb-1">Invoice Footer Note</label>
            <textarea
              id="invoiceFooterNote"
              rows={3}
              value={invoiceFooterNote}
              onChange={(e) => setInvoiceFooterNote(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="invoiceTerms" className="block text-sm font-medium mb-1">Invoice Terms</label>
            <textarea
              id="invoiceTerms"
              rows={3}
              value={invoiceTerms}
              onChange={(e) => setInvoiceTerms(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>
      </section>

      {/* User Preferences Section */}
      <section className="mb-10 bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">User Preferences</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <label htmlFor="theme" className="block text-sm font-medium mb-1">Theme</label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Light</option>
              <option>Dark</option>
              <option>System</option>
            </select>
          </div>
          <div className="flex items-center space-x-3">
            <input
              id="notifications"
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="notifications" className="text-sm font-medium">Enable Notifications</label>
          </div>
          <div className="flex items-center space-x-3">
            <input
              id="autoSave"
              type="checkbox"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="autoSave" className="text-sm font-medium">Enable Auto Save</label>
          </div>
          <div>
            <label htmlFor="itemsPerPage" className="block text-sm font-medium mb-1">Items Per Page</label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
        </form>
      </section>

      {/* Users Table Section */}
      <section className="bg-white rounded shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold border-b border-gray-200 pb-2">Users</h2>
          <div className="space-x-2">
            <button
              onClick={handleReport}
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              title="Generate Report"
            >
              <i className="fas fa-file-alt mr-2" aria-hidden="true"></i> Report
            </button>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
              title="Refresh Data"
            >
              <i className="fas fa-sync-alt mr-2" aria-hidden="true"></i> Refresh
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Save Settings"
            >
              <i className="fas fa-save mr-2" aria-hidden="true"></i> Save
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b border-gray-300">Name</th>
                <th className="px-4 py-2 border-b border-gray-300">Email</th>
                <th className="px-4 py-2 border-b border-gray-300">Role</th>
                <th className="px-4 py-2 border-b border-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map(({ id, name, email, role, status }: any) => (
                <tr key={id} className="even:bg-gray-50">
                  <td className="px-4 py-2 border-b border-gray-200">{name}</td>
                  <td className="px-4 py-2 border-b border-gray-200">{email}</td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    <select
                      value={role}
                      onChange={(e) => handleUserRoleChange(id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    <select
                      value={status}
                      onChange={(e) => handleUserStatusChange(id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No users to display.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <nav
          className="flex justify-center items-center space-x-2 mt-4"
          aria-label="Pagination"
        >
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border border-gray-300 ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Previous Page"
          >
            <i className="fas fa-chevron-left" aria-hidden="true"></i>
          </button>
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => goToPage(page)}
                aria-current={page === currentPage ? "page" : undefined}
                className={`px-3 py-1 rounded border border-gray-300 ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border border-gray-300 ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Next Page"
          >
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
          </button>
        </nav>
      </section>
    </div>
  );
};

export default Preference;