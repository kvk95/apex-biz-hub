import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const departments = [
  "All Departments",
  "Sales",
  "Marketing",
  "IT",
  "HR",
  "Finance",
];

const statuses = ["All Status", "Present", "Absent", "Leave"];

export default function AdminAttendance() {
  // Page title as in reference page
  React.useEffect(() => {
    document.title = "Admin - Attendance";
  }, []);

  // Filters state
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [searchEmployee, setSearchEmployee] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // API state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("AdminAttendance");
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
    return data.filter((item) => {
      const matchesDepartment =
        selectedDepartment === "All Departments" ||
        item.department === selectedDepartment;
      const matchesStatus =
        selectedStatus === "All Status" || item.status === selectedStatus;
      const matchesEmployee =
        item.employeeName.toLowerCase().includes(searchEmployee.toLowerCase()) ||
        item.employeeId.toLowerCase().includes(searchEmployee.toLowerCase());
      const matchesDate =
        !searchDate || item.date === searchDate;

      return (
        matchesDepartment && matchesStatus && matchesEmployee && matchesDate
      );
    });
  }, [data, selectedDepartment, selectedStatus, searchEmployee, searchDate]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handlers
  const handleResetFilters = () => {
    setSelectedDepartment("All Departments");
    setSelectedStatus("All Status");
    setSearchEmployee("");
    setSearchDate("");
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    loadData();
  };

  const handleReport = () => {
    alert("Report generated");
  };

  const handleSave = () => {
    alert("Save functionality not implemented");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {/* Container */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Title */}
        <h1 className="text-3xl font-semibold mb-6">Attendance</h1>

        {/* Filters Section */}
        <div className="bg-white rounded shadow p-6 mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
            className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
          >
            {/* Department */}
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Department
              </label>
              <select
                id="department"
                name="department"
                className="block w-full rounded border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                className="block w-full rounded border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Employee Name/ID Search */}
            <div>
              <label
                htmlFor="employeeSearch"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Employee Name/ID
              </label>
              <input
                type="text"
                id="employeeSearch"
                name="employeeSearch"
                placeholder="Search by name or ID"
                className="block w-full rounded border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchEmployee}
                onChange={(e) => setSearchEmployee(e.target.value)}
              />
            </div>

            {/* Date */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                className="block w-full rounded border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-2">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Search
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mb-4">
          <button
            onClick={handleReport}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Report
          </button>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Refresh
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save
          </button>
        </div>

        {/* Attendance Table */}
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Employee ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Employee Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Department
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Designation
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  In Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Out Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                  >
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.employeeId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.employeeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.designation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.inTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.outTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                          item.status === "Present"
                            ? "bg-green-100 text-green-800"
                            : item.status === "Absent"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <nav
          className="flex justify-between items-center py-3 px-4 bg-white rounded shadow mt-4"
          aria-label="Pagination"
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              currentPage === 1
                ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                : "text-gray-700 bg-white hover:bg-gray-50"
            }`}
          >
            Previous
          </button>

          <div className="hidden sm:flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                aria-current={page === currentPage ? "page" : undefined}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                  page === currentPage
                    ? "z-10 bg-blue-600 text-white border-blue-600"
                    : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              currentPage === totalPages || totalPages === 0
                ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                : "text-gray-700 bg-white hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
}