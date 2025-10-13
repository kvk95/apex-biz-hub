import { apiService } from "@/services/ApiService";
import React, { useState, useEffect } from "react";

export default function SocialAuthentication() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("SocialAuthentication");
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

  // Pagination state
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Form state for adding/editing social auth (simulate)
  const [form, setForm] = useState({
    socialName: "",
    clientId: "",
    clientSecret: "",
    redirectUrl: "",
    status: "Active",
  });

  // Handlers for form inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Simulate refresh and report buttons
  const handleRefresh = () => {
    alert("Refresh clicked - data reloaded");
  };

  const handleReport = () => {
    alert("Report generated");
  };

  // Simulate save button
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Save clicked - form data submitted");
  };

  return (
    <>
      <title>Social Authentication - DreamsPOS</title>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-700">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Social Authentication</h1>
            <div className="space-x-2">
              <button
                onClick={handleReport}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded shadow"
                title="Generate Report"
                type="button"
              >
                <i className="fas fa-file-alt mr-2"></i> Report
              </button>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded shadow"
                title="Refresh Data"
                type="button"
              >
                <i className="fas fa-sync-alt mr-2"></i> Refresh
              </button>
            </div>
          </div>

          {/* Form Section */}
          <section className="bg-white rounded shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Add / Edit Social Authentication</h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Social Name */}
                <div>
                  <label htmlFor="socialName" className="block mb-1 font-medium text-gray-700">
                    Social Name
                  </label>
                  <input
                    id="socialName"
                    name="socialName"
                    type="text"
                    value={form.socialName}
                    onChange={handleInputChange}
                    placeholder="Enter social platform name"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Client ID */}
                <div>
                  <label htmlFor="clientId" className="block mb-1 font-medium text-gray-700">
                    Client ID
                  </label>
                  <input
                    id="clientId"
                    name="clientId"
                    type="text"
                    value={form.clientId}
                    onChange={handleInputChange}
                    placeholder="Enter client ID"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Client Secret */}
                <div>
                  <label htmlFor="clientSecret" className="block mb-1 font-medium text-gray-700">
                    Client Secret
                  </label>
                  <input
                    id="clientSecret"
                    name="clientSecret"
                    type="password"
                    value={form.clientSecret}
                    onChange={handleInputChange}
                    placeholder="Enter client secret"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Redirect URL */}
                <div>
                  <label htmlFor="redirectUrl" className="block mb-1 font-medium text-gray-700">
                    Redirect URL
                  </label>
                  <input
                    id="redirectUrl"
                    name="redirectUrl"
                    type="url"
                    value={form.redirectUrl}
                    onChange={handleInputChange}
                    placeholder="Enter redirect URL"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block mb-1 font-medium text-gray-700">
                    Status
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
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow"
                >
                  <i className="fas fa-save mr-2"></i> Save
                </button>
              </div>
            </form>
          </section>

          {/* Table Section */}
          <section className="bg-white rounded shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Social Authentication List</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                      Social Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                      Client ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                      Client Secret
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                      Redirect URL
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentData.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                      <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300 flex items-center space-x-2">
                        <i className={`${item.socialIcon} text-lg text-blue-600 w-5`}></i>
                        <span>{item.socialName}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">{item.clientId}</td>
                      <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">{item.clientSecret}</td>
                      <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300 break-all max-w-xs">{item.redirectUrl}</td>
                      <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
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
                          type="button"
                          title="Edit"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            setForm({
                              socialName: item.socialName,
                              clientId: item.clientId,
                              clientSecret: item.clientSecret,
                              redirectUrl: item.redirectUrl,
                              status: item.status,
                            });
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => alert(`Delete action for ${item.socialName} (not implemented)`)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <nav
              className="mt-6 flex justify-between items-center"
              aria-label="Table navigation"
            >
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-semibold">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(currentPage * itemsPerPage, data.length)}
                </span>{" "}
                of <span className="font-semibold">{data.length}</span> entries
              </div>
              <ul className="inline-flex items-center -space-x-px">
                <li>
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-l border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 ${
                      currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    aria-label="First Page"
                  >
                    <i className="fas fa-angle-double-left"></i>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 ${
                      currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    aria-label="Previous Page"
                  >
                    <i className="fas fa-angle-left"></i>
                  </button>
                </li>
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <li key={page}>
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 border border-gray-300 hover:bg-blue-100 ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700"
                        }`}
                        aria-current={currentPage === page ? "page" : undefined}
                      >
                        {page}
                      </button>
                    </li>
                  );
                })}
                <li>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 ${
                      currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    aria-label="Next Page"
                  >
                    <i className="fas fa-angle-right"></i>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-r border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 ${
                      currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    aria-label="Last Page"
                  >
                    <i className="fas fa-angle-double-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </section>
        </div>
      </div>
    </>
  );
}