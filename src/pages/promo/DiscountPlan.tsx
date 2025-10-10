import React, { useState, useMemo } from "react";

const discountPlansData = [
  {
    id: 1,
    discountPlanName: "Holiday Special",
    discountType: "Percentage",
    discountValue: 15,
    startDate: "2023-12-01",
    endDate: "2023-12-31",
    status: "Active",
  },
  {
    id: 2,
    discountPlanName: "New Year Offer",
    discountType: "Flat",
    discountValue: 50,
    startDate: "2024-01-01",
    endDate: "2024-01-10",
    status: "Inactive",
  },
  {
    id: 3,
    discountPlanName: "Weekend Deal",
    discountType: "Percentage",
    discountValue: 10,
    startDate: "2023-11-01",
    endDate: "2023-11-30",
    status: "Active",
  },
  {
    id: 4,
    discountPlanName: "Clearance Sale",
    discountType: "Flat",
    discountValue: 100,
    startDate: "2023-10-15",
    endDate: "2023-10-31",
    status: "Inactive",
  },
  {
    id: 5,
    discountPlanName: "Summer Offer",
    discountType: "Percentage",
    discountValue: 20,
    startDate: "2023-06-01",
    endDate: "2023-06-30",
    status: "Inactive",
  },
  {
    id: 6,
    discountPlanName: "Festive Discount",
    discountType: "Flat",
    discountValue: 75,
    startDate: "2023-12-20",
    endDate: "2024-01-05",
    status: "Active",
  },
  {
    id: 7,
    discountPlanName: "Black Friday",
    discountType: "Percentage",
    discountValue: 25,
    startDate: "2023-11-24",
    endDate: "2023-11-24",
    status: "Active",
  },
  {
    id: 8,
    discountPlanName: "Cyber Monday",
    discountType: "Flat",
    discountValue: 60,
    startDate: "2023-11-27",
    endDate: "2023-11-27",
    status: "Active",
  },
  {
    id: 9,
    discountPlanName: "Spring Sale",
    discountType: "Percentage",
    discountValue: 18,
    startDate: "2023-03-01",
    endDate: "2023-03-31",
    status: "Inactive",
  },
  {
    id: 10,
    discountPlanName: "VIP Customer",
    discountType: "Flat",
    discountValue: 120,
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    status: "Active",
  },
];

const discountTypes = ["Percentage", "Flat"];
const statuses = ["Active", "Inactive"];

