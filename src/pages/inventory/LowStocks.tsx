import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const categories = [
  "All Categories",
  "Mobile",
  "Headphones",
  "Laptop",
  "Accessories",
  "Smart Home",
  "Tablet",
  "Speaker",
  "Camera",
];

export default function LowStocks() {
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filters states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("LowStocks");
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

  // Filtered and searched data
  const filteredData = useMemo(() => {
    return data.filter((item: any) => {
      const matchesCategory =
        selectedCategory === "All Categories" ||
        item.category === selectedCategory;
      const matchesSearch =
        item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [data, searchTerm, selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [currentPage, filteredData]);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setCurrentPage(1);
  };

  const handleReport = () => {
    // For demonstration, just alert. In real app, implement report generation.
    alert("Report generated for low stock items.");
  };

  return (
    <>
      <title>Low Stocks - Dreams POS</title>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
        {/* Header */}
        <div className="bg-white shadow p-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Low Stocks</h1>
          <div className="flex space-x-2">
            <button
              onClick={handleReport}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition"
              type="button"
            >
              <i className="fas fa-file-alt"></i> Report
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded text-sm font-medium transition"
              type="button"
              aria-label="Refresh"
            >
              <i className="fas fa-sync-alt"></i> Refresh
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white shadow mt-6 p-4 rounded">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col md:flex-row md:items-end md:space-x-6 space-y-4 md:space-y-0"
          >
            <div className="flex flex-col w-full md:w-1/3">
              <label
                htmlFor="search"
                className="mb-1 text-gray-700 font-semibold text-sm"
              >
                Search Product or Supplier
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by product or supplier"
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col w-full md:w-1/4">
              <label
                htmlFor="category"
                className="mb-1 text-gray-700 font-semibold text-sm"
              >
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
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
          </form>
        </div>

        {/* Table Section */}
        <div className="bg-white shadow mt-6 rounded overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Product Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Category
                </th>
                <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-700">
                  Quantity
                </th>
                <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-700">
                  Price ($)
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Supplier
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-gray-500 text-sm"
                  >
                    No low stock items found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => (
                  <tr
                    key={`${item.product}-${idx}`}
                    className="even:bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      {item.product}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      {item.category}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-right">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-right">
                      {item.price.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      {item.supplier}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <nav
          className="flex justify-between items-center bg-white shadow mt-4 rounded px-4 py-3"
          aria-label="Table navigation"
        >
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-semibold">{paginatedData.length}</span> of{" "}
              <span className="font-semibold">{filteredData.length}</span> results
            </p>
          </div>
          <ul className="inline-flex items-center -space-x-px">
            <li>
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`block px-3 py-1.5 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-white`}
                aria-label="Previous"
              >
                <i className="fas fa-angle-left"></i>
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page}>
                <button
                  onClick={() => setCurrentPage(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`px-3 py-1.5 border border-gray-300 text-sm font-medium ${
                    page === currentPage
                      ? "z-10 text-blue-600 bg-blue-50 border-blue-300"
                      : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`block px-3 py-1.5 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-white`}
                aria-label="Next"
              >
                <i className="fas fa-angle-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}