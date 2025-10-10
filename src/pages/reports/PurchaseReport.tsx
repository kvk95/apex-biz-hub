import React, { useState, useMemo } from "react";

type PurchaseRecord = {
  purchaseNo: string;
  supplier: string;
  purchaseDate: string;
  purchaseStatus: string;
  grandTotal: string;
  paidAmount: string;
  dueAmount: string;
  paymentStatus: string;
};

const purchaseData: PurchaseRecord[] = [
  {
    purchaseNo: "1001",
    supplier: "Supplier 1",
    purchaseDate: "2023-08-01",
    purchaseStatus: "Received",
    grandTotal: "1,200.00",
    paidAmount: "1,000.00",
    dueAmount: "200.00",
    paymentStatus: "Partial",
  },
  {
    purchaseNo: "1002",
    supplier: "Supplier 2",
    purchaseDate: "2023-08-02",
    purchaseStatus: "Pending",
    grandTotal: "850.00",
    paidAmount: "850.00",
    dueAmount: "0.00",
    paymentStatus: "Paid",
  },
  {
    purchaseNo: "1003",
    supplier: "Supplier 3",
    purchaseDate: "2023-08-03",
    purchaseStatus: "Received",
    grandTotal: "2,500.00",
    paidAmount: "1,500.00",
    dueAmount: "1,000.00",
    paymentStatus: "Partial",
  },
  {
    purchaseNo: "1004",
    supplier: "Supplier 4",
    purchaseDate: "2023-08-04",
    purchaseStatus: "Received",
    grandTotal: "3,200.00",
    paidAmount: "3,200.00",
    dueAmount: "0.00",
    paymentStatus: "Paid",
  },
  {
    purchaseNo: "1005",
    supplier: "Supplier 5",
    purchaseDate: "2023-08-05",
    purchaseStatus: "Pending",
    grandTotal: "1,100.00",
    paidAmount: "0.00",
    dueAmount: "1,100.00",
    paymentStatus: "Due",
  },
  {
    purchaseNo: "1006",
    supplier: "Supplier 6",
    purchaseDate: "2023-08-06",
    purchaseStatus: "Received",
    grandTotal: "900.00",
    paidAmount: "900.00",
    dueAmount: "0.00",
    paymentStatus: "Paid",
  },
  {
    purchaseNo: "1007",
    supplier: "Supplier 7",
    purchaseDate: "2023-08-07",
    purchaseStatus: "Received",
    grandTotal: "1,750.00",
    paidAmount: "1,000.00",
    dueAmount: "750.00",
    paymentStatus: "Partial",
  },
  {
    purchaseNo: "1008",
    supplier: "Supplier 8",
    purchaseDate: "2023-08-08",
    purchaseStatus: "Pending",
    grandTotal: "2,300.00",
    paidAmount: "2,300.00",
    dueAmount: "0.00",
    paymentStatus: "Paid",
  },
  {
    purchaseNo: "1009",
    supplier: "Supplier 9",
    purchaseDate: "2023-08-09",
    purchaseStatus: "Received",
    grandTotal: "1,600.00",
    paidAmount: "1,600.00",
    dueAmount: "0.00",
    paymentStatus: "Paid",
  },
  {
    purchaseNo: "1010",
    supplier: "Supplier 10",
    purchaseDate: "2023-08-10",
    purchaseStatus: "Pending",
    grandTotal: "1,400.00",
    paidAmount: "700.00",
    dueAmount: "700.00",
    paymentStatus: "Partial",
  },
  {
    purchaseNo: "1011",
    supplier: "Supplier 11",
    purchaseDate: "2023-08-11",
    purchaseStatus: "Received",
    grandTotal: "1,900.00",
    paidAmount: "1,900.00",
    dueAmount: "0.00",
    paymentStatus: "Paid",
  },
  {
    purchaseNo: "1012",
    supplier: "Supplier 12",
    purchaseDate: "2023-08-12",
    purchaseStatus: "Received",
    grandTotal: "2,100.00",
    paidAmount: "1,000.00",
    dueAmount: "1,100.00",
    paymentStatus: "Partial",
  },
];

