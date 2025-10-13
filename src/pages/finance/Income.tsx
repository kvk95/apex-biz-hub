import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";

const categories = ["All", "Sales", "Service"];
const accounts = ["All", "Cash", "Bank"];
const paymentMethods = ["All", "Cash", "Card"];

const ITEMS_PER_PAGE = 5;

export default function Income() {
  // Page title as in reference: "Income"
  useEffect(() => {
    document.title = "Income";
  }, []);

  // Filters state
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterAccount, setFilterAccount] = useState("All");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("All");
  const [searchInvoice, setSearchInvoice] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // API call and state variables
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Income");
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

  // Filtered and searched data memoized
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (filterDateFrom && item.date < filterDateFrom) return false;
      if (filterDateTo && item.date > filterDateTo) return false;
      if (filterCategory !== "All" && item.category !== filterCategory)
        return false;
      if (filterAccount !== "All" && item.account !== filterAccount) return false;
      if (
        filterPaymentMethod !== "All" &&
        item.paymentMethod !== filterPaymentMethod
      )
        return false;
      if (
        searchInvoice.trim() &&
        !item.invoiceId.toLowerCase().includes(searchInvoice.toLowerCase())
      )
        return false;
      return true;
    });
  }, [
    filterDateFrom,
    filterDateTo,
    filterCategory,
    filterAccount,
    filterPaymentMethod,
    searchInvoice,
    data,
  ]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handlers
  const handleResetFilters = () => {
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterCategory("All");
    setFilterAccount("All");
    setFilterPaymentMethod("All");
    setSearchInvoice("");
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    // For demo, just reset filters and page
    handleResetFilters();
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <h1 className="text-3xl font-semibold mb-6">Income</h1>

        {/* Filter Section */}
        <section className="bg-white rounded shadow p-6 mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
            className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end"
          >
            {/* Date From */}
            <div>
              <label
                htmlFor="dateFrom"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date From
              </label>
              <input
                type="date"
                id="dateFrom"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>

            {/* Date To */}
            <div>
              <label
                htmlFor="dateTo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date To
              </label>
              <input
                type="date"
                id="dateTo"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                id="category"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Account */}
            <div>
              <label
                htmlFor="account"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Account
              </label>
              <select
                id="account"
                value={filterAccount}
                onChange={(e) => setFilterAccount(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                {accounts.map((acc) => (
                  <option key={acc} value={acc}>
                    {acc}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label
                htmlFor="paymentMethod"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Payment Method
              </label>
              <select
                id="paymentMethod"
                value={filterPaymentMethod}
                onChange={(e) => setFilterPaymentMethod(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                {paymentMethods.map((pm) => (
                  <option key={pm} value={pm}>
                    {pm}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Invoice */}
            <div className="md:col-span-2">
              <label
                htmlFor="searchInvoice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Invoice
              </label>
              <input
                type="text"
                id="searchInvoice"
                placeholder="Invoice ID"
                value={searchInvoice}
                onChange={(e) => setSearchInvoice(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-2 md:col-span-4">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <i className="fas fa-search mr-2" aria-hidden="true"></i> Search
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm font-medium rounded shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <i className="fas fa-undo-alt mr-2" aria-hidden="true"></i> Reset
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded shadow focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <i className="fas fa-sync-alt mr-2" aria-hidden="true"></i> Refresh
              </button>
            </div>
          </form>
        </section>

        {/* Income Table Section */}
        <section className="bg-white rounded shadow p-6">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left font-semibold text-gray-700"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left font-semibold text-gray-700"
                    >
                      Invoice ID
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left font-semibold text-gray-700"
                    >
                      Customer
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left font-semibold text-gray-700"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left font-semibold text-gray-700"
                    >
                      Account
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right font-semibold text-gray-700"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left font-semibold text-gray-700"
                    >
                      Payment Method
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left font-semibold text-gray-700"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-center font-semibold text-gray-700"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-6 text-center text-gray-500 italic"
                      >
                        No income records found.
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">{item.date}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{item.invoiceId}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{item.customer}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{item.category}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{item.account}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-right font-mono">
                          ${item.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {item.paymentMethod}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{item.description}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-center space-x-2">
                          <button
                            type="button"
                            title="Edit"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <i className="fas fa-edit" aria-hidden="true"></i>
                          </button>
                          <button
                            type="button"
                            title="Delete"
                            className="text-red-600 hover:text-red-900"
                          >
                            <i className="fas fa-trash-alt" aria-hidden="true"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          {/* Pagination */}
          <nav
            className="mt-6 flex justify-between items-center"
            aria-label="Pagination"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed bg-gray-100"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              aria-label="Previous page"
            >
              <i className="fas fa-chevron-left mr-2" aria-hidden="true"></i> Prev
            </button>

            <ul className="inline-flex -space-x-px text-sm font-medium">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page}>
                  <button
                    onClick={() => handlePageChange(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`px-3 py-1 border border-gray-300 ${
                      page === currentPage
                        ? "bg-indigo-600 text-white cursor-default"
                        : "text-gray-700 hover:bg-gray-200"
                    } rounded-md`}
                  >
                    {page}
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${
                currentPage === totalPages || totalPages === 0
                  ? "text-gray-400 cursor-not-allowed bg-gray-100"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              aria-label="Next page"
            >
              Next <i className="fas fa-chevron-right ml-2" aria-hidden="true"></i>
            </button>
          </nav>
        </section>
      </div>
    </div>
  );
}