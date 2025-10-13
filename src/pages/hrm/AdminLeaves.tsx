import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const leaveTypes = [
  "Casual Leave",
  "Sick Leave",
  "Earned Leave",
  "Maternity Leave",
  "Paternity Leave",
];

const statuses = ["All", "Approved", "Pending", "Rejected"];

export default function AdminLeaves() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("AdminLeaves");
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

  // Filter and form state
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterLeaveType, setFilterLeaveType] = useState("All");
  const [searchName, setSearchName] = useState("");

  // Form inputs for Add Leave
  const [formData, setFormData] = useState({
    employeeName: "",
    leaveType: "",
    fromDate: "",
    toDate: "",
    noOfDays: "",
    reason: "",
    status: "Pending",
  });

  // Handle pagination change
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Filtered and searched data
  const filteredLeaves = useMemo(() => {
    return data.filter((leave: any) => {
      const statusMatch =
        filterStatus === "All" ? true : leave.status === filterStatus;
      const leaveTypeMatch =
        filterLeaveType === "All" ? true : leave.leaveType === filterLeaveType;
      const nameMatch = leave.employeeName
        .toLowerCase()
        .includes(searchName.toLowerCase());
      return statusMatch && leaveTypeMatch && nameMatch;
    });
  }, [filterStatus, filterLeaveType, searchName, data]);

  // Paginated data
  const paginatedLeaves = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLeaves.slice(start, start + itemsPerPage);
  }, [filteredLeaves, currentPage]);

  // Handlers
  const handlePageChange = (page: number) => {
    if (page < 1 || page > Math.ceil(filteredLeaves.length / itemsPerPage))
      return;
    setCurrentPage(page);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleAddLeave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Leave request saved (mock)");
    setFormData({
      employeeName: "",
      leaveType: "",
      fromDate: "",
      toDate: "",
      noOfDays: "",
      reason: "",
      status: "Pending",
    });
  };

  const handleRefresh = () => {
    setFilterStatus("All");
    setFilterLeaveType("All");
    setSearchName("");
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generated (mock)");
  };

  return (
    <>
      <title>Admin Leaves - DreamsPOS</title>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
        <div className="container mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-semibold text-gray-900 mb-3 md:mb-0">
              Admin Leaves
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={handleReport}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 py-2 rounded transition"
                title="Generate Report"
              >
                <i className="fa fa-file-pdf-o mr-2" aria-hidden="true"></i> Report
              </button>
              <button
                onClick={handleRefresh}
                className="flex items-center bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm font-semibold px-3 py-2 rounded transition"
                title="Refresh"
              >
                <i className="fa fa-refresh mr-2" aria-hidden="true"></i> Refresh
              </button>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded shadow p-4 mb-6">
            <form className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label
                  htmlFor="filterStatus"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Leave Status
                </label>
                <select
                  id="filterStatus"
                  name="filterStatus"
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="filterLeaveType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Leave Type
                </label>
                <select
                  id="filterLeaveType"
                  name="filterLeaveType"
                  value={filterLeaveType}
                  onChange={(e) => {
                    setFilterLeaveType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All</option>
                  {leaveTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="searchName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Employee Name
                </label>
                <input
                  type="text"
                  id="searchName"
                  name="searchName"
                  value={searchName}
                  onChange={(e) => {
                    setSearchName(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by name"
                  className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-3 py-2 rounded transition"
                >
                  Clear Filters
                </button>
              </div>
            </form>
          </div>

          {/* Leaves Table */}
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                    Employee Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                    Leave Type
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                    From Date
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                    To Date
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700 whitespace-nowrap">
                    No. of Days
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                    Reason
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700 whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700 whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedLeaves.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No leaves found.
                    </td>
                  </tr>
                ) : (
                  paginatedLeaves.map((leave: any) => (
                    <tr key={leave.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        {leave.employeeName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {leave.leaveType}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {leave.fromDate}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {leave.toDate}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        {leave.noOfDays}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{leave.reason}</td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            leave.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : leave.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {leave.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap space-x-2">
                        <button
                          title="Edit"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() =>
                            alert(
                              `Edit leave for ${leave.employeeName} (mock action)`
                            )
                          }
                        >
                          <i className="fa fa-pencil" aria-hidden="true"></i>
                        </button>
                        <button
                          title="Delete"
                          className="text-red-600 hover:text-red-800"
                          onClick={() =>
                            alert(
                              `Delete leave for ${leave.employeeName} (mock action)`
                            )
                          }
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
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-semibold">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold">
                {Math.min(currentPage * itemsPerPage, filteredLeaves.length)}
              </span>{" "}
              of <span className="font-semibold">{filteredLeaves.length}</span>{" "}
              entries
            </div>
            <nav
              className="inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}
                aria-label="Previous"
              >
                <i className="fa fa-chevron-left" aria-hidden="true"></i>
              </button>
              {Array.from(
                {
                  length: Math.ceil(filteredLeaves.length / itemsPerPage),
                },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === currentPage
                      ? "z-10 bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                  currentPage === totalPages || totalPages === 0
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
                aria-label="Next"
              >
                <i className="fa fa-chevron-right" aria-hidden="true"></i>
              </button>
            </nav>
          </div>

          {/* Add Leave Form */}
          <div className="mt-10 bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Add Leave
            </h2>
            <form
              onSubmit={handleAddLeave}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div>
                <label
                  htmlFor="employeeName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Employee Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="employeeName"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleInputChange}
                  required
                  className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter employee name"
                />
              </div>
              <div>
                <label
                  htmlFor="leaveType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Leave Type <span className="text-red-600">*</span>
                </label>
                <select
                  id="leaveType"
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleInputChange}
                  required
                  className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select leave type</option>
                  {leaveTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="fromDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  From Date <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  id="fromDate"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleInputChange}
                  required
                  className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="toDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  To Date <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  id="toDate"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleInputChange}
                  required
                  className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="noOfDays"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  No. of Days <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  id="noOfDays"
                  name="noOfDays"
                  min={1}
                  value={formData.noOfDays}
                  onChange={handleInputChange}
                  required
                  className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter number of days"
                />
              </div>
              <div className="md:col-span-3">
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Reason <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Enter reason for leave"
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status <span className="text-red-600">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statuses
                    .filter((s) => s !== "All")
                    .map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                </select>
              </div>
              <div className="md:col-span-3 flex justify-end space-x-3 pt-4">
                <button
                  type="reset"
                  onClick={() =>
                    setFormData({
                      employeeName: "",
                      leaveType: "",
                      fromDate: "",
                      toDate: "",
                      noOfDays: "",
                      reason: "",
                      status: "Pending",
                    })
                  }
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-5 py-2 rounded transition"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}