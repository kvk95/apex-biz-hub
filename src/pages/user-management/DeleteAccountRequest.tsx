import React, { useState, useMemo } from "react";

const deleteAccountRequestsData = [
  {
    id: 1,
    requestNo: "REQ-001",
    customerName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    requestDate: "2025-09-01",
    status: "Pending",
  },
  {
    id: 2,
    requestNo: "REQ-002",
    customerName: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 987 654 321",
    requestDate: "2025-09-05",
    status: "Approved",
  },
  {
    id: 3,
    requestNo: "REQ-003",
    customerName: "Alice Johnson",
    email: "alice.johnson@example.com",
    phone: "+44 20 7946 0958",
    requestDate: "2025-09-10",
    status: "Rejected",
  },
  {
    id: 4,
    requestNo: "REQ-004",
    customerName: "Bob Williams",
    email: "bob.williams@example.com",
    phone: "+61 2 9876 5432",
    requestDate: "2025-09-15",
    status: "Pending",
  },
  {
    id: 5,
    requestNo: "REQ-005",
    customerName: "Carol Davis",
    email: "carol.davis@example.com",
    phone: "+49 30 123456",
    requestDate: "2025-09-20",
    status: "Pending",
  },
  {
    id: 6,
    requestNo: "REQ-006",
    customerName: "David Brown",
    email: "david.brown@example.com",
    phone: "+81 3 1234 5678",
    requestDate: "2025-09-25",
    status: "Approved",
  },
  {
    id: 7,
    requestNo: "REQ-007",
    customerName: "Eva Green",
    email: "eva.green@example.com",
    phone: "+33 1 2345 6789",
    requestDate: "2025-09-28",
    status: "Pending",
  },
  {
    id: 8,
    requestNo: "REQ-008",
    customerName: "Frank Moore",
    email: "frank.moore@example.com",
    phone: "+39 06 12345678",
    requestDate: "2025-10-01",
    status: "Rejected",
  },
  {
    id: 9,
    requestNo: "REQ-009",
    customerName: "Grace Lee",
    email: "grace.lee@example.com",
    phone: "+86 10 1234 5678",
    requestDate: "2025-10-05",
    status: "Pending",
  },
  {
    id: 10,
    requestNo: "REQ-010",
    customerName: "Henry King",
    email: "henry.king@example.com",
    phone: "+91 22 1234 5678",
    requestDate: "2025-10-08",
    status: "Approved",
  },
];

const PAGE_SIZE = 5;

