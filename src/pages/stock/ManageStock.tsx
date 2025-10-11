import React, { useState, useMemo } from "react";

const stockData = [
  {
    id: 1,
    productName: "Apple iPhone 14 Pro Max",
    productCode: "IP14PM",
    category: "Mobile",
    supplier: "Apple Inc.",
    unit: "Piece",
    purchaseQty: 100,
    saleQty: 80,
    stockQty: 20,
    purchasePrice: 1099,
    salePrice: 1299,
    stockValue: 21980,
  },
  {
    id: 2,
    productName: "Samsung Galaxy S23 Ultra",
    productCode: "SGS23U",
    category: "Mobile",
    supplier: "Samsung",
    unit: "Piece",
    purchaseQty: 150,
    saleQty: 120,
    stockQty: 30,
    purchasePrice: 999,
    salePrice: 1199,
    stockValue: 29970,
  },
  {
    id: 3,
    productName: "Sony WH-1000XM5 Headphones",
    productCode: "SONYWH5",
    category: "Accessories",
    supplier: "Sony",
    unit: "Piece",
    purchaseQty: 200,
    saleQty: 160,
    stockQty: 40,
    purchasePrice: 350,
    salePrice: 399,
    stockValue: 14000,
  },
  {
    id: 4,
    productName: "Dell XPS 13 Laptop",
    productCode: "DXPS13",
    category: "Computers",
    supplier: "Dell",
    unit: "Piece",
    purchaseQty: 50,
    saleQty: 35,
    stockQty: 15,
    purchasePrice: 1200,
    salePrice: 1400,
    stockValue: 18000,
  },
  {
    id: 5,
    productName: "Logitech MX Master 3 Mouse",
    productCode: "LOGMX3",
    category: "Accessories",
    supplier: "Logitech",
    unit: "Piece",
    purchaseQty: 300,
    saleQty: 250,
    stockQty: 50,
    purchasePrice: 100,
    salePrice: 120,
    stockValue: 5000,
  },
  {
    id: 6,
    productName: "Apple MacBook Pro 16\"",
    productCode: "MBP16",
    category: "Computers",
    supplier: "Apple Inc.",
    unit: "Piece",
    purchaseQty: 40,
    saleQty: 30,
    stockQty: 10,
    purchasePrice: 2500,
    salePrice: 2800,
    stockValue: 25000,
  },
  {
    id: 7,
    productName: "Canon EOS R6 Camera",
    productCode: "CANREOSR6",
    category: "Photography",
    supplier: "Canon",
    unit: "Piece",
    purchaseQty: 25,
    saleQty: 20,
    stockQty: 5,
    purchasePrice: 2500,
    salePrice: 2700,
    stockValue: 12500,
  },
  {
    id: 8,
    productName: "HP Envy 15 Laptop",
    productCode: "HPENVY15",
    category: "Computers",
    supplier: "HP",
    unit: "Piece",
    purchaseQty: 60,
    saleQty: 45,
    stockQty: 15,
    purchasePrice: 1100,
    salePrice: 1300,
    stockValue: 16500,
  },
  {
    id: 9,
    productName: "Bose QuietComfort Earbuds",
    productCode: "BOSEQC",
    category: "Accessories",
    supplier: "Bose",
    unit: "Piece",
    purchaseQty: 180,
    saleQty: 150,
    stockQty: 30,
    purchasePrice: 280,
    salePrice: 320,
    stockValue: 8400,
  },
  {
    id: 10,
    productName: "Microsoft Surface Pro 9",
    productCode: "MSPRO9",
    category: "Computers",
    supplier: "Microsoft",
    unit: "Piece",
    purchaseQty: 70,
    saleQty: 55,
    stockQty: 15,
    purchasePrice: 1300,
    salePrice: 1500,
    stockValue: 19500,
  },
  {
    id: 11,
    productName: "Google Pixel 7 Pro",
    productCode: "GP7P",
    category: "Mobile",
    supplier: "Google",
    unit: "Piece",
    purchaseQty: 90,
    saleQty: 70,
    stockQty: 20,
    purchasePrice: 899,
    salePrice: 1099,
    stockValue: 17980,
  },
  {
    id: 12,
    productName: "JBL Charge 5 Speaker",
    productCode: "JBLCH5",
    category: "Accessories",
    supplier: "JBL",
    unit: "Piece",
    purchaseQty: 140,
    saleQty: 110,
    stockQty: 30,
    purchasePrice: 180,
    salePrice: 220,
    stockValue: 5400,
  },
];

const categories = [
  "All Categories",
  "Mobile",
  "Accessories",
  "Computers",
  "Photography",
];

const suppliers = [
  "All Suppliers",
  "Apple Inc.",
  "Samsung",
  "Sony",
  "Dell",
  "Logitech",
  "Canon",
  "HP",
  "Bose",
  "Microsoft",
  "Google",
  "JBL",
];

const units = ["Piece", "Box", "Packet", "Kg"];

const pageSizeOptions = [10, 25, 50, 100];

