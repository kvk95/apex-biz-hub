import React, { useState, useEffect } from "react";

interface Supplier {
  id: number;
  supplierName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  status: "Active" | "Inactive";
}

const suppliersData: Supplier[] = [
  {
    id: 1,
    supplierName: "Dreams Technologies",
    contactPerson: "John Doe",
    phone: "123-456-7890",
    email: "contact@dreamspos.com",
    address: "123 Dream St.",
    city: "Dream City",
    country: "Dreamland",
    status: "Active",
  },
  {
    id: 2,
    supplierName: "Alpha Supplies",
    contactPerson: "Alice Smith",
    phone: "987-654-3210",
    email: "alice@alphasupplies.com",
    address: "456 Alpha Ave.",
    city: "Alphaville",
    country: "Alphaland",
    status: "Active",
  },
  {
    id: 3,
    supplierName: "Beta Traders",
    contactPerson: "Bob Johnson",
    phone: "555-123-4567",
    email: "bob@betatraders.com",
    address: "789 Beta Blvd.",
    city: "Betatown",
    country: "Betaland",
    status: "Inactive",
  },
  {
    id: 4,
    supplierName: "Gamma Corp",
    contactPerson: "Carol White",
    phone: "444-555-6666",
    email: "carol@gammacorp.com",
    address: "321 Gamma Rd.",
    city: "Gammaville",
    country: "Gammaland",
    status: "Active",
  },
  {
    id: 5,
    supplierName: "Delta Enterprises",
    contactPerson: "David Black",
    phone: "222-333-4444",
    email: "david@deltaenterprises.com",
    address: "654 Delta Ln.",
    city: "Deltatown",
    country: "Deltaland",
    status: "Inactive",
  },
  {
    id: 6,
    supplierName: "Epsilon Goods",
    contactPerson: "Eve Green",
    phone: "111-222-3333",
    email: "eve@epsilongoods.com",
    address: "987 Epsilon St.",
    city: "Epsilonia",
    country: "Epsilonland",
    status: "Active",
  },
  {
    id: 7,
    supplierName: "Zeta Wholesale",
    contactPerson: "Frank Blue",
    phone: "777-888-9999",
    email: "frank@zetawholesale.com",
    address: "159 Zeta Ave.",
    city: "Zetaville",
    country: "Zetaland",
    status: "Active",
  },
  {
    id: 8,
    supplierName: "Eta Distributors",
    contactPerson: "Grace Brown",
    phone: "333-444-5555",
    email: "grace@etadistributors.com",
    address: "753 Eta Blvd.",
    city: "Etatown",
    country: "Etaland",
    status: "Inactive",
  },
  {
    id: 9,
    supplierName: "Theta Imports",
    contactPerson: "Hank Gray",
    phone: "666-777-8888",
    email: "hank@thetaimports.com",
    address: "852 Theta Rd.",
    city: "Thetaville",
    country: "Thetaland",
    status: "Active",
  },
  {
    id: 10,
    supplierName: "Iota Supplies",
    contactPerson: "Ivy Violet",
    phone: "999-000-1111",
    email: "ivy@iotasupplies.com",
    address: "951 Iota Ln.",
    city: "Iotatown",
    country: "Iotaland",
    status: "Active",
  },
];

const pageSize = 5;

