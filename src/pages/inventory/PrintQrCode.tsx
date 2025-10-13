import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const categories = ["All", "Category A", "Category B", "Category C"];

const pageSizeOptions = [10, 25, 50, 100];

const PrintQrCode: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("PrintQrCode");
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

  React.useEffect(() => {
    document.title = "Print QR Code";
  }, []);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;
      const matchesSearch =
        item.productName.toLowerCase().includes(search.toLowerCase()) ||
        item.productCode.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, categoryFilter, data]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [currentPage, pageSize, filteredData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
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
    setSearch("");
    setCategoryFilter("All");
    setPageSize(10);
    setCurrentPage(1);
  };

  const handleReport = () => alert("Report generated.");
  const handleSave = () => alert("Save action triggered.");
  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">Print QR Code</h1>

      <section className="bg-white rounded shadow p-6 mb-6">
        <form className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-col w-full sm:w-1/3">
            <label
              htmlFor="search"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Search Product
            </label>
            <input
              id="search"
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by name or code"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col w-full sm:w-1/4">
            <label
              htmlFor="category"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              value={categoryFilter}
              onChange={handleCategoryChange}
              className="border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full sm:w-1/5">
            <label
              htmlFor="pageSize"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Show Entries
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded shadow-sm transition"
              title="Refresh"
            >
              <i className="fas fa-sync-alt mr-2"></i> Refresh
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm transition"
              title="Generate Report"
            >
              <i className="fas fa-file-alt mr-2"></i> Report
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow-sm transition"
              title="Save"
            >
              <i className="fas fa-save mr-2"></i> Save
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow-sm transition"
              title="Print"
            >
              <i className="fas fa-print mr-2"></i> Print
            </button>
          </div>
        </form>
      </section>

      <section className="bg-white rounded shadow p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-300">
                  #
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-300">
                  Product Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-300">
                  Product Code
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-300">
                  Category
                </th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600 uppercase border-r border-gray-300">
                  Price
                </th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600 uppercase">
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-4 text-gray-500 italic text-sm"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors cursor-default"
                  >
                    <td className="px-4 py-2 border-r border-gray-300">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="px-4 py-2 border-r border-gray-300">
                      {item.productName}
                    </td>
                    <td className="px-4 py-2 border-r border-gray-300">
                      {item.productCode}
                    </td>
                    <td className="px-4 py-2 border-r border-gray-300">
                      {item.category}
                    </td>
                    <td className="px-4 py-2 border-r border-gray-300 text-right">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right">{item.quantity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold">
              {Math.min(currentPage * pageSize, filteredData.length)}
            </span>{" "}
            of <span className="font-semibold">{filteredData.length}</span> entries
          </div>

          <nav
            className="inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
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
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
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
};

export default PrintQrCode;