const purchaseStatuses = [
  "All",
  "Received",
  "Pending",
  "Ordered",
  "Canceled",
];

const paymentStatuses = ["All", "Paid", "Partial", "Due"];

const PurchaseReport: React.FC = () => {
  // Filters state
  const [purchaseNo, setPurchaseNo] = useState("");
  const [supplier, setSupplier] = useState("");
  const [purchaseStatus, setPurchaseStatus] = useState("All");
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Filtered data based on inputs
  const filteredData = useMemo(() => {
    return purchaseData.filter((item) => {
      if (
        purchaseNo &&
        !item.purchaseNo.toLowerCase().includes(purchaseNo.toLowerCase())
      )
        return false;
      if (
        supplier &&
        !item.supplier.toLowerCase().includes(supplier.toLowerCase())
      )
        return false;
      if (purchaseStatus !== "All" && item.purchaseStatus !== purchaseStatus)
        return false;
      if (paymentStatus !== "All" && item.paymentStatus !== paymentStatus)
        return false;
      if (dateFrom && item.purchaseDate < dateFrom) return false;
      if (dateTo && item.purchaseDate > dateTo) return false;
      return true;
    });
  }, [purchaseNo, supplier, purchaseStatus, paymentStatus, dateFrom, dateTo]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handlers
  const handleReset = () => {
    setPurchaseNo("");
    setSupplier("");
    setPurchaseStatus("All");
    setPaymentStatus("All");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Page Title */}
      <title>Purchase Report - DreamsPOS</title>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <h1 className="text-3xl font-semibold mb-6">Purchase Report</h1>

        {/* Filter Section */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded shadow p-6 mb-6"
          aria-label="Purchase report filters"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Purchase No */}
            <div>
              <label
                htmlFor="purchaseNo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Purchase No
              </label>
              <input
                id="purchaseNo"
                type="text"
                value={purchaseNo}
                onChange={(e) => setPurchaseNo(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Purchase No"
              />
            </div>

            {/* Supplier */}
            <div>
              <label
                htmlFor="supplier"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Supplier
              </label>
              <input
                id="supplier"
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Supplier"
              />
            </div>

            {/* Purchase Status */}
            <div>
              <label
                htmlFor="purchaseStatus"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Purchase Status
              </label>
              <select
                id="purchaseStatus"
                value={purchaseStatus}
                onChange={(e) => setPurchaseStatus(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {purchaseStatuses.map((status) => (
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
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Payment Status
              </label>
              <select
                id="paymentStatus"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {paymentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
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
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex space-x-4 justify-start">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Refresh
            </button>
          </div>
        </form>

        {/* Table Section */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                  Purchase No
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                  Supplier
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                  Purchase Date
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                  Purchase Status
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                  Grand Total
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                  Paid Amount
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                  Due Amount
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                  Payment Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-6 text-center text-gray-500 italic"
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr key={item.purchaseNo} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">{item.purchaseNo}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.supplier}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.purchaseDate}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                          item.purchaseStatus === "Received"
                            ? "bg-green-100 text-green-800"
                            : item.purchaseStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : item.purchaseStatus === "Canceled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.purchaseStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      ${item.grandTotal}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      ${item.paidAmount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      ${item.dueAmount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                          item.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-800"
                            : item.paymentStatus === "Partial"
                            ? "bg-yellow-100 text-yellow-800"
                            : item.paymentStatus === "Due"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <nav
          className="flex items-center justify-between py-3"
          aria-label="Pagination"
        >
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
            <ul className="inline-flex -space-x-px rounded-md shadow-sm">
              <li>
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? "z-10 bg-indigo-600 text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  aria-label="Go to first page"
                >
                  &laquo;
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Go to previous page"
                >
                  &lsaquo;
                </button>
              </li>
              {/* Show page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page}>
                  <button
                    onClick={() => setCurrentPage(page)}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium ${
                      currentPage === page
                        ? "z-10 bg-indigo-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Go to next page"
                >
                  &rsaquo;
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages
                      ? "z-10 bg-indigo-600 text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  aria-label="Go to last page"
                >
                  &raquo;
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default PurchaseReport;