const Suppliers: React.FC = () => {
  // State for suppliers list and pagination
  const [suppliers, setSuppliers] = useState<Supplier[]>(suppliersData);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<Omit<Supplier, "id">>({
    supplierName: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    country: "",
    status: "Active",
  });

  // Pagination calculations
  const totalPages = Math.ceil(suppliers.length / pageSize);
  const paginatedSuppliers = suppliers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handlers
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      supplierName: supplier.supplierName,
      contactPerson: supplier.contactPerson,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      city: supplier.city,
      country: supplier.country,
      status: supplier.status,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditingSupplier(null);
    setFormData({
      supplierName: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      country: "",
      status: "Active",
    });
  };

  const handleSave = () => {
    if (
      !formData.supplierName.trim() ||
      !formData.contactPerson.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim()
    ) {
      alert("Please fill in all required fields (Supplier Name, Contact Person, Phone, Email).");
      return;
    }
    if (editingSupplier) {
      // Update existing supplier
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === editingSupplier.id ? { ...editingSupplier, ...formData } : s
        )
      );
      setEditingSupplier(null);
    } else {
      // Add new supplier
      const newSupplier: Supplier = {
        id: suppliers.length ? Math.max(...suppliers.map((s) => s.id)) + 1 : 1,
        ...formData,
      };
      setSuppliers((prev) => [...prev, newSupplier]);
      setCurrentPage(totalPages); // Go to last page where new item is added
    }
    setFormData({
      supplierName: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      country: "",
      status: "Active",
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
      // Adjust current page if needed
      if ((suppliers.length - 1) % pageSize === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleRefresh = () => {
    setSuppliers(suppliersData);
    setCurrentPage(1);
    setEditingSupplier(null);
    setFormData({
      supplierName: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      country: "",
      status: "Active",
    });
  };

  const handleReport = () => {
    // For demo, just alert with JSON data of suppliers
    alert("Supplier Report:\n\n" + JSON.stringify(suppliers, null, 2));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">Suppliers</h1>

      {/* Supplier Form Section */}
      <section className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          {editingSupplier ? "Edit Supplier" : "Add Supplier"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          noValidate
        >
          {/* Supplier Name */}
          <div>
            <label
              htmlFor="supplierName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Supplier Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="supplierName"
              id="supplierName"
              value={formData.supplierName}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Supplier Name"
            />
          </div>

          {/* Contact Person */}
          <div>
            <label
              htmlFor="contactPerson"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contact Person <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="contactPerson"
              id="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Contact Person"
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Phone"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Email"
            />
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>
            <textarea
              name="address"
              id="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Address"
            />
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              City
            </label>
            <input
              type="text"
              name="city"
              id="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="City"
            />
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Country
            </label>
            <input
              type="text"
              name="country"
              id="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Country"
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-4 md:col-span-3 lg:col-span-3 pt-2">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded shadow transition"
            >
              {editingSupplier ? "Update" : "Save"}
            </button>
            {editingSupplier && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded shadow transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Suppliers Table Section */}
      <section className="bg-white rounded shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Suppliers List</h2>
          <div className="flex space-x-2">
            <button
              onClick={handleReport}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition text-sm"
              title="Generate Report"
              type="button"
            >
              Report
            </button>
            <button
              onClick={handleRefresh}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition text-sm"
              title="Refresh Data"
              type="button"
            >
              Refresh
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                  Supplier Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                  Contact Person
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                  Phone
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                  Address
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                  City
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                  Country
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                  Status
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedSuppliers.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-6 text-center text-gray-500 italic"
                  >
                    No suppliers found.
                  </td>
                </tr>
              ) : (
                paginatedSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300">
                      {supplier.supplierName}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300">
                      {supplier.contactPerson}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300">
                      {supplier.phone}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300">
                      {supplier.email}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300 max-w-xs truncate">
                      {supplier.address}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300">
                      {supplier.city}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300">
                      {supplier.country}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                          supplier.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {supplier.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-center space-x-2">
                      <button
                        onClick={() => handleEditClick(supplier)}
                        className="text-indigo-600 hover:text-indigo-900 font-semibold text-sm"
                        title="Edit Supplier"
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id)}
                        className="text-red-600 hover:text-red-900 font-semibold text-sm"
                        title="Delete Supplier"
                        type="button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <nav
          className="mt-4 flex justify-between items-center"
          aria-label="Table navigation"
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Previous Page"
            type="button"
          >
            &laquo; Prev
          </button>
          <div className="space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded border ${
                  page === currentPage
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
                aria-current={page === currentPage ? "page" : undefined}
                type="button"
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Next Page"
            type="button"
          >
            Next &raquo;
          </button>
        </nav>
      </section>
    </div>
  );
};

export default Suppliers;