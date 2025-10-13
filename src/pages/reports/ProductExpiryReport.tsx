import { apiService } from "@/services/ApiService";
import React, { useEffect, useMemo, useState } from "react";

type ProductExpiry = {
  productName: string;
  productCode: string;
  barcode: string;
  category: string;
  subCategory: string;
  brand: string;
  unit: string;
  quantity: number;
  expiryDate: string; // ISO string yyyy-mm-dd
  purchasePrice: number;
  salePrice: number;
  warehouse: string;
  supplier: string;
  status: "Expired" | "Expiring" | "Safe";
};

const CATEGORIES = [
  "All",
  "Beverages",
  "Dairy",
  "Condiments",
  "Spices",
];

const BRANDS = [
  "All",
  "FreshFarms",
  "DairyBest",
  "CheeseCo",
  "ButterKing",
  "SauceMaster",
  "SpiceWorld",
];

const WAREHOUSES = [
  "All",
  "Main Warehouse",
  "Secondary Warehouse",
];

const SUPPLIERS = [
  "All",
  "Supplier A",
  "Supplier B",
  "Supplier C",
  "Supplier D",
  "Supplier E",
];

const STATUS_OPTIONS = [
  "All",
  "Expired",
  "Expiring",
  "Safe",
];

const PAGE_SIZE = 5;

export default function ProductExpiryReport() {
  const [data, setData] = useState<ProductExpiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<ProductExpiry[]>("ProductExpiryReport");
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

  // Filters state
  const [productName, setProductName] = useState("");
  const [productCode, setProductCode] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [warehouse, setWarehouse] = useState("All");
  const [supplier, setSupplier] = useState("All");
  const [status, setStatus] = useState("All");
  const [expiryFrom, setExpiryFrom] = useState("");
  const [expiryTo, setExpiryTo] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered data memoized
  const filteredData = useMemo(() => {
    return data.filter((p) => {
      if (productName && !p.productName.toLowerCase().includes(productName.toLowerCase()))
        return false;
      if (productCode && !p.productCode.toLowerCase().includes(productCode.toLowerCase()))
        return false;
      if (category !== "All" && p.category !== category) return false;
      if (brand !== "All" && p.brand !== brand) return false;
      if (warehouse !== "All" && p.warehouse !== warehouse) return false;
      if (supplier !== "All" && p.supplier !== supplier) return false;
      if (status !== "All" && p.status !== status) return false;
      if (expiryFrom && p.expiryDate < expiryFrom) return false;
      if (expiryTo && p.expiryDate > expiryTo) return false;
      return true;
    });
  }, [data, productName, productCode, category, brand, warehouse, supplier, status, expiryFrom, expiryTo]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Handlers
  const onResetFilters = () => {
    setProductName("");
    setProductCode("");
    setCategory("All");
    setBrand("All");
    setWarehouse("All");
    setSupplier("All");
    setStatus("All");
    setExpiryFrom("");
    setExpiryTo("");
    setCurrentPage(1);
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const onPageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Title as in reference page
  React.useEffect(() => {
    document.title = "Product Expiry Report";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="container mx-auto px-4 py-6">
        {/* Title */}
        <h1 className="text-2xl font-semibold mb-6">Product Expiry Report</h1>

        {/* Filter Section */}
        <form
          onSubmit={onSearch}
          className="bg-white rounded shadow p-6 mb-6"
          aria-label="Filter product expiry report"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Product Name */}
            <div>
              <label
                htmlFor="productName"
                className="block text-sm font-medium mb-1"
              >
                Product Name
              </label>
              <input
                id="productName"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
              />
            </div>

            {/* Product Code */}
            <div>
              <label
                htmlFor="productCode"
                className="block text-sm font-medium mb-1"
              >
                Product Code
              </label>
              <input
                id="productCode"
                type="text"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product code"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium mb-1"
              >
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label
                htmlFor="brand"
                className="block text-sm font-medium mb-1"
              >
                Brand
              </label>
              <select
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Warehouse */}
            <div>
              <label
                htmlFor="warehouse"
                className="block text-sm font-medium mb-1"
              >
                Warehouse
              </label>
              <select
                id="warehouse"
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {WAREHOUSES.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            {/* Supplier */}
            <div>
              <label
                htmlFor="supplier"
                className="block text-sm font-medium mb-1"
              >
                Supplier
              </label>
              <select
                id="supplier"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SUPPLIERS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-1"
              >
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Expiry Date From */}
            <div>
              <label
                htmlFor="expiryFrom"
                className="block text-sm font-medium mb-1"
              >
                Expiry Date From
              </label>
              <input
                id="expiryFrom"
                type="date"
                value={expiryFrom}
                onChange={(e) => setExpiryFrom(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Expiry Date To */}
            <div>
              <label
                htmlFor="expiryTo"
                className="block text-sm font-medium mb-1"
              >
                Expiry Date To
              </label>
              <input
                id="expiryTo"
                type="date"
                value={expiryTo}
                onChange={(e) => setExpiryTo(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex space-x-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Search
            </button>
            <button
              type="button"
              onClick={onResetFilters}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="ml-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Print Report
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              Refresh
            </button>
          </div>
        </form>

        {/* Table Section */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                  Product Name
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                  Product Code
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                  Barcode
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                  Category
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                  Sub Category
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                  Brand
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                  Unit
                </th>
                <th className="px-4 py-2 text-right font-medium text-gray-700 whitespace-nowrap">
                  Quantity
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                  Expiry Date
                </th>
                <th className="px-4 py-2 text-right font-medium text-gray-700 whitespace-nowrap">
                  Purchase Price
                </th>
                <th className="px-4 py-2 text-right font-medium text-gray-700 whitespace-nowrap">
                  Sale Price
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                  Warehouse
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                  Supplier
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={14}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((p, idx) => (
                  <tr
                    key={`${p.productCode}-${idx}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2 whitespace-nowrap">{p.productName}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{p.productCode}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{p.barcode}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{p.category}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{p.subCategory}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{p.brand}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{p.unit}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-right">{p.quantity}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{p.expiryDate}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-right">${p.purchasePrice.toFixed(2)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-right">${p.salePrice.toFixed(2)}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{p.warehouse}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{p.supplier}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                          p.status === "Expired"
                            ? "bg-red-100 text-red-800"
                            : p.status === "Expiring"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {p.status}
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
          aria-label="Pagination"
          className="flex items-center justify-between mt-4"
        >
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "text-gray-700 bg-white hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === totalPages || totalPages === 0
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "text-gray-700 bg-white hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
            <ul className="inline-flex -space-x-px rounded-md shadow-sm">
              <li>
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                    currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  aria-label="Previous"
                >
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              </li>
              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page}>
                  <button
                    onClick={() => onPageChange(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? "z-10 bg-blue-600 text-white border-blue-600"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                    currentPage === totalPages || totalPages === 0
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                  aria-label="Next"
                >
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </li>
            </ul>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-end text-sm text-gray-700">
            <p>
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * PAGE_SIZE + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * PAGE_SIZE, filteredData.length)}
              </span>{" "}
              of <span className="font-medium">{filteredData.length}</span> results
            </p>
          </div>
        </nav>
      </div>
    </div>
  );
}