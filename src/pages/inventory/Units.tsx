import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { apiService } from "@/services/ApiService";

type Unit = {
  id: number;
  unitName: string;
  shortName: string;
  description: string;
};

export default function Units() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Units state
  const [data, setData] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Units");
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

  // Form state for add/edit
  const [unitName, setUnitName] = useState("");
  const [shortName, setShortName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  // Filter/search state
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered units based on search term
  const filteredUnits = data.filter(
    (u) =>
      u.unitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);
  const paginatedUnits = filteredUnits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page if filteredUnits length changes and currentPage is out of range
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredUnits, currentPage, totalPages]);

  // Handlers for form inputs
  const handleUnitNameChange = (e: ChangeEvent<HTMLInputElement>) => setUnitName(e.target.value);
  const handleShortNameChange = (e: ChangeEvent<HTMLInputElement>) => setShortName(e.target.value);
  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value);

  // Handle form submit for add/edit
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!unitName.trim() || !shortName.trim()) return; // Required fields

    if (editId !== null) {
      // Edit existing
      setData((prev) =>
        prev.map((u) =>
          u.id === editId ? { ...u, unitName: unitName.trim(), shortName: shortName.trim(), description: description.trim() } : u
        )
      );
    } else {
      // Add new
      const newUnit: Unit = {
        id: data.length > 0 ? Math.max(...data.map((u) => u.id)) + 1 : 1,
        unitName: unitName.trim(),
        shortName: shortName.trim(),
        description: description.trim(),
      };
      setData((prev) => [...prev, newUnit]);
    }

    // Reset form
    setUnitName("");
    setShortName("");
    setDescription("");
    setEditId(null);
  };

  // Handle edit button click
  const handleEdit = (unit: Unit) => {
    setEditId(unit.id);
    setUnitName(unit.unitName);
    setShortName(unit.shortName);
    setDescription(unit.description);
  };

  // Handle delete button click
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this unit?")) {
      setData((prev) => prev.filter((u) => u.id !== id));
      if ((currentPage - 1) * itemsPerPage >= filteredUnits.length - 1) {
        setCurrentPage((p) => (p > 1 ? p - 1 : 1));
      }
    }
  };

  // Handle refresh button click - resets form and search
  const handleRefresh = () => {
    setUnitName("");
    setShortName("");
    setDescription("");
    setEditId(null);
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Handle report button click - for demo, alert with JSON data
  const handleReport = () => {
    alert("Units Report:\n\n" + JSON.stringify(data, null, 2));
  };

  // Pagination controls
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {/* Page Title */}
      <title>DreamsPOS - Units</title>

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Units</h1>
          <div className="flex gap-2">
            <button
              onClick={handleReport}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition"
              title="Report"
              type="button"
            >
              <i className="fas fa-file-alt"></i> Report
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded shadow transition"
              title="Refresh"
              type="button"
            >
              <i className="fas fa-sync-alt"></i> Refresh
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded shadow p-6 mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div>
              <label htmlFor="unitName" className="block text-sm font-medium text-gray-700 mb-1">
                Unit Name <span className="text-red-600">*</span>
              </label>
              <input
                id="unitName"
                type="text"
                value={unitName}
                onChange={handleUnitNameChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Unit Name"
                required
              />
            </div>
            <div>
              <label htmlFor="shortName" className="block text-sm font-medium text-gray-700 mb-1">
                Short Name <span className="text-red-600">*</span>
              </label>
              <input
                id="shortName"
                type="text"
                value={shortName}
                onChange={handleShortNameChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Short Name"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={handleDescriptionChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Description"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow flex items-center gap-2 transition"
                title={editId !== null ? "Update Unit" : "Save Unit"}
              >
                <i className="fas fa-save"></i> {editId !== null ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded shadow flex items-center gap-2 transition"
                title="Clear Form"
              >
                <i className="fas fa-times"></i> Clear
              </button>
            </div>
          </form>
        </div>

        {/* Search Section */}
        <div className="mb-4 flex justify-end">
          <input
            type="text"
            placeholder="Search Units..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-700 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 font-medium text-gray-700 uppercase tracking-wider">Unit Name</th>
                <th className="px-6 py-3 font-medium text-gray-700 uppercase tracking-wider">Short Name</th>
                <th className="px-6 py-3 font-medium text-gray-700 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 font-medium text-gray-700 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedUnits.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No units found.
                  </td>
                </tr>
              ) : (
                paginatedUnits.map((unit, idx) => (
                  <tr key={unit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{unit.unitName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{unit.shortName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{unit.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                      <button
                        onClick={() => handleEdit(unit)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit Unit"
                        type="button"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(unit.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete Unit"
                        type="button"
                      >
                        <i className="fas fa-trash-alt"></i>
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
          className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 mt-4"
          aria-label="Pagination"
        >
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Previous"
              type="button"
            >
              Previous
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                currentPage === totalPages || totalPages === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Next"
              type="button"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1 > filteredUnits.length
                    ? 0
                    : (currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {currentPage * itemsPerPage > filteredUnits.length
                    ? filteredUnits.length
                    : currentPage * itemsPerPage}
                </span>{" "}
                of <span className="font-medium">{filteredUnits.length}</span> results
              </p>
            </div>
            <div>
              <ul className="inline-flex -space-x-px rounded-md shadow-sm">
                <li>
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    aria-label="Previous"
                    type="button"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                </li>

                {/* Show page numbers with ellipsis if many pages */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    if (totalPages <= 7) return true;
                    if (page === 1 || page === totalPages) return true;
                    if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                    if (currentPage <= 3 && page <= 4) return true;
                    if (currentPage >= totalPages - 2 && page >= totalPages - 3) return true;
                    return false;
                  })
                  .map((page, idx, arr) => {
                    // Add ellipsis if gap between pages
                    if (
                      idx > 0 &&
                      page - arr[idx - 1] > 1
                    ) {
                      return (
                        <React.Fragment key={"ellipsis-" + page}>
                          <li className="relative inline-flex items-center border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 select-none cursor-default">
                            &hellip;
                          </li>
                          <li key={page}>
                            <button
                              onClick={() => goToPage(page)}
                              aria-current={page === currentPage ? "page" : undefined}
                              className={`relative inline-flex items-center border border-gray-300 px-4 py-2 text-sm font-medium ${
                                page === currentPage
                                  ? "z-10 bg-blue-600 text-white"
                                  : "bg-white text-gray-700 hover:bg-gray-50"
                              }`}
                              type="button"
                            >
                              {page}
                            </button>
                          </li>
                        </React.Fragment>
                      );
                    }
                    return (
                      <li key={page}>
                        <button
                          onClick={() => goToPage(page)}
                          aria-current={page === currentPage ? "page" : undefined}
                          className={`relative inline-flex items-center border border-gray-300 px-4 py-2 text-sm font-medium ${
                            page === currentPage
                              ? "z-10 bg-blue-600 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                          type="button"
                        >
                          {page}
                        </button>
                      </li>
                    );
                  })}

                <li>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                      currentPage === totalPages || totalPages === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    aria-label="Next"
                    type="button"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}