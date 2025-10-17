import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const statusOptions = ["Active", "Inactive"];

export default function Companies() {
  // Form state for Add Section (preserved exactly)
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
    status: statusOptions[0],
  };
  const [form, setForm] = useState(initialFormState);

  // Data state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(initialFormState);
  const [editId, setEditId] = useState<number | null>(null);

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

  // Calculate paginated data using Pagination component props
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers for Add Section form inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Add Section (Add new company)
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
    const newId = data.length > 0 ? Math.max(...data.map((c) => c.id)) + 1 : 1;
    setData((prev) => [...prev, { ...form, id: newId }]);
    setForm(initialFormState);
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const company = data.find((c) => c.id === id);
    if (company) {
      setEditForm(company);
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (
      !editForm.companyName.trim() ||
      !editForm.contactPerson.trim() ||
      !editForm.email.trim()
    ) {
      alert("Please fill in required fields: Company Name, Contact Person, Email");
      return;
    }
    if (editId !== null) {
      setData((prev) =>
        prev.map((c) => (c.id === editId ? { ...editForm, id: editId } : c))
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
    if (window.confirm("Are you sure you want to delete this company?")) {
      setData((prev) => prev.filter((c) => c.id !== id));
      // Reset page if deleting last item on last page
      if (
        (filteredCompanies.length - 1) % itemsPerPage === 0 &&
        currentPage > 1 &&
        currentPage === Math.ceil(filteredCompanies.length / itemsPerPage)
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setForm(initialFormState);
    setSearchTerm("");
    setCurrentPage(1);
    setEditId(null);
    setIsEditModalOpen(false);
  };

  const handleReport = () => {
    alert(
      "Company Report:\n\n" +
        JSON.stringify(data, null, 2) +
        "\n\n(Report functionality placeholder)"
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Title */}
      <h1 className="text-lg font-semibold mb-6">Companies</h1>

      {/* Company Form Section (Add Section preserved exactly) */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium mb-1"
              >
                Company Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={form.companyName}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter company name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="contactPerson"
                className="block text-sm font-medium mb-1"
              >
                Contact Person <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="contactPerson"
                name="contactPerson"
                value={form.contactPerson}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter contact person"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1"
              >
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter email"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium mb-1"
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter phone"
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium mb-1"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={form.address}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter address"
              />
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium mb-1"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={form.city}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter city"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium mb-1"
              >
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={form.state}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter state"
              />
            </div>
            <div>
              <label
                htmlFor="zip"
                className="block text-sm font-medium mb-1"
              >
                Zip Code
              </label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={form.zip}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter zip code"
              />
            </div>
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium mb-1"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={form.country}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter country"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleInputChange}
                className="border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <i className="fa fa-save fa-light" aria-hidden="true"></i>
                Save
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Controls Section */}
      <section className="max-w-7xl mx-auto mb-4 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReport}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            title="Generate Report"
          >
            <i className="fa fa-file-text fa-light" aria-hidden="true"></i>
            Report
          </button>
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            title="Clear Form and Filters"
          >
            <i className="fa fa-refresh fa-light" aria-hidden="true"></i>
            Clear
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
            className="border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Search companies"
          />
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Select page size"
          >
            {[5, 10, 15].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Companies Table Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Company Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Contact Person
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Address
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  City
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  State
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Zip
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Country
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
              {loading ? (
                <tr>
                  <td
                    colSpan={11}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    Loading...
                  </td>
                </tr>
              ) : paginatedCompanies.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No companies found.
                  </td>
                </tr>
              ) : (
                paginatedCompanies.map((company) => (
                  <tr
                    key={company.id}
                    className={`border-b border-border hover:bg-muted/50 transition-colors text-sm text-gray-500 ${
                      company.status === "Inactive"
                        ? "bg-red-100 dark:bg-red-900 dark:text-red-200"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-2">{company.companyName}</td>
                    <td className="px-4 py-2">{company.contactPerson}</td>
                    <td className="px-4 py-2">{company.email}</td>
                    <td className="px-4 py-2">{company.phone}</td>
                    <td className="px-4 py-2">{company.address}</td>
                    <td className="px-4 py-2">{company.city}</td>
                    <td className="px-4 py-2">{company.state}</td>
                    <td className="px-4 py-2">{company.zip}</td>
                    <td className="px-4 py-2">{company.country}</td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          company.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {company.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center space-x-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleEdit(company.id)}
                        aria-label={`Edit company ${company.companyName}`}
                        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
                      >
                        <i className="fa fa-edit fa-light" aria-hidden="true"></i>
                        <span className="sr-only">Edit record</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(company.id)}
                        aria-label={`Delete company ${company.companyName}`}
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
          totalItems={filteredCompanies.length}
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
              Edit Company
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="editCompanyName"
                  className="block text-sm font-medium mb-1"
                >
                  Company Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="editCompanyName"
                  name="companyName"
                  value={editForm.companyName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter company name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="editContactPerson"
                  className="block text-sm font-medium mb-1"
                >
                  Contact Person <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="editContactPerson"
                  name="contactPerson"
                  value={editForm.contactPerson}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter contact person"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="editEmail"
                  className="block text-sm font-medium mb-1"
                >
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="editEmail"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter email"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="editPhone"
                  className="block text-sm font-medium mb-1"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="editPhone"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter phone"
                />
              </div>
              <div>
                <label
                  htmlFor="editAddress"
                  className="block text-sm font-medium mb-1"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="editAddress"
                  name="address"
                  value={editForm.address}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter address"
                />
              </div>
              <div>
                <label
                  htmlFor="editCity"
                  className="block text-sm font-medium mb-1"
                >
                  City
                </label>
                <input
                  type="text"
                  id="editCity"
                  name="city"
                  value={editForm.city}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label
                  htmlFor="editState"
                  className="block text-sm font-medium mb-1"
                >
                  State
                </label>
                <input
                  type="text"
                  id="editState"
                  name="state"
                  value={editForm.state}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter state"
                />
              </div>
              <div>
                <label
                  htmlFor="editZip"
                  className="block text-sm font-medium mb-1"
                >
                  Zip Code
                </label>
                <input
                  type="text"
                  id="editZip"
                  name="zip"
                  value={editForm.zip}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter zip code"
                />
              </div>
              <div>
                <label
                  htmlFor="editCountry"
                  className="block text-sm font-medium mb-1"
                >
                  Country
                </label>
                <input
                  type="text"
                  id="editCountry"
                  name="country"
                  value={editForm.country}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter country"
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