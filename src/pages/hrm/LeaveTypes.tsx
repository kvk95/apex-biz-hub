import React, { useState, useEffect } from "react";

interface LeaveType {
  id: number;
  leaveType: string;
  days: number;
  status: "Active" | "Inactive";
}

const leaveTypesData: LeaveType[] = [
  { id: 1, leaveType: "Casual Leave", days: 12, status: "Active" },
  { id: 2, leaveType: "Sick Leave", days: 10, status: "Active" },
  { id: 3, leaveType: "Maternity Leave", days: 90, status: "Inactive" },
  { id: 4, leaveType: "Paternity Leave", days: 15, status: "Active" },
  { id: 5, leaveType: "Annual Leave", days: 30, status: "Active" },
  { id: 6, leaveType: "Unpaid Leave", days: 0, status: "Inactive" },
  { id: 7, leaveType: "Compensatory Off", days: 5, status: "Active" },
  { id: 8, leaveType: "Bereavement Leave", days: 7, status: "Active" },
  { id: 9, leaveType: "Study Leave", days: 20, status: "Inactive" },
  { id: 10, leaveType: "Sabbatical Leave", days: 180, status: "Inactive" },
  { id: 11, leaveType: "Leave Without Pay", days: 0, status: "Active" },
  { id: 12, leaveType: "Special Leave", days: 10, status: "Active" },
];

const PAGE_SIZE = 5;

const LeaveTypes: React.FC = () => {
  // Page title as per reference page
  useEffect(() => {
    document.title = "Dreams POS - Leave Types";
  }, []);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // State for form inputs
  const [leaveType, setLeaveType] = useState("");
  const [days, setDays] = useState("");
  const [status, setStatus] = useState("Active");

  // State for leave types list (simulate data source)
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>(leaveTypesData);

  // State for editing
  const [editingId, setEditingId] = useState<number | null>(null);

  // Pagination calculations
  const totalPages = Math.ceil(leaveTypes.length / PAGE_SIZE);
  const paginatedData = leaveTypes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Handlers
  const resetForm = () => {
    setLeaveType("");
    setDays("");
    setStatus("Active");
    setEditingId(null);
  };

  const handleSave = () => {
    if (!leaveType.trim()) {
      alert("Please enter Leave Type");
      return;
    }
    if (!days.trim() || isNaN(Number(days)) || Number(days) < 0) {
      alert("Please enter valid Days");
      return;
    }

    if (editingId !== null) {
      // Update existing
      setLeaveTypes((prev) =>
        prev.map((lt) =>
          lt.id === editingId
            ? { ...lt, leaveType: leaveType.trim(), days: Number(days), status: status as "Active" | "Inactive" }
            : lt
        )
      );
    } else {
      // Add new
      const newId =
        leaveTypes.length > 0
          ? Math.max(...leaveTypes.map((lt) => lt.id)) + 1
          : 1;
      setLeaveTypes((prev) => [
        ...prev,
        { id: newId, leaveType: leaveType.trim(), days: Number(days), status: status as "Active" | "Inactive" },
      ]);
      // If new page needed, move to last page
      if ((leaveTypes.length + 1) > PAGE_SIZE * totalPages) {
        setCurrentPage(totalPages + 1);
      }
    }
    resetForm();
  };

  const handleEdit = (id: number) => {
    const lt = leaveTypes.find((l) => l.id === id);
    if (lt) {
      setLeaveType(lt.leaveType);
      setDays(String(lt.days));
      setStatus(lt.status);
      setEditingId(id);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this leave type?")) {
      setLeaveTypes((prev) => prev.filter((lt) => lt.id !== id));
      // Adjust page if needed
      if (
        currentPage > 1 &&
        (leaveTypes.length - 1) <= PAGE_SIZE * (currentPage - 1)
      ) {
        setCurrentPage(currentPage - 1);
      }
      if (editingId === id) resetForm();
    }
  };

  const handleRefresh = () => {
    setLeaveTypes(leaveTypesData);
    resetForm();
    setCurrentPage(1);
  };

  const handleReport = () => {
    // For demonstration, just alert JSON data
    alert("Leave Types Report:\n" + JSON.stringify(leaveTypes, null, 2));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">
        Leave Types
      </h1>

      {/* Form Section */}
      <section className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Add / Edit Leave Type
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-6"
          noValidate
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            <label
              htmlFor="leaveType"
              className="block text-gray-700 font-medium"
            >
              Leave Type
            </label>
            <input
              id="leaveType"
              type="text"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="sm:col-span-2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter leave type"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            <label htmlFor="days" className="block text-gray-700 font-medium">
              Days
            </label>
            <input
              id="days"
              type="number"
              min={0}
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="sm:col-span-2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter number of days"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            <label htmlFor="status" className="block text-gray-700 font-medium">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="sm:col-span-2 border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex space-x-4 justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              {editingId !== null ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-white rounded shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Leave Types List</h2>
          <div className="flex space-x-3">
            <button
              onClick={handleReport}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              title="Generate Report"
              type="button"
            >
              Report
            </button>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              title="Refresh Data"
              type="button"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 border-b border-gray-300 font-medium text-gray-700 w-16">#</th>
                <th className="px-4 py-3 border-b border-gray-300 font-medium text-gray-700">Leave Type</th>
                <th className="px-4 py-3 border-b border-gray-300 font-medium text-gray-700 w-24">Days</th>
                <th className="px-4 py-3 border-b border-gray-300 font-medium text-gray-700 w-28">Status</th>
                <th className="px-4 py-3 border-b border-gray-300 font-medium text-gray-700 w-36">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No leave types found.
                  </td>
                </tr>
              ) : (
                paginatedData.map(({ id, leaveType, days, status }, idx) => (
                  <tr
                    key={id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-3 border-b border-gray-300">{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                    <td className="px-4 py-3 border-b border-gray-300">{leaveType}</td>
                    <td className="px-4 py-3 border-b border-gray-300">{days}</td>
                    <td className="px-4 py-3 border-b border-gray-300">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-300 space-x-2">
                      <button
                        onClick={() => handleEdit(id)}
                        className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition text-sm"
                        title="Edit"
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                        title="Delete"
                        type="button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <nav
          className="flex justify-end items-center space-x-2 mt-4"
          aria-label="Pagination"
        >
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border ${
              currentPage === 1
                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                : "border-gray-400 text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="First Page"
            type="button"
          >
            &laquo;
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border ${
              currentPage === 1
                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                : "border-gray-400 text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Previous Page"
            type="button"
          >
            &lsaquo;
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded border ${
                page === currentPage
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "border-gray-400 text-gray-700 hover:bg-gray-200"
              }`}
              aria-current={page === currentPage ? "page" : undefined}
              type="button"
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border ${
              currentPage === totalPages
                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                : "border-gray-400 text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Next Page"
            type="button"
          >
            &rsaquo;
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border ${
              currentPage === totalPages
                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                : "border-gray-400 text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Last Page"
            type="button"
          >
            &raquo;
          </button>
        </nav>
      </section>
    </div>
  );
};

export default LeaveTypes;