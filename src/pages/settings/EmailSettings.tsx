import React, { useState, useMemo } from "react";

const emailSettingsData = [
  {
    id: 1,
    email: "admin@example.com",
    smtpHost: "smtp.example.com",
    smtpPort: 587,
    smtpUser: "admin",
    smtpPass: "********",
    status: "Active",
  },
  {
    id: 2,
    email: "support@example.com",
    smtpHost: "smtp.support.com",
    smtpPort: 465,
    smtpUser: "support",
    smtpPass: "********",
    status: "Inactive",
  },
  {
    id: 3,
    email: "sales@example.com",
    smtpHost: "smtp.sales.com",
    smtpPort: 25,
    smtpUser: "sales",
    smtpPass: "********",
    status: "Active",
  },
  {
    id: 4,
    email: "info@example.com",
    smtpHost: "smtp.info.com",
    smtpPort: 2525,
    smtpUser: "info",
    smtpPass: "********",
    status: "Active",
  },
  {
    id: 5,
    email: "marketing@example.com",
    smtpHost: "smtp.marketing.com",
    smtpPort: 587,
    smtpUser: "marketing",
    smtpPass: "********",
    status: "Inactive",
  },
  {
    id: 6,
    email: "hr@example.com",
    smtpHost: "smtp.hr.com",
    smtpPort: 465,
    smtpUser: "hr",
    smtpPass: "********",
    status: "Active",
  },
  {
    id: 7,
    email: "ceo@example.com",
    smtpHost: "smtp.ceo.com",
    smtpPort: 25,
    smtpUser: "ceo",
    smtpPass: "********",
    status: "Active",
  },
  {
    id: 8,
    email: "cto@example.com",
    smtpHost: "smtp.cto.com",
    smtpPort: 2525,
    smtpUser: "cto",
    smtpPass: "********",
    status: "Inactive",
  },
  {
    id: 9,
    email: "finance@example.com",
    smtpHost: "smtp.finance.com",
    smtpPort: 587,
    smtpUser: "finance",
    smtpPass: "********",
    status: "Active",
  },
  {
    id: 10,
    email: "legal@example.com",
    smtpHost: "smtp.legal.com",
    smtpPort: 465,
    smtpUser: "legal",
    smtpPass: "********",
    status: "Inactive",
  },
];

const pageSize = 5;

