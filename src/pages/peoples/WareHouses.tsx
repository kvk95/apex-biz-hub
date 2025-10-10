import React, { useState, useMemo } from "react";

const warehousesData = [
  {
    id: 1,
    warehouseName: "Main Warehouse",
    warehouseCode: "WH001",
    warehousePhone: "+1 234 567 890",
    warehouseEmail: "main@warehouse.com",
    warehouseAddress: "123 Main St, Cityville",
    warehouseStatus: "Active",
  },
  {
    id: 2,
    warehouseName: "Secondary Warehouse",
    warehouseCode: "WH002",
    warehousePhone: "+1 987 654 321",
    warehouseEmail: "secondary@warehouse.com",
    warehouseAddress: "456 Side St, Townsville",
    warehouseStatus: "Inactive",
  },
  {
    id: 3,
    warehouseName: "East Warehouse",
    warehouseCode: "WH003",
    warehousePhone: "+1 555 444 333",
    warehouseEmail: "east@warehouse.com",
    warehouseAddress: "789 East Rd, East City",
    warehouseStatus: "Active",
  },
  {
    id: 4,
    warehouseName: "West Warehouse",
    warehouseCode: "WH004",
    warehousePhone: "+1 222 333 444",
    warehouseEmail: "west@warehouse.com",
    warehouseAddress: "321 West Blvd, West Town",
    warehouseStatus: "Active",
  },
  {
    id: 5,
    warehouseName: "North Warehouse",
    warehouseCode: "WH005",
    warehousePhone: "+1 111 222 333",
    warehouseEmail: "north@warehouse.com",
    warehouseAddress: "654 North Ave, North City",
    warehouseStatus: "Inactive",
  },
  {
    id: 6,
    warehouseName: "South Warehouse",
    warehouseCode: "WH006",
    warehousePhone: "+1 444 555 666",
    warehouseEmail: "south@warehouse.com",
    warehouseAddress: "987 South St, South Town",
    warehouseStatus: "Active",
  },
  {
    id: 7,
    warehouseName: "Central Warehouse",
    warehouseCode: "WH007",
    warehousePhone: "+1 777 888 999",
    warehouseEmail: "central@warehouse.com",
    warehouseAddress: "159 Central Pkwy, Central City",
    warehouseStatus: "Active",
  },
  {
    id: 8,
    warehouseName: "Backup Warehouse",
    warehouseCode: "WH008",
    warehousePhone: "+1 888 999 000",
    warehouseEmail: "backup@warehouse.com",
    warehouseAddress: "753 Backup Rd, Backup Town",
    warehouseStatus: "Inactive",
  },
  {
    id: 9,
    warehouseName: "Overflow Warehouse",
    warehouseCode: "WH009",
    warehousePhone: "+1 666 777 888",
    warehouseEmail: "overflow@warehouse.com",
    warehouseAddress: "852 Overflow Ln, Overflow City",
    warehouseStatus: "Active",
  },
  {
    id: 10,
    warehouseName: "Temporary Warehouse",
    warehouseCode: "WH010",
    warehousePhone: "+1 999 000 111",
    warehouseEmail: "temp@warehouse.com",
    warehouseAddress: "951 Temp St, Temp Town",
    warehouseStatus: "Inactive",
  },
];

const ITEMS_PER_PAGE = 5;

