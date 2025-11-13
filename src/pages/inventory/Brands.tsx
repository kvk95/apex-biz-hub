/* -------------------------------------------------
   Brands - FINAL: 100% Type-Safe + BRAND_STATUSES + IST
   ------------------------------------------------- */
import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";
import { SORT_LAT_ASC_DSC, BRAND_STATUSES } from "@/constants/constants";

// Proper type extraction — no hardcoding, fully type-safe
type BrandStatus = (typeof BRAND_STATUSES)[number];
type SortOption = (typeof SORT_LAT_ASC_DSC)[number];

type Brand = {
  id: number;
  brandName: string;
  brandCode: string;
  brandDescription: string;
  createdDate: string;
  brandStatus: BrandStatus;
};

export default function Brands() {
  const [data, setData] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | BrandStatus>("All");
  const [sortBy, setSortBy] = useState<SortOption>("Latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);

  const [form, setForm] = useState({
    id: 0,
    brandName: "",
    brandCode: "",
    brandDescription: "",
    createdDate: "",
    brandStatus: BRAND_STATUSES[0] as BrandStatus,
  });

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    setLoading(true);
    try {
      const res = await apiService.get<Brand[]>("Brands");
      if (res.status.code === "S") {
        const formatted = res.result.map((b) => ({
          ...b,
          createdDate: b.createdDate || new Date().toISOString(),
          brandStatus: b.brandStatus || BRAND_STATUSES[0], // Type-safe default
        }));
        setData(formatted);
      }
    } catch (err) {
      console.error("Brands load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatIndianDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const filteredAndSortedData = useMemo(() => {
    const filtered = data.filter((item) => {
      const matchesSearch =
        item.brandName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.brandCode.toLowerCase().includes(searchText.toLowerCase()) ||
        item.brandDescription.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = filterStatus === "All" || item.brandStatus === filterStatus;
      return matchesSearch && matchesStatus;
    });

    const sorted = [...filtered];
    if (sortBy === "Latest") {
      sorted.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    } else if (sortBy === "Ascending") {
      sorted.sort((a, b) => a.brandName.localeCompare(b.brandName));
    } else if (sortBy === "Descending") {
      sorted.sort((a, b) => b.brandName.localeCompare(a.brandName));
    }
    return sorted;
  }, [data, searchText, filterStatus, sortBy]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(start, start + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const generateBrandCode = (name: string) => {
    return name
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 3)
      .padEnd(3, "X");
  };

  const handleAdd = () => {
    const today = new Date().toISOString().split("T")[0];
    setForm({
      id: 0,
      brandName: "",
      brandCode: "",
      brandDescription: "",
      createdDate: today,
      brandStatus: BRAND_STATUSES[0],
    });
    setFormMode("add");
  };

  const handleEdit = (record: Brand) => {
    setForm({
      id: record.id,
      brandName: record.brandName,
      brandCode: record.brandCode,
      brandDescription: record.brandDescription,
      createdDate: record.createdDate.split("T")[0],
      brandStatus: record.brandStatus,
    });
    setFormMode("edit");
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this brand?")) {
      setData((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handleClear = () => {
    setSearchText("");
    setFilterStatus("All");
    setSortBy("Latest");
    setCurrentPage(1);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.brandName.trim()) {
      alert("Brand Name is required.");
      return;
    }

    const code = form.brandCode || generateBrandCode(form.brandName);
    const today = new Date().toISOString();

    if (formMode === "add") {
      const newId = data.length ? Math.max(...data.map((b) => b.id)) + 1 : 1;
      const newBrand: Brand = {
        id: newId,
        brandName: form.brandName,
        brandCode: code,
        brandDescription: form.brandDescription,
        createdDate: today,
        brandStatus: form.brandStatus,
      };
      setData((prev) => [...prev, newBrand]);
    } else if (formMode === "edit") {
      setData((prev) =>
        prev.map((b) =>
          b.id === form.id
            ? {
              ...b,
              brandName: form.brandName,
              brandCode: code,
              brandDescription: form.brandDescription,
              brandStatus: form.brandStatus,
            }
            : b
        )
      );
    }

    setFormMode(null);
  };

  const columns: Column[] = [
    {
      key: "brandName",
      label: "Brand Name",
      align: "left",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "brandCode", label: "Brand Code", align: "left" },
    { key: "brandDescription", label: "Description", align: "left" },
    {
      key: "createdDate",
      label: "Created Date",
      align: "center",
      render: (value) => formatIndianDate(value),
    },
    {
      key: "brandStatus",
      label: "Status",
      align: "center",
      render: renderStatusBadge,
    },
  ];

  const rowActions = (row: Brand) => (
    <>
      <button onClick={() => handleEdit(row)} className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white rounded-lg text-xs p-2 me-1">
        <i className="fa fa-edit"></i>
      </button>
      <button onClick={() => handleDelete(row.id)} className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white rounded-lg text-xs p-2">
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
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value as "All" | BrandStatus);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="All">Status</option>
          {BRAND_STATUSES.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value as SortOption);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {SORT_LAT_ASC_DSC.map((option) => (
            <option key={option} value={option}>Sort By: {option}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium mb-1">
          Brand Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.brandName}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              brandName: e.target.value,
              brandCode: p.brandCode || generateBrandCode(e.target.value),
            }))
          }
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          placeholder="Enter brand name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Brand Code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.brandCode}
          onChange={(e) => setForm((p) => ({ ...p, brandCode: e.target.value.toUpperCase() }))}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          placeholder="Auto-generated"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">Auto-generated from name</p>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={form.brandDescription}
          onChange={(e) => setForm((p) => ({ ...p, brandDescription: e.target.value }))}
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition resize-none"
          placeholder="Enter description (optional)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Created Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={form.createdDate}
          disabled={formMode === "edit"}
          readOnly={formMode === "edit"}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 cursor-not-allowed"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          Status <span className="text-red-500">*</span>
        </label>
        <button
          type="button"
          role="switch"
          aria-checked={form.brandStatus === BRAND_STATUSES[0]}
          onClick={() =>
            setForm((p) => ({
              ...p,
              brandStatus: p.brandStatus === BRAND_STATUSES[0] ? BRAND_STATUSES[1] : BRAND_STATUSES[0],
            }))
          }
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${form.brandStatus === BRAND_STATUSES[0] ? "bg-primary" : "bg-gray-300"
            }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${form.brandStatus === BRAND_STATUSES[0] ? "translate-x-7" : "translate-x-1"
              }`}
          />
        </button>
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Brands"
      description="Manage your brands"
      icon="fa-light fa-industry"
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
      totalItems={filteredAndSortedData.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={formMode === "add" ? "Add Brand" : "Edit Brand"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
      loading={loading}
    />
  );
}