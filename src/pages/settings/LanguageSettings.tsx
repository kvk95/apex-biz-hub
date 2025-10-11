import React, { useState, useEffect } from "react";

const languageData = [
  {
    id: 1,
    languageName: "English",
    languageCode: "en",
    languageFlag: "us",
    languageOrder: 1,
    languageStatus: "Active",
  },
  {
    id: 2,
    languageName: "Arabic",
    languageCode: "ar",
    languageFlag: "sa",
    languageOrder: 2,
    languageStatus: "Inactive",
  },
  {
    id: 3,
    languageName: "French",
    languageCode: "fr",
    languageFlag: "fr",
    languageOrder: 3,
    languageStatus: "Active",
  },
  {
    id: 4,
    languageName: "German",
    languageCode: "de",
    languageFlag: "de",
    languageOrder: 4,
    languageStatus: "Active",
  },
  {
    id: 5,
    languageName: "Spanish",
    languageCode: "es",
    languageFlag: "es",
    languageOrder: 5,
    languageStatus: "Inactive",
  },
  {
    id: 6,
    languageName: "Italian",
    languageCode: "it",
    languageFlag: "it",
    languageOrder: 6,
    languageStatus: "Active",
  },
  {
    id: 7,
    languageName: "Portuguese",
    languageCode: "pt",
    languageFlag: "pt",
    languageOrder: 7,
    languageStatus: "Active",
  },
  {
    id: 8,
    languageName: "Russian",
    languageCode: "ru",
    languageFlag: "ru",
    languageOrder: 8,
    languageStatus: "Inactive",
  },
  {
    id: 9,
    languageName: "Chinese",
    languageCode: "zh",
    languageFlag: "cn",
    languageOrder: 9,
    languageStatus: "Active",
  },
  {
    id: 10,
    languageName: "Japanese",
    languageCode: "ja",
    languageFlag: "jp",
    languageOrder: 10,
    languageStatus: "Inactive",
  },
  {
    id: 11,
    languageName: "Korean",
    languageCode: "ko",
    languageFlag: "kr",
    languageOrder: 11,
    languageStatus: "Active",
  },
  {
    id: 12,
    languageName: "Hindi",
    languageCode: "hi",
    languageFlag: "in",
    languageOrder: 12,
    languageStatus: "Active",
  },
];

const pageSize = 5;

