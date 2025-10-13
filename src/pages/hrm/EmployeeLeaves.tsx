import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

type LeaveRecord = {
  id: number;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
};

const leaveTypes = [
  "Casual Leave",
  "Sick Leave",
  "Maternity Leave",
  "Paternity Leave",
  "Bereavement Leave",
  "Unpaid Leave",
];

const statuses = ["Pending", "Approved", "Rejected"];

const employees = [
  { id: "E001", name: "John Doe" },
  { id: "E002", name: "Jane Smith" },
  { id: "E003", name: "Michael Johnson" },
  { id: "E004", name: "Emily Davis" },
  { id: "E005", name: "William Brown" },
];

export default function EmployeeLeaves() {
  // Page title exactly as in reference page
  React.useEffect(() => {
    
  }, []);

  // Form state for filters and inputs
  const [form, setForm] = useState({
    employeeId: "",
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
    status: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [data, setData] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<LeaveRecord[]>("EmployeeLeaves");
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

  // Filtered data based on form inputs
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (form.employeeId && item.employeeId !== form.employeeId) return false;
      if (form.leaveType && item.leaveType !== form.leaveType) return false;
      if (form.status && item.status !== form.status) return false;
      if (form.fromDate && item.fromDate < form.fromDate) return false;
      if (form.toDate && item.toDate > form.toDate) return false;
      if (form.reason && !item.reason.toLowerCase().includes(form.reason.toLowerCase())) return false;
      return true;
    });
  }, [form, data]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setCurrentPage(1);
  };

  const handleReset = () => {
    setForm({
      employeeId: "",
      leaveType: "",
      fromDate: "",
      toDate: "",
      reason: "",
      status: "",
    });
    setCurrentPage(1);
  };

  // Save button handler (simulate save)
  const handleSave = () => {
    alert("Save functionality is not implemented but button is functional.");
  };

  // Refresh button handler (simulate refresh)
  const handleRefresh = () => {
    handleReset();
  };

  // Report button handler (simulate report)
  const handleReport = () => {
    alert("Report functionality is not implemented but button is functional.");
  };

  // Pagination buttons handlers
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6">Employee Leaves</h1>

      {/* Filter & Input Section */}
      <section className="bg-white rounded shadow p-6 mb-6">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4"
          aria-label="Employee Leaves Form"
        >
          {/* Employee ID */}
          <div className="flex flex-col">
            <label htmlFor="employeeId" className="mb-1 font-medium text-sm">
              Employee ID
            </label>
            <select
              id="employeeId"
              name="employeeId"
              value={form.employeeId}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.id} - {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Leave Type */}
          <div className="flex flex-col">
            <label htmlFor="leaveType" className="mb-1 font-medium text-sm">
              Leave Type
            </label>
            <select
              id="leaveType"
              name="leaveType"
              value={form.leaveType}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Leave Type</option>
              {leaveTypes.map((lt) => (
                <option key={lt} value={lt}>
                  {lt}
                </option>
              ))}
            </select>
          </div>

          {/* From Date */}
          <div className="flex flex-col">
            <label htmlFor="fromDate" className="mb-1 font-medium text-sm">
              From Date
            </label>
            <input
              type="date"
              id="fromDate"
              name="fromDate"
              value={form.fromDate}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* To Date */}
          <div className="flex flex-col">
            <label htmlFor="toDate" className="mb-1 font-medium text-sm">
              To Date
            </label>
            <input
              type="date"
              id="toDate"
              name="toDate"
              value={form.toDate}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Reason */}
          <div className="flex flex-col">
            <label htmlFor="reason" className="mb-1 font-medium text-sm">
              Reason
            </label>
            <input
              type="text"
              id="reason"
              name="reason"
              placeholder="Enter reason"
              value={form.reason}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label htmlFor="status" className="mb-1 font-medium text-sm">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Status</option>
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </form>

        {/* Buttons: Save, Refresh, Report */}
        <div className="mt-6 flex space-x-4 justify-start">
          <button
            type="button"
            onClick={handleSave}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            aria-label="Save Employee Leave"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
            aria-label="Refresh Form"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={handleReport}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            aria-label="Generate Report"
          >
            Report
          </button>
        </div>
      </section>

      {/* Table Section */}
      <section className="bg-white rounded shadow p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Employee ID</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Employee Name</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Leave Type</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">From Date</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">To Date</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-semibold">Days</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Reason</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    No records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((leave) => (
                  <tr key={leave.id} className="even:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2">{leave.employeeId}</td>
                    <td className="border border-gray-300 px-3 py-2">{leave.employeeName}</td>
                    <td className="border border-gray-300 px-3 py-2">{leave.leaveType}</td>
                    <td className="border border-gray-300 px-3 py-2">{leave.fromDate}</td>
                    <td className="border border-gray-300 px-3 py-2">{leave.toDate}</td>
                    <td className="border border-gray-300 px-3 py-2 text-center">{leave.days}</td>
                    <td className="border border-gray-300 px-3 py-2">{leave.reason}</td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          leave.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : leave.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                        aria-label={`Status: ${leave.status}`}
                      >
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <nav
          className="flex justify-between items-center mt-4"
          aria-label="Table Pagination"
        >
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-semibold">{paginatedData.length}</span> of{" "}
            <span className="font-semibold">{filteredData.length}</span> entries
          </p>
          <ul className="inline-flex items-center -space-x-px">
            <li>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-l border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Previous Page"
              >
                Previous
              </button>
            </li>
            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page}>
                <button
                  onClick={() => goToPage(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`px-3 py-1 border border-gray-300 text-sm ${
                    page === currentPage
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  aria-label={`Go to page ${page}`}
                >
                  {page}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-3 py-1 rounded-r border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Next Page"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </section>
    </div>
  );
}