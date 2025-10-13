import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const pageSize = 7;

export default function BalanceSheet() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("BalanceSheet");
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

  const totalPages = Math.ceil(data.length / pageSize);

  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalDebit = data.reduce((sum, item) => sum + item.debit, 0);
  const totalCredit = data.reduce((sum, item) => sum + item.credit, 0);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    loadData();
  };

  const handleSave = () => {
    alert("Balance sheet saved");
  };

  const handleReport = () => {
    alert("Report generated");
  };

  return (
    <>
      <title>Balance Sheet - Dreams POS</title>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">Balance Sheet</h1>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={handleReport}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Report"
              >
                <i className="fas fa-file-alt mr-2"></i> Report
              </button>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Refresh"
              >
                <i className="fas fa-sync-alt mr-2"></i> Refresh
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                title="Save"
              >
                <i className="fas fa-save mr-2"></i> Save
              </button>
            </div>
          </div>

          {/* Filters Section */}
          <section className="bg-white rounded shadow p-6 mb-6">
            <form className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                  className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
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
                  className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="accountType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Account Type
                </label>
                <select
                  id="accountType"
                  name="accountType"
                  className="block w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Account Type
                  </option>
                  <option value="asset">Asset</option>
                  <option value="liability">Liability</option>
                  <option value="equity">Equity</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
            </form>
          </section>

          {/* Balance Sheet Table */}
          <section className="bg-white rounded shadow p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left font-semibold text-gray-700"
                    >
                      Account Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right font-semibold text-gray-700"
                    >
                      Debit
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right font-semibold text-gray-700"
                    >
                      Credit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedData.map(({ id, accountName, debit, credit }) => (
                    <tr key={id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {accountName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-green-700 font-medium">
                        {debit > 0 ? debit.toLocaleString("en-US", { style: "currency", currency: "USD" }) : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-red-700 font-medium">
                        {credit > 0 ? credit.toLocaleString("en-US", { style: "currency", currency: "USD" }) : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100 font-semibold text-gray-800">
                  <tr>
                    <td className="px-6 py-3 text-right">Total</td>
                    <td className="px-6 py-3 text-right text-green-900">
                      {totalDebit.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                    </td>
                    <td className="px-6 py-3 text-right text-red-900">
                      {totalCredit.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Pagination */}
            <nav
              className="mt-6 flex justify-center items-center space-x-2"
              aria-label="Pagination"
            >
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`inline-flex items-center px-3 py-1 border rounded text-sm font-medium ${
                  currentPage === 1
                    ? "text-gray-400 border-gray-300 cursor-not-allowed bg-white"
                    : "text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                }`}
                aria-label="Previous Page"
                title="Previous Page"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                const isCurrent = page === currentPage;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    aria-current={isCurrent ? "page" : undefined}
                    className={`inline-flex items-center px-3 py-1 border rounded text-sm font-medium ${
                      isCurrent
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                    }`}
                    title={`Page ${page}`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`inline-flex items-center px-3 py-1 border rounded text-sm font-medium ${
                  currentPage === totalPages
                    ? "text-gray-400 border-gray-300 cursor-not-allowed bg-white"
                    : "text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                }`}
                aria-label="Next Page"
                title="Next Page"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </nav>
          </section>
        </div>
      </div>
    </>
  );
}