import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { PAYMENT_STATUSES, MONTHS } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";
import { useNavigate } from "react-router-dom";
import { SearchInput } from "@/components/Search/SearchInput";

interface EmployeeSalaryRecord {
  id: number;
  employeeName: string;
  employeeId: string;
  month: (typeof MONTHS)[number];
  year: string;
  salary: number;
  advance: number;
  deduction: number;
  netSalary: number;
  paymentStatus: (typeof PAYMENT_STATUSES)[number];
}

export default function EmployeeSalary() {
  const navigate = useNavigate();
  const [data, setData] = useState<EmployeeSalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<EmployeeSalaryRecord>({
    id: 0,
    employeeName: "",
    employeeId: "",
    month: MONTHS[0],
    year: new Date().getFullYear().toString(),
    salary: 0,
    advance: 0,
    deduction: 0,
    netSalary: 0,
    paymentStatus: "Paid",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<EmployeeSalaryRecord[]>(
      "EmployeeSalary"
    );
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("EmployeeSalary loadData:", { data: response.result });
  };

  const filteredData = useMemo(() => {
    const result = data.filter((record) => {
      console.log(record);
      console.log(record.employeeName);
      const matchesSearch =
        record.employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus =
        !filterStatus || record.paymentStatus === filterStatus;
      return matchesSearch && matchesStatus;
    });
    console.log("EmployeeSalary filteredData:", result, {
      searchText,
      filterStatus,
    });
    return result;
  }, [data, searchText, filterStatus]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("EmployeeSalary paginatedData:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
      totalItems: filteredData.length,
    });
    return result;
  }, [filteredData, currentPage, itemsPerPage]);

  const years = Array.from({ length: 6 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updatedForm = { ...prev, [name]: value };
      if (["salary", "advance", "deduction"].includes(name)) {
        const salary = name === "salary" ? parseFloat(value) || 0 : prev.salary;
        const advance =
          name === "advance" ? parseFloat(value) || 0 : prev.advance;
        const deduction =
          name === "deduction" ? parseFloat(value) || 0 : prev.deduction;
        updatedForm.netSalary =
          salary - advance - deduction > 0 ? salary - advance - deduction : 0;
      }
      return updatedForm;
    });
    console.log("EmployeeSalary handleInputChange:", { name, value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.employeeName.trim() ||
      !form.employeeId.trim() ||
      !form.month ||
      !form.year ||
      !form.salary
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (form.salary < 0 || form.advance < 0 || form.deduction < 0) {
      alert("Salary, advance, and deduction must be non-negative.");
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
      employeeName: "",
      employeeId: "",
      month: MONTHS[0],
      year: new Date().getFullYear().toString(),
      salary: 0,
      advance: 0,
      deduction: 0,
      netSalary: 0,
      paymentStatus: "Paid",
    });
    console.log("EmployeeSalary handleFormSubmit:", { form, formMode });
  };

  const handleEdit = (record: EmployeeSalaryRecord) => {
    setForm(record);
    setFormMode("edit");
    console.log("EmployeeSalary handleEdit:", { record });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this salary record?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      if (
        (currentPage - 1) * itemsPerPage >= filteredData.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
      console.log("EmployeeSalary handleDelete:", { id });
    }
  };

  const handleView = (record: EmployeeSalaryRecord) => {
    alert(`Salary Record:\n\n${JSON.stringify(record, null, 2)}`);
    console.log("EmployeeSalary handleView:", { record });
    // Navigate to payslip page and pass the full record via state
    navigate("/hrm/payroll/payslip", {
      state: { salaryRecord: record },
    });
  };

  const handleDownload = (record: EmployeeSalaryRecord) => {
    alert(
      `Downloading salary slip for ${record.employeeName} (${record.month} ${record.year})`
    );
    console.log("EmployeeSalary handleDownload:", { record });
  };

  const handleClear = () => {
    setSearchText("");
    setFilterStatus("");
    setCurrentPage(1);
    setFormMode(null);
    setForm({
      id: 0,
      employeeName: "",
      employeeId: "",
      month: MONTHS[0],
      year: new Date().getFullYear().toString(),
      salary: 0,
      advance: 0,
      deduction: 0,
      netSalary: 0,
      paymentStatus: "Paid",
    });
    loadData();
    console.log("EmployeeSalary handleClear");
  };

  const handleReport = () => {
    alert("Salary Report:\n\n" + JSON.stringify(filteredData, null, 2));
    console.log("EmployeeSalary handleReport:", { filteredData });
  };

  const columns: Column[] = [
    {
      key: "index",
      label: "#",
      align: "left",
      render: (_, __, idx) => (
        <span>{(currentPage - 1) * itemsPerPage + (idx ?? 0) + 1}</span>
      ),
    },
    {
      key: "employeeName",
      label: "Employee Name",
      align: "left",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "employeeId", label: "Employee ID", align: "left" },
    { key: "month", label: "Month", align: "left" },
    { key: "year", label: "Year", align: "left" },
    {
      key: "salary",
      label: "Salary",
      align: "right",
      render: (value) => `₹${value.toFixed(2)}`,
    },
    {
      key: "advance",
      label: "Advance",
      align: "right",
      render: (value) => `₹${value.toFixed(2)}`,
    },
    {
      key: "deduction",
      label: "Deduction",
      align: "right",
      render: (value) => `₹${value.toFixed(2)}`,
    },
    {
      key: "netSalary",
      label: "Net Salary",
      align: "right",
      render: (value) => `₹${value.toFixed(2)}`,
    },
    {
      key: "paymentStatus",
      label: "Payment Status",
      align: "center",
      render: renderStatusBadge,
    },
  ];

  const rowActions = (row: EmployeeSalaryRecord) => (
    <div className="flex justify-center gap-2">
      <button
        onClick={() => handleView(row)}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
        aria-label={`View salary for ${row.employeeName}`}
        type="button"
      >
        <i className="fa fa-eye" aria-hidden="true"></i>
      </button>
      <button
        onClick={() => handleDownload(row)}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
        aria-label={`Download salary slip for ${row.employeeName}`}
        type="button"
      >
        <i className="fa fa-download" aria-hidden="true"></i>
      </button>
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
    </div>
  );

  const customFilters = () => (
    <div className="grid grid-cols-2 w-full justify-stretch px-3">
      <div className="flex justify-start  gap-2">
        <SearchInput
          className=""
          placeholder="Search Name/ID"
          value={searchText}
          onSearch={(query) => {
            setSearchText(query);
            setCurrentPage(1);
          }}
        /> 
      </div>
      <div className="flex justify-end gap-2">
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
            console.log("EmployeeSalary handleFilterStatusChange:", {
              filterStatus: e.target.value,
            });
          }}
          className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Filter by payment status"
        >
          <option value="">All Status</option>
          {PAYMENT_STATUSES.map((s) => (
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
        <label htmlFor="employeeId" className="block text-sm font-medium mb-1">
          Employee ID <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="employeeId"
          name="employeeId"
          value={form.employeeId}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter employee ID"
          required
          aria-label="Enter employee ID"
        />
      </div>
      <div>
        <label htmlFor="month" className="block text-sm font-medium mb-1">
          Month <span className="text-destructive">*</span>
        </label>
        <select
          id="month"
          name="month"
          value={form.month}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
          aria-label="Select month"
        >
          <option value="">Select Month</option>
          {MONTHS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="year" className="block text-sm font-medium mb-1">
          Year <span className="text-destructive">*</span>
        </label>
        <select
          id="year"
          name="year"
          value={form.year}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
          aria-label="Select year"
        >
          <option value="">Select Year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="salary" className="block text-sm font-medium mb-1">
          Salary <span className="text-destructive">*</span>
        </label>
        <input
          type="number"
          id="salary"
          name="salary"
          min={0}
          step="0.01"
          value={form.salary}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter salary"
          required
          aria-label="Enter salary"
        />
      </div>
      <div>
        <label htmlFor="advance" className="block text-sm font-medium mb-1">
          Advance
        </label>
        <input
          type="number"
          id="advance"
          name="advance"
          min={0}
          step="0.01"
          value={form.advance}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter advance"
          aria-label="Enter advance"
        />
      </div>
      <div>
        <label htmlFor="deduction" className="block text-sm font-medium mb-1">
          Deduction
        </label>
        <input
          type="number"
          id="deduction"
          name="deduction"
          min={0}
          step="0.01"
          value={form.deduction}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter deduction"
          aria-label="Enter deduction"
        />
      </div>
      <div>
        <label htmlFor="netSalary" className="block text-sm font-medium mb-1">
          Net Salary
        </label>
        <input
          type="text"
          id="netSalary"
          name="netSalary"
          value={form.netSalary.toFixed(2)}
          readOnly
          className="w-full border border-input rounded px-3 py-2 bg-background/50 focus:outline-none cursor-not-allowed"
          aria-label="Net salary (auto-calculated)"
        />
      </div>
      <div>
        <label
          htmlFor="paymentStatus"
          className="block text-sm font-medium mb-1"
        >
          Payment Status <span className="text-destructive">*</span>
        </label>
        <select
          id="paymentStatus"
          name="paymentStatus"
          value={form.paymentStatus}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
          aria-label="Select payment status"
        >
          <option value="">Select Status</option>
          {PAYMENT_STATUSES.map((s) => (
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
      title="Employee Salary"
      description="Manage employee salary records."
      
      onAddClick={() => {
        setForm({
          id: 0,
          employeeName: "",
          employeeId: "",
          month: MONTHS[0],
          year: new Date().getFullYear().toString(),
          salary: 0,
          advance: 0,
          deduction: 0,
          netSalary: 0,
          paymentStatus: "Paid",
        });
        setFormMode("add");
      }}
      onRefresh={handleClear}
      onReport={handleReport}
      search={searchText}
      onSearchChange={(e) => {
        setSearchText(e.target.value);
        setCurrentPage(1);
        console.log("EmployeeSalary handleSearchChange:", {
          searchText: e.target.value,
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
      modalTitle={formMode === "add" ? "Add Salary" : "Edit Salary"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
      loading={loading}
    />
  );
}
