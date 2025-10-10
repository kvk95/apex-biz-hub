import React, { useState, useMemo } from "react";

const invoicesData = [
  {
    id: 1,
    invoiceNo: "INV-001",
    customer: "John Doe",
    date: "2025-09-01",
    dueDate: "2025-09-15",
    amount: 250.0,
    status: "Paid",
  },
  {
    id: 2,
    invoiceNo: "INV-002",
    customer: "Jane Smith",
    date: "2025-09-05",
    dueDate: "2025-09-20",
    amount: 450.5,
    status: "Pending",
  },
  {
    id: 3,
    invoiceNo: "INV-003",
    customer: "Acme Corp",
    date: "2025-09-10",
    dueDate: "2025-09-25",
    amount: 1200.75,
    status: "Overdue",
  },
  {
    id: 4,
    invoiceNo: "INV-004",
    customer: "Global Industries",
    date: "2025-09-12",
    dueDate: "2025-09-27",
    amount: 980.0,
    status: "Paid",
  },
  {
    id: 5,
    invoiceNo: "INV-005",
    customer: "Mary Johnson",
    date: "2025-09-15",
    dueDate: "2025-09-30",
    amount: 300.0,
    status: "Pending",
  },
  {
    id: 6,
    invoiceNo: "INV-006",
    customer: "XYZ Enterprises",
    date: "2025-09-18",
    dueDate: "2025-10-03",
    amount: 675.25,
    status: "Paid",
  },
  {
    id: 7,
    invoiceNo: "INV-007",
    customer: "Alpha Solutions",
    date: "2025-09-20",
    dueDate: "2025-10-05",
    amount: 150.0,
    status: "Pending",
  },
  {
    id: 8,
    invoiceNo: "INV-008",
    customer: "Beta Technologies",
    date: "2025-09-22",
    dueDate: "2025-10-07",
    amount: 890.0,
    status: "Overdue",
  },
  {
    id: 9,
    invoiceNo: "INV-009",
    customer: "Delta Services",
    date: "2025-09-25",
    dueDate: "2025-10-10",
    amount: 430.0,
    status: "Paid",
  },
  {
    id: 10,
    invoiceNo: "INV-010",
    customer: "Omega Corp",
    date: "2025-09-28",
    dueDate: "2025-10-13",
    amount: 1120.0,
    status: "Pending",
  },
];

const pageSizeOptions = [5, 10, 15];

const statusColors: Record<string, string> = {
  Paid: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Overdue: "bg-red-100 text-red-800",
};

const Invoices: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Filter and search invoices
  const filteredInvoices = useMemo(() => {
    return invoicesData.filter((inv) => {
      const matchesSearch =
        inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "All" ? true : inv.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus]);

  const totalPages = Math.ceil(filteredInvoices.length / pageSize);

  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredInvoices.slice(start, start + pageSize);
  }, [currentPage, pageSize, filteredInvoices]);

  // Handlers
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setFilterStatus("All");
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generation is not implemented in this demo.");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Title */}
      <h1 className="text-3xl font-semibold mb-6">Invoices</h1>

      {/* Controls Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <input
            type="text"
            placeholder="Search by Invoice No or Customer"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Search invoices"
          />
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Filter by status"
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Select page size"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Refresh invoices"
            type="button"
          >
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
          <button
            onClick={handleReport}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Generate report"
            type="button"
          >
            <i className="fas fa-file-alt"></i> Report
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left font-semibold uppercase tracking-wider"
              >
                Invoice No
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left font-semibold uppercase tracking-wider"
              >
                Customer
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left font-semibold uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left font-semibold uppercase tracking-wider"
              >
                Due Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right font-semibold uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center font-semibold uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center font-semibold uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedInvoices.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-4 text-center text-gray-500 italic"
                >
                  No invoices found.
                </td>
              </tr>
            ) : (
              paginatedInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{inv.invoiceNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{inv.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{inv.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{inv.dueDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    ${inv.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[inv.status]}`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                    <button
                      type="button"
                      aria-label={`Edit invoice ${inv.invoiceNo}`}
                      className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                      onClick={() =>
                        alert(`Edit functionality for ${inv.invoiceNo} not implemented.`)
                      }
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete invoice ${inv.invoiceNo}`}
                      className="text-red-600 hover:text-red-900 focus:outline-none"
                      onClick={() =>
                        alert(`Delete functionality for ${inv.invoiceNo} not implemented.`)
                      }
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <nav
        className="flex items-center justify-between mt-6"
        aria-label="Pagination"
      >
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
          <ul className="inline-flex -space-x-px rounded-md shadow-sm">
            <li>
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1
                    ? "z-10 bg-indigo-600 text-white"
                    : "text-gray-500 hover:bg-gray-50"
                } disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                aria-label="Go to first page"
              >
                <i className="fas fa-angle-double-left"></i>
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1
                    ? "text-gray-300 cursor-default"
                    : "text-gray-500 hover:bg-gray-50"
                } disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                aria-label="Go to previous page"
              >
                <i className="fas fa-angle-left"></i>
              </button>
            </li>
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              return (
                <li key={page}>
                  <button
                    onClick={() => handlePageChange(page)}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      currentPage === page
                        ? "z-10 bg-indigo-600 text-white"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                </li>
              );
            })}
            <li>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === totalPages || totalPages === 0
                    ? "text-gray-300 cursor-default"
                    : "text-gray-500 hover:bg-gray-50"
                } disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                aria-label="Go to next page"
              >
                <i className="fas fa-angle-right"></i>
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === totalPages || totalPages === 0
                    ? "text-gray-300 cursor-default"
                    : "text-gray-500 hover:bg-gray-50"
                } disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                aria-label="Go to last page"
              >
                <i className="fas fa-angle-double-right"></i>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Invoices;