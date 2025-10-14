import { apiService } from "@/services/ApiService";
import React, { useEffect, useState } from "react";
import { Pagination } from "@/components/Pagination/Pagination";

export default function Holidays() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [holidays, setHolidays] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [form, setForm] = useState({
    holidayName: "",
    holidayDate: "",
    day: "",
    description: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    holidayName: "",
    holidayDate: "",
    day: "",
    description: "",
  });

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Holidays");
    if (response.status.code === "S") {
      setData(response.result);
      setHolidays(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Calculate paginated data using Pagination component props
  const paginatedHolidays = holidays.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Update day automatically when holidayDate changes
  useEffect(() => {
    if (form.holidayDate) {
      const dateParts = form.holidayDate.split("-");
      if (dateParts.length === 3) {
        const dateObj = new Date(form.holidayDate);
        if (!isNaN(dateObj.getTime())) {
          const dayName = dateObj.toLocaleDateString("en-US", {
            weekday: "long",
          });
          setForm((f) => ({ ...f, day: dayName }));
        }
      }
    } else {
      setForm((f) => ({ ...f, day: "" }));
    }
  }, [form.holidayDate]);

  // Handlers
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleEditInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setEditForm((f) => ({ ...f, [name]: value }));
  }

  function handleSave() {
    if (
      !form.holidayName.trim() ||
      !form.holidayDate.trim() ||
      !form.day.trim()
    ) {
      alert("Please fill in Holiday Name, Date and Day.");
      return;
    }
    if (editId !== null) {
      // Edit existing
      setHolidays((prev) =>
        prev.map((h) =>
          h.id === editId
            ? {
                ...h,
                holidayName: form.holidayName,
                holidayDate: form.holidayDate,
                day: form.day,
                description: form.description,
              }
            : h
        )
      );
      setEditId(null);
    } else {
      // Add new
      const newId =
        holidays.length > 0 ? Math.max(...holidays.map((h) => h.id)) + 1 : 1;
      setHolidays((prev) => [
        ...prev,
        {
          id: newId,
          holidayName: form.holidayName,
          holidayDate: form.holidayDate,
          day: form.day,
          description: form.description,
        },
      ]);
    }
    setForm({ holidayName: "", holidayDate: "", day: "", description: "" });
  }

  function handleEdit(id: number) {
    const holiday = holidays.find((h) => h.id === id);
    if (holiday) {
      setEditForm({
        holidayName: holiday.holidayName,
        holidayDate: holiday.holidayDate,
        day: holiday.day,
        description: holiday.description,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  }

  function handleEditSave() {
    if (
      !editForm.holidayName.trim() ||
      !editForm.holidayDate.trim() ||
      !editForm.day.trim()
    ) {
      alert("Please fill in Holiday Name, Date and Day.");
      return;
    }
    if (editId !== null) {
      setHolidays((prev) =>
        prev.map((h) =>
          h.id === editId
            ? {
                ...h,
                holidayName: editForm.holidayName,
                holidayDate: editForm.holidayDate,
                day: editForm.day,
                description: editForm.description,
              }
            : h
        )
      );
      setEditId(null);
      setIsEditModalOpen(false);
    }
  }

  function handleEditCancel() {
    setEditId(null);
    setIsEditModalOpen(false);
  }

  function handleDelete(id: number) {
    if (window.confirm("Are you sure you want to delete this holiday?")) {
      setHolidays((prev) => prev.filter((h) => h.id !== id));
      if (editId === id) {
        setEditId(null);
        setForm({ holidayName: "", holidayDate: "", day: "", description: "" });
      }
      // If deleting last item on page, go to previous page if needed
      if (
        (currentPage - 1) * itemsPerPage >= holidays.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  }

  function handleClear() {
    setHolidays(data);
    setCurrentPage(1);
    setForm({ holidayName: "", holidayDate: "", day: "", description: "" });
    setEditId(null);
  }

  function handleReport() {
    alert(JSON.stringify(holidays, null, 2));
  }

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      <h1 className="text-2xl font-semibold mb-6">Holidays</h1>

      {/* Form Section (Add Section) - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Holiday Details</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div>
            <label
              htmlFor="holidayName"
              className="block text-sm font-medium mb-1"
            >
              Holiday Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="holidayName"
              name="holidayName"
              value={form.holidayName}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter holiday name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="holidayDate"
              className="block text-sm font-medium mb-1"
            >
              Holiday Date <span className="text-destructive">*</span>
            </label>
            <input
              type="date"
              id="holidayDate"
              name="holidayDate"
              value={form.holidayDate}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div>
            <label htmlFor="day" className="block text-sm font-medium mb-1">
              Day <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="day"
              name="day"
              value={form.day}
              readOnly
              className="w-full border border-input rounded bg-muted px-3 py-2 cursor-not-allowed"
              placeholder="Day auto-filled"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              rows={1}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Enter description"
            />
          </div>

          <div className="md:col-span-4 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
            </button>
          </div>
        </form>
      </section>

      {/* Holidays Table Section */}
      <section className="bg-card rounded shadow py-6">
        <h2 className="text-lg font-semibold mb-4 px-6">Holiday List</h2>
        <div className="overflow-x-auto px-6">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Holiday Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Holiday Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Day
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Description
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedHolidays.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No holidays found.
                  </td>
                </tr>
              )}
              {paginatedHolidays.map((holiday, idx) => (
                <tr
                  key={holiday.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {holiday.holidayName}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {holiday.holidayDate}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {holiday.day}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {holiday.description}
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(holiday.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit holiday ${holiday.holidayName}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(holiday.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete holiday ${holiday.holidayName}`}
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
          totalItems={holidays.length}
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
              Edit Holiday
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="editHolidayName"
                  className="block text-sm font-medium mb-1"
                >
                  Holiday Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="editHolidayName"
                  name="holidayName"
                  value={editForm.holidayName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter holiday name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="editHolidayDate"
                  className="block text-sm font-medium mb-1"
                >
                  Holiday Date <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  id="editHolidayDate"
                  name="holidayDate"
                  value={editForm.holidayDate}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="editDay"
                  className="block text-sm font-medium mb-1"
                >
                  Day <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="editDay"
                  name="day"
                  value={editForm.day}
                  readOnly
                  className="w-full border border-input rounded bg-muted px-3 py-2 cursor-not-allowed"
                  placeholder="Day auto-filled"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="editDescription"
                  className="block text-sm font-medium mb-1"
                >
                  Description
                </label>
                <textarea
                  id="editDescription"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditInputChange}
                  rows={1}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Enter description"
                />
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