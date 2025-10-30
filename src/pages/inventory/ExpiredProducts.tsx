import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { CATEGORIES, UNITS , SUPPLIERS} from "@/constants/constants";

interface ExpiredProductRecord {
  id: number;
  productName: string;
  productCode: string;
  category: string;
  supplier: string;
  expiredDate: string;
  quantity: number;
  unit: string;
  cost: number;
  price: number;
}

export default function ExpiredProducts() {
  const [data, setData] = useState<ExpiredProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"edit" | null>(null);
  const [form, setForm] = useState<ExpiredProductRecord>({
    id: 0,
    productName: "",
    productCode: "",
    category: "",
    supplier: "",
    expiredDate: "",
    quantity: 0,
    unit: "",
    cost: 0,
    price: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<ExpiredProductRecord[]>(
      "ExpiredProducts"
    );
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
        !selectedCategory || item.category === selectedCategory;
      const matchesSupplier =
        !selectedSupplier || item.supplier === selectedSupplier;
      const matchesDate =
        (!dateRange.start || item.expiredDate >= dateRange.start) &&
        (!dateRange.end || item.expiredDate <= dateRange.end);
      return matchesSearch && matchesCategory && matchesSupplier && matchesDate;
    });
  }, [data, searchTerm, selectedCategory, selectedSupplier, dateRange]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productName.trim() || !form.expiredDate) {
      alert("Please fill all required fields.");
      return;
    }
    if (formMode === "edit" && form.id !== 0) {
      setData((prev) =>
        prev.map((item) =>
          item.id === form.id
            ? {
                ...item,
                productName: form.productName,
                productCode: form.productCode,
                category: form.category,
                supplier: form.supplier,
                expiredDate: form.expiredDate,
                quantity: Number(form.quantity),
                unit: form.unit,
                cost: Number(form.cost),
                price: Number(form.price),
              }
            : item
        )
      );
    }
    setFormMode(null);
    setForm({
      id: 0,
      productName: "",
      productCode: "",
      category: "",
      supplier: "",
      expiredDate: "",
      quantity: 0,
      unit: "",
      cost: 0,
      price: 0,
    });
  };

  const handleEdit = (record: ExpiredProductRecord) => {
    setForm(record);
    setFormMode("edit");
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
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
    setSelectedCategory("");
    setSelectedSupplier("");
    setDateRange({ start: "", end: "" });
    setCurrentPage(1);
    setFormMode(null);
    loadData();
  };

  const handleReport = () => {
    alert("Report generated for expired products.");
  };

  const columns: Column[] = [
    { key: "productName", label: "Product", align: "left" },
    { key: "productCode", label: "Product Code", align: "left" },
    { key: "category", label: "Category", align: "left" },
    { key: "supplier", label: "Supplier", align: "left" },
    { key: "expiredDate", label: "Expired Date", align: "left" },
    { key: "quantity", label: "Quantity", align: "right" },
    { key: "unit", label: "Unit", align: "left" },
    {
      key: "cost",
      label: "Cost",
      align: "right",
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      key: "price",
      label: "Price",
      align: "right",
      render: (value) => `$${value.toFixed(2)}`,
    },
  ];

  const rowActions = (row: ExpiredProductRecord) => (
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
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        type="text"
        placeholder="Search Product/Code"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search by product name or code"
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
        <option value="">All Categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <select
        value={selectedSupplier}
        onChange={(e) => {
          setSelectedSupplier(e.target.value);
          setCurrentPage(1);
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by supplier"
      >
        <option value="">All Suppliers</option>
        {SUPPLIERS.map((sup) => (
          <option key={sup} value={sup}>
            {sup}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={dateRange.start}
        onChange={(e) => {
          setDateRange((prev) => ({ ...prev, start: e.target.value }));
          setCurrentPage(1);
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Start date"
      />
      <input
        type="date"
        value={dateRange.end}
        onChange={(e) => {
          setDateRange((prev) => ({ ...prev, end: e.target.value }));
          setCurrentPage(1);
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="End date"
      />
    </div>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label htmlFor="productName" className="block text-sm font-medium mb-1">
          Product Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="productName"
          name="productName"
          value={form.productName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter product name"
          required
          aria-label="Enter product name"
        />
      </div>
      <div>
        <label htmlFor="productCode" className="block text-sm font-medium mb-1">
          Product Code
        </label>
        <input
          type="text"
          id="productCode"
          name="productCode"
          value={form.productCode}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter product code"
          aria-label="Enter product code"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Select category"
        >
          <option value="">Select Category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="supplier" className="block text-sm font-medium mb-1">
          Supplier
        </label>
        <select
          id="supplier"
          name="supplier"
          value={form.supplier}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Select supplier"
        >
          <option value="">Select Supplier</option>
          {SUPPLIERS.map((sup) => (
            <option key={sup} value={sup}>
              {sup}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="expiredDate" className="block text-sm font-medium mb-1">
          Expired Date <span className="text-destructive">*</span>
        </label>
        <input
          type="date"
          id="expiredDate"
          name="expiredDate"
          value={form.expiredDate}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
          aria-label="Enter expired date"
        />
      </div>
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium mb-1">
          Quantity
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
          aria-label="Enter quantity"
        />
      </div>
      <div>
        <label htmlFor="unit" className="block text-sm font-medium mb-1">
          Unit
        </label>
        <select
          id="unit"
          name="unit"
          value={form.unit}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Select unit"
        >
          <option value="">Select Unit</option>
          {UNITS.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="cost" className="block text-sm font-medium mb-1">
          Cost
        </label>
        <input
          type="number"
          id="cost"
          name="cost"
          value={form.cost}
          onChange={handleInputChange}
          min={0}
          step="0.01"
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter cost"
          aria-label="Enter cost"
        />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium mb-1">
          Price
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
          aria-label="Enter price"
        />
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Expired Products"
      description="View and manage expired products."
      icon="fa fa-calendar-times"
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
      modalTitle="Edit Expired Product"
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
    />
  );
}
