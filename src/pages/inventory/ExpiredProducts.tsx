/* -------------------------------------------------
   Expired Products - 100% standardized with PageBase1 + async autocomplete
   ------------------------------------------------- */
import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { AutoCompleteTextBox, AutoCompleteItem } from "@/components/Search/AutoCompleteTextBox";
import { SearchInput } from "@/components/Search/SearchInput";
import { SORT_OPTIONS } from "@/constants/constants";

type Product = {
  id: number;
  sku: string;
  productName: string;
  productImage?: string;
};

type ExpiredProduct = {
  id: number;
  productId: number;
  sku: string;
  productName: string;
  productImage?: string;
  manufacturedDate: string;
  expiryDate: string;
  status: "Expired";
};

export default function ExpiredProducts() {
  /* ---------- state ---------- */
  const [expiredProducts, setExpiredProducts] = useState<ExpiredProduct[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedProductFilter, setSelectedProductFilter] = useState("All");
  const [selectedSort, setSelectedSort] = useState<(typeof SORT_OPTIONS)[number]>("Last 7 Days");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"edit" | null>(null);
  const [loading, setLoading] = useState(true);

  // Autocomplete
  const [productSearchLoading, setProductSearchLoading] = useState(false);
  let productSearchTimeout: NodeJS.Timeout;

  // Form state
  const [form, setForm] = useState({
    id: 0,
    productId: 0,
    sku: "",
    productName: "",
    manufacturedDate: "",
    expiryDate: "",
  });

  /* ---------- load data ---------- */
  useEffect(() => {
    loadExpiredProducts();
    loadAllProducts();
  }, []);

  const loadExpiredProducts = async () => {
    setLoading(true);
    try {
      const res = await apiService.get<ExpiredProduct[]>("ExpiredProducts");
      if (res.status.code === "S") {
        setExpiredProducts(res.result);
        console.log("ExpiredProducts: Loaded", res.result.length, "records");
      }
    } catch (err) {
      console.error("ExpiredProducts load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadAllProducts = async () => {
    try {
      const res = await apiService.get<Product[]>("Products");
      if (res.status.code === "S") {
        setAllProducts(res.result);
        console.log("ExpiredProducts: All Products loaded", res.result.length);
      }
    } catch (err) {
      console.error("Products load error:", err);
    }
  };

  /* ---------- filtering & sorting ---------- */
  const filteredData = useMemo(() => {
    let result = [...expiredProducts];

    if (search.trim()) {
      result = result.filter(
        (p) =>
          p.sku.toLowerCase().includes(search.toLowerCase()) ||
          p.productName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedProductFilter !== "All") {
      result = result.filter((p) => p.productName === selectedProductFilter);
    }

    if (selectedSort === "Last 7 Days") {
      const last7 = new Date();
      last7.setDate(last7.getDate() - 7);
      result = result.filter((p) => new Date(p.expiryDate) >= last7);
    } else if (selectedSort === "Last Month") {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      result = result.filter((p) => new Date(p.expiryDate) >= start);
    } else if (selectedSort === "Recently Added") {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [expiredProducts, search, selectedProductFilter, selectedSort]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const productOptions = useMemo(() => {
    return ["All", ...Array.from(new Set(expiredProducts.map((p) => p.productName)))];
  }, [expiredProducts]);

  /* ---------- handlers ---------- */
  const handleEdit = (record: ExpiredProduct) => {
    setForm({
      id: record.id,
      productId: record.productId,
      sku: record.sku,
      productName: record.productName,
      manufacturedDate: record.manufacturedDate,
      expiryDate: record.expiryDate,
    });
    setFormMode("edit");
    console.log("ExpiredProducts: Edit opened", record);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this expired product?")) {
      setExpiredProducts((prev) => prev.filter((p) => p.id !== id));
      console.log("ExpiredProducts: Deleted ID", id);
    }
  };

  const handleClear = () => {
    setSearch("");
    setSelectedProductFilter("All");
    setSelectedSort("Last 7 Days");
    setCurrentPage(1);
    console.log("ExpiredProducts: Filters cleared");
  };

  const handleReport = () => {
    alert("PDF Report Generated!");
    console.log("ExpiredProducts: PDF Report");
  };

  const handleExcelReport = () => {
    alert("Excel Report Exported!");
    console.log("ExpiredProducts: Excel Report");
  };

  /* ---------- async autocomplete: Product ---------- */
  const handleProductSearch = (query: string) => {
    if (productSearchTimeout) clearTimeout(productSearchTimeout);
    setForm((prev) => ({ ...prev, productName: query, productId: 0 }));

    if (!query.trim()) {
      setFilteredProducts([]);
      return;
    }

    productSearchTimeout = setTimeout(() => {
      setProductSearchLoading(true);
      const filtered = allProducts.filter(
        (p) =>
          p.productName.toLowerCase().includes(query.toLowerCase()) ||
          p.sku.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
      setProductSearchLoading(false);
      console.log("ExpiredProducts: Search", query, filtered.length, "results");
    }, 300);
  };

  const handleProductSelect = (item: AutoCompleteItem) => {
    const prod = allProducts.find((p) => p.id === item.id);
    if (!prod) return;

    setForm((prev) => ({
      ...prev,
      productId: prod.id,
      productName: prod.productName,
      sku: prod.sku,
    }));
    setFilteredProducts([]);
    console.log("ExpiredProducts: Product selected", prod);
  };

  /* ---------- form submit ---------- */
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productId || !form.manufacturedDate || !form.expiryDate) {
      alert("Please fill all required fields.");
      return;
    }

    const updated: ExpiredProduct = {
      id: form.id,
      productId: form.productId,
      sku: form.sku,
      productName: form.productName,
      manufacturedDate: form.manufacturedDate,
      expiryDate: form.expiryDate,
      status: "Expired",
      productImage: expiredProducts.find(p => p.id === form.id)?.productImage,
    };

    setExpiredProducts((prev) =>
      prev.map((p) => (p.id === form.id ? updated : p))
    );
    setFormMode(null);
    console.log("ExpiredProducts: Updated", updated);
  };

  /* ---------- table columns ---------- */
  const columns: Column[] = [
    {
      key: "sku",
      label: "SKU",
      align: "left",
    },
    {
      key: "productName",
      label: "Product",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          {row.productImage ? (
            <img
              src={row.productImage}
              alt={value}
              className="w-10 h-10 object-cover rounded"
              loading="lazy"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 border-2 border-dashed rounded"></div>
          )}
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: "manufacturedDate",
      label: "Manufactured Date",
      render: (value) => new Date(value).toLocaleDateString("en-GB"),
      align: "center",
    },
    {
      key: "expiryDate",
      label: "Expired Date",
      render: (value) => (
        <span className="text-red-600 font-medium">
          {new Date(value).toLocaleDateString("en-GB")}
        </span>
      ),
      align: "center",
    },
  ];

  const rowActions = (row: ExpiredProduct) => (
    <>
      <button
        type="button"
        onClick={() => handleEdit(row)}
        aria-label={`Edit ${row.productName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button
        type="button"
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete ${row.productName}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete</span>
      </button>
    </>
  );

  /* ---------- custom filters ---------- */
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
          value={selectedProductFilter}
          onChange={(e) => setSelectedProductFilter(e.target.value)}
          className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[140px]"
          aria-label="Filter by product"
        >
          {productOptions.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value as any)}
          className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[160px]"
          aria-label="Sort by"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s} value={s}>Sort By: {s}</option>
          ))}
        </select>
      </div>
    </div>
  );

  /* ---------- modal form with loading/no results ---------- */
  const modalForm = () => {
    const displayItems = productSearchLoading
      ? [{ id: -1, display: "Searching...", extra: { SKU: "" } }]
      : filteredProducts.length === 0 && form.productName.trim()
        ? [{ id: -1, display: "No products found", extra: { SKU: "" } }]
        : filteredProducts.map((p) => ({
          id: p.id,
          display: p.productName,
          extra: { SKU: p.sku },
        }));

    return (
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            SKU <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.sku}
            readOnly
            className="w-full border border-input rounded px-3 py-2"
            aria-readonly="true"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Product Name <span className="text-red-500">*</span>
          </label>
          <AutoCompleteTextBox
            value={form.productName}
            onSearch={handleProductSearch}
            onSelect={handleProductSelect}
            items={displayItems}
            placeholder="Search product..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Manufacturer Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              value={form.manufacturedDate}
              onChange={(e) => setForm((p) => ({ ...p, manufacturedDate: e.target.value }))}
              className="w-full border border-input rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              required
              aria-label="Manufacturer Date"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Expiry Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              value={form.expiryDate}
              onChange={(e) => setForm((p) => ({ ...p, expiryDate: e.target.value }))}
              className="w-full border border-input rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              required
              aria-label="Expiry Date"
            />
          </div>
        </div>
      </form>
    );
  };

  /* ---------- render ---------- */
  return (
    <PageBase1
      title="Expired Products"
      description="Manage your expired products"
      icon="fa-light fa-calendar-xmark"
      onRefresh={handleClear}
      onReport={handleReport}
      onExcelReport={handleExcelReport}
      search={search}
      onSearchChange={(val) => {
        setSearch(val);
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
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle="Edit Expired Product"
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
    />
  );
}