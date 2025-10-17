import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

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

export default function ProductQuantityAlert() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("ProductQuantityAlert");
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

  // Filtered products that are below alert quantity
  const alertProducts = data.filter(
    (p: Product) => p.quantity <= p.alertQuantity
  );

  // Current page products slice
  const currentProducts = alertProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers for pagination buttons
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Title */}
      <h1 className="text-lg font-semibold mb-6">Product Quantity Alert</h1>

      {/* Search & Action Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <form className="flex flex-wrap items-center gap-4">
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
              placeholder="Enter Product Code"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

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
              placeholder="Enter Product Name"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
          <div>
            <label
              htmlFor="brand"
              className="block text-sm font-medium mb-1"
            >
              Brand
            </label>
            <select
              id="brand"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              title="Search"
            >
              <i className="fa fa-search fa-light" aria-hidden="true"></i> Search
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              title="Clear"
            >
              <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded shadow"
              title="Save"
            >
              <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold px-4 py-2 rounded shadow"
              title="Report"
            >
              <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Product Code
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Product Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Sub Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Brand
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Unit
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Alert Quantity
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No products matching alert criteria.
                  </td>
                </tr>
              )}
              {currentProducts.map((product: Product) => (
                <tr key={product.productCode} className="hover:bg-muted/50 transition-colors text-sm text-gray-500">
                  <td className="px-4 py-2">{product.productCode}</td>
                  <td className="px-4 py-2">{product.productName}</td>
                  <td className="px-4 py-2">{product.category}</td>
                  <td className="px-4 py-2">{product.subCategory}</td>
                  <td className="px-4 py-2">{product.brand}</td>
                  <td className="px-4 py-2">{product.unit}</td>
                  <td className="px-4 py-2 text-right">{product.alertQuantity}</td>
                  <td className="px-4 py-2 text-right">{product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={alertProducts.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </section>
    </div>
  );
}