import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { CURRENCIES, STATUSES } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  accountNo: string;
  balance: number;
}

interface FormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAccountNo: string;
  customerBalance: string;
  transferFrom: string;
  transferTo: string;
  bankName: string;
  accountNo: string;
  amount: string;
  currency: string;
  description: string;
}

export default function MoneyTransfer() {
  const [customersData, setCustomersData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterAccountNo, setFilterAccountNo] = useState("");
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const initialFormState: FormData = {
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAccountNo: "",
    customerBalance: "",
    transferFrom: "",
    transferTo: "",
    bankName: "",
    accountNo: "",
    amount: "",
    currency: "INR", // Default to INR as per ₹ request
    description: "",
  };
  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<Customer[]>("MoneyTransfer");
    if (response.status.code === "S") {
      setCustomersData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  const filteredData = customersData.filter((customer) => {
    const matchesSearch =
      !searchTerm.trim() ||
      customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Active"
        ? customer.balance > 0
        : customer.balance <= 0); // Inferred status
    const matchesAccountNo =
      !filterAccountNo || customer.accountNo === filterAccountNo;
    return matchesSearch && matchesStatus && matchesAccountNo;
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.customerName.trim() ||
      !form.customerPhone.trim() ||
      !form.customerEmail.trim() ||
      !form.customerAccountNo.trim() ||
      (formMode === "add" && !form.amount.trim())
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (formMode === "add") {
      const newId = customersData.length
        ? Math.max(...customersData.map((c) => c.id)) + 1
        : 1;
      setCustomersData((prev) => [
        ...prev,
        {
          id: newId,
          name: form.customerName.trim(),
          phone: form.customerPhone.trim(),
          email: form.customerEmail.trim(),
          accountNo: form.customerAccountNo.trim(),
          balance: Number(form.customerBalance) || 0,
        },
      ]);
      if (
        customersData.length + 1 >
        itemsPerPage * Math.ceil(customersData.length / itemsPerPage)
      ) {
        setCurrentPage(Math.ceil((customersData.length + 1) / itemsPerPage));
      }
    } else if (formMode === "edit" && form.id !== 0) {
      setCustomersData((prev) =>
        prev.map((item) =>
          item.id === form.id
            ? {
                ...item,
                name: form.customerName.trim(),
                phone: form.customerPhone.trim(),
                email: form.customerEmail.trim(),
                accountNo: form.customerAccountNo.trim(),
                balance: Number(form.customerBalance) || item.balance,
              }
            : item
        )
      );
    }
    setFormMode(null);
    setForm(initialFormState);
  };

  const handleEdit = (id: number) => {
    const customer = customersData.find((c) => c.id === id);
    if (customer) {
      setForm({
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        customerAccountNo: customer.accountNo,
        customerBalance: customer.balance.toString(),
        transferFrom: "",
        transferTo: "",
        bankName: "",
        accountNo: "",
        amount: "",
        currency: "INR",
        description: "",
      });
      setFormMode("edit");
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setCustomersData((prev) => prev.filter((c) => c.id !== id));
      if (
        currentPage > 1 &&
        customersData.length - 1 <= itemsPerPage * (currentPage - 1)
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleClear = () => {
    setForm(initialFormState);
    setSearchTerm("");
    setFilterStatus("All");
    setFilterAccountNo("");
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report functionality triggered (not implemented).");
  };

  const columns: Column[] = [
    { key: "name", label: "Customer Name", align: "left" },
    { key: "phone", label: "Phone", align: "left" },
    { key: "email", label: "Email", align: "left" },
    { key: "accountNo", label: "Account No", align: "left" },
    {
      key: "balance",
      label: "Balance",
      align: "left",
      render: (v) => `₹${v.toLocaleString()}`,
    },
  ];

  const rowActions = (row: Customer) => (
    <>
      <button
        onClick={() => handleEdit(row.id)}
        title={`Edit customer ${row.name}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        title={`Delete customer ${row.name}`}
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
          value={searchTerm}
          placeholder="Search"
          onSearch={(query) => {
            setSearchTerm(query);
            setCurrentPage(1);
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-1.5 text-sm border border-input roundedfocus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Status"
        >
          <option value="All">Status</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select
          value={filterAccountNo}
          onChange={(e) => {
            setFilterAccountNo(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Category"
        >
          <option value="">Category</option>
          {customersData.map((customer) => (
            <option key={customer.id} value={customer.accountNo}>
              {customer.accountNo}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div>
        <label className="block text-sm font-medium mb-1">Customer Name</label>
        <input
          type="text"
          name="customerName"
          value={form.customerName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Customer Name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          type="text"
          name="customerPhone"
          value={form.customerPhone}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Phone"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="customerEmail"
          value={form.customerEmail}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Email"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Account No</label>
        <input
          type="text"
          name="customerAccountNo"
          value={form.customerAccountNo}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Account No"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Balance</label>
        <input
          type="number"
          name="customerBalance"
          value={form.customerBalance}
          onChange={handleInputChange}
          min={0}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Balance"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Transfer From</label>
        <input
          type="text"
          name="transferFrom"
          value={form.transferFrom}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Transfer From"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Transfer To</label>
        <input
          type="text"
          name="transferTo"
          value={form.transferTo}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Transfer To"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Bank Name</label>
        <input
          type="text"
          name="bankName"
          value={form.bankName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Bank Name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Account No</label>
        <input
          type="text"
          name="accountNo"
          value={form.accountNo}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Account No"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Amount</label>
        <input
          type="text"
          name="amount"
          value={form.amount}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Amount"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Currency</label>
        <select
          name="currency"
          value={form.currency}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
        >
          {CURRENCIES.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <div className="md:col-span-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Enter description"
          rows={3}
        />
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Money Transfer"
      description="Manage money transfer records."
      
      onAddClick={() => {
        setForm(initialFormState);
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
      rowActions={(row) => rowActions(row as Customer)}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={formMode === "add" ? "Add Money Transfer" : "Edit Customer"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
      loading={loading}
    />
  );
}
