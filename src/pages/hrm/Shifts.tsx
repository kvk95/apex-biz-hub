import React, { useState, useEffect } from "react";

const shiftsData = [
  {
    id: 1,
    shiftName: "Morning Shift",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    status: "Active",
  },
  {
    id: 2,
    shiftName: "Evening Shift",
    startTime: "05:00 PM",
    endTime: "01:00 AM",
    status: "Inactive",
  },
  {
    id: 3,
    shiftName: "Night Shift",
    startTime: "01:00 AM",
    endTime: "09:00 AM",
    status: "Active",
  },
  {
    id: 4,
    shiftName: "Custom Shift 1",
    startTime: "10:00 AM",
    endTime: "06:00 PM",
    status: "Active",
  },
  {
    id: 5,
    shiftName: "Custom Shift 2",
    startTime: "06:00 PM",
    endTime: "02:00 AM",
    status: "Inactive",
  },
  {
    id: 6,
    shiftName: "Custom Shift 3",
    startTime: "02:00 AM",
    endTime: "10:00 AM",
    status: "Active",
  },
  {
    id: 7,
    shiftName: "Custom Shift 4",
    startTime: "08:00 AM",
    endTime: "04:00 PM",
    status: "Active",
  },
  {
    id: 8,
    shiftName: "Custom Shift 5",
    startTime: "04:00 PM",
    endTime: "12:00 AM",
    status: "Inactive",
  },
  {
    id: 9,
    shiftName: "Custom Shift 6",
    startTime: "12:00 AM",
    endTime: "08:00 AM",
    status: "Active",
  },
  {
    id: 10,
    shiftName: "Custom Shift 7",
    startTime: "07:00 AM",
    endTime: "03:00 PM",
    status: "Active",
  },
  {
    id: 11,
    shiftName: "Custom Shift 8",
    startTime: "03:00 PM",
    endTime: "11:00 PM",
    status: "Inactive",
  },
  {
    id: 12,
    shiftName: "Custom Shift 9",
    startTime: "11:00 PM",
    endTime: "07:00 AM",
    status: "Active",
  },
];

const pageSize = 5;

