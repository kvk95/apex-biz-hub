import React, { useState, useMemo } from "react";

const smsSettingsData = [
  {
    id: 1,
    smsGateway: "Twilio",
    username: "twilio_user",
    password: "********",
    senderId: "TWILIO123",
    status: "Active",
  },
  {
    id: 2,
    smsGateway: "Nexmo",
    username: "nexmo_user",
    password: "********",
    senderId: "NEXMO456",
    status: "Inactive",
  },
  {
    id: 3,
    smsGateway: "Plivo",
    username: "plivo_user",
    password: "********",
    senderId: "PLIVO789",
    status: "Active",
  },
  {
    id: 4,
    smsGateway: "Clickatell",
    username: "click_user",
    password: "********",
    senderId: "CLICK101",
    status: "Active",
  },
  {
    id: 5,
    smsGateway: "MSG91",
    username: "msg91_user",
    password: "********",
    senderId: "MSG91111",
    status: "Inactive",
  },
  {
    id: 6,
    smsGateway: "Textlocal",
    username: "textlocal_user",
    password: "********",
    senderId: "TEXT222",
    status: "Active",
  },
  {
    id: 7,
    smsGateway: "Infobip",
    username: "infobip_user",
    password: "********",
    senderId: "INFO333",
    status: "Active",
  },
  {
    id: 8,
    smsGateway: "Routee",
    username: "routee_user",
    password: "********",
    senderId: "ROUTE444",
    status: "Inactive",
  },
  {
    id: 9,
    smsGateway: "Telesign",
    username: "telesign_user",
    password: "********",
    senderId: "TELE555",
    status: "Active",
  },
  {
    id: 10,
    smsGateway: "Sinch",
    username: "sinch_user",
    password: "********",
    senderId: "SINCH666",
    status: "Active",
  },
];

const pageSizeOptions = [5, 10, 15];

export default function SmsSettings() {
  const [form, setForm] = useState({
    smsGateway: "",
    username: "",
    password: "",
    senderId: "",
    status: "Active",
  });

  const [data, setData] = useState(smsSettingsData);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Pagination calculations
  const pageCount = Math.ceil(data.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [currentPage, pageSize, data]);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (
      !form.smsGateway.trim() ||
      !form.username.trim() ||
      !form.password.trim() ||
      !form.senderId.trim()
    )
      return;

    if (editingId !== null) {
      // Edit existing
      setData((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                smsGateway: form.smsGateway,
                username: form.username,
                password: form.password,
                senderId: form.senderId,
                status: form.status,
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
          smsGateway: form.smsGateway,
          username: form.username,
          password: form.password,
          senderId: form.senderId,
          status: form.status,
        },
      ]);
    }
    setForm({
      smsGateway: "",
      username: "",
      password: "",
      senderId: "",
      status: "Active",
    });
    setEditingId(null);
    setCurrentPage(1);
  };

  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setForm({
        smsGateway: item.smsGateway,
        username: item.username,
        password: item.password,
        senderId: item.senderId,
        status: item.status,
      });
      setEditingId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      if ((currentPage - 1) * pageSize >= data.length - 1) {
        setCurrentPage((p) => Math.max(1, p - 1));
      }
    }
  };

  const handleRefresh = () => {
    setData(smsSettingsData);
    setCurrentPage(1);
    setEditingId(null);
    setForm({
      smsGateway: "",
      username: "",
      password: "",
      senderId: "",
      status: "Active",
    });
  };

  const handleReport = () => {
    // For demo, just alert JSON data
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      <h1 className="text-2xl font-semibold mb-6">SMS Settings</h1>

      {/* Form Section */}
      <section className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Add / Edit SMS Gateway</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="smsGateway"
                className="block text-sm font-medium mb-1"
              >
                SMS Gateway <span className="text-red-600">*</span>
              </label>
              <input
                id="smsGateway"
                name="smsGateway"
                type="text"
                value={form.smsGateway}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter SMS Gateway"
                required
              />
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-1"
              >
                Username <span className="text-red-600">*</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Username"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password <span className="text-red-600">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Password"
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="senderId"
                className="block text-sm font-medium mb-1"
              >
                Sender ID <span className="text-red-600">*</span>
              </label>
              <input
                id="senderId"
                name="senderId"
                type="text"
                value={form.senderId}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Sender ID"
                required
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-1"
              >
                Status <span className="text-red-600">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                title={editingId !== null ? "Update" : "Save"}
              >
                {editingId !== null ? (
                  <>
                    <i className="fa fa-edit mr-2" aria-hidden="true"></i> Update
                  </>
                ) : (
                  <>
                    <i className="fa fa-save mr-2" aria-hidden="true"></i> Save
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-white rounded shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="text-lg font-semibold mb-3 md:mb-0">SMS Gateway List</h2>
          <div className="flex space-x-3">
            <button
              onClick={handleReport}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
              title="Report"
              type="button"
            >
              <i className="fa fa-file-text-o mr-2" aria-hidden="true"></i> Report
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition"
              title="Refresh"
              type="button"
            >
              <i className="fa fa-refresh mr-2" aria-hidden="true"></i> Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-r border-gray-300">
                  #
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-r border-gray-300">
                  SMS Gateway
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-r border-gray-300">
                  Username
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-r border-gray-300">
                  Password
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-r border-gray-300">
                  Sender ID
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-r border-gray-300">
                  Status
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-gray-500 italic"
                  >
                    No SMS Gateway entries found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                      {item.smsGateway}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                      {item.username}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300 font-mono">
                      {item.password}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                      {item.senderId}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                          item.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center space-x-2">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-blue-600 hover:text-blue-800 focus:outline-none"
                        title="Edit"
                        type="button"
                      >
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 focus:outline-none"
                        title="Delete"
                        type="button"
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-4 space-y-3 md:space-y-0">
          <div className="flex items-center space-x-2">
            <label
              htmlFor="pageSize"
              className="text-sm font-medium text-gray-700"
            >
              Show
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>

          <nav
            className="inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
              aria-label="First Page"
              type="button"
            >
              <i className="fa fa-angle-double-left" aria-hidden="true"></i>
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
              aria-label="Previous Page"
              type="button"
            >
              <i className="fa fa-angle-left" aria-hidden="true"></i>
            </button>

            {/* Page numbers */}
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                aria-current={currentPage === page ? "page" : undefined}
                type="button"
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
              disabled={currentPage === pageCount || pageCount === 0}
              className={`px-3 py-1 border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                currentPage === pageCount || pageCount === 0
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
              aria-label="Next Page"
              type="button"
            >
              <i className="fa fa-angle-right" aria-hidden="true"></i>
            </button>
            <button
              onClick={() => setCurrentPage(pageCount)}
              disabled={currentPage === pageCount || pageCount === 0}
              className={`px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                currentPage === pageCount || pageCount === 0
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
              aria-label="Last Page"
              type="button"
            >
              <i className="fa fa-angle-double-right" aria-hidden="true"></i>
            </button>
          </nav>
        </div>
      </section>
    </div>
  );
}