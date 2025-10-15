import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

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
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal editing state (only if edit icon/button exists - none here, so omitted)

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

  // Calculate paginated data using Pagination component props
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

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6">Product Report</h1>

      {/* Filter Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6"
          aria-label="Product report filters"
        >
          {/* Product Code */}
          <div>
            <label htmlFor="productCode" className="block text-sm font-medium mb-1">
              Product Code
            </label>
            <input
              id="productCode"
              type="text"
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              placeholder="Enter product code"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Product Name */}
          <div>
            <label htmlFor="productName" className="block text-sm font-medium mb-1">
              Product Name
            </label>
            <input
              id="productName"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Unit */}
          <div>
            <label htmlFor="unit" className="block text-sm font-medium mb-1">
              Unit
            </label>
            <select
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Min Stock */}
          <div>
            <label htmlFor="minStock" className="block text-sm font-medium mb-1">
              Min Stock Qty
            </label>
            <input
              id="minStock"
              type="number"
              min={0}
              value={minStock}
              onChange={(e) => setMinStock(e.target.value)}
              placeholder="Min stock quantity"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Max Stock */}
          <div>
            <label htmlFor="maxStock" className="block text-sm font-medium mb-1">
              Max Stock Qty
            </label>
            <input
              id="maxStock"
              type="number"
              min={0}
              value={maxStock}
              onChange={(e) => setMaxStock(e.target.value)}
              placeholder="Max stock quantity"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap gap-3 md:col-span-6 lg:col-span-6">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Search products"
            >
              <i className="fa fa-magnifying-glass fa-light"></i> Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Clear filters"
            >
              <i className="fa fa-refresh fa-light"></i> Clear
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
                  Unit
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Purchase Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Sale Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Stock Qty
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Stock Value
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((p) => (
                  <tr
                    key={p.productCode}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">{p.productCode}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{p.productName}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{p.category}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{p.unit}</td>
                    <td className="px-4 py-3 text-sm text-foreground">${p.purchasePrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-foreground">${p.salePrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{p.stockQty}</td>
                    <td className="px-4 py-3 text-sm text-foreground">${p.stockValue.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredData.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
      </section>
    </div>
  );
}