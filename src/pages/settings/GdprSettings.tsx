import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const requestTypes = [
  "Data Access",
  "Data Deletion",
  "Data Portability",
];

const statuses = [
  "Pending",
  "Completed",
];

export default function GdprSettings() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("GdprSettings");
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

  // Form state for GDPR Settings form
  const [form, setForm] = useState({
    requestType: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Filtered data based on form filters
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesRequestType =
        form.requestType === "" || item.requestType === form.requestType;
      const matchesStatus = form.status === "" || item.status === form.status;
      const matchesStartDate =
        form.startDate === "" || item.requestDate >= form.startDate;
      const matchesEndDate = form.endDate === "" || item.requestDate <= form.endDate;
      return (
        matchesRequestType && matchesStatus && matchesStartDate && matchesEndDate
      );
    });
  }, [form, data]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Button handlers (simulate actions)
  const handleSaveSettings = () => {
    alert("GDPR settings saved successfully.");
  };

  const handleRefresh = () => {
    alert("Data refreshed.");
  };

  const handleGenerateReport = () => {
    alert("Report generated.");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-700">
      <title>GDPR Settings</title>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Title */}
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">GDPR Settings</h1>

        {/* GDPR Settings Form Section */}
        <section className="bg-white rounded-lg shadow p-6 mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Filter Requests</h2>
          <form
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
          >
            {/* Request Type */}
            <div>
              <label
                htmlFor="requestType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Request Type
              </label>
              <select
                id="requestType"
                name="requestType"
                value={form.requestType}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">All</option>
                {requestTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
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
                value={form.status}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">All</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

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
                value={form.startDate}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                value={form.endDate}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* Buttons */}
            <div className="md:col-span-4 flex space-x-4 justify-start mt-4">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <i className="fas fa-filter mr-2"></i> Filter
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <i className="fas fa-save mr-2"></i> Save Settings
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 bg-yellow-500 border border-transparent rounded-md font-semibold text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <i className="fas fa-sync-alt mr-2"></i> Refresh
              </button>
              <button
                type="button"
                onClick={handleGenerateReport}
                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <i className="fas fa-file-alt mr-2"></i> Generate Report
              </button>
            </div>
          </form>
        </section>

        {/* GDPR Requests Table Section */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">GDPR Requests</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Customer Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Phone
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Request Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Request Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500"
                    >
                      No GDPR requests found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.requestType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.requestDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          type="button"
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() =>
                            alert(`Edit request ID ${item.id} clicked.`)
                          }
                          aria-label={`Edit request for ${item.customerName}`}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-900"
                          onClick={() =>
                            alert(`Delete request ID ${item.id} clicked.`)
                          }
                          aria-label={`Delete request for ${item.customerName}`}
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
            className="mt-6 flex justify-between items-center"
            aria-label="Pagination"
          >
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "text-gray-700 bg-white hover:bg-gray-50"
              }`}
              aria-label="Previous Page"
            >
              <i className="fas fa-chevron-left mr-2"></i> Previous
            </button>

            <div className="hidden md:flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                    page === currentPage
                      ? "z-10 bg-indigo-600 border-indigo-600 text-white"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "text-gray-700 bg-white hover:bg-gray-50"
              }`}
              aria-label="Next Page"
            >
              Next <i className="fas fa-chevron-right ml-2"></i>
            </button>
          </nav>
        </section>
      </div>
    </div>
  );
}