import { apiService } from "@/services/ApiService";
import React, { useEffect, useState } from "react";
import { Pagination } from "@/components/Pagination/Pagination";

const discountTypes = ["Percentage", "Fixed"];
const statusOptions = ["Active", "Inactive"];

export default function DiscountPlan() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state for Add Section (preserved exactly)
  const [form, setForm] = useState({
    discountPlanName: "",
    discountType: discountTypes[0],
    discountValue: "",
    startDate: "",
    endDate: "",
    status: statusOptions[0],
  });

  // Data state
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    discountPlanName: "",
    discountType: discountTypes[0],
    discountValue: "",
    startDate: "",
    endDate: "",
    status: statusOptions[0],
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("DiscountPlan");
    if (response.status.code === "S") {
      setPlans(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  // Handlers for Add Section form inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Add Section (Add new discount plan)
  const handleSave = () => {
    if (
      !form.discountPlanName.trim() ||
      !form.discountValue ||
      !form.startDate ||
      !form.endDate
    ) {
      alert("Please fill all required fields.");
      return;
    }
    const newId = plans.length ? Math.max(...plans.map((p) => p.id)) + 1 : 1;
    setPlans((prev) => [
      ...prev,
      {
        id: newId,
        discountPlanName: form.discountPlanName.trim(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        startDate: form.startDate,
        endDate: form.endDate,
        status: form.status,
      },
    ]);
    setForm({
      discountPlanName: "",
      discountType: discountTypes[0],
      discountValue: "",
      startDate: "",
      endDate: "",
      status: statusOptions[0],
    });
    setCurrentPage(1);
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const plan = plans.find((p) => p.id === id);
    if (plan) {
      setEditForm({
        discountPlanName: plan.discountPlanName,
        discountType: plan.discountType,
        discountValue: plan.discountValue.toString(),
        startDate: plan.startDate,
        endDate: plan.endDate,
        status: plan.status,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (
      !editForm.discountPlanName.trim() ||
      !editForm.discountValue ||
      !editForm.startDate ||
      !editForm.endDate
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      setPlans((prev) =>
        prev.map((plan) =>
          plan.id === editId
            ? {
              ...plan,
              discountPlanName: editForm.discountPlanName.trim(),
              discountType: editForm.discountType,
              discountValue: Number(editForm.discountValue),
              startDate: editForm.startDate,
              endDate: editForm.endDate,
              status: editForm.status,
            }
            : plan
        )
      );
      setEditId(null);
      setIsEditModalOpen(false);
    }
  };

  // Cancel editing modal
  const handleEditCancel = () => {
    setEditId(null);
    setIsEditModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this discount plan?")) {
      setPlans((prev) => prev.filter((p) => p.id !== id));
      if ((currentPage - 1) * itemsPerPage >= plans.length - 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setForm({
      discountPlanName: "",
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
    alert("Discount Plans Report:\n" + JSON.stringify(plans, null, 2));
  };

  // Calculate paginated data
  const paginatedPlans = plans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Title */}
      <h1 className="text-lg font-semibold mb-6">Discount Plan</h1>

      {/* Form Section (Add Section) - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Discount Plan Name */}
          <div>
            <label
              htmlFor="discountPlanName"
              className="block text-sm font-medium mb-1"
            >
              Discount Plan Name
            </label>
            <input
              type="text"
              id="discountPlanName"
              name="discountPlanName"
              value={form.discountPlanName}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter discount plan name"
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-save  fa-light" aria-hidden="true"></i> Save
          </button>

          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
          </button>

          <button
            onClick={handleReport}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
          </button>
        </div>
      </section>

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Discount Plan Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Discount Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Discount Value
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Start Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  End Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedPlans.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No discount plans found.
                  </td>
                </tr>
              )}
              {paginatedPlans.map((plan, idx) => (
                <tr
                  key={plan.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {plan.discountPlanName}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {plan.discountType}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {plan.discountType === "Percentage"
                      ? `${plan.discountValue}%`
                      : `$${plan.discountValue}`}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {plan.startDate}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {plan.endDate}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${plan.status === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                    >
                      {plan.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(plan.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit discount plan ${plan.discountPlanName}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete discount plan ${plan.discountPlanName}`}
                      type="button"
                    >
                      <i className="fa fa-trash fa-light" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={plans.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
      </section>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-modal-title"
        >
          <div className="bg-white rounded shadow-lg max-w-xl w-full p-6 relative">
            <h2
              id="edit-modal-title"
              className="text-xl font-semibold mb-4 text-center"
            >
              Edit Discount Plan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Discount Plan Name */}
              <div>
                <label
                  htmlFor="editDiscountPlanName"
                  className="block text-sm font-medium mb-1"
                >
                  Discount Plan Name
                </label>
                <input
                  type="text"
                  id="editDiscountPlanName"
                  name="discountPlanName"
                  value={editForm.discountPlanName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter discount plan name"
                />
              </div>

              {/* Discount Type */}
              <div>
                <label
                  htmlFor="editDiscountType"
                  className="block text-sm font-medium mb-1"
                >
                  Discount Type
                </label>
                <select
                  id="editDiscountType"
                  name="discountType"
                  value={editForm.discountType}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                  htmlFor="editDiscountValue"
                  className="block text-sm font-medium mb-1"
                >
                  Discount Value
                </label>
                <input
                  type="number"
                  id="editDiscountValue"
                  name="discountValue"
                  value={editForm.discountValue}
                  onChange={handleEditInputChange}
                  min={0}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter discount value"
                />
              </div>

              {/* Start Date */}
              <div>
                <label
                  htmlFor="editStartDate"
                  className="block text-sm font-medium mb-1"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="editStartDate"
                  name="startDate"
                  value={editForm.startDate}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* End Date */}
              <div>
                <label
                  htmlFor="editEndDate"
                  className="block text-sm font-medium mb-1"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="editEndDate"
                  name="endDate"
                  value={editForm.endDate}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="editStatus"
                  className="block text-sm font-medium mb-1"
                >
                  Status
                </label>
                <select
                  id="editStatus"
                  name="status"
                  value={editForm.status}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleEditCancel}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}