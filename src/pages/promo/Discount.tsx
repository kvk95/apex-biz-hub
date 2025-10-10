import React, { useState, useEffect } from "react";

const discountData = [
  {
    id: 1,
    discountName: "Summer Sale",
    discountType: "Percentage",
    discountAmount: "15",
    startDate: "2023-06-01",
    endDate: "2023-06-30",
    status: "Active",
  },
  {
    id: 2,
    discountName: "Winter Offer",
    discountType: "Fixed",
    discountAmount: "50",
    startDate: "2023-12-01",
    endDate: "2023-12-31",
    status: "Inactive",
  },
  {
    id: 3,
    discountName: "Black Friday",
    discountType: "Percentage",
    discountAmount: "25",
    startDate: "2023-11-24",
    endDate: "2023-11-24",
    status: "Active",
  },
  {
    id: 4,
    discountName: "New Year Deal",
    discountType: "Fixed",
    discountAmount: "30",
    startDate: "2024-01-01",
    endDate: "2024-01-10",
    status: "Active",
  },
  {
    id: 5,
    discountName: "Clearance",
    discountType: "Percentage",
    discountAmount: "40",
    startDate: "2023-09-01",
    endDate: "2023-09-15",
    status: "Inactive",
  },
  {
    id: 6,
    discountName: "Flash Sale",
    discountType: "Fixed",
    discountAmount: "20",
    startDate: "2023-08-15",
    endDate: "2023-08-16",
    status: "Active",
  },
  {
    id: 7,
    discountName: "Holiday Special",
    discountType: "Percentage",
    discountAmount: "10",
    startDate: "2023-12-20",
    endDate: "2023-12-27",
    status: "Active",
  },
  {
    id: 8,
    discountName: "Weekend Offer",
    discountType: "Fixed",
    discountAmount: "5",
    startDate: "2023-07-08",
    endDate: "2023-07-09",
    status: "Inactive",
  },
  {
    id: 9,
    discountName: "VIP Discount",
    discountType: "Percentage",
    discountAmount: "30",
    startDate: "2023-05-01",
    endDate: "2023-05-31",
    status: "Active",
  },
  {
    id: 10,
    discountName: "Special Promo",
    discountType: "Fixed",
    discountAmount: "15",
    startDate: "2023-10-01",
    endDate: "2023-10-15",
    status: "Inactive",
  },
  {
    id: 11,
    discountName: "Back to School",
    discountType: "Percentage",
    discountAmount: "20",
    startDate: "2023-08-20",
    endDate: "2023-09-05",
    status: "Active",
  },
  {
    id: 12,
    discountName: "Cyber Monday",
    discountType: "Percentage",
    discountAmount: "35",
    startDate: "2023-11-27",
    endDate: "2023-11-27",
    status: "Active",
  },
];

const discountTypes = ["Percentage", "Fixed"];
const statuses = ["Active", "Inactive"];

