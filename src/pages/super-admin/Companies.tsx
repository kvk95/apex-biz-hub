import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";

const pageSizeOptions = [5, 10, 15];

export default function Companies() {
  // Page title as in reference page: "Companies"
  React.useEffect(() => {
    document.title = "Companies";
  }, []);

  // Form state for Add/Edit company
  const initialFormState = {
    id: null,
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    status: "Active",
  };
  const [form, setForm] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Companies");
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

  // Filter companies by search term (company name or contact person)
  const filteredCompanies = useMemo(() => {
    if (!searchTerm.trim()) return data;
    return data.filter(
      (c) =>
        c.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCompanies.length / pageSize);
  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCompanies.slice(start, start + pageSize);
  }, [filteredCompanies, currentPage, pageSize]);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.companyName.trim() ||
      !form.contactPerson.trim() ||
      !form.email.trim()
    ) {
      alert("Please fill in required fields: Company Name, Contact Person, Email");
      return;
    }
    if (isEditing) {
      setData((prev) =>
        prev.map((c) => (c.id === form.id ? { ...form } : c))
      );
    } else {
      const newId =
        data.length > 0 ? Math.max(...data.map((c) => c.id)) + 1 : 1;
      setData((prev) => [...prev, { ...form, id: newId }]);
    }
    setForm(initialFormState);
    setIsEditing(false);
  };

  const handleEdit = (id: number) => {
    const company = data.find((c) => c.id === id);
    if (company) {
      setForm(company);
      setIsEditing(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      setData((prev) => prev.filter((c) => c.id !== id));
      // Reset page if deleting last item on last page
      if (
        (filteredCompanies.length - 1) % pageSize === 0 &&
        currentPage === totalPages &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleRefresh = () => {
    loadData();
    setSearchTerm("");
    setCurrentPage(1);
    setForm(initialFormState);
    setIsEditing(false);
  };

  const handleReport = () => {
    // For demo: just alert JSON of current companies
    alert(
      "Company Report:\n\n" +
        JSON.stringify(data, null, 2) +
        "\n\n(Report functionality placeholder)"
    );
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-800">
      {/* Title */}
      <h1 className="text-3xl font-semibold mb-6">Companies</h1>

      {/* Company Form Section */}
      <section className="bg-white rounded shadow p-6 mb-8 max-w-7xl mx-auto">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Company Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={form.companyName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="contactPerson"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contact Person <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="contactPerson"
                name="contactPerson"
                value={form.contactPerson}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={form.address}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={form.city}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={form.state}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="zip"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Zip Code
              </label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={form.zip}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={form.country}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
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
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <i className="fas fa-save mr-2" aria-hidden="true"></i>
                {isEditing ? "Update" : "Save"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setForm(initialFormState);
                    setIsEditing(false);
                  }}
                  className="ml-3 inline-flex items-center bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <i className="fas fa-times mr-2" aria-hidden="true"></i>Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </section>

      {/* Controls Section */}
      <section className="max-w-7xl mx-auto mb-4 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReport}
            className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            title="Generate Report"
          >
            <i className="fas fa-file-alt mr-2" aria-hidden="true"></i>Report
          </button>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Refresh Data"
          >
            <i className="fas fa-sync-alt mr-2" aria-hidden="true"></i>Refresh
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search by Company or Contact"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Search companies"
          />
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Select page size"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Companies Table Section */}
      <section className="max-w-7xl mx-auto bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Company Name
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Contact Person
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Email
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Phone
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Address
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                City
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                State
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Zip
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Country
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
            {loading ? (
              <tr>
                <td
                  colSpan={11}
                  className="px-4 py-6 text-center text-gray-500 italic"
                >
                  Loading...
                </td>
              </tr>
            ) : paginatedCompanies.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="px-4 py-6 text-center text-gray-500 italic"
                >
                  No companies found.
                </td>
              </tr>
            ) : (
              paginatedCompanies.map((company) => (
                <tr
                  key={company.id}
                  className={
                    company.status === "Inactive"
                      ? "bg-red-50"
                      : "bg-white hover:bg-indigo-50"
                  }
                >
                  <td className="px-4 py-3 whitespace-nowrap">{company.companyName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{company.contactPerson}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{company.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{company.phone}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{company.address}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{company.city}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{company.state}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{company.zip}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{company.country}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={
                        company.status === "Active"
                          ? "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800"
                          : "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800"
                      }
                    >
                      {company.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center space-x-2">
                    <button
                      onClick={() => handleEdit(company.id)}
                      title="Edit"
                      className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                    >
                      <i className="fas fa-edit" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(company.id)}
                      title="Delete"
                      className="text-red-600 hover:text-red-900 focus:outline-none"
                    >
                      <i className="fas fa-trash-alt" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <nav
          className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3"
          aria-label="Pagination"
        >
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                currentPage === totalPages || totalPages === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * pageSize + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, filteredCompanies.length)}
                </span>{" "}
                of <span className="font-medium">{filteredCompanies.length}</span>{" "}
                results
              </p>
            </div>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-end space-x-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              aria-label="Go to first page"
              className={`relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <i className="fas fa-angle-double-left" aria-hidden="true"></i>
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Go to previous page"
              className={`relative inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <i className="fas fa-angle-left" aria-hidden="true"></i>
            </button>

            {/* Show up to 5 page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 2 && page <= currentPage + 2)
              )
              .map((page, idx, arr) => {
                // Insert ellipsis if gap > 1 between pages
                if (
                  idx > 0 &&
                  page - arr[idx - 1] > 1
                ) {
                  return (
                    <React.Fragment key={`ellipsis-${page}`}>
                      <span className="inline-flex items-center px-2 py-2 text-gray-500 select-none">
                        &hellip;
                      </span>
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        aria-current={page === currentPage ? "page" : undefined}
                        className={`relative inline-flex items-center border border-gray-300 bg-white px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          page === currentPage
                            ? "z-10 bg-indigo-600 text-white border-indigo-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                }
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`relative inline-flex items-center border border-gray-300 bg-white px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      page === currentPage
                        ? "z-10 bg-indigo-600 text-white border-indigo-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              aria-label="Go to next page"
              className={`relative inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                currentPage === totalPages || totalPages === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <i className="fas fa-angle-right" aria-hidden="true"></i>
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              aria-label="Go to last page"
              className={`relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                currentPage === totalPages || totalPages === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <i className="fas fa-angle-double-right" aria-hidden="true"></i>
            </button>
          </div>
        </nav>
      </section>
    </div>
  );
}