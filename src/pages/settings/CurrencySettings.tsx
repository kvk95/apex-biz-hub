import React, { useState, useMemo } from "react";

const currencyData = [
  {
    id: 1,
    currencyName: "US Dollar",
    currencyCode: "USD",
    currencySymbol: "$",
    currencyRate: "1.00",
    currencyStatus: "Active",
  },
  {
    id: 2,
    currencyName: "Euro",
    currencyCode: "EUR",
    currencySymbol: "€",
    currencyRate: "0.85",
    currencyStatus: "Active",
  },
  {
    id: 3,
    currencyName: "British Pound",
    currencyCode: "GBP",
    currencySymbol: "£",
    currencyRate: "0.75",
    currencyStatus: "Inactive",
  },
  {
    id: 4,
    currencyName: "Japanese Yen",
    currencyCode: "JPY",
    currencySymbol: "¥",
    currencyRate: "110.00",
    currencyStatus: "Active",
  },
  {
    id: 5,
    currencyName: "Canadian Dollar",
    currencyCode: "CAD",
    currencySymbol: "C$",
    currencyRate: "1.25",
    currencyStatus: "Active",
  },
  {
    id: 6,
    currencyName: "Australian Dollar",
    currencyCode: "AUD",
    currencySymbol: "A$",
    currencyRate: "1.30",
    currencyStatus: "Inactive",
  },
  {
    id: 7,
    currencyName: "Swiss Franc",
    currencyCode: "CHF",
    currencySymbol: "Fr",
    currencyRate: "0.92",
    currencyStatus: "Active",
  },
  {
    id: 8,
    currencyName: "Chinese Yuan",
    currencyCode: "CNY",
    currencySymbol: "¥",
    currencyRate: "6.45",
    currencyStatus: "Active",
  },
  {
    id: 9,
    currencyName: "Indian Rupee",
    currencyCode: "INR",
    currencySymbol: "₹",
    currencyRate: "74.00",
    currencyStatus: "Active",
  },
  {
    id: 10,
    currencyName: "South Korean Won",
    currencyCode: "KRW",
    currencySymbol: "₩",
    currencyRate: "1150.00",
    currencyStatus: "Inactive",
  },
  {
    id: 11,
    currencyName: "Brazilian Real",
    currencyCode: "BRL",
    currencySymbol: "R$",
    currencyRate: "5.20",
    currencyStatus: "Active",
  },
  {
    id: 12,
    currencyName: "Mexican Peso",
    currencyCode: "MXN",
    currencySymbol: "$",
    currencyRate: "20.00",
    currencyStatus: "Active",
  },
];

const PAGE_SIZE = 5;

