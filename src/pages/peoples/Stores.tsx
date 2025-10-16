import React, { useState, useEffect, ChangeEvent } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

type Store = {
  id: number;
  storeName: string;
  storeCode: string;
  storeType: string;
  storeLocation: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  status: "Active" | "Inactive";
};

const STORE_TYPES = ["Retail", "Wholesale"];
const STATUS_OPTIONS = ["Active", "Inactive"];

export default function Stores() {
  const [data, setData] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<Store[]>("Stores");
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

  // State for stores list synced with data
  const [stores, setStores] = useState<Store[]>([]);
  useEffect(() => {
    setStores(data);
  }, [data]);

  // State for form inputs (Add Section)
  const [form, setForm] = useState<Omit<Store, "id">>({
    storeName: "",
    storeCode: "",
    storeType: STORE_TYPES[0],
    storeLocation: "",
    contactPerson: "",
    contactNumber: "",
    email: "",
    status: "Active",
  });

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Omit<Store, "id">>({
    storeName: "",
    storeCode: "",
    storeType: STORE_TYPES[0],
    storeLocation: "",
    contactPerson: "",
    contactNumber: "",
    email: "",
    status: "Active",
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Handlers for Add Section form inputs
  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  // Handlers for Edit Modal form inputs
  function handleEditInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setEditForm((f) => ({ ...f, [name]: value }));
  }

  // Save handler for Add Section (Add new store)
  function handleSave() {
    // Validate required fields
    if (
      !form.storeName.trim() ||
      !form.storeCode.trim() ||
      !form.storeLocation.trim() ||
      !form.contactPerson.trim() ||
      !form.contactNumber.trim() ||
      !form.email.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
    const newId = stores.length ? Math.max(...stores.map((s) => s.id)) + 1 : 1;
    setStores((prev) => [
      ...prev,
      {
        id: newId,
        storeName: form.storeName.trim(),
        storeCode: form.storeCode.trim(),
        storeType: form.storeType,
        storeLocation: form.storeLocation.trim(),
        contactPerson: form.contactPerson.trim(),
        contactNumber: form.contactNumber.trim(),
        email: form.email.trim(),
        status: form.status,
      },
    ]);
    setForm({
      storeName: "",
      storeCode: "",
      storeType: STORE_TYPES[0],
      storeLocation: "",
      contactPerson: "",
      contactNumber: "",
      email: "",
      status: "Active",
    });
  }

  // Open edit modal and populate edit form
  function handleEdit(id: number) {
    const store = stores.find((s) => s.id === id);
    if (!store) return;
    setEditForm({
      storeName: store.storeName,
      storeCode: store.storeCode,
      storeType: store.storeType,
      storeLocation: store.storeLocation,
      contactPerson: store.contactPerson,
      contactNumber: store.contactNumber,
      email: store.email,
      status: store.status,
    });
    setEditId(id);
    setIsEditModalOpen(true);
  }

  // Save handler for Edit Modal
  function handleEditSave() {
    if (
      !editForm.storeName.trim() ||
      !editForm.storeCode.trim() ||
      !editForm.storeLocation.trim() ||
      !editForm.contactPerson.trim() ||
      !editForm.contactNumber.trim() ||
      !editForm.email.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      setStores((prev) =>
        prev.map((s) =>
          s.id === editId
            ? {
                id: s.id,
                storeName: editForm.storeName.trim(),
                storeCode: editForm.storeCode.trim(),
                storeType: editForm.storeType,
                storeLocation: editForm.storeLocation.trim(),
                contactPerson: editForm.contactPerson.trim(),
                contactNumber: editForm.contactNumber.trim(),
                email: editForm.email.trim(),
                status: editForm.status,
              }
            : s
        )
      );
      setEditId(null);
      setIsEditModalOpen(false);
    }
  }

  // Cancel editing modal
  function handleEditCancel() {
    setEditId(null);
    setIsEditModalOpen(false);
  }

  // Handle Delete button click
  function handleDelete(id: number) {
    if (
      window.confirm(
        "Are you sure you want to delete this store? This action cannot be undone."
      )
    ) {
      setStores((prev) => prev.filter((s) => s.id !== id));
      // Adjust current page if needed
      if (
        (stores.length - 1) <= (currentPage - 1) * itemsPerPage &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  }

  // Clear button handler (replaces Refresh)
  function handleClear() {
    setForm({
      storeName: "",
      storeCode: "",
      storeType: STORE_TYPES[0],
      storeLocation: "",
      contactPerson: "",
      contactNumber: "",
      email: "",
      status: "Active",
    });
    setEditId(null);
    setCurrentPage(1);
  }

  // Handle Report button (simulate report generation)
  function handleReport() {
    alert("Report generation is not implemented in this demo.");
  }

  // Calculate paginated data using Pagination component props
  const paginatedStores = stores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Title */}
      <h1 className="text-lg font-semibold mb-6">Stores</h1>

      {/* Form Section (Add Section) - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Store Name */}
          <div>
            <label
              htmlFor="storeName"
              className="block text-sm font-medium mb-1"
            >
              Store Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="storeName"
              name="storeName"
              value={form.storeName}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter store name"
            />
          </div>

          {/* Store Code */}
          <div>
            <label
              htmlFor="storeCode"
              className="block text-sm font-medium mb-1"
            >
              Store Code <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="storeCode"
              name="storeCode"
              value={form.storeCode}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter store code"
            />
          </div>

          {/* Store Type */}
          <div>
            <label
              htmlFor="storeType"
              className="block text-sm font-medium mb-1"
            >
              Store Type <span className="text-red-600">*</span>
            </label>
            <select
              id="storeType"
              name="storeType"
              value={form.storeType}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {STORE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Store Location */}
          <div>
            <label
              htmlFor="storeLocation"
              className="block text-sm font-medium mb-1"
            >
              Store Location <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="storeLocation"
              name="storeLocation"
              value={form.storeLocation}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter store location"
            />
          </div>

          {/* Contact Person */}
          <div>
            <label
              htmlFor="contactPerson"
              className="block text-sm font-medium mb-1"
            >
              Contact Person <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              value={form.contactPerson}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter contact person"
            />
          </div>

          {/* Contact Number */}
          <div>
            <label
              htmlFor="contactNumber"
              className="block text-sm font-medium mb-1"
            >
              Contact Number <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleInputChange}
              pattern="[\d\s\-\+\(\)]{7,}"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter contact number"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1"
            >
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter email address"
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium mb-1"
            >
              Status <span className="text-red-600">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {STATUS_OPTIONS.map((status) => (
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
                  Store Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Store Code
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Store Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Contact Person
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Contact Number
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Email
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
              {paginatedStores.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No stores found.
                  </td>
                </tr>
              )}
              {paginatedStores.map((store, idx) => (
                <tr
                  key={store.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {store.storeName}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {store.storeCode}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {store.storeType}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {store.storeLocation}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {store.contactPerson}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {store.contactNumber}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {store.email}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        store.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {store.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(store.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit store ${store.storeName}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(store.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete store ${store.storeName}`}
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
          totalItems={stores.length}
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
              Edit Store
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Store Name */}
              <div>
                <label
                  htmlFor="editStoreName"
                  className="block text-sm font-medium mb-1"
                >
                  Store Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="editStoreName"
                  name="storeName"
                  value={editForm.storeName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter store name"
                />
              </div>

              {/* Store Code */}
              <div>
                <label
                  htmlFor="editStoreCode"
                  className="block text-sm font-medium mb-1"
                >
                  Store Code <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="editStoreCode"
                  name="storeCode"
                  value={editForm.storeCode}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter store code"
                />
              </div>

              {/* Store Type */}
              <div>
                <label
                  htmlFor="editStoreType"
                  className="block text-sm font-medium mb-1"
                >
                  Store Type <span className="text-red-600">*</span>
                </label>
                <select
                  id="editStoreType"
                  name="storeType"
                  value={editForm.storeType}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {STORE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Store Location */}
              <div>
                <label
                  htmlFor="editStoreLocation"
                  className="block text-sm font-medium mb-1"
                >
                  Store Location <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="editStoreLocation"
                  name="storeLocation"
                  value={editForm.storeLocation}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter store location"
                />
              </div>

              {/* Contact Person */}
              <div>
                <label
                  htmlFor="editContactPerson"
                  className="block text-sm font-medium mb-1"
                >
                  Contact Person <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="editContactPerson"
                  name="contactPerson"
                  value={editForm.contactPerson}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter contact person"
                />
              </div>

              {/* Contact Number */}
              <div>
                <label
                  htmlFor="editContactNumber"
                  className="block text-sm font-medium mb-1"
                >
                  Contact Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  id="editContactNumber"
                  name="contactNumber"
                  value={editForm.contactNumber}
                  onChange={handleEditInputChange}
                  pattern="[\d\s\-\+\(\)]{7,}"
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter contact number"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="editEmail"
                  className="block text-sm font-medium mb-1"
                >
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="editEmail"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter email address"
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="editStatus"
                  className="block text-sm font-medium mb-1"
                >
                  Status <span className="text-red-600">*</span>
                </label>
                <select
                  id="editStatus"
                  name="status"
                  value={editForm.status}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {STATUS_OPTIONS.map((status) => (
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