export default function DiscountPlan() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form state
  const [form, setForm] = useState({
    discountPlanName: "",
    discountType: discountTypes[0],
    discountValue: "",
    startDate: "",
    endDate: "",
    status: statuses[0],
  });

  // Data state (simulate data in repo)
  const [plans, setPlans] = useState(discountPlansData);

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);

  // Pagination calculations
  const totalPages = Math.ceil(plans.length / itemsPerPage);
  const paginatedPlans = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return plans.slice(start, start + itemsPerPage);
  }, [plans, currentPage]);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = () => {
    // Validate required fields
    if (
      !form.discountPlanName.trim() ||
      !form.discountValue ||
      !form.startDate ||
      !form.endDate
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    if (editingId !== null) {
      // Update existing
      setPlans((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                discountPlanName: form.discountPlanName,
                discountType: form.discountType,
                discountValue: Number(form.discountValue),
                startDate: form.startDate,
                endDate: form.endDate,
                status: form.status,
              }
            : p
        )
      );
      setEditingId(null);
    } else {
      // Add new
      const newPlan = {
        id: plans.length ? Math.max(...plans.map((p) => p.id)) + 1 : 1,
        discountPlanName: form.discountPlanName,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        startDate: form.startDate,
        endDate: form.endDate,
        status: form.status,
      };
      setPlans((prev) => [newPlan, ...prev]);
      setCurrentPage(1);
    }
    setForm({
      discountPlanName: "",
      discountType: discountTypes[0],
      discountValue: "",
      startDate: "",
      endDate: "",
      status: statuses[0],
    });
  };

  const handleEdit = (id: number) => {
    const plan = plans.find((p) => p.id === id);
    if (!plan) return;
    setForm({
      discountPlanName: plan.discountPlanName,
      discountType: plan.discountType,
      discountValue: String(plan.discountValue),
      startDate: plan.startDate,
      endDate: plan.endDate,
      status: plan.status,
    });
    setEditingId(id);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this discount plan?")) {
      setPlans((prev) => prev.filter((p) => p.id !== id));
      if ((currentPage - 1) * itemsPerPage >= plans.length - 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleRefresh = () => {
    // Reset form and reload initial data
    setForm({
      discountPlanName: "",
      discountType: discountTypes[0],
      discountValue: "",
      startDate: "",
      endDate: "",
      status: statuses[0],
    });
    setEditingId(null);
    setPlans(discountPlansData);
    setCurrentPage(1);
  };

  const handleReport = () => {
    // For demo, just alert JSON data
    alert("Discount Plans Report:\n" + JSON.stringify(plans, null, 2));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-800">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-900">
        Discount Plan
      </h1>

      {/* Form Section */}
      <section className="bg-white rounded shadow p-6 max-w-5xl mx-auto mb-8">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-2">
          Add / Edit Discount Plan
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          autoComplete="off"
        >
          {/* Discount Plan Name */}
          <div className="flex flex-col">
            <label
              htmlFor="discountPlanName"
              className="mb-1 font-medium text-gray-700"
            >
              Discount Plan Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="discountPlanName"
              name="discountPlanName"
              value={form.discountPlanName}
              onChange={handleInputChange}
              placeholder="Enter discount plan name"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Discount Type */}
          <div className="flex flex-col">
            <label
              htmlFor="discountType"
              className="mb-1 font-medium text-gray-700"
            >
              Discount Type <span className="text-red-600">*</span>
            </label>
            <select
              id="discountType"
              name="discountType"
              value={form.discountType}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              {discountTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Discount Value */}
          <div className="flex flex-col">
            <label
              htmlFor="discountValue"
              className="mb-1 font-medium text-gray-700"
            >
              Discount Value <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              id="discountValue"
              name="discountValue"
              value={form.discountValue}
              onChange={handleInputChange}
              placeholder="Enter discount value"
              min={0}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Start Date */}
          <div className="flex flex-col">
            <label
              htmlFor="startDate"
              className="mb-1 font-medium text-gray-700"
            >
              Start Date <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={form.startDate}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col">
            <label
              htmlFor="endDate"
              className="mb-1 font-medium text-gray-700"
            >
              End Date <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={form.endDate}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label htmlFor="status" className="mb-1 font-medium text-gray-700">
              Status <span className="text-red-600">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-end space-x-4 md:col-span-3 justify-end">
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
              type="submit"
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded shadow"
              title={editingId !== null ? "Update" : "Save"}
            >
              <i className="fas fa-save"></i>
              <span>{editingId !== null ? "Update" : "Save"}</span>
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-white rounded shadow p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Discount Plans List</h2>
          <button
            onClick={handleReport}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow"
            title="Generate Report"
          >
            <i className="fas fa-file-alt"></i>
            <span>Report</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-300 px-4 py-2">#</th>
                <th className="border border-gray-300 px-4 py-2">Discount Plan Name</th>
                <th className="border border-gray-300 px-4 py-2">Discount Type</th>
                <th className="border border-gray-300 px-4 py-2">Discount Value</th>
                <th className="border border-gray-300 px-4 py-2">Start Date</th>
                <th className="border border-gray-300 px-4 py-2">End Date</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPlans.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="border border-gray-300 px-4 py-4 text-center text-gray-500"
                  >
                    No discount plans found.
                  </td>
                </tr>
              ) : (
                paginatedPlans.map((plan, idx) => (
                  <tr
                    key={plan.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border border-gray-300 px-4 py-2">{plan.id}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {plan.discountPlanName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {plan.discountType}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {plan.discountType === "Percentage"
                        ? `${plan.discountValue}%`
                        : `$${plan.discountValue}`}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {plan.startDate}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{plan.endDate}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          plan.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {plan.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(plan.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                        aria-label={`Edit discount plan ${plan.discountPlanName}`}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(plan.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                        aria-label={`Delete discount plan ${plan.discountPlanName}`}
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
          aria-label="Pagination"
        >
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border border-gray-300 ${
              currentPage === 1
                ? "bg-gray-200 cursor-not-allowed text-gray-500"
                : "bg-white hover:bg-gray-100"
            }`}
            aria-label="Go to first page"
          >
            <i className="fas fa-angle-double-left"></i>
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border border-gray-300 ${
              currentPage === 1
                ? "bg-gray-200 cursor-not-allowed text-gray-500"
                : "bg-white hover:bg-gray-100"
            }`}
            aria-label="Go to previous page"
          >
            <i className="fas fa-angle-left"></i>
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded border border-gray-300 ${
                page === currentPage
                  ? "bg-indigo-600 text-white cursor-default"
                  : "bg-white hover:bg-gray-100"
              }`}
              aria-current={page === currentPage ? "page" : undefined}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border border-gray-300 ${
              currentPage === totalPages
                ? "bg-gray-200 cursor-not-allowed text-gray-500"
                : "bg-white hover:bg-gray-100"
            }`}
            aria-label="Go to next page"
          >
            <i className="fas fa-angle-right"></i>
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border border-gray-300 ${
              currentPage === totalPages
                ? "bg-gray-200 cursor-not-allowed text-gray-500"
                : "bg-white hover:bg-gray-100"
            }`}
            aria-label="Go to last page"
          >
            <i className="fas fa-angle-double-right"></i>
          </button>
        </nav>
      </section>
    </div>
  );
}