export default function CurrencySettings() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Form state for Add/Edit
  const [form, setForm] = useState({
    currencyName: "",
    currencyCode: "",
    currencySymbol: "",
    currencyRate: "",
    currencyStatus: "Active",
  });

  // Editing mode state
  const [editingId, setEditingId] = useState<number | null>(null);

  // Data state (simulate dynamic data)
  const [data, setData] = useState(currencyData);

  // Pagination calculations
  const pageCount = Math.ceil(data.length / PAGE_SIZE);
  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return data.slice(start, start + PAGE_SIZE);
  }, [currentPage, data]);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = () => {
    if (
      !form.currencyName.trim() ||
      !form.currencyCode.trim() ||
      !form.currencySymbol.trim() ||
      !form.currencyRate.trim()
    )
      return;

    if (editingId !== null) {
      // Update existing
      setData((d) =>
        d.map((item) =>
          item.id === editingId
            ? {
                ...item,
                currencyName: form.currencyName,
                currencyCode: form.currencyCode,
                currencySymbol: form.currencySymbol,
                currencyRate: form.currencyRate,
                currencyStatus: form.currencyStatus,
              }
            : item
        )
      );
    } else {
      // Add new
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((d) => [
        ...d,
        {
          id: newId,
          currencyName: form.currencyName,
          currencyCode: form.currencyCode,
          currencySymbol: form.currencySymbol,
          currencyRate: form.currencyRate,
          currencyStatus: form.currencyStatus,
        },
      ]);
    }
    resetForm();
  };

  const resetForm = () => {
    setForm({
      currencyName: "",
      currencyCode: "",
      currencySymbol: "",
      currencyRate: "",
      currencyStatus: "Active",
    });
    setEditingId(null);
  };

  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (!item) return;
    setForm({
      currencyName: item.currencyName,
      currencyCode: item.currencyCode,
      currencySymbol: item.currencySymbol,
      currencyRate: item.currencyRate,
      currencyStatus: item.currencyStatus,
    });
    setEditingId(id);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this currency?")) return;
    setData((d) => d.filter((item) => item.id !== id));
    if (pagedData.length === 1 && currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
    if (editingId === id) {
      resetForm();
    }
  };

  const handleRefresh = () => {
    // Reset data to initial static data
    setData(currencyData);
    resetForm();
    setCurrentPage(1);
  };

  // Pagination buttons array
  const paginationButtons = [];
  for (let i = 1; i <= pageCount; i++) {
    paginationButtons.push(i);
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto p-6">
        {/* Title */}
        <h1 className="text-3xl font-semibold mb-6 text-gray-900">
          Currency Settings
        </h1>

        {/* Form Section */}
        <section className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Add / Edit Currency
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div>
              <label
                htmlFor="currencyName"
                className="block text-sm font-medium mb-1"
              >
                Currency Name
              </label>
              <input
                type="text"
                id="currencyName"
                name="currencyName"
                value={form.currencyName}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter currency name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="currencyCode"
                className="block text-sm font-medium mb-1"
              >
                Currency Code
              </label>
              <input
                type="text"
                id="currencyCode"
                name="currencyCode"
                value={form.currencyCode}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter currency code"
                maxLength={3}
                required
              />
            </div>

            <div>
              <label
                htmlFor="currencySymbol"
                className="block text-sm font-medium mb-1"
              >
                Currency Symbol
              </label>
              <input
                type="text"
                id="currencySymbol"
                name="currencySymbol"
                value={form.currencySymbol}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter currency symbol"
                maxLength={3}
                required
              />
            </div>

            <div>
              <label
                htmlFor="currencyRate"
                className="block text-sm font-medium mb-1"
              >
                Currency Rate
              </label>
              <input
                type="number"
                step="any"
                id="currencyRate"
                name="currencyRate"
                value={form.currencyRate}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter currency rate"
                required
              />
            </div>

            <div>
              <label
                htmlFor="currencyStatus"
                className="block text-sm font-medium mb-1"
              >
                Status
              </label>
              <select
                id="currencyStatus"
                name="currencyStatus"
                value={form.currencyStatus}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <div className="flex items-end space-x-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <i className="fa fa-save mr-2" aria-hidden="true"></i>
                {editingId !== null ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center px-5 py-2 border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <i className="fa fa-times mr-2" aria-hidden="true"></i>
                Cancel
              </button>
            </div>
          </form>
        </section>

        {/* Table Section */}
        <section className="bg-white rounded shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Currency List
            </h2>
            <div className="space-x-2">
              <button
                onClick={handleRefresh}
                title="Refresh"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <i className="fa fa-refresh mr-2" aria-hidden="true"></i> Refresh
              </button>
              <button
                onClick={() => window.print()}
                title="Print Report"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <i className="fa fa-file-pdf-o mr-2" aria-hidden="true"></i> Report
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                    Currency Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                    Currency Code
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                    Currency Symbol
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                    Currency Rate
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pagedData.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No currencies available.
                    </td>
                  </tr>
                )}
                {pagedData.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-r border-gray-300 text-sm">
                      {(currentPage - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300 text-sm">
                      {item.currencyName}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300 text-sm uppercase">
                      {item.currencyCode}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300 text-sm">
                      {item.currencySymbol}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300 text-sm">
                      {item.currencyRate}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          item.currencyStatus === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.currencyStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(item.id)}
                        title="Edit"
                        className="inline-flex items-center px-3 py-1 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        title="Delete"
                        className="inline-flex items-center px-3 py-1 border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
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
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`inline-flex items-center px-3 py-1 border rounded ${
                currentPage === 1
                  ? "border-gray-300 text-gray-400 cursor-not-allowed"
                  : "border-gray-400 text-gray-700 hover:bg-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              aria-label="Previous Page"
            >
              <i className="fa fa-chevron-left mr-1" aria-hidden="true"></i> Prev
            </button>

            <ul className="inline-flex space-x-1">
              {paginationButtons.map((page) => (
                <li key={page}>
                  <button
                    onClick={() => setCurrentPage(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      page === currentPage
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "border-gray-300 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
              disabled={currentPage === pageCount}
              className={`inline-flex items-center px-3 py-1 border rounded ${
                currentPage === pageCount
                  ? "border-gray-300 text-gray-400 cursor-not-allowed"
                  : "border-gray-400 text-gray-700 hover:bg-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              aria-label="Next Page"
            >
              Next <i className="fa fa-chevron-right ml-1" aria-hidden="true"></i>
            </button>
          </nav>
        </section>
      </div>
    </div>
  );
}