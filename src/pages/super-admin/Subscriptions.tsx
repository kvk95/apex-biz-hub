import React, { useMemo, useEffect, useState } from "react";
import { apiService } from "@/services/ApiService";

const subscriptionPlans = ["Basic Plan", "Standard Plan", "Premium Plan"];

const SubscriptionStatusOptions = ["Active", "Expired", "Pending"];

const PAGE_SIZE = 5;

export default function Subscriptions() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  const [currentPage, setCurrentPage] = useState(1);
  const [filterPlan, setFilterPlan] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    subscriptionId: "",
    customerName: "",
    customerEmail: "",
    subscriptionPlan: "",
    startDate: "",
    endDate: "",
    status: "",
  });
  const [isEditingId, setIsEditingId] = useState<number | null>(null);

  useEffect(() => {
    setSubscriptions(data);
  }, [data]);

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

  const totalPages = Math.ceil(filteredSubscriptions.length / PAGE_SIZE);

  const paginatedSubscriptions = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredSubscriptions.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredSubscriptions, currentPage]);

  // Handlers
  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((fd) => ({
      ...fd,
      [name]: value,
    }));
  }

  function handleEdit(subscription: (typeof subscriptions)[0]) {
    setIsEditingId(subscription.id);
    setFormData({
      subscriptionId: subscription.subscriptionId,
      customerName: subscription.customerName,
      customerEmail: subscription.customerEmail,
      subscriptionPlan: subscription.subscriptionPlan,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      status: subscription.status,
    });
  }

  function handleCancelEdit() {
    setIsEditingId(null);
    setFormData({
      subscriptionId: "",
      customerName: "",
      customerEmail: "",
      subscriptionPlan: "",
      startDate: "",
      endDate: "",
      status: "",
    });
  }

  function handleSave() {
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
    if (isEditingId !== null) {
      setSubscriptions((subs) =>
        subs.map((sub) =>
          sub.id === isEditingId
            ? {
                ...sub,
                subscriptionId: formData.subscriptionId,
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                subscriptionPlan: formData.subscriptionPlan,
                startDate: formData.startDate,
                endDate: formData.endDate,
                status: formData.status,
              }
            : sub
        )
      );
    } else {
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
    }
    handleCancelEdit();
  }

  function handleDelete(id: number) {
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      setSubscriptions((subs) => subs.filter((sub) => sub.id !== id));
      if (paginatedSubscriptions.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      }
    }
  }

  function handleRefresh() {
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
      <section className="bg-white rounded shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 flex-grow">
            <div className="flex flex-col">
              <label htmlFor="filterPlan" className="text-sm font-medium mb-1">
                Subscription Plan
              </label>
              <select
                id="filterPlan"
                name="filterPlan"
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Refresh"
            >
              <i className="fas fa-sync-alt mr-2"></i> Refresh
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center px-4 py-2 border border-indigo-600 bg-indigo-600 text-white rounded shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Generate Report"
            >
              <i className="fas fa-file-alt mr-2"></i> Report
            </button>
          </div>
        </div>
      </section>

      {/* Subscriptions Table Section */}
      <section className="bg-white rounded shadow p-6 mb-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Subscription ID
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Customer Name
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Email
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Plan
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Start Date
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                End Date
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedSubscriptions.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                  No subscriptions found.
                </td>
              </tr>
            ) : (
              paginatedSubscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{sub.subscriptionId}</td>
                  <td className="px-4 py-3">{sub.customerName}</td>
                  <td className="px-4 py-3">{sub.customerEmail}</td>
                  <td className="px-4 py-3">{sub.subscriptionPlan}</td>
                  <td className="px-4 py-3">{sub.startDate}</td>
                  <td className="px-4 py-3">{sub.endDate}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        sub.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : sub.status === "Expired"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(sub)}
                      title="Edit"
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      title="Delete"
                      className="text-red-600 hover:text-red-900"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <nav
          className="mt-4 flex justify-center items-center space-x-2"
          aria-label="Pagination"
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border ${
              currentPage === 1
                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                : "border-gray-400 text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Previous Page"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              aria-current={currentPage === i + 1 ? "page" : undefined}
              className={`px-3 py-1 rounded border ${
                currentPage === i + 1
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "border-gray-400 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-3 py-1 rounded border ${
              currentPage === totalPages || totalPages === 0
                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                : "border-gray-400 text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Next Page"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </nav>
      </section>

      {/* Add / Edit Subscription Form Section */}
      <section className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          {isEditingId !== null ? "Edit Subscription" : "Add New Subscription"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
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
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.subscriptionId}
              onChange={handleInputChange}
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
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.customerName}
              onChange={handleInputChange}
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
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.customerEmail}
              onChange={handleInputChange}
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
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.subscriptionPlan}
              onChange={handleInputChange}
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
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.startDate}
              onChange={handleInputChange}
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
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.endDate}
              onChange={handleInputChange}
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
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.status}
              onChange={handleInputChange}
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
            {isEditingId !== null && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-5 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {isEditingId !== null ? "Save Changes" : "Add Subscription"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
