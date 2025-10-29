import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { CATEGORIES, STATUSES } from "@/constants/constants";

export const BRANDS = ["All Brands", "Apple", "Samsung", "Sony", "Dell", "Logitech", "Canon", "Bose", "Microsoft", "Google", "JBL", "HP", "Fitbit"] as const;
   

interface InventoryItem {
  id: number; // Assumed for uniqueness
  productName: string;
  sku: string;
  category: string;
  brand: string;
  quantity: number;
  price: number;
  totalValue: number;
  status: string;
  date?: string; // Added to support date filtering; confirm if this exists
}

const InventoryReport: React.FC = () => {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<InventoryItem[]>("InventoryReport");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchCategory =
        selectedCategory === "All Categories" || item.category === selectedCategory;
      const matchBrand =
        selectedBrand === "All Brands" || item.brand === selectedBrand;
      const matchStatus =
        selectedStatus === "All Status" || item.status === selectedStatus;
      const matchSearch =
        searchTerm === "" ||
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDateFrom = !dateFrom || (item.date && item.date >= dateFrom); // Check if date exists
      const matchDateTo = !dateTo || (item.date && item.date <= dateTo); // Check if date exists
      return matchCategory && matchBrand && matchStatus && matchSearch && matchDateFrom && matchDateTo;
    });
  }, [data, selectedCategory, selectedBrand, selectedStatus, searchTerm, dateFrom, dateTo]);

  const handleResetFilters = () => {
    setSelectedCategory("All Categories");
    setSelectedBrand("All Brands");
    setSelectedStatus("All Status");
    setSearchTerm("");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generated for current filtered inventory.");
  };

  const columns: Column[] = [
    { key: "productName", label: "Product Name", align: "left" },
    { key: "sku", label: "SKU", align: "left" },
    { key: "category", label: "Category", align: "left" },
    { key: "brand", label: "Brand", align: "left" },
    { key: "quantity", label: "Quantity", align: "right", render: (v) => v.toString() },
    { key: "price", label: "Price", align: "right", render: (v) => `₹${v.toFixed(2)}` },
    { key: "totalValue", label: "Total Value", align: "right", render: (v) => `₹${v.toFixed(2)}` },
    { key: "status", label: "Status", align: "left", render: (v) => (
      <span
        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
          v === "In Stock"
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            : v === "Low Stock"
            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
        }`}
      >
        {v}
      </span>
    )},
  ];

  const customFilters = () => (
    <form onSubmit={(e) => { e.preventDefault(); setCurrentPage(1); }} className="flex flex-wrap gap-2 mb-4 items-center">
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <select
        value={selectedBrand}
        onChange={(e) => setSelectedBrand(e.target.value)}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {BRANDS.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={dateFrom}
        onChange={(e) => setDateFrom(e.target.value)}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <input
        type="date"
        value={dateTo}
        onChange={(e) => setDateTo(e.target.value)}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="Search Product or SKU"
      />
      <button
        type="submit"
        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <i className="fa fa-filter fa-light" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        onClick={handleResetFilters}
        className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <i className="fa fa-undo fa-light" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        onClick={handleReport}
        className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <i className="fa fa-file-text fa-light" aria-hidden="true"></i>
      </button>
    </form>
  );

  return (
    <PageBase1
      title="Inventory Report"
      description="View and filter inventory report records."
      icon="fa fa-boxes"
      onRefresh={handleResetFilters}
      onReport={handleReport}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={filteredData} // Pass filteredData as the full dataset for pagination
      customFilters={customFilters}
    />
  );
};

export default InventoryReport;