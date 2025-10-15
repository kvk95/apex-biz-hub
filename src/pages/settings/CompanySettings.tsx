import { apiService } from "@/services/ApiService";
import React, { useEffect, useState } from "react";
import { Pagination } from "@/components/Pagination/Pagination";

const statusOptions = ["Active", "Inactive"];

export default function CompanySettings() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("CompanySettings");
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state for Add Section (preserved exactly)
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    status: statusOptions[0],
  });

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    companyName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    status: statusOptions[0],
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Synchronize data to local companies state for pagination
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    setCompanies(data);
  }, [data]);

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

  // Save handler for Add Section (Add new company)
  const handleSave = () => {
    if (
      !form.companyName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.country.trim() ||
      !form.zipCode.trim()
    ) {
      alert("Please fill all fields");
      return;
    }

    const newId = companies.length ? Math.max(...companies.map((c) => c.id)) + 1 : 1;
    setCompanies((prev) => [
      ...prev,
      {
        id: newId,
        companyName: form.companyName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        country: form.country.trim(),
        zipCode: form.zipCode.trim(),
        status: form.status,
      },
    ]);
    setForm({
      companyName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      zipCode: "",
      status: statusOptions[0],
    });
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const company = companies.find((c) => c.id === id);
    if (company) {
      setEditForm({
        companyName: company.companyName,
        email: company.email,
        phone: company.phone,
        address: company.address,
        city: company.city,
        country: company.country,
        zipCode: company.zipCode,
        status: company.status,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (
      !editForm.companyName.trim() ||
      !editForm.email.trim() ||
      !editForm.phone.trim() ||
      !editForm.address.trim() ||
      !editForm.city.trim() ||
      !editForm.country.trim() ||
      !editForm.zipCode.trim()
    ) {
      alert("Please fill all fields");
      return;
    }
    if (editId !== null) {
      setCompanies((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                companyName: editForm.companyName.trim(),
                email: editForm.email.trim(),
                phone: editForm.phone.trim(),
                address: editForm.address.trim(),
                city: editForm.city.trim(),
                country: editForm.country.trim(),
                zipCode: editForm.zipCode.trim(),
                status: editForm.status,
              }
            : item
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
    if (
      window.confirm(
        "Are you sure you want to delete this company record?"
      )
    ) {
      setCompanies((prev) => prev.filter((c) => c.id !== id));
      // Adjust page if needed
      if (
        (currentPage - 1) * itemsPerPage >= companies.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setForm({
      companyName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      zipCode: "",
      status: statusOptions[0],
    });
    setEditId(null);
    setCurrentPage(1);
  };

  const handleReport = () => {
    // For demo, just alert JSON data
    alert(
      "Company Report:\n\n" +
        JSON.stringify(companies, null, 2)
    );
  };

  // Calculate paginated data using Pagination component props
  const paginatedCompanies = companies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      <h1 className="text-2xl font-semibold mb-6">Company Settings</h1>

      {/* Form Section (Add Section) - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium mb-1"
            >
              Company Name
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              value={form.companyName}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter company name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium mb-1"
            >
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter phone number"
              required
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
              id="address"
              name="address"
              type="text"
              value={form.address}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter address"
              required
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
              id="city"
              name="city"
              type="text"
              value={form.city}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter city"
              required
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
              id="country"
              name="country"
              type="text"
              value={form.country}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter country"
              required
            />
          </div>

          <div>
            <label
              htmlFor="zipCode"
              className="block text-sm font-medium mb-1"
            >
              Zip Code
            </label>
            <input
              id="zipCode"
              name="zipCode"
              type="text"
              value={form.zipCode}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter zip code"
              required
            />
          </div>

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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
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
            <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
          </button>

          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
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
                  Company Name
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
                  Country
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Zip Code
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
              {paginatedCompanies.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No company records found.
                  </td>
                </tr>
              )}
              {paginatedCompanies.map((company, idx) => (
                <tr
                  key={company.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground font-semibold">
                    {company.companyName}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {company.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {company.phone}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {company.address}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {company.city}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {company.country}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {company.zipCode}
                  </td>
                  <td className="px-4 py-3 text-sm">
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
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(company.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit ${company.companyName}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(company.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete ${company.companyName}`}
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
          totalItems={companies.length}
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
                  Company Name
                </label>
                <input
                  type="text"
                  id="editCompanyName"
                  name="companyName"
                  value={editForm.companyName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label
                  htmlFor="editEmail"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="editEmail"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter email"
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
                  placeholder="Enter phone number"
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
                  htmlFor="editZipCode"
                  className="block text-sm font-medium mb-1"
                >
                  Zip Code
                </label>
                <input
                  type="text"
                  id="editZipCode"
                  name="zipCode"
                  value={editForm.zipCode}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter zip code"
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