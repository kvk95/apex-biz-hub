import React, { useMemo, useEffect, useState } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const subscriptionPlans = ["Basic Plan", "Standard Plan", "Premium Plan"];

const SubscriptionStatusOptions = ["Active", "Expired", "Pending"];

export default function Subscriptions() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    subscriptionId: "",
    customerName: "",
    customerEmail: "",
    subscriptionPlan: "",
    startDate: "",
    endDate: "",
    status: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Subscriptions");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const [subscriptions, setSubscriptions] = useState(data);
  const [formData, setFormData] = useState({
    subscriptionId: "",
    customerName: "",
    customerEmail: "",
    subscriptionPlan: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  useEffect(() => {
    setSubscriptions(data);
  }, [data]);

  const [filterPlan, setFilterPlan] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter and search logic
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      const matchesPlan = filterPlan
        ? sub.subscriptionPlan === filterPlan
        : true;
      const matchesStatus = filterStatus ? sub.status === filterStatus : true;
      const matchesSearch =
        sub.subscriptionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesPlan && matchesStatus && matchesSearch;
    });
  }, [subscriptions, filterPlan, filterStatus, searchTerm]);

  // Calculate paginated data using Pagination component props
  const paginatedSubscriptions = useMemo(() => {
    return filteredSubscriptions.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredSubscriptions, currentPage, itemsPerPage]);

  // Handlers
  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  function handleItemsPerPageChange(size: number) {
    setItemsPerPage(size);
    setCurrentPage(1);
  }

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setEditForm((fd) => ({
      ...fd,
      [name]: value,
    }));
  }

  // Open edit modal and populate edit form
  function handleEdit(subscription: (typeof subscriptions)[0]) {
    setEditForm({
      subscriptionId: subscription.subscriptionId,
      customerName: subscription.customerName,
      customerEmail: subscription.customerEmail,
      subscriptionPlan: subscription.subscriptionPlan,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      status: subscription.status,
    });
    setEditId(subscription.id);
    setIsEditModalOpen(true);
  }

  // Save handler for Edit Modal
  function handleEditSave() {
    if (
      !editForm.subscriptionId.trim() ||
      !editForm.customerName.trim() ||
      !editForm.customerEmail.trim() ||
      !editForm.subscriptionPlan.trim() ||
      !editForm.startDate.trim() ||
      !editForm.endDate.trim() ||
      !editForm.status.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }
    if (editId !== null) {
      setSubscriptions((subs) =>
        subs.map((sub) =>
          sub.id === editId
            ? {
              ...sub,
              subscriptionId: editForm.subscriptionId,
              customerName: editForm.customerName,
              customerEmail: editForm.customerEmail,
              subscriptionPlan: editForm.subscriptionPlan,
              startDate: editForm.startDate,
              endDate: editForm.endDate,
              status: editForm.status,
            }
            : sub
        )
      );
      setEditId(null);
      setIsEditModalOpen(false);
    }
  }

  // Cancel editing modal
  function handleEditCancel() {
    setEditId(null);
    setIsEditModalOpen(false);
  }

  function handleDelete(id: number) {
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      setSubscriptions((subs) => subs.filter((sub) => sub.id !== id));
      if (
        (currentPage - 1) * itemsPerPage >= filteredSubscriptions.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  }

  // Clear button handler (replaces Refresh)
  function handleClear() {
    setFilterPlan("");
    setFilterStatus("");
    setSearchTerm("");
    setCurrentPage(1);
  }

  function handleReport() {
    alert("Report Data:\n" + JSON.stringify(filteredSubscriptions, null, 2));
  }

  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-lg font-semibold mb-6">Subscriptions</h1>

      {/* Filters and Actions Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 flex-grow">
            <div className="flex flex-col">
              <label htmlFor="filterPlan" className="text-sm font-medium mb-1">
                Subscription Plan
              </label>
              <select
                id="filterPlan"
                name="filterPlan"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={filterPlan}
                onChange={(e) => {
                  setFilterPlan(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Plans</option>
                {subscriptionPlans.map((plan) => (
                  <option key={plan} value={plan}>
                    {plan}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="filterStatus"
                className="text-sm font-medium mb-1"
              >
                Status
              </label>
              <select
                id="filterStatus"
                name="filterStatus"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Statuses</option>
                {SubscriptionStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col flex-grow">
              <label htmlFor="searchTerm" className="text-sm font-medium mb-1">
                Search
              </label>
              <input
                type="text"
                id="searchTerm"
                name="searchTerm"
                placeholder="Search by Subscription ID, Customer Name or Email"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              title="Clear"
            >
              <i className="fa fa-refresh fa-light"></i> Clear
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              title="Generate Report"
            >
              <i className="fa fa-file-text fa-light"></i> Report
            </button>
          </div>
        </div>
      </section>

      {/* Subscriptions Table Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Subscription ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Customer Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Plan
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
              {paginatedSubscriptions.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No subscriptions found.
                  </td>
                </tr>
              ) : (
                paginatedSubscriptions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors text-sm text-gray-500"
                  >
                    <td className="px-4 py-2">{sub.subscriptionId}</td>
                    <td className="px-4 py-2">{sub.customerName}</td>
                    <td className="px-4 py-2">{sub.customerEmail}</td>
                    <td className="px-4 py-2">{sub.subscriptionPlan}</td>
                    <td className="px-4 py-2">{sub.startDate}</td>
                    <td className="px-4 py-2">{sub.endDate}</td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${sub.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : sub.status === "Expired"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(sub)}
                        aria-label={`Edit subscription ${sub.subscriptionId}`}
                        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
                      >
                        <i className="fa fa-edit fa-light" aria-hidden="true"></i>
                        <span className="sr-only">Edit record</span>
                      </button>
                      <button
                        onClick={() => handleDelete(sub.id)}
                        aria-label={`Delete subscription ${sub.subscriptionId}`}
                        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
                      >
                        <i
                          className="fa fa-trash-can-xmark fa-light"
                          aria-hidden="true"
                        ></i>
                        <span className="sr-only">Delete record</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredSubscriptions.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handleItemsPerPageChange}
        />
      </section>

      {/* Add Section - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Subscription</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (
              !formData.subscriptionId.trim() ||
              !formData.customerName.trim() ||
              !formData.customerEmail.trim() ||
              !formData.subscriptionPlan.trim() ||
              !formData.startDate.trim() ||
              !formData.endDate.trim() ||
              !formData.status.trim()
            ) {
              alert("Please fill all fields.");
              return;
            }
            const newId = subscriptions.length
              ? Math.max(...subscriptions.map((s) => s.id)) + 1
              : 1;
            setSubscriptions((subs) => [
              ...subs,
              {
                id: newId,
                subscriptionId: formData.subscriptionId,
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                subscriptionPlan: formData.subscriptionPlan,
                startDate: formData.startDate,
                endDate: formData.endDate,
                status: formData.status,
              },
            ]);
            setFormData({
              subscriptionId: "",
              customerName: "",
              customerEmail: "",
              subscriptionPlan: "",
              startDate: "",
              endDate: "",
              status: "",
            });
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="flex flex-col">
            <label htmlFor="subscriptionId" className="mb-1 font-medium">
              Subscription ID
            </label>
            <input
              type="text"
              id="subscriptionId"
              name="subscriptionId"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={formData.subscriptionId}
              onChange={(e) =>
                setFormData((fd) => ({ ...fd, subscriptionId: e.target.value }))
              }
              required
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="customerName" className="mb-1 font-medium">
              Customer Name
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={formData.customerName}
              onChange={(e) =>
                setFormData((fd) => ({ ...fd, customerName: e.target.value }))
              }
              required
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="customerEmail" className="mb-1 font-medium">
              Customer Email
            </label>
            <input
              type="email"
              id="customerEmail"
              name="customerEmail"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={formData.customerEmail}
              onChange={(e) =>
                setFormData((fd) => ({ ...fd, customerEmail: e.target.value }))
              }
              required
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="subscriptionPlan" className="mb-1 font-medium">
              Subscription Plan
            </label>
            <select
              id="subscriptionPlan"
              name="subscriptionPlan"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={formData.subscriptionPlan}
              onChange={(e) =>
                setFormData((fd) => ({ ...fd, subscriptionPlan: e.target.value }))
              }
              required
            >
              <option value="">Select Plan</option>
              {subscriptionPlans.map((plan) => (
                <option key={plan} value={plan}>
                  {plan}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="startDate" className="mb-1 font-medium">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={formData.startDate}
              onChange={(e) =>
                setFormData((fd) => ({ ...fd, startDate: e.target.value }))
              }
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="endDate" className="mb-1 font-medium">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={formData.endDate}
              onChange={(e) =>
                setFormData((fd) => ({ ...fd, endDate: e.target.value }))
              }
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="status" className="mb-1 font-medium">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={formData.status}
              onChange={(e) =>
                setFormData((fd) => ({ ...fd, status: e.target.value }))
              }
              required
            >
              <option value="">Select Status</option>
              {SubscriptionStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 flex space-x-4 justify-end pt-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-save fa-light" aria-hidden="true"></i> Add
              Subscription
            </button>
          </div>
        </form>
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
              Edit Subscription
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="editSubscriptionId"
                  className="block text-sm font-medium mb-1"
                >
                  Subscription ID
                </label>
                <input
                  type="text"
                  id="editSubscriptionId"
                  name="subscriptionId"
                  value={editForm.subscriptionId}
                  onChange={handleInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter subscription ID"
                />
              </div>
              <div>
                <label
                  htmlFor="editCustomerName"
                  className="block text-sm font-medium mb-1"
                >
                  Customer Name
                </label>
                <input
                  type="text"
                  id="editCustomerName"
                  name="customerName"
                  value={editForm.customerName}
                  onChange={handleInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label
                  htmlFor="editCustomerEmail"
                  className="block text-sm font-medium mb-1"
                >
                  Customer Email
                </label>
                <input
                  type="email"
                  id="editCustomerEmail"
                  name="customerEmail"
                  value={editForm.customerEmail}
                  onChange={handleInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter customer email"
                />
              </div>
              <div>
                <label
                  htmlFor="editSubscriptionPlan"
                  className="block text-sm font-medium mb-1"
                >
                  Subscription Plan
                </label>
                <select
                  id="editSubscriptionPlan"
                  name="subscriptionPlan"
                  value={editForm.subscriptionPlan}
                  onChange={handleInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {subscriptionPlans.map((plan) => (
                    <option key={plan} value={plan}>
                      {plan}
                    </option>
                  ))}
                </select>
              </div>
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
                  onChange={handleInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
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
                  onChange={handleInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
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
                  onChange={handleInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {SubscriptionStatusOptions.map((status) => (
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