export default function DeleteAccountRequest() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Form state
  const [form, setForm] = useState({
    requestNo: "",
    customerName: "",
    email: "",
    phone: "",
    requestDate: "",
    status: "Pending",
  });

  // Checkbox for confirmation
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Table data state (simulate dynamic data)
  const [requests, setRequests] = useState(deleteAccountRequestsData);

  // Pagination calculations
  const totalPages = Math.ceil(requests.length / PAGE_SIZE);
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return requests.slice(start, start + PAGE_SIZE);
  }, [currentPage, requests]);

  // Handlers
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    setConfirmDelete(e.target.checked);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!confirmDelete) {
      alert("Please confirm you understand the deletion consequences.");
      return;
    }
    if (
      !form.requestNo ||
      !form.customerName ||
      !form.email ||
      !form.phone ||
      !form.requestDate
    ) {
      alert("Please fill all fields.");
      return;
    }
    // Add new request to the list
    setRequests((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        requestNo: form.requestNo,
        customerName: form.customerName,
        email: form.email,
        phone: form.phone,
        requestDate: form.requestDate,
        status: form.status,
      },
    ]);
    // Reset form
    setForm({
      requestNo: "",
      customerName: "",
      email: "",
      phone: "",
      requestDate: "",
      status: "Pending",
    });
    setConfirmDelete(false);
    setCurrentPage(totalPages + 1); // Go to last page where new item is added
  }

  function handleRefresh() {
    // Reset to initial data
    setRequests(deleteAccountRequestsData);
    setCurrentPage(1);
  }

  function handleReport() {
    // For demo, just alert JSON data
    alert(JSON.stringify(requests, null, 2));
  }

  // Pagination controls
  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  return (
    <>
      <title>Delete Account Request</title>
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
        <div className="max-w-7xl mx-auto p-6">
          {/* Page Title */}
          <h1 className="text-3xl font-semibold mb-6 text-gray-900">
            Delete Account Request
          </h1>

          {/* Explanation Section */}
          <section className="mb-8 bg-white p-6 rounded shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              Important Information
            </h2>
            <p className="text-gray-700 leading-relaxed">
              This action will permanently remove all of your data, including
              your account information, videos, and settings. Please be certain
              before submitting a deletion request. Once processed, this action
              cannot be undone.
            </p>
          </section>

          {/* Request Form Section */}
          <section className="mb-10 bg-white p-6 rounded shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-5 text-gray-800">
              Submit a Delete Account Request
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Request No */}
                <div>
                  <label
                    htmlFor="requestNo"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Request Number
                  </label>
                  <input
                    type="text"
                    id="requestNo"
                    name="requestNo"
                    value={form.requestNo}
                    onChange={handleInputChange}
                    className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter Request Number"
                    required
                  />
                </div>

                {/* Customer Name */}
                <div>
                  <label
                    htmlFor="customerName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Customer Name
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={form.customerName}
                    onChange={handleInputChange}
                    className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter Customer Name"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter Email"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter Phone Number"
                    required
                  />
                </div>

                {/* Request Date */}
                <div>
                  <label
                    htmlFor="requestDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Request Date
                  </label>
                  <input
                    type="date"
                    id="requestDate"
                    name="requestDate"
                    value={form.requestDate}
                    onChange={handleInputChange}
                    className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                    className="block w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <div className="flex items-center">
                <input
                  id="confirmDelete"
                  name="confirmDelete"
                  type="checkbox"
                  checked={confirmDelete}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  required
                />
                <label
                  htmlFor="confirmDelete"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I understand that this action will permanently delete my
                  account data.
                </label>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded bg-indigo-600 px-6 py-2 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Submit Request
                </button>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="inline-flex items-center justify-center rounded border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={handleReport}
                  className="inline-flex items-center justify-center rounded border border-indigo-600 px-6 py-2 text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Report
                </button>
              </div>
            </form>
          </section>

          {/* Requests Table Section */}
          <section className="bg-white p-6 rounded shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-5 text-gray-800">
              Delete Account Requests
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                      Request No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                      Customer Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                      Request Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedRequests.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No requests found.
                      </td>
                    </tr>
                  ) : (
                    paginatedRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300 text-sm text-gray-700">
                          {req.requestNo}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300 text-sm text-gray-700">
                          {req.customerName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300 text-sm text-gray-700">
                          {req.email}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300 text-sm text-gray-700">
                          {req.phone}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300 text-sm text-gray-700">
                          {req.requestDate}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              req.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : req.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <nav
              className="mt-6 flex items-center justify-between"
              aria-label="Pagination"
            >
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
                <div>
                  <p className="text-sm text-gray-700">
                    Page{" "}
                    <span className="font-medium">{currentPage}</span> of{" "}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div className="ml-6">
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => goToPage(1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">First</span>
                      &#171;
                    </button>
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      &#8249;
                    </button>

                    {/* Show page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          aria-current={page === currentPage ? "page" : undefined}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === currentPage
                              ? "z-10 bg-indigo-600 text-white border-indigo-600"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      &#8250;
                    </button>
                    <button
                      onClick={() => goToPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Last</span>
                      &#187;
                    </button>
                  </nav>
                </div>
              </div>
            </nav>
          </section>
        </div>
      </div>
    </>
  );
}