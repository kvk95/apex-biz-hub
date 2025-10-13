import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const PAGE_SIZE = 5;

const InvoiceReport: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("InvoiceReport");
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

  // State for filters
  const [filters, setFilters] = useState({
    fromDate: "2022-01-01",
    toDate: "2022-12-31",
    customer: "",
    invoiceStatus: "All",
    paymentStatus: "All",
    paymentMethod: "All",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Handle filter change
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Extract filter option arrays from data or use empty arrays if not loaded
  const customers = data?.customers || [
    "All",
    "John Doe",
    "Jane Smith",
    "Acme Corp",
    "Dreams Technologies",
    "Customer A",
    "Customer B",
  ];
  const invoiceStatuses = data?.invoiceStatuses || ["All", "Paid", "Unpaid", "Partial"];
  const paymentStatuses = data?.paymentStatuses || ["All", "Paid", "Unpaid", "Partial"];
  const paymentMethods = data?.paymentMethods || ["All", "Cash", "Credit Card", "Cheque", "Bank Transfer"];

  // Filter invoices based on filters
  const filteredInvoices = useMemo(() => {
    const invoices = data?.invoices || [];
    return invoices.filter((inv: any) => {
      // Filter by date range
      const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
      const toDate = filters.toDate ? new Date(filters.toDate) : null;
      const invoiceDate = new Date(inv.date);

      if (fromDate && invoiceDate < fromDate) return false;
      if (toDate && invoiceDate > toDate) return false;

      // Filter by customer
      if (filters.customer && filters.customer !== "All") {
        if (inv.customer !== filters.customer) return false;
      }

      // Filter by invoice status
      if (filters.invoiceStatus && filters.invoiceStatus !== "All") {
        if (inv.status !== filters.invoiceStatus) return false;
      }

      // Filter by payment status
      if (filters.paymentStatus && filters.paymentStatus !== "All") {
        if (inv.paymentStatus !== filters.paymentStatus) return false;
      }

      // Filter by payment method
      if (filters.paymentMethod && filters.paymentMethod !== "All") {
        if (inv.paymentMethod !== filters.paymentMethod) return false;
      }

      return true;
    });
  }, [filters, data]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredInvoices.length / PAGE_SIZE);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Handlers for pagination
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Refresh button handler (reset filters)
  const handleRefresh = () => {
    setFilters({
      fromDate: "2022-01-01",
      toDate: "2022-12-31",
      customer: "",
      invoiceStatus: "All",
      paymentStatus: "All",
      paymentMethod: "All",
    });
    setCurrentPage(1);
  };

  // Report button handler (simulate report generation)
  const handleReport = () => {
    alert("Report generated for current filter selection.");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Page Title */}
      <title>Invoice Report</title>

      {/* Container */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <h1 className="text-3xl font-semibold mb-6 text-gray-900">
          Invoice Report
        </h1>

        {/* Filters Section */}
        <section className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Filter Options
          </h2>
          <form
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* From Date */}
            <div>
              <label
                htmlFor="fromDate"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                From Date
              </label>
              <input
                type="date"
                id="fromDate"
                name="fromDate"
                value={filters.fromDate}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* To Date */}
            <div>
              <label
                htmlFor="toDate"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                To Date
              </label>
              <input
                type="date"
                id="toDate"
                name="toDate"
                value={filters.toDate}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Customer */}
            <div>
              <label
                htmlFor="customer"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Customer
              </label>
              <select
                id="customer"
                name="customer"
                value={filters.customer}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {customers.map((cust) => (
                  <option key={cust} value={cust}>
                    {cust}
                  </option>
                ))}
              </select>
            </div>

            {/* Invoice Status */}
            <div>
              <label
                htmlFor="invoiceStatus"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Invoice Status
              </label>
              <select
                id="invoiceStatus"
                name="invoiceStatus"
                value={filters.invoiceStatus}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {invoiceStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Status */}
            <div>
              <label
                htmlFor="paymentStatus"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Payment Status
              </label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                value={filters.paymentStatus}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {paymentStatuses.map((status) => (
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
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Payment Method
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={filters.paymentMethod}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </form>

          {/* Buttons */}
          <div className="mt-6 flex space-x-3">
            <button
              type="button"
              onClick={handleReport}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Generate Report
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-5 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Refresh
            </button>
          </div>
        </section>

        {/* Invoice Table Section */}
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Invoice List
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                    Invoice No
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                    Customer
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                    Due Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                    Invoice Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                    Payment Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                    Payment Method
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Total ($)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {paginatedInvoices.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-6 text-center text-gray-500 text-sm"
                    >
                      No invoices found.
                    </td>
                  </tr>
                ) : (
                  paginatedInvoices.map((inv: any) => (
                    <tr
                      key={inv.id}
                      className="hover:bg-indigo-50 cursor-pointer"
                      title={`Invoice ${inv.invoiceNo}`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300 text-indigo-700 font-semibold">
                        {inv.invoiceNo}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                        {inv.customer}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                        {inv.date}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                        {inv.dueDate}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            inv.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : inv.status === "Unpaid"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            inv.paymentStatus === "Paid"
                              ? "bg-green-100 text-green-800"
                              : inv.paymentStatus === "Unpaid"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {inv.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                        {inv.paymentMethod}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right font-semibold text-gray-900">
                        {inv.total.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-semibold">
                {(currentPage - 1) * PAGE_SIZE + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold">
                {Math.min(currentPage * PAGE_SIZE, filteredInvoices.length)}
              </span>{" "}
              of <span className="font-semibold">{filteredInvoices.length}</span>{" "}
              invoices
            </div>
            <nav
              className="inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-3 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}
                aria-label="Previous"
              >
                &laquo;
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`relative inline-flex items-center px-3 py-1 border text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                      page === currentPage
                        ? "z-10 bg-indigo-600 text-white border-indigo-600"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`relative inline-flex items-center px-3 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                  currentPage === totalPages || totalPages === 0
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
                aria-label="Next"
              >
                &raquo;
              </button>
            </nav>
          </div>
        </section>
      </div>
    </div>
  );
};

export default InvoiceReport;