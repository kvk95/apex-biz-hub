import React, { useState, useMemo } from "react";

const TAX_RATES_DATA = [
  {
    id: 1,
    taxName: "VAT",
    taxRate: "10%",
    taxType: "Percentage",
    taxDescription: "Value Added Tax",
  },
  {
    id: 2,
    taxName: "GST",
    taxRate: "5%",
    taxType: "Percentage",
    taxDescription: "Goods and Services Tax",
  },
  {
    id: 3,
    taxName: "Service Tax",
    taxRate: "15%",
    taxType: "Percentage",
    taxDescription: "Service Tax Description",
  },
  {
    id: 4,
    taxName: "Excise Duty",
    taxRate: "12%",
    taxType: "Percentage",
    taxDescription: "Excise Duty Description",
  },
  {
    id: 5,
    taxName: "Custom Duty",
    taxRate: "8%",
    taxType: "Percentage",
    taxDescription: "Custom Duty Description",
  },
  {
    id: 6,
    taxName: "Sales Tax",
    taxRate: "7%",
    taxType: "Percentage",
    taxDescription: "Sales Tax Description",
  },
  {
    id: 7,
    taxName: "Luxury Tax",
    taxRate: "20%",
    taxType: "Percentage",
    taxDescription: "Luxury Tax Description",
  },
  {
    id: 8,
    taxName: "Entertainment Tax",
    taxRate: "18%",
    taxType: "Percentage",
    taxDescription: "Entertainment Tax Description",
  },
  {
    id: 9,
    taxName: "Import Tax",
    taxRate: "25%",
    taxType: "Percentage",
    taxDescription: "Import Tax Description",
  },
  {
    id: 10,
    taxName: "Export Tax",
    taxRate: "3%",
    taxType: "Percentage",
    taxDescription: "Export Tax Description",
  },
  {
    id: 11,
    taxName: "Environmental Tax",
    taxRate: "9%",
    taxType: "Percentage",
    taxDescription: "Environmental Tax Description",
  },
  {
    id: 12,
    taxName: "Capital Gains Tax",
    taxRate: "13%",
    taxType: "Percentage",
    taxDescription: "Capital Gains Tax Description",
  },
];

const TAX_TYPES = ["Percentage", "Fixed"];

