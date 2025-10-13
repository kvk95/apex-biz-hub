import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const storageTypes = ["Warehouse", "Store", "Cold Room"];
const statuses = ["Active", "Inactive"];

export default function StorageSettings() {
  // State variables for API data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API call logic
  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("StorageSettings");
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
  const itemsPerPage = 5;

  // Form state
  const [form, setForm] = useState({
    storageName: "",
    storageCode: "",
    storageType: storageTypes[0],
    status: statuses[0],
    description: "",
  });

  // Edit mode state
  const [editId, setEditId] = useState<number | null>(null);

  // Use API data for storage
  const storageData = data;

  // Pagination calculations
  const totalPages = Math.ceil(storageData.length / itemsPerPage);
  const paginatedData = storageData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.storageName.trim() || !form.storageCode.trim()) {
      alert("Storage Name and Storage Code are required.");
      return;
    }
    if (editId !== null) {
      // Update existing
      const updatedData = storageData.map((item) =>
        item.id === editId ? { ...item, ...form } : item
      );
      // Call API to update data
      await apiService.put("StorageSettings", updatedData);
      setEditId(null);
    } else {
      // Add new
      const newId =
        storageData.length > 0
          ? Math.max(...storageData.map((item) => item.id)) + 1
          : 1;
      const newData = [...storageData, { id: newId, ...form }];
      // Call API to add new data
      await apiService.post("StorageSettings", newData);
      // If new item added on last page, update pagination to last page
      const newTotalPages = Math.ceil((storageData.length + 1) / itemsPerPage);
      if (newTotalPages > totalPages) setCurrentPage(newTotalPages);
    }
    setForm({
      storageName: "",
      storageCode: "",
      storageType: storageTypes[0],
      status: statuses[0],
      description: "",
    });
  };

  const handleEdit = (id: number) => {
    const item = storageData.find((d) => d.id === id);
    if (item) {
      setForm({
        storageName: item.storageName,
        storageCode: item.storageCode,
        storageType: item.storageType,
        status: item.status,
        description: item.description,
      });
      setEditId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this storage?")) {
      const updatedData = storageData.filter((item) => item.id !== id);
      // Call API to delete data
      await apiService.delete(`StorageSettings/${id}`);
      // Adjust page if last item on page deleted
      const newTotalPages = Math.ceil((storageData.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages) setCurrentPage(newTotalPages || 1);
    }
  };

  const handleRefresh = () => {
    loadData();
    setCurrentPage(1);
    setForm({
      storageName: "",
      storageCode: "",
      storageType: storageTypes[0],
      status: statuses[0],
      description: "",
    });
    setEditId(null);
  };

  const handleReport = () => {
    // For demo, just alert JSON of current data
    alert("Storage Report:\n" + JSON.stringify(storageData, null, 2));
  };

  // Pagination buttons handler
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans p-6">
      <title>Storage Settings</title>

      <h1 className="text-3xl font-semibold mb-6">Storage Settings</h1>

      {/* Storage Form Section */}
      <section className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add / Edit Storage</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-6"
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="storageName"
                className="block text-sm font-medium mb-1"
              >
                Storage Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="storageName"
                name="storageName"
                value={form.storageName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter storage name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="storageCode"
                className="block text-sm font-medium mb-1"
              >
                Storage Code <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="storageCode"
                name="storageCode"
                value={form.storageCode}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter storage code"
                required
              />
            </div>
            <div>
              <label
                htmlFor="storageType"
                className="block text-sm font-medium mb-1"
              >
                Storage Type
              </label>
              <select
                id="storageType"
                name="storageType"
                value={form.storageType}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {storageTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                value={form.status}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleInputChange}
                rows={2}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Enter description"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Save Storage"
            >
              <i className="fa fa-save mr-2" aria-hidden="true"></i> Save
            </button>
            <button
              type="button"
              onClick={() => {
                setForm({
                  storageName: "",
                  storageCode: "",
                  storageType: storageTypes[0],
                  status: statuses[0],
                  description: "",
                });
                setEditId(null);
              }}
              className="inline-flex items-center px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label="Clear Form"
            >
              <i className="fa fa-undo mr-2" aria-hidden="true"></i> Clear
            </button>
          </div>
        </form>
      </section>

      {/* Storage List Section */}
      <section className="bg-white rounded shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="text-xl font-semibold mb-3 md:mb-0">Storage List</h2>
          <div className="flex space-x-3">
            <button
              onClick={handleReport}
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Generate Report"
              type="button"
            >
              <i className="fa fa-file-alt mr-2" aria-hidden="true"></i> Report
            </button>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
              aria-label="Refresh List"
              type="button"
            >
              <i className="fa fa-sync-alt mr-2" aria-hidden="true"></i> Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">
                  Storage Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">
                  Storage Code
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">
                  Storage Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">
                  Description
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No storage entries found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-b border-gray-300">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-b border-gray-300">
                      {item.storageName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-b border-gray-300">
                      {item.storageCode}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-b border-gray-300">
                      {item.storageType}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm border-b border-gray-300">
                      <span
                        className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                          item.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-b border-gray-300">
                      {item.description}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center border-b border-gray-300 space-x-2">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label={`Edit storage ${item.storageName}`}
                        type="button"
                      >
                        <i className="fa fa-edit" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label={`Delete storage ${item.storageName}`}
                        type="button"
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <nav
          className="flex items-center justify-between mt-6"
          aria-label="Pagination"
        >
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label="Previous Page"
              type="button"
            >
              Previous
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === totalPages || totalPages === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label="Next Page"
              type="button"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center space-x-1">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                currentPage === 1
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label="Go to first page"
              type="button"
            >
              <i className="fa fa-angle-double-left" aria-hidden="true"></i>
            </button>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label="Go to previous page"
              type="button"
            >
              <i className="fa fa-angle-left" aria-hidden="true"></i>
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                aria-current={page === currentPage ? "page" : undefined}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                type="button"
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                currentPage === totalPages || totalPages === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label="Go to next page"
              type="button"
            >
              <i className="fa fa-angle-right" aria-hidden="true"></i>
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                currentPage === totalPages || totalPages === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label="Go to last page"
              type="button"
            >
              <i className="fa fa-angle-double-right" aria-hidden="true"></i>
            </button>
          </div>
        </nav>
      </section>
    </div>
  );
}