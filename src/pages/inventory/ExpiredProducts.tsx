import React, { useState, useMemo } from "react";

const expiredProductsData = [
  {
    productName: "Apple",
    productCode: "PRD001",
    category: "Fruits",
    supplier: "Supplier A",
    expiredDate: "2023-09-10",
    quantity: 120,
    unit: "Kg",
    cost: 1.2,
    price: 2.5,
  },
  {
    productName: "Banana",
    productCode: "PRD002",
    category: "Fruits",
    supplier: "Supplier B",
    expiredDate: "2023-09-05",
    quantity: 200,
    unit: "Kg",
    cost: 0.8,
    price: 1.5,
  },
  {
    productName: "Milk",
    productCode: "PRD003",
    category: "Dairy",
    supplier: "Supplier C",
    expiredDate: "2023-09-01",
    quantity: 50,
    unit: "Ltr",
    cost: 0.5,
    price: 1.0,
  },
  {
    productName: "Cheese",
    productCode: "PRD004",
    category: "Dairy",
    supplier: "Supplier C",
    expiredDate: "2023-08-25",
    quantity: 30,
    unit: "Kg",
    cost: 3.0,
    price: 5.0,
  },
  {
    productName: "Bread",
    productCode: "PRD005",
    category: "Bakery",
    supplier: "Supplier D",
    expiredDate: "2023-09-12",
    quantity: 100,
    unit: "Pcs",
    cost: 0.3,
    price: 0.8,
  },
  {
    productName: "Yogurt",
    productCode: "PRD006",
    category: "Dairy",
    supplier: "Supplier C",
    expiredDate: "2023-09-03",
    quantity: 80,
    unit: "Pcs",
    cost: 0.6,
    price: 1.2,
  },
  {
    productName: "Orange",
    productCode: "PRD007",
    category: "Fruits",
    supplier: "Supplier A",
    expiredDate: "2023-09-07",
    quantity: 150,
    unit: "Kg",
    cost: 1.1,
    price: 2.0,
  },
  {
    productName: "Butter",
    productCode: "PRD008",
    category: "Dairy",
    supplier: "Supplier C",
    expiredDate: "2023-08-30",
    quantity: 40,
    unit: "Kg",
    cost: 2.5,
    price: 4.0,
  },
  {
    productName: "Tomato",
    productCode: "PRD009",
    category: "Vegetables",
    supplier: "Supplier E",
    expiredDate: "2023-09-06",
    quantity: 180,
    unit: "Kg",
    cost: 0.9,
    price: 1.8,
  },
  {
    productName: "Potato",
    productCode: "PRD010",
    category: "Vegetables",
    supplier: "Supplier E",
    expiredDate: "2023-09-08",
    quantity: 220,
    unit: "Kg",
    cost: 0.7,
    price: 1.4,
  },
  {
    productName: "Cucumber",
    productCode: "PRD011",
    category: "Vegetables",
    supplier: "Supplier E",
    expiredDate: "2023-09-04",
    quantity: 90,
    unit: "Kg",
    cost: 0.6,
    price: 1.3,
  },
  {
    productName: "Lettuce",
    productCode: "PRD012",
    category: "Vegetables",
    supplier: "Supplier E",
    expiredDate: "2023-09-02",
    quantity: 70,
    unit: "Kg",
    cost: 0.5,
    price: 1.0,
  },
  {
    productName: "Strawberry",
    productCode: "PRD013",
    category: "Fruits",
    supplier: "Supplier A",
    expiredDate: "2023-09-09",
    quantity: 60,
    unit: "Kg",
    cost: 2.0,
    price: 3.5,
  },
  {
    productName: "Blueberry",
    productCode: "PRD014",
    category: "Fruits",
    supplier: "Supplier A",
    expiredDate: "2023-09-11",
    quantity: 55,
    unit: "Kg",
    cost: 2.2,
    price: 3.8,
  },
  {
    productName: "Eggs",
    productCode: "PRD015",
    category: "Dairy",
    supplier: "Supplier C",
    expiredDate: "2023-09-13",
    quantity: 300,
    unit: "Pcs",
    cost: 0.1,
    price: 0.2,
  },
];

const pageSize = 5;

export default function ExpiredProducts() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(expiredProductsData.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return expiredProductsData.slice(start, start + pageSize);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    // In real app, refresh data here
    // For this static example, just reset page to 1
    setCurrentPage(1);
  };

  const handleReport = () => {
    // Placeholder for report generation
    alert("Report generated for expired products.");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-700">
      {/* Title */}
      <title>Expired Products - Dreams POS</title>

      <div className="container mx-auto p-6">
        {/* Header */}
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

        {/* Filters Section */}
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

        {/* Table Section */}
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

        {/* Pagination */}
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
                {Math.min(currentPage * pageSize, expiredProductsData.length)}
              </span>{" "}
              of <span className="font-medium">{expiredProductsData.length}</span>{" "}
              results
            </p>
          </div>
        </nav>
      </div>
    </div>
  );
}