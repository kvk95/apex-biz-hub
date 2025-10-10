import React, { useState, useMemo } from "react";

const annualReportData = {
  title: "Annual Report",
  filters: {
    yearOptions: [
      { label: "2023", value: "2023" },
      { label: "2022", value: "2022" },
      { label: "2021", value: "2021" },
      { label: "2020", value: "2020" },
    ],
    selectedYear: "2023",
    branchOptions: [
      { label: "All Branches", value: "all" },
      { label: "New York", value: "ny" },
      { label: "Los Angeles", value: "la" },
      { label: "Chicago", value: "chi" },
    ],
    selectedBranch: "all",
  },
  summaryCards: [
    {
      title: "Total Sales",
      value: "$1,250,000",
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10h18M3 6h18M3 14h18M3 18h18"
          ></path>
        </svg>
      ),
      bgColor: "bg-indigo-600",
    },
    {
      title: "Total Orders",
      value: "4,320",
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 17v-6a2 2 0 012-2h6"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 7h6m-6 0v6a2 2 0 002 2h6"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 17h.01M3 13h.01M3 9h.01"
          ></path>
        </svg>
      ),
      bgColor: "bg-green-600",
    },
    {
      title: "New Customers",
      value: "1,150",
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.121 17.804A13.937 13.937 0 0112 15c2.21 0 4.31.57 6.121 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v4"
          ></path>
        </svg>
      ),
      bgColor: "bg-yellow-600",
    },
    {
      title: "Returned Orders",
      value: "120",
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 1l4 4-4 4"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 11v6a2 2 0 002 2h6"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 15l-4-4 4-4"
          ></path>
        </svg>
      ),
      bgColor: "bg-red-600",
    },
  ],
  tableData: [
    {
      id: 1,
      customer: "John Doe",
      orders: 15,
      totalSpent: "$1,250.25",
      lastPurchase: "2025-10-08",
    },
    {
      id: 2,
      customer: "Alice Smith",
      orders: 12,
      totalSpent: "$980.36",
      lastPurchase: "2025-10-03",
    },
    {
      id: 3,
      customer: "Robert Johnson",
      orders: 10,
      totalSpent: "$875.50",
      lastPurchase: "2025-10-07",
    },
    {
      id: 4,
      customer: "Emma Wilson",
      orders: 10,
      totalSpent: "$750.25",
      lastPurchase: "2025-10-05",
    },
    {
      id: 5,
      customer: "Michael Brown",
      orders: 7,
      totalSpent: "$620.75",
      lastPurchase: "2025-10-09",
    },
    {
      id: 6,
      customer: "Linda Taylor",
      orders: 6,
      totalSpent: "$580.00",
      lastPurchase: "2025-10-06",
    },
    {
      id: 7,
      customer: "James Anderson",
      orders: 5,
      totalSpent: "$450.00",
      lastPurchase: "2025-10-04",
    },
    {
      id: 8,
      customer: "Patricia Martinez",
      orders: 4,
      totalSpent: "$400.00",
      lastPurchase: "2025-10-02",
    },
    {
      id: 9,
      customer: "David Lee",
      orders: 3,
      totalSpent: "$350.00",
      lastPurchase: "2025-10-01",
    },
    {
      id: 10,
      customer: "Barbara Harris",
      orders: 2,
      totalSpent: "$300.00",
      lastPurchase: "2025-09-30",
    },
  ],
};

const ITEMS_PER_PAGE = 5;

export default function AnnualReport() {
  const [year, setYear] = useState(annualReportData.filters.selectedYear);
  const [branch, setBranch] = useState(annualReportData.filters.selectedBranch);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data by branch if needed (reference page shows branch filter but no dynamic filtering, so we keep all)
  // For demonstration, branch filter does not filter data as original page does not show filtering effect.

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return annualReportData.tableData.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [currentPage]);

  const totalPages = Math.ceil(
    annualReportData.tableData.length / ITEMS_PER_PAGE
  );

  // Handlers
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(e.target.value);
    setCurrentPage(1);
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBranch(e.target.value);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    // For demo, just reset filters and page
    setYear(annualReportData.filters.selectedYear);
    setBranch(annualReportData.filters.selectedBranch);
    setCurrentPage(1);
  };

  const handleReport = () => {
    // For demo, alert report generation
    alert("Report generated for year " + year + " and branch " + branch);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Title */}
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">
        {annualReportData.title}
      </h1>

      {/* Filters Section */}
      <section className="bg-white rounded-md shadow p-6 mb-6">
        <form className="flex flex-wrap gap-6 items-end">
          <div className="flex flex-col">
            <label
              htmlFor="year"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Select Year
            </label>
            <select
              id="year"
              value={year}
              onChange={handleYearChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {annualReportData.filters.yearOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="branch"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Select Branch
            </label>
            <select
              id="branch"
              value={branch}
              onChange={handleBranchChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {annualReportData.filters.branchOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Generate Report
            </button>
          </div>
        </form>
      </section>

      {/* Summary Cards Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        {annualReportData.summaryCards.map((card, idx) => (
          <div
            key={idx}
            className={`flex items-center p-4 rounded-md shadow ${card.bgColor}`}
          >
            <div className="p-3 rounded-full bg-white bg-opacity-25 mr-4">
              {card.icon}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{card.title}</p>
              <p className="text-white text-xl font-semibold">{card.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Table Section */}
      <section className="bg-white rounded-md shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Top Customers
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Orders
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total Spent
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Last Purchase
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {row.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {row.totalSpent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(row.lastPurchase).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <nav
          className="mt-4 flex items-center justify-between border-t border-gray-200 px-4 py-3"
          aria-label="Pagination"
        >
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
            <div>
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div className="ml-6">
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className="sr-only">First</span>
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
                      strokeWidth="2"
                      d="M11 17l-5-5m0 0l5-5m-5 5h12"
                    />
                  </svg>
                </button>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.max(p - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
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
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Page numbers */}
                {[...Array(totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  const isCurrent = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      aria-current={isCurrent ? "page" : undefined}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        isCurrent
                          ? "z-10 bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
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
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Last</span>
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
                      strokeWidth="2"
                      d="M13 7l5 5-5 5M6 7l5 5-5 5"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </nav>
      </section>
    </div>
  );
}