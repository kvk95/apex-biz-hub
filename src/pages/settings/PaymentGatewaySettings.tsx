import React, { useState, useMemo } from "react";

const paymentGatewaysData = [
  {
    id: 1,
    gatewayName: "Paypal",
    type: "Online",
    status: "Active",
    description: "Paypal payment gateway",
  },
  {
    id: 2,
    gatewayName: "Stripe",
    type: "Online",
    status: "Inactive",
    description: "Stripe payment gateway",
  },
  {
    id: 3,
    gatewayName: "Payoneer",
    type: "Online",
    status: "Active",
    description: "Payoneer payment gateway",
  },
  {
    id: 4,
    gatewayName: "Authorize.net",
    type: "Online",
    status: "Active",
    description: "Authorize.net payment gateway",
  },
  {
    id: 5,
    gatewayName: "2Checkout",
    type: "Online",
    status: "Inactive",
    description: "2Checkout payment gateway",
  },
  {
    id: 6,
    gatewayName: "Skrill",
    type: "Online",
    status: "Active",
    description: "Skrill payment gateway",
  },
  {
    id: 7,
    gatewayName: "WorldPay",
    type: "Online",
    status: "Inactive",
    description: "WorldPay payment gateway",
  },
  {
    id: 8,
    gatewayName: "Google Pay",
    type: "Online",
    status: "Active",
    description: "Google Pay payment gateway",
  },
  {
    id: 9,
    gatewayName: "Apple Pay",
    type: "Online",
    status: "Active",
    description: "Apple Pay payment gateway",
  },
  {
    id: 10,
    gatewayName: "Amazon Pay",
    type: "Online",
    status: "Inactive",
    description: "Amazon Pay payment gateway",
  },
  {
    id: 11,
    gatewayName: "Square",
    type: "Online",
    status: "Active",
    description: "Square payment gateway",
  },
  {
    id: 12,
    gatewayName: "Alipay",
    type: "Online",
    status: "Inactive",
    description: "Alipay payment gateway",
  },
];

const PaymentGatewaySettings: React.FC = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form state
  const [form, setForm] = useState({
    gatewayName: "",
    gatewayType: "Online",
    gatewayStatus: "Active",
    description: "",
  });

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);

  // Data state (simulate data update)
  const [data, setData] = useState(paymentGatewaysData);

  // Pagination calculations
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [currentPage, data]);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (id: number) => {
    const gateway = data.find((d) => d.id === id);
    if (gateway) {
      setForm({
        gatewayName: gateway.gatewayName,
        gatewayType: gateway.type,
        gatewayStatus: gateway.status,
        description: gateway.description,
      });
      setEditingId(id);
    }
  };

  const handleCancel = () => {
    setForm({
      gatewayName: "",
      gatewayType: "Online",
      gatewayStatus: "Active",
      description: "",
    });
    setEditingId(null);
  };

  const handleSave = () => {
    if (!form.gatewayName.trim()) return;
    if (editingId !== null) {
      // Update existing
      setData((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                gatewayName: form.gatewayName,
                type: form.gatewayType,
                status: form.gatewayStatus,
                description: form.description,
              }
            : item
        )
      );
    } else {
      // Add new
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [
        ...prev,
        {
          id: newId,
          gatewayName: form.gatewayName,
          type: form.gatewayType,
          status: form.gatewayStatus,
          description: form.description,
        },
      ]);
      setCurrentPage(totalPages); // Go to last page where new item is added
    }
    handleCancel();
  };

  const handleRefresh = () => {
    // Reset data to initial state
    setData(paymentGatewaysData);
    setCurrentPage(1);
    handleCancel();
  };

  const handleReport = () => {
    // For demonstration: alert JSON data
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">Payment Gateway Settings</h1>

      {/* Form Section */}
      <section className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Add / Edit Payment Gateway</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-6"
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="gatewayName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Gateway Name <span className="text-red-600">*</span>
              </label>
              <input
                id="gatewayName"
                name="gatewayName"
                type="text"
                value={form.gatewayName}
                onChange={handleInputChange}
                required
                className="block w-full rounded border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="Enter gateway name"
              />
            </div>

            <div>
              <label
                htmlFor="gatewayType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Gateway Type
              </label>
              <select
                id="gatewayType"
                name="gatewayType"
                value={form.gatewayType}
                onChange={handleInputChange}
                className="block w-full rounded border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option>Online</option>
                <option>Offline</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="gatewayStatus"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="gatewayStatus"
                name="gatewayStatus"
                value={form.gatewayStatus}
                onChange={handleInputChange}
                className="block w-full rounded border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={form.description}
              onChange={handleInputChange}
              className="block w-full rounded border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              placeholder="Enter description"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <i className="fa fa-save mr-2" aria-hidden="true"></i>
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm font-semibold rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <i className="fa fa-times mr-2" aria-hidden="true"></i>
              Cancel
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-white rounded shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 md:mb-0">
            Payment Gateway List
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={handleReport}
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              title="Generate Report"
              type="button"
            >
              <i className="fa fa-file-text-o mr-2" aria-hidden="true"></i>
              Report
            </button>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Refresh List"
              type="button"
            >
              <i className="fa fa-refresh mr-2" aria-hidden="true"></i>
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300"
                >
                  Gateway Name
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((gateway, idx) => (
                <tr key={gateway.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300 text-sm text-gray-700">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300 text-sm text-gray-900 font-medium">
                    {gateway.gatewayName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300 text-sm text-gray-700">
                    {gateway.type}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300 text-sm">
                    <span
                      className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                        gateway.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {gateway.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {gateway.description}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                    <button
                      onClick={() => handleEditClick(gateway.id)}
                      className="inline-flex items-center px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      title="Edit"
                      type="button"
                    >
                      <i className="fa fa-pencil" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-gray-500 text-sm"
                  >
                    No payment gateways found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <nav
          className="mt-6 flex justify-center items-center space-x-2"
          aria-label="Pagination"
        >
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border border-gray-300 text-sm font-medium ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="First Page"
          >
            <i className="fa fa-angle-double-left" aria-hidden="true"></i>
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border border-gray-300 text-sm font-medium ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Previous Page"
          >
            <i className="fa fa-angle-left" aria-hidden="true"></i>
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`px-3 py-1 rounded border border-gray-300 text-sm font-medium ${
                page === currentPage
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border border-gray-300 text-sm font-medium ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Next Page"
          >
            <i className="fa fa-angle-right" aria-hidden="true"></i>
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border border-gray-300 text-sm font-medium ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Last Page"
          >
            <i className="fa fa-angle-double-right" aria-hidden="true"></i>
          </button>
        </nav>
      </section>
    </div>
  );
};

export default PaymentGatewaySettings;