import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

type EmployeeSalaryRecord = {
  id: number;
  employeeName: string;
  employeeId: string;
  month: string;
  year: string;
  salary: number;
  advance: number;
  deduction: number;
  netSalary: number;
  paymentStatus: "Paid" | "Unpaid";
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = ["2023", "2022", "2021", "2020"];

export default function EmployeeSalary() {
  // Page title as per reference page
  React.useEffect(() => {
    document.title = "Employee Salary - Dreams POS";
  }, []);

  // Form state
  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [salary, setSalary] = useState("");
  const [advance, setAdvance] = useState("");
  const [deduction, setDeduction] = useState("");
  const [netSalary, setNetSalary] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Paid");

  // Data state and API loading state
  const [data, setData] = useState<EmployeeSalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from API
  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<EmployeeSalaryRecord[]>("EmployeeSalary");
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

  // Table pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Calculate total pages
  const totalPages = Math.ceil(data.length / recordsPerPage);

  // Paginated data slice
  const currentRecords = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    return data.slice(start, start + recordsPerPage);
  }, [currentPage, data]);

  // Handlers
  const handleReset = () => {
    setEmployeeName("");
    setEmployeeId("");
    setMonth("");
    setYear("");
    setSalary("");
    setAdvance("");
    setDeduction("");
    setNetSalary("");
    setPaymentStatus("Paid");
  };

  // Calculate net salary automatically when salary, advance or deduction changes
  React.useEffect(() => {
    const sal = parseFloat(salary) || 0;
    const adv = parseFloat(advance) || 0;
    const ded = parseFloat(deduction) || 0;
    const net = sal - adv - ded;
    setNetSalary(net > 0 ? net.toFixed(2) : "0.00");
  }, [salary, advance, deduction]);

  // Dummy handlers for buttons (Save, Refresh, Report)
  const handleSave = () => {
    alert("Save functionality is not implemented in this demo.");
  };
  const handleRefresh = () => {
    alert("Refresh functionality is not implemented in this demo.");
  };
  const handleReport = () => {
    alert("Report functionality is not implemented in this demo.");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6">Employee Salary</h1>

      {/* Form Section */}
      <section className="bg-white rounded shadow p-6 mb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-6"
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Employee Name */}
            <div>
              <label
                htmlFor="employeeName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Employee Name
              </label>
              <input
                id="employeeName"
                type="text"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-600 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Employee Name"
                required
              />
            </div>

            {/* Employee ID */}
            <div>
              <label
                htmlFor="employeeId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Employee ID
              </label>
              <input
                id="employeeId"
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-600 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Employee ID"
                required
              />
            </div>

            {/* Month */}
            <div>
              <label
                htmlFor="month"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Month
              </label>
              <select
                id="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 bg-white focus:border-blue-600 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              >
                <option value="" disabled>
                  Select Month
                </option>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Year
              </label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 bg-white focus:border-blue-600 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              >
                <option value="" disabled>
                  Select Year
                </option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Salary */}
            <div>
              <label
                htmlFor="salary"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Salary
              </label>
              <input
                id="salary"
                type="number"
                min="0"
                step="0.01"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-600 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Salary"
                required
              />
            </div>

            {/* Advance */}
            <div>
              <label
                htmlFor="advance"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Advance
              </label>
              <input
                id="advance"
                type="number"
                min="0"
                step="0.01"
                value={advance}
                onChange={(e) => setAdvance(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-600 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Advance"
              />
            </div>

            {/* Deduction */}
            <div>
              <label
                htmlFor="deduction"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Deduction
              </label>
              <input
                id="deduction"
                type="number"
                min="0"
                step="0.01"
                value={deduction}
                onChange={(e) => setDeduction(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-600 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Deduction"
              />
            </div>

            {/* Net Salary (readonly) */}
            <div>
              <label
                htmlFor="netSalary"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Net Salary
              </label>
              <input
                id="netSalary"
                type="text"
                value={netSalary}
                readOnly
                className="block w-full rounded border border-gray-300 bg-gray-100 px-3 py-2 cursor-not-allowed"
                placeholder="Net Salary"
              />
            </div>

            {/* Payment Status */}
            <div>
              <label
                htmlFor="paymentStatus"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Payment Status
              </label>
              <select
                id="paymentStatus"
                value={paymentStatus}
                onChange={(e) =>
                  setPaymentStatus(e.target.value as "Paid" | "Unpaid")
                }
                className="block w-full rounded border border-gray-300 px-3 py-2 bg-white focus:border-blue-600 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              >
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 justify-start pt-4">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
            >
              Report
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
                <th className="px-4 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                  Employee Name
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                  Employee ID
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                  Month
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                  Year
                </th>
                <th className="px-4 py-2 text-right font-medium text-gray-700 whitespace-nowrap">
                  Salary
                </th>
                <th className="px-4 py-2 text-right font-medium text-gray-700 whitespace-nowrap">
                  Advance
                </th>
                <th className="px-4 py-2 text-right font-medium text-gray-700 whitespace-nowrap">
                  Deduction
                </th>
                <th className="px-4 py-2 text-right font-medium text-gray-700 whitespace-nowrap">
                  Net Salary
                </th>
                <th className="px-4 py-2 text-center font-medium text-gray-700 whitespace-nowrap">
                  Payment Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">{record.employeeName}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{record.employeeId}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{record.month}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{record.year}</td>
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    ${record.salary.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    ${record.advance.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    ${record.deduction.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    ${record.netSalary.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        record.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {record.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {currentRecords.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-6 text-center text-gray-500 italic"
                  >
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <nav
          className="flex items-center justify-between border-t border-gray-200 px-4 py-3 mt-4"
          aria-label="Pagination"
        >
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * recordsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * recordsPerPage, data.length)}
                </span>{" "}
                of <span className="font-medium">{data.length}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                    currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  aria-label="First"
                >
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 19l-7-7 7-7M18 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                    currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  aria-label="Previous"
                >
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? "z-10 bg-blue-600 text-white border-blue-600"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                    currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  aria-label="Next"
                >
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                    currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  aria-label="Last"
                >
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M6 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </nav>
      </section>
    </div>
  );
}