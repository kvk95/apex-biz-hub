import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("InventoryReport");
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

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
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
      return matchCategory && matchBrand && matchStatus && matchSearch;
    });
  }, [data, selectedCategory, selectedBrand, selectedStatus, searchTerm]);

  const handleResetFilters = () => {
    setSelectedCategory("All Categories");
    setSelectedBrand("All Brands");
    setSelectedStatus("All Status");
    setSearchTerm("");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-lg font-semibold mb-6">Inventory Report</h1>

      <section className="bg-card rounded shadow p-6 mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          className="grid grid-cols-1 md:grid-cols-6 gap-6"
        >
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-1"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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

          <div>
            <label
              htmlFor="brand"
              className="block text-sm font-medium mb-1"
            >
              Brand
            </label>
            <select
              id="brand"
              name="brand"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium mb-1"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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

          <div>
            <label
              htmlFor="dateFrom"
              className="block text-sm font-medium mb-1"
            >
              Date From
            </label>
            <input
              type="date"
              id="dateFrom"
              name="dateFrom"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="dateTo"
              className="block text-sm font-medium mb-1"
            >
              Date To
            </label>
            <input
              type="date"
              id="dateTo"
              name="dateTo"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="search"
              className="block text-sm font-medium mb-1"
            >
              Search
            </label>
            <input
              type="text"
              id="search"
              name="search"
              placeholder="Search by Product Name or SKU"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-end gap-3 md:col-span-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-filter fa-light" aria-hidden="true"></i> Filter
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-undo fa-light" aria-hidden="true"></i> Clear
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Generate Report
            </button>
          </div>
        </form>
      </section>

      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Product Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Brand
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Quantity
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Price ($)
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Total Value ($)
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No records found.
                  </td>
                </tr>
              )}
              {filteredData
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((item, idx) => (
                  <tr
                    key={item.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.productName}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.sku}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.brand}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">
                      {item.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">
                      {item.totalValue.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          item.status === "In Stock"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : item.status === "Low Stock"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

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
};

export default InventoryReport;