import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const pageSize = 5;

export default function ProfitLoss() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("ProfitLoss");
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

  // Filter data by date range if set
  const filteredData = data.filter((item: any) => {
    if (fromDate && new Date(item.date) < new Date(fromDate)) return false;
    if (toDate && new Date(item.date) > new Date(toDate)) return false;
    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const pagedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Calculate totals for displayed page
  const totals = pagedData.reduce(
    (acc, item) => {
      acc.totalSales += item.totalSales;
      acc.totalPurchase += item.totalPurchase;
      acc.expense += item.expense;
      acc.profitLoss += item.profitLoss;
      return acc;
    },
    { totalSales: 0, totalPurchase: 0, expense: 0, profitLoss: 0 }
  );

  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-700">
      <title>Profit Loss - Dreams POS</title>

      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4 md:mb-0">
            Profit Loss
          </h1>
          <div className="flex space-x-2">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={handleReset}
              aria-label="Refresh"
              title="Refresh"
            >
              Refresh
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-indigo-600 rounded shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Save"
              title="Save"
              onClick={() => alert("Save functionality not implemented")}
            >
              Save
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-green-600 rounded shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Report"
              title="Report"
              onClick={() => alert("Report functionality not implemented")}
            >
              Report
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
          aria-label="Filter Profit Loss"
        >
          <div>
            <label
              htmlFor="fromDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              From Date
            </label>
            <input
              type="date"
              id="fromDate"
              name="fromDate"
              className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              aria-required="false"
            />
          </div>
          <div>
            <label
              htmlFor="toDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              To Date
            </label>
            <input
              type="date"
              id="toDate"
              name="toDate"
              className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              aria-required="false"
            />
          </div>
          <div className="md:col-span-2 flex space-x-2">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-indigo-600 rounded shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Search"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Reset"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Table Section */}
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left font-semibold text-gray-700"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right font-semibold text-gray-700"
                >
                  Total Sales
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right font-semibold text-gray-700"
                >
                  Total Purchase
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right font-semibold text-gray-700"
                >
                  Expense
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right font-semibold text-gray-700"
                >
                  Profit / Loss
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pagedData.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-gray-500 italic"
                  >
                    No data available for selected date range.
                  </td>
                </tr>
              )}
              {pagedData.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">{item.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    {item.totalSales.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    {item.totalPurchase.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    {item.expense.toLocaleString()}
                  </td>
                  <td
                    className={`px-4 py-3 whitespace-nowrap text-right font-semibold ${
                      item.profitLoss >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.profitLoss.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Footer Totals */}
            {pagedData.length > 0 && (
              <tfoot className="bg-gray-100 font-semibold text-gray-900">
                <tr>
                  <td className="px-4 py-3 text-left">Total</td>
                  <td className="px-4 py-3 text-right">
                    {totals.totalSales.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {totals.totalPurchase.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {totals.expense.toLocaleString()}
                  </td>
                  <td
                    className={`px-4 py-3 text-right ${
                      totals.profitLoss >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {totals.profitLoss.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            className="mt-4 flex justify-center space-x-1"
            aria-label="Pagination"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border ${
                currentPage === 1
                  ? "border-gray-300 text-gray-400 cursor-not-allowed"
                  : "border-indigo-600 text-indigo-600 hover:bg-indigo-100"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              aria-label="Previous Page"
            >
              &lt;
            </button>
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`px-3 py-1 rounded border ${
                    page === currentPage
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-gray-300 text-gray-700 hover:bg-indigo-100"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border ${
                currentPage === totalPages
                  ? "border-gray-300 text-gray-400 cursor-not-allowed"
                  : "border-indigo-600 text-indigo-600 hover:bg-indigo-100"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              aria-label="Next Page"
            >
              &gt;
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}