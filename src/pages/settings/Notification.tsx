import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const pageSizeOptions = [5, 10, 15, 20];

export default function Notification() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Notification");
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

  // Filtered and searched notifications
  const filteredNotifications = useMemo(() => {
    return data
      .filter((n) =>
        filterType ? n.notificationType === filterType : true
      )
      .filter((n) => (filterStatus ? n.status === filterStatus : true))
      .filter((n) =>
        searchText
          ? n.notificationTitle
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            n.notificationDetails.toLowerCase().includes(searchText.toLowerCase())
          : true
      );
  }, [data, filterType, filterStatus, searchText]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredNotifications.length / pageSize);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handlers
  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    // For demo, just reset filters and page
    setFilterType("");
    setFilterStatus("");
    setSearchText("");
    setPageSize(5);
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generated (demo).");
  };

  return (
    <>
      <title>Notification - Dreams POS</title>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
        <div className="container mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-semibold text-gray-900 mb-4 md:mb-0">
              Notification
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={handleReport}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                type="button"
                aria-label="Generate Report"
              >
                <i className="fa fa-file-pdf-o mr-2" aria-hidden="true"></i> Report
              </button>
              <button
                onClick={handleRefresh}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
                type="button"
                aria-label="Refresh"
              >
                <i className="fa fa-refresh mr-2" aria-hidden="true"></i> Refresh
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="bg-white rounded shadow p-4 mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              {/* Notification Type */}
              <div>
                <label
                  htmlFor="notificationType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Notification Type
                </label>
                <select
                  id="notificationType"
                  name="notificationType"
                  value={filterType}
                  onChange={handleFilterTypeChange}
                  className="block w-full rounded border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="">All Types</option>
                  <option value="Order">Order</option>
                  <option value="Payment">Payment</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Promotion">Promotion</option>
                  <option value="Alert">Alert</option>
                  <option value="System">System</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={filterStatus}
                  onChange={handleFilterStatusChange}
                  className="block w-full rounded border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Search */}
              <div className="md:col-span-2">
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  name="search"
                  placeholder="Search notifications..."
                  value={searchText}
                  onChange={handleSearchChange}
                  className="block w-full rounded border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>

              {/* Page Size */}
              <div>
                <label
                  htmlFor="pageSize"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Show Entries
                </label>
                <select
                  id="pageSize"
                  name="pageSize"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="block w-full rounded border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  {pageSizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>

          {/* Notification Table */}
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700 w-28">
                    Type
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Details
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700 w-40">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700 w-24">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedNotifications.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No notifications found.
                    </td>
                  </tr>
                ) : (
                  paginatedNotifications.map((n) => (
                    <tr
                      key={n.id}
                      className={
                        n.status === "Inactive"
                          ? "bg-gray-50 text-gray-400"
                          : "bg-white"
                      }
                    >
                      <td className="px-4 py-3 font-medium">{n.notificationType}</td>
                      <td className="px-4 py-3">{n.notificationTitle}</td>
                      <td className="px-4 py-3">{n.notificationDetails}</td>
                      <td className="px-4 py-3">{n.notificationDate}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                            n.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-300 text-gray-600"
                          }`}
                        >
                          {n.status}
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
            className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 mt-4"
            aria-label="Pagination"
          >
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                  currentPage === totalPages || totalPages === 0
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * pageSize, filteredNotifications.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredNotifications.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm ml-6"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 ${
                      currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    aria-label="Previous"
                  >
                    <i className="fa fa-chevron-left" aria-hidden="true"></i>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        aria-current={page === currentPage ? "page" : undefined}
                        className={`relative z-10 inline-flex items-center border px-4 py-2 text-sm font-medium focus:z-20 ${
                          page === currentPage
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 ${
                      currentPage === totalPages || totalPages === 0
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                    aria-label="Next"
                  >
                    <i className="fa fa-chevron-right" aria-hidden="true"></i>
                  </button>
                </nav>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}