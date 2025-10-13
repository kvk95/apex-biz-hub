import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const pageSizeOptions = [5, 10, 20];

const Departments: React.FC = () => {
  useEffect(() => {
    
  }, []);

  // State for form inputs
  const [departmentName, setDepartmentName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");

  // State for table data and pagination
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // State for editing
  const [editId, setEditId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Departments");
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

  // Pagination calculations
  const totalPages = Math.ceil(data.length / pageSize);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, currentPage, pageSize]);

  // Handlers
  const resetForm = () => {
    setDepartmentName("");
    setDescription("");
    setStatus("Active");
    setEditId(null);
  };

  const handleSave = () => {
    if (!departmentName.trim()) {
      alert("Department Name is required.");
      return;
    }
    if (editId !== null) {
      // Edit existing
      setData((prev) =>
        prev.map((d) =>
          d.id === editId
            ? { ...d, departmentName, description, status }
            : d
        )
      );
    } else {
      // Add new
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [
        ...prev,
        { id: newId, departmentName, description, status },
      ]);
    }
    resetForm();
  };

  const handleEdit = (id: number) => {
    const dept = data.find((d) => d.id === id);
    if (dept) {
      setDepartmentName(dept.departmentName);
      setDescription(dept.description);
      setStatus(dept.status);
      setEditId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this department?"
      )
    ) {
      setData((prev) => prev.filter((d) => d.id !== id));
      if ((currentPage - 1) * pageSize >= data.length - 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleRefresh = () => {
    loadData();
    resetForm();
    setCurrentPage(1);
    setPageSize(5);
  };

  // Pagination controls
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <div className="container mx-auto px-4 py-6">
        {/* Title */}
        <h1 className="text-3xl font-semibold mb-6 text-gray-900">
          Departments
        </h1>

        {/* Form Section */}
        <section className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Add / Edit Department
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <label
                htmlFor="departmentName"
                className="block text-gray-700 font-medium"
              >
                Department Name <span className="text-red-600">*</span>
              </label>
              <input
                id="departmentName"
                type="text"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                className="col-span-2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter department name"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <label
                htmlFor="description"
                className="block text-gray-700 font-medium"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="col-span-2 border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <label
                htmlFor="status"
                className="block text-gray-700 font-medium"
              >
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="col-span-2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex space-x-4 justify-start">
              <button
                type="submit"
                className="inline-flex items-center px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Save Department"
              >
                <i className="fas fa-save mr-2" aria-hidden="true"></i> Save
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center px-5 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                title="Clear Form"
              >
                <i className="fas fa-undo mr-2" aria-hidden="true"></i> Clear
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                title="Refresh Data"
              >
                <i className="fas fa-sync-alt mr-2" aria-hidden="true"></i> Refresh
              </button>
            </div>
          </form>
        </section>

        {/* Table Section */}
        <section className="bg-white rounded shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Department List
            </h2>
            <button
              type="button"
              onClick={() => alert("Report generated")}
              className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              title="Generate Report"
            >
              <i className="fas fa-file-alt mr-2" aria-hidden="true"></i> Report
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                    Department Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {paginatedData.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No departments found.
                    </td>
                  </tr>
                )}
                {paginatedData.map((dept, idx) => (
                  <tr key={dept.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-r border-gray-300 text-sm text-gray-700">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300 text-sm text-gray-900 font-medium">
                      {dept.departmentName}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300 text-sm text-gray-700">
                      {dept.description}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          dept.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {dept.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(dept.id)}
                        className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Edit Department"
                      >
                        <i className="fas fa-edit" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(dept.id)}
                        className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        title="Delete Department"
                      >
                        <i className="fas fa-trash-alt" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-6 space-y-3 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Select page size"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span>entries</span>
            </div>

            <nav
              className="inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className={`inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}
                aria-label="First Page"
                title="First Page"
              >
                <i className="fas fa-angle-double-left" aria-hidden="true"></i>
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}
                aria-label="Previous Page"
                title="Previous Page"
              >
                <i className="fas fa-angle-left" aria-hidden="true"></i>
              </button>

              {/* Show up to 5 page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                )
                .map((page, i, arr) => {
                  // Add ellipsis if gap between pages
                  if (
                    i > 0 &&
                    page - arr[i - 1] > 1
                  ) {
                    return (
                      <React.Fragment key={`frag-${page}`}>
                        <span className="inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-gray-700 cursor-default select-none">
                          ...
                        </span>
                        <button
                          onClick={() => goToPage(page)}
                          aria-current={page === currentPage ? "page" : undefined}
                          className={`inline-flex items-center px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            page === currentPage
                              ? "bg-indigo-600 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                          key={page}
                          title={`Page ${page}`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  }
                  return (
                    <button
                      onClick={() => goToPage(page)}
                      aria-current={page === currentPage ? "page" : undefined}
                      className={`inline-flex items-center px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        page === currentPage
                          ? "bg-indigo-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                      key={page}
                      title={`Page ${page}`}
                    >
                      {page}
                    </button>
                  );
                })}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
                }`}
                aria-label="Next Page"
                title="Next Page"
              >
                <i className="fas fa-angle-right" aria-hidden="true"></i>
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
                }`}
                aria-label="Last Page"
                title="Last Page"
              >
                <i className="fas fa-angle-double-right" aria-hidden="true"></i>
              </button>
            </nav>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Departments;