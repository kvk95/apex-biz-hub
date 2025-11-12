/* -------------------------------------------------
   SubCategory - 100% Pixel-perfect with Image, Code, Toggle
   ------------------------------------------------- */
import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";

type Category = {
  id: number;
  categoryName: string;
};

type SubCategory = {
  subCategoryId: number;
  categoryId: string;
  categoryName: string;
  subCategoryName: string;
  categoryCode: string;
  description: string;
  status: "Active" | "Inactive";
  image?: string;
};

export default function SubCategory() {
  const [data, setData] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Active" | "Inactive">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);

  const [form, setForm] = useState({
    subCategoryId: 0,
    categoryId: "",
    categoryName: "",
    subCategoryName: "",
    categoryCode: "",
    description: "",
    status: true,
    image: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  /* ---------- Load Data ---------- */
  useEffect(() => {
    loadCategories();
    loadSubCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await apiService.get<Category[]>("Category");
      if (res.status.code === "S") {
        setCategories(res.result);
      }
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const loadSubCategories = async () => {
    setLoading(true);
    try {
      const res = await apiService.get<SubCategory[]>("SubCategory");
      if (res.status.code === "S") {
        setData(res.result.map((item) => ({
          ...item,
          status: item.status || "Active",
          image: item.image || "/assets/images/placeholder.jpg",
        })));
      }
    } catch (err) {
      console.error("SubCategory load error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Filtering ---------- */
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.subCategoryName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.categoryName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.categoryCode.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = !filterCategory || item.categoryName === filterCategory;
      const matchesStatus = filterStatus === "All" || item.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [data, searchText, filterCategory, filterStatus]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  /* ---------- Handlers ---------- */
  const handleAdd = () => {
    setForm({
      subCategoryId: 0,
      categoryId: "",
      categoryName: "",
      subCategoryName: "",
      categoryCode: "",
      description: "",
      status: true,
      image: "",
    });
    setImagePreview(null);
    setFormMode("add");
  };

  const handleEdit = (record: SubCategory) => {
    setForm({
      subCategoryId: record.subCategoryId,
      categoryId: record.categoryId,
      categoryName: record.categoryName,
      subCategoryName: record.subCategoryName,
      categoryCode: record.categoryCode,
      description: record.description,
      status: record.status === "Active",
      image: record.image,
    });
    setImagePreview(record.image || null);
    setFormMode("edit");
  };

  const handleDelete = (subCategoryId: number) => {
    if (window.confirm("Delete this sub category?")) {
      setData((prev) => prev.filter((d) => d.subCategoryId !== subCategoryId));
    }
  };

  const handleClear = () => {
    setSearchText("");
    setFilterCategory("");
    setFilterStatus("All");
    setCurrentPage(1);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be under 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setForm((p) => ({ ...p, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCode = (categoryName: string, subCategoryName: string) => {
    const cat = categoryName.slice(0, 2).toUpperCase();
    const sub = subCategoryName.slice(0, 2).toUpperCase();
    const num = String(data.filter(d => d.categoryCode.startsWith(cat)).length + 1).padStart(3, "0");
    return `${cat}${sub}${num}`;
  };

  const handleCategoryChange = (categoryName: string) => {
    const selected = categories.find(c => c.categoryName === categoryName);
    if (selected) {
      setForm((p) => ({
        ...p,
        categoryId: String(selected.id),
        categoryName,
        categoryCode: generateCode(categoryName, p.subCategoryName || ""),
      }));
    }
  };

  const handleSubCategoryChange = (subCategoryName: string) => {
    setForm((p) => ({
      ...p,
      subCategoryName,
      categoryCode: generateCode(p.categoryName, subCategoryName),
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryName || !form.subCategoryName || !form.categoryCode) {
      alert("Category, Sub Category, and Code are required.");
      return;
    }

    const finalCode = form.categoryCode || generateCode(form.categoryName, form.subCategoryName);

    if (formMode === "add") {
      const newSubCategoryId = data.length ? Math.max(...data.map(d => d.subCategoryId)) + 1 : 1;
      const newItem: SubCategory = {
        subCategoryId: newSubCategoryId,
        categoryId: form.categoryId,
        categoryName: form.categoryName,
        subCategoryName: form.subCategoryName,
        categoryCode: finalCode,
        description: form.description,
        status: form.status ? "Active" : "Inactive",
        image: form.image || "/assets/images/placeholder.jpg",
      };
      setData((prev) => [...prev, newItem]);
    } else if (formMode === "edit") {
      setData((prev) =>
        prev.map((item) =>
          item.subCategoryId === form.subCategoryId
            ? {
              ...item,
              categoryId: form.categoryId,
              categoryName: form.categoryName,
              subCategoryName: form.subCategoryName,
              categoryCode: finalCode,
              description: form.description,
              status: form.status ? "Active" : "Inactive",
              image: form.image,
            }
            : item
        )
      );
    }

    setFormMode(null);
  };

  /* ---------- Table Columns ---------- */
  const columns: Column[] = [
    {
      key: "image",
      label: "Image",
      align: "center",
      render: (value) => (
        <img
          src={value || "/assets/images/placeholder.jpg"}
          alt="subcategory"
          className="w-12 h-12 object-cover rounded-lg border"
        />
      ),
    },
    {
      key: "subCategoryName",
      label: "Sub Category",
      align: "left",
      render: (value) => <span className="font-medium">{value}</span>,
    },
    { key: "categoryName", label: "Category", align: "left" },
    { key: "categoryCode", label: "Category Code", align: "left" },
    { key: "description", label: "Description", align: "left" },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: renderStatusBadge,
    },
  ];

  const rowActions = (row: SubCategory) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white rounded-lg text-xs p-2 me-1"
      >
        <i className="fa fa-edit"></i>
      </button>
      <button
        onClick={() => handleDelete(row.subCategoryId)}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white rounded-lg text-xs p-2"
      >
        <i className="fa fa-trash-can-xmark"></i>
      </button>
    </>
  );

  const customFilters = () => (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-3 w-full">
      <div className="w-full md:w-auto md:max-w-md">
        <SearchInput
          value={searchText}
          placeholder="Search"
          onSearch={(q) => {
            setSearchText(q);
            setCurrentPage(1);
          }}
          className="w-full"
        />
      </div>
      <div className="flex gap-3">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.categoryName}>
              {cat.categoryName}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="All">Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    </div>
  );

  /* ---------- Modal Form - EXACT SS2 ---------- */
  const modalForm = () => (
    <div className="space-y-6">
      {/* Image Upload */}
      <div className="flex items-start gap-6">
        <div className="relative">
          <img
            src={imagePreview || "/assets/images/placeholder.jpg"}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border-2 border-dashed border-gray-300"
          />
          {imagePreview && (
            <button
              onClick={() => {
                setImagePreview(null);
                setForm((p) => ({ ...p, image: "" }));
              }}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
            >
              ×
            </button>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <span className="inline-block px-4 py-2 bg-orange-500 text-white rounded-lg cursor-pointer hover:bg-orange-600 transition">
              Change Image
            </span>
          </label>
          <p className="text-xs text-muted-foreground">JPEG, PNG up to 2 MB</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={form.categoryName}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.categoryName}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Sub Category <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.subCategoryName}
            onChange={(e) => handleSubCategoryChange(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="Enter sub category"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Category Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.categoryCode}
            readOnly
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="Enter description"
            required
          />
        </div>

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
    </div>
  );

  return (
    <PageBase1
      title="Sub Category"
      description="Manage your sub categories"
      icon="fa-light fa-folder-tree"
      onAddClick={handleAdd}
      onRefresh={handleClear}
      onReport={() => alert("PDF Report Generated!")}
      onExcelReport={() => alert("Excel Report Exported!")}
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
      modalTitle={formMode === "add" ? "Add Sub Category" : "Edit Sub Category"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
    />
  );
}