import React, { useState, useEffect } from "react";

const companyDataJSON = [
  {
    id: 1,
    companyName: "Dreams Technologies",
    email: "info@dreamspos.com",
    phone: "+1 234 567 890",
    address: "1234 Elm Street, Springfield",
    city: "Springfield",
    country: "USA",
    zipCode: "62704",
    status: "Active",
  },
  {
    id: 2,
    companyName: "Tech Innovations",
    email: "contact@techinnovations.com",
    phone: "+1 987 654 321",
    address: "5678 Oak Avenue, Metropolis",
    city: "Metropolis",
    country: "USA",
    zipCode: "10001",
    status: "Inactive",
  },
  {
    id: 3,
    companyName: "Future Solutions",
    email: "support@futuresolutions.com",
    phone: "+44 20 7946 0958",
    address: "221B Baker Street, London",
    city: "London",
    country: "UK",
    zipCode: "NW1 6XE",
    status: "Active",
  },
  {
    id: 4,
    companyName: "Global Tech",
    email: "hello@globaltech.com",
    phone: "+91 22 1234 5678",
    address: "12 MG Road, Mumbai",
    city: "Mumbai",
    country: "India",
    zipCode: "400001",
    status: "Active",
  },
  {
    id: 5,
    companyName: "Innovatech",
    email: "info@innovatech.com",
    phone: "+61 2 9876 5432",
    address: "45 King Street, Sydney",
    city: "Sydney",
    country: "Australia",
    zipCode: "2000",
    status: "Inactive",
  },
  {
    id: 6,
    companyName: "NextGen Solutions",
    email: "contact@nextgensolutions.com",
    phone: "+49 30 123456",
    address: "Unter den Linden 5, Berlin",
    city: "Berlin",
    country: "Germany",
    zipCode: "10117",
    status: "Active",
  },
  {
    id: 7,
    companyName: "Alpha Corp",
    email: "alpha@alphacorp.com",
    phone: "+81 3 1234 5678",
    address: "1 Chome-1-2 Oshiage, Tokyo",
    city: "Tokyo",
    country: "Japan",
    zipCode: "131-0045",
    status: "Active",
  },
  {
    id: 8,
    companyName: "Beta Enterprises",
    email: "beta@betaenterprises.com",
    phone: "+33 1 2345 6789",
    address: "10 Rue de Rivoli, Paris",
    city: "Paris",
    country: "France",
    zipCode: "75001",
    status: "Inactive",
  },
  {
    id: 9,
    companyName: "Omega Systems",
    email: "contact@omegasystems.com",
    phone: "+55 11 91234 5678",
    address: "Av. Paulista, 1000, São Paulo",
    city: "São Paulo",
    country: "Brazil",
    zipCode: "01310-100",
    status: "Active",
  },
  {
    id: 10,
    companyName: "Delta Dynamics",
    email: "info@deltadynamics.com",
    phone: "+27 11 123 4567",
    address: "1 Nelson Mandela Square, Johannesburg",
    city: "Johannesburg",
    country: "South Africa",
    zipCode: "2196",
    status: "Active",
  },
];

const pageSize = 5;

