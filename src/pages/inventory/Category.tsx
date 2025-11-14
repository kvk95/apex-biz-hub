/* -------------------------------------------------
   Category - 100% Pixel-perfect (SS1 + SS2 Match)
   ------------------------------------------------- */
import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";

type Category = {
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  description?: string;
  status: "Active" | "Inactive";
  image?: string;
  createdOn: string;
};

export default function Category() {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Active" | "Inactive"
  >("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);

  const [form, setForm] = useState({
    categoryId: 0,
    categoryName: "",
    categorySlug: "",
    description: "",
    status: true,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await apiService.get<Category[]>("Category");
      if (res.status.code === "S") {
        const formatted = res.result.map((c) => ({
          ...c,
          createdOn: c.createdOn || new Date().toISOString().split("T")[0],
        }));
        setData(formatted);
      }
    } catch (err) {
      console.error("Category load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.categoryName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.categorySlug.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.description?.toLowerCase().includes(searchText.toLowerCase()) ??
          false);
      const matchesStatus =
        filterStatus === "All" || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [data, searchText, filterStatus]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleAdd = () => {
    setForm({
      categoryId: 0,
      categoryName: "",
      categorySlug: "",
      description: "",
      status: true,
    });
    setFormMode("add");
  };

  const handleEdit = (record: Category) => {
    setForm({
      categoryId: record.categoryId,
      categoryName: record.categoryName,
      categorySlug: record.categorySlug,
      description: record.description || "",
      status: record.status === "Active",
    });
    setFormMode("edit");
  };

  const handleDelete = (categoryId: number) => {
    if (window.confirm("Delete this category?")) {
      setData((prev) => prev.filter((c) => c.categoryId !== categoryId));
    }
  };

  const handleClear = () => {
    setSearchText("");
    setFilterStatus("All");
    setCurrentPage(1);
  };

  const handleReport = () => alert("PDF Report Generated!");
  const handleExcelReport = () => alert("Excel Report Exported!");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryName.trim()) {
      alert("Category Name is required.");
      return;
    }

    const slug = form.categorySlug || generateSlug(form.categoryName);

    if (formMode === "add") {
      const newCategoryId = data.length
        ? Math.max(...data.map((c) => c.categoryId)) + 1
        : 1;
      const newCategory: Category = {
        categoryId: newCategoryId,
        categoryName: form.categoryName,
        categorySlug: slug,
        description: form.description,
        status: form.status ? "Active" : "Inactive",
        createdOn: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [...prev, newCategory]);
    } else if (formMode === "edit") {
      setData((prev) =>
        prev.map((c) =>
          c.categoryId === form.categoryId
            ? {
              ...c,
              categoryName: form.categoryName,
              categorySlug: slug,
              description: form.description,
              status: form.status ? "Active" : "Inactive",
            }
            : c
        )
      );
    }

    setFormMode(null);
  };

  const columns: Column[] = [
    {
      key: "categoryName",
      label: "Category",
      align: "left",
      render: (value, row: Category) => (
        <div className="flex items-center gap-3">
          <img
            src={row.image}
            alt={value}
            className="w-8 h-8 rounded object-cover"
          />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "categorySlug",
      label: "Category Slug",
      align: "left",
    },
    { key: "description", label: "Description", align: "left" },
    {
      key: "createdOn",
      label: "Created On",
      align: "center",
      render: (value) => new Date(value).toLocaleDateString("en-GB"),
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: renderStatusBadge,
    },
  ];

  const rowActions = (row: Category) => (
    <>
      <button
        type="button"
        onClick={() => handleEdit(row)}
        aria-label={`Edit ${row.categoryName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white rounded-lg text-xs p-2 me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button
        type="button"
        onClick={() => handleDelete(row.categoryId)}
        aria-label={`Delete ${row.categoryName}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white rounded-lg text-xs p-2"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete</span>
      </button>
    </>
  );

  const customFilters = () => (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-3 w-full">
      <div className="w-full md:w-auto md:max-w-md">
        <SearchInput
          value={searchText}
          placeholder="Search Name/Description"
          onSearch={(q) => {
            setSearchText(q);
            setCurrentPage(1);
          }}
          className="w-full"
        />
      </div>
      <div className="flex justify-end">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    </div>
  );

  /* ---------- Modal Form - EXACTLY like SS1 & SS2 ---------- */
  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Category Name */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.categoryName}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              categoryName: e.target.value,
              categorySlug: generateSlug(e.target.value),
            }))
          }
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          placeholder="Enter category name"
          required
        />
      </div>

      {/* Category Slug */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Category Slug <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.categorySlug}
          onChange={(e) =>
            setForm((p) => ({ ...p, categorySlug: e.target.value }))
          }
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          placeholder="auto-generated"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Auto-generated. You can edit.
        </p>
      </div>

      {/* Description */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">Description</label>
        <input
          type="text"
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          placeholder="Enter description (optional)"
        />
      </div>

      {/* Status Toggle */}
      <div className="md:col-span-2 flex items-center justify-between">
        <label className="text-sm font-medium">
          Status <span className="text-red-500">*</span>
        </label>
        <button
          type="button"
          role="switch"
          aria-checked={form.status}
          onClick={() => setForm((p) => ({ ...p, status: !p.status }))}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${form.status ? "bg-primary" : "bg-gray-300"
            }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${form.status ? "translate-x-7" : "translate-x-1"
              }`}
          />
        </button>
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Category"
      description="Manage your categories"
      onAddClick={handleAdd}
      onRefresh={handleClear}
      onReport={handleReport}
      onExcelReport={handleExcelReport}
      search={searchText}
      onSearchChange={(val) => {
        setSearchText(val);
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
      modalTitle={formMode === "add" ? "Add Category" : "Edit Category"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
      loading={loading}
    />
  );
}
