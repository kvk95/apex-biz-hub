import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const categories = [
  "Beverages",
  "Snacks",
  "Dairy",
  "Bakery",
  "Frozen",
  "Produce",
];

export default function SubCategory() {
  // Page title as in reference page
  useEffect(() => {
    document.title = "Sub Category | Dreams POS";
  }, []);

  // Form state
  const [form, setForm] = useState({
    category: "",
    subCategory: "",
    description: "",
    status: "Active",
  });

  // Table data and pagination state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Pagination calculations
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("SubCategory");
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

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!form.category || !form.subCategory) return;

    if (isEditing && editId !== null) {
      // Update existing
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                category: form.category,
                subCategory: form.subCategory,
                description: form.description,
                status: form.status,
              }
            : item
        )
      );
    } else {
      // Add new
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [
        ...prev,
        {
          id: newId,
          category: form.category,
          subCategory: form.subCategory,
          description: form.description,
          status: form.status,
        },
      ]);
    }
    resetForm();
  };

  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (!item) return;
    setForm({
      category: item.category,
      subCategory: item.subCategory,
      description: item.description,
      status: item.status,
    });
    setIsEditing(true);
    setEditId(id);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this sub category?"))
      return;
    setData((prev) => prev.filter((item) => item.id !== id));
    if (paginatedData.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const resetForm = () => {
    setForm({
      category: "",
      subCategory: "",
      description: "",
      status: "Active",
    });
    setIsEditing(false);
    setEditId(null);
  };

  const handleRefresh = () => {
    // Reset data to initial JSON and form
    loadData();
    resetForm();
    setCurrentPage(1);
  };

  const handleReport = () => {
    // For demo, just alert JSON data
    alert("Report generated for Sub Categories.");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {/* Page container */}
      <div className="max-w-[1200px] mx-auto p-6">
        {/* Title */}
        <h1 className="text-2xl font-semibold mb-6">Sub Category</h1>

        {/* Form Section */}
        <section className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Add / Edit Sub Category</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            {/* Category Select */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium mb-1"
              >
                Category <span className="text-red-600">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub Category Input */}
            <div>
              <label
                htmlFor="subCategory"
                className="block text-sm font-medium mb-1"
              >
                Sub Category <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="subCategory"
                name="subCategory"
                value={form.subCategory}
                onChange={handleInputChange}
                placeholder="Enter Sub Category"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Description Input */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Enter Description"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Select */}
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="md:col-span-4 flex space-x-3 mt-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded flex items-center"
              >
                <i className="fa fa-save mr-2" aria-hidden="true"></i> Save
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded flex items-center"
              >
                <i className="fa fa-refresh mr-2" aria-hidden="true"></i> Reset
              </button>
              <button
                type="button"
                onClick={handleReport}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded flex items-center ml-auto"
              >
                <i className="fa fa-file-text-o mr-2" aria-hidden="true"></i> Report
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded flex items-center"
              >
                <i className="fa fa-refresh mr-2" aria-hidden="true"></i> Refresh
              </button>
            </div>
          </form>
        </section>

        {/* Table Section */}
        <section className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Sub Category List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    #
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Category
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Sub Category
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Description
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-4 text-gray-500 italic"
                    >
                      No sub categories found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }
                    >
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {item.category}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {item.subCategory}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {item.description}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            item.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center text-sm space-x-2">
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="text-blue-600 hover:text-blue-800"
                          aria-label="Edit"
                          title="Edit"
                        >
                          <i className="fa fa-pencil" aria-hidden="true"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800"
                          aria-label="Delete"
                          title="Delete"
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
            className="flex justify-end items-center mt-4 space-x-2 select-none"
            aria-label="Pagination"
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Previous page"
            >
              <i className="fa fa-chevron-left" aria-hidden="true"></i>
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  aria-current={isActive ? "page" : undefined}
                  className={`px-3 py-1 rounded border border-gray-300 hover:bg-gray-200 ${
                    isActive
                      ? "bg-blue-600 text-white border-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Next page"
            >
              <i className="fa fa-chevron-right" aria-hidden="true"></i>
            </button>
          </nav>
        </section>
      </div>
    </div>
  );
}