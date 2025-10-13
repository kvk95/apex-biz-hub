import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const paymentStatusOptions = ["All", "Paid", "Unpaid"];
const paymentMethodOptions = ["All", "Cash", "Credit Card", "Bank Transfer"];

const IncomeReport: React.FC = () => { 

  // API state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("IncomeReport");
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
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("All");
  const [paymentMethod, setPaymentMethod] = useState<string>("All");
  const [searchInvoice, setSearchInvoice] = useState<string>("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Filtered data based on filters
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Filter by date range
      if (startDate && item.date < startDate) return false;
      if (endDate && item.date > endDate) return false;

      // Filter by payment status
      if (paymentStatus !== "All" && item.paymentStatus !== paymentStatus)
        return false;

      // Filter by payment method
      if (paymentMethod !== "All" && item.paymentMethod !== paymentMethod)
        return false;

      // Filter by invoice no search (case insensitive)
      if (
        searchInvoice.trim() !== "" &&
        !item.invoiceNo.toLowerCase().includes(searchInvoice.toLowerCase())
      )
        return false;

      return true;
    });
  }, [data, startDate, endDate, paymentStatus, paymentMethod, searchInvoice]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setPaymentStatus("All");
    setPaymentMethod("All");
    setSearchInvoice("");
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    loadData();
    handleResetFilters();
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto bg-white shadow rounded-lg p-6">
        {/* Title */}
        <h1 className="text-2xl font-semibold mb-6 text-gray-900">
          Income Report
        </h1>

        {/* Filters Section */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          className="mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            {/* Date From */}
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date From
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            {/* Date To */}
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date To
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="block w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                {paymentStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
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
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="block w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                {paymentMethodOptions.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            {/* Invoice No Search */}
            <div>
              <label
                htmlFor="searchInvoice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Invoice No
              </label>
              <input
                type="text"
                id="searchInvoice"
                placeholder="Search Invoice No"
                value={searchInvoice}
                onChange={(e) => setSearchInvoice(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex space-x-3">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
            >
              <i className="fa fa-search mr-2" aria-hidden="true"></i> Search
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
            >
              <i className="fa fa-undo mr-2" aria-hidden="true"></i> Reset
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-1"
            >
              <i className="fa fa-refresh mr-2" aria-hidden="true"></i> Refresh
            </button>
          </div>
        </form>

        {/* Table Section */}
        <div className="overflow-x-auto border border-gray-300 rounded">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Invoice No
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Customer
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Payment Status
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Payment Method
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-gray-500 italic"
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => (
                  <tr
                    key={item.invoiceNo}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">{item.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-blue-600">
                      {item.invoiceNo}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.customer}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.paymentMethod}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-semibold">
                      ${item.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <nav
          className="mt-6 flex justify-end items-center space-x-2"
          aria-label="Pagination"
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`inline-flex items-center px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Previous Page"
          >
            <i className="fa fa-chevron-left" aria-hidden="true"></i>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`inline-flex items-center px-3 py-1 rounded border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 ${
                page === currentPage
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`inline-flex items-center px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 ${
              currentPage === totalPages || totalPages === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            aria-label="Next Page"
          >
            <i className="fa fa-chevron-right" aria-hidden="true"></i>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default IncomeReport;