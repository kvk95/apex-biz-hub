import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { CATEGORIES } from "@/constants/constants";
import { SearchInput } from "@/components/Search/SearchInput";

interface BestSellerItem {
  id: number; // Assumed for uniqueness
  productName: string;
  sku: string;
  category: string;
  quantity: number;
  price: number;
  total: number;
}

const BestSeller: React.FC = () => {
  const [data, setData] = useState<BestSellerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<BestSellerItem[]>("BestSeller");
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
      const matchesCategory =
        selectedCategory === "All Categories" ||
        item.category === selectedCategory;
      const matchesSearch =
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory, data]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generated for current filtered best sellers.");
  };

  const columns: Column[] = [
    { key: "productName", label: "Product Name", align: "left" },
    { key: "sku", label: "SKU", align: "left" },
    { key: "category", label: "Category", align: "left" },
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
      key: "total",
      label: "Total",
      align: "right",
      render: (v) => `₹${v.toFixed(2)}`,
    },
  ];

  const customFilters = () => (
    <div className="grid grid-cols-2 w-full justify-stretch px-3">
      <div className="flex justify-start">
        <SearchInput
          className=""
          value={searchTerm}
          placeholder="Search Product or SKU"
          onSearch={(query) => {
            setSearchTerm(query);
            setCurrentPage(1);
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-wrap gap-2 items-center"
        >
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </form>
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Best Seller"
      description="View and filter best seller products."
      icon="fa fa-star"
      onRefresh={handleClear}
      onReport={handleReport}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      customFilters={customFilters}
    />
  );
};

export default BestSeller;
