import React, { useState, useEffect } from "react";

const systemSettingsData = {
  generalSettings: {
    companyName: "Dreams POS",
    companyEmail: "info@dreamspos.com",
    phoneNumber: "+1 234 567 890",
    address: "123 Dreams Street, Dream City, DC 12345",
    currency: "USD",
    timezone: "(GMT-05:00) Eastern Time (US & Canada)",
  },
  invoiceSettings: {
    invoicePrefix: "INV-",
    invoiceStartNumber: 1001,
    invoiceFooterNote: "Thank you for your business!",
  },
  userPermissions: [
    { id: 1, role: "Admin", canEdit: true, canDelete: true, canViewReports: true },
    { id: 2, role: "Manager", canEdit: true, canDelete: false, canViewReports: true },
    { id: 3, role: "Cashier", canEdit: false, canDelete: false, canViewReports: false },
    { id: 4, role: "Guest", canEdit: false, canDelete: false, canViewReports: false },
    { id: 5, role: "Support", canEdit: true, canDelete: false, canViewReports: true },
    { id: 6, role: "Accountant", canEdit: true, canDelete: false, canViewReports: true },
    { id: 7, role: "Warehouse", canEdit: false, canDelete: false, canViewReports: false },
    { id: 8, role: "Sales", canEdit: true, canDelete: false, canViewReports: true },
    { id: 9, role: "HR", canEdit: false, canDelete: false, canViewReports: false },
    { id: 10, role: "Marketing", canEdit: true, canDelete: false, canViewReports: true },
    { id: 11, role: "IT", canEdit: true, canDelete: true, canViewReports: true },
    { id: 12, role: "Developer", canEdit: true, canDelete: true, canViewReports: true },
  ],
};

const ITEMS_PER_PAGE = 5;

