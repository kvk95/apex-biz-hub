import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";
import { LEAVE_TYPES, LEAVE_APPROVAL_STATUSES } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";

interface LeaveRecord {
  id: number;
  employeeId: string;
  employeeName: string;
  leaveType: typeof LEAVE_TYPES[number];
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: typeof LEAVE_APPROVAL_STATUSES[number];
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any, idx?: number) => JSX.Element;
  align?: "left" | "center" | "right";
}

export default function EmployeeLeaves() {
  const [data, setData] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<LeaveRecord>({
    id: 0,
    employeeId: "",
    employeeName: "",
    leaveType: LEAVE_TYPES[0],
    fromDate: "",
    toDate: "",
    days: 0,
    reason: "",
    status: "Pending",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<LeaveRecord[]>("EmployeeLeaves");
    if (response.status.code === "S") {
      setData(response.result);
    }
    setLoading(false);
    console.log("EmployeeLeaves loadData:", response.result);
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.employeeId.toLowerCase().includes(searchText.toLowerCase());
      const matchesDate = !filterDate || item.fromDate === filterDate;
      const matchesStatus = !filterStatus || item.status === filterStatus;
      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [data, searchText, filterDate, filterStatus]);

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
    if (
      !form.employeeId.trim() ||
      !form.employeeName.trim() ||
      !form.leaveType ||
      !form.fromDate ||
      !form.toDate ||
      form.days <= 0 ||
      !form.reason.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const days = Math.ceil(
      (new Date(form.toDate).getTime() - new Date(form.fromDate).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;

    if (formMode === "add") {
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [
        ...prev,
        { ...form, id: newId, days, status: "Pending" },
      ]);
    } else if (formMode === "edit" && form.id !== 0) {
      setData((prev) =>
        prev.map((item) =>
          item.id === form.id ? { ...item, ...form, days } : item
        )
      );
    }
    setFormMode(null);
    setForm({
      id: 0,
      employeeId: "",
      employeeName: "",
      leaveType: LEAVE_TYPES[0],
      fromDate: "",
      toDate: "",
      days: 0,
      reason: "",
      status: "Pending",
    });
  };

  const handleEdit = (item: LeaveRecord) => {
    setForm(item);
    setFormMode("edit");
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this leave record?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const handleClear = () => {
    setSearchText("");
    setFilterDate("");
    setFilterStatus("");
    setCurrentPage(1);
    loadData();
  };

  const handleReport = () => {
    alert("Report:\n" + JSON.stringify(filteredData, null, 2));
  };

  const columns: Column[] = [
    { key: "employeeId", label: "Employee ID", align: "center" },
    { key: "employeeName", label: "Name", align: "left", render: (v) => <span className="font-semibold">{v}</span> },
    { key: "leaveType", label: "Leave Type", align: "left" },
    { key: "fromDate", label: "From", align: "center" },
    { key: "toDate", label: "To", align: "center" },
    { key: "days", label: "Days", align: "center" },
    { key: "reason", label: "Reason", align: "left" },
    { key: "status", label: "Status", align: "center", render: renderStatusBadge },
  ];

  const rowActions = (row: LeaveRecord) => (
    <>
    
      {row.status === "Pending" && (
        <button
          onClick={() => alert(`Cancel leave for ${row.employeeName}`)}
           className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
          aria-label={`Cancel leave for ${row.employeeName}`}
        >
          <i className="fa fa-times-circle"  aria-hidden="true"></i> 
        </button>
      )}
      {row.status === "Rejected" && (
        <button
          onClick={() => alert(`Info: ${row.reason}`)}
          className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs py-2 px-2 text-center inline-flex items-center me-1"
          aria-label={`View rejection reason for ${row.employeeName}`}
        >
          <i className="fa fa-info "  aria-hidden="true"></i> 
        </button>
      )}

      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit  ${row.employeeName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete  ${row.employeeName}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete</span>
      </button>
    </> 
  );

  const customFilters = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        type="text"
        placeholder="Search Name/ID"
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          setCurrentPage(1);
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:ring-2 focus:ring-ring"
        aria-label="Search by employee name or ID"
      />
      <input
        type="date"
        value={filterDate}
        onChange={(e) => {
          setFilterDate(e.target.value);
          setCurrentPage(1);
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:ring-2 focus:ring-ring"
        aria-label="Filter by date"
      />
      <select
        value={filterStatus}
        onChange={(e) => {
          setFilterStatus(e.target.value);
          setCurrentPage(1);
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:ring-2 focus:ring-ring"
        aria-label="Filter by status"
      >
        <option value="">All Status</option>
        {LEAVE_APPROVAL_STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Employee ID <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          name="employeeId"
          value={form.employeeId}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="E001"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Employee Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          name="employeeName"
          value={form.employeeName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="John Doe"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Leave Type <span className="text-destructive">*</span>
        </label>
        <select
          name="leaveType"
          value={form.leaveType}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
        >
          {LEAVE_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          From Date <span className="text-destructive">*</span>
        </label>
        <input
          type="date"
          name="fromDate"
          value={form.fromDate}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          To Date <span className="text-destructive">*</span>
        </label>
        <input
          type="date"
          name="toDate"
          value={form.toDate}
          onChange={handleInputChange}
          min={form.fromDate}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Reason <span className="text-destructive">*</span>
        </label>
        <textarea
          name="reason"
          value={form.reason}
          onChange={handleInputChange}
          rows={2}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring resize-none"
          placeholder="Enter reason"
          required
        />
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Employee Leaves"
      description="Apply and manage employee leave requests."
      icon="fa fa-user-clock"
      onAddClick={() => {
        setForm({
          id: 0,
          employeeId: "",
          employeeName: "",
          leaveType: LEAVE_TYPES[0],
          fromDate: "",
          toDate: "",
          days: 0,
          reason: "",
          status: "Pending",
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
      modalTitle={formMode === "add" ? "Apply Leave" : "Edit Leave"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
    />
  );
}