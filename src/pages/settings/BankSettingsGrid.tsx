import React, { useMemo, useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

export default function BankSettingsGrid() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state for Add Section
  const [formData, setFormData] = useState({
    bankName: "",
    branchName: "",
    accountNumber: "",
    accountHolder: "",
    ifscCode: "",
    status: "Active",
  });

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    bankName: "",
    branchName: "",
    accountNumber: "",
    accountHolder: "",
    ifscCode: "",
    status: "Active",
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Data state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("BankSettingsGrid");
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

  // Handlers for Add Section form inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Add Section (Add new bank setting)
  const handleSave = () => {
    if (
      !formData.bankName.trim() ||
      !formData.branchName.trim() ||
      !formData.accountNumber.trim() ||
      !formData.accountHolder.trim() ||
      !formData.ifscCode.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
    const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
    setData((prev) => [...prev, { id: newId, ...formData }]);
    setFormData({
      bankName: "",
      branchName: "",
      accountNumber: "",
      accountHolder: "",
      ifscCode: "",
      status: "Active",
    });
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        bankName: item.bankName,
        branchName: item.branchName,
        accountNumber: item.accountNumber,
        accountHolder: item.accountHolder,
        ifscCode: item.ifscCode,
        status: item.status,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (
      !editForm.bankName.trim() ||
      !editForm.branchName.trim() ||
      !editForm.accountNumber.trim() ||
      !editForm.accountHolder.trim() ||
      !editForm.ifscCode.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                bankName: editForm.bankName.trim(),
                branchName: editForm.branchName.trim(),
                accountNumber: editForm.accountNumber.trim(),
                accountHolder: editForm.accountHolder.trim(),
                ifscCode: editForm.ifscCode.trim(),
                status: editForm.status,
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

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      // If deleting last item on page, go to previous page if needed
      if (
        (currentPage - 1) * itemsPerPage >= data.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setFormData({
      bankName: "",
      branchName: "",
      accountNumber: "",
      accountHolder: "",
      ifscCode: "",
      status: "Active",
    });
    setEditId(null);
    setCurrentPage(1);
  };

  const handleReport = () => {
    // For demo, just alert JSON data
    alert("Report Data:\n" + JSON.stringify(data, null, 2));
  };

  // Calculate paginated data using Pagination component props
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Title */}
      <h1 className="text-lg font-semibold mb-6">Bank Settings Grid</h1>

      {/* Controls: Report & Clear */}
      <div className="flex justify-end gap-3 mb-4">
        <button
          onClick={handleReport}
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
          type="button"
        >
          <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
        </button>
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
          type="button"
        >
          <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
        </button>
      </div>

      {/* Form Section (Add Section) - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Bank Setting</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          noValidate
        >
          <div>
            <label
              htmlFor="bankName"
              className="block text-sm font-medium mb-1"
            >
              Bank Name
            </label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="branchName"
              className="block text-sm font-medium mb-1"
            >
              Branch Name
            </label>
            <input
              type="text"
              id="branchName"
              name="branchName"
              value={formData.branchName}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="accountNumber"
              className="block text-sm font-medium mb-1"
            >
              Account Number
            </label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="accountHolder"
              className="block text-sm font-medium mb-1"
            >
              Account Holder
            </label>
            <input
              type="text"
              id="accountHolder"
              name="accountHolder"
              value={formData.accountHolder}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="ifscCode"
              className="block text-sm font-medium mb-1"
            >
              IFSC Code
            </label>
            <input
              type="text"
              id="ifscCode"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium mb-1"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="md:col-span-3 flex justify-end items-end gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              title="Save Bank Setting"
            >
              <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6">
        <h2 className="text-xl font-semibold mb-4 px-6">Bank Settings List</h2>
        <div className="overflow-x-auto px-6">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Bank Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Branch Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Account Number
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Account Holder
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  IFSC Code
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
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No bank settings found.
                  </td>
                </tr>
              )}
              {paginatedData.map((item, idx) => (
                <tr
                  key={item.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.bankName}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.branchName}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.accountNumber}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.accountHolder}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.ifscCode}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        item.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit bank setting ${item.bankName}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete bank setting ${item.bankName}`}
                      type="button"
                    >
                      <i className="fa fa-trash fa-light" aria-hidden="true"></i>
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
          totalItems={data.length}
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
              Edit Bank Setting
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="editBankName"
                  className="block text-sm font-medium mb-1"
                >
                  Bank Name
                </label>
                <input
                  type="text"
                  id="editBankName"
                  name="bankName"
                  value={editForm.bankName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                  autoComplete="off"
                />
              </div>
              <div>
                <label
                  htmlFor="editBranchName"
                  className="block text-sm font-medium mb-1"
                >
                  Branch Name
                </label>
                <input
                  type="text"
                  id="editBranchName"
                  name="branchName"
                  value={editForm.branchName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                  autoComplete="off"
                />
              </div>
              <div>
                <label
                  htmlFor="editAccountNumber"
                  className="block text-sm font-medium mb-1"
                >
                  Account Number
                </label>
                <input
                  type="text"
                  id="editAccountNumber"
                  name="accountNumber"
                  value={editForm.accountNumber}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                  autoComplete="off"
                />
              </div>
              <div>
                <label
                  htmlFor="editAccountHolder"
                  className="block text-sm font-medium mb-1"
                >
                  Account Holder
                </label>
                <input
                  type="text"
                  id="editAccountHolder"
                  name="accountHolder"
                  value={editForm.accountHolder}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                  autoComplete="off"
                />
              </div>
              <div>
                <label
                  htmlFor="editIfscCode"
                  className="block text-sm font-medium mb-1"
                >
                  IFSC Code
                </label>
                <input
                  type="text"
                  id="editIfscCode"
                  name="ifscCode"
                  value={editForm.ifscCode}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                  autoComplete="off"
                />
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
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
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
}