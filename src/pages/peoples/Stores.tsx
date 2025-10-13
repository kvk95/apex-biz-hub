import React, { useState, useEffect, ChangeEvent } from "react";
import { apiService } from "@/services/ApiService";

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

const PAGE_SIZE = 5;

export default function Stores() {
  // Page title as in reference page
  useEffect(() => {
    document.title = "Stores - Dreams POS";
  }, []);

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

  // State for the store list and pagination
  const [stores, setStores] = useState<Store[]>(data);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync stores state with data loaded from API
  useEffect(() => {
    setStores(data);
  }, [data]);

  // State for form inputs (Add/Edit store)
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

  // State for edit mode and selected store id
  const [editId, setEditId] = useState<number | null>(null);

  // Pagination calculations
  const totalPages = Math.ceil(stores.length / PAGE_SIZE);
  const paginatedStores = stores.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Handlers for form input changes
  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  // Handle Save (Add or Edit)
  function handleSave() {
    if (editId !== null) {
      // Edit existing store
      setStores((prev) =>
        prev.map((s) => (s.id === editId ? { id: s.id, ...form } : s))
      );
    } else {
      // Add new store
      const newId = stores.length ? Math.max(...stores.map((s) => s.id)) + 1 : 1;
      setStores((prev) => [...prev, { id: newId, ...form }]);
      // After adding, if last page is incomplete, stay, else go to last page
      if ((stores.length + 1) > totalPages * PAGE_SIZE) {
        setCurrentPage(totalPages + 1);
      }
    }
    resetForm();
  }

  // Reset form and edit mode
  function resetForm() {
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
  }

  // Handle Edit button click
  function handleEdit(id: number) {
    const store = stores.find((s) => s.id === id);
    if (!store) return;
    setForm({
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        (stores.length - 1) <= (currentPage - 1) * PAGE_SIZE &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  }

  // Handle Refresh button (reset form and reload data)
  function handleRefresh() {
    resetForm();
    loadData();
    setCurrentPage(1);
  }

  // Handle Report button (simulate report generation)
  function handleReport() {
    alert("Report generation is not implemented in this demo.");
  }

  // Pagination controls
  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900">
      {/* Title */}
      <h1 className="text-3xl font-semibold mb-6">Stores</h1>

      {/* Store Form Section */}
      <section className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editId !== null ? "Edit Store" : "Add New Store"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-6"
          noValidate
        >
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
                required
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                required
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                required
                className="w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                required
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                required
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                required
                pattern="[\d\s\-\+\(\)]{7,}"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                required
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                required
                className="w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {editId !== null ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="ml-auto px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Report
            </button>
          </div>
        </form>
      </section>

      {/* Stores Table Section */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Stores List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                  Store Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                  Store Code
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                  Store Type
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                  Location
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                  Contact Person
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                  Contact Number
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                  Status
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedStores.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-4 text-gray-500 italic"
                  >
                    No stores found.
                  </td>
                </tr>
              )}
              {paginatedStores.map((store) => (
                <tr key={store.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300">
                    {store.storeName}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300">
                    {store.storeCode}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300">
                    {store.storeType}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300">
                    {store.storeLocation}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300">
                    {store.contactPerson}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300">
                    {store.contactNumber}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300">
                    {store.email}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        store.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {store.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center space-x-2">
                    <button
                      onClick={() => handleEdit(store.id)}
                      aria-label={`Edit store ${store.storeName}`}
                      className="text-blue-600 hover:text-blue-800 focus:outline-none"
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(store.id)}
                      aria-label={`Delete store ${store.storeName}`}
                      className="text-red-600 hover:text-red-800 focus:outline-none"
                      type="button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <nav
          className="flex justify-between items-center mt-6"
          aria-label="Pagination"
        >
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Previous page"
          >
            Previous
          </button>

          <ul className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page}>
                <button
                  onClick={() => goToPage(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`px-3 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Next page"
          >
            Next
          </button>
        </nav>
      </section>
    </div>
  );
}