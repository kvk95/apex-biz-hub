import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const pageSize = 5;

export default function ExpiredProducts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("ExpiredProducts");
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

  const totalPages = Math.ceil(data.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [currentPage, data]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    loadData();
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generated for expired products.");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-700">
      <title>Expired Products - Dreams POS</title>

      <div className="container mx-auto p-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4 md:mb-0">
            Expired Products
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={handleReport}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded shadow"
              title="Generate Report"
            >
              <i className="fa fa-file-pdf-o mr-2" aria-hidden="true"></i> Report
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded shadow"
              title="Refresh Data"
            >
              <i className="fa fa-refresh mr-2" aria-hidden="true"></i> Refresh
            </button>
          </div>
        </div>

        <section className="bg-white rounded shadow p-4 mb-6">
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="productName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Name
              </label>
              <input
                id="productName"
                name="productName"
                type="text"
                placeholder="Product Name"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                name="category"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option>Fruits</option>
                <option>Dairy</option>
                <option>Bakery</option>
                <option>Vegetables</option>
              </select>
            </div>
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
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Supplier
                </option>
                <option>Supplier A</option>
                <option>Supplier B</option>
                <option>Supplier C</option>
                <option>Supplier D</option>
                <option>Supplier E</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="expiredDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Expired Date
              </label>
              <input
                id="expiredDate"
                name="expiredDate"
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>
        </section>

        <section className="bg-white rounded shadow overflow-x-auto">
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
                  Expired Date
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                  Unit
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                  Cost
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.map((item, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-3 whitespace-nowrap">{item.productName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{item.productCode}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{item.category}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{item.supplier}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{item.expiredDate}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">{item.quantity}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{item.unit}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">${item.cost.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">${item.price.toFixed(2)}</td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-6 text-center text-gray-500 italic"
                  >
                    No expired products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <nav
          className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 mt-4 rounded shadow"
          aria-label="Pagination"
        >
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
            <ul className="inline-flex -space-x-px rounded-md shadow-sm">
              <li>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                    currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  aria-label="Previous"
                >
                  <i className="fa fa-angle-left" aria-hidden="true"></i>
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <li key={page}>
                    <button
                      onClick={() => handlePageChange(page)}
                      aria-current={page === currentPage ? "page" : undefined}
                      className={`relative inline-flex items-center border border-gray-300 px-4 py-2 text-sm font-medium focus:z-20 ${
                        page === currentPage
                          ? "z-10 bg-blue-600 text-white shadow"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  </li>
                )
              )}

              <li>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                    currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  aria-label="Next"
                >
                  <i className="fa fa-angle-right" aria-hidden="true"></i>
                </button>
              </li>
            </ul>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:justify-end">
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * pageSize, data.length)}
              </span>{" "}
              of <span className="font-medium">{data.length}</span>{" "}
              results
            </p>
          </div>
        </nav>
      </div>
    </div>
  );
}