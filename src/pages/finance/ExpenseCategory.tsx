import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";
import { STATUSES } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";

type ExpenseCategory = {
  id: number;
  name: string;
  description: string;
  status: (typeof STATUSES)[number];
};

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: ExpenseCategory) => JSX.Element;
  align?: "left" | "center" | "right";
}

export default function ExpenseCategory() {
  const [data, setData] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("");
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<ExpenseCategory>({
    id: 0,
    name: "",
    description: "",
    status: "Active",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<ExpenseCategory[]>("ExpenseCategory");
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
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || item.status === filterStatus;
    const matchesCategory = !filterCategory || item.name === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
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
    if (!form.name.trim()) {
      alert("Expense Category Name is required.");
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
      name: "",
      description: "",
      status: "Active",
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
    if (
      window.confirm("Are you sure you want to delete this Expense Category?")
    ) {
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
    setFilterStatus("All");
    setFilterCategory("");
    setForm({
      id: 0,
      name: "",
      description: "",
      status: "Active",
    });
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report Data:\n" + JSON.stringify(filteredData, null, 2));
  };

  const columns: Column[] = [ 
    { key: "name", label: "Expense Category Name", align: "left" },
    { key: "description", label: "Description", align: "left" },
        { key: "status", label: "Status", align: "center", render: renderStatusBadge }, 
  ];

  const rowActions = (row: ExpenseCategory) => (
    <>
      <button
        onClick={() => handleEdit(row.id)}
        aria-label={`Edit category ${row.name}`}
       className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete category ${row.name}`}
       className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete</span>
      </button>
    </>
  );

  const customFilters = () => (
    <div className="flex flex-row justify-between mb-4 items-center">
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search"
      />
      <div className="flex gap-2">
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Status"
        >
          <option value="">All Status</option>
          {STATUSES.filter((s) => s === "Active" || s === "Inactive").map(
            (s) => (
              <option key={s} value={s}>
                {s}
              </option>
            )
          )}
        </select>
        <select
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Category"
        >
          <option value="">Category</option>
          {data.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label className="block text-sm font-medium mb-1">
          Expense Category Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Enter Expense Category Name"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring resize-none"
          placeholder="Enter Description"
          rows={1}
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
      title="Expense Category"
      description="Manage expense category records."
      icon="fa fa-tags"
      onAddClick={() => {
        setForm({
          id: 0,
          name: "",
          description: "",
          status: "Active",
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
      rowActions={(row) => rowActions(row as ExpenseCategory)}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={
        formMode === "add" ? "Add Expense Category" : "Edit Expense Category"
      }
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
    />
  );
}
