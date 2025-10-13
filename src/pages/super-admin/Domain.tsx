import React, { useEffect, useState, useMemo } from "react";
import { apiService } from "@/services/ApiService";

const domainTypes = ["Primary", "Secondary"];
const domainStatuses = ["Active", "Inactive"];

export default function Domain() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form state for adding/editing domain
  const [form, setForm] = useState({
    domainName: "",
    domainUrl: "",
    domainType: "Primary",
    domainStatus: "Active",
    domainExpireDate: "",
    domainOwner: "",
  });

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Data state
  const [domains, setDomains] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Domain");
    if (response.status.code === "S") {
      setData(response.result);
      setDomains(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(domains.length / itemsPerPage);
  const paginatedDomains = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return domains.slice(start, start + itemsPerPage);
  }, [currentPage, domains]);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = () => {
    if (
      !form.domainName.trim() ||
      !form.domainUrl.trim() ||
      !form.domainExpireDate.trim() ||
      !form.domainOwner.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (isEditing && editId !== null) {
      setDomains((prev) =>
        prev.map((d) => (d.id === editId ? { ...d, ...form } : d))
      );
      setIsEditing(false);
      setEditId(null);
    } else {
      const newDomain = {
        id: domains.length ? Math.max(...domains.map((d) => d.id)) + 1 : 1,
        ...form,
      };
      setDomains((prev) => [...prev, newDomain]);
    }
    setForm({
      domainName: "",
      domainUrl: "",
      domainType: "Primary",
      domainStatus: "Active",
      domainExpireDate: "",
      domainOwner: "",
    });
  };

  const handleEdit = (id: number) => {
    const domain = domains.find((d) => d.id === id);
    if (domain) {
      setForm({
        domainName: domain.domainName,
        domainUrl: domain.domainUrl,
        domainType: domain.domainType,
        domainStatus: domain.domainStatus,
        domainExpireDate: domain.domainExpireDate,
        domainOwner: domain.domainOwner,
      });
      setIsEditing(true);
      setEditId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this domain?")) {
      setDomains((prev) => prev.filter((d) => d.id !== id));
      // Adjust page if needed
      if (
        (currentPage - 1) * itemsPerPage >=
        domains.length - 1 /* after deletion */
      ) {
        setCurrentPage((p) => Math.max(p - 1, 1));
      }
    }
  };

  const handleRefresh = () => {
    setDomains(data);
    setCurrentPage(1);
    setForm({
      domainName: "",
      domainUrl: "",
      domainType: "Primary",
      domainStatus: "Active",
      domainExpireDate: "",
      domainOwner: "",
    });
    setIsEditing(false);
    setEditId(null);
  };

  const handleReport = () => {
    // For demo, just alert JSON data
    alert(JSON.stringify(domains, null, 2));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <title>Domain Management - DreamsPOS</title>

      <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Domain</h1>
        </header>

        {/* Domain Form Section */}
        <section className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add / Edit Domain</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            noValidate
          >
            <div>
              <label
                htmlFor="domainName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Domain Name <span className="text-red-600">*</span>
              </label>
              <input
                id="domainName"
                name="domainName"
                type="text"
                value={form.domainName}
                onChange={handleInputChange}
                placeholder="Enter domain name"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="domainUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Domain URL <span className="text-red-600">*</span>
              </label>
              <input
                id="domainUrl"
                name="domainUrl"
                type="url"
                value={form.domainUrl}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="domainType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Domain Type <span className="text-red-600">*</span>
              </label>
              <select
                id="domainType"
                name="domainType"
                value={form.domainType}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                {domainTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="domainStatus"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Domain Status <span className="text-red-600">*</span>
              </label>
              <select
                id="domainStatus"
                name="domainStatus"
                value={form.domainStatus}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                {domainStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="domainExpireDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Domain Expire Date <span className="text-red-600">*</span>
              </label>
              <input
                id="domainExpireDate"
                name="domainExpireDate"
                type="date"
                value={form.domainExpireDate}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="domainOwner"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Domain Owner <span className="text-red-600">*</span>
              </label>
              <input
                id="domainOwner"
                name="domainOwner"
                type="text"
                value={form.domainOwner}
                onChange={handleInputChange}
                placeholder="Enter domain owner"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="md:col-span-3 flex space-x-4 pt-4">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <i className="fas fa-save mr-2"></i>
                {isEditing ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm({
                    domainName: "",
                    domainUrl: "",
                    domainType: "Primary",
                    domainStatus: "Active",
                    domainExpireDate: "",
                    domainOwner: "",
                  });
                  setIsEditing(false);
                  setEditId(null);
                }}
                className="inline-flex items-center px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <i className="fas fa-times mr-2"></i>Cancel
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <i className="fas fa-sync-alt mr-2"></i>Refresh
              </button>
              <button
                type="button"
                onClick={handleReport}
                className="inline-flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <i className="fas fa-file-alt mr-2"></i>Report
              </button>
            </div>
          </form>
        </section>

        {/* Domain List Section */}
        <section className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Domain List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Domain Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Domain URL
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Domain Type
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Domain Status
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Expire Date
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Domain Owner
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {paginatedDomains.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-4 text-gray-500 italic"
                    >
                      No domains found.
                    </td>
                  </tr>
                ) : (
                  paginatedDomains.map((domain) => (
                    <tr key={domain.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {domain.domainName}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-indigo-600 underline">
                        <a
                          href={domain.domainUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-indigo-800"
                        >
                          {domain.domainUrl}
                        </a>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                        {domain.domainType}
                      </td>
                      <td
                        className={`px-4 py-2 whitespace-nowrap text-sm font-semibold ${
                          domain.domainStatus === "Active"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {domain.domainStatus}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                        {domain.domainExpireDate}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                        {domain.domainOwner}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-center text-sm space-x-2">
                        <button
                          onClick={() => handleEdit(domain.id)}
                          title="Edit"
                          className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(domain.id)}
                          title="Delete"
                          className="text-red-600 hover:text-red-900 focus:outline-none"
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

          {/* Pagination Controls */}
          <nav
            className="mt-6 flex justify-center items-center space-x-2"
            aria-label="Pagination"
          >
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border border-gray-300 ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              aria-label="First Page"
            >
              <i className="fas fa-angle-double-left"></i>
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border border-gray-300 ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              aria-label="Previous Page"
            >
              <i className="fas fa-angle-left"></i>
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  aria-current={currentPage === pageNum ? "page" : undefined}
                  className={`px-3 py-1 rounded border border-gray-300 ${
                    currentPage === pageNum
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border border-gray-300 ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              aria-label="Next Page"
            >
              <i className="fas fa-angle-right"></i>
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border border-gray-300 ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              aria-label="Last Page"
            >
              <i className="fas fa-angle-double-right"></i>
            </button>
          </nav>
        </section>
      </div>
    </div>
  );
}