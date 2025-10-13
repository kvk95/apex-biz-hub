import React, { useEffect, useState } from "react";
import { apiService } from "@/services/ApiService";

const ITEMS_PER_PAGE = 5;

const Designation: React.FC = () => {
  // Page title as in reference: "Designation"
  useEffect(() => {
    
  }, []);

  // Form state
  const [designation, setDesignation] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Designation");
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
  const pageCount = Math.ceil(data.length / ITEMS_PER_PAGE);

  // Pagination slice
  const paginatedData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handlers
  const resetForm = () => {
    setDesignation("");
    setDescription("");
    setEditId(null);
  };

  const handleSave = () => {
    if (!designation.trim()) {
      alert("Please enter Designation");
      return;
    }
    if (editId !== null) {
      // Edit existing
      setData((prev) =>
        prev.map((item) =>
          item.id === editId ? { ...item, designation, description } : item
        )
      );
    } else {
      // Add new
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [...prev, { id: newId, designation, description }]);
      // If new item added on last page, may need to adjust page
      if (currentPage !== pageCount) setCurrentPage(pageCount);
    }
    resetForm();
  };

  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setDesignation(item.designation);
      setDescription(item.description);
      setEditId(id);
    }
  };

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this designation?"
      )
    ) {
      setData((prev) => prev.filter((item) => item.id !== id));
      // Adjust page if needed
      if (
        (currentPage - 1) * ITEMS_PER_PAGE >=
        data.length - 1
      ) {
        setCurrentPage((p) => Math.max(p - 1, 1));
      }
      if (editId === id) resetForm();
    }
  };

  const handleRefresh = () => {
    loadData();
    resetForm();
    setCurrentPage(1);
  };

  const handleReport = () => {
    // For demo, just alert JSON data
    alert("Designation Report:\n" + JSON.stringify(data, null, 2));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-800">
      {/* Title */}
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">Designation</h1>

      {/* Form Section */}
      <section className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Add Designation</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-6"
          noValidate
        >
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
            <label
              htmlFor="designation"
              className="w-full md:w-1/4 text-gray-700 font-medium mb-2 md:mb-0"
            >
              Designation <span className="text-red-600">*</span>
            </label>
            <input
              id="designation"
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full md:w-3/4 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter Designation"
              required
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
            <label
              htmlFor="description"
              className="w-full md:w-1/4 text-gray-700 font-medium mb-2 md:mb-0"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full md:w-3/4 border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows={3}
              placeholder="Enter Description"
            />
          </div>

          <div className="flex space-x-4 justify-end">
            <button
              type="button"
              onClick={handleRefresh}
              className="flex items-center space-x-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded transition"
              title="Refresh"
            >
              <i className="fa fa-refresh" aria-hidden="true"></i>
              <span>Refresh</span>
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition"
              title={editId !== null ? "Update" : "Save"}
            >
              <i className="fa fa-save" aria-hidden="true"></i>
              <span>{editId !== null ? "Update" : "Save"}</span>
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-white rounded shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Designation List</h2>
          <button
            onClick={handleReport}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded transition"
            title="Report"
          >
            <i className="fa fa-file-text-o" aria-hidden="true"></i>
            <span>Report</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold border-r border-gray-300 w-20">
                  #
                </th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold border-r border-gray-300">
                  Designation
                </th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold border-r border-gray-300">
                  Description
                </th>
                <th className="px-4 py-3 text-center text-gray-700 font-semibold w-32">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No designations found.
                  </td>
                </tr>
              )}
              {paginatedData.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-r border-gray-300">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                  <td className="px-4 py-3 border-r border-gray-300">{item.designation}</td>
                  <td className="px-4 py-3 border-r border-gray-300">{item.description}</td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                      aria-label={`Edit designation ${item.designation}`}
                    >
                      <i className="fa fa-pencil" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                      aria-label={`Delete designation ${item.designation}`}
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
          className="flex justify-between items-center mt-6"
          aria-label="Pagination"
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`flex items-center space-x-1 px-3 py-1 rounded border border-gray-300 ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Previous page"
          >
            <i className="fa fa-chevron-left" aria-hidden="true"></i>
            <span>Prev</span>
          </button>

          <ul className="flex space-x-2">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
              <li key={page}>
                <button
                  onClick={() => setCurrentPage(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`px-3 py-1 rounded border border-gray-300 ${
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
            onClick={() => setCurrentPage((p) => Math.min(p + 1, pageCount))}
            disabled={currentPage === pageCount}
            className={`flex items-center space-x-1 px-3 py-1 rounded border border-gray-300 ${
              currentPage === pageCount
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Next page"
          >
            <span>Next</span>
            <i className="fa fa-chevron-right" aria-hidden="true"></i>
          </button>
        </nav>
      </section>
    </div>
  );
};

export default Designation;