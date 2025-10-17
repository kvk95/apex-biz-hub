import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const statusOptions = ["Active", "Inactive"];

export default function Shifts() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state for Add Section
  const [form, setForm] = useState({
    shiftName: "",
    startTime: "",
    endTime: "",
    status: statusOptions[0],
  });

  // Data state
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    shiftName: "",
    startTime: "",
    endTime: "",
    status: statusOptions[0],
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Shifts");
    if (response.status.code === "S") {
      setShifts(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  // Handlers for Add Section form inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Add Section (Add new shift)
  const handleSave = () => {
    if (!form.shiftName.trim() || !form.startTime || !form.endTime) {
      alert("Please fill all required fields.");
      return;
    }
    const newId = shifts.length ? Math.max(...shifts.map((s) => s.id)) + 1 : 1;
    setShifts((prev) => [
      ...prev,
      {
        id: newId,
        shiftName: form.shiftName.trim(),
        startTime: form.startTime,
        endTime: form.endTime,
        status: form.status,
      },
    ]);
    setForm({
      shiftName: "",
      startTime: "",
      endTime: "",
      status: statusOptions[0],
    });
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = shifts.find((s) => s.id === id);
    if (item) {
      setEditForm({
        shiftName: item.shiftName,
        startTime: item.startTime,
        endTime: item.endTime,
        status: item.status,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (
      !editForm.shiftName.trim() ||
      !editForm.startTime ||
      !editForm.endTime
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      setShifts((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                shiftName: editForm.shiftName.trim(),
                startTime: editForm.startTime,
                endTime: editForm.endTime,
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

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this shift?")) {
      setShifts((prev) => prev.filter((s) => s.id !== id));
      // If deleting last item on page, go to previous page if needed
      if (
        (currentPage - 1) * itemsPerPage >= shifts.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setForm({
      shiftName: "",
      startTime: "",
      endTime: "",
      status: statusOptions[0],
    });
    setEditId(null);
    setCurrentPage(1);
  };

  const handleReport = () => {
    // For demo, just alert JSON data
    alert("Report Data:\n" + JSON.stringify(shifts, null, 2));
  };

  // Calculate paginated data using Pagination component props
  const paginatedShifts = shifts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-lg font-semibold mb-6">Shifts</h1>

      {/* Form Section (Add Section) - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Shift Name */}
          <div>
            <label
              htmlFor="shiftName"
              className="block text-sm font-medium mb-1"
            >
              Shift Name
            </label>
            <input
              type="text"
              id="shiftName"
              name="shiftName"
              value={form.shiftName}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter shift name"
            />
          </div>

          {/* Start Time */}
          <div>
            <label
              htmlFor="startTime"
              className="block text-sm font-medium mb-1"
            >
              Start Time
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={form.startTime}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* End Time */}
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium mb-1">
              End Time
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={form.endTime}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              value={form.status}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
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
            <i className="fa fa-file-text fa-light" aria-hidden="true"></i>{" "}
            Report
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
                  Shift Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Start Time
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  End Time
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
              {paginatedShifts.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No shifts found.
                  </td>
                </tr>
              )}
              {paginatedShifts.map((shift, idx) => (
                <tr
                  key={shift.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors text-sm text-gray-500"
                >
                  <td className="px-4 py-2">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-4 py-2">{shift.shiftName}</td>
                  <td className="px-4 py-2">{shift.startTime}</td>
                  <td className="px-4 py-2">{shift.endTime}</td>
                  <td className="px-4 py-2 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        shift.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {shift.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center text-sm space-x-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(shift.id)}
                      aria-label={`Edit shift ${shift.shiftName}`}
                      className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1 "
                    >
                      <i className="fa fa-edit" aria-hidden="true"></i>
                      <span className="sr-only">Edit record</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(shift.id)}
                      aria-label={`Edit shift ${shift.shiftName}`}
                      className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1 "
                    >
                      <i
                        className="fa fa-trash-can-xmark"
                        aria-hidden="true"
                      ></i>
                      <span className="sr-only">Delete record</span>
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
          totalItems={shifts.length}
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
              Edit Shift
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shift Name */}
              <div>
                <label
                  htmlFor="editShiftName"
                  className="block text-sm font-medium mb-1"
                >
                  Shift Name
                </label>
                <input
                  type="text"
                  id="editShiftName"
                  name="shiftName"
                  value={editForm.shiftName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter shift name"
                />
              </div>

              {/* Start Time */}
              <div>
                <label
                  htmlFor="editStartTime"
                  className="block text-sm font-medium mb-1"
                >
                  Start Time
                </label>
                <input
                  type="time"
                  id="editStartTime"
                  name="startTime"
                  value={editForm.startTime}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* End Time */}
              <div>
                <label
                  htmlFor="editEndTime"
                  className="block text-sm font-medium mb-1"
                >
                  End Time
                </label>
                <input
                  type="time"
                  id="editEndTime"
                  name="endTime"
                  value={editForm.endTime}
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
                  {statusOptions.map((status) => (
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
