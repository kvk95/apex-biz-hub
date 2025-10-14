import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const departments = [
  { label: "All Departments", value: "" },
  { label: "Sales", value: "Sales" },
  { label: "Marketing", value: "Marketing" },
  { label: "HR", value: "HR" },
  { label: "IT", value: "IT" },
  { label: "Finance", value: "Finance" },
];

const statuses = [
  { label: "All Status", value: "" },
  { label: "Present", value: "Present" },
  { label: "Absent", value: "Absent" },
  { label: "Late", value: "Late" },
];

export default function EmployeeAttendance() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchText, setSearchText] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("");

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    employeeId: "",
    name: "",
    department: "",
    date: "",
    checkIn: "",
    checkOut: "",
    status: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("EmployeeAttendance");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered and searched data
  const filteredData = useMemo(() => {
    return data
      .filter((emp) =>
        emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchText.toLowerCase())
      )
      .filter((emp) =>
        selectedDepartment ? emp.department === selectedDepartment : true
      )
      .filter((emp) => (selectedStatus ? emp.status === selectedStatus : true))
      .filter((emp) => (dateFilter ? emp.date === dateFilter : true));
  }, [data, searchText, selectedDepartment, selectedStatus, dateFilter]);

  // Paginated data using Pagination component props
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        employeeId: item.employeeId,
        name: item.name,
        department: item.department,
        date: item.date,
        checkIn: item.checkIn,
        checkOut: item.checkOut,
        status: item.status,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  const handleEditSave = () => {
    if (
      !editForm.employeeId.trim() ||
      !editForm.name.trim() ||
      !editForm.department.trim() ||
      !editForm.date ||
      !editForm.checkIn ||
      !editForm.checkOut ||
      !editForm.status.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                employeeId: editForm.employeeId.trim(),
                name: editForm.name.trim(),
                department: editForm.department,
                date: editForm.date,
                checkIn: editForm.checkIn,
                checkOut: editForm.checkOut,
                status: editForm.status,
              }
            : item
        )
      );
      setEditId(null);
      setIsEditModalOpen(false);
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setIsEditModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      if (
        (currentPage - 1) * itemsPerPage >= data.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setSearchText("");
    setSelectedDepartment("");
    setSelectedStatus("");
    setDateFilter("");
    setCurrentPage(1);
    setItemsPerPage(5);
  };

  const handleReport = () => {
    alert("Report generation is not implemented in this demo.");
  };

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      <h1 className="text-2xl font-semibold mb-6">Employee Attendance</h1>

      {/* Filters Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end"
        >
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium mb-1 text-muted-foreground"
            >
              Search
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by Name or ID"
              value={searchText}
              onChange={handleSearchChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium mb-1 text-muted-foreground"
            >
              Department
            </label>
            <select
              id="department"
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {departments.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium mb-1 text-muted-foreground"
            >
              Status
            </label>
            <select
              id="status"
              value={selectedStatus}
              onChange={handleStatusChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium mb-1 text-muted-foreground"
            >
              Date
            </label>
            <input
              id="date"
              type="date"
              value={dateFilter}
              onChange={handleDateChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              title="Clear"
            >
              <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              title="Generate Report"
            >
              <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Employee ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Check In
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Check Out
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No records found.
                  </td>
                </tr>
              )}
              {paginatedData.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {emp.employeeId}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{emp.name}</td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {emp.department}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{emp.date}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{emp.checkIn}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{emp.checkOut}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        emp.status === "Present"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : emp.status === "Absent"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : emp.status === "Late"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(emp.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit employee ${emp.name}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete employee ${emp.name}`}
                      type="button"
                    >
                      <i className="fa fa-trash fa-light" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredData.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
      </section>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-modal-title"
        >
          <div className="bg-white rounded shadow-lg max-w-xl w-full p-6 relative">
            <h2
              id="edit-modal-title"
              className="text-xl font-semibold mb-4 text-center"
            >
              Edit Employee Attendance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Employee ID */}
              <div>
                <label
                  htmlFor="editEmployeeId"
                  className="block text-sm font-medium mb-1"
                >
                  Employee ID
                </label>
                <input
                  type="text"
                  id="editEmployeeId"
                  name="employeeId"
                  value={editForm.employeeId}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter employee ID"
                />
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="editName"
                  className="block text-sm font-medium mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="editName"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter name"
                />
              </div>

              {/* Department */}
              <div>
                <label
                  htmlFor="editDepartment"
                  className="block text-sm font-medium mb-1"
                >
                  Department
                </label>
                <select
                  id="editDepartment"
                  name="department"
                  value={editForm.department}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {departments
                    .filter((d) => d.value !== "")
                    .map((dept) => (
                      <option key={dept.value} value={dept.value}>
                        {dept.label}
                      </option>
                    ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="editDate"
                  className="block text-sm font-medium mb-1"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="editDate"
                  name="date"
                  value={editForm.date}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Check In */}
              <div>
                <label
                  htmlFor="editCheckIn"
                  className="block text-sm font-medium mb-1"
                >
                  Check In
                </label>
                <input
                  type="time"
                  id="editCheckIn"
                  name="checkIn"
                  value={editForm.checkIn}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Check Out */}
              <div>
                <label
                  htmlFor="editCheckOut"
                  className="block text-sm font-medium mb-1"
                >
                  Check Out
                </label>
                <input
                  type="time"
                  id="editCheckOut"
                  name="checkOut"
                  value={editForm.checkOut}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="editStatus"
                  className="block text-sm font-medium mb-1"
                >
                  Status
                </label>
                <select
                  id="editStatus"
                  name="status"
                  value={editForm.status}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {statuses
                    .filter((s) => s.value !== "")
                    .map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleEditCancel}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}