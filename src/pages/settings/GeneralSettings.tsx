import React, { useState } from "react";

const generalSettingsData = {
  companyInfo: {
    companyName: "Dreams POS",
    companyEmail: "dreamspos@gmail.com",
    companyPhone: "123-456-7890",
    companyAddress: "123 Dreams Street, Dream City, DC 12345",
    companyLogoUrl:
      "https://dreamspos.dreamstechnologies.com/html/template/assets/img/logo.png",
  },
  currencySettings: {
    currencySymbol: "$",
    currencyCode: "USD",
    currencyPosition: "left", // left or right
    thousandSeparator: ",",
    decimalSeparator: ".",
    numberOfDecimals: 2,
  },
  taxSettings: {
    taxName: "VAT",
    taxRate: 15,
    taxType: "Inclusive", // Inclusive or Exclusive
  },
  invoiceSettings: {
    invoicePrefix: "INV",
    invoiceStartNumber: 1000,
    invoiceFooterNote: "Thank you for your business!",
  },
  users: [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "User",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "User",
      status: "Active",
    },
    {
      id: 4,
      name: "Alice Williams",
      email: "alice@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 5,
      name: "Michael Brown",
      email: "michael@example.com",
      role: "User",
      status: "Active",
    },
    {
      id: 6,
      name: "Emily Davis",
      email: "emily@example.com",
      role: "User",
      status: "Inactive",
    },
    {
      id: 7,
      name: "David Wilson",
      email: "david@example.com",
      role: "User",
      status: "Active",
    },
    {
      id: 8,
      name: "Sarah Miller",
      email: "sarah@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 9,
      name: "Chris Moore",
      email: "chris@example.com",
      role: "User",
      status: "Active",
    },
    {
      id: 10,
      name: "Jessica Taylor",
      email: "jessica@example.com",
      role: "User",
      status: "Inactive",
    },
  ],
};

const roles = ["Admin", "User"];
const statuses = ["Active", "Inactive"];
const currencyPositions = [
  { label: "Left ($100)", value: "left" },
  { label: "Right (100$)", value: "right" },
];
const taxTypes = ["Inclusive", "Exclusive"];

