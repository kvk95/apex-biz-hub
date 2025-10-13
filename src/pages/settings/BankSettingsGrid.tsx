import React, { useMemo, useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const pageSizeOptions = [5, 10, 15];

export default function BankSettingsGrid() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Form state for adding/editing bank settings
  const [formData, setFormData] = useState({
    bankName: "",
    branchName: "",
    accountNumber: "",
    accountHolder: "",
    ifscCode: "",
    status: "Active",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("BankSettingsGrid");
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
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [currentPage, pageSize, data]);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (
      !formData.bankName.trim() ||
      !formData.branchName.trim() ||
      !formData.accountNumber.trim() ||
      !formData.accountHolder.trim() ||
      !formData.ifscCode.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (isEditing && editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId ? { id: editId, ...formData } : item
        )
      );
      setIsEditing(false);
      setEditId(null);
    } else {
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [...prev, { id: newId, ...formData }]);
    }
    setFormData({
      bankName: "",
      branchName: "",
      accountNumber: "",
      accountHolder: "",
      ifscCode: "",
      status: "Active",
    });
  };

  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (!item) return;
    setFormData({
      bankName: item.bankName,
      branchName: item.branchName,
      accountNumber: item.accountNumber,
      accountHolder: item.accountHolder,
      ifscCode: item.ifscCode,
      status: item.status,
    });
    setIsEditing(true);
    setEditId(id);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      if ((currentPage - 1) * pageSize >= data.length - 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleRefresh = () => {
    loadData();
    setCurrentPage(1);
    setIsEditing(false);
    setEditId(null);
    setFormData({
      bankName: "",
      branchName: "",
      accountNumber: "",
      accountHolder: "",
      ifscCode: "",
      status: "Active",
    });
  };

  const handleReport = () => {
    // For demo: just alert JSON data
    alert("Report generated for current bank settings.");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Title */}
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">
        Bank Settings Grid
      </h1>

      {/* Controls: Report & Refresh */}
      <div className="flex justify-end space-x-3 mb-4">
        <button
          onClick={handleReport}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
          title="Generate Report"
          type="button"
        >
          <i className="fas fa-file-alt"></i> Report
        </button>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition"
          title="Refresh Data"
          type="button"
        >
          <i className="fas fa-sync-alt"></i> Refresh
        </button>
      </div>

      {/* Form Section */}
      <section className="bg-white rounded-md shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          {isEditing ? "Edit Bank Setting" : "Add Bank Setting"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          noValidate
        >
          <div>
            <label
              htmlFor="bankName"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Bank Name
            </label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="branchName"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Branch Name
            </label>
            <input
              type="text"
              id="branchName"
              name="branchName"
              value={formData.branchName}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="accountNumber"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Account Number
            </label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="accountHolder"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Account Holder
            </label>
            <input
              type="text"
              id="accountHolder"
              name="accountHolder"
              value={formData.accountHolder}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="ifscCode"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              IFSC Code
            </label>
            <input
              type="text"
              id="ifscCode"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="md:col-span-3 flex justify-end items-end space-x-3">
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditId(null);
                  setFormData({
                    bankName: "",
                    branchName: "",
                    accountNumber: "",
                    accountHolder: "",
                    ifscCode: "",
                    status: "Active",
                  });
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-md text-sm font-medium transition flex items-center gap-2"
              >
                <i className="fas fa-times"></i> Cancel
              </button>
            )}
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md text-sm font-medium transition flex items-center gap-2"
              title={isEditing ? "Update Bank Setting" : "Save Bank Setting"}
            >
              <i className="fas fa-save"></i> {isEditing ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-white rounded-md shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Bank Settings List
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-left text-sm">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-3 border-b border-gray-300">Bank Name</th>
                <th className="px-4 py-3 border-b border-gray-300">Branch Name</th>
                <th className="px-4 py-3 border-b border-gray-300">Account Number</th>
                <th className="px-4 py-3 border-b border-gray-300">Account Holder</th>
                <th className="px-4 py-3 border-b border-gray-300">IFSC Code</th>
                <th className="px-4 py-3 border-b border-gray-300">Status</th>
                <th className="px-4 py-3 border-b border-gray-300 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No bank settings found.
                  </td>
                </tr>
              )}
              {paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 even:bg-gray-50 odd:bg-white"
                >
                  <td className="px-4 py-3 border-b border-gray-300">{item.bankName}</td>
                  <td className="px-4 py-3 border-b border-gray-300">{item.branchName}</td>
                  <td className="px-4 py-3 border-b border-gray-300">{item.accountNumber}</td>
                  <td className="px-4 py-3 border-b border-gray-300">{item.accountHolder}</td>
                  <td className="px-4 py-3 border-b border-gray-300">{item.ifscCode}</td>
                  <td className="px-4 py-3 border-b border-gray-300">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        item.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-300 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                      type="button"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                      type="button"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-6 space-y-3 md:space-y-0">
          <div className="flex items-center space-x-2 text-gray-700 text-sm">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <nav
            className="inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="First Page"
              type="button"
            >
              <i className="fas fa-angle-double-left"></i>
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Previous Page"
              type="button"
            >
              <i className="fas fa-angle-left"></i>
            </button>

            {/* Page numbers */}
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium ${
                    isActive
                      ? "z-10 bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  type="button"
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Next Page"
              type="button"
            >
              <i className="fas fa-angle-right"></i>
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Last Page"
              type="button"
            >
              <i className="fas fa-angle-double-right"></i>
            </button>
          </nav>
        </div>
      </section>
    </div>
  );
}