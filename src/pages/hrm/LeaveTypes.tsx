import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

interface LeaveType {
  id: number;
  leaveType: string;
  days: number;
  status: "Active" | "Inactive";
}

const LeaveTypes: React.FC = () => {
  // Page title as per reference page
  useEffect(() => {
    // No action needed
  }, []);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // State for form inputs
  const [leaveType, setLeaveType] = useState("");
  const [days, setDays] = useState("");
  const [status, setStatus] = useState("Active");

  // State for leave types list (from API)
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);

  // State for editing
  const [editingId, setEditingId] = useState<number | null>(null);

  // State for API data loading and error
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for modal editing
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    leaveType: "",
    days: "",
    status: "Active",
  });

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("LeaveTypes");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
      setLeaveTypes(response.result);
      setCurrentPage(1);
      setEditingId(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Pagination calculations
  const paginatedData = leaveTypes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const resetForm = () => {
    setLeaveType("");
    setDays("");
    setStatus("Active");
    setEditingId(null);
  };

  const handleSave = () => {
    if (!leaveType.trim()) {
      alert("Please enter Leave Type");
      return;
    }
    if (!days.trim() || isNaN(Number(days)) || Number(days) < 0) {
      alert("Please enter valid Days");
      return;
    }

    if (editingId !== null) {
      // Update existing
      setLeaveTypes((prev) =>
        prev.map((lt) =>
          lt.id === editingId
            ? { ...lt, leaveType: leaveType.trim(), days: Number(days), status: status as "Active" | "Inactive" }
            : lt
        )
      );
    } else {
      // Add new
      const newId =
        leaveTypes.length > 0
          ? Math.max(...leaveTypes.map((lt) => lt.id)) + 1
          : 1;
      setLeaveTypes((prev) => [
        ...prev,
        { id: newId, leaveType: leaveType.trim(), days: Number(days), status: status as "Active" | "Inactive" },
      ]);
      // If new page needed, move to last page
      if ((leaveTypes.length + 1) > itemsPerPage * Math.ceil(leaveTypes.length / itemsPerPage)) {
        setCurrentPage(Math.ceil((leaveTypes.length + 1) / itemsPerPage));
      }
    }
    resetForm();
  };

  const handleEdit = (id: number) => {
    const lt = leaveTypes.find((l) => l.id === id);
    if (lt) {
      setEditForm({
        leaveType: lt.leaveType,
        days: String(lt.days),
        status: lt.status,
      });
      setEditingId(id);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this leave type?")) {
      setLeaveTypes((prev) => prev.filter((lt) => lt.id !== id));
      // Adjust page if needed
      if (
        currentPage > 1 &&
        (leaveTypes.length - 1) <= itemsPerPage * (currentPage - 1)
      ) {
        setCurrentPage(currentPage - 1);
      }
      if (editingId === id) resetForm();
    }
  };

  const handleClear = () => {
    resetForm();
    setCurrentPage(1);
  };

  const handleReport = () => {
    // For demonstration, just alert JSON data
    alert("Leave Types Report:\n" + JSON.stringify(leaveTypes, null, 2));
  };

  const handleEditSave = () => {
    if (!editForm.leaveType.trim()) {
      alert("Please enter Leave Type");
      return;
    }
    if (!editForm.days.trim() || isNaN(Number(editForm.days)) || Number(editForm.days) < 0) {
      alert("Please enter valid Days");
      return;
    }

    if (editingId !== null) {
      // Update existing
      setLeaveTypes((prev) =>
        prev.map((lt) =>
          lt.id === editingId
            ? { ...lt, leaveType: editForm.leaveType.trim(), days: Number(editForm.days), status: editForm.status as "Active" | "Inactive" }
            : lt
        )
      );
      setEditingId(null);
      setIsEditModalOpen(false);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setIsEditModalOpen(false);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6">Leave Types</h1>

      {/* Form Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Leave Type */}
          <div>
            <label
              htmlFor="leaveType"
              className="block text-sm font-medium mb-1"
            >
              Leave Type
            </label>
            <input
              type="text"
              id="leaveType"
              name="leaveType"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter leave type"
            />
          </div>

          {/* Days */}
          <div>
            <label htmlFor="days" className="block text-sm font-medium mb-1">
              Days
            </label>
            <input
              type="number"
              id="days"
              name="days"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              min={0}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter number of days"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
          </button>

          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
          </button>

          <button
            onClick={handleReport}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
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
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Leave Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Days
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
                    colSpan={5}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No leave types found.
                  </td>
                </tr>
              )}
              {paginatedData.map(({ id, leaveType, days, status }, idx) => (
                <tr
                  key={id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{leaveType}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{days}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${status === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit leave type ${leaveType}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete leave type ${leaveType}`}
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
          totalItems={leaveTypes.length}
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
              Edit Leave Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Leave Type */}
              <div>
                <label
                  htmlFor="editLeaveType"
                  className="block text-sm font-medium mb-1"
                >
                  Leave Type
                </label>
                <input
                  type="text"
                  id="editLeaveType"
                  name="leaveType"
                  value={editForm.leaveType}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter leave type"
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
                  placeholder="Enter number of days"
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
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
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
};

export default LeaveTypes;