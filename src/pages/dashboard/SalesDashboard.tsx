import React, { useState, useMemo } from "react";

const salesData = [
  {
    id: 1,
    invoice: "INV-001",
    customer: "John Doe",
    date: "2023-09-01",
    total: 150.0,
    paid: 150.0,
    due: 0.0,
    status: "Paid",
  },
  {
    id: 2,
    invoice: "INV-002",
    customer: "Jane Smith",
    date: "2023-09-02",
    total: 200.0,
    paid: 100.0,
    due: 100.0,
    status: "Partial",
  },
  {
    id: 3,
    invoice: "INV-003",
    customer: "Acme Corp",
    date: "2023-09-03",
    total: 500.0,
    paid: 500.0,
    due: 0.0,
    status: "Paid",
  },
  {
    id: 4,
    invoice: "INV-004",
    customer: "Beta LLC",
    date: "2023-09-04",
    total: 300.0,
    paid: 0.0,
    due: 300.0,
    status: "Due",
  },
  {
    id: 5,
    invoice: "INV-005",
    customer: "Gamma Inc",
    date: "2023-09-05",
    total: 250.0,
    paid: 250.0,
    due: 0.0,
    status: "Paid",
  },
  {
    id: 6,
    invoice: "INV-006",
    customer: "Delta Co",
    date: "2023-09-06",
    total: 180.0,
    paid: 180.0,
    due: 0.0,
    status: "Paid",
  },
  {
    id: 7,
    invoice: "INV-007",
    customer: "Epsilon Ltd",
    date: "2023-09-07",
    total: 400.0,
    paid: 200.0,
    due: 200.0,
    status: "Partial",
  },
  {
    id: 8,
    invoice: "INV-008",
    customer: "Zeta Partners",
    date: "2023-09-08",
    total: 350.0,
    paid: 350.0,
    due: 0.0,
    status: "Paid",
  },
  {
    id: 9,
    invoice: "INV-009",
    customer: "Eta Enterprises",
    date: "2023-09-09",
    total: 275.0,
    paid: 275.0,
    due: 0.0,
    status: "Paid",
  },
  {
    id: 10,
    invoice: "INV-010",
    customer: "Theta Services",
    date: "2023-09-10",
    total: 320.0,
    paid: 0.0,
    due: 320.0,
    status: "Due",
  },
  {
    id: 11,
    invoice: "INV-011",
    customer: "Iota Solutions",
    date: "2023-09-11",
    total: 210.0,
    paid: 210.0,
    due: 0.0,
    status: "Paid",
  },
  {
    id: 12,
    invoice: "INV-012",
    customer: "Kappa Group",
    date: "2023-09-12",
    total: 190.0,
    paid: 190.0,
    due: 0.0,
    status: "Paid",
  },
];

const customers = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Acme Corp" },
  { id: 4, name: "Beta LLC" },
  { id: 5, name: "Gamma Inc" },
  { id: 6, name: "Delta Co" },
  { id: 7, name: "Epsilon Ltd" },
  { id: 8, name: "Zeta Partners" },
  { id: 9, name: "Eta Enterprises" },
  { id: 10, name: "Theta Services" },
  { id: 11, name: "Iota Solutions" },
  { id: 12, name: "Kappa Group" },
];

const paymentMethods = [
  "Cash",
  "Cheque",
  "Credit Card",
  "Bank Transfer",
  "Other",
];

