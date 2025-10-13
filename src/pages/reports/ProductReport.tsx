import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const categories = [
  "All",
  "Mobile",
  "Laptop",
  "Accessories",
  "Monitor",
  "Camera",
  "Tablet",
];

const units = ["PCS", "Box", "Kg", "Liter"];

export default function ProductReport() {
  // Filters state
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("All");
  const [unit, setUnit] = useState("PCS");
  const [minStock, setMinStock] = useState("");
  const [maxStock, setMaxStock] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("ProductReport");
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

  // Filter and search logic
  const filteredData = useMemo(() => {
    return data
      .filter((p) =>
        productCode.trim()
          ? p.productCode.toLowerCase().includes(productCode.trim().toLowerCase())
          : true
      )
      .filter((p) =>
        productName.trim()
          ? p.productName.toLowerCase().includes(productName.trim().toLowerCase())
          : true
      )
      .filter((p) => (category === "All" ? true : p.category === category))
      .filter((p) => (unit ? p.unit === unit : true))
      .filter((p) =>
        minStock.trim() ? p.stockQty >= Number(minStock) : true
      )
      .filter((p) =>
        maxStock.trim() ? p.stockQty <= Number(maxStock) : true
      );
  }, [data, productCode, productName, category, unit, minStock, maxStock]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleReset = () => {
    setProductCode("");
    setProductName("");
    setCategory("All");
    setUnit("PCS");
    setMinStock("");
    setMaxStock("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6 text-gray-900">Product Report</h1>

      {/* Filter Section */}
      <section className="bg-white rounded shadow p-6 mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4"
          aria-label="Product report filters"
        >
          {/* Product Code */}
          <div className="flex flex-col">
            <label htmlFor="productCode" className="mb-1 font-medium text-gray-700">
              Product Code
            </label>
            <input
              id="productCode"
              type="text"
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              placeholder="Enter product code"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Product Name */}
          <div className="flex flex-col">
            <label htmlFor="productName" className="mb-1 font-medium text-gray-700">
              Product Name
            </label>
            <input
              id="productName"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label htmlFor="category" className="mb-1 font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Unit */}
          <div className="flex flex-col">
            <label htmlFor="unit" className="mb-1 font-medium text-gray-700">
              Unit
            </label>
            <select
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Min Stock */}
          <div className="flex flex-col">
            <label htmlFor="minStock" className="mb-1 font-medium text-gray-700">
              Min Stock Qty
            </label>
            <input
              id="minStock"
              type="number"
              min={0}
              value={minStock}
              onChange={(e) => setMinStock(e.target.value)}
              placeholder="Min stock quantity"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Max Stock */}
          <div className="flex flex-col">
            <label htmlFor="maxStock" className="mb-1 font-medium text-gray-700">
              Max Stock Qty
            </label>
            <input
              id="maxStock"
              type="number"
              min={0}
              value={maxStock}
              onChange={(e) => setMaxStock(e.target.value)}
              placeholder="Max stock quantity"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-end space-x-4 md:col-span-6 lg:col-span-6">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center"
              aria-label="Search products"
            >
              <i className="fa-thin fa-magnifying-glass mr-2"></i> Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center"
              aria-label="Reset filters"
            >
              <i className="fa-thin fa-arrows-rotate mr-2"></i> Reset
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-white rounded shadow p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm font-light border-collapse border border-gray-200">
            <thead className="bg-indigo-600 text-white font-semibold">
              <tr>
                <th className="border border-indigo-700 px-4 py-2">Product Code</th>
                <th className="border border-indigo-700 px-4 py-2">Product Name</th>
                <th className="border border-indigo-700 px-4 py-2">Category</th>
                <th className="border border-indigo-700 px-4 py-2">Unit</th>
                <th className="border border-indigo-700 px-4 py-2">Purchase Price</th>
                <th className="border border-indigo-700 px-4 py-2">Sale Price</th>
                <th className="border border-indigo-700 px-4 py-2">Stock Qty</th>
                <th className="border border-indigo-700 px-4 py-2">Stock Value</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-4 text-gray-500 italic border border-gray-300"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((p) => (
                  <tr
                    key={p.productCode}
                    className="hover:bg-indigo-50 border border-gray-300"
                  >
                    <td className="border border-gray-300 px-4 py-2">{p.productCode}</td>
                    <td className="border border-gray-300 px-4 py-2">{p.productName}</td>
                    <td className="border border-gray-300 px-4 py-2">{p.category}</td>
                    <td className="border border-gray-300 px-4 py-2">{p.unit}</td>
                    <td className="border border-gray-300 px-4 py-2">${p.purchasePrice.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-2">${p.salePrice.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-2">{p.stockQty}</td>
                    <td className="border border-gray-300 px-4 py-2">${p.stockValue.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <nav
          className="flex items-center justify-between mt-4"
          aria-label="Pagination"
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
            aria-label="Previous page"
          >
            <i className="fa-thin fa-chevron-left mr-1"></i> Previous
          </button>

          {/* Page numbers */}
          <ul className="inline-flex -space-x-px">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page}>
                <button
                  onClick={() => handlePageChange(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`px-3 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    page === currentPage
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 hover:bg-indigo-100"
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
            aria-label="Next page"
          >
            Next <i className="fa-thin fa-chevron-right ml-1"></i>
          </button>
        </nav>
      </section>
    </div>
  );
}