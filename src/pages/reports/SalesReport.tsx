import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

interface SaleRecord {
  date: string;
  invoice: string;
  customer: string;
  product: string;
  qty: number;
  price: number;
  discount: number;
  tax: number;
  total: number;
}

const pageSizeOptions = [5, 10, 15];

const SalesReport: React.FC = () => {
  const [data, setData] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<SaleRecord[]>("SalesReport");
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

  // Filters states
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [customer, setCustomer] = useState<string>("");
  const [product, setProduct] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filtered data based on inputs
  const filteredData = useMemo(() => {
    return data.filter((record) => {
      if (startDate && record.date < startDate) return false;
      if (endDate && record.date > endDate) return false;
      if (customer && !record.customer.toLowerCase().includes(customer.toLowerCase()))
        return false;
      if (product && !record.product.toLowerCase().includes(product.toLowerCase()))
        return false;
      return true;
    });
  }, [startDate, endDate, customer, product, data]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Reset page when filters or pageSize change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate, customer, product, pageSize]);

  // Handlers for buttons (Refresh resets filters)
  const handleRefresh = () => {
    setStartDate("");
    setEndDate("");
    setCustomer("");
    setProduct("");
    setPageSize(5);
    setCurrentPage(1);
  };

  // Save button placeholder (no backend, just alert)
  const handleSave = () => {
    alert("Save functionality is not implemented in this demo.");
  };

  // Report button placeholder (no backend, just alert)
  const handleReport = () => {
    alert("Report generation is not implemented in this demo.");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Title */}
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">Sales Report</h1>

      {/* Filters Section */}
      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="grid grid-cols-1 md:grid-cols-5 gap-6"
        >
          {/* Date From */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium mb-1">
              Date From
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Date To */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium mb-1">
              Date To
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Customer */}
          <div>
            <label htmlFor="customer" className="block text-sm font-medium mb-1">
              Customer
            </label>
            <input
              type="text"
              id="customer"
              placeholder="Customer Name"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Product */}
          <div>
            <label htmlFor="product" className="block text-sm font-medium mb-1">
              Product
            </label>
            <input
              type="text"
              id="product"
              placeholder="Product Name"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Page Size */}
          <div>
            <label htmlFor="pageSize" className="block text-sm font-medium mb-1">
              Items per page
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-3">
          <button
            onClick={handleReport}
            type="button"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Report
          </button>
          <button
            onClick={handleSave}
            type="button"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Save
          </button>
          <button
            onClick={handleRefresh}
            type="button"
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Refresh
          </button>
        </div>
      </section>

      {/* Sales Table Section */}
      <section className="bg-white rounded-lg shadow p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 font-medium text-gray-700">Date</th>
                <th className="border border-gray-300 px-4 py-2 font-medium text-gray-700">Invoice</th>
                <th className="border border-gray-300 px-4 py-2 font-medium text-gray-700">Customer</th>
                <th className="border border-gray-300 px-4 py-2 font-medium text-gray-700">Product</th>
                <th className="border border-gray-300 px-4 py-2 font-medium text-gray-700 text-right">Qty</th>
                <th className="border border-gray-300 px-4 py-2 font-medium text-gray-700 text-right">Price</th>
                <th className="border border-gray-300 px-4 py-2 font-medium text-gray-700 text-right">Discount</th>
                <th className="border border-gray-300 px-4 py-2 font-medium text-gray-700 text-right">Tax</th>
                <th className="border border-gray-300 px-4 py-2 font-medium text-gray-700 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-6 text-gray-500">
                    No records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((record, idx) => (
                  <tr
                    key={`${record.invoice}-${idx}`}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border border-gray-300 px-4 py-2">{record.date}</td>
                    <td className="border border-gray-300 px-4 py-2">{record.invoice}</td>
                    <td className="border border-gray-300 px-4 py-2">{record.customer}</td>
                    <td className="border border-gray-300 px-4 py-2">{record.product}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{record.qty}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      ${record.price.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      ${record.discount.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      ${record.tax.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      ${record.total.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {filteredData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * pageSize, filteredData.length)}
            </span>{" "}
            of <span className="font-medium">{filteredData.length}</span> results
          </div>
          <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                aria-current={page === currentPage ? "page" : undefined}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                  page === currentPage
                    ? "z-10 bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                currentPage === totalPages || totalPages === 0 ? "cursor-not-allowed opacity-50" : ""
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>
      </section>
    </div>
  );
};

export default SalesReport;