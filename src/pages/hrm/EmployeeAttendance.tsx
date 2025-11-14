import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { LEAVE_STATUSES, DEPARTMENTS } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";

interface Attendance {
  id: number;
  employeeId: string;
  name: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: (typeof LEAVE_STATUSES)[number];
}

export default function EmployeeAttendance() {
  const [data, setData] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<Attendance[]>("EmployeeAttendance");
    if (response.status.code === "S") {
      setData(response.result);
    }
    setLoading(false);
    console.log("EmployeeAttendance loadData:", response.result);
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.employeeId.toLowerCase().includes(searchText.toLowerCase());
      const matchesDept =
        !selectedDepartment || item.department === selectedDepartment;
      const matchesStatus = !selectedStatus || item.status === selectedStatus;
      const matchesDate = !dateFilter || item.date === dateFilter;
      return matchesSearch && matchesDept && matchesStatus && matchesDate;
    });
  }, [data, searchText, selectedDepartment, selectedStatus, dateFilter]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleFilterChange = () => setCurrentPage(1);

  const handleClear = () => {
    setSearchText("");
    setSelectedDepartment("");
    setSelectedStatus("");
    setDateFilter("");
    setCurrentPage(1);
    loadData();
  };

  const columns: Column[] = [
    { key: "employeeId", label: "Employee ID", align: "center" },
    {
      key: "name",
      label: "Name",
      align: "left",
      render: (v) => <span className="font-semibold">{v}</span>,
    },
    { key: "department", label: "Department", align: "left" },
    { key: "date", label: "Date", align: "center" },
    { key: "checkIn", label: "Check In", align: "center" },
    { key: "checkOut", label: "Check Out", align: "center" },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: renderStatusBadge,
    },
  ];

  const customFilters = () => (
    <>
      <div className="grid grid-cols-2 w-full justify-stretch px-3">
        <div className="flex justify-start  gap-2">
          <SearchInput
            className=""
            value={searchText}
            placeholder="Search Name/ID"
            onSearch={(query) => {
              setSearchText(query);
              handleFilterChange();
            }}
          />
        </div>
        <div className="flex justify-end gap-2">
          <select
            value={selectedDepartment}
            onChange={(e) => {
              setSelectedDepartment(e.target.value);
              handleFilterChange();
            }}
            className="px-3 py-1.5 text-sm w-full border border-input rounded  focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              handleFilterChange();
            }}
            className="px-3 py-1.5 text-sm w-full border border-input rounded  focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Status</option>
            {LEAVE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <SearchInput
            className=""
            type="date"
            value={dateFilter}
            placeholder="Search Name/ID"
            onSearch={(query) => {
              setDateFilter(query);
              handleFilterChange();
            }}
          />
        </div>
      </div>
    </>
  );

  return (
    <PageBase1
      title="Employee Attendance"
      description="View and filter employee attendance records."
      
      onRefresh={handleClear}
      onReport={() => alert("Report generated")}
      search={searchText}
      onSearchChange={(e) => {
        setSearchText(e.target.value);
        handleFilterChange();
      }}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      customFilters={customFilters}
      loading={loading}
    />
  );
}
