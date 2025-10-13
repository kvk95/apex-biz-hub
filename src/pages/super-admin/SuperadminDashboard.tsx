import React, { useMemo, useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const pageTitle = "Superadmin Dashboard";

const pageSize = 5;

export default function SuperadminDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchOrderId, setSearchOrderId] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("SuperadminDashboard");
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

  // Assuming data.result contains keys like summaryCardsData, salesReportData, recentOrdersData
  // For now, fallback to empty arrays if data is not structured yet
  const summaryCardsData = data.summaryCardsData || [];
  const salesReportData = data.salesReportData || [];
  const recentOrdersData = data.recentOrdersData || [];

  // Filter recent orders by search fields
  const filteredOrders = useMemo(() => {
    return recentOrdersData.filter((order: any) => {
      return (
        order.orderId.toLowerCase().includes(searchOrderId.toLowerCase()) &&
        order.customerName.toLowerCase().includes(searchCustomer.toLowerCase()) &&
        (searchStatus === "" || order.status === searchStatus)
      );
    });
  }, [searchOrderId, searchCustomer, searchStatus, recentOrdersData]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRefresh = () => {
    setSearchOrderId("");
    setSearchCustomer("");
    setSearchStatus("");
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generated (placeholder)");
  };

  return (
    <>
      <title>{pageTitle}</title>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{pageTitle}</h1>
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 focus:outline-none"
            aria-label="Refresh"
            title="Refresh"
          >
            <i className="fas fa-sync-alt"></i>
            <span>Refresh</span>
          </button>
        </header>

        <main className="p-6 space-y-8">
          {/* Summary Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {summaryCardsData.map(({ title, value, icon, bgColor }: any) => (
              <div
                key={title}
                className={`flex items-center p-4 rounded-lg shadow-md text-white ${bgColor}`}
              >
                <div className="text-3xl mr-4">
                  <i className={icon}></i>
                </div>
                <div>
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-xl font-bold">{value}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Sales Report Section */}
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Sales Report</h2>
              <button
                onClick={handleReport}
                className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 focus:outline-none"
                aria-label="Generate Report"
                title="Generate Report"
              >
                <i className="fas fa-file-alt mr-2"></i> Report
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-gray-700">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2">Month</th>
                    <th className="px-4 py-2">Sales ($)</th>
                    <th className="px-4 py-2">Orders</th>
                    <th className="px-4 py-2">Customers</th>
                  </tr>
                </thead>
                <tbody>
                  {salesReportData.map(({ month, sales, orders, customers }: any) => (
                    <tr
                      key={month}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-4 py-2">{month}</td>
                      <td className="px-4 py-2">{sales.toLocaleString()}</td>
                      <td className="px-4 py-2">{orders.toLocaleString()}</td>
                      <td className="px-4 py-2">{customers.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Recent Orders Section */}
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Orders</h2>
              <button
                onClick={handleReport}
                className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 focus:outline-none"
                aria-label="Generate Report"
                title="Generate Report"
              >
                <i className="fas fa-file-alt mr-2"></i> Report
              </button>
            </div>

            {/* Filters */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCurrentPage(1);
              }}
              className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <div>
                <label
                  htmlFor="searchOrderId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Order ID
                </label>
                <input
                  id="searchOrderId"
                  type="text"
                  value={searchOrderId}
                  onChange={(e) => setSearchOrderId(e.target.value)}
                  placeholder="Search Order ID"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="searchCustomer"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Customer Name
                </label>
                <input
                  id="searchCustomer"
                  type="text"
                  value={searchCustomer}
                  onChange={(e) => setSearchCustomer(e.target.value)}
                  placeholder="Search Customer"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="searchStatus"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="searchStatus"
                  value={searchStatus}
                  onChange={(e) => setSearchStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Processing">Processing</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </form>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-gray-700">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2">Order ID</th>
                    <th className="px-4 py-2">Customer</th>
                    <th className="px-4 py-2">Product</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Price ($)</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-6 text-gray-500 italic"
                      >
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map(
                      ({
                        id,
                        orderId,
                        customerName,
                        product,
                        quantity,
                        price,
                        status,
                        date,
                      }: any) => (
                        <tr
                          key={id}
                          className="border-b last:border-b-0 hover:bg-gray-50"
                        >
                          <td className="px-4 py-2 font-mono">{orderId}</td>
                          <td className="px-4 py-2">{customerName}</td>
                          <td className="px-4 py-2">{product}</td>
                          <td className="px-4 py-2 text-center">{quantity}</td>
                          <td className="px-4 py-2 text-right">
                            {price.toFixed(2)}
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                                status === "Delivered"
                                  ? "bg-green-100 text-green-800"
                                  : status === "Processing"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {status}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            {new Date(date).toLocaleDateString("en-US")}
                          </td>
                          <td className="px-4 py-2 space-x-2">
                            <button
                              type="button"
                              className="text-blue-600 hover:text-blue-800 focus:outline-none"
                              title="Edit"
                              aria-label={`Edit order ${orderId}`}
                              onClick={() =>
                                alert(`Edit functionality for ${orderId}`)
                              }
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              type="button"
                              className="text-red-600 hover:text-red-800 focus:outline-none"
                              title="Delete"
                              aria-label={`Delete order ${orderId}`}
                              onClick={() =>
                                alert(`Delete functionality for ${orderId}`)
                              }
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <nav
              className="mt-4 flex justify-center items-center space-x-2"
              aria-label="Pagination"
            >
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border border-gray-300 ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                aria-label="Previous page"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded border border-gray-300 ${
                      page === currentPage
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                    aria-current={page === currentPage ? "page" : undefined}
                    aria-label={`Page ${page}`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded border border-gray-300 ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                aria-label="Next page"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </nav>
          </section>
        </main>
      </div>
    </>
  );
}