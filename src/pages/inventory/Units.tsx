import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";
import { SORT_LAT_ASC_DSC, BRAND_STATUSES } from "@/constants/constants";

// Extract types safely from constants
type UnitStatus = (typeof BRAND_STATUSES)[number];
type SortOption = (typeof SORT_LAT_ASC_DSC)[number];

type Unit = {
  id: number;
  unitName: string;
  shortName: string;
  noOfProducts: number;
  description: string;
  createdDate: string;
  status: UnitStatus;
};

export default function Units() {
  const [data, setData] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | UnitStatus>("All");
  const [sortBy, setSortBy] = useState<SortOption>("Latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);

  // Form state now uses full UnitStatus type
  const [form, setForm] = useState<Pick<Unit, "id" | "unitName" | "shortName" | "description" | "status">>({
    id: 0,
    unitName: "",
    shortName: "",
    description: "",
    status: BRAND_STATUSES[0], // "Active"
  });

  useEffect(() => {
    loadUnits();
  }, []);

  const loadUnits = async () => {
    setLoading(true);
    try {
      const res = await apiService.get<Unit[]>("Units");
      if (res.status.code === "S") {
        const formatted = res.result.map((u) => ({
          ...u,
          createdDate: u.createdDate || new Date().toISOString(),
          noOfProducts: u.noOfProducts ?? 0,
          status: u.status || BRAND_STATUSES[0],
        }));
        setData(formatted);
      }
    } catch (err) {
      console.error("Units load error:", err);
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
        item.unitName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.shortName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = filterStatus === "All" || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    const sorted = [...filtered];
    if (sortBy === "Latest") {
      sorted.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    } else if (sortBy === "Ascending") {
      sorted.sort((a, b) => a.unitName.localeCompare(b.unitName));
    } else if (sortBy === "Descending") {
      sorted.sort((a, b) => b.unitName.localeCompare(a.unitName));
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
      unitName: "",
      shortName: "",
      description: "",
      status: BRAND_STATUSES[0],
    });
    setFormMode("add");
  };

  const handleEdit = (record: Unit) => {
    setForm({
      id: record.id,
      unitName: record.unitName,
      shortName: record.shortName,
      description: record.description,
      status: record.status,
    });
    setFormMode("edit");
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this unit?")) {
      setData((prev) => prev.filter((u) => u.id !== id));
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
    if (!form.unitName.trim() || !form.shortName.trim()) {
      alert("Unit and Short Name are required.");
      return;
    }

    const today = new Date().toISOString();

    if (formMode === "add") {
      const newId = data.length ? Math.max(...data.map((u) => u.id)) + 1 : 1;
      const newUnit: Unit = {
        id: newId,
        unitName: form.unitName,
        shortName: form.shortName,
        noOfProducts: 0,
        description: form.description,
        createdDate: today,
        status: form.status,
      };
      setData((prev) => [...prev, newUnit]);
    } else if (formMode === "edit") {
      setData((prev) =>
        prev.map((u) =>
          u.id === form.id
            ? {
              ...u,
              unitName: form.unitName,
              shortName: form.shortName,
              description: form.description,
              status: form.status,
            }
            : u
        )
      );
    }

    setFormMode(null);
  };

  const columns: Column[] = [
    {
      key: "unitName",
      label: "Unit",
      align: "left",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "shortName", label: "Short Name", align: "left" },
    {
      key: "noOfProducts",
      label: "No Of Products",
      align: "center",
      render: (value) => <span className="font-medium">{value}</span>,
    },
    { key: "description", label: "Description", align: "left" },
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

  const rowActions = (row: Unit) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white rounded-lg text-xs p-2 me-1"
      >
        <i className="fa fa-edit"></i>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
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
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value as "All" | UnitStatus);
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium mb-1">
          Unit <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.unitName}
          onChange={(e) => setForm((p) => ({ ...p, unitName: e.target.value }))}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          placeholder="Enter unit name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Short Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.shortName}
          onChange={(e) => setForm((p) => ({ ...p, shortName: e.target.value.toUpperCase() }))}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          placeholder="e.g. Kg"
          required
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition resize-none"
          placeholder="Enter description (optional)"
        />
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
      title="Units"
      description="Manage your units"
      icon="fa-light fa-balance-scale"
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
      modalTitle={formMode === "add" ? "Add Unit" : "Edit Unit"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
      loading={loading}
    />
  );
}