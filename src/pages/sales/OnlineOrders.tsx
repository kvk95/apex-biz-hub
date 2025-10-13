import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const paymentMethods = ["All", "Credit Card", "Paypal", "Cash"];
const statuses = ["All", "Pending", "Completed", "Cancelled"];

export default function OnlineOrders() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("OnlineOrders");
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filters state
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPayment, setFilterPayment] = useState("All");
  const [searchOrderId, setSearchOrderId] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");

  // Sorting state
  const [sortField, setSortField] = useState<keyof (typeof data)[0] | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filtered and sorted data memoized
  const filteredData = useMemo(() => {
    let filtered = [...data];

    if (filterStatus !== "All") {
      filtered = filtered.filter((o) => o.status === filterStatus);
    }
    if (filterPayment !== "All") {
      filtered = filtered.filter((o) => o.paymentMethod === filterPayment);
    }
    if (searchOrderId.trim() !== "") {
      filtered = filtered.filter((o) =>
        o.orderId.toLowerCase().includes(searchOrderId.toLowerCase())
      );
    }
    if (searchCustomer.trim() !== "") {
      filtered = filtered.filter((o) =>
        o.customer.toLowerCase().includes(searchCustomer.toLowerCase())
      );
    }

    if (sortField) {
      filtered.sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, filterStatus, filterPayment, searchOrderId, searchCustomer, sortField, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleSort = (field: keyof (typeof data)[0]) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleRefresh = () => {
    setFilterStatus("All");
    setFilterPayment("All");
    setSearchOrderId("");
    setSearchCustomer("");
    setSortField(null);
    setSortDirection("asc");
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generated for current filtered orders.");
  };

  return (
    <>
      <title>Online Orders - Dreams POS</title>
      <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900">
        <div className="max-w-7xl mx-auto bg-white rounded shadow p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">
              Online Orders
            </h1>
            <div className="flex space-x-3">
              <button
                onClick={handleReport}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded shadow"
                type="button"
                aria-label="Generate Report"
              >
                <i className="fas fa-file-alt mr-2" aria-hidden="true"></i> Report
              </button>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm font-medium rounded shadow"
                type="button"
                aria-label="Refresh"
              >
                <i className="fas fa-sync-alt mr-2" aria-hidden="true"></i> Refresh
              </button>
            </div>
          </div>

          {/* Filters Section */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6"
            aria-label="Filter Orders Form"
          >
            <div>
              <label
                htmlFor="orderId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Order ID
              </label>
              <input
                id="orderId"
                type="text"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                placeholder="Search Order ID"
                className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="customer"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Customer
              </label>
              <input
                id="customer"
                type="text"
                value={searchCustomer}
                onChange={(e) => setSearchCustomer(e.target.value)}
                placeholder="Search Customer"
                className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="paymentMethod"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Payment Method
              </label>
              <select
                id="paymentMethod"
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </form>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    scope="col"
                    className="cursor-pointer px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider select-none"
                    onClick={() => handleSort("orderId")}
                    aria-sort={
                      sortField === "orderId"
                        ? sortDirection === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                    tabIndex={0}
                    role="button"
                    aria-label="Sort by Order ID"
                  >
                    Order ID{" "}
                    {sortField === "orderId" && (
                      <i
                        className={`fas fa-sort-${
                          sortDirection === "asc" ? "up" : "down"
                        } ml-1`}
                        aria-hidden="true"
                      ></i>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider select-none"
                    onClick={() => handleSort("customer")}
                    aria-sort={
                      sortField === "customer"
                        ? sortDirection === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                    tabIndex={0}
                    role="button"
                    aria-label="Sort by Customer"
                  >
                    Customer{" "}
                    {sortField === "customer" && (
                      <i
                        className={`fas fa-sort-${
                          sortDirection === "asc" ? "up" : "down"
                        } ml-1`}
                        aria-hidden="true"
                      ></i>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider select-none"
                    onClick={() => handleSort("date")}
                    aria-sort={
                      sortField === "date"
                        ? sortDirection === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                    tabIndex={0}
                    role="button"
                    aria-label="Sort by Date"
                  >
                    Date{" "}
                    {sortField === "date" && (
                      <i
                        className={`fas fa-sort-${
                          sortDirection === "asc" ? "up" : "down"
                        } ml-1`}
                        aria-hidden="true"
                      ></i>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider select-none"
                    onClick={() => handleSort("status")}
                    aria-sort={
                      sortField === "status"
                        ? sortDirection === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                    tabIndex={0}
                    role="button"
                    aria-label="Sort by Status"
                  >
                    Status{" "}
                    {sortField === "status" && (
                      <i
                        className={`fas fa-sort-${
                          sortDirection === "asc" ? "up" : "down"
                        } ml-1`}
                        aria-hidden="true"
                      ></i>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider select-none"
                    onClick={() => handleSort("paymentMethod")}
                    aria-sort={
                      sortField === "paymentMethod"
                        ? sortDirection === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                    tabIndex={0}
                    role="button"
                    aria-label="Sort by Payment Method"
                  >
                    Payment Method{" "}
                    {sortField === "paymentMethod" && (
                      <i
                        className={`fas fa-sort-${
                          sortDirection === "asc" ? "up" : "down"
                        } ml-1`}
                        aria-hidden="true"
                      ></i>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider select-none"
                    onClick={() => handleSort("total")}
                    aria-sort={
                      sortField === "total"
                        ? sortDirection === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                    tabIndex={0}
                    role="button"
                    aria-label="Sort by Total"
                  >
                    Total{" "}
                    {sortField === "total" && (
                      <i
                        className={`fas fa-sort-${
                          sortDirection === "asc" ? "up" : "down"
                        } ml-1`}
                        aria-hidden="true"
                      ></i>
                    )}
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-6 text-gray-500 text-sm"
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((order) => (
                    <tr
                      key={order.id}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600 font-medium">
                        {order.orderId}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {order.customer}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                            order.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                          aria-label={`Status: ${order.status}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {order.paymentMethod}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-800 focus:outline-none"
                          aria-label={`View details for order ${order.orderId}`}
                          onClick={() =>
                            alert(`Viewing details for order ${order.orderId}`)
                          }
                        >
                          <i className="fas fa-eye" aria-hidden="true"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav
            className="mt-6 flex justify-center items-center space-x-2"
            role="navigation"
            aria-label="Pagination Navigation"
          >
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border border-gray-300 text-sm font-medium ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              aria-label="Go to first page"
            >
              <i className="fas fa-angle-double-left" aria-hidden="true"></i>
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border border-gray-300 text-sm font-medium ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              aria-label="Go to previous page"
            >
              <i className="fas fa-angle-left" aria-hidden="true"></i>
            </button>

            {/* Show page numbers with max 5 pages visible */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
              )
              .map((page, idx, arr) => {
                // Add ellipsis if gap between pages > 1
                if (
                  idx > 0 &&
                  page - arr[idx - 1] > 1
                ) {
                  return (
                    <React.Fragment key={`ellipsis-${page}`}>
                      <span className="px-2 text-gray-500 select-none">...</span>
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        aria-current={page === currentPage ? "page" : undefined}
                        className={`px-3 py-1 rounded border border-gray-300 text-sm font-medium ${
                          page === currentPage
                            ? "bg-blue-600 text-white cursor-default"
                            : "text-gray-700 hover:bg-gray-200"
                        }`}
                        aria-label={`Go to page ${page}`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`px-3 py-1 rounded border border-gray-300 text-sm font-medium ${
                      page === currentPage
                        ? "bg-blue-600 text-white cursor-default"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                    aria-label={`Go to page ${page}`}
                  >
                    {page}
                  </button>
                );
              })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border border-gray-300 text-sm font-medium ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              aria-label="Go to next page"
            >
              <i className="fas fa-angle-right" aria-hidden="true"></i>
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border border-gray-300 text-sm font-medium ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              aria-label="Go to last page"
            >
              <i className="fas fa-angle-double-right" aria-hidden="true"></i>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}