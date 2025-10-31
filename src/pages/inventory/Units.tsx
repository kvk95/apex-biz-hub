import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { EXPIRED_STATUSES } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";

interface UnitRecord {
  id: number;
  unitName: string;
  shortName: string;
  description: string;
  status: (typeof EXPIRED_STATUSES)[number];
}

export default function Units() {
  const [data, setData] = useState<UnitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<UnitRecord>({
    id: 0,
    unitName: "",
    shortName: "",
    description: "",
    status: EXPIRED_STATUSES[0],
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const response = await apiService.get<UnitRecord[]>("Units");
      if (response.status.code === "S") {
        setData(
          response.result.map((item) => ({
            ...item,
            status: item.status || EXPIRED_STATUSES[0],
          }))
        );
        setError(null);
      } else {
        setError(response.status.description);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.unitName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.shortName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = !filterStatus || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [data, searchText, filterStatus]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.unitName.trim() || !form.shortName.trim() || !form.status) {
      alert("Please fill all required fields.");
      return;
    }
    if (formMode === "add") {
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [...prev, { ...form, id: newId }]);
      const totalPages = Math.ceil((filteredData.length + 1) / itemsPerPage);
      setCurrentPage(totalPages);
    } else if (formMode === "edit" && form.id !== 0) {
      setData((prev) =>
        prev.map((item) => (item.id === form.id ? { ...item, ...form } : item))
      );
    }
    setFormMode(null);
    setForm({
      id: 0,
      unitName: "",
      shortName: "",
      description: "",
      status: EXPIRED_STATUSES[0],
    });
  };

  const handleEdit = (record: UnitRecord) => {
    setForm(record);
    setFormMode("edit");
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this unit?")) {
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
    setSearchText("");
    setFilterStatus("");
    setCurrentPage(1);
    setFormMode(null);
    setForm({
      id: 0,
      unitName: "",
      shortName: "",
      description: "",
      status: EXPIRED_STATUSES[0],
    });
    loadData();
  };

  const handleReport = () => {
    alert("Units Report:\n\n" + JSON.stringify(filteredData, null, 2));
  };

  const columns: Column[] = [
    {
      key: "unitName",
      label: "Unit Name",
      align: "left",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "shortName", label: "Short Name", align: "left" },
    { key: "description", label: "Description", align: "left" },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: renderStatusBadge,
    },
  ];

  const rowActions = (row: UnitRecord) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit ${row.unitName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete ${row.unitName}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete</span>
      </button>
    </>
  );

  const customFilters = () => (
    <div className="grid grid-cols-2 w-full justify-stretch px-3">
      <div className="flex justify-start">
        <SearchInput
          className=""
          value={searchText}
          placeholder="Search Name/Short Name/Description"
          onSearch={(query) => {
            setSearchText(query);
            setCurrentPage(1);
          }}
        />
      </div>
      <div className="flex justify-end">
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Filter by status"
        >
          <option value="">All Status</option>
          {EXPIRED_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="unitName" className="block text-sm font-medium mb-1">
          Unit Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="unitName"
          name="unitName"
          value={form.unitName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter unit name"
          required
          aria-label="Enter unit name"
        />
      </div>
      <div>
        <label htmlFor="shortName" className="block text-sm font-medium mb-1">
          Short Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="shortName"
          name="shortName"
          value={form.shortName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter short name"
          required
          aria-label="Enter short name"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={form.description}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter description"
          aria-label="Enter description"
        />
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium mb-1">
          Status <span className="text-destructive">*</span>
        </label>
        <select
          id="status"
          name="status"
          value={form.status}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
          aria-label="Select status"
        >
          <option value="">Select Status</option>
          {EXPIRED_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Units"
      description="Manage unit records."
      icon="fa fa-balance-scale"
      onAddClick={() => {
        setForm({
          id: 0,
          unitName: "",
          shortName: "",
          description: "",
          status: EXPIRED_STATUSES[0],
        });
        setFormMode("add");
      }}
      onRefresh={handleClear}
      onReport={handleReport}
      search={searchText}
      onSearchChange={(e) => {
        setSearchText(e.target.value);
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
      modalTitle={formMode === "add" ? "Add Unit" : "Edit Unit"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
    />
  );
}
