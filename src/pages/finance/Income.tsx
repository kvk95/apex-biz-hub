import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import {
  INCOME_CATEGORIES,
  ACCOUNTS,
  PAYMENT_TYPES,
} from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";

interface IncomeItem {
  id: number;
  date: string;
  invoiceId: string;
  customer: string;
  category: string;
  account: string;
  amount: number;
  paymentMethod: string;
  description: string;
}

export default function Income() {
  const [data, setData] = useState<IncomeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchInvoice, setSearchInvoice] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterAccount, setFilterAccount] = useState("All");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("All");
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<IncomeItem>({
    id: 0,
    date: "",
    invoiceId: "",
    customer: "",
    category: "All",
    account: "All",
    amount: 0,
    paymentMethod: "All",
    description: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<IncomeItem[]>("Income");
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
      const dateFromMatch = !filterDateFrom || item.date >= filterDateFrom;
      const dateToMatch = !filterDateTo || item.date <= filterDateTo;
      const categoryMatch =
        filterCategory === "All" || item.category === filterCategory;
      const accountMatch =
        filterAccount === "All" || item.account === filterAccount;
      const paymentMethodMatch =
        filterPaymentMethod === "All" ||
        item.paymentMethod === filterPaymentMethod;
      const invoiceMatch =
        !searchInvoice.trim() ||
        item.invoiceId.toLowerCase().includes(searchInvoice.toLowerCase());
      return (
        dateFromMatch &&
        dateToMatch &&
        categoryMatch &&
        accountMatch &&
        paymentMethodMatch &&
        invoiceMatch
      );
    });
  }, [
    data,
    filterDateFrom,
    filterDateTo,
    filterCategory,
    filterAccount,
    filterPaymentMethod,
    searchInvoice,
  ]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["amount"].includes(name) ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.date ||
      !form.invoiceId.trim() ||
      !form.amount ||
      form.amount <= 0
    ) {
      alert("Please fill all required fields with a positive amount.");
      return;
    }
    if (formMode === "add") {
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [{ ...form, id: newId }, ...prev]);
    } else if (formMode === "edit" && form.id !== 0) {
      setData((prev) =>
        prev.map((item) => (item.id === form.id ? { ...item, ...form } : item))
      );
    }
    setFormMode(null);
    setForm({
      id: 0,
      date: "",
      invoiceId: "",
      customer: "",
      category: "All",
      account: "All",
      amount: 0,
      paymentMethod: "All",
      description: "",
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
    if (window.confirm("Are you sure you want to delete this income record?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      if (
        (currentPage - 1) * itemsPerPage >= filteredData.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleResetFilters = () => {
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterCategory("All");
    setFilterAccount("All");
    setFilterPaymentMethod("All");
    setSearchInvoice("");
    setCurrentPage(1);
  };

  const handleReport = () => {
    const total = filteredData.reduce((acc, cur) => acc + cur.amount, 0);
    alert(
      `Report:\nTotal Income Records: ${
        filteredData.length
      }\nTotal Amount: ₹${total.toFixed(2)}`
    );
  };

  const columns: Column[] = [
    { key: "date", label: "Date", align: "left" },
    { key: "invoiceId", label: "Invoice ID", align: "left" },
    { key: "customer", label: "Customer", align: "left" },
    { key: "category", label: "Category", align: "left" },
    { key: "account", label: "Account", align: "left" },
    {
      key: "amount",
      label: "Amount",
      align: "right",
      render: (v) => `₹${v.toFixed(2)}`,
    },
    { key: "paymentMethod", label: "Payment Method", align: "left" },
    { key: "description", label: "Description", align: "left" },
  ];

  const rowActions = (row: IncomeItem) => (
    <>
      <button
        onClick={() => handleEdit(row.id)}
        title={`Edit income record ${row.invoiceId}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        title={`Delete income record ${row.invoiceId}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete</span>
      </button>
    </>
  );

  const customFilters = () => (
    <div className="grid grid-cols-2 w-full justify-stretch px-3">
      <div className="flex justify-start  gap-2">
        <SearchInput
          className=""
          value={searchInvoice}
          placeholder="Search"
          onSearch={(query) => {
            setSearchInvoice(query);
            setCurrentPage(1);
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <select
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-1.5 text-sm border border-input rounded  focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Category"
        >
          {INCOME_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={filterPaymentMethod}
          onChange={(e) => {
            setFilterPaymentMethod(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-1.5 text-sm border border-input rounded  focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Status"
        >
          {PAYMENT_TYPES.map((pm) => (
            <option key={pm} value={pm}>
              {pm}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Invoice ID</label>
        <input
          type="text"
          name="invoiceId"
          value={form.invoiceId}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Enter invoice ID"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Customer</label>
        <input
          type="text"
          name="customer"
          value={form.customer}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Enter customer name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
        >
          {INCOME_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Account</label>
        <select
          name="account"
          value={form.account}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
        >
          {ACCOUNTS.map((acc) => (
            <option key={acc} value={acc}>
              {acc}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Amount</label>
        <input
          type="number"
          name="amount"
          min={0}
          value={form.amount}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Enter amount"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Payment Method</label>
        <select
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
        >
          {PAYMENT_TYPES.map((pm) => (
            <option key={pm} value={pm}>
              {pm}
            </option>
          ))}
        </select>
      </div>
      <div className="md:col-span-3">
        <label className="block text-sm font-medium mb-1">Description</label>
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Enter description"
        />
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Income"
      description="Manage income records."
      
      onAddClick={() => {
        setForm({
          id: 0,
          date: new Date().toISOString().slice(0, 10), // 2025-10-25
          invoiceId: "",
          customer: "",
          category: "All",
          account: "All",
          amount: 0,
          paymentMethod: "All",
          description: "",
        });
        setFormMode("add");
      }}
      onRefresh={handleResetFilters}
      onReport={handleReport}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={(row) => rowActions(row as IncomeItem)}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={
        formMode === "add" ? "Add Income Record" : "Edit Income Record"
      }
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
      loading={loading}
    />
  );
}
