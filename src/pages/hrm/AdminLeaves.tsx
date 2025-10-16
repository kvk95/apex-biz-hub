import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const leaveTypes = [
  "Casual Leave",
  "Sick Leave",
  "Earned Leave",
  "Maternity Leave",
  "Paternity Leave",
];

const statuses = ["All", "Approved", "Pending", "Rejected"];

export default function AdminLeaves() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("AdminLeaves");
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter and form state
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterLeaveType, setFilterLeaveType] = useState("All");
  const [searchName, setSearchName] = useState("");

  // Form inputs for Add Leave
  const [formData, setFormData] = useState({
    employeeName: "",
    leaveType: "",
    fromDate: "",
    toDate: "",
    noOfDays: "",
    reason: "",
    status: "Pending",
  });

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    employeeName: "",
    leaveType: "",
    fromDate: "",
    toDate: "",
    noOfDays: "",
    reason: "",
    status: "Pending",
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Filtered and searched data
  const filteredLeaves = useMemo(() => {
    return data.filter((leave: any) => {
      const statusMatch =
        filterStatus === "All" ? true : leave.status === filterStatus;
      const leaveTypeMatch =
        filterLeaveType === "All" ? true : leave.leaveType === filterLeaveType;
      const nameMatch = leave.employeeName
        .toLowerCase()
        .includes(searchName.toLowerCase());
      return statusMatch && leaveTypeMatch && nameMatch;
    });
  }, [filterStatus, filterLeaveType, searchName, data]);

  // Paginated data using Pagination component props
  const paginatedLeaves = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLeaves.slice(start, start + itemsPerPage);
  }, [filteredLeaves, currentPage, itemsPerPage]);

  // Handlers
  const handlePageChange = (page: number) => {
    if (page < 1 || page > Math.ceil(filteredLeaves.length / itemsPerPage))
      return;
    setCurrentPage(page);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleAddLeave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Leave request saved (mock)");
    setFormData({
      employeeName: "",
      leaveType: "",
      fromDate: "",
      toDate: "",
      noOfDays: "",
      reason: "",
      status: "Pending",
    });
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        employeeName: item.employeeName,
        leaveType: item.leaveType,
        fromDate: item.fromDate,
        toDate: item.toDate,
        noOfDays: item.noOfDays,
        reason: item.reason,
        status: item.status,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (
      !editForm.employeeName.trim() ||
      !editForm.leaveType ||
      !editForm.fromDate ||
      !editForm.toDate ||
      !editForm.noOfDays ||
      !editForm.reason
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
                employeeName: editForm.employeeName.trim(),
                leaveType: editForm.leaveType,
                fromDate: editForm.fromDate,
                toDate: editForm.toDate,
                noOfDays: editForm.noOfDays,
                reason: editForm.reason,
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

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setFilterStatus("All");
    setFilterLeaveType("All");
    setSearchName("");
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generated (mock)");
  };

  return (
    <> 
      <div className="min-h-screen bg-background">
        {/* Title */}
        <h1 className="text-lg font-semibold mb-6">Admin Leaves</h1>

        {/* Filters Section */}
        <section className="bg-card rounded shadow p-6 mb-6">
          <form className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div>
              <label
                htmlFor="filterStatus"
                className="block text-sm font-medium mb-1"
              >
                Leave Status
              </label>
              <select
                id="filterStatus"
                name="filterStatus"
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="filterLeaveType"
                className="block text-sm font-medium mb-1"
              >
                Leave Type
              </label>
              <select
                id="filterLeaveType"
                name="filterLeaveType"
                value={filterLeaveType}
                onChange={(e) => {
                  setFilterLeaveType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="All">All</option>
                {leaveTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="searchName"
                className="block text-sm font-medium mb-1"
              >
                Employee Name
              </label>
              <input
                type="text"
                id="searchName"
                name="searchName"
                value={searchName}
                onChange={(e) => {
                  setSearchName(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <button
                type="button"
                onClick={handleClear}
                className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-3 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
              </button>
            </div>
          </form>
        </section>

        {/* Leaves Table */}
        <section className="bg-card rounded shadow py-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                    Employee Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                    Leave Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                    From Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                    To Date
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground whitespace-nowrap">
                    No. of Days
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                    Reason
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedLeaves.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center px-4 py-6 text-muted-foreground italic"
                    >
                      No leaves found.
                    </td>
                  </tr>
                ) : (
                  paginatedLeaves.map((leave: any) => (
                    <tr
                      key={leave.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                        {leave.employeeName}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                        {leave.leaveType}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                        {leave.fromDate}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                        {leave.toDate}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-foreground whitespace-nowrap">
                        {leave.noOfDays}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                        {leave.reason}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            leave.status === "Approved"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : leave.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {leave.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm space-x-3 whitespace-nowrap">
                        <button
                          title="Edit"
                          className="text-primary hover:text-primary/80 transition-colors"
                          onClick={() => handleEdit(leave.id)}
                          type="button"
                        >
                          <i
                            className="fa fa-pencil fa-light"
                            aria-hidden="true"
                          ></i>
                        </button>
                        <button
                          title="Delete"
                          className="text-destructive hover:text-destructive/80 transition-colors"
                          onClick={() =>
                            alert(
                              `Delete leave for ${leave.employeeName} (mock action)`
                            )
                          }
                          type="button"
                        >
                          <i
                            className="fa fa-trash fa-light"
                            aria-hidden="true"
                          ></i>
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
            totalItems={filteredLeaves.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setItemsPerPage}
          />
        </section>

        {/* Add Leave Form - preserved exactly */}
        <section className="mt-10 bg-card rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Add Leave</h2>
          <form
            onSubmit={handleAddLeave}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div>
              <label
                htmlFor="employeeName"
                className="block text-sm font-medium mb-1"
              >
                Employee Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="employeeName"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                required
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter employee name"
              />
            </div>
            <div>
              <label
                htmlFor="leaveType"
                className="block text-sm font-medium mb-1"
              >
                Leave Type <span className="text-red-600">*</span>
              </label>
              <select
                id="leaveType"
                name="leaveType"
                value={formData.leaveType}
                onChange={handleInputChange}
                required
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select leave type</option>
                {leaveTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="fromDate"
                className="block text-sm font-medium mb-1"
              >
                From Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                id="fromDate"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleInputChange}
                required
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label
                htmlFor="toDate"
                className="block text-sm font-medium mb-1"
              >
                To Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                id="toDate"
                name="toDate"
                value={formData.toDate}
                onChange={handleInputChange}
                required
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label
                htmlFor="noOfDays"
                className="block text-sm font-medium mb-1"
              >
                No. of Days <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                id="noOfDays"
                name="noOfDays"
                min={1}
                value={formData.noOfDays}
                onChange={handleInputChange}
                required
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter number of days"
              />
            </div>
            <div className="md:col-span-3">
              <label
                htmlFor="reason"
                className="block text-sm font-medium mb-1"
              >
                Reason <span className="text-red-600">*</span>
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Enter reason for leave"
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-1"
              >
                Status <span className="text-red-600">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {statuses
                  .filter((s) => s !== "All")
                  .map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
              </select>
            </div>
            <div className="md:col-span-3 flex justify-end space-x-3 pt-4">
              <button
                type="reset"
                onClick={() =>
                  setFormData({
                    employeeName: "",
                    leaveType: "",
                    fromDate: "",
                    toDate: "",
                    noOfDays: "",
                    reason: "",
                    status: "Pending",
                  })
                }
                className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-5 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              >
                Reset
              </button>
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              >
                Save
              </button>
            </div>
          </form>
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
                    <option value="">Select leave type</option>
                    {leaveTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
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
                <div>
                  <label
                    htmlFor="editNoOfDays"
                    className="block text-sm font-medium mb-1"
                  >
                    No. of Days
                  </label>
                  <input
                    type="number"
                    id="editNoOfDays"
                    name="noOfDays"
                    min={1}
                    value={editForm.noOfDays}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter number of days"
                  />
                </div>
                <div className="md:col-span-3">
                  <label
                    htmlFor="editReason"
                    className="block text-sm font-medium mb-1"
                  >
                    Reason
                  </label>
                  <textarea
                    id="editReason"
                    name="reason"
                    value={editForm.reason}
                    onChange={handleEditInputChange}
                    rows={3}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="Enter reason for leave"
                  ></textarea>
                </div>
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
                      .filter((s) => s !== "All")
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
    </>
  );
}