export default function EmailSettings() {
  const [data, setData] = useState(emailSettingsData);
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState({
    email: "",
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPass: "",
    status: "Active",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const totalPages = Math.ceil(data.length / pageSize);

  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage]);

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleEdit(id: number) {
    const item = data.find((d) => d.id === id);
    if (item) {
      setForm({
        email: item.email,
        smtpHost: item.smtpHost,
        smtpPort: item.smtpPort.toString(),
        smtpUser: item.smtpUser,
        smtpPass: "",
        status: item.status,
      });
      setEditId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleDelete(id: number) {
    if (
      window.confirm(
        "Are you sure you want to delete this email setting? This action cannot be undone."
      )
    ) {
      setData((d) => d.filter((item) => item.id !== id));
      if ((currentPage - 1) * pageSize >= data.length - 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      }
    }
  }

  function handleSave() {
    if (
      !form.email.trim() ||
      !form.smtpHost.trim() ||
      !form.smtpPort.trim() ||
      !form.smtpUser.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    const portNum = Number(form.smtpPort);
    if (isNaN(portNum) || portNum <= 0) {
      alert("SMTP Port must be a positive number.");
      return;
    }

    if (editId !== null) {
      // Update existing
      setData((d) =>
        d.map((item) =>
          item.id === editId
            ? {
                ...item,
                email: form.email,
                smtpHost: form.smtpHost,
                smtpPort: portNum,
                smtpUser: form.smtpUser,
                smtpPass: form.smtpPass ? form.smtpPass : item.smtpPass,
                status: form.status,
              }
            : item
        )
      );
      setEditId(null);
    } else {
      // Add new
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((d) => [
        ...d,
        {
          id: newId,
          email: form.email,
          smtpHost: form.smtpHost,
          smtpPort: portNum,
          smtpUser: form.smtpUser,
          smtpPass: form.smtpPass,
          status: form.status,
        },
      ]);
    }
    setForm({
      email: "",
      smtpHost: "",
      smtpPort: "",
      smtpUser: "",
      smtpPass: "",
      status: "Active",
    });
  }

  function handleRefresh() {
    setData(emailSettingsData);
    setCurrentPage(1);
    setEditId(null);
    setForm({
      email: "",
      smtpHost: "",
      smtpPort: "",
      smtpUser: "",
      smtpPass: "",
      status: "Active",
    });
  }

  function handleReport() {
    // For demonstration, just alert JSON data
    alert("Report Data:\n" + JSON.stringify(data, null, 2));
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <h1 className="text-3xl font-semibold mb-6">Email Settings</h1>

        {/* Form Section */}
        <section className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add / Edit Email Setting</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="example@domain.com"
                />
              </div>
              <div>
                <label
                  htmlFor="smtpHost"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  SMTP Host <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="smtpHost"
                  name="smtpHost"
                  value={form.smtpHost}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="smtp.domain.com"
                />
              </div>
              <div>
                <label
                  htmlFor="smtpPort"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  SMTP Port <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  id="smtpPort"
                  name="smtpPort"
                  value={form.smtpPort}
                  onChange={handleInputChange}
                  min={1}
                  required
                  className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="587"
                />
              </div>
              <div>
                <label
                  htmlFor="smtpUser"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  SMTP User <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="smtpUser"
                  name="smtpUser"
                  value={form.smtpUser}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="username"
                />
              </div>
              <div>
                <label
                  htmlFor="smtpPass"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  SMTP Password
                </label>
                <input
                  type="password"
                  id="smtpPass"
                  name="smtpPass"
                  value={form.smtpPass}
                  onChange={handleInputChange}
                  className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleInputChange}
                  className="block w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <i className="fa fa-save mr-2" aria-hidden="true"></i>
                {editId !== null ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm({
                    email: "",
                    smtpHost: "",
                    smtpPort: "",
                    smtpUser: "",
                    smtpPass: "",
                    status: "Active",
                  });
                  setEditId(null);
                }}
                className="inline-flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <i className="fa fa-times mr-2" aria-hidden="true"></i>Cancel
              </button>
            </div>
          </form>
        </section>

        {/* Table Section */}
        <section className="bg-white rounded shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Email Settings List</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleReport}
                className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                title="Generate Report"
              >
                <i className="fa fa-file-text-o mr-1" aria-hidden="true"></i>Report
              </button>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                title="Refresh Data"
              >
                <i className="fa fa-refresh mr-1" aria-hidden="true"></i>Refresh
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300"
                  >
                    Email Address
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300"
                  >
                    SMTP Host
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300"
                  >
                    SMTP Port
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300"
                  >
                    SMTP User
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pagedData.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-4 text-center text-gray-500 text-sm"
                    >
                      No email settings found.
                    </td>
                  </tr>
                )}
                {pagedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300 text-sm text-gray-900">
                      {item.email}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300 text-sm text-gray-900">
                      {item.smtpHost}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300 text-sm text-gray-900">
                      {item.smtpPort}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300 text-sm text-gray-900">
                      {item.smtpUser}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                          item.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="inline-flex items-center px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        title="Edit"
                      >
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                        title="Delete"
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
            className="mt-4 flex justify-center items-center space-x-2"
            aria-label="Pagination"
          >
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border border-gray-300 ${
                currentPage === 1
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
              aria-label="First Page"
            >
              <i className="fa fa-angle-double-left" aria-hidden="true"></i>
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border border-gray-300 ${
                currentPage === 1
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
              aria-label="Previous Page"
            >
              <i className="fa fa-angle-left" aria-hidden="true"></i>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                aria-current={page === currentPage ? "page" : undefined}
                className={`px-3 py-1 rounded border border-gray-300 ${
                  page === currentPage
                    ? "bg-blue-600 text-white cursor-default"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border border-gray-300 ${
                currentPage === totalPages
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
              aria-label="Next Page"
            >
              <i className="fa fa-angle-right" aria-hidden="true"></i>
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border border-gray-300 ${
                currentPage === totalPages
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
              aria-label="Last Page"
            >
              <i className="fa fa-angle-double-right" aria-hidden="true"></i>
            </button>
          </nav>
        </section>
      </div>
    </div>
  );
}