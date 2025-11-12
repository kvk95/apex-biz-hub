/* -------------------------------------------------
   Warranties - FINAL: Type-Safe + durationPeriod + warrantyPeriod + Edit Fixed
   ------------------------------------------------- */
import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";
import { SORT_LAT_ASC_DSC, BRAND_STATUSES, DURATION_TYPES } from "@/constants/constants";

type WarrantyStatus = (typeof BRAND_STATUSES)[number];
type DurationType = (typeof DURATION_TYPES)[number];
type SortOption = (typeof SORT_LAT_ASC_DSC)[number];

type Warranty = {
  id: number;
  warrantyNo: string;
  warranty: string;
  description: string;
  durationNo: number;
  durationPeriod: DurationType;
  warrantyPeriod: string;
  createdDate: string;
  status: WarrantyStatus;
};

export default function Warranties() {
  const [data, setData] = useState<Warranty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | WarrantyStatus>("All");
  const [sortBy, setSortBy] = useState<SortOption>("Latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);

  const [form, setForm] = useState({
    id: 0,
    warranty: "",
    description: "",
    durationNo: 1,
    durationPeriod: DURATION_TYPES[0] as DurationType,
    status: BRAND_STATUSES[0] as WarrantyStatus,
  });

  useEffect(() => {
    loadWarranties();
  }, []);

  const loadWarranties = async () => {
    setLoading(true);
    try {
      const res = await apiService.get<any[]>("Warranties");
      if (res.status.code === "S") {
        const formatted = res.result.map((w) => {
          const durationNo = typeof w.durationNo === "number" ? w.durationNo : 1;
          const rawPeriod = w.durationPeriod && typeof w.durationPeriod === "string"
            ? w.durationPeriod
            : DURATION_TYPES[0];

          const period = durationNo === 1
            ? rawPeriod.replace(/s$/i, "")
            : rawPeriod.endsWith("s") ? rawPeriod : rawPeriod + "s";

          const warrantyPeriod = `${durationNo} ${period}`;

          return {
            id: w.id || 0,
            warrantyNo: w.warrantyNo || `WRT-${String(w.id || 1).padStart(4, "0")}`,
            warranty: w.warranty || "",
            description: w.description || "",
            durationNo,
            durationPeriod: rawPeriod as DurationType,
            warrantyPeriod,
            createdDate: w.createdDate || new Date().toISOString(),
            status: (w.status || BRAND_STATUSES[0]) as WarrantyStatus,
          };
        });
        setData(formatted);
      }
    } catch (err) {
      console.error("Warranties load error:", err);
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

  const generateWarrantyCode = () => {
    const nextId = data.length ? Math.max(...data.map((w) => w.id)) + 1 : 1;
    return `WRT-${String(nextId).padStart(4, "0")}`;
  };

  const computeWarrantyPeriod = (num: number, period: DurationType): string => {
    const cleanPeriod = num === 1 ? period.replace(/s$/i, "") : period.endsWith("s") ? period : period + "s";
    return `${num} ${cleanPeriod}`;
  };

  const parseWarrantyPeriod = (periodStr: string): { num: number; period: DurationType } => {
    const match = periodStr.trim().match(/^(\d+)\s+(.+)$/);
    if (!match) return { num: 1, period: DURATION_TYPES[0] };

    const num = parseInt(match[1], 10) || 1;
    let rawPeriod = match[2].trim();

    const matched = DURATION_TYPES.find(t => t.toLowerCase() === rawPeriod.toLowerCase());
    return { num, period: (matched || DURATION_TYPES[0]) as DurationType };
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter((item) => {
      const matchesSearch =
        item.warrantyNo.toLowerCase().includes(searchText.toLowerCase()) ||
        item.warranty.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = filterStatus === "All" || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    const sorted = [...filtered];
    if (sortBy === "Latest") {
      sorted.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    } else if (sortBy === "Ascending") {
      sorted.sort((a, b) => a.warranty.localeCompare(b.warranty));
    } else if (sortBy === "Descending") {
      sorted.sort((a, b) => b.warranty.localeCompare(a.warranty));
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
      warranty: "",
      description: "",
      durationNo: 1,
      durationPeriod: DURATION_TYPES[0] as DurationType,
      status: BRAND_STATUSES[0] as WarrantyStatus,
    });
    setFormMode("add");
  };

  // FIXED: Edit now correctly populates durationPeriod
  const handleEdit = (record: Warranty) => {
    const { num, period } = parseWarrantyPeriod(record.warrantyPeriod);
    setForm({
      id: record.id,
      warranty: record.warranty,
      description: record.description,
      durationNo: num,
      durationPeriod: period,
      status: record.status,
    });
    setFormMode("edit");
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this warranty?")) {
      setData((prev) => prev.filter((w) => w.id !== id));
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
    if (!form.warranty.trim() || form.durationNo <= 0 || !form.description.trim()) {
      alert("Warranty, Duration, and Description are required.");
      return;
    }

    const warrantyPeriod = computeWarrantyPeriod(form.durationNo, form.durationPeriod);
    const today = new Date().toISOString();
    const warrantyCode = formMode === "add" ? generateWarrantyCode() : data.find((w) => w.id === form.id)?.warrantyNo || "";

    if (formMode === "add") {
      const newId = data.length ? Math.max(...data.map((w) => w.id)) + 1 : 1;
      const newWarranty: Warranty = {
        id: newId,
        warrantyNo: warrantyCode,
        warranty: form.warranty,
        description: form.description,
        durationNo: form.durationNo,
        durationPeriod: form.durationPeriod,
        warrantyPeriod,
        createdDate: today,
        status: form.status,
      };
      setData((prev) => [...prev, newWarranty]);
    } else if (formMode === "edit") {
      setData((prev) =>
        prev.map((w) =>
          w.id === form.id
            ? {
              ...w,
              warranty: form.warranty,
              description: form.description,
              durationNo: form.durationNo,
              durationPeriod: form.durationPeriod,
              warrantyPeriod,
              status: form.status,
            }
            : w
        )
      );
    }

    setFormMode(null);
  };

  const columns: Column[] = [
    { key: "warrantyNo", label: "Warranty Code", align: "left" },
    {
      key: "warranty",
      label: "Warranty",
      align: "left",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "description", label: "Description", align: "left" },
    {
      key: "warrantyPeriod",
      label: "Duration",
      align: "left",
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: renderStatusBadge,
    },
  ];

  const rowActions = (row: Warranty) => (
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
            setFilterStatus(e.target.value as "All" | WarrantyStatus);
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
        <label htmlFor="warranty" className="block text-sm font-medium mb-1">
          Warranty <span className="text-red-500">*</span>
        </label>
        <input
          id="warranty"
          type="text"
          value={form.warranty}
          onChange={(e) => setForm((p) => ({ ...p, warranty: e.target.value }))}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          placeholder="e.g. Replacement Warranty"
          required
          aria-required="true"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="durationNo" className="block text-sm font-medium mb-1">
            Duration <span className="text-red-500">*</span>
          </label>
          <input
            id="durationNo"
            type="number"
            min="1"
            value={form.durationNo}
            onChange={(e) => setForm((p) => ({ ...p, durationNo: parseInt(e.target.value) || 1 }))}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
            required
            aria-required="true"
          />
        </div>
        <div>
          <label htmlFor="durationPeriod" className="block text-sm font-medium mb-1">
            Period <span className="text-red-500">*</span>
          </label>
          <select
            id="durationPeriod"
            value={form.durationPeriod}
            onChange={(e) => setForm((p) => ({ ...p, durationPeriod: e.target.value as DurationType }))}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
            required
            aria-required="true"
          >
            {DURATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition resize-none"
          placeholder="Covers replacement of faulty items"
          required
          aria-required="true"
        />
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor="statusToggle" className="text-sm font-medium">
          Status <span className="text-red-500">*</span>
        </label>
        <button
          id="statusToggle"
          type="button"
          role="switch"
          aria-checked={form.status === BRAND_STATUSES[0]}
          aria-label="Toggle warranty status"
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
      title="Warranties"
      description="Manage your warranties"
      icon="fa-light fa-shield-halved"
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
      modalTitle={formMode === "add" ? "Add Warranty" : "Edit Warranty"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
    />
  );
}