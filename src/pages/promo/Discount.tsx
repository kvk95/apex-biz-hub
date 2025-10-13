import { apiService } from "@/services/ApiService";
import React, { useEffect, useState } from "react";

const discountTypes = ["Percentage", "Fixed"];
const statusOptions = ["Active", "Inactive"];

export default function Discount() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form state
  const [form, setForm] = useState({
    discountName: "",
    discountType: discountTypes[0],
    discountValue: "",
    startDate: "",
    endDate: "",
    status: statusOptions[0],
  });

  // Data state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editing state
  const [editId, setEditId] = useState<number | null>(null);

  // Pagination calculations
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    document.title = "Discount - Dreams POS";
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Discount");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Validate required fields (discountName, discountValue, dates)
    if (
      !form.discountName.trim() ||
      !form.discountValue ||
      !form.startDate ||
      !form.endDate
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      // Edit existing
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                discountName: form.discountName.trim(),
                discountType: form.discountType,
                discountValue: Number(form.discountValue),
                startDate: form.startDate,
                endDate: form.endDate,
                status: form.status,
              }
            : item
        )
      );
      setEditId(null);
    } else {
      // Add new
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [
        ...prev,
        {
          id: newId,
          discountName: form.discountName.trim(),
          discountType: form.discountType,
          discountValue: Number(form.discountValue),
          startDate: form.startDate,
          endDate: form.endDate,
          status: form.status,
        },
      ]);
    }
    setForm({
      discountName: "",
      discountType: discountTypes[0],
      discountValue: "",
      startDate: "",
      endDate: "",
      status: statusOptions[0],
    });
  };

  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setForm({
        discountName: item.discountName,
        discountType: item.discountType,
        discountValue: item.discountValue.toString(),
        startDate: item.startDate,
        endDate: item.endDate,
        status: item.status,
      });
      setEditId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this discount?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      // If deleting last item on page, go to previous page if needed
      if (
        (currentPage - 1) * itemsPerPage >= data.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleRefresh = () => {
    loadData();
    setForm({
      discountName: "",
      discountType: discountTypes[0],
      discountValue: "",
      startDate: "",
      endDate: "",
      status: statusOptions[0],
    });
    setEditId(null);
    setCurrentPage(1);
  };

  const handleReport = () => {
    // For demo, just alert JSON data
    alert("Report Data:\n" + JSON.stringify(data, null, 2));
  };

  // Pagination controls
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Title as per reference page
  useEffect(() => {
    document.title = "Discount - Dreams POS";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 p-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Discount</h1>

      {/* Form Section */}
      <section className="bg-white rounded shadow p-6 mb-6">
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
              id="discountName"
              name="discountName"
              value={form.discountName}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter discount name"
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
              id="discountType"
              name="discountType"
              value={form.discountType}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {discountTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Discount Value */}
          <div>
            <label
              htmlFor="discountValue"
              className="block text-sm font-medium mb-1"
            >
              Discount Value
            </label>
            <input
              type="number"
              id="discountValue"
              name="discountValue"
              value={form.discountValue}
              onChange={handleInputChange}
              min={0}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter discount value"
            />
          </div>

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
              id="startDate"
              name="startDate"
              value={form.startDate}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={form.endDate}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="button"
          >
            <i className="fa fa-save" aria-hidden="true"></i> Save
          </button>

          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
            type="button"
          >
            <i className="fa fa-refresh" aria-hidden="true"></i> Refresh
          </button>

          <button
            onClick={handleReport}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-green-500"
            type="button"
          >
            <i className="fa fa-file-text-o" aria-hidden="true"></i> Report
          </button>
        </div>
      </section>

      {/* Table Section */}
      <section className="bg-white rounded shadow p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="border border-indigo-700 px-4 py-2 text-left text-sm font-semibold">
                  #
                </th>
                <th className="border border-indigo-700 px-4 py-2 text-left text-sm font-semibold">
                  Discount Name
                </th>
                <th className="border border-indigo-700 px-4 py-2 text-left text-sm font-semibold">
                  Discount Type
                </th>
                <th className="border border-indigo-700 px-4 py-2 text-left text-sm font-semibold">
                  Discount Value
                </th>
                <th className="border border-indigo-700 px-4 py-2 text-left text-sm font-semibold">
                  Start Date
                </th>
                <th className="border border-indigo-700 px-4 py-2 text-left text-sm font-semibold">
                  End Date
                </th>
                <th className="border border-indigo-700 px-4 py-2 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="border border-indigo-700 px-4 py-2 text-center text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center px-4 py-6 text-gray-500 italic"
                  >
                    No discounts found.
                  </td>
                </tr>
              )}
              {paginatedData.map((item, idx) => (
                <tr
                  key={item.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {item.discountName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {item.discountType}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {item.discountType === "Percentage"
                      ? `${item.discountValue}%`
                      : `$${item.discountValue}`}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {item.startDate}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {item.endDate}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        item.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="text-indigo-600 hover:text-indigo-800"
                      aria-label={`Edit discount ${item.discountName}`}
                      type="button"
                    >
                      <i className="fa fa-pencil" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800"
                      aria-label={`Delete discount ${item.discountName}`}
                      type="button"
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
          className="flex justify-between items-center mt-6"
          aria-label="Pagination"
        >
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`inline-flex items-center px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed`}
            type="button"
            aria-label="Previous page"
          >
            <i className="fa fa-chevron-left mr-1" aria-hidden="true"></i> Prev
          </button>

          <ul className="inline-flex -space-x-px">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page}>
                <button
                  onClick={() => goToPage(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`px-3 py-1.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    page === currentPage
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  type="button"
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`inline-flex items-center px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed`}
            type="button"
            aria-label="Next page"
          >
            Next <i className="fa fa-chevron-right ml-1" aria-hidden="true"></i>
          </button>
        </nav>
      </section>
    </div>
  );
}
