import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";
import { CATEGORIES, SUPPLIERS, UNITS } from "@/constants/constants";

interface StockItem {
  id: number;
  productName: string;
  productCode: string;
  category: string;
  supplier: string;
  unit: string;
  purchaseQty: number;
  saleQty: number;
  stockQty: number;
  purchasePrice: number;
  salePrice: number;
  stockValue: number;
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any, idx?: number) => JSX.Element;
  align?: "left" | "center" | "right";
}

export default function ManageStock() {
  const [data, setData] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [supplierFilter, setSupplierFilter] = useState("All Suppliers");
  const [unitFilter, setUnitFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<StockItem>({
    id: 0,
    productName: "",
    productCode: "",
    category: "",
    supplier: "",
    unit: "",
    purchaseQty: 0,
    saleQty: 0,
    stockQty: 0,
    purchasePrice: 0,
    salePrice: 0,
    stockValue: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<StockItem[]>("ManageStock");
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
      const matchesSearch =
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "All Categories" || item.category === categoryFilter;
      const matchesSupplier =
        supplierFilter === "All Suppliers" || item.supplier === supplierFilter;
      const matchesUnit = unitFilter === "" || item.unit === unitFilter;
      return matchesSearch && matchesCategory && matchesSupplier && matchesUnit;
    });
  }, [data, searchTerm, categoryFilter, supplierFilter, unitFilter]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: [
        "purchaseQty",
        "saleQty",
        "stockQty",
        "purchasePrice",
        "salePrice",
        "stockValue",
      ].includes(name)
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.productName.trim() ||
      !form.productCode.trim() ||
      !form.category ||
      !form.supplier ||
      !form.unit
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (
      form.purchaseQty < 0 ||
      form.saleQty < 0 ||
      form.stockQty < 0 ||
      form.purchasePrice < 0 ||
      form.salePrice < 0 ||
      form.stockValue < 0
    ) {
      alert("Quantities and prices must be non-negative.");
      return;
    }
    if (formMode === "add") {
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [...prev, { ...form, id: newId }]);
      const totalPages = Math.ceil((filteredData.length + 1) / itemsPerPage);
      setCurrentPage(totalPages);
    } else if (formMode === "edit" && form.id !== 0) {
      setData((prev) =>
        prev.map((item) => (item.id === form.id ? { ...item, ...form } : item))
      );
    }
    setFormMode(null);
    setForm({
      id: 0,
      productName: "",
      productCode: "",
      category: "",
      supplier: "",
      unit: "",
      purchaseQty: 0,
      saleQty: 0,
      stockQty: 0,
      purchasePrice: 0,
      salePrice: 0,
      stockValue: 0,
    });
  };

  const handleEdit = (row: StockItem) => {
    setForm(row);
    setFormMode("edit");
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this stock item?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      if (
        (currentPage - 1) * itemsPerPage >= filteredData.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setCategoryFilter("All Categories");
    setSupplierFilter("All Suppliers");
    setUnitFilter("");
    setCurrentPage(1);
    loadData();
  };

  const handleReport = () => {
    alert("Stock Report:\n\n" + JSON.stringify(filteredData, null, 2));
  };

  const columns: Column[] = [
    { key: "productName", label: "Product Name", align: "left" },
    { key: "productCode", label: "Product Code", align: "left" },
    { key: "category", label: "Category", align: "left" },
    { key: "supplier", label: "Supplier", align: "left" },
    { key: "unit", label: "Unit", align: "left" },
    { key: "purchaseQty", label: "Purchase Qty", align: "right" },
    { key: "saleQty", label: "Sale Qty", align: "right" },
    { key: "stockQty", label: "Stock Qty", align: "right" },
    {
      key: "purchasePrice",
      label: "Purchase Price",
      align: "right",
      render: (v) => `$${v.toFixed(2)}`,
    },
    {
      key: "salePrice",
      label: "Sale Price",
      align: "right",
      render: (v) => `$${v.toFixed(2)}`,
    },
    {
      key: "stockValue",
      label: "Stock Value",
      align: "right",
      render: (v) => `$${v.toFixed(2)}`,
    },
  ];

  const rowActions = (row: StockItem) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit ${row.productName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete ${row.productName}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete</span>
      </button>
    </>
  );

  const customFilters = () => (
    <div className="flex flex-row gap-2 flex-wrap items-center">
      <input
        type="text"
        placeholder="Search Product Name or Code"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search Product Name or Code"
      />
      <select
        value={categoryFilter}
        onChange={(e) => {
          setCategoryFilter(e.target.value);
          setCurrentPage(1);
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Category"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <select
        value={supplierFilter}
        onChange={(e) => {
          setSupplierFilter(e.target.value);
          setCurrentPage(1);
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Supplier"
      >
        {SUPPLIERS.map((sup) => (
          <option key={sup} value={sup}>
            {sup}
          </option>
        ))}
      </select>
      <select
        value={unitFilter}
        onChange={(e) => {
          setUnitFilter(e.target.value);
          setCurrentPage(1);
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Unit"
      >
        <option value="">All Units</option>
        {UNITS.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>
    </div>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Product Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          name="productName"
          value={form.productName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Enter product name"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Product Code <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          name="productCode"
          value={form.productCode}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Enter product code"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Category <span className="text-destructive">*</span>
        </label>
        <select
          name="category"
          value={form.category}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
        >
          {CATEGORIES.slice(1).map(
            (
              cat // Exclude "All Categories"
            ) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            )
          )}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Supplier <span className="text-destructive">*</span>
        </label>
        <select
          name="supplier"
          value={form.supplier}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
        >
          {SUPPLIERS.slice(1).map(
            (
              sup // Exclude "All Suppliers"
            ) => (
              <option key={sup} value={sup}>
                {sup}
              </option>
            )
          )}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Unit <span className="text-destructive">*</span>
        </label>
        <select
          name="unit"
          value={form.unit}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
        >
          <option value="">Select Unit</option>
          {UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Purchase Qty</label>
        <input
          type="number"
          name="purchaseQty"
          value={form.purchaseQty}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Sale Qty</label>
        <input
          type="number"
          name="saleQty"
          value={form.saleQty}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Stock Qty</label>
        <input
          type="number"
          name="stockQty"
          value={form.stockQty}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Purchase Price</label>
        <input
          type="number"
          step="0.01"
          name="purchasePrice"
          value={form.purchasePrice}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Sale Price</label>
        <input
          type="number"
          step="0.01"
          name="salePrice"
          value={form.salePrice}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Stock Value</label>
        <input
          type="number"
          step="0.01"
          name="stockValue"
          value={form.stockValue}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Manage Stock"
      description="Manage stock items."
      icon="fa fa-boxes-stacked"
      onAddClick={() => {
        setForm({
          id: 0,
          productName: "",
          productCode: "",
          category: "",
          supplier: "",
          unit: "",
          purchaseQty: 0,
          saleQty: 0,
          stockQty: 0,
          purchasePrice: 0,
          salePrice: 0,
          stockValue: 0,
        });
        setFormMode("add");
      }}
      onRefresh={handleClear}
      onReport={handleReport}
      search={searchTerm}
      onSearchChange={(e) => {
        setSearchTerm(e.target.value);
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
      modalTitle={formMode === "add" ? "Add Stock Item" : "Edit Stock Item"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
    />
  );
}
