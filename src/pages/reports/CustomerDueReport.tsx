import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const pageSize = 5;

export default function CustomerDueReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [searchDueFrom, setSearchDueFrom] = useState("");
  const [searchDueTo, setSearchDueTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("CustomerDueReport");
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

  // Filter customers based on search fields
  const filteredCustomers = useMemo(() => {
    return data.filter((c: any) => {
      const matchName = c.name.toLowerCase().includes(searchName.toLowerCase());
      const matchPhone = c.phone.toLowerCase().includes(searchPhone.toLowerCase());
      const matchEmail = c.email.toLowerCase().includes(searchEmail.toLowerCase());
      const matchAddress = c.address.toLowerCase().includes(searchAddress.toLowerCase());
      const dueFromNum = parseFloat(searchDueFrom);
      const dueToNum = parseFloat(searchDueTo);
      const matchDueFrom = isNaN(dueFromNum) ? true : c.dueAmount >= dueFromNum;
      const matchDueTo = isNaN(dueToNum) ? true : c.dueAmount <= dueToNum;
      return matchName && matchPhone && matchEmail && matchAddress && matchDueFrom && matchDueTo;
    });
  }, [data, searchName, searchPhone, searchEmail, searchAddress, searchDueFrom, searchDueTo]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchName, searchPhone, searchEmail, searchAddress, searchDueFrom, searchDueTo]);

  // Handlers
  const handleReset = () => {
    setSearchName("");
    setSearchPhone("");
    setSearchEmail("");
    setSearchAddress("");
    setSearchDueFrom("");
    setSearchDueTo("");
  };

  const handleRefresh = () => {
    // In real app, would fetch fresh data; here just reset filters and page
    handleReset();
    setCurrentPage(1);
  };

  const handleReport = () => {
    // Placeholder for report generation logic
    alert("Report generated (placeholder)");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <title>Customer Due Report</title>

      <div className="max-w-7xl mx-auto p-6">
        {/* Title */}
        <h1 className="text-2xl font-semibold mb-6 border-b border-gray-300 pb-2">
          Customer Due Report
        </h1>

        {/* Filter Section */}
        <section className="bg-white rounded shadow p-6 mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6"
            aria-label="Filter Customer Due Report"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Customer Name
              </label>
              <input
                id="name"
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter name"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone
              </label>
              <input
                id="phone"
                type="text"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter phone"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter email"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">
                Address
              </label>
              <input
                id="address"
                type="text"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter address"
              />
            </div>

            <div>
              <label htmlFor="dueFrom" className="block text-sm font-medium mb-1">
                Due Amount From
              </label>
              <input
                id="dueFrom"
                type="number"
                min="0"
                step="0.01"
                value={searchDueFrom}
                onChange={(e) => setSearchDueFrom(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Min due"
              />
            </div>

            <div>
              <label htmlFor="dueTo" className="block text-sm font-medium mb-1">
                Due Amount To
              </label>
              <input
                id="dueTo"
                type="number"
                min="0"
                step="0.01"
                value={searchDueTo}
                onChange={(e) => setSearchDueTo(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Max due"
              />
            </div>

            {/* Buttons row spanning full width */}
            <div className="md:col-span-3 lg:col-span-6 flex space-x-3 mt-2">
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Search"
              >
                <i className="fas fa-search mr-2" aria-hidden="true"></i> Search
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
                aria-label="Reset"
              >
                <i className="fas fa-undo mr-2" aria-hidden="true"></i> Reset
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Refresh"
              >
                <i className="fas fa-sync-alt mr-2" aria-hidden="true"></i> Refresh
              </button>
              <button
                type="button"
                onClick={handleReport}
                className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 ml-auto"
                aria-label="Generate Report"
              >
                <i className="fas fa-file-alt mr-2" aria-hidden="true"></i> Report
              </button>
            </div>
          </form>
        </section>

        {/* Table Section */}
        <section className="bg-white rounded shadow p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    #
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Customer Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Phone
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Address
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-700">
                    Due Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="border border-gray-300 px-4 py-4 text-center text-gray-500"
                    >
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  paginatedCustomers.map((customer: any, idx: number) => (
                    <tr
                      key={customer.id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                        {customer.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                        {customer.phone}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                        {customer.email}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                        {customer.address}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-right text-red-600 font-semibold">
                        ${customer.dueAmount.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <nav
            className="flex items-center justify-between mt-4"
            aria-label="Pagination"
          >
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-gray-700 bg-white hover:bg-gray-50"
                }`}
                aria-label="Previous page"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages || totalPages === 0
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-gray-700 bg-white hover:bg-gray-50"
                }`}
                aria-label="Next page"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * pageSize, filteredCustomers.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredCustomers.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px ml-6"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                      currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    aria-label="First page"
                  >
                    <i className="fas fa-angle-double-left" aria-hidden="true"></i>
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                      currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    aria-label="Previous page"
                  >
                    <i className="fas fa-angle-left" aria-hidden="true"></i>
                  </button>

                  {/* Page numbers */}
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    const isCurrent = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        aria-current={isCurrent ? "page" : undefined}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                          isCurrent
                            ? "z-10 bg-blue-600 text-white border-blue-600 cursor-default"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                      currentPage === totalPages || totalPages === 0
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                    aria-label="Next page"
                  >
                    <i className="fas fa-angle-right" aria-hidden="true"></i>
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                      currentPage === totalPages || totalPages === 0
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                    aria-label="Last page"
                  >
                    <i className="fas fa-angle-double-right" aria-hidden="true"></i>
                  </button>
                </nav>
              </div>
            </div>
          </nav>
        </section>
      </div>
    </div>
  );
}