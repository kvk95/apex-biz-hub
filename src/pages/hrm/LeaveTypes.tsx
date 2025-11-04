import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { STATUSES } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";

interface LeaveType {
  id: number;
  leaveType: string;
  days: number;
  status: (typeof STATUSES)[number];
}

export default function LeaveTypes() {
  const [data, setData] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchLeaveType, setSearchLeaveType] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<LeaveType>({
    id: 0,
    leaveType: "",
    days: 0,
    status: "Active",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<LeaveType[]>("LeaveTypes");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("LeaveTypes loadData:", { data: response.result });
  };

  const filteredData = useMemo(() => {
    const result = data.filter((item) => {
      const matchesLeaveType = item.leaveType
        .toLowerCase()
        .includes(searchLeaveType.toLowerCase());
      const matchesStatus = !searchStatus || item.status === searchStatus;
      return matchesLeaveType && matchesStatus;
    });
    console.log("LeaveTypes filteredData:", result, {
      searchLeaveType,
      searchStatus,
    });
    return result;
  }, [data, searchLeaveType, searchStatus]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("LeaveTypes paginatedData:", result, {
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
    setForm((prev) => ({
      ...prev,
      [name]: name === "days" ? Number(value) : value,
    }));
    console.log("LeaveTypes handleInputChange:", { name, value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.leaveType.trim()) {
      alert("Please enter Leave Type");
      return;
    }
    if (isNaN(form.days) || form.days < 0) {
      alert("Please enter valid Days");
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
    setForm({ id: 0, leaveType: "", days: 0, status: "Active" });
    console.log("LeaveTypes handleFormSubmit:", { form, formMode });
  };

  const handleEdit = (leaveType: LeaveType) => {
    setForm(leaveType);
    setFormMode("edit");
    console.log("LeaveTypes handleEdit:", { leaveType });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this leave type?")) {
      setData((prev) => prev.filter((lt) => lt.id !== id));
      if (
        (currentPage - 1) * itemsPerPage >= filteredData.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
      console.log("LeaveTypes handleDelete:", { id });
    }
  };

  const handleClear = () => {
    setSearchLeaveType("");
    setSearchStatus("");
    setCurrentPage(1);
    setForm({ id: 0, leaveType: "", days: 0, status: "Active" });
    setFormMode(null);
    loadData();
    console.log("LeaveTypes handleClear");
  };

  const handleReport = () => {
    alert("Leave Types Report:\n\n" + JSON.stringify(filteredData, null, 2));
    console.log("LeaveTypes handleReport:", { filteredData });
  };

  const columns: Column[] = [
    {
      key: "leaveType",
      label: "Leave Type",
      align: "left",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "days", label: "Days", align: "right" },
    {
      key: "createdDate",
      label: "Created On",
      align: "center",
      render: (value) => <span className="font-semibold">dd mmm yyyy</span>,
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: renderStatusBadge,
    },
  ];

  const rowActions = (row: LeaveType) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit  ${row.leaveType}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete  ${row.leaveType}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete</span>
      </button>
    </>
  );

  const customFilters = () => (
    <div className="grid grid-cols-2 w-full justify-stretch px-3">
      <div className="flex justify-start  gap-2">
        <SearchInput
          className=""
          placeholder="Search Leave Type"
          value={searchLeaveType}
          onSearch={(query) => {
            setSearchLeaveType(query);
            setCurrentPage(1);
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <select
          value={searchStatus}
          onChange={(e) => {
            setSearchStatus(e.target.value);
            setCurrentPage(1);
            console.log("LeaveTypes handleSearchStatusChange:", {
              searchStatus: e.target.value,
            });
          }}
          className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Filter by status"
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
      </div>
    </div>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label htmlFor="leaveType" className="block text-sm font-medium mb-1">
          Leave Type <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="leaveType"
          name="leaveType"
          value={form.leaveType}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter leave type"
          required
          aria-label="Enter leave type"
        />
      </div>
      <div>
        <label htmlFor="days" className="block text-sm font-medium mb-1">
          Days <span className="text-destructive">*</span>
        </label>
        <input
          type="number"
          id="days"
          name="days"
          value={form.days}
          onChange={handleInputChange}
          min={0}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter number of days"
          required
          aria-label="Enter number of days"
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
          aria-label="Select status"
        >
          {STATUSES.filter((s) => s === "Active" || s === "Inactive").map(
            (s) => (
              <option key={s} value={s}>
                {s}
              </option>
            )
          )}
        </select>
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Leave Types"
      description="Manage leave type records."
      icon="fa fa-list"
      onAddClick={() => {
        setForm({ id: 0, leaveType: "", days: 0, status: "Active" });
        setFormMode("add");
      }}
      onRefresh={handleClear}
      onReport={handleReport}
      search={searchLeaveType}
      onSearchChange={(e) => {
        setSearchLeaveType(e.target.value);
        setCurrentPage(1);
        console.log("LeaveTypes handleSearchLeaveTypeChange:", {
          searchLeaveType: e.target.value,
        });
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
      modalTitle={formMode === "add" ? "Add Leave Type" : "Edit Leave Type"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
    />
  );
}
