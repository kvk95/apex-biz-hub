import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const categories = [
  "All",
  "Smartphones",
  "Headphones",
  "Laptops",
  "Accessories",
];

const SoldStock: React.FC = () => { 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("SoldStock");
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

  // Filters state
  const [invoiceIdFilter, setInvoiceIdFilter] = useState("");
  const [stockIdFilter, setStockIdFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [customerNameFilter, setCustomerNameFilter] = useState("");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtered data based on filters
  const filteredData = useMemo(() => {
    return data.filter((item: any) => {
      if (
        invoiceIdFilter &&
        !item.invoiceId.toLowerCase().includes(invoiceIdFilter.toLowerCase())
      )
        return false;
      if (
        stockIdFilter &&
        !item.stockId.toLowerCase().includes(stockIdFilter.toLowerCase())
      )
        return false;
      if (categoryFilter !== "All" && item.category !== categoryFilter)
        return false;
      if (
        customerNameFilter &&
        !item.customerName.toLowerCase().includes(customerNameFilter.toLowerCase())
      )
        return false;
      if (dateFromFilter && item.date < dateFromFilter) return false;
      if (dateToFilter && item.date > dateToFilter) return false;
      return true;
    });
  }, [
    data,
    invoiceIdFilter,
    stockIdFilter,
    categoryFilter,
    customerNameFilter,
    dateFromFilter,
    dateToFilter,
  ]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  // Handlers
  const handleResetFilters = () => {
    setInvoiceIdFilter("");
    setStockIdFilter("");
    setCategoryFilter("All");
    setCustomerNameFilter("");
    setDateFromFilter("");
    setDateToFilter("");
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    // For demo, just reset filters and page
    handleResetFilters();
  };

  const handleReport = () => {
    // For demo, alert report generation
    alert("Report generated for current filtered data.");
  };

  // Pagination button handlers
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6 text-gray-900">Sold Stock</h1>

      {/* Filters Section */}
      <section className="mb-6 bg-white shadow rounded p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4"
          aria-label="Filter Sold Stock"
        >
          {/* Invoice ID */}
          <div>
            <label
              htmlFor="invoiceId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Invoice ID
            </label>
            <input
              id="invoiceId"
              type="text"
              value={invoiceIdFilter}
              onChange={(e) => setInvoiceIdFilter(e.target.value)}
              placeholder="Invoice ID"
              className="block w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Stock ID */}
          <div>
            <label
              htmlFor="stockId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Stock ID
            </label>
            <input
              id="stockId"
              type="text"
              value={stockIdFilter}
              onChange={(e) => setStockIdFilter(e.target.value)}
              placeholder="Stock ID"
              className="block w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
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
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Customer Name */}
          <div>
            <label
              htmlFor="customerName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Customer Name
            </label>
            <input
              id="customerName"
              type="text"
              value={customerNameFilter}
              onChange={(e) => setCustomerNameFilter(e.target.value)}
              placeholder="Customer Name"
              className="block w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Date From */}
          <div>
            <label
              htmlFor="dateFrom"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date From
            </label>
            <input
              id="dateFrom"
              type="date"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
              className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
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
              id="dateTo"
              type="date"
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
              className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Buttons Row */}
          <div className="md:col-span-3 lg:col-span-6 flex flex-wrap gap-3 mt-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Search Sold Stock"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center justify-center rounded border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Reset Filters"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center justify-center rounded border border-green-600 bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Refresh Data"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center justify-center rounded border border-yellow-600 bg-yellow-400 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              aria-label="Generate Report"
            >
              Report
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-white shadow rounded p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                  Invoice ID
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                  Stock ID
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                  Product Name
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                  Category
                </th>
                <th className="px-4 py-2 text-right font-medium text-gray-700 whitespace-nowrap">
                  Quantity
                </th>
                <th className="px-4 py-2 text-right font-medium text-gray-700 whitespace-nowrap">
                  Unit Price ($)
                </th>
                <th className="px-4 py-2 text-right font-medium text-gray-700 whitespace-nowrap">
                  Total Price ($)
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                  Customer Name
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-6 text-center text-gray-500 italic"
                  >
                    No sold stock found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item: any, idx: number) => (
                  <tr
                    key={item.invoiceId + item.stockId}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-2 whitespace-nowrap">{item.invoiceId}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{item.stockId}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{item.productName}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{item.category}</td>
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      {item.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      {item.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">{item.customerName}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{item.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <nav
          className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4"
          aria-label="Pagination"
        >
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
              aria-label="Previous Page"
            >
              Previous
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`relative ml-3 inline-flex items-center rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                currentPage === totalPages || totalPages === 0
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
              aria-label="Next Page"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
            <ul className="inline-flex -space-x-px rounded-md shadow-sm">
              <li>
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                    currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  aria-label="Previous Page"
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
              </li>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page}>
                  <button
                    onClick={() => goToPage(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium focus:z-20 ${
                      page === currentPage
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                </li>
              ))}

              <li>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                    currentPage === totalPages || totalPages === 0
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                  aria-label="Next Page"
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
              </li>
            </ul>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:justify-end">
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredData.length)}
              </span>{" "}
              of <span className="font-medium">{filteredData.length}</span> results
            </p>
          </div>
        </nav>
      </section>
    </div>
  );
};

export default SoldStock;