import React, { useEffect, useState } from "react";
import { apiService } from "@/services/ApiService";

const itemsPerPage = 5;

export default function Category() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  // Form state
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  // Data state
  const [categories, setCategories] = useState([]);
  // Editing state
  const [editId, setEditId] = useState<number | null>(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Category");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
      setCategories(response.result);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginatedCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset form fields
  const resetForm = () => {
    setCategoryName("");
    setDescription("");
    setStatus("Active");
    setEditId(null);
  };

  // Handle Save (Add or Update)
  const handleSave = () => {
    if (!categoryName.trim()) return; // Require category name

    if (editId !== null) {
      // Update existing
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editId
            ? { ...cat, categoryName, description, status }
            : cat
        )
      );
    } else {
      // Add new
      const newId =
        categories.length > 0
          ? Math.max(...categories.map((c) => c.id)) + 1
          : 1;
      setCategories((prev) => [
        ...prev,
        { id: newId, categoryName, description, status },
      ]);
    }
    resetForm();
  };

  // Handle Edit click
  const handleEdit = (id: number) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    setCategoryName(cat.categoryName);
    setDescription(cat.description);
    setStatus(cat.status);
    setEditId(id);
  };

  // Handle Delete click
  const handleDelete = (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category?"
      )
    ) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      // If deleting last item on page, go back a page if possible
      if (
        (categories.length - 1) % itemsPerPage === 0 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
      if (editId === id) resetForm();
    }
  };

  // Handle Refresh (reset form and reload data)
  const handleRefresh = () => {
    resetForm();
    loadData();
    setCurrentPage(1);
  };

  // Handle Report (simulate report generation)
  const handleReport = () => {
    alert("Report generated for categories.");
  };

  // Handle page change
  const onPageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  return (
    <>
      <title>Category - Dreams POS</title>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
        <div className="container mx-auto p-4">
          {/* Page Title */}
          <h1 className="text-3xl font-semibold mb-6">Category</h1>

          {/* Form Section */}
          <div className="bg-white rounded shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              {/* Category Name */}
              <div>
                <label
                  htmlFor="categoryName"
                  className="block text-sm font-medium mb-1"
                >
                  Category Name
                </label>
                <input
                  id="categoryName"
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Category Name"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-1"
                >
                  Description
                </label>
                <input
                  id="description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                  title="Save"
                >
                  <i className="fa fa-save mr-2" aria-hidden="true"></i>
                  Save
                </button>
                <button
                  onClick={resetForm}
                  className="flex items-center bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition"
                  title="Clear"
                >
                  <i
                    className="fa fa-eraser mr-2"
                    aria-hidden="true"
                  ></i>
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mb-4">
            <button
              onClick={handleReport}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
              title="Report"
            >
              <i className="fa fa-file-text-o mr-2" aria-hidden="true"></i>
              Report
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
              title="Refresh"
            >
              <i className="fa fa-refresh mr-2" aria-hidden="true"></i>
              Refresh
            </button>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">
                    #
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">
                    Category Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">
                    Description
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedCategories.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-4 text-gray-500"
                    >
                      No categories found.
                    </td>
                  </tr>
                )}
                {paginatedCategories.map((cat, idx) => (
                  <tr
                    key={cat.id}
                    className={
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {cat.categoryName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {cat.description}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                          cat.status === "Active"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {cat.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(cat.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                        aria-label={`Edit category ${cat.categoryName}`}
                      >
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                        aria-label={`Delete category ${cat.categoryName}`}
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav
            className="flex justify-end items-center space-x-1 mt-4 select-none"
            aria-label="Pagination"
          >
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center px-3 py-1 rounded border border-gray-300 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Previous page"
              title="Previous"
            >
              <i className="fa fa-chevron-left" aria-hidden="true"></i>
            </button>
            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 rounded border border-gray-300 hover:bg-gray-200 transition ${
                  page === currentPage
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700"
                }`}
                aria-current={page === currentPage ? "page" : undefined}
                title={`Page ${page}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center px-3 py-1 rounded border border-gray-300 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Next page"
              title="Next"
            >
              <i className="fa fa-chevron-right" aria-hidden="true"></i>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}