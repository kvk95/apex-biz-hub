import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import React, { useEffect, useState } from "react";

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zip: string;
  status: "Active" | "Inactive";
};

const pageSize = 5;

const Customers = () => {  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Form state for adding/editing customer
  const [form, setForm] = useState<Omit<Customer, "id">>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zip: "",
    status: "Active",
  });

  // Editing mode state
  const [editingId, setEditingId] = useState<number | null>(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Customers");
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

  // Data state (simulate dynamic data)
  const [customers, setCustomers] = useState<Customer[]>(data);

  // Pagination calculations
  const totalPages = Math.ceil(customers.length / pageSize);
  const paginatedCustomers = customers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handlers
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSave() {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.country.trim() ||
      !form.zip.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (editingId !== null) {
      // Edit existing
      setCustomers((prev) =>
        prev.map((c) => (c.id === editingId ? { id: editingId, ...form } : c))
      );
      setEditingId(null);
    } else {
      // Add new
      const newId =
        customers.length > 0 ? Math.max(...customers.map((c) => c.id)) + 1 : 1;
      setCustomers((prev) => [...prev, { id: newId, ...form }]);
    }
    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      zip: "",
      status: "Active",
    });
  }

  function handleEdit(id: number) {
    const cust = customers.find((c) => c.id === id);
    if (!cust) return;
    setForm({
      name: cust.name,
      email: cust.email,
      phone: cust.phone,
      address: cust.address,
      city: cust.city,
      country: cust.country,
      zip: cust.zip,
      status: cust.status,
    });
    setEditingId(id);
  }

  function handleDelete(id: number) {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      // If deleting last item on page, go back a page if possible
      if (
        (currentPage - 1) * pageSize >= customers.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  }

  function handleRefresh() {
    // Reset to initial data
    setCustomers(data);
    setCurrentPage(1);
    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      zip: "",
      status: "Active",O
    });
    setEditingId(null);
  }

  function handleReport() {
    // For demo, just alert JSON of customers
    alert("Customer Report:\n\n" + JSON.stringify(customers, null, 2));
  }

  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  return (
    <>
      <title>DreamsPOS - Customers</title>

      <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title */}
          <h1 className="text-3xl font-semibold mb-6">Customers</h1>

          {/* Form Section */}
          <section className="bg-white rounded shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Add / Edit Customer</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              noValidate
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Customer Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter customer name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter email"
                  required
                />
              </div>

              {/* Phone */}
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
                  className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter phone number"
                  required
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
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleInputChange}
                  className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter address"
                  required
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
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleInputChange}
                  className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter city"
                  required
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
                  id="country"
                  name="country"
                  value={form.country}
                  onChange={handleInputChange}
                  className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter country"
                  required
                />
              </div>

              {/* Zip Code */}
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
                  className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter zip code"
                  required
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
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleInputChange}
                  className="block w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="md:col-span-3 flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded shadow"
                >
                  {editingId !== null ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForm({
                      name: "",
                      email: "",
                      phone: "",
                      address: "",
                      city: "",
                      country: "",
                      zip: "",
                      status: "Active",
                    });
                    setEditingId(null);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded shadow"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded shadow"
                >
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={handleReport}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow"
                >
                  Report
                </button>
              </div>
            </form>
          </section>

          {/* Customers Table Section */}
          <section className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Customer List</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-700">#</th>
                    <th className="px-4 py-3 font-medium text-gray-700">
                      Name
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-700">
                      Email
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-700">
                      Phone
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-700">
                      Address
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-700">City</th>
                    <th className="px-4 py-3 font-medium text-gray-700">
                      Country
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-700">Zip</th>
                    <th className="px-4 py-3 font-medium text-gray-700">
                      Status
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-700 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedCustomers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={10}
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No customers found.
                      </td>
                    </tr>
                  ) : (
                    paginatedCustomers.map((customer, idx) => (
                      <tr
                        key={customer.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3">{(currentPage - 1) * pageSize + idx + 1}</td>
                        <td className="px-4 py-3">{customer.name}</td>
                        <td className="px-4 py-3">{customer.email}</td>
                        <td className="px-4 py-3">{customer.phone}</td>
                        <td className="px-4 py-3">{customer.address}</td>
                        <td className="px-4 py-3">{customer.city}</td>
                        <td className="px-4 py-3">{customer.country}</td>
                        <td className="px-4 py-3">{customer.zip}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              customer.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {customer.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center space-x-2">
                          <button
                            onClick={() => handleEdit(customer.id)}
                            className="text-indigo-600 hover:text-indigo-900 font-semibold"
                            aria-label={`Edit customer ${customer.name}`}
                            type="button"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(customer.id)}
                            className="text-red-600 hover:text-red-900 font-semibold"
                            aria-label={`Delete customer ${customer.name}`}
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

            {/* Pagination Controls */}
            <nav
              className="mt-6 flex justify-between items-center"
              aria-label="Pagination"
            >
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Previous
              </button>

              <div className="space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      aria-current={page === currentPage ? "page" : undefined}
                      className={`px-3 py-1 rounded border ${
                        page === currentPage
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "border-gray-300 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Next
              </button>
            </nav>
          </section>
        </div>
      </div>
    </>
  );
}


export default Customers;