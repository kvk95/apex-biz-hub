/* -------------------------------------------------
   Purchase Order - "Last 7 Days" FIXED + ALL SORTING
   ------------------------------------------------- */
import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { SearchInput } from "@/components/Search/SearchInput";
import { SORT_OPTIONS } from "@/constants/constants";

type PurchaseProduct = {
  productName: string;
  productId: string;
  purchasedAmount: number;
  purchasedquantity: number;
  instockQTY: number;
  purchasedDate: string;
};

export default function PurchaseOrder() {
  const [products, setProducts] = useState<PurchaseProduct[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSort, setSelectedSort] = useState<(typeof SORT_OPTIONS)[number]>("Last 7 Days");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await apiService.get<PurchaseProduct[]>("PurchaseOrder");
      if (res.status.code === "S") {
        setProducts(res.result);
        console.log("PurchaseOrder: Loaded", res.result.length, "products");
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("PurchaseOrder load error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- FILTERING & SORTING — FIXED Last 7 Days ---------- */
  const filteredData = useMemo(() => {
    let result = [...products];

    // Search
    if (search.trim()) {
      result = result.filter((p) =>
        p.productName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // SORT & FILTER
    if (selectedSort === "Recently Added") {
      result.sort((a, b) => new Date(b.purchasedDate).getTime() - new Date(a.purchasedDate).getTime());
    } else if (selectedSort === "Ascending") {
      result.sort((a, b) => a.purchasedAmount - b.purchasedAmount);
    } else if (selectedSort === "Descending") {
      result.sort((a, b) => b.purchasedAmount - a.purchasedAmount);
    } else if (selectedSort === "Last 7 Days") {
      const last7 = new Date();
      last7.setDate(last7.getDate() - 7);
      last7.setHours(0, 0, 0, 0); // Reset to start of day

      result = result.filter((p) => {
        const d = new Date(p.purchasedDate);
        d.setHours(0, 0, 0, 0); // Normalize
        return d >= last7;
      });
    } else if (selectedSort === "Last Month") {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      result = result.filter((p) => {
        const d = new Date(p.purchasedDate);
        return d >= start && d <= end;
      });
    }

    return result;
  }, [products, search, selectedSort]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  /* ---------- handlers ---------- */
  const handleClear = () => {
    setSearch("");
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report Generated!");
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as (typeof SORT_OPTIONS)[number];
    setSelectedSort(value);
    setCurrentPage(1);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  /* ---------- table columns ---------- */
  const columns: Column[] = [
    {
      key: "productName",
      label: "Product",
      render: (v: string) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 border-2 border-dashed rounded" />
          <span>{v}</span>
        </div>
      ),
    },
    {
      key: "purchasedAmount",
      label: "Purchased Amount",
      render: (v: number) => `$${v.toFixed(2)}`,
      align: "right",
    },
    {
      key: "purchasedquantity",
      label: "Purchased QTY",
      render: (v: number) => v,
      align: "center",
    },
    {
      key: "instockQTY",
      label: "InStock QTY",
      render: (v: number) => v,
      align: "center",
    },
  ];

  const rowActions = () => null;

  const customFilters = () => (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-3 w-full">
      <div className="w-full md:w-auto md:max-w-md">
        <SearchInput
          value={search}
          placeholder="Search"
          onSearch={(query) => {
            setSearch(query);
            setCurrentPage(1);
          }}
          className="w-full"
        />
      </div>

      <div className="flex gap-2 flex-wrap justify-end w-full md:w-auto">
        <select
          value={selectedSort}
          onChange={handleSortChange}
          className="border border-input rounded-md px-3 py-2 bg-text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[140px]"
          aria-label="Sort by"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  /* ---------- render ---------- */
  return (
    <PageBase1
      title="Purchase order"
      description="Manage your Purchase order"
      icon="fa-light fa-file-lines"
      onAddClick={null}
      onRefresh={handleClear}
      onReport={handleReport}
      search={search}
      onSearchChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      customFilters={customFilters}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle=""
      modalForm={() => null}
      onFormSubmit={handleFormSubmit}
    />
  );
}