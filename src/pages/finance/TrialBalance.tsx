import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const pageSize = 10;

const accountsOptions = [
  "Cash",
  "Accounts Receivable",
  "Inventory",
  "Prepaid Expenses",
  "Accounts Payable",
  "Notes Payable",
  "Owner's Equity",
  "Sales Revenue",
  "Service Revenue",
  "Salaries Expense",
  "Rent Expense",
  "Utilities Expense",
  "Depreciation Expense",
  "Interest Expense",
  "Miscellaneous Expense",
];

export default function TrialBalance() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [accountFilter, setAccountFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("TrialBalance");
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

  // Filtered data based on account filter and search term
  const filteredData = useMemo(() => {
    return data.filter((item: any) => {
      const matchesAccount =
        accountFilter === "" || item.accountName === accountFilter;
      const matchesSearch =
        searchTerm === "" ||
        item.accountName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesAccount && matchesSearch;
    });
  }, [accountFilter, searchTerm, data]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  // Totals for the current filtered data (all pages)
  const totalDebit = filteredData.reduce((acc, cur) => acc + cur.debit, 0);
  const totalCredit = filteredData.reduce((acc, cur) => acc + cur.credit, 0);

  // Handlers
  const onRefresh = () => {
    setFromDate("");
    setToDate("");
    setAccountFilter("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const onReport = () => {
    alert("Report generated (placeholder)");
  };

  const onSave = () => {
    alert("Save action triggered (placeholder)");
  };

  const onPageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <div className="container mx-auto px-4 py-6">
        {/* Title */}
        <h1 className="text-2xl font-semibold mb-6">Trial Balance</h1>

        {/* Filters Section */}
        <div className="bg-white rounded shadow p-6 mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
            className="flex flex-wrap gap-4 items-end"
          >
            {/* From Date */}
            <div className="flex flex-col">
              <label
                htmlFor="fromDate"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                From Date
              </label>
              <input
                type="date"
                id="fromDate"
                name="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* To Date */}
            <div className="flex flex-col">
              <label
                htmlFor="toDate"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                To Date
              </label>
              <input
                type="date"
                id="toDate"
                name="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Account Dropdown */}
            <div className="flex flex-col min-w-[180px]">
              <label
                htmlFor="account"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Account
              </label>
              <select
                id="account"
                name="account"
                value={accountFilter}
                onChange={(e) => setAccountFilter(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Accounts</option>
                {accountsOptions.map((acc) => (
                  <option key={acc} value={acc}>
                    {acc}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="flex flex-col flex-grow min-w-[200px]">
              <label
                htmlFor="search"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Search
              </label>
              <input
                type="text"
                id="search"
                name="search"
                placeholder="Search Account"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded flex items-center gap-2"
                title="Search"
              >
                <i className="fa fa-search" aria-hidden="true"></i> Search
              </button>
              <button
                type="button"
                onClick={onRefresh}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded flex items-center gap-2"
                title="Refresh"
              >
                <i className="fa fa-refresh" aria-hidden="true"></i> Refresh
              </button>
              <button
                type="button"
                onClick={onReport}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded flex items-center gap-2"
                title="Report"
              >
                <i className="fa fa-file-pdf-o" aria-hidden="true"></i> Report
              </button>
              <button
                type="button"
                onClick={onSave}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded flex items-center gap-2"
                title="Save"
              >
                <i className="fa fa-floppy-o" aria-hidden="true"></i> Save
              </button>
            </div>
          </form>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Account Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-700">
                  Debit
                </th>
                <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-700">
                  Credit
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-6 text-gray-500 italic text-sm"
                  >
                    No data found.
                  </td>
                </tr>
              )}
              {paginatedData.map((row, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">
                    {row.accountName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-right text-gray-800">
                    {row.debit.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-right text-gray-800">
                    {row.credit.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-semibold text-gray-900">
                <td className="border border-gray-300 px-4 py-2 text-right">
                  Total
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {totalDebit.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {totalCredit.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pagination Controls */}
        <nav
          className="flex justify-between items-center mt-4"
          aria-label="Pagination"
        >
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Previous page"
          >
            <i className="fa fa-chevron-left mr-1" aria-hidden="true"></i> Prev
          </button>

          <ul className="inline-flex -space-x-px">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page}>
                <button
                  onClick={() => onPageChange(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`px-3 py-1.5 border border-gray-300 text-sm font-medium ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium ${
              currentPage === totalPages || totalPages === 0
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Next page"
          >
            Next <i className="fa fa-chevron-right ml-1" aria-hidden="true"></i>
          </button>
        </nav>
      </div>
    </div>
  );
}