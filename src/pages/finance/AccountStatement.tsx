import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const PAGE_SIZE = 5;

export default function AccountStatement() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    fromDate: "2023-01-01",
    toDate: "2023-12-31",
    customer: "John Doe",
    invoiceNo: "",
    paymentType: "All",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("AccountStatement");
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

  // Filter transactions by date range, customer, invoice no, payment type
  const filteredTransactions = useMemo(() => {
    return data.filter((t: any) => {
      const tDate = new Date(t.date);
      const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
      const toDate = filters.toDate ? new Date(filters.toDate) : null;
      if (fromDate && tDate < fromDate) return false;
      if (toDate && tDate > toDate) return false;
      if (
        filters.invoiceNo &&
        !t.invoiceNo.toLowerCase().includes(filters.invoiceNo.toLowerCase())
      )
        return false;
      if (
        filters.paymentType &&
        filters.paymentType !== "All" &&
        t.paymentType !== filters.paymentType
      )
        return false;
      if (filters.customer && filters.customer !== "John Doe") return false;
      return true;
    });
  }, [filters, data]);

  // Pagination calculations
  const pageCount = Math.ceil(filteredTransactions.length / PAGE_SIZE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setFilters({
      fromDate: "2023-01-01",
      toDate: "2023-12-31",
      customer: "John Doe",
      invoiceNo: "",
      paymentType: "All",
    });
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generation is not implemented in this demo.");
  };

  return (
    <>
      <title>Account Statement</title>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <h1 className="text-2xl font-semibold mb-6">Account Statement</h1>

          {/* Customer Info Section */}
          <section className="bg-white rounded shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Customer Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="customerName"
                  className="block text-sm font-medium mb-1"
                >
                  Customer Name
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customer"
                  value={filters.customer}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Customer Name"
                />
              </div>
              <div>
                <label
                  htmlFor="customerId"
                  className="block text-sm font-medium mb-1"
                >
                  Customer ID
                </label>
                <input
                  type="text"
                  id="customerId"
                  name="customerId"
                  value="CUST-0001"
                  readOnly
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="customerAddress"
                  className="block text-sm font-medium mb-1"
                >
                  Address
                </label>
                <textarea
                  id="customerAddress"
                  name="address"
                  value="1234 Elm Street, Springfield, USA"
                  readOnly
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100 cursor-not-allowed resize-none"
                />
              </div>
              <div>
                <label
                  htmlFor="customerPhone"
                  className="block text-sm font-medium mb-1"
                >
                  Phone
                </label>
                <input
                  type="text"
                  id="customerPhone"
                  name="phone"
                  value="+1 234 567 890"
                  readOnly
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="customerEmail"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="customerEmail"
                  name="email"
                  value="john.doe@example.com"
                  readOnly
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </section>

          {/* Filters Section */}
          <section className="bg-white rounded shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCurrentPage(1);
              }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              <div>
                <label
                  htmlFor="fromDate"
                  className="block text-sm font-medium mb-1"
                >
                  From Date
                </label>
                <input
                  type="date"
                  id="fromDate"
                  name="fromDate"
                  value={filters.fromDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="toDate"
                  className="block text-sm font-medium mb-1"
                >
                  To Date
                </label>
                <input
                  type="date"
                  id="toDate"
                  name="toDate"
                  value={filters.toDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="invoiceNo"
                  className="block text-sm font-medium mb-1"
                >
                  Invoice No
                </label>
                <input
                  type="text"
                  id="invoiceNo"
                  name="invoiceNo"
                  value={filters.invoiceNo}
                  onChange={handleInputChange}
                  placeholder="Invoice No"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="paymentType"
                  className="block text-sm font-medium mb-1"
                >
                  Payment Type
                </label>
                <select
                  id="paymentType"
                  name="paymentType"
                  value={filters.paymentType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {["All", "Cash", "Card", "Cheque", "Bank Transfer"].map((pt) => (
                    <option key={pt} value={pt}>
                      {pt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-4 flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="inline-flex items-center px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <i className="fa fa-filter mr-2" aria-hidden="true"></i> Filter
                </button>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="inline-flex items-center px-5 py-2 bg-gray-600 text-white text-sm font-semibold rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <i className="fa fa-refresh mr-2" aria-hidden="true"></i> Refresh
                </button>
                <button
                  type="button"
                  onClick={handleReport}
                  className="inline-flex items-center px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <i className="fa fa-file-pdf-o mr-2" aria-hidden="true"></i> Report
                </button>
              </div>
            </form>
          </section>

          {/* Transactions Table Section */}
          <section className="bg-white rounded shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Transactions</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                      Date
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                      Invoice No
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                      Description
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                      Payment Type
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right font-medium text-gray-700">
                      Debit
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right font-medium text-gray-700">
                      Credit
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right font-medium text-gray-700">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-4 text-gray-500 italic"
                      >
                        No transactions found.
                      </td>
                    </tr>
                  )}
                  {paginatedTransactions.map((t, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="border border-gray-300 px-4 py-2">
                        {t.date}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {t.invoiceNo}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {t.description}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {t.paymentType}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {t.debit === 0 ? "" : t.debit.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {t.credit === 0 ? "" : t.credit.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right font-semibold">
                        {t.balance.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-semibold">
                  {(currentPage - 1) * PAGE_SIZE + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(currentPage * PAGE_SIZE, filteredTransactions.length)}
                </span>{" "}
                of <span className="font-semibold">{filteredTransactions.length}</span>{" "}
                entries
              </div>
              <nav
                className="inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                    currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  aria-label="First"
                >
                  <i className="fa fa-angle-double-left" aria-hidden="true"></i>
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                    currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  aria-label="Previous"
                >
                  <i className="fa fa-angle-left" aria-hidden="true"></i>
                </button>

                {/* Page numbers */}
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                      page === currentPage
                        ? "z-10 bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
                  disabled={currentPage === pageCount || pageCount === 0}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                    currentPage === pageCount || pageCount === 0
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                  aria-label="Next"
                >
                  <i className="fa fa-angle-right" aria-hidden="true"></i>
                </button>
                <button
                  onClick={() => setCurrentPage(pageCount)}
                  disabled={currentPage === pageCount || pageCount === 0}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                    currentPage === pageCount || pageCount === 0
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                  aria-label="Last"
                >
                  <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                </button>
              </nav>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}