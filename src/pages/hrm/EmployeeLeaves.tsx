import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

type LeaveRecord = {
  id: number;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
};

const leaveTypes = [
  "Casual Leave",
  "Sick Leave",
  "Maternity Leave",
  "Paternity Leave",
  "Bereavement Leave",
  "Unpaid Leave",
];

const statuses = ["Pending", "Approved", "Rejected"];

const employees = [
  { id: "E001", name: "John Doe" },
  { id: "E002", name: "Jane Smith" },
  { id: "E003", name: "Michael Johnson" },
  { id: "E004", name: "Emily Davis" },
  { id: "E005", name: "William Brown" },
];

export default function EmployeeLeaves() {
  // Page title exactly as in reference page
  React.useEffect(() => {

  }, []);

  // Form state for filters and inputs
  const [form, setForm] = useState({
    employeeId: "",
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
    status: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [data, setData] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    employeeId: "",
    employeeName: "",
    leaveType: "",
    fromDate: "",
    toDate: "",
    days: 0,
    reason: "",
    status: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<LeaveRecord[]>("EmployeeLeaves");
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

  // Filtered data based on form inputs
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (form.employeeId && item.employeeId !== form.employeeId) return false;
      if (form.leaveType && item.leaveType !== form.leaveType) return false;
      if (form.status && item.status !== form.status) return false;
      if (form.fromDate && item.fromDate < form.fromDate) return false;
      if (form.toDate && item.toDate > form.toDate) return false;
      if (form.reason && !item.reason.toLowerCase().includes(form.reason.toLowerCase())) return false;
      return true;
    });
  }, [form, data]);

  // Pagination calculations
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setCurrentPage(1);
  };

  const handleClear = () => {
    setForm({
      employeeId: "",
      leaveType: "",
      fromDate: "",
      toDate: "",
      reason: "",
      status: "",
    });
    setCurrentPage(1);
  };

  // Save button handler (simulate save)
  const handleSave = () => {
    alert("Save functionality is not implemented but button is functional.");
  };

  // Report button handler (simulate report)
  const handleReport = () => {
    alert("Report functionality is not implemented but button is functional.");
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        employeeId: item.employeeId,
        employeeName: item.employeeName,
        leaveType: item.leaveType,
        fromDate: item.fromDate,
        toDate: item.toDate,
        days: item.days,
        reason: item.reason,
        status: item.status,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
              ...item,
              employeeId: editForm.employeeId,
              leaveType: editForm.leaveType,
              fromDate: editForm.fromDate,
              toDate: editForm.toDate,
              days: editForm.days,
              reason: editForm.reason,
              status: editForm.status as "Pending" | "Approved" | "Rejected",
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

  // Edit form input handlers
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Title */}
      <h1 className="text-lg font-semibold mb-6">Employee Leaves</h1>

      {/* Filter & Input Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4"
          aria-label="Employee Leaves Form"
        >
          {/* Employee ID */}
          <div className="flex flex-col">
            <label htmlFor="employeeId" className="mb-1 font-medium text-sm">
              Employee ID
            </label>
            <select
              id="employeeId"
              name="employeeId"
              value={form.employeeId}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.id} - {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Leave Type */}
          <div className="flex flex-col">
            <label htmlFor="leaveType" className="mb-1 font-medium text-sm">
              Leave Type
            </label>
            <select
              id="leaveType"
              name="leaveType"
              value={form.leaveType}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select Leave Type</option>
              {leaveTypes.map((lt) => (
                <option key={lt} value={lt}>
                  {lt}
                </option>
              ))}
            </select>
          </div>

          {/* From Date */}
          <div className="flex flex-col">
            <label htmlFor="fromDate" className="mb-1 font-medium text-sm">
              From Date
            </label>
            <input
              type="date"
              id="fromDate"
              name="fromDate"
              value={form.fromDate}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* To Date */}
          <div className="flex flex-col">
            <label htmlFor="toDate" className="mb-1 font-medium text-sm">
              To Date
            </label>
            <input
              type="date"
              id="toDate"
              name="toDate"
              value={form.toDate}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Reason */}
          <div className="flex flex-col">
            <label htmlFor="reason" className="mb-1 font-medium text-sm">
              Reason
            </label>
            <input
              type="text"
              id="reason"
              name="reason"
              placeholder="Enter reason"
              value={form.reason}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label htmlFor="status" className="mb-1 font-medium text-sm">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select Status</option>
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </form>

        {/* Buttons: Save, Clear, Report */}
        <div className="mt-6 flex space-x-4 justify-start">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Save Employee Leave"
          >
            <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Clear Form"
          >
            <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
          </button>
          <button
            type="button"
            onClick={handleReport}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Generate Report"
          >
            <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
          </button>
        </div>
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
                  Employee Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Leave Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  From Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  To Date
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Days
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Reason
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
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
                  <td colSpan={9} className="text-center px-4 py-6 text-muted-foreground italic">
                    No records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((leave) => (
                  <tr
                    key={leave.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {leave.employeeId}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {leave.employeeName}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {leave.leaveType}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {leave.fromDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {leave.toDate}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-foreground">
                      {leave.days}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {leave.reason}
                    </td>
                    <td className="px-4 py-3 text-center text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${leave.status === "Approved"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : leave.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm space-x-3">
                      <button
                        onClick={() => handleEdit(leave.id)}
                        className="text-primary hover:text-primary/80 transition-colors"
                        aria-label={`Edit leave ${leave.employeeName}`}
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
              Edit Leave
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
                <select
                  id="editEmployeeId"
                  name="employeeId"
                  value={editForm.employeeId}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.id} - {emp.name}
                    </option>
                  ))}
                </select>
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

              {/* Leave Type */}
              <div>
                <label
                  htmlFor="editLeaveType"
                  className="block text-sm font-medium mb-1"
                >
                  Leave Type
                </label>
                <select
                  id="editLeaveType"
                  name="leaveType"
                  value={editForm.leaveType}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {leaveTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* From Date */}
              <div>
                <label
                  htmlFor="editFromDate"
                  className="block text-sm font-medium mb-1"
                >
                  From Date
                </label>
                <input
                  type="date"
                  id="editFromDate"
                  name="fromDate"
                  value={editForm.fromDate}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* To Date */}
              <div>
                <label
                  htmlFor="editToDate"
                  className="block text-sm font-medium mb-1"
                >
                  To Date
                </label>
                <input
                  type="date"
                  id="editToDate"
                  name="toDate"
                  value={editForm.toDate}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Days */}
              <div>
                <label
                  htmlFor="editDays"
                  className="block text-sm font-medium mb-1"
                >
                  Days
                </label>
                <input
                  type="number"
                  id="editDays"
                  name="days"
                  value={editForm.days}
                  onChange={handleEditInputChange}
                  min={0}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter days"
                />
              </div>

              {/* Reason */}
              <div>
                <label
                  htmlFor="editReason"
                  className="block text-sm font-medium mb-1"
                >
                  Reason
                </label>
                <input
                  type="text"
                  id="editReason"
                  name="reason"
                  value={editForm.reason}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter reason"
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
                  {statuses.map((status) => (
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