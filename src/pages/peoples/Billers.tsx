import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

interface Biller {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  gstNo: string;
  createdAt: string;
}

const Billers: React.FC = () => {
  // Form state for Add Section
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    gstNo: "",
    createdAt: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Data state
  const [billers, setBillers] = useState<Biller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    gstNo: "",
    createdAt: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Load data from API
  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Billers");
    if (response.status.code === "S") {
      setBillers(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers for Add Section form inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Add Section
  const handleSave = () => {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.country.trim() ||
      !form.postalCode.trim() ||
      !form.gstNo.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const newBiller: Biller = {
      id: billers.length ? Math.max(...billers.map((b) => b.id)) + 1 : 1,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      country: form.country.trim(),
      postalCode: form.postalCode.trim(),
      gstNo: form.gstNo.trim(),
      createdAt: form.createdAt || new Date().toISOString().split("T")[0],
    };
    setBillers((prev) => [...prev, newBiller]);
    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      postalCode: "",
      gstNo: "",
      createdAt: "",
    });
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const biller = billers.find((b) => b.id === id);
    if (biller) {
      setEditForm({
        name: biller.name,
        email: biller.email,
        phone: biller.phone,
        address: biller.address,
        city: biller.city,
        country: biller.country,
        postalCode: biller.postalCode,
        gstNo: biller.gstNo,
        createdAt: biller.createdAt,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (
      !editForm.name.trim() ||
      !editForm.email.trim() ||
      !editForm.phone.trim() ||
      !editForm.address.trim() ||
      !editForm.city.trim() ||
      !editForm.country.trim() ||
      !editForm.postalCode.trim() ||
      !editForm.gstNo.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      setBillers((prev) =>
        prev.map((b) =>
          b.id === editId
            ? {
                ...b,
                name: editForm.name.trim(),
                email: editForm.email.trim(),
                phone: editForm.phone.trim(),
                address: editForm.address.trim(),
                city: editForm.city.trim(),
                country: editForm.country.trim(),
                postalCode: editForm.postalCode.trim(),
                gstNo: editForm.gstNo.trim(),
                createdAt: editForm.createdAt || b.createdAt,
              }
            : b
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

  // Delete handler
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this biller?")) {
      setBillers((prev) => prev.filter((b) => b.id !== id));
      // Adjust page if needed
      if (
        (currentPage - 1) * itemsPerPage >= billers.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      postalCode: "",
      gstNo: "",
      createdAt: "",
    });
    setEditId(null);
    setCurrentPage(1);
  };

  // Report handler
  const handleReport = () => {
    alert("Report Data:\n" + JSON.stringify(billers, null, 2));
  };

  // Calculate paginated data using Pagination component props
  const paginatedBillers = billers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Billers</h1>

      {/* Form Section (Add Section) - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Biller</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
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

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter phone"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              Address <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={form.address}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter address"
              required
            />
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-1">
              City <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={form.city}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter city"
              required
            />
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-1">
              Country <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={form.country}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter country"
              required
            />
          </div>

          {/* Postal Code */}
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium mb-1">
              Postal Code <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={form.postalCode}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter postal code"
              required
            />
          </div>

          {/* GST No */}
          <div>
            <label htmlFor="gstNo" className="block text-sm font-medium mb-1">
              GST No <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="gstNo"
              name="gstNo"
              value={form.gstNo}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter GST No"
              required
            />
          </div>

          {/* Created At */}
          <div>
            <label htmlFor="createdAt" className="block text-sm font-medium mb-1">
              Created At
            </label>
            <input
              type="date"
              id="createdAt"
              name="createdAt"
              value={form.createdAt}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
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
          <button
            onClick={handleReport}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
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
                  Name
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
                  Postal Code
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  GST No
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Created At
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
              ) : paginatedBillers.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No billers found.
                  </td>
                </tr>
              ) : (
                paginatedBillers.map((biller, idx) => (
                  <tr
                    key={biller.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {biller.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {biller.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {biller.phone}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {biller.address}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {biller.city}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {biller.country}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {biller.postalCode}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {biller.gstNo}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {biller.createdAt}
                    </td>
                    <td className="px-4 py-3 text-center text-sm space-x-3">
                      <button
                        onClick={() => handleEdit(biller.id)}
                        className="text-primary hover:text-primary/80 transition-colors"
                        aria-label={`Edit biller ${biller.name}`}
                        type="button"
                      >
                        <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(biller.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                        aria-label={`Delete biller ${biller.name}`}
                        type="button"
                      >
                        <i className="fa fa-trash fa-light" aria-hidden="true"></i>
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
          totalItems={billers.length}
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
              Edit Biller
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="editName"
                  className="block text-sm font-medium mb-1"
                >
                  Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="editName"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter name"
                  required
                />
              </div>

              {/* Email */}
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

              {/* Phone */}
              <div>
                <label
                  htmlFor="editPhone"
                  className="block text-sm font-medium mb-1"
                >
                  Phone <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  id="editPhone"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter phone"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="editAddress"
                  className="block text-sm font-medium mb-1"
                >
                  Address <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="editAddress"
                  name="address"
                  value={editForm.address}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter address"
                  required
                />
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="editCity"
                  className="block text-sm font-medium mb-1"
                >
                  City <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="editCity"
                  name="city"
                  value={editForm.city}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter city"
                  required
                />
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="editCountry"
                  className="block text-sm font-medium mb-1"
                >
                  Country <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="editCountry"
                  name="country"
                  value={editForm.country}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter country"
                  required
                />
              </div>

              {/* Postal Code */}
              <div>
                <label
                  htmlFor="editPostalCode"
                  className="block text-sm font-medium mb-1"
                >
                  Postal Code <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="editPostalCode"
                  name="postalCode"
                  value={editForm.postalCode}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter postal code"
                  required
                />
              </div>

              {/* GST No */}
              <div>
                <label
                  htmlFor="editGstNo"
                  className="block text-sm font-medium mb-1"
                >
                  GST No <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="editGstNo"
                  name="gstNo"
                  value={editForm.gstNo}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter GST No"
                  required
                />
              </div>

              {/* Created At */}
              <div>
                <label
                  htmlFor="editCreatedAt"
                  className="block text-sm font-medium mb-1"
                >
                  Created At
                </label>
                <input
                  type="date"
                  id="editCreatedAt"
                  name="createdAt"
                  value={editForm.createdAt}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
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
};

export default Billers;