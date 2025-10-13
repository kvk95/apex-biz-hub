import React, { useEffect, useState } from "react";
import { apiService } from "@/services/ApiService";

const pageSizeOptions = [5, 10, 15, 20];

function PrintBarcode() {
  // Page title
  useEffect(() => {
    document.title = "Print Barcode | Dreams POS";
  }, []);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("PrintBarcode");
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

  // States for filters and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPageSize, setSelectedPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [printQuantity, setPrintQuantity] = useState(1);
  const [barcodeType, setBarcodeType] = useState("code128");
  const [priceType, setPriceType] = useState("selling");
  const [showPrice, setShowPrice] = useState(true);
  const [showProductName, setShowProductName] = useState(true);
  const [showProductCode, setShowProductCode] = useState(true);

  // Filtered data based on search
  const filteredData = data.filter(
    (item: any) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / selectedPageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * selectedPageSize,
    currentPage * selectedPageSize
  );

  // Handlers
  const toggleSelectProduct = (id: number) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((pid) => pid !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === paginatedData.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(paginatedData.map((item) => item.id));
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPageSize(Number(e.target.value));
    setCurrentPage(1);
    setSelectedProducts([]);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setSelectedProducts([]);
  };

  // Dummy handlers for buttons (refresh, save, report)
  const handleRefresh = () => {
    setSearchTerm("");
    setSelectedProducts([]);
    setCurrentPage(1);
  };

  const handleSave = () => {
    alert("Save functionality is not implemented in this demo.");
  };

  const handleReport = () => {
    alert("Report functionality is not implemented in this demo.");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Page Container */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Title */}
        <h1 className="text-2xl font-semibold mb-6">Print Barcode</h1>

        {/* Filters & Settings Section */}
        <section className="bg-white shadow rounded-lg p-6 mb-6">
          <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
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
                placeholder="Search by name or code"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Barcode Type */}
            <div>
              <label
                htmlFor="barcodeType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Barcode Type
              </label>
              <select
                id="barcodeType"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={barcodeType}
                onChange={(e) => setBarcodeType(e.target.value)}
              >
                <option value="code128">Code 128</option>
                <option value="code39">Code 39</option>
                <option value="ean13">EAN 13</option>
                <option value="upc">UPC</option>
              </select>
            </div>

            {/* Price Type */}
            <div>
              <label
                htmlFor="priceType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price Type
              </label>
              <select
                id="priceType"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={priceType}
                onChange={(e) => setPriceType(e.target.value)}
              >
                <option value="selling">Selling Price</option>
                <option value="purchase">Purchase Price</option>
                <option value="mrp">MRP</option>
              </select>
            </div>

            {/* Print Quantity */}
            <div>
              <label
                htmlFor="printQuantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Print Quantity
              </label>
              <input
                id="printQuantity"
                type="number"
                min={1}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={printQuantity}
                onChange={(e) =>
                  setPrintQuantity(Math.max(1, Number(e.target.value)))
                }
              />
            </div>

            {/* Show Product Name */}
            <div className="flex items-center space-x-2">
              <input
                id="showProductName"
                type="checkbox"
                checked={showProductName}
                onChange={() => setShowProductName(!showProductName)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label
                htmlFor="showProductName"
                className="text-sm font-medium text-gray-700"
              >
                Show Product Name
              </label>
            </div>

            {/* Show Product Code */}
            <div className="flex items-center space-x-2">
              <input
                id="showProductCode"
                type="checkbox"
                checked={showProductCode}
                onChange={() => setShowProductCode(!showProductCode)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label
                htmlFor="showProductCode"
                className="text-sm font-medium text-gray-700"
              >
                Show Product Code
              </label>
            </div>

            {/* Show Price */}
            <div className="flex items-center space-x-2">
              <input
                id="showPrice"
                type="checkbox"
                checked={showPrice}
                onChange={() => setShowPrice(!showPrice)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label
                htmlFor="showPrice"
                className="text-sm font-medium text-gray-700"
              >
                Show Price
              </label>
            </div>
          </form>
        </section>

        {/* Table Section */}
        <section className="bg-white shadow rounded-lg p-6">
          {/* Table Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-3 md:space-y-0">
            {/* Page Size */}
            <div className="flex items-center space-x-2">
              <label
                htmlFor="pageSize"
                className="text-sm font-medium text-gray-700"
              >
                Show
              </label>
              <select
                id="pageSize"
                className="rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedPageSize}
                onChange={handlePageSizeChange}
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-700">entries</span>
            </div>

            {/* Buttons */}
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Refresh"
              >
                <i className="fas fa-sync-alt mr-2"></i> Refresh
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center px-3 py-1.5 border border-indigo-600 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Save"
              >
                <i className="fas fa-save mr-2"></i> Save
              </button>
              <button
                type="button"
                onClick={handleReport}
                className="inline-flex items-center px-3 py-1.5 border border-green-600 rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                title="Report"
              >
                <i className="fas fa-file-alt mr-2"></i> Report
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      onChange={toggleSelectAll}
                      checked={
                        paginatedData.length > 0 &&
                        selectedProducts.length === paginatedData.length
                      }
                      aria-label="Select all products on current page"
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Product Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Product Code
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Price
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Barcode
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-sm text-gray-500"
                    >
                      No products found.
                    </td>
                  </tr>
                )}
                {paginatedData.map((item: any) => (
                  <tr
                    key={item.id}
                    className={
                      selectedProducts.includes(item.id)
                        ? "bg-indigo-50"
                        : undefined
                    }
                  >
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(item.id)}
                        onChange={() => toggleSelectProduct(item.id)}
                        aria-label={`Select product ${item.productName}`}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {item.productName}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {item.productCode}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 font-mono">
                      {item.barcode}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <nav
            className="mt-4 flex justify-between items-center"
            aria-label="Pagination"
          >
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * selectedPageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * selectedPageSize, filteredData.length)}
              </span>{" "}
              of <span className="font-medium">{filteredData.length}</span> entries
            </div>
            <ul className="inline-flex -space-x-px rounded-md shadow-sm">
              <li>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                    currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  aria-label="Previous"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page}>
                  <button
                    onClick={() => handlePageChange(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                      page === currentPage
                        ? "z-10 bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                    currentPage === totalPages || totalPages === 0
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                  aria-label="Next"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </section>
      </div>
    </div>
  );
}

export default PrintBarcode;