import React, { useMemo, useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const paymentStatusOptions = ["All", "Paid", "Pending"];
const orderStatusOptions = ["All", "Delivered", "Processing", "Cancelled"];

export default function PosOrders() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("PosOrders");
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
  const [filterOrderId, setFilterOrderId] = useState("");
  const [filterCustomerName, setFilterCustomerName] = useState("");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("All");
  const [filterOrderStatus, setFilterOrderStatus] = useState("All");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  // Sorting state
  const [sortField, setSortField] = useState<keyof typeof data[0] | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Handlers for sorting
  const handleSort = (field: keyof typeof data[0]) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filtered and sorted data memoized
  const filteredOrders = useMemo(() => {
    return data
      .filter((order) => {
        const matchesOrderId = order.orderId
          .toLowerCase()
          .includes(filterOrderId.toLowerCase());
        const matchesCustomerName = order.customerName
          .toLowerCase()
          .includes(filterCustomerName.toLowerCase());
        const matchesPaymentStatus =
          filterPaymentStatus === "All"
            ? true
            : order.paymentStatus === filterPaymentStatus;
        const matchesOrderStatus =
          filterOrderStatus === "All"
            ? true
            : order.orderStatus === filterOrderStatus;
        const orderDate = new Date(order.date);
        const fromDate = filterDateFrom ? new Date(filterDateFrom) : null;
        const toDate = filterDateTo ? new Date(filterDateTo) : null;
        const matchesDateFrom = fromDate ? orderDate >= fromDate : true;
        const matchesDateTo = toDate ? orderDate <= toDate : true;

        return (
          matchesOrderId &&
          matchesCustomerName &&
          matchesPaymentStatus &&
          matchesOrderStatus &&
          matchesDateFrom &&
          matchesDateTo
        );
      })
      .sort((a, b) => {
        if (!sortField) return 0;
        let aVal: any = a[sortField];
        let bVal: any = b[sortField];
        if (sortField === "date") {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [
    data,
    filterOrderId,
    filterCustomerName,
    filterPaymentStatus,
    filterOrderStatus,
    filterDateFrom,
    filterDateTo,
    sortField,
    sortDirection,
  ]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset filters handler
  const resetFilters = () => {
    setFilterOrderId("");
    setFilterCustomerName("");
    setFilterPaymentStatus("All");
    setFilterOrderStatus("All");
    setFilterDateFrom("");
    setFilterDateTo("");
    setSortField(null);
    setSortDirection("asc");
    setCurrentPage(1);
  };

  // Refresh handler (simulate refresh by resetting filters and page)
  const refreshPage = () => {
    resetFilters();
  };

  // Report handler (simulate report generation)
  const generateReport = () => {
    alert("Report generation is not implemented in this demo.");
  };

  return (
    <>
      <title>POS Orders</title>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
        <div className="container mx-auto px-4 py-6">
          {/* Page Title */}
          <h1 className="text-3xl font-semibold mb-6">POS Orders</h1>

          {/* Filters Section */}
          <section className="bg-white rounded shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Filter Orders</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCurrentPage(1);
              }}
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4"
            >
              {/* Order ID */}
              <div>
                <label
                  htmlFor="orderId"
                  className="block text-sm font-medium mb-1"
                >
                  Order ID
                </label>
                <input
                  type="text"
                  id="orderId"
                  name="orderId"
                  value={filterOrderId}
                  onChange={(e) => setFilterOrderId(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Search Order ID"
                />
              </div>

              {/* Customer Name */}
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
                  name="customerName"
                  value={filterCustomerName}
                  onChange={(e) => setFilterCustomerName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Search Customer"
                />
              </div>

              {/* Payment Status */}
              <div>
                <label
                  htmlFor="paymentStatus"
                  className="block text-sm font-medium mb-1"
                >
                  Payment Status
                </label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={filterPaymentStatus}
                  onChange={(e) => setFilterPaymentStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {paymentStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Order Status */}
              <div>
                <label
                  htmlFor="orderStatus"
                  className="block text-sm font-medium mb-1"
                >
                  Order Status
                </label>
                <select
                  id="orderStatus"
                  name="orderStatus"
                  value={filterOrderStatus}
                  onChange={(e) => setFilterOrderStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {orderStatusOptions.map((status) => (
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
                  className="block text-sm font-medium mb-1"
                >
                  Date From
                </label>
                <input
                  type="date"
                  id="dateFrom"
                  name="dateFrom"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Date To */}
              <div>
                <label
                  htmlFor="dateTo"
                  className="block text-sm font-medium mb-1"
                >
                  Date To
                </label>
                <input
                  type="date"
                  id="dateTo"
                  name="dateTo"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-end space-x-3 md:col-span-6 lg:col-span-6">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <i className="fas fa-filter mr-2"></i> Filter
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <i className="fas fa-undo-alt mr-2"></i> Reset
                </button>
                <button
                  type="button"
                  onClick={refreshPage}
                  className="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <i className="fas fa-sync-alt mr-2"></i> Refresh
                </button>
                <button
                  type="button"
                  onClick={generateReport}
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <i className="fas fa-file-alt mr-2"></i> Report
                </button>
              </div>
            </form>
          </section>

          {/* Orders Table Section */}
          <section className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Orders List</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort("orderId")}
                    >
                      Order ID{" "}
                      {sortField === "orderId" && (
                        <i
                          className={`fas fa-sort-${
                            sortDirection === "asc" ? "up" : "down"
                          } ml-1`}
                        ></i>
                      )}
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort("customerName")}
                    >
                      Customer Name{" "}
                      {sortField === "customerName" && (
                        <i
                          className={`fas fa-sort-${
                            sortDirection === "asc" ? "up" : "down"
                          } ml-1`}
                        ></i>
                      )}
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort("date")}
                    >
                      Date{" "}
                      {sortField === "date" && (
                        <i
                          className={`fas fa-sort-${
                            sortDirection === "asc" ? "up" : "down"
                          } ml-1`}
                        ></i>
                      )}
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort("totalAmount")}
                    >
                      Total Amount{" "}
                      {sortField === "totalAmount" && (
                        <i
                          className={`fas fa-sort-${
                            sortDirection === "asc" ? "up" : "down"
                          } ml-1`}
                        ></i>
                      )}
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort("paymentStatus")}
                    >
                      Payment Status{" "}
                      {sortField === "paymentStatus" && (
                        <i
                          className={`fas fa-sort-${
                            sortDirection === "asc" ? "up" : "down"
                          } ml-1`}
                        ></i>
                      )}
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort("orderStatus")}
                    >
                      Order Status{" "}
                      {sortField === "orderStatus" && (
                        <i
                          className={`fas fa-sort-${
                            sortDirection === "asc" ? "up" : "down"
                          } ml-1`}
                        ></i>
                      )}
                    </th>
                    <th scope="col" className="relative px-4 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedOrders.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No orders found.
                      </td>
                    </tr>
                  )}
                  {paginatedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {order.orderId}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {order.customerName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {order.date}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {order.paymentStatus === "Paid" ? (
                          <span className="inline-flex px-2 text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex px-2 text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {order.orderStatus === "Delivered" ? (
                          <span className="inline-flex px-2 text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Delivered
                          </span>
                        ) : order.orderStatus === "Processing" ? (
                          <span className="inline-flex px-2 text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                            Processing
                          </span>
                        ) : (
                          <span className="inline-flex px-2 text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Cancelled
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                          onClick={() =>
                            alert(
                              `Edit functionality for Order ID: ${order.orderId} is not implemented.`
                            )
                          }
                          aria-label={`Edit order ${order.orderId}`}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <nav
              className="mt-6 flex justify-between items-center"
              aria-label="Pagination"
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed bg-gray-100"
                    : "text-gray-700 bg-white hover:bg-gray-50"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                aria-label="Previous page"
              >
                <i className="fas fa-chevron-left mr-1"></i> Previous
              </button>

              <div className="text-sm text-gray-700">
                Page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className={`inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                  currentPage === totalPages || totalPages === 0
                    ? "text-gray-400 cursor-not-allowed bg-gray-100"
                    : "text-gray-700 bg-white hover:bg-gray-50"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                aria-label="Next page"
              >
                Next <i className="fas fa-chevron-right ml-1"></i>
              </button>
            </nav>
          </section>
        </div>
      </div>
    </>
  );
}