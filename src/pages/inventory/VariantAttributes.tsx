/* -------------------------------------------------
   VariantAttributes - FINAL: Icons Fixed + Type-Safe + Multi-Value
   ------------------------------------------------- */
import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";
import { SORT_LAT_ASC_DSC, BRAND_STATUSES } from "@/constants/constants";

type VariantStatus = (typeof BRAND_STATUSES)[number];
type SortOption = (typeof SORT_LAT_ASC_DSC)[number];

type Variant = {
  id: number;
  variantName: string;
  variantValues: string[];
  createdDate: string;
  status: VariantStatus;
};

export default function VariantAttributes() {
  const [data, setData] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | VariantStatus>("All");
  const [sortBy, setSortBy] = useState<SortOption>("Latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);

  const [form, setForm] = useState<Omit<Variant, "createdDate"> & { id: number }>({
    id: 0,
    variantName: "",
    variantValues: [],
    status: BRAND_STATUSES[0],
  });

  const [valueInput, setValueInput] = useState("");

  useEffect(() => {
    loadVariants();
  }, []);

  const loadVariants = async () => {
    setLoading(true);
    try {
      const res = await apiService.get<Variant[]>("VariantAttributes");
      if (res.status.code === "S") {
        const formatted = res.result.map((v) => ({
          ...v,
          createdDate: v.createdDate || new Date().toISOString(),
          variantValues: v.variantValues || [],
          status: v.status || BRAND_STATUSES[0],
        }));
        setData(formatted);
      }
    } catch (err) {
      console.error("VariantAttributes load error:", err);
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
    let filtered = data.filter((item) => {
      const matchesSearch =
        item.variantName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.variantValues.some((v) => v.toLowerCase().includes(searchText.toLowerCase()));
      const matchesStatus = filterStatus === "All" || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    const sorted = [...filtered];
    if (sortBy === "Latest") {
      sorted.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    } else if (sortBy === "Ascending") {
      sorted.sort((a, b) => a.variantName.localeCompare(b.variantName));
    } else if (sortBy === "Descending") {
      sorted.sort((a, b) => b.variantName.localeCompare(a.variantName));
    }
    return sorted;
  }, [data, searchText, filterStatus, sortBy]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(start, start + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const handleAdd = () => {
    setForm({
      id: 0,
      variantName: "",
      variantValues: [],
      status: BRAND_STATUSES[0],
    });
    setValueInput("");
    setFormMode("add");
  };

  const handleEdit = (record: Variant) => {
    setForm({
      id: record.id,
      variantName: record.variantName,
      variantValues: [...record.variantValues],
      status: record.status,
    });
    setValueInput("");
    setFormMode("edit");
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this variant?")) {
      setData((prev) => prev.filter((v) => v.id !== id));
    }
  };

  const handleClear = () => {
    setSearchText("");
    setFilterStatus("All");
    setSortBy("Latest");
    setCurrentPage(1);
  };

  const addValue = () => {
    if (valueInput.trim()) {
      const newValues = valueInput
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v);
      setForm((p) => ({
        ...p,
        variantValues: [...p.variantValues, ...newValues],
      }));
      setValueInput("");
    }
  };

  const removeValue = (index: number) => {
    setForm((p) => ({
      ...p,
      variantValues: p.variantValues.filter((_, i) => i !== index),
    }));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.variantName.trim() || form.variantValues.length === 0) {
      alert("Variant Name and at least one Value are required.");
      return;
    }

    const today = new Date().toISOString();

    if (formMode === "add") {
      const newId = data.length ? Math.max(...data.map((v) => v.id)) + 1 : 1;
      const newVariant: Variant = {
        id: newId,
        variantName: form.variantName,
        variantValues: form.variantValues,
        createdDate: today,
        status: form.status,
      };
      setData((prev) => [...prev, newVariant]);
    } else if (formMode === "edit") {
      setData((prev) =>
        prev.map((v) =>
          v.id === form.id
            ? {
              ...v,
              variantName: form.variantName,
              variantValues: form.variantValues,
              status: form.status,
            }
            : v
        )
      );
    }

    setFormMode(null);
  };

  const columns: Column[] = [
    {
      key: "variantName",
      label: "Variant Name",
      align: "left",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      key: "variantValues",
      label: "Variant Values",
      align: "left",
      render: (values: string[]) => (
        <div className="flex flex-wrap gap-1">
          {values.map((v, i) => (
            <span
              key={i}
              className="inline-block px-2 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded-full"
            >
              {v}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "createdDate",
      label: "Created Date",
      align: "center",
      render: (value) => formatIndianDate(value),
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: renderStatusBadge,
    },
  ];

  // Fixed: Proper Font Awesome icons
  const rowActions = (row: Variant) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white rounded-lg text-xs p-2 me-1"
        title="Edit"
      >
        <i className="fa fa-edit"></i>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white rounded-lg text-xs p-2"
        title="Delete"
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
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value as "All" | VariantStatus);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="All">Status</option>
          {BRAND_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
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
    <div className="grid grid-cols-1 gap-6">
      <div>
        <label className="block text-sm font-medium mb-1">
          Variant <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.variantName}
          onChange={(e) => setForm((p) => ({ ...p, variantName: e.target.value }))}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          placeholder="e.g. Size, Color"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Values <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-20">
          {form.variantValues.map((val, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 rounded-full"
            >
              {val}
              <button
                type="button"
                onClick={() => removeValue(i)}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </span>
          ))}
          {form.variantValues.length === 0 && (
            <span className="text-gray-400 text-sm">No values added</span>
          )}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={valueInput}
            onChange={(e) => setValueInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addValue();
              }
            }}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter value separated by comma"
          />
          <button
            type="button"
            onClick={addValue}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            Add
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Enter multiple values separated by comma or press Enter
        </p>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          Status <span className="text-red-500">*</span>
        </label>
        <button
          type="button"
          role="switch"
          aria-checked={form.status === BRAND_STATUSES[0]}
          onClick={() =>
            setForm((p) => ({
              ...p,
              status: p.status === BRAND_STATUSES[0] ? BRAND_STATUSES[1] : BRAND_STATUSES[0],
            }))
          }
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${form.status === BRAND_STATUSES[0] ? "bg-primary" : "bg-gray-300"
            }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${form.status === BRAND_STATUSES[0] ? "translate-x-7" : "translate-x-1"
              }`}
          />
        </button>
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Variant Attributes"
      description="Manage your variant attributes"
      icon="fa-light fa-sliders-h"
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
      modalTitle={formMode === "add" ? "Add Variant" : "Edit Variant"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
    />
  );
}