const SalesDashboard: React.FC = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filters and form states
  const [filterCustomer, setFilterCustomer] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  // Payment form states
  const [paymentInvoice, setPaymentInvoice] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
  const [paymentNote, setPaymentNote] = useState("");

  // Report form states
  const [reportCustomer, setReportCustomer] = useState("");
  const [reportDateFrom, setReportDateFrom] = useState("");
  const [reportDateTo, setReportDateTo] = useState("");

  // Filtered sales data based on filters
  const filteredSales = useMemo(() => {
    return salesData.filter((sale) => {
      const matchCustomer =
        filterCustomer === "" || sale.customer === filterCustomer;
      const matchStatus = filterStatus === "" || sale.status === filterStatus;
      const saleDate = new Date(sale.date);
      const fromDate = filterDateFrom ? new Date(filterDateFrom) : null;
      const toDate = filterDateTo ? new Date(filterDateTo) : null;
      const matchDateFrom = fromDate ? saleDate >= fromDate : true;
      const matchDateTo = toDate ? saleDate <= toDate : true;
      return matchCustomer && matchStatus && matchDateFrom && matchDateTo;
    });
  }, [filterCustomer, filterStatus, filterDateFrom, filterDateTo]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    setFilterCustomer("");
    setFilterStatus("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setCurrentPage(1);
  };

  const handleSavePayment = () => {
    alert(
      `Payment saved:\nInvoice: ${paymentInvoice}\nAmount: ${paymentAmount}\nMethod: ${paymentMethod}\nNote: ${paymentNote}`
    );
    setPaymentInvoice("");
    setPaymentAmount("");
    setPaymentMethod(paymentMethods[0]);
    setPaymentNote("");
  };

  const handleGenerateReport = () => {
    alert(
      `Report generated for customer: ${reportCustomer || "All"}\nFrom: ${
        reportDateFrom || "N/A"
      }\nTo: ${reportDateTo || "N/A"}`
    );
    setReportCustomer("");
    setReportDateFrom("");
    setReportDateTo("");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <title>Sales Dashboard</title>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <h1 className="text-3xl font-semibold mb-6">Sales Dashboard</h1>

        {/* Filters Section */}
        <section className="bg-white rounded shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Filter Sales</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
            className="grid grid-cols-1 md:grid-cols-5 gap-4"
          >
            <div>
              <label
                htmlFor="filterCustomer"
                className="block text-sm font-medium mb-1"
              >
                Customer
              </label>
              <select
                id="filterCustomer"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterCustomer}
                onChange={(e) => setFilterCustomer(e.target.value)}
              >
                <option value="">All Customers</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="filterStatus"
                className="block text-sm font-medium mb-1"
              >
                Status
              </label>
              <select
                id="filterStatus"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Due">Due</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="filterDateFrom"
                className="block text-sm font-medium mb-1"
              >
                Date From
              </label>
              <input
                type="date"
                id="filterDateFrom"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="filterDateTo"
                className="block text-sm font-medium mb-1"
              >
                Date To
              </label>
              <input
                type="date"
                id="filterDateTo"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
              />
            </div>

            <div className="flex items-end space-x-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
              >
                <i className="fas fa-filter mr-2" /> Filter
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded flex items-center"
              >
                <i className="fas fa-sync-alt mr-2" /> Refresh
              </button>
            </div>
          </form>
        </section>

        {/* Sales Table Section */}
        <section className="bg-white rounded shadow p-6 mb-6 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Sales List</h2>
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <th className="border border-gray-300 px-4 py-2">Invoice</th>
                <th className="border border-gray-300 px-4 py-2">Customer</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-right">
                  Total ($)
                </th>
                <th className="border border-gray-300 px-4 py-2 text-right">
                  Paid ($)
                </th>
                <th className="border border-gray-300 px-4 py-2 text-right">
                  Due ($)
                </th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSales.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-4 text-gray-500 italic"
                  >
                    No sales found.
                  </td>
                </tr>
              )}
              {paginatedSales.map((sale) => (
                <tr
                  key={sale.id}
                  className="hover:bg-gray-50 even:bg-gray-50 text-sm"
                >
                  <td className="border border-gray-300 px-4 py-2">{sale.invoice}</td>
                  <td className="border border-gray-300 px-4 py-2">{sale.customer}</td>
                  <td className="border border-gray-300 px-4 py-2">{sale.date}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    {sale.total.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    {sale.paid.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    {sale.due.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        sale.status === "Paid"
                          ? "bg-green-100 text-green-800"
                          : sale.status === "Partial"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <nav
            className="flex justify-between items-center mt-4"
            aria-label="Pagination"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border border-gray-300 ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-200"
              }`}
            >
              <i className="fas fa-chevron-left"></i> Prev
            </button>

            <div className="space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded border border-gray-300 ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-200"
                  }`}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border border-gray-300 ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-200"
              }`}
            >
              Next <i className="fas fa-chevron-right"></i>
            </button>
          </nav>
        </section>

        {/* Payment Section */}
        <section className="bg-white rounded shadow p-6 mb-6 max-w-lg">
          <h2 className="text-xl font-semibold mb-4">Add Payment</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSavePayment();
            }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="paymentInvoice"
                className="block text-sm font-medium mb-1"
              >
                Invoice
              </label>
              <input
                id="paymentInvoice"
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={paymentInvoice}
                onChange={(e) => setPaymentInvoice(e.target.value)}
                placeholder="Enter invoice number"
                required
              />
            </div>

            <div>
              <label
                htmlFor="paymentAmount"
                className="block text-sm font-medium mb-1"
              >
                Amount
              </label>
              <input
                id="paymentAmount"
                type="number"
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter payment amount"
                required
              />
            </div>

            <div>
              <label
                htmlFor="paymentMethod"
                className="block text-sm font-medium mb-1"
              >
                Payment Method
              </label>
              <select
                id="paymentMethod"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="paymentNote"
                className="block text-sm font-medium mb-1"
              >
                Note
              </label>
              <textarea
                id="paymentNote"
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
                placeholder="Add any notes here"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded flex items-center"
              >
                <i className="fas fa-save mr-2"></i> Save Payment
              </button>
            </div>
          </form>
        </section>

        {/* Report Section */}
        <section className="bg-white rounded shadow p-6 max-w-lg">
          <h2 className="text-xl font-semibold mb-4">Generate Report</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerateReport();
            }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="reportCustomer"
                className="block text-sm font-medium mb-1"
              >
                Customer
              </label>
              <select
                id="reportCustomer"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={reportCustomer}
                onChange={(e) => setReportCustomer(e.target.value)}
              >
                <option value="">All Customers</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="reportDateFrom"
                className="block text-sm font-medium mb-1"
              >
                Date From
              </label>
              <input
                type="date"
                id="reportDateFrom"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={reportDateFrom}
                onChange={(e) => setReportDateFrom(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="reportDateTo"
                className="block text-sm font-medium mb-1"
              >
                Date To
              </label>
              <input
                type="date"
                id="reportDateTo"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={reportDateTo}
                onChange={(e) => setReportDateTo(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded flex items-center"
              >
                <i className="fas fa-file-alt mr-2"></i> Generate Report
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default SalesDashboard;