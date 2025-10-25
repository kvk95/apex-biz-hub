import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";
import { WAREHOUSES } from "@/constants/constants";

interface StockAdjustmentItem {
  id: number;
  productName: string;
  sku: string;
  stockInHand: number;
  stockAdjusted: number;
  stockAfterAdjustment: number;
  unitCost: number;
  totalCost: number;
  notes?: string; // Added to replace Reason
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: StockAdjustmentItem) => JSX.Element;
  align?: "left" | "center" | "right";
}

const StockAdjustment: React.FC = () => {
  const [data, setData] = useState<StockAdjustmentItem[]>([]);
  const [rows, setRows] = useState<StockAdjustmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<StockAdjustmentItem>({
    id: 0,
    productName: "",
    sku: "",
    stockInHand: 0,
    stockAdjusted: 0,
    stockAfterAdjustment: 0,
    unitCost: 0,
    totalCost: 0,
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<StockAdjustmentItem[]>("StockAdjustment");
    if (response.status.code === "S") {
      setData(response.result.map((item) => ({ ...item, notes: item.notes || "" })));
      setRows(response.result.map((item) => ({ ...item, notes: item.notes || "" })));
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      row.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rows, searchTerm]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRows.slice(start, start + itemsPerPage);
  }, [filteredRows, currentPage, itemsPerPage]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const newForm = {
        ...prev,
        [name]: ["stockAdjusted", "unitCost", "totalCost", "stockInHand"].includes(name)
          ? parseFloat(value) || 0
          : value,
      };
      if (name === "stockAdjusted") {
        newForm.stockAfterAdjustment = prev.stockInHand + (parseFloat(value) || 0);
        newForm.totalCost = newForm.stockAfterAdjustment * prev.unitCost;
      } else if (name === "unitCost") {
        newForm.totalCost = prev.stockAfterAdjustment * (parseFloat(value) || 0);
      }
      return newForm;
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productName.trim() || !form.sku.trim()) {
      alert("Product Name and SKU are required.");
      return;
    }
    if (formMode === "add") {
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [...prev, { ...form, id: newId }]);
      setRows((prev) => [...prev, { ...form, id: newId }]);
      const totalPages = Math.ceil((filteredRows.length + 1) / itemsPerPage);
      setCurrentPage(totalPages);
    } else if (formMode === "edit" && form.id !== 0) {
      setData((prev) =>
        prev.map((item) => (item.id === form.id ? { ...item, ...form } : item))
      );
      setRows((prev) =>
        prev.map((item) => (item.id === form.id ? { ...item, ...form } : item))
      );
    }
    setFormMode(null);
    setForm({
      id: 0,
      productName: "",
      sku: "",
      stockInHand: 0,
      stockAdjusted: 0,
      stockAfterAdjustment: 0,
      unitCost: 0,
      totalCost: 0,
      notes: "",
    });
  };

  const handleEdit = (row: StockAdjustmentItem) => {
    setForm(row);
    setFormMode("edit");
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this adjustment?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      setRows((prev) => prev.filter((d) => d.id !== id));
      if ((currentPage - 1) * itemsPerPage >= filteredRows.length - 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleClear = () => {
    setRows(data);
    setCurrentPage(1);
    // Reset form fields to initial state
    setForm({
      id: 0,
      productName: "",
      sku: "",
      stockInHand: 0,
      stockAdjusted: 0,
      stockAfterAdjustment: 0,
      unitCost: 0,
      totalCost: 0,
      notes: "",
    });
  };

  const handleReport = () => {
    alert("Stock Adjustment Report:\n\n" + JSON.stringify(filteredRows, null, 2));
  };

  const showNote = (row: StockAdjustmentItem) => {
    alert(row.notes || "No notes available.");
  };

  const columns: Column[] = [
    { key: "productName", label: "Product Name", align: "left" },
    { key: "sku", label: "SKU", align: "left" },
    { key: "stockInHand", label: "Stock In Hand", align: "right" },
    { key: "stockAdjusted", label: "Stock Adjusted", align: "right", render: (v, row) => (
      <input
        type="number"
        value={v}
        onChange={(e) => handleStockAdjustedChange(row.id, e.target.value)}
        className="w-20 border border-input rounded px-2 py-1 text-right bg-background focus:ring-2 focus:ring-ring"
        min={-row.stockInHand}
        title="Enter stock adjustment (negative or positive)"
      />
    )},
    { key: "stockAfterAdjustment", label: "Stock After Adjustment", align: "right" },
    { key: "unitCost", label: "Unit Cost", align: "right", render: (v) => `₹${v.toFixed(2)}` },
    { key: "totalCost", label: "Total Cost", align: "right", render: (v) => `₹${v.toFixed(2)}` },

  ];

  const rowActions = (row: StockAdjustmentItem) => (
    <>
    <button
        onClick={() => showNote(row)}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center"
      >
        <i className="fa fa-sticky-note" aria-hidden="true"></i>
        <span className="sr-only">View Notes</span>
      </button>
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

  const handleStockAdjustedChange = (id: number, value: string) => {
    const val = parseInt(value, 10) || 0;
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              stockAdjusted: val,
              stockAfterAdjustment: r.stockInHand + val,
              totalCost: (r.stockInHand + val) * r.unitCost,
            }
          : r
      )
    );
  };

  const customFilters = () => (
    <div className="flex flex-row gap-2 flex-wrap items-center">
      <input
        type="text"
        placeholder="Search Product Name or SKU"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search Product Name or SKU"
      />
    </div>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Product Name <span className="text-destructive">*</span></label>
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
        <label className="block text-sm font-medium mb-1">SKU <span className="text-destructive">*</span></label>
        <input
          type="text"
          name="sku"
          value={form.sku}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Enter SKU"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Stock In Hand</label>
        <input
          type="number"
          name="stockInHand"
          value={form.stockInHand}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Stock Adjusted</label>
        <input
          type="number"
          name="stockAdjusted"
          value={form.stockAdjusted}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Unit Cost</label>
        <input
          type="number"
          step="0.01"
          name="unitCost"
          value={form.unitCost}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          name="notes"
          value={form.notes || ""}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring resize-y"
          placeholder="Enter notes"
        />
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Stock Adjustment"
      description="Manage stock adjustments."
      icon="fa fa fa-sliders-h"
      onAddClick={() => {
        setForm({
          id: 0,
          productName: "",
          sku: "",
          stockInHand: 0,
          stockAdjusted: 0,
          stockAfterAdjustment: 0,
          unitCost: 0,
          totalCost: 0,
          notes: "",
        });
        setFormMode("add");
      }}
      onRefresh={handleClear}
      onReport={handleReport}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredRows.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedRows}
      rowActions={rowActions}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={formMode === "add" ? "Add Stock Adjustment" : "Edit Stock Adjustment"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
      customHeaderContent={
        <div className="flex justify-end gap-3">
          <input
            type="date"
            value={new Date().toISOString().slice(0, 10)} // Current date: 2025-10-25
            onChange={(e) => {/* Handle date change if needed */}}
            className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:ring-2 focus:ring-ring"
            aria-label="Adjustment Date"
          />
          <input
            type="text"
            value="REF-123456"
            onChange={(e) => {/* Handle reference change if needed */}}
            className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:ring-2 focus:ring-ring"
            aria-label="Reference No"
          />
          <select
            value="Main Warehouse"
            onChange={(e) => {/* Handle warehouse change if needed */}}
            className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:ring-2 focus:ring-ring"
            aria-label="Warehouse"
          >
            {WAREHOUSES.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
          <input
            type="text"
            value=""
            onChange={(e) => {/* Handle note change if needed */}}
            className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:ring-2 focus:ring-ring"
            aria-label="Note"
            placeholder="Note"
          />
        </div>
      }
       
    />
  );
};

export default StockAdjustment;