export default function Discount() {
  // Page title
  useEffect(() => {
    document.title = "Discount - Dreams POS";
  }, []);

  // Form state
  const [form, setForm] = useState({
    discountName: "",
    discountType: "Percentage",
    discountAmount: "",
    startDate: "",
    endDate: "",
    status: "Active",
  });

  // Data state and pagination
  const [data, setData] = useState(discountData);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Pagination states
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Paginated data slice
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (
      !form.discountName.trim() ||
      !form.discountAmount.trim() ||
      !form.startDate ||
      !form.endDate
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (editingId !== null) {
      // Update existing
      setData((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, ...form } : item
        )
      );
      setEditingId(null);
    } else {
      // Add new
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [...prev, { id: newId, ...form }]);
      // If new item added on last page, move to last page
      if (Math.ceil((data.length + 1) / itemsPerPage) > totalPages) {
        setCurrentPage(totalPages + 1);
      }
    }
    setForm({
      discountName: "",
      discountType: "Percentage",
      discountAmount: "",
      startDate: "",
      endDate: "",
      status: "Active",
    });
  };

  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setForm({
        discountName: item.discountName,
        discountType: item.discountType,
        discountAmount: item.discountAmount,
        startDate: item.startDate,
        endDate: item.endDate,
        status: item.status,
      });
      setEditingId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this discount?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      // Adjust current page if needed
      if (
        (data.length - 1) % itemsPerPage === 0 &&
        currentPage > 1 &&
        currentPage === totalPages
      ) {
        setCurrentPage(currentPage - 1);
      }
      if (editingId === id) {
        setEditingId(null);
        setForm({
          discountName: "",
          discountType: "Percentage",
          discountAmount: "",
          startDate: "",
          endDate: "",
          status: "Active",
        });
      }
    }
  };

  const handleRefresh = () => {
    setForm({
      discountName: "",
      discountType: "Percentage",
      discountAmount: "",
      startDate: "",
      endDate: "",
      status: "Active",
    });
    setEditingId(null);
  };

  const handleReport = () => {
    alert("Report functionality is not implemented in this demo.");
  };

  // Pagination navigation
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Discount</h1>

      {/* Form Section */}
      <section className="bg-white rounded shadow p-6 mb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-6"
          autoComplete="off"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Discount Name */}
            <div>
              <label
                htmlFor="discountName"
                className="block text-sm font-medium mb-1"
              >
                Discount Name
              </label>
              <input
                type="text"
                name="discountName"
                id="discountName"
                value={form.discountName}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Discount Name"
                required
              />
            </div>

            {/* Discount Type */}
            <div>
              <label
                htmlFor="discountType"
                className="block text-sm font-medium mb-1"
              >
                Discount Type
              </label>
              <select
                name="discountType"
                id="discountType"
                value={form.discountType}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {discountTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Discount Amount */}
            <div>
              <label
                htmlFor="discountAmount"
                className="block text-sm font-medium mb-1"
              >
                Discount Amount
              </label>
              <input
                type="number"
                name="discountAmount"
                id="discountAmount"
                value={form.discountAmount}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Discount Amount"
                min="0"
                step="any"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Start Date */}
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium mb-1"
              >
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                value={form.startDate}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium mb-1"
              >
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                id="endDate"
                value={form.endDate}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
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
                name="status"
                id="status"
                value={form.status}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <i className="fa fa-save" aria-hidden="true"></i>
              <span>Save</span>
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center space-x-2 rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <i className="fa fa-refresh" aria-hidden="true"></i>
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center space-x-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <i className="fa fa-file-text" aria-hidden="true"></i>
              <span>Report</span>
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-white rounded shadow p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">#</th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Discount Name
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Discount Type
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Discount Amount
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Start Date
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">End Date</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-4 text-center text-gray-500 italic"
                  >
                    No discounts found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td className="px-4 py-3">{item.discountName}</td>
                    <td className="px-4 py-3">{item.discountType}</td>
                    <td className="px-4 py-3">
                      {item.discountType === "Percentage"
                        ? `${item.discountAmount}%`
                        : `$${item.discountAmount}`}
                    </td>
                    <td className="px-4 py-3">{item.startDate}</td>
                    <td className="px-4 py-3">{item.endDate}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
                          item.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(item.id)}
                        title="Edit"
                        className="inline-flex items-center justify-center rounded bg-yellow-400 px-3 py-1 text-white hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      >
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        title="Delete"
                        className="inline-flex items-center justify-center rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <nav
          className="flex items-center justify-between border-t border-gray-200 px-4 py-3 mt-6"
          aria-label="Pagination"
        >
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
            <ul className="inline-flex -space-x-px rounded-md shadow-sm">
              <li>
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 ${
                    currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  aria-label="Previous"
                >
                  <i className="fa fa-angle-left" aria-hidden="true"></i>
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <li key={page}>
                    <button
                      onClick={() => goToPage(page)}
                      aria-current={page === currentPage ? "page" : undefined}
                      className={`relative inline-flex items-center border border-gray-300 px-4 py-2 text-sm font-medium focus:z-20 ${
                        page === currentPage
                          ? "z-10 bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
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
                  className={`relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 ${
                    currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  aria-label="Next"
                >
                  <i className="fa fa-angle-right" aria-hidden="true"></i>
                </button>
              </li>
            </ul>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:justify-end">
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, data.length)}
              </span>{" "}
              of <span className="font-medium">{data.length}</span> results
            </p>
          </div>
        </nav>
      </section>
    </div>
  );
}