export default function TaxRates() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form state
  const [form, setForm] = useState({
    taxName: "",
    taxRate: "",
    taxType: "Percentage",
    taxDescription: "",
  });

  // Data state
  const [taxRates, setTaxRates] = useState(TAX_RATES_DATA);

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);

  // Pagination calculations
  const totalPages = Math.ceil(taxRates.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return taxRates.slice(start, start + itemsPerPage);
  }, [currentPage, taxRates]);

  // Handlers
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleEdit(id: number) {
    const tax = taxRates.find((t) => t.id === id);
    if (!tax) return;
    setForm({
      taxName: tax.taxName,
      taxRate: tax.taxRate.replace("%", ""),
      taxType: tax.taxType,
      taxDescription: tax.taxDescription,
    });
    setEditingId(id);
  }

  function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this tax rate?")) return;
    setTaxRates((prev) => prev.filter((t) => t.id !== id));
    // Adjust page if needed
    if ((taxRates.length - 1) % itemsPerPage === 0 && currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  }

  function handleSave() {
    if (!form.taxName.trim()) {
      alert("Tax Name is required");
      return;
    }
    if (!form.taxRate.trim() || isNaN(Number(form.taxRate))) {
      alert("Tax Rate must be a valid number");
      return;
    }
    if (!TAX_TYPES.includes(form.taxType)) {
      alert("Tax Type is invalid");
      return;
    }
    if (editingId !== null) {
      // Update existing
      setTaxRates((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? {
                ...t,
                taxName: form.taxName.trim(),
                taxRate: form.taxRate.trim() + (form.taxType === "Percentage" ? "%" : ""),
                taxType: form.taxType,
                taxDescription: form.taxDescription.trim(),
              }
            : t
        )
      );
    } else {
      // Add new
      const newId = taxRates.length ? Math.max(...taxRates.map((t) => t.id)) + 1 : 1;
      setTaxRates((prev) => [
        ...prev,
        {
          id: newId,
          taxName: form.taxName.trim(),
          taxRate: form.taxRate.trim() + (form.taxType === "Percentage" ? "%" : ""),
          taxType: form.taxType,
          taxDescription: form.taxDescription.trim(),
        },
      ]);
      // If new item added to last page, move to last page
      if ((taxRates.length + 1) > itemsPerPage * totalPages) {
        setCurrentPage(totalPages + 1);
      }
    }
    handleReset();
  }

  function handleReset() {
    setForm({
      taxName: "",
      taxRate: "",
      taxType: "Percentage",
      taxDescription: "",
    });
    setEditingId(null);
  }

  function handleRefresh() {
    setTaxRates(TAX_RATES_DATA);
    setCurrentPage(1);
    handleReset();
  }

  function handleReport() {
    // For demo, just alert JSON data
    alert(JSON.stringify(taxRates, null, 2));
  }

  function changePage(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <div className="max-w-7xl mx-auto p-6">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Tax Rates</h1>

        {/* Form Section */}
        <section className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Add / Edit Tax Rate</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-6"
            noValidate
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label htmlFor="taxName" className="font-medium text-gray-700">
                Tax Name <span className="text-red-600">*</span>
              </label>
              <input
                id="taxName"
                name="taxName"
                type="text"
                value={form.taxName}
                onChange={handleInputChange}
                className="col-span-3 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter tax name"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label htmlFor="taxRate" className="font-medium text-gray-700">
                Tax Rate <span className="text-red-600">*</span>
              </label>
              <input
                id="taxRate"
                name="taxRate"
                type="number"
                min="0"
                step="any"
                value={form.taxRate}
                onChange={handleInputChange}
                className="col-span-3 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter tax rate"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label htmlFor="taxType" className="font-medium text-gray-700">
                Tax Type <span className="text-red-600">*</span>
              </label>
              <select
                id="taxType"
                name="taxType"
                value={form.taxType}
                onChange={handleInputChange}
                className="col-span-3 border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {TAX_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
              <label htmlFor="taxDescription" className="font-medium text-gray-700 pt-2">
                Tax Description
              </label>
              <textarea
                id="taxDescription"
                name="taxDescription"
                value={form.taxDescription}
                onChange={handleInputChange}
                rows={3}
                className="col-span-3 border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter tax description"
              />
            </div>

            <div className="flex space-x-4 justify-start">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                title={editingId !== null ? "Update Tax Rate" : "Save Tax Rate"}
              >
                <i className="fas fa-save mr-2"></i>
                {editingId !== null ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                title="Reset Form"
              >
                <i className="fas fa-undo-alt mr-2"></i> Reset
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                title="Refresh Data"
              >
                <i className="fas fa-sync-alt mr-2"></i> Refresh
              </button>
              <button
                type="button"
                onClick={handleReport}
                className="inline-flex items-center px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                title="Generate Report"
              >
                <i className="fas fa-file-alt mr-2"></i> Report
              </button>
            </div>
          </form>
        </section>

        {/* Table Section */}
        <section className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Tax Rates List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                    Tax Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                    Tax Rate
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                    Tax Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                    Tax Description
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      No tax rates found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map(({ id, taxName, taxRate, taxType, taxDescription }) => (
                    <tr key={id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">{taxName}</td>
                      <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">{taxRate}</td>
                      <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">{taxType}</td>
                      <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">{taxDescription}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-center space-x-2">
                        <button
                          onClick={() => handleEdit(id)}
                          className="inline-flex items-center px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
                          title="Edit"
                          aria-label={`Edit tax rate ${taxName}`}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(id)}
                          className="inline-flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                          title="Delete"
                          aria-label={`Delete tax rate ${taxName}`}
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
          <nav
            className="mt-6 flex justify-center items-center space-x-1"
            aria-label="Pagination Navigation"
          >
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-l border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Previous page"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => changePage(page)}
                aria-current={page === currentPage ? "page" : undefined}
                className={`px-4 py-1 border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  page === currentPage
                    ? "bg-blue-600 text-white font-semibold"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-r border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Next page"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </nav>
        </section>
      </div>
    </div>
  );
}