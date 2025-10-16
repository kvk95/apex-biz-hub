import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const roles = ["Admin", "User"];
const statuses = ["Active", "Inactive"];
const currencyPositions = [
  { label: "Left ($100)", value: "left" },
  { label: "Right (100$)", value: "right" },
];
const taxTypes = ["Inclusive", "Exclusive"];

export default function GeneralSettings() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: 0,
    name: "",
    email: "",
    role: roles[0],
    status: statuses[0],
  });

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("GeneralSettings");
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

  // Company Info State
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyLogoUrl, setCompanyLogoUrl] = useState("");

  // Currency Settings State
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");
  const [currencyPosition, setCurrencyPosition] = useState("");
  const [thousandSeparator, setThousandSeparator] = useState("");
  const [decimalSeparator, setDecimalSeparator] = useState("");
  const [numberOfDecimals, setNumberOfDecimals] = useState(0);

  // Tax Settings State
  const [taxName, setTaxName] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [taxType, setTaxType] = useState("");

  // Invoice Settings State
  const [invoicePrefix, setInvoicePrefix] = useState("");
  const [invoiceStartNumber, setInvoiceStartNumber] = useState(0);
  const [invoiceFooterNote, setInvoiceFooterNote] = useState("");

  useEffect(() => {
    if (data.length > 0) {
      const generalSettings = data[0];
      setCompanyName(generalSettings.companyInfo.companyName);
      setCompanyEmail(generalSettings.companyInfo.companyEmail);
      setCompanyPhone(generalSettings.companyInfo.companyPhone);
      setCompanyAddress(generalSettings.companyInfo.companyAddress);
      setCompanyLogoUrl(generalSettings.companyInfo.companyLogoUrl);

      setCurrencySymbol(generalSettings.currencySettings.currencySymbol);
      setCurrencyCode(generalSettings.currencySettings.currencyCode);
      setCurrencyPosition(generalSettings.currencySettings.currencyPosition);
      setThousandSeparator(generalSettings.currencySettings.thousandSeparator);
      setDecimalSeparator(generalSettings.currencySettings.decimalSeparator);
      setNumberOfDecimals(generalSettings.currencySettings.numberOfDecimals);

      setTaxName(generalSettings.taxSettings.taxName);
      setTaxRate(generalSettings.taxSettings.taxRate);
      setTaxType(generalSettings.taxSettings.taxType);

      setInvoicePrefix(generalSettings.invoiceSettings.invoicePrefix);
      setInvoiceStartNumber(generalSettings.invoiceSettings.invoiceStartNumber);
      setInvoiceFooterNote(generalSettings.invoiceSettings.invoiceFooterNote);
    }
  }, [data]);

  // Current users slice for pagination
  const currentUsers =
    data.length > 0
      ? data[0].users.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )
      : [];

  // Handlers for buttons (simulate save, clear, report)
  const handleSave = () => {
    alert("Settings saved successfully.");
  };

  // Clear button replaces Refresh - resets all fields to initial data
  const handleClear = () => {
    if (data.length > 0) {
      const generalSettings = data[0];
      setCompanyName(generalSettings.companyInfo.companyName);
      setCompanyEmail(generalSettings.companyInfo.companyEmail);
      setCompanyPhone(generalSettings.companyInfo.companyPhone);
      setCompanyAddress(generalSettings.companyInfo.companyAddress);
      setCompanyLogoUrl(generalSettings.companyInfo.companyLogoUrl);

      setCurrencySymbol(generalSettings.currencySettings.currencySymbol);
      setCurrencyCode(generalSettings.currencySettings.currencyCode);
      setCurrencyPosition(generalSettings.currencySettings.currencyPosition);
      setThousandSeparator(generalSettings.currencySettings.thousandSeparator);
      setDecimalSeparator(generalSettings.currencySettings.decimalSeparator);
      setNumberOfDecimals(generalSettings.currencySettings.numberOfDecimals);

      setTaxName(generalSettings.taxSettings.taxName);
      setTaxRate(generalSettings.taxSettings.taxRate);
      setTaxType(generalSettings.taxSettings.taxType);

      setInvoicePrefix(generalSettings.invoiceSettings.invoicePrefix);
      setInvoiceStartNumber(generalSettings.invoiceSettings.invoiceStartNumber);
      setInvoiceFooterNote(generalSettings.invoiceSettings.invoiceFooterNote);

      setCurrentPage(1);
    }
  };

  const handleReport = () => {
    alert("Report generated.");
  };

  // Edit modal handlers
  const openEditModal = (user: any) => {
    setEditForm({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    setData((prev) => {
      if (prev.length === 0) return prev;
      const updatedUsers = prev[0].users.map((user: any) =>
        user.id === editForm.id
          ? {
              ...user,
              name: editForm.name.trim(),
              email: editForm.email.trim(),
              role: editForm.role,
              status: editForm.status,
            }
          : user
      );
      const newData = [
        {
          ...prev[0],
          users: updatedUsers,
        },
      ];
      return newData;
    });
    setIsEditModalOpen(false);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <h1 className="text-lg font-semibold mb-6">General Settings</h1>

        {/* Company Information Section */}
        <section className="bg-card rounded shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Company Information</h2>
            <div className="space-x-2">
              <button
                onClick={handleReport}
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
                title="Generate Report"
              >
                <i className="fa fa-file-text fa-light" aria-hidden="true"></i>{" "}
                Report
              </button>
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
                title="Clear"
              >
                <i className="fa fa-refresh fa-light" aria-hidden="true"></i>{" "}
                Clear
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
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                className="w-full border border-input rounded px-3 py-2 resize-none bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="md:col-span-2 flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img
                  src={companyLogoUrl}
                  alt="Company Logo"
                  className="h-20 w-20 object-contain border border-input rounded"
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
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
          </form>
        </section>

        {/* Currency Settings Section */}
        <section className="bg-card rounded shadow p-6 mb-6">
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
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                className="w-full border border-input rounded px-3 py-2 uppercase bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </form>
        </section>

        {/* Tax Settings Section */}
        <section className="bg-card rounded shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">Tax Settings</h2>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="taxName"
                className="block text-sm font-medium mb-1"
              >
                Tax Name
              </label>
              <input
                id="taxName"
                type="text"
                value={taxName}
                onChange={(e) => setTaxName(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label
                htmlFor="taxRate"
                className="block text-sm font-medium mb-1"
              >
                Tax Rate (%)
              </label>
              <input
                id="taxRate"
                type="number"
                min={0}
                max={100}
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label
                htmlFor="taxType"
                className="block text-sm font-medium mb-1"
              >
                Tax Type
              </label>
              <select
                id="taxType"
                value={taxType}
                onChange={(e) => setTaxType(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
        <section className="bg-card rounded shadow p-6 mb-6">
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
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                className="w-full border border-input rounded px-3 py-2 resize-none bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </form>
        </section>

        {/* Users Table Section */}
        <section className="bg-card rounded shadow py-6">
          <div className="flex justify-between items-center px-6 mb-6">
            <h2 className="text-xl font-semibold">Users</h2>
            <div className="space-x-2">
              <button
                onClick={handleReport}
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
                title="Generate Report"
              >
                <i className="fa fa-file-text fa-light" aria-hidden="true"></i>{" "}
                Report
              </button>
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
                title="Clear"
              >
                <i className="fa fa-refresh fa-light" aria-hidden="true"></i>{" "}
                Clear
              </button>
            </div>
          </div>
          <div className="overflow-x-auto px-6">
            <table className="min-w-full border border-border divide-y divide-border">
              <thead>
                <tr className="bg-muted text-muted-foreground text-left text-sm font-semibold">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center px-4 py-6 text-muted-foreground italic"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
                {currentUsers.map((user, idx) => (
                  <tr
                    key={user.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {user.role}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm space-x-3">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-primary hover:text-primary/80 transition-colors"
                        aria-label={`Edit user ${user.name}`}
                        type="button"
                      >
                        <i
                          className="fa fa-pencil fa-light"
                          aria-hidden="true"
                        ></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={data.length > 0 ? data[0].users.length : 0}
            onPageChange={setCurrentPage}
            onPageSizeChange={setItemsPerPage}
          />
        </section>

        {/* Save Button */}
        <div className="flex justify-end px-6">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
            title="Save Settings"
          >
            <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
            Settings
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-modal-title"
        >
          <div className="bg-white rounded shadow-lg max-w-xl w-full p-6 relative">
            <h2
              id="edit-modal-title"
              className="text-xl font-semibold mb-4 text-center"
            >
              Edit User
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="editName"
                  className="block text-sm font-medium mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="editName"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label
                  htmlFor="editEmail"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="editEmail"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label
                  htmlFor="editRole"
                  className="block text-sm font-medium mb-1"
                >
                  Role
                </label>
                <select
                  id="editRole"
                  name="role"
                  value={editForm.role}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="editStatus"
                  className="block text-sm font-medium mb-1"
                >
                  Status
                </label>
                <select
                  id="editStatus"
                  name="status"
                  value={editForm.status}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleEditCancel}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
