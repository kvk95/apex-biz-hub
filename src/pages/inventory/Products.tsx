import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";

const categories = [
  "All Categories",
  "Mobile",
  "Laptop",
  "Accessories",
  "Wearable",
  "Camera",
];

const statuses = ["All Status", "Active", "Inactive"];

export default function Products() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Products");
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

  // Filtered and searched products
  const filteredProducts = useMemo(() => {
    return data
      .filter((p) =>
        selectedCategory === "All Categories"
          ? true
          : p.category === selectedCategory
      )
      .filter((p) =>
        selectedStatus === "All Status" ? true : p.status === selectedStatus
      )
      .filter((p) =>
        p.productName.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
  }, [data, searchTerm, selectedCategory, selectedStatus]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setSelectedStatus("All Status");
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report functionality is not implemented in this demo.");
  };

  return (
    <>
      <title>Products - Dreams POS</title>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-semibold text-gray-900 mb-4 md:mb-0">
              Products
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={handleReport}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded shadow"
                title="Generate Report"
              >
                <i className="fas fa-file-alt mr-2" aria-hidden="true"></i>
                Report
              </button>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm font-medium rounded shadow"
                title="Refresh"
              >
                <i className="fas fa-sync-alt mr-2" aria-hidden="true"></i>
                Refresh
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded shadow p-4 mb-6">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <div>
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Search Product
                </label>
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search by product name"
                  className="block w-full rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="block w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
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
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  className="block w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm font-medium rounded shadow"
                  title="Clear Filters"
                >
                  <i className="fas fa-times mr-2" aria-hidden="true"></i>
                  Clear Filters
                </button>
              </div>
            </form>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700 uppercase tracking-wider">
                    Price ($)
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-center font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : paginatedProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No products found.
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((product, idx) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3">
                        <img
                          src={product.image}
                          alt={product.productName}
                          className="w-12 h-12 rounded object-contain"
                        />
                        <span className="font-medium text-gray-900">
                          {product.productName}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-700 font-semibold">
                        {product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-700">
                        {product.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                        <button
                          title="Edit"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() =>
                            alert(
                              `Edit functionality is not implemented. Product: ${product.productName}`
                            )
                          }
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          title="Delete"
                          className="text-red-600 hover:text-red-800"
                          onClick={() =>
                            alert(
                              `Delete functionality is not implemented. Product: ${product.productName}`
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

          {/* Pagination */}
          <nav
            className="flex items-center justify-between py-3"
            aria-label="Table navigation"
          >
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                  currentPage === 1
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                  currentPage === totalPages || totalPages === 0
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                      currentPage === 1
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                    aria-label="Previous"
                  >
                    <span className="sr-only">Previous</span>
                    <i className="fas fa-chevron-left"></i>
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        aria-current={page === currentPage ? "page" : undefined}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? "z-10 bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                      currentPage === totalPages || totalPages === 0
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                    aria-label="Next"
                  >
                    <span className="sr-only">Next</span>
                    <i className="fas fa-chevron-right"></i>
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