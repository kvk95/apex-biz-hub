import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";
import { LEAVE_STATUSES, DEPARTMENTS } from "@/constants/constants";
import { renderLeaveStatusBadge } from "@/utils/tableUtils";

interface Attendance {
  id: number;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  date: string;
  inTime: string;
  outTime: string;
  status: (typeof LEAVE_STATUSES)[number];
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any, idx?: number) => JSX.Element;
  align?: "left" | "center" | "right";
  className?: string;
}

export default function AdminAttendance() {  
  const [data, setData] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [searchEmployee, setSearchEmployee] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<Attendance[]>("AdminAttendance");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("AdminAttendance loadData:", { data: response.result });
  };

  const filteredData = useMemo(() => {
    const result = data.filter((item) => {
      const matchesDepartment =
        selectedDepartment === "All Departments" ||
        item.department === selectedDepartment;
      const matchesStatus =
        selectedStatus === "All Status" || item.status === selectedStatus;
      const matchesEmployee =
        item.employeeName
          .toLowerCase()
          .includes(searchEmployee.toLowerCase()) ||
        item.employeeId.toLowerCase().includes(searchEmployee.toLowerCase());
      const matchesDate = !searchDate || item.date === searchDate;
      return (
        matchesDepartment && matchesStatus && matchesEmployee && matchesDate
      );
    });
    console.log("AdminAttendance filteredData:", result, {
      selectedDepartment,
      selectedStatus,
      searchEmployee,
      searchDate,
    });
    return result;
  }, [data, selectedDepartment, selectedStatus, searchEmployee, searchDate]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("AdminAttendance paginatedData:", result, {
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

  const handleClear = () => {
    setSelectedDepartment("All Departments");
    setSelectedStatus("All Status");
    setSearchEmployee("");
    setSearchDate("");
    setCurrentPage(1); 
    loadData();
    console.log("AdminAttendance handleClear");
  };

  const handleReport = () => {
    alert("Attendance Report:\n\n" + JSON.stringify(filteredData, null, 2));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchEmployee(e.target.value);
    setCurrentPage(1);
    console.log("AdminAttendance handleSearchChange:", {
      searchEmployee: e.target.value,
      currentPage: 1,
    });
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(e.target.value);
    setCurrentPage(1);
    console.log("AdminAttendance handleDepartmentChange:", {
      selectedDepartment: e.target.value,
      currentPage: 1,
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
    console.log("AdminAttendance handleStatusChange:", {
      selectedStatus: e.target.value,
      currentPage: 1,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDate(e.target.value);
    setCurrentPage(1);
    console.log("AdminAttendance handleDateChange:", {
      searchDate: e.target.value,
      currentPage: 1,
    });
  };

  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      console.log("AdminAttendance handlePageChange:", {
        page,
        totalPages,
        currentPage,
      });
    } else {
      console.warn(
        "AdminAttendance handlePageChange: Invalid page or same page",
        {
          page,
          totalPages,
          currentPage,
        }
      );
    }
  };

  const columns: Column[] = [
    { key: "employeeId", label: "Employee ID", align: "center" },
    {
      key: "employeeName",
      label: "Employee Name",
      align: "left",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "department", label: "Department", align: "left" },
    { key: "designation", label: "Designation", align: "left" },
    { key: "date", label: "Date", align: "center" },
    { key: "inTime", label: "In Time", align: "center" },
    { key: "outTime", label: "Out Time", align: "center" },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: renderLeaveStatusBadge,
    },
  ];

  const customFilters = () => (
    <>
      <div className="flex-1">
        <select
          id="department"
          name="department"
          value={selectedDepartment}
          onChange={handleDepartmentChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Select department to filter attendance records"
        >
          {["All Departments", ...DEPARTMENTS].map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <select
          id="status"
          name="status"
          value={selectedStatus}
          onChange={handleStatusChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Select status to filter attendance records"
        >
          {["All Status", ...LEAVE_STATUSES].map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <input
          type="text"
          id="employeeSearch"
          name="employeeSearch"
          placeholder="Search by name or ID"
          value={searchEmployee}
          onChange={handleSearchChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Search by employee name or ID"
        />
      </div>
      <div className="flex-1">
        <input
          type="date"
          id="date"
          name="date"
          value={searchDate}
          onChange={handleDateChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Select date to filter attendance records"
        />
      </div>
    </>
  ); 

  return (
    <PageBase1
      title="Attendance"
      description="Manage employee attendance records."
      icon="fa fa-user-cog"
      onRefresh={handleClear}
      onReport={handleReport}
      search={searchEmployee}
      onSearchChange={handleSearchChange}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={handlePageChange}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData} 
      customFilters={customFilters}
    />
  );
}
