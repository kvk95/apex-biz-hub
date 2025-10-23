import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";
import { STATUSES } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";

interface Shift {
  id: number;
  shiftName: string;
  startTime: string;
  endTime: string;
  status: (typeof STATUSES)[number];
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any, idx?: number) => JSX.Element;
  align?: "left" | "center" | "right";
  className?: string;  
}

export default function Shifts() {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<Shift>({
    id: 0,
    shiftName: "",
    startTime: "",
    endTime: "",
    status: STATUSES[0],
  });
  const [data, setData] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<Shift[]>("Shifts");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("Shifts loadData:", { data: response.result });
  };

  const filteredData = useMemo(() => {
    const result = !search.trim()
      ? data
      : data.filter(
          (shift) =>
            shift.shiftName.toLowerCase().includes(search.toLowerCase()) ||
            shift.startTime.toLowerCase().includes(search.toLowerCase()) ||
            shift.endTime.toLowerCase().includes(search.toLowerCase()) ||
            shift.status.toLowerCase().includes(search.toLowerCase())
        );
    console.log("Shifts filteredData:", result, { search });
    return result;
  }, [data, search]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("Shifts paginatedData:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
      totalItems: filteredData.length,
    });
    return result;
  }, [filteredData, currentPage, itemsPerPage]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setFormMode("add");
    setForm({
      id: 0,
      shiftName: "",
      startTime: "",
      endTime: "",
      status: STATUSES[0],
    });
    console.log("Shifts handleAddClick: Modal opened for add");
  };

  const handleEdit = (shift: Shift) => {
    setFormMode("edit");
    setForm(shift);
    console.log("Shifts handleEdit: Modal opened for edit", { shift });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.shiftName.trim() || !form.startTime || !form.endTime) {
      alert(
        "Please fill all required fields (Shift Name, Start Time, End Time)."
      );
      return;
    }
    if (
      !/^\d{2}:\d{2}$/.test(form.startTime) ||
      !/^\d{2}:\d{2}$/.test(form.endTime)
    ) {
      alert("Please enter valid times in HH:mm format.");
      return;
    }
    if (
      data.some(
        (shift) =>
          shift.shiftName.toLowerCase() === form.shiftName.toLowerCase() &&
          (formMode === "edit" ? shift.id !== form.id : true)
      )
    ) {
      alert("Shift Name must be unique.");
      return;
    }
    if (formMode === "add") {
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [...prev, { id: newId, ...form }]);
      const totalPages = Math.ceil((filteredData.length + 1) / itemsPerPage);
      setCurrentPage(totalPages);
    } else if (formMode === "edit" && form.id !== 0) {
      setData((prev) =>
        prev.map((item) => (item.id === form.id ? { ...item, ...form } : item))
      );
    }
    setFormMode(null);
    console.log("Shifts handleFormSubmit:", { form, formMode });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this shift?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      const totalPages = Math.ceil((filteredData.length - 1) / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
        console.log("Shifts handleDelete: Adjusted to last page", {
          id,
          currentPage,
          totalPages,
        });
      } else if (totalPages === 0) {
        setCurrentPage(1);
        console.log("Shifts handleDelete: Reset to page 1 (no data)", {
          id,
          currentPage,
          totalPages,
        });
      }
      console.log("Shifts handleDelete:", { id, totalPages });
    }
  };

  const handleClear = () => {
    loadData();
    setFormMode(null);
    setSearch("");
    setCurrentPage(1);
    setItemsPerPage(10);
    console.log("Shifts handleClear");
  };

  const handleReport = () => {
    alert("Shift Report:\n\n" + JSON.stringify(data, null, 2));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    console.log("Shifts handleSearchChange:", {
      search: e.target.value,
      currentPage: 1,
    });
  };

  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      console.log("Shifts handlePageChange:", {
        page,
        totalPages,
        currentPage,
      });
    } else {
      console.warn("Shifts handlePageChange: Invalid page or same page", {
        page,
        totalPages,
        currentPage,
      });
    }
  };

  const columns: Column[] = [
    {
      key: "shiftName",
      label: "Shift Name",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "startTime", label: "Start Time", align: "center" },
    { key: "endTime", label: "End Time", align: "center" },
    { key: "status", label: "Status", align: "center", render: renderStatusBadge },
  ];

  const rowActions = (row: Shift) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit shift ${row.shiftName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit shift</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete shift ${row.shiftName}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete shift</span>
      </button>
    </>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label htmlFor="shiftName" className="block text-sm font-medium mb-1">
          Shift Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="shiftName"
          name="shiftName"
          value={form.shiftName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter shift name"
          required
        />
      </div>
      <div>
        <label htmlFor="startTime" className="block text-sm font-medium mb-1">
          Start Time <span className="text-destructive">*</span>
        </label>
        <input
          type="time"
          id="startTime"
          name="startTime"
          value={form.startTime}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>
      <div>
        <label htmlFor="endTime" className="block text-sm font-medium mb-1">
          End Time <span className="text-destructive">*</span>
        </label>
        <input
          type="time"
          id="endTime"
          name="endTime"
          value={form.endTime}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium mb-1">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={form.status}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
      title="Shifts"
      description="Manage shifts for your application."
      icon="fa fa-clock"
      onAddClick={handleAddClick}
      onRefresh={handleClear}
      onReport={handleReport}
      search={search}
      onSearchChange={handleSearchChange}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={handlePageChange}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={formMode === "add" ? "Add Shift" : "Edit Shift"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
    />
  );
}
