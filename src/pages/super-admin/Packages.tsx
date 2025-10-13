import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const pageSizeOptions = [5, 10, 15];

const Packages: React.FC = () => {
  // Page title as per reference page
  React.useEffect(() => {
    document.title = "Packages - Dreams POS";
  }, []);

  // Form state for add/edit package
  const [form, setForm] = useState({
    packageName: "",
    price: "",
    duration: "",
    description: "",
    status: "Active",
  });

  // Mode: 'add' or 'edit'
  const [mode, setMode] = useState<"add" | "edit">("add");

  // Editing package id
  const [editId, setEditId] = useState<number | null>(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Packages");
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
  const [pageSize, setPageSize] = useState(5);

  // Filtered and paginated data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  const totalPages = Math.ceil(data.length / pageSize);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      packageName: "",
      price: "",
      duration: "",
      description: "",
      status: "Active",
    });
    setEditId(null);
    setMode("add");
  };

  const handleSave = () => {
    if (
      !form.packageName.trim() ||
      !form.price.trim() ||
      !form.duration.trim() ||
      !form.description.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }
    if (mode === "add") {
      const newPackage = {
        id: data.length ? Math.max(...data.map((d: any) => d.id)) + 1 : 1,
        ...form,
      };
      setData((d: any) => [...d, newPackage]);
      resetForm();
      setCurrentPage(totalPages); // Go to last page where new item is added
    } else if (mode === "edit" && editId !== null) {
      setData((d: any) =>
        d.map((item: any) => (item.id === editId ? { id: editId, ...form } : item))
      );
      resetForm();
    }
  };

  const handleEdit = (id: number) => {
    const pkg = data.find((d: any) => d.id === id);
    if (pkg) {
      setForm({
        packageName: pkg.packageName,
        price: pkg.price,
        duration: pkg.duration,
        description: pkg.description,
        status: pkg.status,
      });
      setEditId(id);
      setMode("edit");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      setData((d: any) => d.filter((item: any) => item.id !== id));
      if (paginatedData.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      }
      if (editId === id) {
        resetForm();
      }
    }
  };

  const handleRefresh = () => {
    loadData();
    resetForm();
    setCurrentPage(1);
    setPageSize(5);
  };

  const handleReport = () => {
    // For demo, just alert. In real app, would generate report.
    alert("Report generated for packages.");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-800">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">Packages</h1>

      {/* Package Form Section */}
      <section className="bg-white rounded shadow p-6 mb-8 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          {mode === "add" ? "Add Package" : "Edit Package"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-6"
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Package Name */}
            <div>
              <label
                htmlFor="packageName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Package Name
              </label>
              <input
                type="text"
                id="packageName"
                name="packageName"
                value={form.packageName}
                onChange={handleInputChange}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter package name"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price
              </label>
              <input
                type="text"
                id="price"
                name="price"
                value={form.price}
                onChange={handleInputChange}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="₹ 0"
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Duration
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={form.duration}
                onChange={handleInputChange}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g. 1 Month"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleInputChange}
                className="block w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              rows={3}
              className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter package description"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <i className="fas fa-save mr-2" aria-hidden="true"></i>
              {mode === "add" ? "Save" : "Update"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <i className="fas fa-times mr-2" aria-hidden="true"></i>
              Cancel
            </button>
          </div>
        </form>
      </section>

      {/* Packages Table Section */}
      <section className="bg-white rounded shadow p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Packages List</h2>
          <div className="flex space-x-3">
            <button
              onClick={handleReport}
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-green-500"
              title="Generate Report"
              type="button"
            >
              <i className="fas fa-file-alt mr-2" aria-hidden="true"></i>Report
            </button>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-400"
              title="Refresh Data"
              type="button"
            >
              <i className="fas fa-sync-alt mr-2" aria-hidden="true"></i>Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Package Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Duration
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="relative px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                  >
                    No packages found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((pkg: any, idx: number) => (
                  <tr key={pkg.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {pkg.packageName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {pkg.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {pkg.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate">
                      {pkg.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          pkg.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {pkg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(pkg.id)}
                        className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                        title="Edit"
                        type="button"
                      >
                        <i className="fas fa-edit" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="text-red-600 hover:text-red-900 focus:outline-none"
                        title="Delete"
                        type="button"
                      >
                        <i className="fas fa-trash-alt" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-3 md:space-y-0">
          {/* Page size selector */}
          <div className="flex items-center space-x-2">
            <label
              htmlFor="pageSize"
              className="text-sm font-medium text-gray-700"
            >
              Show
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>

          {/* Pagination buttons */}
          <nav
            className="inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                currentPage === 1
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
              aria-label="First"
              type="button"
            >
              <i className="fas fa-angle-double-left" aria-hidden="true"></i>
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                currentPage === 1
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
              aria-label="Previous"
              type="button"
            >
              <i className="fas fa-angle-left" aria-hidden="true"></i>
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                aria-current={currentPage === page ? "page" : undefined}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  currentPage === page
                    ? "z-10 bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
                type="button"
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                currentPage === totalPages
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
              aria-label="Next"
              type="button"
            >
              <i className="fas fa-angle-right" aria-hidden="true"></i>
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                currentPage === totalPages
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
              aria-label="Last"
              type="button"
            >
              <i className="fas fa-angle-double-right" aria-hidden="true"></i>
            </button>
          </nav>
        </div>
      </section>
    </div>
  );
};

export default Packages;