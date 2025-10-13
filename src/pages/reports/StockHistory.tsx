import React, { useMemo, useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const suppliers = [
  { value: "", label: "Select Supplier" },
  { value: "Supplier X", label: "Supplier X" },
  { value: "Supplier Y", label: "Supplier Y" },
  { value: "Supplier Z", label: "Supplier Z" },
];

const products = [
  { value: "", label: "Select Product" },
  { value: "Product A", label: "Product A" },
  { value: "Product B", label: "Product B" },
  { value: "Product C", label: "Product C" },
  { value: "Product D", label: "Product D" },
  { value: "Product E", label: "Product E" },
  { value: "Product F", label: "Product F" },
  { value: "Product G", label: "Product G" },
  { value: "Product H", label: "Product H" },
  { value: "Product I", label: "Product I" },
  { value: "Product J", label: "Product J" },
  { value: "Product K", label: "Product K" },
  { value: "Product L", label: "Product L" },
];

const StockHistory: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("StockHistory");
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
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtered data memoized
  const filteredData = useMemo(() => {
    return data.filter((item: any) => {
      const itemDate = new Date(item.date);
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;

      if (fromDate && itemDate < fromDate) return false;
      if (toDate && itemDate > toDate) return false;
      if (selectedSupplier && item.supplierName !== selectedSupplier) return false;
      if (selectedProduct && item.productName !== selectedProduct) return false;
      return true;
    });
  }, [data, dateFrom, dateTo, selectedSupplier, selectedProduct]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [dateFrom, dateTo, selectedSupplier, selectedProduct]);

  // Handlers
  const handleReset = () => {
    setDateFrom("");
    setDateTo("");
    setSelectedSupplier("");
    setSelectedProduct("");
  };

  const handleRefresh = () => {
    // For demo, refresh just resets filters and page
    handleReset();
  };

  const handleReport = () => {
    // For demo, alert report generation
    alert("Report generated for current filtered data.");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Page Title */}
      <title>Stock History - Dreams POS</title>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <h1 className="text-2xl font-semibold mb-6">Stock History</h1>

        {/* Filters Section */}
        <section className="bg-white rounded shadow p-6 mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
            className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
          >
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
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
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
                name="supplier"
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {suppliers.map((sup) => (
                  <option key={sup.value} value={sup.value}>
                    {sup.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Product */}
            <div>
              <label
                htmlFor="product"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product
              </label>
              <select
                id="product"
                name="product"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {products.map((prod) => (
                  <option key={prod.value} value={prod.value}>
                    {prod.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex space-x-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <i className="fa-thin fa-magnifying-glass mr-2"></i> Search
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center rounded border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <i className="fa-thin fa-rotate-left mr-2"></i> Reset
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center justify-center rounded border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <i className="fa-thin fa-arrows-rotate mr-2"></i> Refresh
              </button>
              <button
                type="button"
                onClick={handleReport}
                className="inline-flex items-center justify-center rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <i className="fa-thin fa-file-chart-column mr-2"></i> Report
              </button>
            </div>
          </form>
        </section>

        {/* Table Section */}
        <section className="bg-white rounded shadow p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="whitespace-nowrap px-3 py-2 text-left font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="whitespace-nowrap px-3 py-2 text-left font-semibold text-gray-700">
                    Product Name
                  </th>
                  <th className="whitespace-nowrap px-3 py-2 text-left font-semibold text-gray-700">
                    Product Code
                  </th>
                  <th className="whitespace-nowrap px-3 py-2 text-left font-semibold text-gray-700">
                    Supplier Name
                  </th>
                  <th className="whitespace-nowrap px-3 py-2 text-right font-semibold text-gray-700">
                    Purchase Qty
                  </th>
                  <th className="whitespace-nowrap px-3 py-2 text-right font-semibold text-gray-700">
                    Purchase Return Qty
                  </th>
                  <th className="whitespace-nowrap px-3 py-2 text-right font-semibold text-gray-700">
                    Sales Qty
                  </th>
                  <th className="whitespace-nowrap px-3 py-2 text-right font-semibold text-gray-700">
                    Sales Return Qty
                  </th>
                  <th className="whitespace-nowrap px-3 py-2 text-right font-semibold text-gray-700">
                    Stock Qty
                  </th>
                  <th className="whitespace-nowrap px-3 py-2 text-right font-semibold text-gray-700">
                    Unit Price
                  </th>
                  <th className="whitespace-nowrap px-3 py-2 text-right font-semibold text-gray-700">
                    Total Price
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="whitespace-nowrap px-3 py-4 text-center text-gray-500"
                    >
                      No records found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, idx) => (
                    <tr
                      key={`${item.productCode}-${item.date}-${idx}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-3 py-2">{item.date}</td>
                      <td className="whitespace-nowrap px-3 py-2">{item.productName}</td>
                      <td className="whitespace-nowrap px-3 py-2">{item.productCode}</td>
                      <td className="whitespace-nowrap px-3 py-2">{item.supplierName}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-right">
                        {item.purchaseQty}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right">
                        {item.purchaseReturnQty}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right">
                        {item.salesQty}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right">
                        {item.salesReturnQty}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right">
                        {item.stockQty}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right">
                        ${item.totalPrice.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <nav
            className="flex items-center justify-between border-t border-gray-200 px-4 py-3 mt-4"
            aria-label="Pagination"
          >
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                  currentPage === totalPages || totalPages === 0
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
              <ul className="inline-flex -space-x-px rounded-md shadow-sm">
                <li>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                      currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    aria-label="Previous"
                  >
                    <i className="fa-thin fa-chevron-left"></i>
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <li key={page}>
                    <button
                      onClick={() => setCurrentPage(page)}
                      aria-current={page === currentPage ? "page" : undefined}
                      className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium focus:z-20 ${
                        page === currentPage
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
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
                    className={`relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                      currentPage === totalPages || totalPages === 0
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                    aria-label="Next"
                  >
                    <i className="fa-thin fa-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </section>
      </div>
    </div>
  );
};

export default StockHistory;