export default function SystemSettings() {
  // Pagination state for User Permissions table
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(systemSettingsData.userPermissions.length / ITEMS_PER_PAGE);

  // Controlled form states for General Settings
  const [companyName, setCompanyName] = useState(systemSettingsData.generalSettings.companyName);
  const [companyEmail, setCompanyEmail] = useState(systemSettingsData.generalSettings.companyEmail);
  const [phoneNumber, setPhoneNumber] = useState(systemSettingsData.generalSettings.phoneNumber);
  const [address, setAddress] = useState(systemSettingsData.generalSettings.address);
  const [currency, setCurrency] = useState(systemSettingsData.generalSettings.currency);
  const [timezone, setTimezone] = useState(systemSettingsData.generalSettings.timezone);

  // Controlled form states for Invoice Settings
  const [invoicePrefix, setInvoicePrefix] = useState(systemSettingsData.invoiceSettings.invoicePrefix);
  const [invoiceStartNumber, setInvoiceStartNumber] = useState(systemSettingsData.invoiceSettings.invoiceStartNumber);
  const [invoiceFooterNote, setInvoiceFooterNote] = useState(systemSettingsData.invoiceSettings.invoiceFooterNote);

  // User Permissions state (editable)
  const [userPermissions, setUserPermissions] = useState(systemSettingsData.userPermissions);

  // Handlers for pagination
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Handlers for User Permissions toggles
  const togglePermission = (id: number, permission: "canEdit" | "canDelete" | "canViewReports") => {
    setUserPermissions((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, [permission]: !user[permission] } : user
      )
    );
  };

  // Handlers for buttons (simulate save, refresh, report)
  const handleSave = () => {
    alert("Settings saved successfully.");
  };

  const handleRefresh = () => {
    // Reset all fields to initial data
    setCompanyName(systemSettingsData.generalSettings.companyName);
    setCompanyEmail(systemSettingsData.generalSettings.companyEmail);
    setPhoneNumber(systemSettingsData.generalSettings.phoneNumber);
    setAddress(systemSettingsData.generalSettings.address);
    setCurrency(systemSettingsData.generalSettings.currency);
    setTimezone(systemSettingsData.generalSettings.timezone);

    setInvoicePrefix(systemSettingsData.invoiceSettings.invoicePrefix);
    setInvoiceStartNumber(systemSettingsData.invoiceSettings.invoiceStartNumber);
    setInvoiceFooterNote(systemSettingsData.invoiceSettings.invoiceFooterNote);

    setUserPermissions(systemSettingsData.userPermissions);

    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Generating report...");
  };

  // Pagination slice for current page
  const paginatedPermissions = userPermissions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      <title>System Settings - Dreams POS</title>

      <h1 className="text-3xl font-semibold mb-6">System Settings</h1>

      {/* General Settings Section */}
      <section className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <i className="fas fa-cogs mr-2 text-blue-600"></i> General Settings
        </h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="companyName" className="block font-medium mb-1">
              Company Name
            </label>
            <input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter company name"
            />
          </div>
          <div>
            <label htmlFor="companyEmail" className="block font-medium mb-1">
              Company Email
            </label>
            <input
              id="companyEmail"
              type="email"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter company email"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block font-medium mb-1">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label htmlFor="address" className="block font-medium mb-1">
              Address
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter address"
            />
          </div>
          <div>
            <label htmlFor="currency" className="block font-medium mb-1">
              Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="INR">INR - Indian Rupee</option>
            </select>
          </div>
          <div>
            <label htmlFor="timezone" className="block font-medium mb-1">
              Timezone
            </label>
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="(GMT-08:00) Pacific Time (US & Canada)">
                (GMT-08:00) Pacific Time (US & Canada)
              </option>
              <option value="(GMT-07:00) Mountain Time (US & Canada)">
                (GMT-07:00) Mountain Time (US & Canada)
              </option>
              <option value="(GMT-06:00) Central Time (US & Canada)">
                (GMT-06:00) Central Time (US & Canada)
              </option>
              <option value="(GMT-05:00) Eastern Time (US & Canada)">
                (GMT-05:00) Eastern Time (US & Canada)
              </option>
              <option value="(GMT+00:00) Greenwich Mean Time">
                (GMT+00:00) Greenwich Mean Time
              </option>
              <option value="(GMT+05:30) India Standard Time">
                (GMT+05:30) India Standard Time
              </option>
            </select>
          </div>
        </form>
      </section>

      {/* Invoice Settings Section */}
      <section className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <i className="fas fa-file-invoice-dollar mr-2 text-green-600"></i> Invoice Settings
        </h2>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="invoicePrefix" className="block font-medium mb-1">
              Invoice Prefix
            </label>
            <input
              id="invoicePrefix"
              type="text"
              value={invoicePrefix}
              onChange={(e) => setInvoicePrefix(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter invoice prefix"
            />
          </div>
          <div>
            <label htmlFor="invoiceStartNumber" className="block font-medium mb-1">
              Invoice Start Number
            </label>
            <input
              id="invoiceStartNumber"
              type="number"
              min={1}
              value={invoiceStartNumber}
              onChange={(e) => setInvoiceStartNumber(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter start number"
            />
          </div>
          <div>
            <label htmlFor="invoiceFooterNote" className="block font-medium mb-1">
              Invoice Footer Note
            </label>
            <input
              id="invoiceFooterNote"
              type="text"
              value={invoiceFooterNote}
              onChange={(e) => setInvoiceFooterNote(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter footer note"
            />
          </div>
        </form>
      </section>

      {/* User Permissions Section */}
      <section className="bg-white rounded shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <i className="fas fa-users-cog mr-2 text-purple-600"></i> User Permissions
          </h2>
          <div className="space-x-2">
            <button
              onClick={handleReport}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              type="button"
              title="Generate Report"
            >
              <i className="fas fa-file-alt mr-2"></i> Report
            </button>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              type="button"
              title="Refresh Data"
            >
              <i className="fas fa-sync-alt mr-2"></i> Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
            <thead className="bg-purple-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-purple-700 border-r border-purple-200">
                  Role
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-purple-700 border-r border-purple-200">
                  Can Edit
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-purple-700 border-r border-purple-200">
                  Can Delete
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-purple-700">
                  Can View Reports
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedPermissions.map(({ id, role, canEdit, canDelete, canViewReports }) => (
                <tr key={id} className="hover:bg-purple-50">
                  <td className="px-4 py-3 border-r border-gray-200">{role}</td>
                  <td className="px-4 py-3 text-center border-r border-gray-200">
                    <input
                      type="checkbox"
                      checked={canEdit}
                      onChange={() => togglePermission(id, "canEdit")}
                      className="w-5 h-5 cursor-pointer text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      aria-label={`Toggle Can Edit for ${role}`}
                    />
                  </td>
                  <td className="px-4 py-3 text-center border-r border-gray-200">
                    <input
                      type="checkbox"
                      checked={canDelete}
                      onChange={() => togglePermission(id, "canDelete")}
                      className="w-5 h-5 cursor-pointer text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      aria-label={`Toggle Can Delete for ${role}`}
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={canViewReports}
                      onChange={() => togglePermission(id, "canViewReports")}
                      className="w-5 h-5 cursor-pointer text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      aria-label={`Toggle Can View Reports for ${role}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <nav
          className="flex justify-center items-center space-x-2 mt-6"
          aria-label="User Permissions Pagination"
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`inline-flex items-center px-3 py-1.5 border border-purple-600 rounded text-purple-600 hover:bg-purple-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label="Previous Page"
            type="button"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          {[...Array(totalPages)].map((_, idx) => {
            const page = idx + 1;
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                aria-current={isActive ? "page" : undefined}
                className={`px-3 py-1.5 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  isActive
                    ? "bg-purple-600 text-white border-purple-600"
                    : "border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                }`}
                type="button"
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`inline-flex items-center px-3 py-1.5 border border-purple-600 rounded text-purple-600 hover:bg-purple-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label="Next Page"
            type="button"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </nav>
      </section>

      {/* Save Button Section */}
      <section className="flex justify-end">
        <button
          onClick={handleSave}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="button"
          title="Save Settings"
        >
          <i className="fas fa-save mr-2"></i> Save Settings
        </button>
      </section>
    </div>
  );
}