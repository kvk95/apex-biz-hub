import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { ACCOUNT_TYPES, STATUSES } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";

interface BankAccount {
  id: number;
  bankName: string;
  branchName: string;
  accountNumber: string;
  accountHolder: string;
  accountType: string;
  openingBalance: number;
  currentBalance: number;
  status: "Active" | "Inactive";
}

export default function BankAccounts() {
  const [data, setData] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterAccountType, setFilterAccountType] = useState("All");
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const initialFormState = {
    bankName: "",
    branchName: "",
    accountNumber: "",
    accountHolder: "",
    accountType: "Savings",
    openingBalance: "",
    currentBalance: "",
    status: "Active",
  };
  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<BankAccount[]>("BankAccounts");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  const filteredData = data.filter((item) => {
    const matchesSearch =
      !searchTerm.trim() ||
      [
        item.bankName,
        item.branchName,
        item.accountNumber,
        item.accountHolder,
      ].some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      filterStatus === "All" || item.status === filterStatus;
    const matchesAccountType =
      filterAccountType === "All" || item.accountType === filterAccountType;
    return matchesSearch && matchesStatus && matchesAccountType;
  });

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
      [name]:
        name === "openingBalance" || name === "currentBalance"
          ? value.replace(/\D/g, "")
          : value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.bankName.trim() ||
      !form.branchName.trim() ||
      !form.accountNumber.trim() ||
      !form.accountHolder.trim() ||
      !form.openingBalance.trim() ||
      !form.currentBalance.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (formMode === "add") {
      const newId = data.length ? data[data.length - 1].id + 1 : 1;
      setData((prev) => [
        ...prev,
        {
          id: newId,
          bankName: form.bankName,
          branchName: form.branchName,
          accountNumber: form.accountNumber,
          accountHolder: form.accountHolder,
          accountType: form.accountType,
          openingBalance: Number(form.openingBalance),
          currentBalance: Number(form.currentBalance),
          status: form.status,
        },
      ]);
      if (
        data.length + 1 >
        itemsPerPage * Math.ceil(data.length / itemsPerPage)
      ) {
        setCurrentPage(Math.ceil((data.length + 1) / itemsPerPage));
      }
    } else if (formMode === "edit" && form.id !== 0) {
      setData((prev) =>
        prev.map((item) =>
          item.id === form.id
            ? {
                ...item,
                bankName: form.bankName,
                branchName: form.branchName,
                accountNumber: form.accountNumber,
                accountHolder: form.accountHolder,
                accountType: form.accountType,
                openingBalance: Number(form.openingBalance),
                currentBalance: Number(form.currentBalance),
                status: form.status,
              }
            : item
        )
      );
    }
    setFormMode(null);
    setForm(initialFormState);
  };

  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setForm({
        bankName: item.bankName,
        branchName: item.branchName,
        accountNumber: item.accountNumber,
        accountHolder: item.accountHolder,
        accountType: item.accountType,
        openingBalance: item.openingBalance.toString(),
        currentBalance: item.currentBalance.toString(),
        status: item.status,
      });
      setFormMode("edit");
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      if (
        currentPage > 1 &&
        data.length - 1 <= itemsPerPage * (currentPage - 1)
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleClear = () => {
    setForm(initialFormState);
    setSearchTerm("");
    setFilterStatus("All");
    setFilterAccountType("All");
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report Data:\n" + JSON.stringify(filteredData, null, 2));
  };

  const columns: Column[] = [
    { key: "bankName", label: "Bank Name", align: "left" },
    { key: "branchName", label: "Branch Name", align: "left" },
    { key: "accountNumber", label: "Account Number", align: "left" },
    { key: "accountHolder", label: "Account Holder", align: "left" },
    { key: "accountType", label: "Account Type", align: "left" },
    {
      key: "openingBalance",
      label: "Opening Balance",
      align: "right",
      render: (v) => `₹${v.toLocaleString()}`,
    },
    {
      key: "currentBalance",
      label: "Current Balance",
      align: "right",
      render: (v) => `₹${v.toLocaleString()}`,
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: renderStatusBadge,
    },
  ];

  const rowActions = (row: BankAccount) => (
    <>
      <button
        onClick={() => handleEdit(row.id)}
        aria-label={`Edit account ${row.bankName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete account ${row.bankName}`}
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
          placeholder="Search"
          value={searchTerm}
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
          className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
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
          value={filterAccountType}
          onChange={(e) => {
            setFilterAccountType(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Category"
        >
          <option value="All">Account Type</option>
          {ACCOUNT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label className="block text-sm font-medium mb-1">Bank Name</label>
        <input
          type="text"
          name="bankName"
          value={form.bankName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Enter bank name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Branch Name</label>
        <input
          type="text"
          name="branchName"
          value={form.branchName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Enter branch name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Account Number</label>
        <input
          type="text"
          name="accountNumber"
          value={form.accountNumber}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Enter account number"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Account Holder</label>
        <input
          type="text"
          name="accountHolder"
          value={form.accountHolder}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Enter account holder"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Account Type</label>
        <select
          name="accountType"
          value={form.accountType}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
        >
          {ACCOUNT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Opening Balance
        </label>
        <input
          type="text"
          name="openingBalance"
          value={form.openingBalance}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Enter opening balance"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Current Balance
        </label>
        <input
          type="text"
          name="currentBalance"
          value={form.currentBalance}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Enter current balance"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
        >
          {STATUSES.map((status) => (
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
      title="Bank Accounts"
      description="Manage bank account records."
      
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
      rowActions={(row) => rowActions(row as BankAccount)}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={formMode === "add" ? "Add Bank Account" : "Edit Bank Account"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
      loading={loading}
    />
  );
}
