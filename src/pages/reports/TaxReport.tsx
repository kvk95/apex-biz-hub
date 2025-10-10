import React, { useState, useMemo } from "react";

const TAX_REPORT_DATA = [
  {
    date: "2023-01-01",
    invoiceNo: "INV-1001",
    customer: "John Doe",
    taxRate: "5%",
    taxAmount: 10.0,
    totalAmount: 210.0,
  },
  {
    date: "2023-01-02",
    invoiceNo: "INV-1002",
    customer: "Jane Smith",
    taxRate: "10%",
    taxAmount: 20.0,
    totalAmount: 220.0,
  },
  {
    date: "2023-01-03",
    invoiceNo: "INV-1003",
    customer: "Acme Corp",
    taxRate: "8%",
    taxAmount: 16.0,
    totalAmount: 216.0,
  },
  {
    date: "2023-01-04",
    invoiceNo: "INV-1004",
    customer: "Global Inc",
    taxRate: "12%",
    taxAmount: 24.0,
    totalAmount: 224.0,
  },
  {
    date: "2023-01-05",
    invoiceNo: "INV-1005",
    customer: "Foo Bar",
    taxRate: "7%",
    taxAmount: 14.0,
    totalAmount: 214.0,
  },
  {
    date: "2023-01-06",
    invoiceNo: "INV-1006",
    customer: "Baz Qux",
    taxRate: "6%",
    taxAmount: 12.0,
    totalAmount: 212.0,
  },
  {
    date: "2023-01-07",
    invoiceNo: "INV-1007",
    customer: "Lorem Ipsum",
    taxRate: "9%",
    taxAmount: 18.0,
    totalAmount: 218.0,
  },
  {
    date: "2023-01-08",
    invoiceNo: "INV-1008",
    customer: "Dolor Sit",
    taxRate: "11%",
    taxAmount: 22.0,
    totalAmount: 222.0,
  },
  {
    date: "2023-01-09",
    invoiceNo: "INV-1009",
    customer: "Amet Consectetur",
    taxRate: "5%",
    taxAmount: 10.0,
    totalAmount: 210.0,
  },
  {
    date: "2023-01-10",
    invoiceNo: "INV-1010",
    customer: "Adipiscing Elit",
    taxRate: "10%",
    taxAmount: 20.0,
    totalAmount: 220.0,
  },
];

const TAX_RATES = ["All", "5%", "6%", "7%", "8%", "9%", "10%", "11%", "12%"];

const ITEMS_PER_PAGE = 5;

export default function TaxReport() {
  // States for filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedTaxRate, setSelectedTaxRate] = useState("All");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered data based on inputs
  const filteredData = useMemo(() => {
    return TAX_REPORT_DATA.filter((item) => {
      const itemDate = new Date(item.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && itemDate < start) return false;
      if (end && itemDate > end) return false;
      if (selectedTaxRate !== "All" && item.taxRate !== selectedTaxRate)
        return false;

      return true;
    });
  }, [startDate, endDate, selectedTaxRate]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Totals for footer
  const totalTaxAmount = filteredData.reduce(
    (sum, item) => sum + item.taxAmount,
    0
  );
  const totalAmount = filteredData.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  );

  // Handlers
  function handleReset() {
    setStartDate("");
    setEndDate("");
    setSelectedTaxRate("All");
    setCurrentPage(1);
  }

  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Page Title */}
      <title>Tax Report - Dreams POS</title>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <h1 className="text-2xl font-semibold mb-6">Tax Report</h1>

        {/* Filter Section */}
        <section className="bg-white rounded shadow p-6 mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
          >
            {/* Start Date */}
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Tax Rate */}
            <div>
              <label
                htmlFor="taxRate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tax Rate
              </label>
              <select
                id="taxRate"
                name="taxRate"
                value={selectedTaxRate}
                onChange={(e) => setSelectedTaxRate(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {TAX_RATES.map((rate) => (
                  <option key={rate} value={rate}>
                    {rate}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                type="submit"
                className="inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              >
                Search
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex justify-center items-center px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
              >
                Reset
              </button>
            </div>
          </form>
        </section>

        {/* Table Section */}
        <section className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Invoice No
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Tax Rate
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Tax Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500 text-sm"
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => (
                  <tr
                    key={`${item.invoiceNo}-${idx}`}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                      {item.date}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                      {item.invoiceNo}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                      {item.customer}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-right text-gray-700">
                      {item.taxRate}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-right text-gray-700">
                      ${item.taxAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-right text-gray-700">
                      ${item.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Footer Totals */}
            <tfoot className="bg-gray-100 font-semibold text-gray-900">
              <tr>
                <td colSpan={4} className="px-6 py-3 text-right">
                  Totals:
                </td>
                <td className="px-6 py-3 text-right">
                  ${totalTaxAmount.toFixed(2)}
                </td>
                <td className="px-6 py-3 text-right">
                  ${totalAmount.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </section>

        {/* Pagination Controls */}
        <nav
          className="flex justify-between items-center mt-6"
          aria-label="Pagination"
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Previous
          </button>

          <div className="space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                aria-current={page === currentPage ? "page" : undefined}
                className={`px-3 py-1 rounded border ${
                  page === currentPage
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
}