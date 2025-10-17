import { apiService } from "@/services/ApiService";
import React, { useEffect, useState } from "react";
import { Pagination } from "@/components/Pagination/Pagination";

const suppliers = [
  "ABC Suppliers",
  "XYZ Traders",
  "Global Wholesale",
  "Sunrise Enterprises",
  "Metro Supplies",
  "Prime Distributors",
  "Eastern Traders",
  "Northern Wholesale",
  "Southern Supplies",
  "Western Traders",
];

const paymentMethods = ["Cash", "Cheque", "Bank Transfer", "Credit Card"];

export default function PurchaseTransaction() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("PurchaseTransaction");
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state for Add Section (preserved exactly)
  const [form, setForm] = useState({
    invoiceNo: "",
    supplierName: "",
    purchaseDate: "",
    totalAmount: "",
    paidAmount: "",
    dueAmount: "",
    paymentMethod: paymentMethods[0],
    paymentDate: "",
    paymentNote: "",
  });

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    invoiceNo: "",
    supplierName: "",
    purchaseDate: "",
    totalAmount: "",
    paidAmount: "",
    dueAmount: "",
    paymentMethod: paymentMethods[0],
    paymentDate: "",
    paymentNote: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Handlers for Add Section form inputs
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Add Section (preserved exactly)
  const handleSave = () => {
    alert("Save functionality is not implemented in this demo.");
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setForm({
      invoiceNo: "",
      supplierName: "",
      purchaseDate: "",
      totalAmount: "",
      paidAmount: "",
      dueAmount: "",
      paymentMethod: paymentMethods[0],
      paymentDate: "",
      paymentNote: "",
    });
    setEditId(null);
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report functionality is not implemented in this demo.");
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        invoiceNo: item.invoiceNo,
        supplierName: item.supplierName,
        purchaseDate: item.purchaseDate,
        totalAmount: item.totalAmount,
        paidAmount: item.paidAmount,
        dueAmount: item.dueAmount,
        paymentMethod: item.paymentMethod,
        paymentDate: item.paymentDate,
        paymentNote: item.paymentNote,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (
      !editForm.invoiceNo.trim() ||
      !editForm.supplierName.trim() ||
      !editForm.purchaseDate
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
                invoiceNo: editForm.invoiceNo.trim(),
                supplierName: editForm.supplierName,
                purchaseDate: editForm.purchaseDate,
                totalAmount: editForm.totalAmount,
                paidAmount: editForm.paidAmount,
                dueAmount: editForm.dueAmount,
                paymentMethod: editForm.paymentMethod,
                paymentDate: editForm.paymentDate,
                paymentNote: editForm.paymentNote,
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

  // Calculate paginated data using Pagination component props
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Title */}
        <h1 className="text-lg font-semibold mb-6">Purchase Transaction</h1>

        {/* Purchase Transaction Form */}
        <section className="bg-card rounded shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Purchase Details</h2>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="invoiceNo"
                className="block text-sm font-medium mb-1"
              >
                Invoice No
              </label>
              <input
                type="text"
                id="invoiceNo"
                name="invoiceNo"
                value={form.invoiceNo}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter Invoice No"
              />
            </div>
            <div>
              <label
                htmlFor="supplierName"
                className="block text-sm font-medium mb-1"
              >
                Supplier Name
              </label>
              <select
                id="supplierName"
                name="supplierName"
                value={form.supplierName}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select Supplier</option>
                {suppliers.map((sup) => (
                  <option key={sup} value={sup}>
                    {sup}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="purchaseDate"
                className="block text-sm font-medium mb-1"
              >
                Purchase Date
              </label>
              <input
                type="date"
                id="purchaseDate"
                name="purchaseDate"
                value={form.purchaseDate}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label
                htmlFor="totalAmount"
                className="block text-sm font-medium mb-1"
              >
                Total Amount
              </label>
              <input
                type="number"
                id="totalAmount"
                name="totalAmount"
                value={form.totalAmount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="0.00"
              />
            </div>
            <div>
              <label
                htmlFor="paidAmount"
                className="block text-sm font-medium mb-1"
              >
                Paid Amount
              </label>
              <input
                type="number"
                id="paidAmount"
                name="paidAmount"
                value={form.paidAmount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="0.00"
              />
            </div>
            <div>
              <label
                htmlFor="dueAmount"
                className="block text-sm font-medium mb-1"
              >
                Due Amount
              </label>
              <input
                type="number"
                id="dueAmount"
                name="dueAmount"
                value={form.dueAmount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="0.00"
              />
            </div>
            <div>
              <label
                htmlFor="paymentMethod"
                className="block text-sm font-medium mb-1"
              >
                Payment Method
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="paymentDate"
                className="block text-sm font-medium mb-1"
              >
                Payment Date
              </label>
              <input
                type="date"
                id="paymentDate"
                name="paymentDate"
                value={form.paymentDate}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="md:col-span-3">
              <label
                htmlFor="paymentNote"
                className="block text-sm font-medium mb-1"
              >
                Payment Note
              </label>
              <textarea
                id="paymentNote"
                name="paymentNote"
                value={form.paymentNote}
                onChange={handleInputChange}
                rows={3}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Enter any notes here"
              />
            </div>
          </form>

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
            </button>
          </div>
        </section>

        {/* Purchase Transactions Table */}
        <section className="bg-card rounded shadow py-6">
          <h2 className="text-xl font-semibold mb-4">Purchase Transactions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground border-r border-border">
                    Invoice No
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground border-r border-border">
                    Supplier Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground border-r border-border">
                    Purchase Date
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground border-r border-border">
                    Total Amount
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground border-r border-border">
                    Paid Amount
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground border-r border-border">
                    Due Amount
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground border-r border-border">
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
                      colSpan={8}
                      className="text-center px-4 py-6 text-muted-foreground italic"
                    >
                      No purchase transactions found.
                    </td>
                  </tr>
                )}
                {paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors text-sm text-gray-500"
                  >
                    <td className="px-4 py-2 border-r border-border">
                      {item.invoiceNo}
                    </td>
                    <td className="px-4 py-2 border-r border-border">
                      {item.supplierName}
                    </td>
                    <td className="px-4 py-2 border-r border-border">
                      {item.purchaseDate}
                    </td>
                    <td className="px-4 py-2 text-right border-r border-border">
                      ₹{item.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right border-r border-border">
                      ₹{item.paidAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right border-r border-border">
                      ₹{item.dueAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-center border-r border-border">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          item.status === "Paid"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : item.status === "Partial"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center space-x-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleEdit(item.id)}
                        aria-label={`Edit purchase ${item.invoiceNo}`}
                        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
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
                Edit Purchase Transaction
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="editInvoiceNo"
                    className="block text-sm font-medium mb-1"
                  >
                    Invoice No
                  </label>
                  <input
                    type="text"
                    id="editInvoiceNo"
                    name="invoiceNo"
                    value={editForm.invoiceNo}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter Invoice No"
                  />
                </div>
                <div>
                  <label
                    htmlFor="editSupplierName"
                    className="block text-sm font-medium mb-1"
                  >
                    Supplier Name
                  </label>
                  <select
                    id="editSupplierName"
                    name="supplierName"
                    value={editForm.supplierName}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((sup) => (
                      <option key={sup} value={sup}>
                        {sup}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="editPurchaseDate"
                    className="block text-sm font-medium mb-1"
                  >
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    id="editPurchaseDate"
                    name="purchaseDate"
                    value={editForm.purchaseDate}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label
                    htmlFor="editTotalAmount"
                    className="block text-sm font-medium mb-1"
                  >
                    Total Amount
                  </label>
                  <input
                    type="number"
                    id="editTotalAmount"
                    name="totalAmount"
                    value={editForm.totalAmount}
                    onChange={handleEditInputChange}
                    min="0"
                    step="0.01"
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label
                    htmlFor="editPaidAmount"
                    className="block text-sm font-medium mb-1"
                  >
                    Paid Amount
                  </label>
                  <input
                    type="number"
                    id="editPaidAmount"
                    name="paidAmount"
                    value={editForm.paidAmount}
                    onChange={handleEditInputChange}
                    min="0"
                    step="0.01"
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label
                    htmlFor="editDueAmount"
                    className="block text-sm font-medium mb-1"
                  >
                    Due Amount
                  </label>
                  <input
                    type="number"
                    id="editDueAmount"
                    name="dueAmount"
                    value={editForm.dueAmount}
                    onChange={handleEditInputChange}
                    min="0"
                    step="0.01"
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label
                    htmlFor="editPaymentMethod"
                    className="block text-sm font-medium mb-1"
                  >
                    Payment Method
                  </label>
                  <select
                    id="editPaymentMethod"
                    name="paymentMethod"
                    value={editForm.paymentMethod}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {paymentMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="editPaymentDate"
                    className="block text-sm font-medium mb-1"
                  >
                    Payment Date
                  </label>
                  <input
                    type="date"
                    id="editPaymentDate"
                    name="paymentDate"
                    value={editForm.paymentDate}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="md:col-span-3">
                  <label
                    htmlFor="editPaymentNote"
                    className="block text-sm font-medium mb-1"
                  >
                    Payment Note
                  </label>
                  <textarea
                    id="editPaymentNote"
                    name="paymentNote"
                    value={editForm.paymentNote}
                    onChange={handleEditInputChange}
                    rows={3}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="Enter any notes here"
                  />
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
    </>
  );
}