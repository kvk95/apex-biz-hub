import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const statusOptions = ["Active", "Inactive"];

export default function CustomerReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    totalPurchase: "",
    lastPurchaseDate: "",
    status: statusOptions[0],
  });
  const [editId, setEditId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("CustomerReport");
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

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        name: item.name,
        email: item.email,
        phone: item.phone,
        totalPurchase: item.totalPurchase.toString(),
        lastPurchaseDate: item.lastPurchaseDate,
        status: item.status,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (
      !editForm.name.trim() ||
      !editForm.email.trim() ||
      !editForm.phone.trim() ||
      !editForm.totalPurchase ||
      !editForm.lastPurchaseDate
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
                name: editForm.name.trim(),
                email: editForm.email.trim(),
                phone: editForm.phone.trim(),
                totalPurchase: Number(editForm.totalPurchase),
                lastPurchaseDate: editForm.lastPurchaseDate,
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
    if (window.confirm("Are you sure you want to delete this customer?")) {
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

  // Filtered and paginated data
  const filteredData = useMemo(() => {
    return data.filter((c: any) => {
      return (
        c.name.toLowerCase().includes(searchName.toLowerCase()) &&
        c.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
        c.phone.toLowerCase().includes(searchPhone.toLowerCase()) &&
        (filterStatus === "" || c.status === filterStatus)
      );
    });
  }, [data, searchName, searchEmail, searchPhone, filterStatus]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Handlers
  const handleReset = () => {
    setSearchName("");
    setSearchEmail("");
    setSearchPhone("");
    setFilterStatus("");
    setCurrentPage(1);
    setItemsPerPage(10);
  };

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6">Customer Report</h1>

      {/* Filters Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filter Customers</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          className="grid grid-cols-1 md:grid-cols-5 gap-4"
        >
          {/* Name */}
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-1 font-medium text-muted-foreground">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter name"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter email"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label htmlFor="phone" className="mb-1 font-medium text-muted-foreground">
              Phone
            </label>
            <input
              id="phone"
              type="text"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              className="border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter phone"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label htmlFor="status" className="mb-1 font-medium text-muted-foreground">
              Status
            </label>
            <select
              id="status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-end space-x-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-search fa-light" aria-hidden="true"></i> Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="flex justify-between items-center mb-4 px-6">
          <h2 className="text-lg font-semibold">Customer List</h2>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Total Purchase</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Last Purchase Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center px-4 py-6 text-muted-foreground italic">
                    No customers found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((customer: any, idx) => (
                  <tr
                    key={customer.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">{customer.name}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{customer.email}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{customer.phone}</td>
                    <td className="px-4 py-3 text-sm text-foreground">${customer.totalPurchase.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{customer.lastPurchaseDate}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          customer.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm space-x-3">
                      <button
                        onClick={() => handleEdit(customer.id)}
                        className="text-primary hover:text-primary/80 transition-colors"
                        aria-label={`Edit customer ${customer.name}`}
                        type="button"
                      >
                        <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                        aria-label={`Delete customer ${customer.name}`}
                        type="button"
                      >
                        <i className="fa fa-trash fa-light" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredData.length}
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
              Edit Customer
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
                  placeholder="Enter email"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="editPhone"
                  className="block text-sm font-medium mb-1"
                >
                  Phone
                </label>
                <input
                  type="text"
                  id="editPhone"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter phone"
                />
              </div>

              {/* Total Purchase */}
              <div>
                <label
                  htmlFor="editTotalPurchase"
                  className="block text-sm font-medium mb-1"
                >
                  Total Purchase
                </label>
                <input
                  type="number"
                  id="editTotalPurchase"
                  name="totalPurchase"
                  value={editForm.totalPurchase}
                  onChange={handleEditInputChange}
                  min={0}
                  step="0.01"
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter total purchase"
                />
              </div>

              {/* Last Purchase Date */}
              <div>
                <label
                  htmlFor="editLastPurchaseDate"
                  className="block text-sm font-medium mb-1"
                >
                  Last Purchase Date
                </label>
                <input
                  type="date"
                  id="editLastPurchaseDate"
                  name="lastPurchaseDate"
                  value={editForm.lastPurchaseDate}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                  {statusOptions.map((status) => (
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