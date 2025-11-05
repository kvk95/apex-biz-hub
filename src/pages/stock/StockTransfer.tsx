import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { STORES, STATUSES } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";

interface StockTransferItem {
  id: number;
  date: string;
  referenceNo: string;
  fromStore: string;
  toStore: string;
  product: string;
  quantity: number;
  status: string;
}

export default function StockTransfer() {
  const [data, setData] = useState<StockTransferItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterFromStore, setFilterFromStore] = useState("");
  const [filterToStore, setFilterToStore] = useState("");
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<StockTransferItem>({
    id: 0,
    date: "",
    referenceNo: "",
    fromStore: "",
    toStore: "",
    product: "",
    quantity: 0,
    status: "Pending",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<StockTransferItem[]>("StockTransfer");
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
      const matchFromStore =
        !filterFromStore || item.fromStore === filterFromStore;
      const matchToStore = !filterToStore || item.toStore === filterToStore;
      const matchStatus =
        item.status === "Pending" || item.status === "Completed"; // Default filter behavior
      return matchFromStore && matchToStore && matchStatus;
    });
  }, [data, filterFromStore, filterToStore]);

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
      [name]: ["quantity"].includes(name) ? parseInt(value) || 0 : value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.date ||
      !form.referenceNo.trim() ||
      !form.fromStore ||
      !form.toStore ||
      !form.product.trim() ||
      form.quantity <= 0
    ) {
      alert(
        "Please fill all fields with valid data (quantity must be positive)."
      );
      return;
    }
    if (form.fromStore === form.toStore) {
      alert("From Store and To Store cannot be the same.");
      return;
    }
    if (formMode === "add") {
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [{ ...form, id: newId }, ...prev]);
      setCurrentPage(1);
    } else if (formMode === "edit" && form.id !== 0) {
      setData((prev) =>
        prev.map((item) => (item.id === form.id ? { ...item, ...form } : item))
      );
    }
    setFormMode(null);
    setForm({
      id: 0,
      date: "",
      referenceNo: "",
      fromStore: "",
      toStore: "",
      product: "",
      quantity: 0,
      status: "Pending",
    });
  };

  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setForm(item);
      setFormMode("edit");
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this transfer?")) {
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
    setFilterFromStore("");
    setFilterToStore("");
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Stock Transfer Report:\n\n" + JSON.stringify(filteredData, null, 2));
  };

  const columns: Column[] = [
    { key: "date", label: "Date", align: "left" },
    { key: "referenceNo", label: "Reference No", align: "left" },
    { key: "fromStore", label: "From Store", align: "left" },
    { key: "toStore", label: "To Store", align: "left" },
    { key: "product", label: "Product", align: "left" },
    {
      key: "quantity",
      label: "Quantity",
      align: "right",
      render: (v) => `${v}`,
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: renderStatusBadge,
    },
  ];

  const rowActions = (row: StockTransferItem) => (
    <>
      <button
        onClick={() => handleEdit(row.id)}
        aria-label={`Edit stock transfer ${row.referenceNo}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete stock transfer ${row.referenceNo}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete</span>
      </button>
    </>
  );

  const customFilters = () => (
    <div className="grid grid-cols-2 w-full justify-stretch px-3">
      <div className="flex justify-start  gap-2"></div>
      <div className="flex justify-end gap-2">
        <select
          value={filterFromStore}
          onChange={(e) => {
            setFilterFromStore(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="From Store"
        >
          <option value="">From Store</option>
          {STORES.map((store) => (
            <option key={store} value={store}>
              {store}
            </option>
          ))}
        </select>
        <select
          value={filterToStore}
          onChange={(e) => {
            setFilterToStore(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="To Store"
        >
          <option value="">To Store</option>
          {STORES.map((store) => (
            <option key={store} value={store}>
              {store}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Date <span className="text-destructive">*</span>
        </label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Reference No <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          name="referenceNo"
          value={form.referenceNo}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Enter reference no"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          From Store <span className="text-destructive">*</span>
        </label>
        <select
          name="fromStore"
          value={form.fromStore}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          required
        >
          <option value="" disabled>
            Select store
          </option>
          {STORES.map((store) => (
            <option key={store} value={store}>
              {store}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          To Store <span className="text-destructive">*</span>
        </label>
        <select
          name="toStore"
          value={form.toStore}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          required
        >
          <option value="" disabled>
            Select store
          </option>
          {STORES.map((store) => (
            <option key={store} value={store}>
              {store}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Product <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          name="product"
          value={form.product}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Enter product name"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Quantity <span className="text-destructive">*</span>
        </label>
        <input
          type="number"
          name="quantity"
          min={1}
          value={form.quantity}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Enter quantity"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Status <span className="text-destructive">*</span>
        </label>
        <select
          name="status"
          value={form.status}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          required
        >
          {STATUSES.filter((s) => s !== "All").map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Stock Transfer"
      description="Manage stock transfers between stores."
      icon="fa fa-truck"
      onAddClick={() => {
        setForm({
          id: 0,
          date: new Date().toISOString().slice(0, 10), // Today: 2025-10-25
          referenceNo: "",
          fromStore: "",
          toStore: "",
          product: "",
          quantity: 0,
          status: "Pending",
        });
        setFormMode("add");
      }}
      onRefresh={handleClear}
      onReport={handleReport}
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
      modalTitle={
        formMode === "add" ? "Add Stock Transfer" : "Edit Stock Transfer"
      }
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
    />
  );
}
