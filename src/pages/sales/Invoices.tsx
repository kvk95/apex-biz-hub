import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const pageSizeOptions = [5, 10, 15];

const statusColors: Record<string, string> = {
  Paid: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Overdue: "bg-red-100 text-red-800",
};

export default function Invoices() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    invoiceNo: "",
    customer: "",
    date: "",
    dueDate: "",
    amount: "",
    status: "Paid",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Invoices");
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

  // Filter and search invoices
  const filteredInvoices = useMemo(() => {
    return data.filter((inv: any) => {
      const matchesSearch =
        inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "All" ? true : inv.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus, data]);

  // Paginated invoices using Pagination component props
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInvoices.slice(start, start + itemsPerPage);
  }, [currentPage, itemsPerPage, filteredInvoices]);

  // Handlers
  const handlePageChange = (page: number) => {
    if (page < 1 || page > Math.ceil(filteredInvoices.length / itemsPerPage)) return;
    setCurrentPage(page);
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilterStatus("All");
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generation is not implemented in this demo.");
  };

  // Edit modal handlers
  const handleEdit = (id: number) => {
    const item = data.find((d: any) => d.id === id);
    if (item) {
      setEditForm({
        invoiceNo: item.invoiceNo,
        customer: item.customer,
        date: item.date,
        dueDate: item.dueDate,
        amount: item.amount.toString(),
        status: item.status,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    if (
      !editForm.invoiceNo.trim() ||
      !editForm.customer.trim() ||
      !editForm.date ||
      !editForm.dueDate ||
      !editForm.amount ||
      !editForm.status
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      setData((prev) =>
        prev.map((item: any) =>
          item.id === editId
            ? {
                ...item,
                invoiceNo: editForm.invoiceNo.trim(),
                customer: editForm.customer.trim(),
                date: editForm.date,
                dueDate: editForm.dueDate,
                amount: Number(editForm.amount),
                status: editForm.status,
              }
            : item
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

  return (
    <div className="min-h-screen bg-background font-sans p-6 text-foreground">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Invoices</h1>

      {/* Controls Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <input
            type="text"
            placeholder="Search by Invoice No or Customer"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Search invoices"
          />
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Filter by status"
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Select page size"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Clear filters"
            type="button"
          >
            <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
          </button>
          <button
            onClick={handleReport}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Generate report"
            type="button"
          >
            <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
          </button>
        </div>
      </div>

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Invoice No
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Due Date
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Amount
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No invoices found.
                  </td>
                </tr>
              )}
              {paginatedInvoices.map((inv: any, idx) => (
                <tr
                  key={inv.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">{inv.invoiceNo}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{inv.customer}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{inv.date}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{inv.dueDate}</td>
                  <td className="px-4 py-3 text-sm text-foreground text-right">
                    ${inv.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground text-center">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        inv.status === "Paid"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : inv.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(inv.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit invoice ${inv.invoiceNo}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() =>
                        alert(`Delete functionality for ${inv.invoiceNo} not implemented.`)
                      }
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete invoice ${inv.invoiceNo}`}
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
          totalItems={filteredInvoices.length}
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
              Edit Invoice
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Invoice No */}
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
                  placeholder="Enter invoice number"
                />
              </div>

              {/* Customer */}
              <div>
                <label
                  htmlFor="editCustomer"
                  className="block text-sm font-medium mb-1"
                >
                  Customer
                </label>
                <input
                  type="text"
                  id="editCustomer"
                  name="customer"
                  value={editForm.customer}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter customer name"
                />
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="editDate"
                  className="block text-sm font-medium mb-1"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="editDate"
                  name="date"
                  value={editForm.date}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Due Date */}
              <div>
                <label
                  htmlFor="editDueDate"
                  className="block text-sm font-medium mb-1"
                >
                  Due Date
                </label>
                <input
                  type="date"
                  id="editDueDate"
                  name="dueDate"
                  value={editForm.dueDate}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Amount */}
              <div>
                <label
                  htmlFor="editAmount"
                  className="block text-sm font-medium mb-1"
                >
                  Amount
                </label>
                <input
                  type="number"
                  id="editAmount"
                  name="amount"
                  value={editForm.amount}
                  onChange={handleEditInputChange}
                  min={0}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter amount"
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
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
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