export default function GeneralSettings() {
  // Company Info State
  const [companyName, setCompanyName] = useState(
    generalSettingsData.companyInfo.companyName
  );
  const [companyEmail, setCompanyEmail] = useState(
    generalSettingsData.companyInfo.companyEmail
  );
  const [companyPhone, setCompanyPhone] = useState(
    generalSettingsData.companyInfo.companyPhone
  );
  const [companyAddress, setCompanyAddress] = useState(
    generalSettingsData.companyInfo.companyAddress
  );
  const [companyLogoUrl, setCompanyLogoUrl] = useState(
    generalSettingsData.companyInfo.companyLogoUrl
  );

  // Currency Settings State
  const [currencySymbol, setCurrencySymbol] = useState(
    generalSettingsData.currencySettings.currencySymbol
  );
  const [currencyCode, setCurrencyCode] = useState(
    generalSettingsData.currencySettings.currencyCode
  );
  const [currencyPosition, setCurrencyPosition] = useState(
    generalSettingsData.currencySettings.currencyPosition
  );
  const [thousandSeparator, setThousandSeparator] = useState(
    generalSettingsData.currencySettings.thousandSeparator
  );
  const [decimalSeparator, setDecimalSeparator] = useState(
    generalSettingsData.currencySettings.decimalSeparator
  );
  const [numberOfDecimals, setNumberOfDecimals] = useState(
    generalSettingsData.currencySettings.numberOfDecimals
  );

  // Tax Settings State
  const [taxName, setTaxName] = useState(generalSettingsData.taxSettings.taxName);
  const [taxRate, setTaxRate] = useState(generalSettingsData.taxSettings.taxRate);
  const [taxType, setTaxType] = useState(generalSettingsData.taxSettings.taxType);

  // Invoice Settings State
  const [invoicePrefix, setInvoicePrefix] = useState(
    generalSettingsData.invoiceSettings.invoicePrefix
  );
  const [invoiceStartNumber, setInvoiceStartNumber] = useState(
    generalSettingsData.invoiceSettings.invoiceStartNumber
  );
  const [invoiceFooterNote, setInvoiceFooterNote] = useState(
    generalSettingsData.invoiceSettings.invoiceFooterNote
  );

  // Users Table Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const totalPages = Math.ceil(generalSettingsData.users.length / usersPerPage);

  // Pagination handlers
  const paginate = (pageNumber: number) => {
    if (pageNumber < 1) pageNumber = 1;
    else if (pageNumber > totalPages) pageNumber = totalPages;
    setCurrentPage(pageNumber);
  };

  // Current users slice
  const currentUsers = generalSettingsData.users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  // Handlers for buttons (simulate save, refresh, report)
  const handleSave = () => {
    alert("Settings saved successfully.");
  };

  const handleRefresh = () => {
    // Reset all fields to initial data
    setCompanyName(generalSettingsData.companyInfo.companyName);
    setCompanyEmail(generalSettingsData.companyInfo.companyEmail);
    setCompanyPhone(generalSettingsData.companyInfo.companyPhone);
    setCompanyAddress(generalSettingsData.companyInfo.companyAddress);
    setCompanyLogoUrl(generalSettingsData.companyInfo.companyLogoUrl);

    setCurrencySymbol(generalSettingsData.currencySettings.currencySymbol);
    setCurrencyCode(generalSettingsData.currencySettings.currencyCode);
    setCurrencyPosition(generalSettingsData.currencySettings.currencyPosition);
    setThousandSeparator(generalSettingsData.currencySettings.thousandSeparator);
    setDecimalSeparator(generalSettingsData.currencySettings.decimalSeparator);
    setNumberOfDecimals(generalSettingsData.currencySettings.numberOfDecimals);

    setTaxName(generalSettingsData.taxSettings.taxName);
    setTaxRate(generalSettingsData.taxSettings.taxRate);
    setTaxType(generalSettingsData.taxSettings.taxType);

    setInvoicePrefix(generalSettingsData.invoiceSettings.invoicePrefix);
    setInvoiceStartNumber(generalSettingsData.invoiceSettings.invoiceStartNumber);
    setInvoiceFooterNote(generalSettingsData.invoiceSettings.invoiceFooterNote);

    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generated.");
  };

  return (
    <>
      <title>General Settings - Dreams POS</title>
      <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-3xl font-semibold mb-8">General Settings</h1>

          {/* Company Information Section */}
          <section className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Company Information</h2>
              <div className="space-x-2">
                <button
                  onClick={handleReport}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
                  type="button"
                  title="Generate Report"
                >
                  <i className="fas fa-file-alt mr-2" aria-hidden="true"></i> Report
                </button>
                <button
                  onClick={handleRefresh}
                  className="inline-flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-sm font-medium"
                  type="button"
                  title="Refresh"
                >
                  <i className="fas fa-sync-alt mr-2" aria-hidden="true"></i> Refresh
                </button>
              </div>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium mb-1"
                >
                  Company Name
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="companyEmail"
                  className="block text-sm font-medium mb-1"
                >
                  Company Email
                </label>
                <input
                  id="companyEmail"
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="companyPhone"
                  className="block text-sm font-medium mb-1"
                >
                  Company Phone
                </label>
                <input
                  id="companyPhone"
                  type="tel"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="companyAddress"
                  className="block text-sm font-medium mb-1"
                >
                  Company Address
                </label>
                <textarea
                  id="companyAddress"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={companyLogoUrl}
                    alt="Company Logo"
                    className="h-20 w-20 object-contain border border-gray-300 rounded"
                  />
                </div>
                <div className="flex-grow">
                  <label
                    htmlFor="companyLogoUrl"
                    className="block text-sm font-medium mb-1"
                  >
                    Company Logo URL
                  </label>
                  <input
                    id="companyLogoUrl"
                    type="url"
                    value={companyLogoUrl}
                    onChange={(e) => setCompanyLogoUrl(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>
            </form>
          </section>

          {/* Currency Settings Section */}
          <section className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">Currency Settings</h2>
            <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="currencySymbol"
                  className="block text-sm font-medium mb-1"
                >
                  Currency Symbol
                </label>
                <input
                  id="currencySymbol"
                  type="text"
                  maxLength={3}
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="currencyCode"
                  className="block text-sm font-medium mb-1"
                >
                  Currency Code
                </label>
                <input
                  id="currencyCode"
                  type="text"
                  maxLength={3}
                  value={currencyCode}
                  onChange={(e) => setCurrencyCode(e.target.value.toUpperCase())}
                  className="w-full border border-gray-300 rounded px-3 py-2 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="currencyPosition"
                  className="block text-sm font-medium mb-1"
                >
                  Currency Position
                </label>
                <select
                  id="currencyPosition"
                  value={currencyPosition}
                  onChange={(e) => setCurrencyPosition(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {currencyPositions.map((pos) => (
                    <option key={pos.value} value={pos.value}>
                      {pos.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="thousandSeparator"
                  className="block text-sm font-medium mb-1"
                >
                  Thousand Separator
                </label>
                <input
                  id="thousandSeparator"
                  type="text"
                  maxLength={1}
                  value={thousandSeparator}
                  onChange={(e) => setThousandSeparator(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="decimalSeparator"
                  className="block text-sm font-medium mb-1"
                >
                  Decimal Separator
                </label>
                <input
                  id="decimalSeparator"
                  type="text"
                  maxLength={1}
                  value={decimalSeparator}
                  onChange={(e) => setDecimalSeparator(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="numberOfDecimals"
                  className="block text-sm font-medium mb-1"
                >
                  Number of Decimals
                </label>
                <input
                  id="numberOfDecimals"
                  type="number"
                  min={0}
                  max={4}
                  value={numberOfDecimals}
                  onChange={(e) => setNumberOfDecimals(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>
          </section>

          {/* Tax Settings Section */}
          <section className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">Tax Settings</h2>
            <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="taxName" className="block text-sm font-medium mb-1">
                  Tax Name
                </label>
                <input
                  id="taxName"
                  type="text"
                  value={taxName}
                  onChange={(e) => setTaxName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="taxRate" className="block text-sm font-medium mb-1">
                  Tax Rate (%)
                </label>
                <input
                  id="taxRate"
                  type="number"
                  min={0}
                  max={100}
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="taxType" className="block text-sm font-medium mb-1">
                  Tax Type
                </label>
                <select
                  id="taxType"
                  value={taxType}
                  onChange={(e) => setTaxType(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {taxTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </section>

          {/* Invoice Settings Section */}
          <section className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">Invoice Settings</h2>
            <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="invoicePrefix"
                  className="block text-sm font-medium mb-1"
                >
                  Invoice Prefix
                </label>
                <input
                  id="invoicePrefix"
                  type="text"
                  value={invoicePrefix}
                  onChange={(e) => setInvoicePrefix(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="invoiceStartNumber"
                  className="block text-sm font-medium mb-1"
                >
                  Invoice Start Number
                </label>
                <input
                  id="invoiceStartNumber"
                  type="number"
                  min={1}
                  value={invoiceStartNumber}
                  onChange={(e) => setInvoiceStartNumber(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="invoiceFooterNote"
                  className="block text-sm font-medium mb-1"
                >
                  Invoice Footer Note
                </label>
                <textarea
                  id="invoiceFooterNote"
                  value={invoiceFooterNote}
                  onChange={(e) => setInvoiceFooterNote(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>
          </section>

          {/* Users Table Section */}
          <section className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Users</h2>
              <div className="space-x-2">
                <button
                  onClick={handleReport}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
                  type="button"
                  title="Generate Report"
                >
                  <i className="fas fa-file-alt mr-2" aria-hidden="true"></i> Report
                </button>
                <button
                  onClick={handleRefresh}
                  className="inline-flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-sm font-medium"
                  type="button"
                  title="Refresh"
                >
                  <i className="fas fa-sync-alt mr-2" aria-hidden="true"></i> Refresh
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          title="Edit User"
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() =>
                            alert(`Edit user: ${user.name} (Not implemented)`)
                          }
                        >
                          <i className="fas fa-edit" aria-hidden="true"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <nav
              className="mt-4 flex justify-end items-center space-x-1"
              aria-label="Pagination"
            >
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Previous Page"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              {[...Array(totalPages)].map((_, idx) => {
                const page = idx + 1;
                return (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 ${
                      currentPage === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : ""
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Next Page"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </nav>
          </section>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded text-lg font-semibold"
              type="button"
              title="Save Settings"
            >
              <i className="fas fa-save mr-2" aria-hidden="true"></i> Save Settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
}