import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const accountTypes = ["Savings", "Current"];
const statuses = ["Active", "Inactive"];

export default function BankAccounts() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Form state for Add Section
  const initialFormState = {
    bankName: "",
    branchName: "",
    accountNumber: "",
    accountHolder: "",
    accountType: "Savings",
    openingBalance: "",
    currentBalance: "",
    status: "Active",
  };
  const [form, setForm] = useState(initialFormState);

  // Data state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(initialFormState);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("BankAccounts");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  // Handlers for Add Section form inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "openingBalance" || name === "currentBalance"
          ? value.replace(/\D/g, "")
          : value,
    }));
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]:
        name === "openingBalance" || name === "currentBalance"
          ? value.replace(/\D/g, "")
          : value,
    }));
  };

  // Save handler for Add Section (Add new account)
  const handleSave = () => {
    // Validate required fields (basic)
    if (
      !form.bankName.trim() ||
      !form.branchName.trim() ||
      !form.accountNumber.trim() ||
      !form.accountHolder.trim() ||
      !form.openingBalance.trim() ||
      !form.currentBalance.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const newAccount = {
      id: data.length ? data[data.length - 1].id + 1 : 1,
      bankName: form.bankName,
      branchName: form.branchName,
      accountNumber: form.accountNumber,
      accountHolder: form.accountHolder,
      accountType: form.accountType,
      openingBalance: Number(form.openingBalance),
      currentBalance: Number(form.currentBalance),
      status: form.status,
    };
    setData((prev) => [...prev, newAccount]);
    // If last page was full, move to new last page
    if ((data.length + 1) > itemsPerPage * Math.ceil(data.length / itemsPerPage)) {
      setCurrentPage(Math.ceil((data.length + 1) / itemsPerPage));
    }
    setForm(initialFormState);
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
        accountType: item.accountType,
        openingBalance: item.openingBalance.toString(),
        currentBalance: item.currentBalance.toString(),
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
      !editForm.openingBalance.trim() ||
      !editForm.currentBalance.trim()
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
              bankName: editForm.bankName,
              branchName: editForm.branchName,
              accountNumber: editForm.accountNumber,
              accountHolder: editForm.accountHolder,
              accountType: editForm.accountType,
              openingBalance: Number(editForm.openingBalance),
              currentBalance: Number(editForm.currentBalance),
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
    if (window.confirm("Are you sure you want to delete this account?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      // Adjust page if needed
      if (
        currentPage > 1 &&
        (data.length - 1) <= itemsPerPage * (currentPage - 1)
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setForm(initialFormState);
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
    <div className="min-h-screen bg-background font-sans p-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Bank Accounts</h1>

      {/* Form Section (Add Section) - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bank Name */}
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
              value={form.bankName}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter bank name"
            />
          </div>

          {/* Branch Name */}
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
              value={form.branchName}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter branch name"
            />
          </div>

          {/* Account Number */}
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
              value={form.accountNumber}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter account number"
            />
          </div>

          {/* Account Holder */}
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
              value={form.accountHolder}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter account holder"
            />
          </div>

          {/* Account Type */}
          <div>
            <label
              htmlFor="accountType"
              className="block text-sm font-medium mb-1"
            >
              Account Type
            </label>
            <select
              id="accountType"
              name="accountType"
              value={form.accountType}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {accountTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Opening Balance */}
          <div>
            <label
              htmlFor="openingBalance"
              className="block text-sm font-medium mb-1"
            >
              Opening Balance
            </label>
            <input
              type="text"
              id="openingBalance"
              name="openingBalance"
              value={form.openingBalance}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter opening balance"
            />
          </div>

          {/* Current Balance */}
          <div>
            <label
              htmlFor="currentBalance"
              className="block text-sm font-medium mb-1"
            >
              Current Balance
            </label>
            <input
              type="text"
              id="currentBalance"
              name="currentBalance"
              value={form.currentBalance}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter current balance"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleInputChange}
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

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
          </button>

          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
          </button>

          <button
            onClick={handleReport}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
          </button>
        </div>
      </section>

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  #
                </th>
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
                  Account Type
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Opening Balance
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Current Balance
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
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
                    colSpan={9}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No bank accounts found.
                  </td>
                </tr>
              )}
              {paginatedData.map((item, idx) => (
                <tr
                  key={item.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
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
                    {item.accountType}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-foreground">
                    ₹{item.openingBalance.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-foreground">
                    ₹{item.currentBalance.toLocaleString()}
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
                      aria-label={`Edit account ${item.bankName}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete account ${item.bankName}`}
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
              Edit Bank Account
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bank Name */}
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
                  placeholder="Enter bank name"
                />
              </div>

              {/* Branch Name */}
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
                  placeholder="Enter branch name"
                />
              </div>

              {/* Account Number */}
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
                  placeholder="Enter account number"
                />
              </div>

              {/* Account Holder */}
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
                  placeholder="Enter account holder"
                />
              </div>

              {/* Account Type */}
              <div>
                <label
                  htmlFor="editAccountType"
                  className="block text-sm font-medium mb-1"
                >
                  Account Type
                </label>
                <select
                  id="editAccountType"
                  name="accountType"
                  value={editForm.accountType}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {accountTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Opening Balance */}
              <div>
                <label
                  htmlFor="editOpeningBalance"
                  className="block text-sm font-medium mb-1"
                >
                  Opening Balance
                </label>
                <input
                  type="text"
                  id="editOpeningBalance"
                  name="openingBalance"
                  value={editForm.openingBalance}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter opening balance"
                />
              </div>

              {/* Current Balance */}
              <div>
                <label
                  htmlFor="editCurrentBalance"
                  className="block text-sm font-medium mb-1"
                >
                  Current Balance
                </label>
                <input
                  type="text"
                  id="editCurrentBalance"
                  name="currentBalance"
                  value={editForm.currentBalance}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter current balance"
                />
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
}