import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { CATEGORIES, STOCK_STATUSES } from "@/constants/constants";
import { SearchInput } from "@/components/Search/SearchInput";

interface LowStockRecord {
  id: number;
  product: string;
  category: string;
  quantity: number;
  price: number;
  supplier: string;
  qtyAlert: number;
}

export default function LowStocks() {
  const [data, setData] = useState<LowStockRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [stockFilter, setStockFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
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
  const tabItems = [
    { id: "low", label: "Low Stocks" },
    { id: "out", label: "Out of Stock" },
  ];
  const [tabSelected, setTabSelected] = useState(tabItems[0].id);
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

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
        (stockFilter === "Low Stock" &&
          item.quantity > 0 &&
          item.quantity <= item.qtyAlert);
      return matchesCategory && matchesSearch && matchesStock;
    });
  }, [data, searchTerm, selectedCategory, stockFilter]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [currentPage, itemsPerPage, filteredData]);

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

  const handleNotifyToggle = () => {
    setNotified((prev) => !prev);
  };

  const handleSendEmail = () => {
    alert("Email sent");
  };

  const columns: Column[] = [
    { key: "product", label: "Product", align: "left" },
    { key: "category", label: "Category", align: "left" },
    { key: "quantity", label: "Quantity", align: "right" },
    {
      key: "price",
      label: "Price (₹)",
      align: "right",
      render: (value) => value.toFixed(2),
    },
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

  const customHeaderFields = () => (
    <div className="">
      <button
        onClick={handleSendEmail}
        className="bg-blue-950 text-white text-sm px-2 py-2 rounded font-medium flex items-center gap-2 hover:bg-blue-800"
      >
        <i className="fa fa-envelope"></i> Send Email
      </button>
    </div>
  );

  const customHeaderRow = () => (
    <div className="grid grid-cols-2 w-full justify-stretch px-3 mb-2">
      <div className="flex justify-start  gap-2">
        <ul className="flex w-64 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg overflow-hidden dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          {tabItems.map((item, idx) => (
            <li
              key={item.id}
              className={
                `flex-1` +
                (idx !== tabItems.length - 1
                  ? " border-r border-gray-200 dark:border-gray-600"
                  : "")
              }
            >
              <label
                htmlFor={`tab-radio-${item.id}`}
                className={`flex items-center justify-center py-2 cursor-pointer
               transition-colors
               ${
                 tabSelected === item.id
                   ? "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300 font-semibold"
                   : "bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
               }`}
              >
                <input
                  id={`tab-radio-${item.id}`}
                  type="radio"
                  value={item.id}
                  name="list-radio"
                  checked={tabSelected === item.id}
                  onChange={() => setTabSelected(item.id)}
                  className="sr-only"
                />
                {item.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-end gap-2">
        <label className="inline-flex items-center  cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={notified}
            onChange={() => setNotified((prev) => !prev)}
          />
          <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            Notify
          </span>
        </label>
      </div>
    </div>
  );

  const customFilters = () => (
    <div className="grid grid-cols-2 w-full justify-stretch px-3">
      <div className="flex justify-start gap-2">
        <SearchInput
          className=""
          value={searchTerm}
          placeholder="Search Product/Supplier"
          onSearch={(query) => {
            setSearchTerm(query);
            setCurrentPage(1);
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Filter by category"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={stockFilter}
          onChange={(e) => {
            setStockFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Filter by stock status"
        >
          {STOCK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
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
            <option key={cat} value={cat}>
              {cat}
            </option>
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
      onSearchChange={(text) => {
        setSearchTerm(text);
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
      modalTitle="Edit Low Stock Item"
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
      customHeaderFields={customHeaderFields}
      customHeaderRow={customHeaderRow}
    >
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
        </div>
      )}
    </PageBase1>
  );
}
