import React, { useState } from "react";

const data = [
  {
    id: 1,
    customer: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    status: "Active",
  },
  {
    id: 2,
    customer: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 987 654 321",
    status: "Inactive",
  },
  {
    id: 3,
    customer: "Michael Johnson",
    email: "michael.johnson@example.com",
    phone: "+1 555 123 456",
    status: "Active",
  },
  {
    id: 4,
    customer: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1 444 987 654",
    status: "Inactive",
  },
  {
    id: 5,
    customer: "William Brown",
    email: "william.brown@example.com",
    phone: "+1 333 222 111",
    status: "Active",
  },
  {
    id: 6,
    customer: "Olivia Wilson",
    email: "olivia.wilson@example.com",
    phone: "+1 777 888 999",
    status: "Inactive",
  },
  {
    id: 7,
    customer: "James Taylor",
    email: "james.taylor@example.com",
    phone: "+1 666 555 444",
    status: "Active",
  },
  {
    id: 8,
    customer: "Sophia Martinez",
    email: "sophia.martinez@example.com",
    phone: "+1 222 333 444",
    status: "Inactive",
  },
  {
    id: 9,
    customer: "Benjamin Anderson",
    email: "benjamin.anderson@example.com",
    phone: "+1 111 222 333",
    status: "Active",
  },
  {
    id: 10,
    customer: "Isabella Thomas",
    email: "isabella.thomas@example.com",
    phone: "+1 999 888 777",
    status: "Inactive",
  },
  {
    id: 11,
    customer: "Daniel Jackson",
    email: "daniel.jackson@example.com",
    phone: "+1 123 456 789",
    status: "Active",
  },
  {
    id: 12,
    customer: "Mia White",
    email: "mia.white@example.com",
    phone: "+1 987 654 321",
    status: "Inactive",
  },
];

const pageSize = 5;

export default function ForgotPassword3() {
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState("");

  const totalPages = Math.ceil(data.length / pageSize);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate forgot password submission logic
    alert(`Password reset link sent to ${email}`);
  };

  const handleRefresh = () => {
    // Simulate refresh action
    alert("Data refreshed");
  };

  const handleReport = () => {
    // Simulate report action
    alert("Report generated");
  };

  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <title>Forgot Password 3 | Dreams POS</title>
      <div className="min-h-screen bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 flex items-center justify-between">
            <h1 className="text-white text-2xl font-semibold">
              Forgot Password
            </h1>
            <div className="flex space-x-3">
              <button
                onClick={handleReport}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                type="button"
                aria-label="Generate Report"
              >
                <i className="fa fa-file-alt"></i>
                <span>Report</span>
              </button>
              <button
                onClick={handleRefresh}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                type="button"
                aria-label="Refresh Data"
              >
                <i className="fa fa-sync-alt"></i>
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Forgot Password Form */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Reset Your Password
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter your email"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
                >
                  Send Reset Link
                </button>
              </form>
            </section>

            {/* Right: Customer Data Table with Pagination */}
            <section className="flex flex-col">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Customer List
              </h2>
              <div className="overflow-x-auto border border-gray-200 rounded">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-600">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Customer
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Phone
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                          {item.customer}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                          {item.email}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                          {item.phone}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              item.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <nav
                className="mt-4 flex justify-center items-center space-x-2"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
                  aria-label="Previous Page"
                >
                  <i className="fa fa-chevron-left"></i>
                </button>
                {[...Array(totalPages)].map((_, idx) => {
                  const page = idx + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded border ${
                        currentPage === page
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
                  aria-label="Next Page"
                >
                  <i className="fa fa-chevron-right"></i>
                </button>
              </nav>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}