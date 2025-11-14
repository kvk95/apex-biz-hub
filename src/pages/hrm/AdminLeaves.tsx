import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { LEAVE_TYPES, APPROVAL_STATUSES } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";

interface LeaveRecord {
  id: number;
  employeeName: string;
  leaveType: (typeof LEAVE_TYPES)[number];
  fromDate: string;
  toDate: string;
  noOfDays: number;
  reason: string;
  status: (typeof APPROVAL_STATUSES)[number];
}

export default function AdminLeaves() {
  const [data, setData] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<LeaveRecord>({
    id: 0,
    employeeName: "",
    leaveType: LEAVE_TYPES[0],
    fromDate: "",
    toDate: "",
    noOfDays: 0,
    reason: "",
    status: "Pending",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<LeaveRecord[]>("AdminLeaves");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("AdminLeaves loadData:", { data: response.result });
  };

  const filteredLeaves = useMemo(() => {
    const result = data.filter((leave) => {
      const nameMatch = leave.employeeName
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const dateMatch = !filterDate || leave.fromDate === filterDate;
      const statusMatch = !filterStatus || leave.status === filterStatus;
      return nameMatch && dateMatch && statusMatch;
    });
    console.log("AdminLeaves filteredLeaves:", result, {
      searchName,
      filterDate,
      filterStatus,
    });
    return result;
  }, [data, searchName, filterDate, filterStatus]);

  const paginatedLeaves = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredLeaves.slice(start, end);
    console.log("AdminLeaves paginatedLeaves:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
      totalItems: filteredLeaves.length,
    });
    return result;
  }, [filteredLeaves, currentPage, itemsPerPage]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updatedForm = { ...prev, [name]: value };
      if (name === "fromDate" || name === "toDate") {
        const from = name === "fromDate" ? value : prev.fromDate;
        const to = name === "toDate" ? value : prev.toDate;
        if (from && to && new Date(to) >= new Date(from)) {
          updatedForm.noOfDays =
            Math.ceil(
              (new Date(to).getTime() - new Date(from).getTime()) /
                (1000 * 60 * 60 * 24)
            ) + 1;
        } else {
          updatedForm.noOfDays = 0;
        }
      }
      return updatedForm;
    });
    console.log("AdminLeaves handleInputChange:", { name, value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.employeeName.trim() ||
      !form.leaveType ||
      !form.fromDate ||
      !form.toDate ||
      form.noOfDays <= 0 ||
      !form.reason.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (new Date(form.toDate) < new Date(form.fromDate)) {
      alert("To Date must be on or after From Date.");
      return;
    }
    if (formMode === "add") {
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [...prev, { ...form, id: newId }]);
      const totalPages = Math.ceil((filteredLeaves.length + 1) / itemsPerPage);
      setCurrentPage(totalPages);
    } else if (formMode === "edit" && form.id !== 0) {
      setData((prev) =>
        prev.map((item) => (item.id === form.id ? { ...item, ...form } : item))
      );
    }
    setFormMode(null);
    setForm({
      id: 0,
      employeeName: "",
      leaveType: LEAVE_TYPES[0],
      fromDate: "",
      toDate: "",
      noOfDays: 0,
      reason: "",
      status: "Pending",
    });
    console.log("AdminLeaves handleFormSubmit:", { form, formMode });
  };

  const handleEdit = (leave: LeaveRecord) => {
    setForm(leave);
    setFormMode("edit");
    console.log("AdminLeaves handleEdit:", { leave });
  };

  const handleClear = () => {
    setSearchName("");
    setFilterDate("");
    setFilterStatus("");
    setCurrentPage(1);
    setFormMode(null);
    setForm({
      id: 0,
      employeeName: "",
      leaveType: LEAVE_TYPES[0],
      fromDate: "",
      toDate: "",
      noOfDays: 0,
      reason: "",
      status: "Pending",
    });
    loadData();
    console.log("AdminLeaves handleClear");
  };

  const handleReport = () => {
    alert("Leave Report:\n\n" + JSON.stringify(filteredLeaves, null, 2));
    console.log("AdminLeaves handleReport:", { filteredLeaves });
  };

  const columns: Column[] = [
    {
      key: "employeeName",
      label: "Employee Name",
      align: "left",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "leaveType", label: "Leave Type", align: "left" },
    { key: "fromDate", label: "From Date", align: "left" },
    { key: "toDate", label: "To Date", align: "left" },
    { key: "noOfDays", label: "No. of Days", align: "center" },
    { key: "reason", label: "Reason", align: "left" },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: renderStatusBadge,
    },
  ];

  const rowActions = (row: LeaveRecord) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit  ${row.employeeName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
    </>
  );

  const customFilters = () => (
    <div className="grid grid-cols-2 w-full justify-stretch px-3">
      <div className="flex justify-start  gap-2">
        <SearchInput
          className=""
          placeholder="Search Name"
          value={searchName}
          onSearch={(query) => {
            setSearchName(query);
            setCurrentPage(1);
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <SearchInput
          className=""
          type="date"
          placeholder="Select Date"
          value={filterDate}
          onSearch={(query) => {
            setFilterDate(query);
            setCurrentPage(1);
          }}
        />
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
            console.log("AdminLeaves handleFilterStatusChange:", {
              filterStatus: e.target.value,
            });
          }}
          className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Filter by status"
        >
          <option value="">All Status</option>
          {APPROVAL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label
          htmlFor="employeeName"
          className="block text-sm font-medium mb-1"
        >
          Employee Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="employeeName"
          name="employeeName"
          value={form.employeeName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter employee name"
          required
          aria-label="Enter employee name"
        />
      </div>
      <div>
        <label htmlFor="leaveType" className="block text-sm font-medium mb-1">
          Leave Type <span className="text-destructive">*</span>
        </label>
        <select
          id="leaveType"
          name="leaveType"
          value={form.leaveType}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
          aria-label="Select leave type"
        >
          <option value="">Select leave type</option>
          {LEAVE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="fromDate" className="block text-sm font-medium mb-1">
          From Date <span className="text-destructive">*</span>
        </label>
        <input
          type="date"
          id="fromDate"
          name="fromDate"
          value={form.fromDate}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
          aria-label="Select from date"
        />
      </div>
      <div>
        <label htmlFor="toDate" className="block text-sm font-medium mb-1">
          To Date <span className="text-destructive">*</span>
        </label>
        <input
          type="date"
          id="toDate"
          name="toDate"
          value={form.toDate}
          onChange={handleInputChange}
          min={form.fromDate}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
          aria-label="Select to date"
        />
      </div>
      <div>
        <label htmlFor="noOfDays" className="block text-sm font-medium mb-1">
          No. of Days <span className="text-destructive">*</span>
        </label>
        <input
          type="number"
          id="noOfDays"
          name="noOfDays"
          value={form.noOfDays}
          readOnly
          className="w-full border border-input rounded px-3 py-2 bg-background/50 focus:outline-none"
          aria-label="Number of days (auto-calculated)"
        />
      </div>
      <div className="md:col-span-3">
        <label htmlFor="reason" className="block text-sm font-medium mb-1">
          Reason <span className="text-destructive">*</span>
        </label>
        <textarea
          id="reason"
          name="reason"
          value={form.reason}
          onChange={handleInputChange}
          rows={3}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          placeholder="Enter reason for leave"
          required
          aria-label="Enter reason for leave"
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
          {APPROVAL_STATUSES.map((s) => (
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
      title="Admin Leaves"
      description="Manage leave requests."
      
      onAddClick={() => {
        setForm({
          id: 0,
          employeeName: "",
          leaveType: LEAVE_TYPES[0],
          fromDate: "",
          toDate: "",
          noOfDays: 0,
          reason: "",
          status: "Pending",
        });
        setFormMode("add");
      }}
      onRefresh={handleClear}
      onReport={handleReport}
      search={searchName}
      onSearchChange={(e) => {
        setSearchName(e.target.value);
        setCurrentPage(1);
        console.log("AdminLeaves handleSearchNameChange:", {
          searchName: e.target.value,
        });
      }}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredLeaves.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedLeaves}
      rowActions={rowActions}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={formMode === "add" ? "Apply Leave" : "Edit Leave"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
      loading={loading}
    />
  );
}
