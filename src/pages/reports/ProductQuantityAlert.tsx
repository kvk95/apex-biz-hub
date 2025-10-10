import React, { useState, useEffect } from "react";

type Product = {
  productCode: string;
  productName: string;
  category: string;
  subCategory: string;
  brand: string;
  unit: string;
  alertQuantity: number;
  quantity: number;
};

const PRODUCTS_DATA: Product[] = [
  {
    productCode: "P-0001",
    productName: "Apple iPhone 14 Pro Max",
    category: "Electronics",
    subCategory: "Mobile Phones",
    brand: "Apple",
    unit: "Piece",
    alertQuantity: 5,
    quantity: 3,
  },
  {
    productCode: "P-0002",
    productName: "Samsung Galaxy S22 Ultra",
    category: "Electronics",
    subCategory: "Mobile Phones",
    brand: "Samsung",
    unit: "Piece",
    alertQuantity: 7,
    quantity: 2,
  },
  {
    productCode: "P-0003",
    productName: "Sony WH-1000XM4 Headphones",
    category: "Electronics",
    subCategory: "Audio",
    brand: "Sony",
    unit: "Piece",
    alertQuantity: 10,
    quantity: 8,
  },
  {
    productCode: "P-0004",
    productName: "Dell XPS 13 Laptop",
    category: "Computers",
    subCategory: "Laptops",
    brand: "Dell",
    unit: "Piece",
    alertQuantity: 4,
    quantity: 1,
  },
  {
    productCode: "P-0005",
    productName: "Logitech MX Master 3 Mouse",
    category: "Computers",
    subCategory: "Accessories",
    brand: "Logitech",
    unit: "Piece",
    alertQuantity: 15,
    quantity: 12,
  },
  {
    productCode: "P-0006",
    productName: "HP Envy Printer",
    category: "Office Equipment",
    subCategory: "Printers",
    brand: "HP",
    unit: "Piece",
    alertQuantity: 3,
    quantity: 1,
  },
  {
    productCode: "P-0007",
    productName: "Canon EOS 90D Camera",
    category: "Photography",
    subCategory: "Cameras",
    brand: "Canon",
    unit: "Piece",
    alertQuantity: 2,
    quantity: 0,
  },
  {
    productCode: "P-0008",
    productName: "Nike Air Max 270",
    category: "Footwear",
    subCategory: "Sneakers",
    brand: "Nike",
    unit: "Pair",
    alertQuantity: 20,
    quantity: 18,
  },
  {
    productCode: "P-0009",
    productName: "Adidas Ultraboost",
    category: "Footwear",
    subCategory: "Running Shoes",
    brand: "Adidas",
    unit: "Pair",
    alertQuantity: 15,
    quantity: 10,
  },
  {
    productCode: "P-0010",
    productName: "KitchenAid Stand Mixer",
    category: "Home Appliances",
    subCategory: "Kitchen",
    brand: "KitchenAid",
    unit: "Piece",
    alertQuantity: 6,
    quantity: 4,
  },
  {
    productCode: "P-0011",
    productName: "Samsung 55\" QLED TV",
    category: "Electronics",
    subCategory: "Televisions",
    brand: "Samsung",
    unit: "Piece",
    alertQuantity: 3,
    quantity: 2,
  },
  {
    productCode: "P-0012",
    productName: "Bose SoundLink Speaker",
    category: "Electronics",
    subCategory: "Audio",
    brand: "Bose",
    unit: "Piece",
    alertQuantity: 8,
    quantity: 7,
  },
  {
    productCode: "P-0013",
    productName: "Microsoft Surface Pro 8",
    category: "Computers",
    subCategory: "Tablets",
    brand: "Microsoft",
    unit: "Piece",
    alertQuantity: 5,
    quantity: 3,
  },
  {
    productCode: "P-0014",
    productName: "Apple MacBook Air M2",
    category: "Computers",
    subCategory: "Laptops",
    brand: "Apple",
    unit: "Piece",
    alertQuantity: 4,
    quantity: 2,
  },
  {
    productCode: "P-0015",
    productName: "Sony PlayStation 5",
    category: "Gaming",
    subCategory: "Consoles",
    brand: "Sony",
    unit: "Piece",
    alertQuantity: 7,
    quantity: 5,
  },
];

const PAGE_SIZE = 5;