export default function Shifts() {
  // Page title as in reference page
  useEffect(() => {
    document.title = "Shifts - Dreams POS";
  }, []);

  // States for form fields
  const [shiftName, setShiftName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [status, setStatus] = useState("Active");

  // Edit mode states
  const [editId, setEditId] = useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Data state
  const [shifts, setShifts] = useState(shiftsData);

  // Pagination calculations
  const totalPages = Math.ceil(shifts.length / pageSize);
  const paginatedShifts = shifts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handlers
  const resetForm = () => {
    setShiftName("");
    setStartTime("");
    setEndTime("");
    setStatus("Active");
    setEditId(null);
  };

  const handleSave = () => {
    if (!shiftName.trim() || !startTime || !endTime) {
      alert("Please fill all fields.");
      return;
    }
    if (editId !== null) {
      // Update existing shift
      setShifts((prev) =>
        prev.map((s) =>
          s.id === editId
            ? { ...s, shiftName, startTime, endTime, status }
            : s
        )
      );
    } else {
      // Add new shift
      const newShift = {
        id: shifts.length ? Math.max(...shifts.map((s) => s.id)) + 1 : 1,
        shiftName,
        startTime,
        endTime,
        status,
      };
      setShifts((prev) => [...prev, newShift]);
      // If new shift added on last page, move to last page
      if (Math.ceil((shifts.length + 1) / pageSize) > totalPages) {
        setCurrentPage(totalPages + 1);
      }
    }
    resetForm();
  };

  const handleEdit = (id: number) => {
    const shift = shifts.find((s) => s.id === id);
    if (shift) {
      setShiftName(shift.shiftName);
      setStartTime(shift.startTime);
      setEndTime(shift.endTime);
      setStatus(shift.status);
      setEditId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this shift? This action cannot be undone."
      )
    ) {
      setShifts((prev) => prev.filter((s) => s.id !== id));
      // Adjust page if last item on page deleted
      if (
        (shifts.length - 1) % pageSize === 0 &&
        currentPage === totalPages &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleRefresh = () => {
    setShifts(shiftsData);
    resetForm();
    setCurrentPage(1);
  };

  const handleReport = () => {
    // For demonstration, just alert JSON of current shifts
    alert("Report Data:\n" + JSON.stringify(shifts, null, 2));
  };

  // Pagination controls
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold mb-6">Shifts</h1>

      {/* Shift Form Section */}
      <section className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add / Edit Shift</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-6"
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div>
              <label
                htmlFor="shiftName"
                className="block mb-1 font-medium text-gray-700"
              >
                Shift Name
              </label>
              <input
                id="shiftName"
                type="text"
                value={shiftName}
                onChange={(e) => setShiftName(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Shift Name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="startTime"
                className="block mb-1 font-medium text-gray-700"
              >
                Start Time
              </label>
              <input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="endTime"
                className="block mb-1 font-medium text-gray-700"
              >
                End Time
              </label>
              <input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="block mb-1 font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded transition"
            >
              <i className="fa fa-save" aria-hidden="true"></i>
              Save
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-5 py-2 rounded transition"
            >
              <i className="fa fa-times" aria-hidden="true"></i>
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2 rounded transition ml-auto"
            >
              <i className="fa fa-refresh" aria-hidden="true"></i>
              Refresh
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded transition"
            >
              <i className="fa fa-file-text" aria-hidden="true"></i>
              Report
            </button>
          </div>
        </form>
      </section>

      {/* Shifts Table Section */}
      <section className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Shifts List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3 border-b border-gray-300 text-sm font-semibold text-gray-700">
                  #
                </th>
                <th className="text-left px-4 py-3 border-b border-gray-300 text-sm font-semibold text-gray-700">
                  Shift Name
                </th>
                <th className="text-left px-4 py-3 border-b border-gray-300 text-sm font-semibold text-gray-700">
                  Start Time
                </th>
                <th className="text-left px-4 py-3 border-b border-gray-300 text-sm font-semibold text-gray-700">
                  End Time
                </th>
                <th className="text-left px-4 py-3 border-b border-gray-300 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-center px-4 py-3 border-b border-gray-300 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedShifts.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No shifts found.
                  </td>
                </tr>
              )}
              {paginatedShifts.map((shift, idx) => (
                <tr
                  key={shift.id}
                  className={
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }
                >
                  <td className="px-4 py-3 border-b border-gray-200 text-sm">
                    {(currentPage - 1) * pageSize + idx + 1}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200 text-sm">
                    {shift.shiftName}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200 text-sm">
                    {shift.startTime}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200 text-sm">
                    {shift.endTime}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        shift.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {shift.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200 text-sm text-center space-x-2">
                    <button
                      onClick={() => handleEdit(shift.id)}
                      title="Edit"
                      className="text-blue-600 hover:text-blue-800 transition"
                    >
                      <i className="fa fa-pencil" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(shift.id)}
                      title="Delete"
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <nav
          aria-label="Pagination"
          className="flex justify-between items-center mt-6"
        >
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-900">
              {Math.min(currentPage * pageSize, shifts.length)}
            </span>{" "}
            of <span className="font-semibold text-gray-900">{shifts.length}</span>{" "}
            results
          </div>
          <ul className="inline-flex items-center -space-x-px">
            <li>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Previous"
              >
                <i className="fa fa-chevron-left"></i>
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <li key={page}>
                  <button
                    onClick={() => goToPage(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`px-3 py-2 leading-tight border border-gray-300 ${
                      page === currentPage
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                </li>
              )
            )}
            <li>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Next"
              >
                <i className="fa fa-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </section>
    </div>
  );
}