import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";
import { STATUSES } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";

interface IncomeCategoryItem {
  id: number;
  incomeCategory: string;
  description: string;
  status: "Active" | "Inactive";
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: IncomeCategoryItem) => JSX.Element;
  align?: "left" | "center" | "right";
}

const IncomeCategory: React.FC = () => {
  const [data, setData] = useState<IncomeCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("");
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<IncomeCategoryItem>({
    id: 0,
    incomeCategory: "",
    description: "",
    status: "Active",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<IncomeCategoryItem[]>("IncomeCategory");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  const filteredData = data.filter((item) => {
    const matchesSearch = !searchTerm.trim() || item.incomeCategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || item.status === filterStatus;
    const matchesCategory = !filterCategory || item.incomeCategory === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.incomeCategory.trim()) {
      alert("Income Category is required.");
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
      incomeCategory: "",
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
    if (window.confirm("Are you sure you want to delete this category?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      if ((currentPage - 1) * itemsPerPage >= filteredData.length - 1 && currentPage > 1) {
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
      incomeCategory: "",
      description: "",
      status: "Active",
    });
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generated (dummy action).");
  };

  const columns: Column[] = [ 
    { key: "incomeCategory", label: "Income Category", align: "left" },
    { key: "description", label: "Description", align: "left" },
    {
          key: "status",
          label: "Status",
          align: "center",
          render: renderStatusBadge,
        },
  ];

  const rowActions = (row: IncomeCategoryItem) => (
    <>
      <button
        onClick={() => handleEdit(row.id)}
        aria-label={`Edit ${row.incomeCategory}`}
         className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete ${row.incomeCategory}`}
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
        aria-label="Search Category"
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
          <option value="All">Status</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
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
            <option key={item.id} value={item.incomeCategory}>
              {item.incomeCategory}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label className="block text-sm font-medium mb-1">Income Category <span className="text-red-600">*</span></label>
        <input
          type="text"
          name="incomeCategory"
          value={form.incomeCategory}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="Enter Income Category"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          rows={3}
          placeholder="Enter Description"
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
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Income Category"
      description="Manage income category records."
      icon="fa fa-tags"
      onAddClick={() => {
        setForm({
          id: 0,
          incomeCategory: "",
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
      rowActions={(row) => rowActions(row as IncomeCategoryItem)}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={formMode === "add" ? "Add Income Category" : "Edit Income Category"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
    />
  );
};

export default IncomeCategory;