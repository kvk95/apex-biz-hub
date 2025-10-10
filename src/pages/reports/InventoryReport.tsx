import React, { useState, useMemo } from "react";

const inventoryData = [
  {
    id: 1,
    productName: "Apple iPhone 14 Pro Max",
    sku: "IP14PM-256GB",
    category: "Smartphones",
    brand: "Apple",
    quantity: 120,
    price: 1199.99,
    totalValue: 143998.8,
    status: "In Stock",
  },
  {
    id: 2,
    productName: "Samsung Galaxy S23 Ultra",
    sku: "SGS23U-512GB",
    category: "Smartphones",
    brand: "Samsung",
    quantity: 85,
    price: 1299.99,
    totalValue: 110499.15,
    status: "In Stock",
  },
  {
    id: 3,
    productName: "Sony WH-1000XM5 Headphones",
    sku: "SONYWHXM5",
    category: "Audio",
    brand: "Sony",
    quantity: 200,
    price: 399.99,
    totalValue: 79998,
    status: "In Stock",
  },
  {
    id: 4,
    productName: "Dell XPS 15 Laptop",
    sku: "DELLXPS15",
    category: "Laptops",
    brand: "Dell",
    quantity: 45,
    price: 1499.99,
    totalValue: 67499.55,
    status: "Low Stock",
  },
  {
    id: 5,
    productName: "Apple MacBook Air M2",
    sku: "MBAIR-M2",
    category: "Laptops",
    brand: "Apple",
    quantity: 30,
    price: 1199.99,
    totalValue: 35999.7,
    status: "Low Stock",
  },
  {
    id: 6,
    productName: "Logitech MX Master 3 Mouse",
    sku: "LOGIMX3",
    category: "Accessories",
    brand: "Logitech",
    quantity: 150,
    price: 99.99,
    totalValue: 14998.5,
    status: "In Stock",
  },
  {
    id: 7,
    productName: "Canon EOS R6 Camera",
    sku: "CANONR6",
    category: "Cameras",
    brand: "Canon",
    quantity: 25,
    price: 2499.99,
    totalValue: 62499.75,
    status: "Low Stock",
  },
  {
    id: 8,
    productName: "Apple Watch Series 8",
    sku: "AWS8",
    category: "Wearables",
    brand: "Apple",
    quantity: 100,
    price: 399.99,
    totalValue: 39999,
    status: "In Stock",
  },
  {
    id: 9,
    productName: "Samsung Galaxy Tab S8",
    sku: "SGTS8",
    category: "Tablets",
    brand: "Samsung",
    quantity: 60,
    price: 699.99,
    totalValue: 41999.4,
    status: "In Stock",
  },
  {
    id: 10,
    productName: "Bose QuietComfort Earbuds",
    sku: "BOSEQC",
    category: "Audio",
    brand: "Bose",
    quantity: 80,
    price: 279.99,
    totalValue: 22399.2,
    status: "In Stock",
  },
  {
    id: 11,
    productName: "Microsoft Surface Pro 9",
    sku: "MSPRO9",
    category: "Tablets",
    brand: "Microsoft",
    quantity: 40,
    price: 999.99,
    totalValue: 39999.6,
    status: "Low Stock",
  },
  {
    id: 12,
    productName: "Google Pixel 7 Pro",
    sku: "PIX7P",
    category: "Smartphones",
    brand: "Google",
    quantity: 70,
    price: 899.99,
    totalValue: 62999.3,
    status: "In Stock",
  },
  {
    id: 13,
    productName: "JBL Flip 6 Speaker",
    sku: "JBLFLIP6",
    category: "Audio",
    brand: "JBL",
    quantity: 110,
    price: 129.99,
    totalValue: 14298.9,
    status: "In Stock",
  },
  {
    id: 14,
    productName: "HP Envy 13 Laptop",
    sku: "HPENVY13",
    category: "Laptops",
    brand: "HP",
    quantity: 50,
    price: 1099.99,
    totalValue: 54999.5,
    status: "In Stock",
  },
  {
    id: 15,
    productName: "Fitbit Charge 5",
    sku: "FITCHG5",
    category: "Wearables",
    brand: "Fitbit",
    quantity: 90,
    price: 149.99,
    totalValue: 13499.1,
    status: "In Stock",
  },
];

const categories = [
  "All Categories",
  "Smartphones",
  "Laptops",
  "Audio",
  "Accessories",
  "Cameras",
  "Wearables",
  "Tablets",
];

const brands = [
  "All Brands",
  "Apple",
  "Samsung",
  "Sony",
  "Dell",
  "Logitech",
  "Canon",
  "Bose",
  "Microsoft",
  "Google",
  "JBL",
  "HP",
  "Fitbit",
];

const statuses = ["All Status", "In Stock", "Low Stock", "Out of Stock"];

const InventoryReport: React.FC = () => {
  // Filters state
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtered data based on filters and search
  const filteredData = useMemo(() => {
    return inventoryData.filter((item) => {
      const matchCategory =
        selectedCategory === "All Categories" ||
        item.category === selectedCategory;
      const matchBrand =
        selectedBrand === "All Brands" || item.brand === selectedBrand;
      const matchStatus =
        selectedStatus === "All Status" || item.status === selectedStatus;
      const matchSearch =
        searchTerm === "" ||
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase());

      // Date filter is not applicable as data has no date field, so ignore

      return matchCategory && matchBrand && matchStatus && matchSearch;
    });
  }, [selectedCategory, selectedBrand, selectedStatus, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleResetFilters = () => {
    setSelectedCategory("All Categories");
    setSelectedBrand("All Brands");
    setSelectedStatus("All Status");
    setSearchTerm("");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Title as per reference page: "Inventory Report"
  React.useEffect(() => {
    document.title = "Inventory Report";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto p-6">
        {/* Page Title */}
        <h1 className="text-3xl font-semibold mb-6">Inventory Report</h1>

        {/* Filters Section */}
        <section className="bg-white rounded shadow p-6 mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
            className="grid grid-cols-1 md:grid-cols-6 gap-4"
          >
            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                className="block w-full rounded border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
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
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Brand
              </label>
              <select
                id="brand"
                name="brand"
                className="block w-full rounded border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
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
                className="block w-full rounded border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div>
              <label
                htmlFor="dateFrom"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date From
              </label>
              <input
                type="date"
                id="dateFrom"
                name="dateFrom"
                className="block w-full rounded border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            {/* Date To */}
            <div>
              <label
                htmlFor="dateTo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date To
              </label>
              <input
                type="date"
                id="dateTo"
                name="dateTo"
                className="block w-full rounded border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
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
                placeholder="Search by Product Name or SKU"
                className="block w-full rounded border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="flex items-end space-x-3 md:col-span-4">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Filter
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Generate Report
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                Refresh
              </button>
            </div>
          </form>
        </section>

        {/* Table Section */}
        <section className="bg-white rounded shadow p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                    Product Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                    Brand
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                    Price ($)
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                    Total Value ($)
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No records found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">{item.productName}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{item.sku}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{item.category}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{item.brand}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">{item.quantity}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {item.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {item.totalValue.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            item.status === "In Stock"
                              ? "bg-green-100 text-green-800"
                              : item.status === "Low Stock"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredData.length)}
              </span>{" "}
              of <span className="font-medium">{filteredData.length}</span> results
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

              {/* Page numbers */}
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? "z-10 bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

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
            </nav>
          </div>
        </section>
      </div>
    </div>
  );
};

export default InventoryReport;