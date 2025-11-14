import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import {
  CATEGORIES,
  STATUSES,
  PAYMENT_STATUSES,
  BRANDS,
} from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";

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
      const matchDateFrom = !dateFrom || (item.date && item.date >= dateFrom); // Check if date exists
      const matchDateTo = !dateTo || (item.date && item.date <= dateTo); // Check if date exists
      return (
        matchCategory &&
        matchBrand &&
        matchStatus &&
        matchSearch &&
        matchDateFrom &&
        matchDateTo
      );
    });
  }, [
    data,
    selectedCategory,
    selectedBrand,
    selectedStatus,
    searchTerm,
    dateFrom,
    dateTo,
  ]);

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
    {
      key: "quantity",
      label: "Quantity",
      align: "right",
      render: (v) => v.toString(),
    },
    {
      key: "price",
      label: "Price",
      align: "right",
      render: (v) => `₹${v.toFixed(2)}`,
    },
    {
      key: "totalValue",
      label: "Total Value",
      align: "right",
      render: (v) => `₹${v.toFixed(2)}`,
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: renderStatusBadge,
    },
  ];

  const customFilters = () => (
    <div className="grid grid-cols-2 w-full justify-stretch px-3">
      <div className="flex justify-start  gap-2">
        <SearchInput
          className=""
          value={searchTerm}
          placeholder="Search Product or SKU"
          onSearch={(query) => {
            setSearchTerm(query);
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          className="flex  gap-2 "
        >
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-sm border border-input rounded  focus:outline-none focus:ring-2 focus:ring-ring"
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
            className="px-3 py-1.5 text-sm border border-input rounded  focus:outline-none focus:ring-2 focus:ring-ring"
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
            className="px-3 py-1.5 text-sm border border-input rounded  focus:outline-none focus:ring-2 focus:ring-ring"
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
            className="px-3 py-1.5 text-sm border border-input rounded  focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-1.5 text-sm border border-input rounded  focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </form>
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Inventory Report"
      description="View and filter inventory report records."
      
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
      loading={loading}
    />
  );
};

export default InventoryReport;
