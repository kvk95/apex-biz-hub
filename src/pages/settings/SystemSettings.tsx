import { apiService } from "@/services/ApiService";
import { useEffect, useState } from "react";
import { Pagination } from "@/components/Pagination/Pagination";

const statusOptions = ["Active", "Inactive"];

export default function SystemSettings() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<any>("SystemSettings");
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

  // Pagination state for User Permissions table
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Controlled form states for General Settings
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [currency, setCurrency] = useState("");
  const [timezone, setTimezone] = useState("");

  // Controlled form states for Invoice Settings
  const [invoicePrefix, setInvoicePrefix] = useState("");
  const [invoiceStartNumber, setInvoiceStartNumber] = useState(0);
  const [invoiceFooterNote, setInvoiceFooterNote] = useState("");

  // User Permissions state (editable)
  const [userPermissions, setUserPermissions] = useState([]);

  // Modal editing state for User Permissions
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    role: "",
    canEdit: false,
    canDelete: false,
    canViewReports: false,
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setCompanyName(data.generalSettings?.companyName || "");
      setCompanyEmail(data.generalSettings?.companyEmail || "");
      setPhoneNumber(data.generalSettings?.phoneNumber || "");
      setAddress(data.generalSettings?.address || "");
      setCurrency(data.generalSettings?.currency || "");
      setTimezone(data.generalSettings?.timezone || "");

      setInvoicePrefix(data.invoiceSettings?.invoicePrefix || "");
      setInvoiceStartNumber(data.invoiceSettings?.invoiceStartNumber || 0);
      setInvoiceFooterNote(data.invoiceSettings?.invoiceFooterNote || "");

      setUserPermissions(data.userPermissions || []);
      setCurrentPage(1);
    }
  }, [data]);

  // Handlers for pagination are encapsulated in Pagination component

  // Handlers for User Permissions toggles (disabled during edit modal open)
  const togglePermission = (id: number, permission: "canEdit" | "canDelete" | "canViewReports") => {
    setUserPermissions((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, [permission]: !user[permission] } : user
      )
    );
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = userPermissions.find((u) => u.id === id);
    if (item) {
      setEditForm({
        role: item.role,
        canEdit: item.canEdit,
        canDelete: item.canDelete,
        canViewReports: item.canViewReports,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, type, checked } = e.target;
    const value = type === "checkbox" ? checked : e.target.value;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (editId !== null) {
      setUserPermissions((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                role: editForm.role,
                canEdit: editForm.canEdit,
                canDelete: editForm.canDelete,
                canViewReports: editForm.canViewReports,
              }
            : item
        )
      );
      setEditId(null);
      setIsEditModalOpen(false);
    }
  };

  // Cancel editing modal
  const handleEditCancel = () => {
    setEditId(null);
    setIsEditModalOpen(false);
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    if (data && Object.keys(data).length > 0) {
      setCompanyName(data.generalSettings?.companyName || "");
      setCompanyEmail(data.generalSettings?.companyEmail || "");
      setPhoneNumber(data.generalSettings?.phoneNumber || "");
      setAddress(data.generalSettings?.address || "");
      setCurrency(data.generalSettings?.currency || "");
      setTimezone(data.generalSettings?.timezone || "");

      setInvoicePrefix(data.invoiceSettings?.invoicePrefix || "");
      setInvoiceStartNumber(data.invoiceSettings?.invoiceStartNumber || 0);
      setInvoiceFooterNote(data.invoiceSettings?.invoiceFooterNote || "");

      setUserPermissions(data.userPermissions || []);
      setCurrentPage(1);
    }
  };

  const handleSave = () => {
    alert("Settings saved successfully.");
  };

  const handleReport = () => {
    alert("Generating report...");
  };

  // Pagination slice for current page
  const paginatedPermissions = userPermissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-lg font-semibold mb-6">System Settings</h1>

      {/* General Settings Section */}
      <section className="bg-card rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <i className="fa fa-cogs fa-light mr-2 text-blue-600"></i> General Settings
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
      <section className="bg-card rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <i className="fa fa-file-invoice-dollar fa-light mr-2 text-green-600"></i> Invoice Settings
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter footer note"
            />
          </div>
        </form>
      </section>

      {/* User Permissions Section */}
      <section className="bg-card rounded shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <i className="fa fa-users-cog fa-light mr-2 text-purple-600"></i> User Permissions
          </h2>
          <div className="space-x-2">
            <button
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              type="button"
              title="Generate Report"
            >
              <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              type="button"
              title="Clear Data"
            >
              <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Role
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Can Edit
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Can Delete
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Can View Reports
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedPermissions.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No user permissions found.
                  </td>
                </tr>
              )}
              {paginatedPermissions.map(({ id, role, canEdit, canDelete, canViewReports }) => (
                <tr
                  key={id}
                  className="border-b border-border hover:bg-muted/50 transition-colors text-sm text-gray-500"
                >
                  <td className="px-4 py-2">{role}</td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={canEdit}
                      onChange={() => togglePermission(id, "canEdit")}
                      className="cursor-pointer"
                      aria-label={`Toggle Can Edit for ${role}`}
                      disabled={isEditModalOpen}
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={canDelete}
                      onChange={() => togglePermission(id, "canDelete")}
                      className="cursor-pointer"
                      aria-label={`Toggle Can Delete for ${role}`}
                      disabled={isEditModalOpen}
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={canViewReports}
                      onChange={() => togglePermission(id, "canViewReports")}
                      className="cursor-pointer"
                      aria-label={`Toggle Can View Reports for ${role}`}
                      disabled={isEditModalOpen}
                    />
                  </td>
                  <td className="px-4 py-2 text-center text-sm space-x-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(id)}
                      aria-label={`Edit permissions for ${role}`}
                      className="text-gray-900 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
                      disabled={isEditModalOpen}
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
          totalItems={userPermissions.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
      </section>

      {/* Save Button Section */}
      <section className="flex justify-end">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
          type="button"
          title="Save Settings"
        >
          <i className="fa fa-save fa-light" aria-hidden="true"></i> Save Settings
        </button>
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
              Edit User Permission
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="editRole"
                  className="block text-sm font-medium mb-1"
                >
                  Role
                </label>
                <input
                  type="text"
                  id="editRole"
                  name="role"
                  value={editForm.role}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter role"
                  disabled
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="canEdit"
                    checked={editForm.canEdit}
                    onChange={handleEditInputChange}
                    className="w-5 h-5 cursor-pointer text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span>Can Edit</span>
                </label>
                <label className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="canDelete"
                    checked={editForm.canDelete}
                    onChange={handleEditInputChange}
                    className="w-5 h-5 cursor-pointer text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span>Can Delete</span>
                </label>
                <label className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="canViewReports"
                    checked={editForm.canViewReports}
                    onChange={handleEditInputChange}
                    className="w-5 h-5 cursor-pointer text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span>Can View Reports</span>
                </label>
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
}