import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const pageSize = 5;

export default function CashFlow() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchDate, setSearchDate] = useState("");
  const [searchDescription, setSearchDescription] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("CashFlow");
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

  // Filter data by search inputs
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesDate = searchDate
        ? item.date === searchDate
        : true;
      const matchesDesc = searchDescription
        ? item.description
            .toLowerCase()
            .includes(searchDescription.toLowerCase())
        : true;
      return matchesDate && matchesDesc;
    });
  }, [data, searchDate, searchDescription]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  // Handlers
  const handleRefresh = () => {
    setSearchDate("");
    setSearchDescription("");
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generated for current filtered data.");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <div className="container mx-auto px-4 py-6">
        {/* Title */}
        <h1 className="text-3xl font-semibold mb-6 text-gray-900">
          Cash Flow
        </h1>

        {/* Search & Action Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            {/* Date Filter */}
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
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>

            {/* Description Filter */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                placeholder="Search description"
                value={searchDescription}
                onChange={(e) => setSearchDescription(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 md:col-span-2 justify-start md:justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <i className="fa fa-search mr-2" aria-hidden="true"></i>
                Search
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm font-medium rounded shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <i className="fa fa-refresh mr-2" aria-hidden="true"></i>
                Refresh
              </button>
              <button
                type="button"
                onClick={handleReport}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded shadow focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <i className="fa fa-file-pdf-o mr-2" aria-hidden="true"></i>
                Report
              </button>
            </div>
          </form>
        </div>

        {/* Table Section */}
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                  Date
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                  Description
                </th>
                <th className="px-6 py-3 text-right font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                  Income
                </th>
                <th className="px-6 py-3 text-right font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                  Expense
                </th>
                <th className="px-6 py-3 text-right font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 whitespace-nowrap text-gray-700">
                      {item.date}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-gray-700">
                      {item.description}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-right text-green-600 font-semibold">
                      {item.income > 0 ? item.income.toLocaleString() : "-"}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-right text-red-600 font-semibold">
                      {item.expense > 0 ? item.expense.toLocaleString() : "-"}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-right font-semibold text-gray-900">
                      {item.balance.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-semibold">{paginatedData.length}</span> of{" "}
            <span className="font-semibold">{filteredData.length}</span> entries
          </div>
          <nav
            className="inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
              aria-label="Previous"
            >
              <i className="fa fa-chevron-left" aria-hidden="true"></i>
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              const isCurrent = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:z-20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                    isCurrent
                      ? "z-10 bg-indigo-600 border-indigo-600 text-white"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
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
      </div>
    </div>
  );
}