export default function ProductQuantityAlert() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered products that are below alert quantity
  const alertProducts = PRODUCTS_DATA.filter(
    (p) => p.quantity <= p.alertQuantity
  );

  // Pagination calculations
  const totalPages = Math.ceil(alertProducts.length / PAGE_SIZE);

  // Current page products slice
  const currentProducts = alertProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Handlers for pagination buttons
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Page title as in reference page
  useEffect(() => {
    document.title = "Product Quantity Alert - Dreams POS";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-700 font-sans">
      {/* Container */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Page Title */}
        <h1 className="text-2xl font-semibold mb-6">Product Quantity Alert</h1>

        {/* Search & Action Section */}
        <section className="bg-white rounded shadow p-4 mb-6">
          <form className="flex flex-wrap items-center gap-4">
            {/* Product Code */}
            <div className="flex flex-col w-48">
              <label
                htmlFor="productCode"
                className="text-sm font-medium mb-1 text-gray-600"
              >
                Product Code
              </label>
              <input
                id="productCode"
                type="text"
                placeholder="Enter Product Code"
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Product Name */}
            <div className="flex flex-col w-48">
              <label
                htmlFor="productName"
                className="text-sm font-medium mb-1 text-gray-600"
              >
                Product Name
              </label>
              <input
                id="productName"
                type="text"
                placeholder="Enter Product Name"
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col w-48">
              <label
                htmlFor="category"
                className="text-sm font-medium mb-1 text-gray-600"
              >
                Category
              </label>
              <select
                id="category"
                className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option>Electronics</option>
                <option>Computers</option>
                <option>Office Equipment</option>
                <option>Photography</option>
                <option>Footwear</option>
                <option>Home Appliances</option>
                <option>Gaming</option>
              </select>
            </div>

            {/* Brand */}
            <div className="flex flex-col w-48">
              <label
                htmlFor="brand"
                className="text-sm font-medium mb-1 text-gray-600"
              >
                Brand
              </label>
              <select
                id="brand"
                className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Brand
                </option>
                <option>Apple</option>
                <option>Samsung</option>
                <option>Sony</option>
                <option>Dell</option>
                <option>Logitech</option>
                <option>HP</option>
                <option>Canon</option>
                <option>Nike</option>
                <option>Adidas</option>
                <option>KitchenAid</option>
                <option>Bose</option>
                <option>Microsoft</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex items-end space-x-3">
              <button
                type="button"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded shadow"
                title="Search"
              >
                Search
              </button>
              <button
                type="button"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold px-4 py-2 rounded shadow"
                title="Refresh"
              >
                Refresh
              </button>
              <button
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded shadow"
                title="Save"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold px-4 py-2 rounded shadow"
                title="Report"
              >
                Report
              </button>
            </div>
          </form>
        </section>

        {/* Table Section */}
        <section className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                  Product Code
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                  Product Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                  Category
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                  Sub Category
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                  Brand
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                  Unit
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                  Alert Quantity
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No products matching alert criteria.
                  </td>
                </tr>
              )}
              {currentProducts.map((product) => (
                <tr key={product.productCode} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {product.productCode}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {product.productName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {product.category}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {product.subCategory}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{product.brand}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{product.unit}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {product.alertQuantity}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {product.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <nav
            className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3"
            aria-label="Pagination"
          >
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => goToPage(currentPage + 1)}
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
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                      currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    aria-label="Previous"
                  >
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 14.707a1 1 0 01-1.414 0L7 10.414l4.293-4.293a1 1 0 111.414 1.414L9.414 10l3.293 3.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <li key={page}>
                    <button
                      onClick={() => goToPage(page)}
                      aria-current={page === currentPage ? "page" : undefined}
                      className={`relative inline-flex items-center border border-gray-300 px-4 py-2 text-sm font-medium focus:z-20 ${
                        page === currentPage
                          ? "z-10 bg-indigo-600 text-white shadow"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                      currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    aria-label="Next"
                  >
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414L13 10.414l-4.293 4.293a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:justify-end">
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * PAGE_SIZE + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * PAGE_SIZE, alertProducts.length)}
                </span>{" "}
                of <span className="font-medium">{alertProducts.length}</span> results
              </p>
            </div>
          </nav>
        </section>
      </div>
    </div>
  );
}