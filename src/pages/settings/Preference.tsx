import React, { useEffect, useState } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

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

  // Handlers for buttons (Save, Clear, Report)
  const handleSave = () => {
    alert("Settings saved successfully.");
  };

  const handleClear = () => {
    setCompanyName("");
    setCompanyEmail("");
    setCompanyPhone("");
    setCompanyAddress("");
    setCurrency("");
    setTimezone("");
    setDateFormat("");
    setTimeFormat("");
    setLanguage("");
    setInvoicePrefix("");
    setInvoiceStartNumber(undefined);
    setInvoiceFooterNote("");
    setInvoiceTerms("");
    setTheme("");
    setNotifications(false);
    setAutoSave(false);
    setItemsPerPage(10);
    setCurrentPage(1);
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

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: roles[0],
    status: statuses[0],
  });
  const [editId, setEditId] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    const item = users.find((u) => u.id === id);
    if (item) {
      setEditForm({
        name: item.name,
        email: item.email,
        role: item.role,
        status: item.status,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  const handleEditSave = () => {
    if (editId !== null) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editId
            ? {
                ...user,
                name: editForm.name,
                email: editForm.email,
                role: editForm.role,
                status: editForm.status,
              }
            : user
        )
      );
      setEditId(null);
      setIsEditModalOpen(false);
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setIsEditModalOpen(false);
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Page Title */}
      <h1 className="text-lg font-semibold mb-6">Preference</h1>

      {/* General Settings Section */}
      <section className="mb-10 bg-card rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">General Settings</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium mb-1">Company Name</label>
            <input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter company name"
            />
          </div>
          <div>
            <label htmlFor="companyEmail" className="block text-sm font-medium mb-1">Company Email</label>
            <input
              id="companyEmail"
              type="email"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="companyPhone" className="block text-sm font-medium mb-1">Company Phone</label>
            <input
              id="companyPhone"
              type="tel"
              value={companyPhone}
              onChange={(e) => setCompanyPhone(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="companyAddress" className="block text-sm font-medium mb-1">Company Address</label>
            <input
              id="companyAddress"
              type="text"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium mb-1">Currency</label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
      <section className="mb-10 bg-card rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">Invoice Settings</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="invoicePrefix" className="block text-sm font-medium mb-1">Invoice Prefix</label>
            <input
              id="invoicePrefix"
              type="text"
              value={invoicePrefix}
              onChange={(e) => setInvoicePrefix(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter invoice prefix"
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="invoiceFooterNote" className="block text-sm font-medium mb-1">Invoice Footer Note</label>
            <textarea
              id="invoiceFooterNote"
              rows={3}
              value={invoiceFooterNote}
              onChange={(e) => setInvoiceFooterNote(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 resize-none bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="invoiceTerms" className="block text-sm font-medium mb-1">Invoice Terms</label>
            <textarea
              id="invoiceTerms"
              rows={3}
              value={invoiceTerms}
              onChange={(e) => setInvoiceTerms(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 resize-none bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </form>
      </section>

      {/* User Preferences Section */}
      <section className="mb-10 bg-card rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">User Preferences</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <label htmlFor="theme" className="block text-sm font-medium mb-1">Theme</label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
      <section className="bg-card rounded shadow py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold border-b border-gray-200 pb-2">Users</h2>
          <div className="space-x-2">
            <button
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              title="Generate Report"
            >
              <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              title="Clear Settings"
            >
              <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              title="Save Settings"
            >
              <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No users to display.
                  </td>
                </tr>
              )}
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors text-sm text-gray-500"
                >
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    <select
                      value={user.role}
                      onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                      className="border border-input rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={user.status}
                      onChange={(e) => handleUserStatusChange(user.id, e.target.value)}
                      className="border border-input rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 text-center text-sm space-x-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(user.id)}
                      aria-label={`Edit user ${user.name}`}
                      className="text-gray-900 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1 "
                    >
                      <i className="fa fa-edit fa-light" aria-hidden="true"></i>
                      <span className="sr-only">Edit record</span>
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
          totalItems={users.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
      </section>

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
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

              {/* Email */}
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
                />
              </div>

              {/* Role */}
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

              {/* Status */}
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
    </div>
  );
};

export default Preference;