import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const pageSizeOptions = [5, 10, 20];

export default function Signatures() {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState({
    customerName: "",
    customerId: "",
    signatureDate: "",
    signatureStatus: "Active",
    remarks: "",
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    customerName: "",
    customerId: "",
    signatureDate: "",
    signatureStatus: "Active",
    remarks: "",
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Signatures");
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

  // Filtered and paginated data
  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        item.customerName.toLowerCase().includes(search.toLowerCase()) ||
        item.customerId.toLowerCase().includes(search.toLowerCase()) ||
        item.signatureStatus.toLowerCase().includes(search.toLowerCase()) ||
        item.remarks.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  const pageCount = Math.ceil(filteredData.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setEditForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = () => {
    if (!form.customerName || !form.customerId || !form.signatureDate) {
      alert("Please fill in all required fields.");
      return;
    }
    if (editId !== null) {
      // Edit existing
      setData((d) =>
        d.map((item) =>
          item.id === editId
            ? {
                ...item,
                ...form,
              }
            : item
        )
      );
      setEditId(null);
    } else {
      // Add new
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((d) => [...d, { id: newId, ...form }]);
    }
    setForm({
      customerName: "",
      customerId: "",
      signatureDate: "",
      signatureStatus: "Active",
      remarks: "",
    });
  };

  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        customerName: item.customerName,
        customerId: item.customerId,
        signatureDate: item.signatureDate,
        signatureStatus: item.signatureStatus,
        remarks: item.remarks,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  const handleEditSave = () => {
    if (
      !editForm.customerName ||
      !editForm.customerId ||
      !editForm.signatureDate
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    if (editId !== null) {
      setData((d) =>
        d.map((item) =>
          item.id === editId
            ? {
                ...item,
                ...editForm,
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

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this signature?")) {
      setData((d) => d.filter((item) => item.id !== id));
      if (editId === id) {
        setEditId(null);
        setForm({
          customerName: "",
          customerId: "",
          signatureDate: "",
          signatureStatus: "Active",
          remarks: "",
        });
      }
    }
  };

  const handleClear = () => {
    setForm({
      customerName: "",
      customerId: "",
      signatureDate: "",
      signatureStatus: "Active",
      remarks: "",
    });
    setEditId(null);
    setCurrentPage(1);
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-lg font-semibold mb-6">Signatures</h1>

      {/* Form Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Customer Name */}
          <div>
            <label
              htmlFor="customerName"
              className="block text-sm font-medium mb-1"
            >
              Customer Name
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={form.customerName}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter customer name"
            />
          </div>

          {/* Customer ID */}
          <div>
            <label
              htmlFor="customerId"
              className="block text-sm font-medium mb-1"
            >
              Customer ID
            </label>
            <input
              type="text"
              id="customerId"
              name="customerId"
              value={form.customerId}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter customer ID"
            />
          </div>

          {/* Signature Date */}
          <div>
            <label
              htmlFor="signatureDate"
              className="block text-sm font-medium mb-1"
            >
              Signature Date
            </label>
            <input
              type="date"
              id="signatureDate"
              name="signatureDate"
              value={form.signatureDate}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Signature Status */}
          <div>
            <label
              htmlFor="signatureStatus"
              className="block text-sm font-medium mb-1"
            >
              Signature Status
            </label>
            <select
              id="signatureStatus"
              name="signatureStatus"
              value={form.signatureStatus}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          {/* Remarks */}
          <div className="md:col-span-2">
            <label
              htmlFor="remarks"
              className="block text-sm font-medium mb-1"
            >
              Remarks
            </label>
            <textarea
              id="remarks"
              name="remarks"
              value={form.remarks}
              onChange={handleInputChange}
              rows={2}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter remarks"
            />
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
        </div>
      </section>

      {/* Search and Actions */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-3 md:space-y-0">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search signatures..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded border border-input px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={handleClear}
            title="Clear Data"
            className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded flex items-center"
          >
            <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
          </button>
          <button
            onClick={() => alert("Report generation not implemented")}
            title="Generate Report"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded flex items-center"
          >
            <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <label
            htmlFor="pageSize"
            className="font-medium text-sm"
          >
            Rows per page:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Customer Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Customer ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Signature Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Remarks
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
                    colSpan={6}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No signatures found.
                  </td>
                </tr>
              )}
              {paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.customerName}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.customerId}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.signatureDate}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${item.signatureStatus === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                    >
                      {item.signatureStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.remarks}
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit signature ${item.customerName}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete signature ${item.customerName}`}
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
          itemsPerPage={pageSize}
          totalItems={filteredData.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
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
              Edit Signature
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Customer Name */}
              <div>
                <label
                  htmlFor="editCustomerName"
                  className="block text-sm font-medium mb-1"
                >
                  Customer Name
                </label>
                <input
                  type="text"
                  id="editCustomerName"
                  name="customerName"
                  value={editForm.customerName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter customer name"
                />
              </div>

              {/* Customer ID */}
              <div>
                <label
                  htmlFor="editCustomerId"
                  className="block text-sm font-medium mb-1"
                >
                  Customer ID
                </label>
                <input
                  type="text"
                  id="editCustomerId"
                  name="customerId"
                  value={editForm.customerId}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter customer ID"
                />
              </div>

              {/* Signature Date */}
              <div>
                <label
                  htmlFor="editSignatureDate"
                  className="block text-sm font-medium mb-1"
                >
                  Signature Date
                </label>
                <input
                  type="date"
                  id="editSignatureDate"
                  name="signatureDate"
                  value={editForm.signatureDate}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Signature Status */}
              <div>
                <label
                  htmlFor="editSignatureStatus"
                  className="block text-sm font-medium mb-1"
                >
                  Signature Status
                </label>
                <select
                  id="editSignatureStatus"
                  name="signatureStatus"
                  value={editForm.signatureStatus}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              {/* Remarks */}
              <div className="md:col-span-2">
                <label
                  htmlFor="editRemarks"
                  className="block text-sm font-medium mb-1"
                >
                  Remarks
                </label>
                <textarea
                  id="editRemarks"
                  name="remarks"
                  value={editForm.remarks}
                  onChange={handleEditInputChange}
                  rows={2}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter remarks"
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
  );
}