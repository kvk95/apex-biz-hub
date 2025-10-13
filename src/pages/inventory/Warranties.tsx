import React, { useMemo } from "react";
import { apiService } from "@/services/ApiService";
import React, { useEffect, useState } from "react";

const pageSizeOptions = [5, 10, 15];

export default function Warranties() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Warranties");
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
  const [pageSize, setPageSize] = useState(10);

  // Form state (for search/filter)
  const [searchWarrantyNo, setSearchWarrantyNo] = useState("");
  const [searchCustomerName, setSearchCustomerName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  // Filtered data based on search inputs
  const filteredData = useMemo(() => {
    return data.filter((w) => {
      return (
        w.warrantyNo.toLowerCase().includes(searchWarrantyNo.toLowerCase()) &&
        w.customerName.toLowerCase().includes(searchCustomerName.toLowerCase()) &&
        (searchStatus === "" || w.status === searchStatus)
      );
    });
  }, [data, searchWarrantyNo, searchCustomerName, searchStatus]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handlers
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    setSearchWarrantyNo("");
    setSearchCustomerName("");
    setSearchStatus("");
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generation is not implemented in this demo.");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      <title>Warranties - Dreams POS</title>

      {/* Page Header */}
      <header className="bg-white shadow-sm border-b border-gray-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Warranties</h1>
          <div className="space-x-2">
            <button
              onClick={handleReport}
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded shadow"
              title="Generate Report"
              type="button"
            >
              <i className="fas fa-file-alt mr-2"></i> Report
            </button>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded shadow"
              title="Refresh"
              type="button"
            >
              <i className="fas fa-sync-alt mr-2"></i> Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Search / Filter Section */}
      <section className="container mx-auto px-4 py-6 bg-white rounded shadow mt-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div>
            <label
              htmlFor="warrantyNo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Warranty No
            </label>
            <input
              id="warrantyNo"
              type="text"
              value={searchWarrantyNo}
              onChange={(e) => setSearchWarrantyNo(e.target.value)}
              className="block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Enter Warranty No"
            />
          </div>
          <div>
            <label
              htmlFor="customerName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Customer Name
            </label>
            <input
              id="customerName"
              type="text"
              value={searchCustomerName}
              onChange={(e) => setSearchCustomerName(e.target.value)}
              className="block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Enter Customer Name"
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
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
              className="block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full inline-flex justify-center items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded shadow text-sm"
            >
              <i className="fas fa-search mr-2"></i> Search
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="container mx-auto px-4 py-6 bg-white rounded shadow mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Warranty No
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Customer Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Product Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Purchase Date
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Warranty Period
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-gray-500 italic"
                  >
                    No warranties found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((warranty) => (
                  <tr key={warranty.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{warranty.warrantyNo}</td>
                    <td className="px-4 py-3">{warranty.customerName}</td>
                    <td className="px-4 py-3">{warranty.productName}</td>
                    <td className="px-4 py-3">
                      {new Date(warranty.purchaseDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{warranty.warrantyPeriod}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          warranty.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {warranty.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        type="button"
                        title="Edit"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() =>
                          alert(
                            `Edit functionality for ${warranty.warrantyNo} not implemented.`
                          )
                        }
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        className="text-red-600 hover:text-red-800"
                        onClick={() =>
                          alert(
                            `Delete functionality for ${warranty.warrantyNo} not implemented.`
                          )
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
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-3 md:space-y-0">
          <div className="flex items-center space-x-2">
            <label
              htmlFor="pageSize"
              className="text-sm font-medium text-gray-700"
            >
              Show
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>

          <nav
            className="inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
              aria-label="Previous"
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                aria-current={page === currentPage ? "page" : undefined}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  page === currentPage
                    ? "z-10 bg-blue-600 text-white border-blue-600"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                currentPage === totalPages || totalPages === 0
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
              aria-label="Next"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </nav>
        </div>
      </section>
    </div>
  );
}