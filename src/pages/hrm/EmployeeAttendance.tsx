import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const departments = [
  { label: "All Departments", value: "" },
  { label: "Sales", value: "Sales" },
  { label: "Marketing", value: "Marketing" },
  { label: "HR", value: "HR" },
  { label: "IT", value: "IT" },
  { label: "Finance", value: "Finance" },
];

const statuses = [
  { label: "All Status", value: "" },
  { label: "Present", value: "Present" },
  { label: "Absent", value: "Absent" },
  { label: "Late", value: "Late" },
];

const pageSizeOptions = [5, 10, 20];

export default function EmployeeAttendance() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchText, setSearchText] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("");

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("EmployeeAttendance");
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

  // Filtered and searched data
  const filteredData = useMemo(() => {
    return data
      .filter((emp) =>
        emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchText.toLowerCase())
      )
      .filter((emp) =>
        selectedDepartment ? emp.department === selectedDepartment : true
      )
      .filter((emp) => (selectedStatus ? emp.status === selectedStatus : true))
      .filter((emp) => (dateFilter ? emp.date === dateFilter : true));
  }, [data, searchText, selectedDepartment, selectedStatus, dateFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    setSearchText("");
    setSelectedDepartment("");
    setSelectedStatus("");
    setDateFilter("");
    setCurrentPage(1);
    setPageSize(5);
  };

  const handleReport = () => {
    alert("Report generation is not implemented in this demo.");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      <title>Employee Attendance</title>

      <h1 className="text-2xl font-semibold mb-6">Employee Attendance</h1>

      {/* Filters Section */}
      <section className="bg-white rounded shadow p-6 mb-6">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
        >
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by Name or ID"
              value={searchText}
              onChange={handleSearchChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Department
            </label>
            <select
              id="department"
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {departments.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id="status"
              value={selectedStatus}
              onChange={handleStatusChange}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date
            </label>
            <input
              id="date"
              type="date"
              value={dateFilter}
              onChange={handleDateChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Refresh"
            >
              <i className="fas fa-sync-alt mr-2" aria-hidden="true"></i> Refresh
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Generate Report"
            >
              <i className="fas fa-file-alt mr-2" aria-hidden="true"></i> Report
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-white rounded shadow p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Employee ID
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Department
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Check In
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Check Out
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-6 text-center text-gray-500 italic"
                  >
                    No records found.
                  </td>
                </tr>
              )}
              {paginatedData.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{emp.employeeId}</td>
                  <td className="px-4 py-3">{emp.name}</td>
                  <td className="px-4 py-3">{emp.department}</td>
                  <td className="px-4 py-3">{emp.date}</td>
                  <td className="px-4 py-3">{emp.checkIn}</td>
                  <td className="px-4 py-3">{emp.checkOut}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        emp.status === "Present"
                          ? "bg-green-100 text-green-800"
                          : emp.status === "Absent"
                          ? "bg-red-100 text-red-800"
                          : emp.status === "Late"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      type="button"
                      title="Edit"
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={() =>
                        alert(
                          `Edit functionality not implemented. Employee: ${emp.name}`
                        )
                      }
                    >
                      <i className="fas fa-edit" aria-hidden="true"></i>
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      className="text-red-600 hover:text-red-900"
                      onClick={() =>
                        alert(
                          `Delete functionality not implemented. Employee: ${emp.name}`
                        )
                      }
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
        <div className="mt-4 flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <nav
            className="inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
              aria-label="Previous"
            >
              <i className="fas fa-chevron-left" aria-hidden="true"></i>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    page === currentPage
                      ? "z-10 bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                currentPage === totalPages || totalPages === 0
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
              aria-label="Next"
            >
              <i className="fas fa-chevron-right" aria-hidden="true"></i>
            </button>
          </nav>
        </div>
      </section>
    </div>
  );
}