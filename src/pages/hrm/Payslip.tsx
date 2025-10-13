import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const ITEMS_PER_PAGE = 5;

export default function Payslip() {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Payslip");
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

  const totalSalary = data.salaryDetails?.reduce(
    (acc: number, cur: { amount: number }) => acc + cur.amount,
    0
  ) ?? 0;
  const totalDeductions = data.deductions?.reduce(
    (acc: number, cur: { amount: number }) => acc + cur.amount,
    0
  ) ?? 0;
  const netSalary = totalSalary - totalDeductions;

  const totalPages = Math.ceil((data.transactions?.length ?? 0) / ITEMS_PER_PAGE);
  const paginatedTransactions = data.transactions?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  ) ?? [];

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const refreshPage = () => {
    setCurrentPage(1);
  };

  const savePayslip = () => {
    alert("Payslip saved (dummy action).");
  };

  const generateReport = () => {
    alert("Report generated (dummy action).");
  };

  return (
    <>
      <title>Payslip - Dreams Technologies</title>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
        <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg border border-gray-200">
          {/* Header */}
          <header className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Payslip
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {data.employee?.payslipMonth}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={refreshPage}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold transition"
                type="button"
                aria-label="Refresh"
              >
                Refresh
              </button>
              <button
                onClick={savePayslip}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-semibold transition"
                type="button"
                aria-label="Save Payslip"
              >
                Save
              </button>
              <button
                onClick={generateReport}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-semibold transition"
                type="button"
                aria-label="Generate Report"
              >
                Report
              </button>
            </div>
          </header>

          {/* Company & Employee Info */}
          <section className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-gray-200">
            {/* Company Info */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Company Information
              </h2>
              <p className="text-gray-800 font-bold text-xl">
                {data.company?.name}
              </p>
              <p className="text-gray-600">{data.company?.addressLine1}</p>
              <p className="text-gray-600">{data.company?.addressLine2}</p>
              <p className="text-gray-600">Phone: {data.company?.phone}</p>
              <p className="text-gray-600">Email: {data.company?.email}</p>
              <p className="text-gray-600">Website: {data.company?.website}</p>
            </div>

            {/* Employee Info */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Employee Information
              </h2>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <label className="font-semibold">Name:</label>
                  <span>{data.employee?.name}</span>
                </div>
                <div className="flex justify-between">
                  <label className="font-semibold">Designation:</label>
                  <span>{data.employee?.designation}</span>
                </div>
                <div className="flex justify-between">
                  <label className="font-semibold">Department:</label>
                  <span>{data.employee?.department}</span>
                </div>
                <div className="flex justify-between">
                  <label className="font-semibold">Employee ID:</label>
                  <span>{data.employee?.employeeId}</span>
                </div>
                <div className="flex justify-between">
                  <label className="font-semibold">Joining Date:</label>
                  <span>{data.employee?.joiningDate}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Salary and Deductions */}
          <section className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-gray-200">
            {/* Salary Details */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Salary Details
              </h2>
              <table className="w-full text-left border border-gray-300 rounded-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-3 border-b border-gray-300 font-semibold text-gray-700">
                      Description
                    </th>
                    <th className="py-2 px-3 border-b border-gray-300 font-semibold text-gray-700 text-right">
                      Amount ($)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.salaryDetails?.map(({ id, description, amount }: any) => (
                    <tr key={id} className="odd:bg-white even:bg-gray-50">
                      <td className="py-2 px-3 border-b border-gray-300">{description}</td>
                      <td className="py-2 px-3 border-b border-gray-300 text-right font-mono">
                        {amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-semibold text-gray-900">
                    <td className="py-2 px-3 border-t border-gray-300">Total Salary</td>
                    <td className="py-2 px-3 border-t border-gray-300 text-right font-mono">
                      {totalSalary.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Deductions */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Deductions
              </h2>
              <table className="w-full text-left border border-gray-300 rounded-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-3 border-b border-gray-300 font-semibold text-gray-700">
                      Description
                    </th>
                    <th className="py-2 px-3 border-b border-gray-300 font-semibold text-gray-700 text-right">
                      Amount ($)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.deductions?.map(({ id, description, amount }: any) => (
                    <tr key={id} className="odd:bg-white even:bg-gray-50">
                      <td className="py-2 px-3 border-b border-gray-300">{description}</td>
                      <td className="py-2 px-3 border-b border-gray-300 text-right font-mono">
                        {amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-semibold text-gray-900">
                    <td className="py-2 px-3 border-t border-gray-300">Total Deductions</td>
                    <td className="py-2 px-3 border-t border-gray-300 text-right font-mono">
                      {totalDeductions.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Net Salary */}
          <section className="p-6 border-b border-gray-200 flex justify-end">
            <div className="bg-green-50 border border-green-400 rounded-md px-6 py-4 text-green-900 font-semibold text-xl">
              Net Salary: ${netSalary.toFixed(2)}
            </div>
          </section>

          {/* Transactions Table with Pagination */}
          <section className="p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Transactions
            </h2>
            <div className="overflow-x-auto border border-gray-300 rounded-md">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">
                      Description
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700 border-b border-gray-300">
                      Amount ($)
                    </th>
                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border-b border-gray-300">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {paginatedTransactions.map(({ id, date, description, amount, type }: any) => (
                    <tr key={id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 font-mono">
                        {date}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                        {description}
                      </td>
                      <td
                        className={`px-4 py-2 whitespace-nowrap text-sm font-mono text-right ${
                          type === "Credit" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center font-semibold">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            type === "Credit"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <nav
              className="mt-4 flex justify-center items-center space-x-2"
              aria-label="Pagination"
            >
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Previous Page"
              >
                &lt;
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                const isActive = page === currentPage;
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 rounded-md border border-gray-300 ${
                      isActive
                        ? "bg-blue-600 text-white border-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Next Page"
              >
                &gt;
              </button>
            </nav>
          </section>
        </div>
      </div>
    </>
  );
}