export default function CompanySettings() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [companies, setCompanies] = useState(companyDataJSON);
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    status: "Active",
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Pagination calculations
  const totalPages = Math.ceil(companies.length / pageSize);
  const paginatedCompanies = companies.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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

    if (editId !== null) {
      // Edit existing
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === editId
            ? {
                ...c,
                ...form,
              }
            : c
        )
      );
      setEditId(null);
    } else {
      // Add new
      const newCompany = {
        id: companies.length
          ? Math.max(...companies.map((c) => c.id)) + 1
          : 1,
        ...form,
      };
      setCompanies((prev) => [...prev, newCompany]);
      // Go to last page if needed
      if ((companies.length + 1) / pageSize > totalPages) {
        setCurrentPage(totalPages + 1);
      }
    }
    setForm({
      companyName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      zipCode: "",
      status: "Active",
    });
  };

  const handleEdit = (id: number) => {
    const company = companies.find((c) => c.id === id);
    if (company) {
      setForm({
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
        (companies.length - 1) / pageSize < currentPage - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleRefresh = () => {
    setCompanies(companyDataJSON);
    setCurrentPage(1);
    setForm({
      companyName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      zipCode: "",
      status: "Active",
    });
    setEditId(null);
  };

  const handleReport = () => {
    // For demo, just alert JSON data
    alert(
      "Company Report:\n\n" +
        JSON.stringify(companies, null, 2)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">
        Company Settings
      </h1>

      {/* Form Section */}
      <section className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Company Information
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div className="flex flex-col">
            <label
              htmlFor="companyName"
              className="mb-1 font-medium text-gray-700"
            >
              Company Name
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              value={form.companyName}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter company name"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="mb-1 font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter email"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="phone"
              className="mb-1 font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="address"
              className="mb-1 font-medium text-gray-700"
            >
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={form.address}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter address"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="city"
              className="mb-1 font-medium text-gray-700"
            >
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={form.city}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter city"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="country"
              className="mb-1 font-medium text-gray-700"
            >
              Country
            </label>
            <input
              id="country"
              name="country"
              type="text"
              value={form.country}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter country"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="zipCode"
              className="mb-1 font-medium text-gray-700"
            >
              Zip Code
            </label>
            <input
              id="zipCode"
              name="zipCode"
              type="text"
              value={form.zipCode}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter zip code"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="status"
              className="mb-1 font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-end space-x-4 md:col-span-2 lg:col-span-3">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded flex items-center"
              aria-label={editId !== null ? "Update Company" : "Save Company"}
            >
              <i className="fa fa-save mr-2" aria-hidden="true"></i>
              {editId !== null ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm({
                  companyName: "",
                  email: "",
                  phone: "",
                  address: "",
                  city: "",
                  country: "",
                  zipCode: "",
                  status: "Active",
                });
                setEditId(null);
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded flex items-center"
              aria-label="Clear Form"
            >
              <i className="fa fa-refresh mr-2" aria-hidden="true"></i>Clear
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Company List
          </h2>
          <div className="space-x-2">
            <button
              onClick={handleReport}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center"
              aria-label="Generate Report"
              type="button"
            >
              <i className="fa fa-file-alt mr-2" aria-hidden="true"></i>Report
            </button>
            <button
              onClick={handleRefresh}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
              aria-label="Refresh Data"
              type="button"
            >
              <i className="fa fa-sync-alt mr-2" aria-hidden="true"></i>Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold border-b border-gray-300">
                  #
                </th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold border-b border-gray-300">
                  Company Name
                </th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold border-b border-gray-300">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold border-b border-gray-300">
                  Phone
                </th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold border-b border-gray-300">
                  Address
                </th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold border-b border-gray-300">
                  City
                </th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold border-b border-gray-300">
                  Country
                </th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold border-b border-gray-300">
                  Zip Code
                </th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold border-b border-gray-300">
                  Status
                </th>
                <th className="px-4 py-2 text-center text-gray-700 font-semibold border-b border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedCompanies.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-4 text-gray-500"
                  >
                    No company records found.
                  </td>
                </tr>
              )}
              {paginatedCompanies.map((company, idx) => (
                <tr
                  key={company.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                    {(currentPage - 1) * pageSize + idx + 1}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-900 font-medium">
                    {company.companyName}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                    {company.email}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                    {company.phone}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                    {company.address}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                    {company.city}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                    {company.country}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                    {company.zipCode}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        company.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {company.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center space-x-2">
                    <button
                      onClick={() => handleEdit(company.id)}
                      aria-label={`Edit ${company.companyName}`}
                      className="text-indigo-600 hover:text-indigo-900"
                      type="button"
                    >
                      <i className="fa fa-edit" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(company.id)}
                      aria-label={`Delete ${company.companyName}`}
                      className="text-red-600 hover:text-red-900"
                      type="button"
                    >
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <nav
          className="mt-6 flex justify-center items-center space-x-1"
          aria-label="Pagination"
        >
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-l border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label="Go to first page"
            type="button"
          >
            <i className="fa fa-angle-double-left" aria-hidden="true"></i>
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.max(prev - 1, 1))
            }
            disabled={currentPage === 1}
            className={`px-3 py-1 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label="Go to previous page"
            type="button"
          >
            <i className="fa fa-angle-left" aria-hidden="true"></i>
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                aria-current={page === currentPage ? "page" : undefined}
                className={`px-3 py-1 border border-gray-300 hover:bg-indigo-600 hover:text-white ${
                  page === currentPage
                    ? "bg-indigo-600 text-white font-semibold"
                    : "bg-white text-gray-700"
                }`}
                type="button"
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label="Go to next page"
            type="button"
          >
            <i className="fa fa-angle-right" aria-hidden="true"></i>
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-r border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label="Go to last page"
            type="button"
          >
            <i className="fa fa-angle-double-right" aria-hidden="true"></i>
          </button>
        </nav>
      </section>
    </div>
  );
}