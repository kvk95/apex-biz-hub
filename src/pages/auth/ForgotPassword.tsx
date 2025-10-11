import React, { useState } from "react";

const data = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 987 654 321",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    phone: "+1 555 666 777",
    status: "Active",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1 444 333 222",
    status: "Inactive",
  },
  {
    id: 5,
    name: "William Brown",
    email: "william.brown@example.com",
    phone: "+1 111 222 333",
    status: "Active",
  },
  {
    id: 6,
    name: "Olivia Wilson",
    email: "olivia.wilson@example.com",
    phone: "+1 777 888 999",
    status: "Active",
  },
  {
    id: 7,
    name: "James Taylor",
    email: "james.taylor@example.com",
    phone: "+1 222 333 444",
    status: "Inactive",
  },
  {
    id: 8,
    name: "Sophia Martinez",
    email: "sophia.martinez@example.com",
    phone: "+1 999 888 777",
    status: "Active",
  },
  {
    id: 9,
    name: "Benjamin Anderson",
    email: "benjamin.anderson@example.com",
    phone: "+1 666 555 444",
    status: "Inactive",
  },
  {
    id: 10,
    name: "Isabella Thomas",
    email: "isabella.thomas@example.com",
    phone: "+1 333 222 111",
    status: "Active",
  },
  {
    id: 11,
    name: "Daniel Jackson",
    email: "daniel.jackson@example.com",
    phone: "+1 123 456 789",
    status: "Active",
  },
  {
    id: 12,
    name: "Mia White",
    email: "mia.white@example.com",
    phone: "+1 987 654 321",
    status: "Inactive",
  },
];

const ITEMS_PER_PAGE = 5;

export default function ForgotPassword3() {
  const [email, setEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission logic
    alert(`Password reset link sent to ${email}`);
    setEmail("");
  };

  const handleRefresh = () => {
    // Simulate refresh action - no real data fetching here
    alert("Data refreshed");
  };

  const handleReport = () => {
    // Simulate report generation
    alert("Report generated");
  };

  const paginateData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <title>Forgot Password 3 | Dreams POS</title>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Forgot Password
          </h2>

          {/* Form Section */}
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto space-y-6"
            noValidate
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <i className="fa fa-envelope mr-2" aria-hidden="true"></i>
                Send Reset Link
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <i className="fa fa-refresh mr-2" aria-hidden="true"></i>
                Refresh
              </button>
              <button
                type="button"
                onClick={handleReport}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <i className="fa fa-file-alt mr-2" aria-hidden="true"></i>
                Report
              </button>
            </div>
          </form>

          {/* Data Table Section */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              User List
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-md">
                <thead className="bg-indigo-600">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      Phone
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="relative px-6 py-3"
                      aria-label="Actions"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginateData.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {user.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          className="text-indigo-600 hover:text-indigo-900"
                          aria-label={`Edit ${user.name}`}
                          onClick={() =>
                            alert(`Edit action for ${user.name} clicked`)
                          }
                        >
                          <i className="fa fa-edit"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <nav
              className="mt-6 flex justify-center items-center space-x-2"
              aria-label="Pagination"
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed bg-gray-100"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                aria-label="Previous page"
              >
                <i className="fa fa-chevron-left mr-1"></i> Prev
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    aria-current={currentPage === pageNum ? "page" : undefined}
                    className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium ${
                      currentPage === pageNum
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "text-gray-700 border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed bg-gray-100"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                aria-label="Next page"
              >
                Next <i className="fa fa-chevron-right ml-1"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}