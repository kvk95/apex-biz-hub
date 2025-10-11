import React, { useState, useMemo } from "react";

const customFieldsData = [
  {
    id: 1,
    name: "Color",
    type: "Dropdown",
    status: "Active",
    createdAt: "2023-05-01",
  },
  {
    id: 2,
    name: "Size",
    type: "Text",
    status: "Active",
    createdAt: "2023-05-02",
  },
  {
    id: 3,
    name: "Material",
    type: "Textarea",
    status: "Inactive",
    createdAt: "2023-05-03",
  },
  {
    id: 4,
    name: "Brand",
    type: "Dropdown",
    status: "Active",
    createdAt: "2023-05-04",
  },
  {
    id: 5,
    name: "Weight",
    type: "Text",
    status: "Active",
    createdAt: "2023-05-05",
  },
  {
    id: 6,
    name: "Warranty",
    type: "Dropdown",
    status: "Inactive",
    createdAt: "2023-05-06",
  },
  {
    id: 7,
    name: "Model Number",
    type: "Text",
    status: "Active",
    createdAt: "2023-05-07",
  },
  {
    id: 8,
    name: "Manufacturer",
    type: "Textarea",
    status: "Active",
    createdAt: "2023-05-08",
  },
  {
    id: 9,
    name: "Expiration Date",
    type: "Date",
    status: "Inactive",
    createdAt: "2023-05-09",
  },
  {
    id: 10,
    name: "Country of Origin",
    type: "Dropdown",
    status: "Active",
    createdAt: "2023-05-10",
  },
  {
    id: 11,
    name: "Custom Field 1",
    type: "Text",
    status: "Active",
    createdAt: "2023-05-11",
  },
  {
    id: 12,
    name: "Custom Field 2",
    type: "Textarea",
    status: "Inactive",
    createdAt: "2023-05-12",
  },
];

const ITEMS_PER_PAGE = 5;

export default function CustomFields() {
  const [fields, setFields] = useState(customFieldsData);
  const [currentPage, setCurrentPage] = useState(1);

  // Form state
  const [form, setForm] = useState({
    name: "",
    type: "Text",
    status: "Active",
  });

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);

  // Pagination calculations
  const pageCount = Math.ceil(fields.length / ITEMS_PER_PAGE);
  const paginatedFields = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return fields.slice(start, start + ITEMS_PER_PAGE);
  }, [fields, currentPage]);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!form.name.trim()) return;

    if (editingId !== null) {
      // Update existing
      setFields((prev) =>
        prev.map((f) =>
          f.id === editingId ? { ...f, ...form, createdAt: f.createdAt } : f
        )
      );
      setEditingId(null);
    } else {
      // Add new
      const newField = {
        id: fields.length ? Math.max(...fields.map((f) => f.id)) + 1 : 1,
        name: form.name.trim(),
        type: form.type,
        status: form.status,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setFields((prev) => [newField, ...prev]);
      setCurrentPage(1);
    }
    setForm({ name: "", type: "Text", status: "Active" });
  };

  const handleEdit = (id: number) => {
    const field = fields.find((f) => f.id === id);
    if (field) {
      setForm({
        name: field.name,
        type: field.type,
        status: field.status,
      });
      setEditingId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this custom field?")) {
      setFields((prev) => prev.filter((f) => f.id !== id));
      if (paginatedFields.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      }
    }
  };

  const handleRefresh = () => {
    setFields(customFieldsData);
    setCurrentPage(1);
    setForm({ name: "", type: "Text", status: "Active" });
    setEditingId(null);
  };

  const handleReport = () => {
    // For demonstration, just alert JSON data
    alert(JSON.stringify(fields, null, 2));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-6">
      <h1 className="text-3xl font-semibold mb-6">Custom Fields</h1>

      {/* Form Section */}
      <section className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add / Edit Custom Field</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <label htmlFor="name" className="font-medium">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleInputChange}
              className="col-span-2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter field name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <label htmlFor="type" className="font-medium">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleInputChange}
              className="col-span-2 border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Text</option>
              <option>Dropdown</option>
              <option>Textarea</option>
              <option>Date</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <label htmlFor="status" className="font-medium">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleInputChange}
              className="col-span-2 border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-400 rounded hover:bg-gray-100 transition"
              title="Refresh"
            >
              <i className="fas fa-sync-alt"></i>
              <span>Refresh</span>
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              title={editingId !== null ? "Update" : "Save"}
            >
              <i className="fas fa-save"></i>
              <span>{editingId !== null ? "Update" : "Save"}</span>
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-white rounded shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Custom Fields List</h2>
          <button
            onClick={handleReport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            title="Report"
          >
            <i className="fas fa-file-alt"></i>
            <span>Report</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
              <tr>
                <th className="px-4 py-3 border-b border-gray-300 text-left">#</th>
                <th className="px-4 py-3 border-b border-gray-300 text-left">Name</th>
                <th className="px-4 py-3 border-b border-gray-300 text-left">Type</th>
                <th className="px-4 py-3 border-b border-gray-300 text-left">Status</th>
                <th className="px-4 py-3 border-b border-gray-300 text-left">Created At</th>
                <th className="px-4 py-3 border-b border-gray-300 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFields.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No custom fields found.
                  </td>
                </tr>
              ) : (
                paginatedFields.map((field, idx) => (
                  <tr
                    key={field.id}
                    className="hover:bg-gray-50 even:bg-gray-50"
                  >
                    <td className="px-4 py-3 border-b border-gray-300">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                    <td className="px-4 py-3 border-b border-gray-300">{field.name}</td>
                    <td className="px-4 py-3 border-b border-gray-300">{field.type}</td>
                    <td className="px-4 py-3 border-b border-gray-300">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                          field.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {field.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-300">{field.createdAt}</td>
                    <td className="px-4 py-3 border-b border-gray-300 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(field.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(field.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
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

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-semibold">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold">
              {Math.min(currentPage * ITEMS_PER_PAGE, fields.length)}
            </span>{" "}
            of <span className="font-semibold">{fields.length}</span> entries
          </div>
          <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
              aria-label="Previous"
              title="Previous"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                aria-current={page === currentPage ? "page" : undefined}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  page === currentPage
                    ? "z-10 bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
                title={`Page ${page}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, pageCount))}
              disabled={currentPage === pageCount}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                currentPage === pageCount ? "cursor-not-allowed opacity-50" : ""
              }`}
              aria-label="Next"
              title="Next"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </nav>
        </div>
      </section>
    </div>
  );
}