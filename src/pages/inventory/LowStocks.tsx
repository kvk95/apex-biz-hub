import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";

interface LowStockRecord {
  id: number;
  product: string;
  category: string;
  quantity: number;
  price: number;
  supplier: string;
  qtyAlert: number;
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any, idx?: number) => JSX.Element;
  align?: "left" | "center" | "right";
}

const CATEGORIES = [
  "All Categories",
  "Mobile",
  "Headphones",
  "Laptop",
  "Accessories",
  "Smart Home",
  "Tablet",
  "Speaker",
  "Camera",
];

const STOCK_STATUSES = ["All", "Low Stock", "Out of Stock"];

export default function LowStocks() {
  const [data, setData] = useState<LowStockRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [stockFilter, setStockFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [formMode, setFormMode] = useState<"edit" | null>(null);
  const [form, setForm] = useState<LowStockRecord>({
    id: 0,
    product: "",
    category: "",
    quantity: 0,
    price: 0,
    supplier: "",
    qtyAlert: 0,
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const response = await apiService.get<LowStockRecord[]>("LowStocks");
      if (response.status.code === "S") {
        setData(response.result);
        setError(null);
      } else {
        setError(response.status.description);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesCategory =
        selectedCategory === "All Categories" ||
        item.category === selectedCategory;
      const matchesSearch =
        item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStock =
        stockFilter === "All" ||
        (stockFilter === "Out of Stock" && item.quantity === 0) ||
        (stockFilter === "Low Stock" && item.quantity > 0 && item.quantity <= item.qtyAlert);
      return matchesCategory && matchesSearch && matchesStock;
    });
  }, [data, searchTerm, selectedCategory, stockFilter]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [currentPage, itemsPerPage, filteredData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.product.trim() ||
      !form.category ||
      !form.quantity ||
      !form.price ||
      !form.supplier.trim() ||
      !form.qtyAlert
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                product: form.product,
                category: form.category,
                quantity: Number(form.quantity),
                price: Number(form.price),
                supplier: form.supplier,
                qtyAlert: Number(form.qtyAlert),
              }
            : item
        )
      );
    }
    setFormMode(null);
    setForm({
      id: 0,
      product: "",
      category: "",
      quantity: 0,
      price: 0,
      supplier: "",
      qtyAlert: 0,
    });
    setEditId(null);
  };

  const handleEdit = (record: LowStockRecord) => {
    setForm(record);
    setFormMode("edit");
    setEditId(record.id);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setData((prev) => prev.filter((item) => item.id !== id));
      if ((currentPage - 1) * itemsPerPage >= filteredData.length - 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setStockFilter("All");
    setCurrentPage(1);
    setFormMode(null);
    setEditId(null);
    loadData();
  };

  const handleReport = () => {
    alert("Report generated for low stock items.");
  };

  const handleNotify = () => {
    alert("Notification sent");
  };

  const handleSendEmail = () => {
    alert("Email sent");
  };

  const columns: Column[] = [
    { key: "product", label: "Product", align: "left" },
    { key: "category", label: "Category", align: "left" },
    { key: "quantity", label: "Quantity", align: "right" },
    { key: "price", label: "Price ($)", align: "right", render: (value) => value.toFixed(2) },
    { key: "supplier", label: "Supplier", align: "left" },
    { key: "qtyAlert", label: "Qty Alert", align: "right" },
  ];

  const rowActions = (row: LowStockRecord) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit ${row.product}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete ${row.product}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete</span>
      </button>
    </>
  );

  const customFilters = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        type="text"
        placeholder="Search Product/Supplier"
        value={searchTerm}
        onChange={handleSearchChange}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search by product or supplier"
      />
      <select
        value={selectedCategory}
        onChange={(e) => {
          setSelectedCategory(e.target.value);
          setCurrentPage(1);
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by category"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <select
        value={stockFilter}
        onChange={(e) => {
          setStockFilter(e.target.value);
          setCurrentPage(1);
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by stock status"
      >
        {STOCK_STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="product" className="block text-sm font-medium mb-1">
          Product Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="product"
          name="product"
          value={form.product}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter product name"
          required
          aria-label="Enter product name"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Category <span className="text-destructive">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
          aria-label="Select category"
        >
          <option value="">Select Category</option>
          {CATEGORIES.filter((cat) => cat !== "All Categories").map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium mb-1">
          Quantity <span className="text-destructive">*</span>
        </label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={form.quantity}
          onChange={handleInputChange}
          min={0}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter quantity"
          required
          aria-label="Enter quantity"
        />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium mb-1">
          Price ($) <span className="text-destructive">*</span>
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={form.price}
          onChange={handleInputChange}
          min={0}
          step="0.01"
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter price"
          required
          aria-label="Enter price"
        />
      </div>
      <div>
        <label htmlFor="supplier" className="block text-sm font-medium mb-1">
          Supplier <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="supplier"
          name="supplier"
          value={form.supplier}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter supplier"
          required
          aria-label="Enter supplier"
        />
      </div>
      <div>
        <label htmlFor="qtyAlert" className="block text-sm font-medium mb-1">
          Qty Alert <span className="text-destructive">*</span>
        </label>
        <input
          type="number"
          id="qtyAlert"
          name="qtyAlert"
          value={form.qtyAlert}
          onChange={handleInputChange}
          min={0}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter qty alert"
          required
          aria-label="Enter qty alert"
        />
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Low Stocks"
      description="View and manage low stock items."
      icon="fa fa-exclamation-triangle"
      onRefresh={handleClear}
      onReport={handleReport}
      search={searchTerm}
      onSearchChange={handleSearchChange}
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
      modalTitle="Edit Low Stock Item"
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
    >
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={handleNotify}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
          type="button"
        >
          Notify
        </button>
        <button
          onClick={handleSendEmail}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
          type="button"
        >
          Send Email
        </button>
      </div>
    </PageBase1>
  );
}