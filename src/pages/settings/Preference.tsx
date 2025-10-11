import React, { useState, useEffect } from "react";

const preferenceData = {
  title: "Preference",
  sections: {
    generalSettings: {
      companyName: "Dreams POS",
      companyEmail: "info@dreamspos.com",
      companyPhone: "+91 9876543210",
      companyAddress: "123 Dreams Street, Dream City, DC 12345",
      currency: "USD",
      timezone: "GMT-5",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12 Hour",
      language: "English",
    },
    invoiceSettings: {
      invoicePrefix: "INV",
      invoiceStartNumber: 1001,
      invoiceFooterNote: "Thank you for your business!",
      invoiceTerms: "Payment due within 30 days",
    },
    userPreferences: {
      theme: "Light",
      notifications: true,
      autoSave: false,
      itemsPerPage: 10,
    },
    users: [
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        role: "Admin",
        status: "Active",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "User",
        status: "Inactive",
      },
      {
        id: 3,
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        role: "User",
        status: "Active",
      },
      {
        id: 4,
        name: "Bob Brown",
        email: "bob.brown@example.com",
        role: "User",
        status: "Active",
      },
      {
        id: 5,
        name: "Charlie Davis",
        email: "charlie.davis@example.com",
        role: "User",
        status: "Inactive",
      },
      {
        id: 6,
        name: "Diana Evans",
        email: "diana.evans@example.com",
        role: "User",
        status: "Active",
      },
      {
        id: 7,
        name: "Ethan Foster",
        email: "ethan.foster@example.com",
        role: "User",
        status: "Active",
      },
      {
        id: 8,
        name: "Fiona Green",
        email: "fiona.green@example.com",
        role: "User",
        status: "Inactive",
      },
      {
        id: 9,
        name: "George Harris",
        email: "george.harris@example.com",
        role: "User",
        status: "Active",
      },
      {
        id: 10,
        name: "Hannah Irving",
        email: "hannah.irving@example.com",
        role: "User",
        status: "Active",
      },
      {
        id: 11,
        name: "Ian Jackson",
        email: "ian.jackson@example.com",
        role: "User",
        status: "Inactive",
      },
      {
        id: 12,
        name: "Julia King",
        email: "julia.king@example.com",
        role: "User",
        status: "Active",
      },
    ],
  },
};

const roles = ["Admin", "User", "Manager"];
const statuses = ["Active", "Inactive"];

const Preference: React.FC = () => {
  // Page title
  useEffect(() => {
    document.title = preferenceData.title;
  }, []);

  // General Settings state
  const [companyName, setCompanyName] = useState(preferenceData.sections.generalSettings.companyName);
  const [companyEmail, setCompanyEmail] = useState(preferenceData.sections.generalSettings.companyEmail);
  const [companyPhone, setCompanyPhone] = useState(preferenceData.sections.generalSettings.companyPhone);
  const [companyAddress, setCompanyAddress] = useState(preferenceData.sections.generalSettings.companyAddress);
  const [currency, setCurrency] = useState(preferenceData.sections.generalSettings.currency);
  const [timezone, setTimezone] = useState(preferenceData.sections.generalSettings.timezone);
  const [dateFormat, setDateFormat] = useState(preferenceData.sections.generalSettings.dateFormat);
  const [timeFormat, setTimeFormat] = useState(preferenceData.sections.generalSettings.timeFormat);
  const [language, setLanguage] = useState(preferenceData.sections.generalSettings.language);

  // Invoice Settings state
  const [invoicePrefix, setInvoicePrefix] = useState(preferenceData.sections.invoiceSettings.invoicePrefix);
  const [invoiceStartNumber, setInvoiceStartNumber] = useState(preferenceData.sections.invoiceSettings.invoiceStartNumber);
  const [invoiceFooterNote, setInvoiceFooterNote] = useState(preferenceData.sections.invoiceSettings.invoiceFooterNote);
  const [invoiceTerms, setInvoiceTerms] = useState(preferenceData.sections.invoiceSettings.invoiceTerms);

  // User Preferences state
  const [theme, setTheme] = useState(preferenceData.sections.userPreferences.theme);
  const [notifications, setNotifications] = useState(preferenceData.sections.userPreferences.notifications);
  const [autoSave, setAutoSave] = useState(preferenceData.sections.userPreferences.autoSave);
  const [itemsPerPage, setItemsPerPage] = useState(preferenceData.sections.userPreferences.itemsPerPage);

  // Users table state with pagination
  const [users, setUsers] = useState(preferenceData.sections.users);
  const [currentPage, setCurrentPage] = useState(1);

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
    // Reset all fields to initial data
    setCompanyName(preferenceData.sections.generalSettings.companyName);
    setCompanyEmail(preferenceData.sections.generalSettings.companyEmail);
    setCompanyPhone(preferenceData.sections.generalSettings.companyPhone);
    setCompanyAddress(preferenceData.sections.generalSettings.companyAddress);
    setCurrency(preferenceData.sections.generalSettings.currency);
    setTimezone(preferenceData.sections.generalSettings.timezone);
    setDateFormat(preferenceData.sections.generalSettings.dateFormat);
    setTimeFormat(preferenceData.sections.generalSettings.timeFormat);
    setLanguage(preferenceData.sections.generalSettings.language);

    setInvoicePrefix(preferenceData.sections.invoiceSettings.invoicePrefix);
    setInvoiceStartNumber(preferenceData.sections.invoiceSettings.invoiceStartNumber);
    setInvoiceFooterNote(preferenceData.sections.invoiceSettings.invoiceFooterNote);
    setInvoiceTerms(preferenceData.sections.invoiceSettings.invoiceTerms);

    setTheme(preferenceData.sections.userPreferences.theme);
    setNotifications(preferenceData.sections.userPreferences.notifications);
    setAutoSave(preferenceData.sections.userPreferences.autoSave);
    setItemsPerPage(preferenceData.sections.userPreferences.itemsPerPage);

    setUsers(preferenceData.sections.users);
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generated.");
  };

  // Handlers for editing user status and role inline
  const handleUserRoleChange = (id: number, role: string) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, role } : user))
    );
  };

  const handleUserStatusChange = (id: number, status: string) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, status } : user))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-6 max-w-7xl mx-auto">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold mb-6 border-b border-gray-300 pb-2">{preferenceData.title}</h1>

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
              value={invoiceStartNumber}
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
              {paginatedUsers.map(({ id, name, email, role, status }) => (
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