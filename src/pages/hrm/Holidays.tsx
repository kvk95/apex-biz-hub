import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import React, { useEffect, useState } from "react";

const pageSizeOptions = [5, 10, 15];

export default function Holidays() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Holidays");
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

  const [holidays, setHolidays] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [form, setForm] = useState({
    holidayName: "",
    holidayDate: "",
    day: "",
    description: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Calculate pagination
  const totalPages = Math.ceil(holidays.length / pageSize);
  const paginatedHolidays = holidays.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Update day automatically when holidayDate changes
  useEffect(() => {
    if (form.holidayDate) {
      const dateParts = form.holidayDate.split("-");
      if (dateParts.length === 3) {
        // Expecting yyyy-mm-dd format from input type=date
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
      setForm({
        holidayName: holiday.holidayName,
        holidayDate: holiday.holidayDate,
        day: holiday.day,
        description: holiday.description,
      });
      setEditId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleDelete(id: number) {
    if (window.confirm("Are you sure you want to delete this holiday?")) {
      setHolidays((prev) => prev.filter((h) => h.id !== id));
      if (editId === id) {
        setEditId(null);
        setForm({ holidayName: "", holidayDate: "", day: "", description: "" });
      }
    }
  }

  function handleRefresh() {
    setHolidays(data);
    setCurrentPage(1);
    setForm({ holidayName: "", holidayDate: "", day: "", description: "" });
    setEditId(null);
  }

  function handleReport() {
    // For demonstration, just alert JSON data
    alert(JSON.stringify(holidays, null, 2));
  }

  function changePage(newPage: number) {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <title>Holidays - Dreams POS</title>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-6 text-gray-900">Holidays</h1>

        {/* Form Section */}
        <section className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Holiday Details
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <div className="flex flex-col">
              <label
                htmlFor="holidayName"
                className="mb-1 font-medium text-gray-700"
              >
                Holiday Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="holidayName"
                name="holidayName"
                value={form.holidayName}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter holiday name"
                required
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="holidayDate"
                className="mb-1 font-medium text-gray-700"
              >
                Holiday Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                id="holidayDate"
                name="holidayDate"
                value={form.holidayDate}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="day"
                className="mb-1 font-medium text-gray-700"
              >
                Day <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="day"
                name="day"
                value={form.day}
                readOnly
                className="border border-gray-300 rounded bg-gray-100 px-3 py-2 cursor-not-allowed"
                placeholder="Day auto-filled"
                required
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="description"
                className="mb-1 font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleInputChange}
                rows={1}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Enter description"
              />
            </div>

            <div className="md:col-span-4 flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={handleRefresh}
                className="flex items-center space-x-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded shadow"
                title="Refresh"
              >
                <i className="fas fa-sync-alt"></i>
                <span>Refresh</span>
              </button>
              <button
                type="button"
                onClick={handleReport}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow"
                title="Report"
              >
                <i className="fas fa-file-alt"></i>
                <span>Report</span>
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
                title={editId !== null ? "Update Holiday" : "Save Holiday"}
              >
                <i className="fas fa-save"></i>
                <span>{editId !== null ? "Update" : "Save"}</span>
              </button>
            </div>
          </form>
        </section>

        {/* Holidays Table Section */}
        <section className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Holiday List</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 font-semibold">
                    #
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 font-semibold">
                    Holiday Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 font-semibold">
                    Holiday Date
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 font-semibold">
                    Day
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 font-semibold">
                    Description
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center text-gray-700 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedHolidays.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-4 text-gray-500 italic"
                    >
                      No holidays found.
                    </td>
                  </tr>
                ) : (
                  paginatedHolidays.map((holiday, idx) => (
                    <tr
                      key={holiday.id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="border border-gray-300 px-4 py-2">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {holiday.holidayName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {holiday.holidayDate}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {holiday.day}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {holiday.description}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                        <button
                          onClick={() => handleEdit(holiday.id)}
                          title="Edit"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(holiday.id)}
                          title="Delete"
                          className="text-red-600 hover:text-red-800"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-4 space-y-3 md:space-y-0">
            <div className="flex items-center space-x-2">
              <label
                htmlFor="pageSize"
                className="text-gray-700 font-medium select-none"
              >
                Rows per page:
              </label>
              <select
                id="pageSize"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <nav
              className="inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}
                aria-label="Previous"
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                const isActive = page === currentPage;
                return (
                  <button
                    key={page}
                    onClick={() => changePage(page)}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      isActive
                        ? "z-10 bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                  currentPage === totalPages || totalPages === 0
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
                aria-label="Next"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </nav>
          </div>
        </section>
      </div>
    </div>
  );
}