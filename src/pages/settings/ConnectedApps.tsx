import React, { useState, useMemo } from "react";

const connectedAppsData = [
  {
    id: 1,
    appName: "Google",
    appIcon: "fa-google",
    connectedOn: "2023-02-15",
    status: "Active",
    description: "Google account connected for sync",
  },
  {
    id: 2,
    appName: "Facebook",
    appIcon: "fa-facebook-f",
    connectedOn: "2023-01-10",
    status: "Inactive",
    description: "Facebook account disconnected",
  },
  {
    id: 3,
    appName: "Twitter",
    appIcon: "fa-twitter",
    connectedOn: "2023-03-01",
    status: "Active",
    description: "Twitter account connected for sharing",
  },
  {
    id: 4,
    appName: "Slack",
    appIcon: "fa-slack",
    connectedOn: "2023-02-20",
    status: "Active",
    description: "Slack workspace integration",
  },
  {
    id: 5,
    appName: "Dropbox",
    appIcon: "fa-dropbox",
    connectedOn: "2023-01-25",
    status: "Inactive",
    description: "Dropbox disconnected",
  },
  {
    id: 6,
    appName: "GitHub",
    appIcon: "fa-github",
    connectedOn: "2023-03-05",
    status: "Active",
    description: "GitHub repo sync enabled",
  },
  {
    id: 7,
    appName: "LinkedIn",
    appIcon: "fa-linkedin-in",
    connectedOn: "2023-02-28",
    status: "Active",
    description: "LinkedIn profile connected",
  },
  {
    id: 8,
    appName: "Instagram",
    appIcon: "fa-instagram",
    connectedOn: "2023-01-30",
    status: "Inactive",
    description: "Instagram disconnected",
  },
  {
    id: 9,
    appName: "Zoom",
    appIcon: "fa-video",
    connectedOn: "2023-02-18",
    status: "Active",
    description: "Zoom meetings integration",
  },
  {
    id: 10,
    appName: "Trello",
    appIcon: "fa-trello",
    connectedOn: "2023-02-22",
    status: "Active",
    description: "Trello boards sync",
  },
  {
    id: 11,
    appName: "Asana",
    appIcon: "fa-tasks",
    connectedOn: "2023-03-06",
    status: "Active",
    description: "Asana task management",
  },
  {
    id: 12,
    appName: "Spotify",
    appIcon: "fa-spotify",
    connectedOn: "2023-01-15",
    status: "Inactive",
    description: "Spotify disconnected",
  },
];

const pageSizeOptions = [5, 10, 15];

export default function ConnectedApps() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Sorting state (optional, to replicate table header sorting icons)
  const [sortField, setSortField] = useState<keyof typeof connectedAppsData[0] | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filter state (if any filter exists on reference page, here none specified so omitted)

  // Calculate total pages
  const totalPages = Math.ceil(connectedAppsData.length / pageSize);

  // Sort and paginate data
  const paginatedData = useMemo(() => {
    let data = [...connectedAppsData];
    if (sortField) {
      data.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [currentPage, pageSize, sortField, sortOrder]);

  // Handle sorting click
  function handleSort(field: keyof typeof connectedAppsData[0]) {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  }

  // Format date to readable format
  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  // Page navigation handlers
  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  // Refresh button handler (simulate reload)
  function handleRefresh() {
    setCurrentPage(1);
    setSortField(null);
    setSortOrder("asc");
  }

  // Save button handler (simulate save)
  function handleSave() {
    alert("Changes saved successfully!");
  }

  // Report button handler (simulate report generation)
  function handleReport() {
    alert("Report generated!");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold mb-6">Connected Apps</h1>

      {/* Section: Connected Apps Table */}
      <section className="bg-white shadow rounded-lg p-6">
        {/* Header with buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-xl font-semibold mb-3 sm:mb-0">Connected Applications</h2>
          <div className="flex space-x-3">
            <button
              onClick={handleReport}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition"
              type="button"
              aria-label="Generate Report"
            >
              <i className="fas fa-file-alt mr-2"></i> Report
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md text-sm font-medium transition"
              type="button"
              aria-label="Refresh List"
            >
              <i className="fas fa-sync-alt mr-2"></i> Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-md">
            <thead className="bg-gray-100 text-gray-700 text-left text-sm font-semibold select-none">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => handleSort("appName")}
                  aria-sort={sortField === "appName" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
                >
                  App Name
                  {sortField === "appName" && (
                    <i className={`fas fa-sort-${sortOrder === "asc" ? "up" : "down"} ml-1`}></i>
                  )}
                </th>
                <th scope="col" className="px-4 py-3">
                  Icon
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => handleSort("connectedOn")}
                  aria-sort={sortField === "connectedOn" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
                >
                  Connected On
                  {sortField === "connectedOn" && (
                    <i className={`fas fa-sort-${sortOrder === "asc" ? "up" : "down"} ml-1`}></i>
                  )}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => handleSort("status")}
                  aria-sort={sortField === "status" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
                >
                  Status
                  {sortField === "status" && (
                    <i className={`fas fa-sort-${sortOrder === "asc" ? "up" : "down"} ml-1`}></i>
                  )}
                </th>
                <th scope="col" className="px-4 py-3">
                  Description
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {paginatedData.map((app) => (
                <tr
                  key={app.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">{app.appName}</td>
                  <td className="px-4 py-3 text-center">
                    <i className={`fab ${app.appIcon} text-2xl text-blue-600`}></i>
                  </td>
                  <td className="px-4 py-3">{formatDate(app.connectedOn)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        app.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{app.description}</td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      type="button"
                      aria-label={`Edit ${app.appName}`}
                      className="text-blue-600 hover:text-blue-800 transition"
                      onClick={() => alert(`Edit action for ${app.appName}`)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${app.appName}`}
                      className="text-red-600 hover:text-red-800 transition"
                      onClick={() => alert(`Delete action for ${app.appName}`)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No connected apps found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 space-y-3 sm:space-y-0">
          {/* Page size selector */}
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <label htmlFor="pageSize" className="font-medium">
              Rows per page:
            </label>
            <select
              id="pageSize"
              className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Page navigation */}
          <nav
            className="inline-flex items-center space-x-1"
            aria-label="Pagination"
          >
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md border border-gray-300 ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              aria-label="Go to first page"
            >
              <i className="fas fa-angle-double-left"></i>
            </button>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md border border-gray-300 ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              aria-label="Go to previous page"
            >
              <i className="fas fa-angle-left"></i>
            </button>

            {/* Show up to 5 page numbers centered around current page */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 2 && page <= currentPage + 2)
              )
              .map((page, idx, arr) => {
                // Add ellipsis if gap between pages
                if (
                  idx > 0 &&
                  page - arr[idx - 1] > 1
                ) {
                  return (
                    <React.Fragment key={`ellipsis-${page}`}>
                      <span className="px-2 text-gray-500 select-none">…</span>
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        aria-current={page === currentPage ? "page" : undefined}
                        className={`px-3 py-1 rounded-md border border-gray-300 ${
                          page === currentPage
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                }
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`px-3 py-1 rounded-md border border-gray-300 ${
                      page === currentPage
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md border border-gray-300 ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              aria-label="Go to next page"
            >
              <i className="fas fa-angle-right"></i>
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md border border-gray-300 ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              aria-label="Go to last page"
            >
              <i className="fas fa-angle-double-right"></i>
            </button>
          </nav>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            type="button"
            className="flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold transition"
            aria-label="Save changes"
          >
            <i className="fas fa-save mr-2"></i> Save
          </button>
        </div>
      </section>
    </div>
  );
}