export default function Warehouses() {
  // Page title as per reference page
  React.useEffect(() => {
    document.title = "Warehouses - DreamsPOS";
  }, []);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // State for form inputs (Add / Edit)
  const [form, setForm] = useState({
    warehouseName: "",
    warehouseCode: "",
    warehousePhone: "",
    warehouseEmail: "",
    warehouseAddress: "",
    warehouseStatus: "Active",
  });

  // State to track if editing and which warehouse id
  const [editingId, setEditingId] = useState<number | null>(null);

  // State for warehouses list (initial data)
  const [warehouses, setWarehouses] = useState(warehousesData);

  // Pagination calculations
  const totalPages = Math.ceil(warehouses.length / ITEMS_PER_PAGE);

  // Get current page data
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return warehouses.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, warehouses]);

  // Handle form input changes
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  // Handle form submit (Add or Save Edit)
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId !== null) {
      // Save edit
      setWarehouses((prev) =>
        prev.map((w) =>
          w.id === editingId
            ? {
                ...w,
                warehouseName: form.warehouseName,
                warehouseCode: form.warehouseCode,
                warehousePhone: form.warehousePhone,
                warehouseEmail: form.warehouseEmail,
                warehouseAddress: form.warehouseAddress,
                warehouseStatus: form.warehouseStatus,
              }
            : w
        )
      );
      setEditingId(null);
    } else {
      // Add new warehouse
      const newWarehouse = {
        id: warehouses.length ? Math.max(...warehouses.map((w) => w.id)) + 1 : 1,
        warehouseName: form.warehouseName,
        warehouseCode: form.warehouseCode,
        warehousePhone: form.warehousePhone,
        warehouseEmail: form.warehouseEmail,
        warehouseAddress: form.warehouseAddress,
        warehouseStatus: form.warehouseStatus,
      };
      setWarehouses((prev) => [newWarehouse, ...prev]);
      setCurrentPage(1);
    }
    // Reset form
    setForm({
      warehouseName: "",
      warehouseCode: "",
      warehousePhone: "",
      warehouseEmail: "",
      warehouseAddress: "",
      warehouseStatus: "Active",
    });
  }

  // Handle edit button click
  function handleEdit(id: number) {
    const warehouse = warehouses.find((w) => w.id === id);
    if (!warehouse) return;
    setForm({
      warehouseName: warehouse.warehouseName,
      warehouseCode: warehouse.warehouseCode,
      warehousePhone: warehouse.warehousePhone,
      warehouseEmail: warehouse.warehouseEmail,
      warehouseAddress: warehouse.warehouseAddress,
      warehouseStatus: warehouse.warehouseStatus,
    });
    setEditingId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Handle delete button click
  function handleDelete(id: number) {
    if (window.confirm("Are you sure you want to delete this warehouse?")) {
      setWarehouses((prev) => prev.filter((w) => w.id !== id));
      // Adjust page if deleting last item on last page
      if ((warehouses.length - 1) % ITEMS_PER_PAGE === 0 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      }
    }
  }

  // Handle refresh button (resets data and form)
  function handleRefresh() {
    setWarehouses(warehousesData);
    setForm({
      warehouseName: "",
      warehouseCode: "",
      warehousePhone: "",
      warehouseEmail: "",
      warehouseAddress: "",
      warehouseStatus: "Active",
    });
    setEditingId(null);
    setCurrentPage(1);
  }

  // Handle report button (simulate report generation)
  function handleReport() {
    alert("Report generation is not implemented in this demo.");
  }

  // Pagination button handlers
  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <h1 className="text-3xl font-semibold mb-6">Warehouses</h1>

        {/* Form Section */}
        <section className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Warehouse" : "Add Warehouse"}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Warehouse Name */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <label htmlFor="warehouseName" className="w-full sm:w-48 font-medium text-gray-700">
                Warehouse Name <span className="text-red-600">*</span>
              </label>
              <input
                id="warehouseName"
                name="warehouseName"
                type="text"
                required
                value={form.warehouseName}
                onChange={handleChange}
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter warehouse name"
              />
            </div>

            {/* Warehouse Code */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <label htmlFor="warehouseCode" className="w-full sm:w-48 font-medium text-gray-700">
                Warehouse Code <span className="text-red-600">*</span>
              </label>
              <input
                id="warehouseCode"
                name="warehouseCode"
                type="text"
                required
                value={form.warehouseCode}
                onChange={handleChange}
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter warehouse code"
              />
            </div>

            {/* Warehouse Phone */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <label htmlFor="warehousePhone" className="w-full sm:w-48 font-medium text-gray-700">
                Warehouse Phone
              </label>
              <input
                id="warehousePhone"
                name="warehousePhone"
                type="tel"
                value={form.warehousePhone}
                onChange={handleChange}
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter phone number"
              />
            </div>

            {/* Warehouse Email */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <label htmlFor="warehouseEmail" className="w-full sm:w-48 font-medium text-gray-700">
                Warehouse Email
              </label>
              <input
                id="warehouseEmail"
                name="warehouseEmail"
                type="email"
                value={form.warehouseEmail}
                onChange={handleChange}
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter email address"
              />
            </div>

            {/* Warehouse Address */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
              <label htmlFor="warehouseAddress" className="w-full sm:w-48 font-medium text-gray-700 pt-2 sm:pt-1">
                Warehouse Address
              </label>
              <textarea
                id="warehouseAddress"
                name="warehouseAddress"
                rows={3}
                value={form.warehouseAddress}
                onChange={handleChange}
                className="flex-1 border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter address"
              />
            </div>

            {/* Warehouse Status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <label htmlFor="warehouseStatus" className="w-full sm:w-48 font-medium text-gray-700">
                Warehouse Status
              </label>
              <select
                id="warehouseStatus"
                name="warehouseStatus"
                value={form.warehouseStatus}
                onChange={handleChange}
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {editingId ? "Save" : "Add"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({
                      warehouseName: "",
                      warehouseCode: "",
                      warehousePhone: "",
                      warehouseEmail: "",
                      warehouseAddress: "",
                      warehouseStatus: "Active",
                    });
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={handleRefresh}
                className="ml-auto bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-400"
                title="Refresh Data"
              >
                Refresh
              </button>
              <button
                type="button"
                onClick={handleReport}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-green-500"
                title="Generate Report"
              >
                Report
              </button>
            </div>
          </form>
        </section>

        {/* Table Section */}
        <section className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Warehouse List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    #
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Warehouse Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Code
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Phone
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Email
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Address
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="border border-gray-300 px-4 py-6 text-center text-gray-500"
                    >
                      No warehouses found.
                    </td>
                  </tr>
                ) : (
                  currentData.map((w, idx) => (
                    <tr
                      key={w.id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {w.warehouseName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {w.warehouseCode}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {w.warehousePhone}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {w.warehouseEmail}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {w.warehouseAddress}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            w.warehouseStatus === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {w.warehouseStatus}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                        <button
                          onClick={() => handleEdit(w.id)}
                          title="Edit"
                          className="inline-block text-indigo-600 hover:text-indigo-900 focus:outline-none"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 inline"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11 5h6m-6 0a2 2 0 012 2v6m-2-6v6m0 0H7m4 0l-4 4m0 0v-4m0 4h4"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(w.id)}
                          title="Delete"
                          className="inline-block text-red-600 hover:text-red-900 focus:outline-none"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 inline"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav
            className="flex items-center justify-between mt-6"
            aria-label="Pagination"
          >
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </button>
            <ul className="inline-flex -space-x-px text-sm font-medium">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page}>
                  <button
                    onClick={() => goToPage(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`px-3 py-1 border border-gray-300 rounded-l-md rounded-r-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      page === currentPage
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Next
            </button>
          </nav>
        </section>
      </div>
    </div>
  );
}