const LanguageSettings: React.FC = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Form state
  const [form, setForm] = useState({
    languageName: "",
    languageCode: "",
    languageFlag: "",
    languageOrder: "",
    languageStatus: "Active",
  });

  // Data state (simulate editable data)
  const [data, setData] = useState(languageData);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Pagination calculations
  const totalPages = Math.ceil(data.length / pageSize);
  const pagedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Reset form
  const resetForm = () => {
    setForm({
      languageName: "",
      languageCode: "",
      languageFlag: "",
      languageOrder: "",
      languageStatus: "Active",
    });
    setIsEditing(false);
    setEditId(null);
  };

  // Save form (add or update)
  const handleSave = () => {
    if (
      !form.languageName.trim() ||
      !form.languageCode.trim() ||
      !form.languageFlag.trim() ||
      !form.languageOrder.trim()
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (isNaN(Number(form.languageOrder))) {
      alert("Language Order must be a number.");
      return;
    }

    if (isEditing && editId !== null) {
      // Update existing
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                languageName: form.languageName,
                languageCode: form.languageCode,
                languageFlag: form.languageFlag,
                languageOrder: Number(form.languageOrder),
                languageStatus: form.languageStatus,
              }
            : item
        )
      );
    } else {
      // Add new
      const newId = Math.max(...data.map((d) => d.id)) + 1;
      setData((prev) => [
        ...prev,
        {
          id: newId,
          languageName: form.languageName,
          languageCode: form.languageCode,
          languageFlag: form.languageFlag,
          languageOrder: Number(form.languageOrder),
          languageStatus: form.languageStatus,
        },
      ]);
    }
    resetForm();
  };

  // Edit row
  const handleEdit = (id: number) => {
    const lang = data.find((d) => d.id === id);
    if (!lang) return;
    setForm({
      languageName: lang.languageName,
      languageCode: lang.languageCode,
      languageFlag: lang.languageFlag,
      languageOrder: lang.languageOrder.toString(),
      languageStatus: lang.languageStatus,
    });
    setIsEditing(true);
    setEditId(id);
  };

  // Delete row
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this language?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      if (pagedData.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      }
      if (isEditing && editId === id) {
        resetForm();
      }
    }
  };

  // Refresh data (reset to original)
  const handleRefresh = () => {
    setData(languageData);
    resetForm();
    setCurrentPage(1);
  };

  // Report button (dummy functionality)
  const handleReport = () => {
    alert("Report generated (dummy action).");
  };

  // Pagination controls
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Flags map for FontAwesome flag icons (using country codes)
  // The reference page uses flags as images, here we use font awesome flags with country code suffixes.
  // FontAwesome uses "flag-icon-xx" classes, but since we must use <i> tags with font awesome icons,
  // we will use the "fa-flag-xx" style if available or fallback to generic flag icon.
  // Because FontAwesome does not have country flag icons by default, we will use generic flag icon and show country code text next to it.
  // This replicates the reference page's flag presence visually with a minimal approach.

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <title>Language Settings</title>

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Language Settings</h1>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <button
              onClick={handleReport}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded shadow"
              type="button"
              title="Report"
            >
              <i className="fa fa-file-pdf-o mr-2" aria-hidden="true"></i> Report
            </button>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded shadow"
              type="button"
              title="Refresh"
            >
              <i className="fa fa-refresh mr-2" aria-hidden="true"></i> Refresh
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Add / Edit Language</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="grid grid-cols-1 md:grid-cols-6 gap-4"
            noValidate
          >
            {/* Language Name */}
            <div className="md:col-span-2">
              <label
                htmlFor="languageName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Language Name
              </label>
              <input
                type="text"
                id="languageName"
                name="languageName"
                value={form.languageName}
                onChange={handleChange}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter language name"
                required
              />
            </div>

            {/* Language Code */}
            <div className="md:col-span-1">
              <label
                htmlFor="languageCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Language Code
              </label>
              <input
                type="text"
                id="languageCode"
                name="languageCode"
                value={form.languageCode}
                onChange={handleChange}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="e.g. en"
                maxLength={5}
                required
              />
            </div>

            {/* Language Flag */}
            <div className="md:col-span-1">
              <label
                htmlFor="languageFlag"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Language Flag
              </label>
              <input
                type="text"
                id="languageFlag"
                name="languageFlag"
                value={form.languageFlag}
                onChange={handleChange}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Country code (e.g. us)"
                maxLength={2}
                required
              />
            </div>

            {/* Language Order */}
            <div className="md:col-span-1">
              <label
                htmlFor="languageOrder"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Language Order
              </label>
              <input
                type="number"
                id="languageOrder"
                name="languageOrder"
                value={form.languageOrder}
                onChange={handleChange}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Order"
                min={1}
                required
              />
            </div>

            {/* Language Status */}
            <div className="md:col-span-1">
              <label
                htmlFor="languageStatus"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="languageStatus"
                name="languageStatus"
                value={form.languageStatus}
                onChange={handleChange}
                className="block w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="md:col-span-6 flex justify-end space-x-3 mt-2">
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <i className="fa fa-times mr-2" aria-hidden="true"></i> Cancel
                </button>
              )}
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow-sm text-sm font-medium"
              >
                <i className="fa fa-save mr-2" aria-hidden="true"></i> Save
              </button>
            </div>
          </form>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Language List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 border-b border-gray-300 w-12">#</th>
                  <th className="px-4 py-2 border-b border-gray-300">Language Name</th>
                  <th className="px-4 py-2 border-b border-gray-300">Language Code</th>
                  <th className="px-4 py-2 border-b border-gray-300">Language Flag</th>
                  <th className="px-4 py-2 border-b border-gray-300">Language Order</th>
                  <th className="px-4 py-2 border-b border-gray-300">Status</th>
                  <th className="px-4 py-2 border-b border-gray-300 w-28 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                      No languages found.
                    </td>
                  </tr>
                )}
                {pagedData.map((lang, idx) => (
                  <tr
                    key={lang.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-3 border-b border-gray-300">{lang.id}</td>
                    <td className="px-4 py-3 border-b border-gray-300">{lang.languageName}</td>
                    <td className="px-4 py-3 border-b border-gray-300">{lang.languageCode}</td>
                    <td className="px-4 py-3 border-b border-gray-300 flex items-center space-x-2">
                      <i
                        className={`fa fa-flag text-lg`}
                        title={lang.languageFlag.toUpperCase()}
                        aria-hidden="true"
                      ></i>
                      <span className="uppercase text-xs font-semibold select-none">
                        {lang.languageFlag}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-300">{lang.languageOrder}</td>
                    <td className="px-4 py-3 border-b border-gray-300">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                          lang.languageStatus === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {lang.languageStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-300 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(lang.id)}
                        className="inline-flex items-center px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded text-xs"
                        title="Edit"
                        type="button"
                      >
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(lang.id)}
                        className="inline-flex items-center px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                        title="Delete"
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

          {/* Pagination */}
          <nav
            className="mt-6 flex justify-between items-center"
            aria-label="Pagination"
          >
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`inline-flex items-center px-3 py-1 rounded border border-gray-300 text-sm font-medium ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed bg-gray-100"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              aria-label="Previous page"
              type="button"
            >
              <i className="fa fa-chevron-left mr-1" aria-hidden="true"></i> Prev
            </button>

            <ul className="inline-flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page}>
                  <button
                    onClick={() => goToPage(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`inline-flex items-center justify-center w-8 h-8 rounded border text-sm font-medium ${
                      page === currentPage
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 text-gray-700 hover:bg-gray-200"
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
              className={`inline-flex items-center px-3 py-1 rounded border border-gray-300 text-sm font-medium ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed bg-gray-100"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              aria-label="Next page"
              type="button"
            >
              Next <i className="fa fa-chevron-right ml-1" aria-hidden="true"></i>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default LanguageSettings;