export default function ManageStock() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [supplierFilter, setSupplierFilter] = useState("All Suppliers");
  const [unitFilter, setUnitFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered and searched data
  const filteredData = useMemo(() => {
    return stockData.filter((item) => {
      const matchesSearch =
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "All Categories" || item.category === categoryFilter;
      const matchesSupplier =
        supplierFilter === "All Suppliers" || item.supplier === supplierFilter;
      const matchesUnit = unitFilter === "" || item.unit === unitFilter;
      return matchesSearch && matchesCategory && matchesSupplier && matchesUnit;
    });
  }, [searchTerm, categoryFilter, supplierFilter, unitFilter]);

  const pageCount = Math.ceil(filteredData.length / pageSize);

  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page < 1) page = 1;
    else if (page > pageCount) page = pageCount;
    setCurrentPage(page);
  };

  // Handlers for buttons (refresh, report, save)
  const handleRefresh = () => {
    // For demo, just reset filters and page
    setSearchTerm("");
    setCategoryFilter("All Categories");
    setSupplierFilter("All Suppliers");
    setUnitFilter("");
    setPageSize(10);
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generation is not implemented in this demo.");
  };

  const handleSave = () => {
    alert("Save functionality is not implemented in this demo.");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <title>Manage Stock</title>

      <div className="max-w-full mx-auto p-6">
        {/* Page Title */}
        <h1 className="text-3xl font-semibold mb-6 text-gray-900">Manage Stock</h1>

        {/* Filters and Actions */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
            className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end"
          >
            {/* Search */}
            <div className="col-span-1 md:col-span-2">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Product Name or Code
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search..."
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

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
                className="w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Supplier */}
            <div>
              <label
                htmlFor="supplier"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Supplier
              </label>
              <select
                id="supplier"
                className="w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
              >
                {suppliers.map((sup) => (
                  <option key={sup} value={sup}>
                    {sup}
                  </option>
                ))}
              </select>
            </div>

            {/* Unit */}
            <div>
              <label
                htmlFor="unit"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Unit
              </label>
              <select
                id="unit"
                className="w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={unitFilter}
                onChange={(e) => setUnitFilter(e.target.value)}
              >
                <option value="">All Units</option>
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex space-x-2 md:justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded"
              >
                <i className="fa fa-search mr-2" aria-hidden="true"></i> Search
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm font-medium rounded"
              >
                <i className="fa fa-refresh mr-2" aria-hidden="true"></i> Refresh
              </button>
            </div>
          </form>
        </div>

        {/* Stock Table */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                  Product Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                  Product Code
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                  Category
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                  Supplier
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                  Unit
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                  Purchase Qty
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                  Sale Qty
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                  Stock Qty
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                  Purchase Price
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                  Sale Price
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                  Stock Value
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {pagedData.length === 0 && (
                <tr>
                  <td
                    colSpan={12}
                    className="px-4 py-6 text-center text-gray-500 italic"
                  >
                    No stock items found.
                  </td>
                </tr>
              )}
              {pagedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">{item.productName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{item.productCode}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{item.category}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{item.supplier}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{item.unit}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {item.purchaseQty}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {item.saleQty}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {item.stockQty}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    ${item.purchasePrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    ${item.salePrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    ${item.stockValue.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap space-x-2">
                    <button
                      type="button"
                      title="Edit"
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={() =>
                        alert(`Edit functionality not implemented for ${item.productName}`)
                      }
                    >
                      <i className="fa fa-pencil" aria-hidden="true"></i>
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      className="text-red-600 hover:text-red-900"
                      onClick={() =>
                        alert(`Delete functionality not implemented for ${item.productName}`)
                      }
                    >
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center space-x-2 mb-2 md:mb-0">
              <label
                htmlFor="pageSize"
                className="text-sm font-medium text-gray-700"
              >
                Show
              </label>
              <select
                id="pageSize"
                className="mt-1 block rounded border border-gray-300 bg-white py-1.5 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
              <span className="text-sm text-gray-700">entries</span>
            </div>

            <nav
              className="inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}
                aria-label="Previous"
              >
                <i className="fa fa-chevron-left" aria-hidden="true"></i>
              </button>

              {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => {
                // Show all pages if <= 7, else show first, last, current +/- 1 with ellipsis
                if (pageCount <= 7) {
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
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
                } else {
                  // Complex pagination with ellipsis
                  if (
                    page === 1 ||
                    page === pageCount ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
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
                  } else if (
                    (page === currentPage - 2 && page > 1) ||
                    (page === currentPage + 2 && page < pageCount)
                  ) {
                    return (
                      <span
                        key={"ellipsis-" + page}
                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 select-none"
                      >
                        &hellip;
                      </span>
                    );
                  } else {
                    return null;
                  }
                }
              })}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === pageCount || pageCount === 0}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                  currentPage === pageCount || pageCount === 0
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
                aria-label="Next"
              >
                <i className="fa fa-chevron-right" aria-hidden="true"></i>
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleReport}
            className="inline-flex items-center px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded"
          >
            <i className="fa fa-file-text-o mr-2" aria-hidden="true"></i> Report
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded"
          >
            <i className="fa fa-floppy-o mr-2" aria-hidden="true"></i> Save
          </button>
        </div>
      </div>
    </div>
  );
}