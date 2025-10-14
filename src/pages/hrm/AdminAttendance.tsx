import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const departments = [
  "All Departments",
  "Sales",
  "Marketing",
  "IT",
  "HR",
  "Finance",
];

const statuses = ["All Status", "Present", "Absent", "Leave"];

export default function AdminAttendance() {
  // Filters state
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [searchEmployee, setSearchEmployee] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // API state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    employeeId: "",
    employeeName: "",
    department: "",
    designation: "",
    date: "",
    inTime: "",
    outTime: "",
    status: statuses[0],
  });
  const [editId, setEditId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("AdminAttendance");
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
    return data.filter((item) => {
      const matchesDepartment =
        selectedDepartment === "All Departments" ||
        item.department === selectedDepartment;
      const matchesStatus =
        selectedStatus === "All Status" || item.status === selectedStatus;
      const matchesEmployee =
        item.employeeName.toLowerCase().includes(searchEmployee.toLowerCase()) ||
        item.employeeId.toLowerCase().includes(searchEmployee.toLowerCase());
      const matchesDate =
        !searchDate || item.date === searchDate;

      return (
        matchesDepartment && matchesStatus && matchesEmployee && matchesDate
      );
    });
  }, [data, selectedDepartment, selectedStatus, searchEmployee, searchDate]);

  // Calculate paginated data using Pagination component props
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleResetFilters = () => {
    setSelectedDepartment("All Departments");
    setSelectedStatus("All Status");
    setSearchEmployee("");
    setSearchDate("");
    setCurrentPage(1);
  };

  const handleClear = () => {
    handleResetFilters();
    setEditId(null);
    setIsEditModalOpen(false);
  };

  const handleReport = () => {
    alert("Report generated");
  };

  const handleSave = () => {
    alert("Save functionality not implemented");
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        employeeId: item.employeeId,
        employeeName: item.employeeName,
        department: item.department,
        designation: item.designation,
        date: item.date,
        inTime: item.inTime,
        outTime: item.outTime,
        status: item.status,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (
      !editForm.employeeId.trim() ||
      !editForm.employeeName.trim() ||
      !editForm.department.trim() ||
      !editForm.designation.trim() ||
      !editForm.date ||
      !editForm.inTime ||
      !editForm.outTime
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
                employeeName: editForm.employeeName.trim(),
                department: editForm.department,
                designation: editForm.designation,
                date: editForm.date,
                inTime: editForm.inTime,
                outTime: editForm.outTime,
                status: editForm.status,
              }
            : item
        )
      );
      setEditId(null);
      setIsEditModalOpen(false);
    }
  };

  // Cancel editing modal
  const handleEditCancel = () => {
    setEditId(null);
    setIsEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Attendance</h1>

      {/* Filters Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end"
        >
          {/* Department */}
          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium mb-1"
            >
              Department
            </label>
            <select
              id="department"
              name="department"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium mb-1"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Employee Name/ID Search */}
          <div>
            <label
              htmlFor="employeeSearch"
              className="block text-sm font-medium mb-1"
            >
              Employee Name/ID
            </label>
            <input
              type="text"
              id="employeeSearch"
              name="employeeSearch"
              placeholder="Search by name or ID"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={searchEmployee}
              onChange={(e) => setSearchEmployee(e.target.value)}
            />
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium mb-1"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-search fa-light" aria-hidden="true"></i> Search
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-undo fa-light" aria-hidden="true"></i> Reset
            </button>
          </div>
        </form>
      </section>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 mb-6">
        <button
          onClick={handleReport}
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
          type="button"
        >
          <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
        </button>
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
          type="button"
        >
          <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
        </button>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
          type="button"
        >
          <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
        </button>
      </div>

      {/* Attendance Table */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Employee ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Employee Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Designation
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  In Time
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Out Time
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
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.employeeId}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.employeeName}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.department}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.designation}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.date}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.inTime}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.outTime}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          item.status === "Present"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : item.status === "Absent"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm space-x-3">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-primary hover:text-primary/80 transition-colors"
                        aria-label={`Edit attendance record ${item.employeeName}`}
                        type="button"
                      >
                        <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
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
              Edit Attendance
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

              {/* Employee Name */}
              <div>
                <label
                  htmlFor="editEmployeeName"
                  className="block text-sm font-medium mb-1"
                >
                  Employee Name
                </label>
                <input
                  type="text"
                  id="editEmployeeName"
                  name="employeeName"
                  value={editForm.employeeName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter employee name"
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
                    .filter((d) => d !== "All Departments")
                    .map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                </select>
              </div>

              {/* Designation */}
              <div>
                <label
                  htmlFor="editDesignation"
                  className="block text-sm font-medium mb-1"
                >
                  Designation
                </label>
                <input
                  type="text"
                  id="editDesignation"
                  name="designation"
                  value={editForm.designation}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter designation"
                />
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

              {/* In Time */}
              <div>
                <label
                  htmlFor="editInTime"
                  className="block text-sm font-medium mb-1"
                >
                  In Time
                </label>
                <input
                  type="time"
                  id="editInTime"
                  name="inTime"
                  value={editForm.inTime}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Out Time */}
              <div>
                <label
                  htmlFor="editOutTime"
                  className="block text-sm font-medium mb-1"
                >
                  Out Time
                </label>
                <input
                  type="time"
                  id="editOutTime"
                  name="outTime"
                  value={editForm.outTime}
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
                    .filter((s) => s !== "All Status")
                    .map((status) => (
                      <option key={status} value={status}>
                        {status}
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