import React, { useState, useMemo } from "react";

const customersData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    totalPurchase: 1200,
    lastPurchaseDate: "2023-09-15",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "987-654-3210",
    totalPurchase: 850,
    lastPurchaseDate: "2023-09-10",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael@example.com",
    phone: "555-123-4567",
    totalPurchase: 430,
    lastPurchaseDate: "2023-09-05",
    status: "Active",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "444-555-6666",
    totalPurchase: 980,
    lastPurchaseDate: "2023-08-30",
    status: "Active",
  },
  {
    id: 5,
    name: "William Brown",
    email: "william@example.com",
    phone: "222-333-4444",
    totalPurchase: 670,
    lastPurchaseDate: "2023-08-25",
    status: "Inactive",
  },
  {
    id: 6,
    name: "Olivia Wilson",
    email: "olivia@example.com",
    phone: "777-888-9999",
    totalPurchase: 1150,
    lastPurchaseDate: "2023-08-20",
    status: "Active",
  },
  {
    id: 7,
    name: "James Taylor",
    email: "james@example.com",
    phone: "111-222-3333",
    totalPurchase: 540,
    lastPurchaseDate: "2023-08-15",
    status: "Active",
  },
  {
    id: 8,
    name: "Sophia Martinez",
    email: "sophia@example.com",
    phone: "999-000-1111",
    totalPurchase: 730,
    lastPurchaseDate: "2023-08-10",
    status: "Inactive",
  },
  {
    id: 9,
    name: "Benjamin Anderson",
    email: "benjamin@example.com",
    phone: "666-777-8888",
    totalPurchase: 880,
    lastPurchaseDate: "2023-08-05",
    status: "Active",
  },
  {
    id: 10,
    name: "Mia Thomas",
    email: "mia@example.com",
    phone: "333-444-5555",
    totalPurchase: 1020,
    lastPurchaseDate: "2023-08-01",
    status: "Active",
  },
  {
    id: 11,
    name: "Alexander Jackson",
    email: "alexander@example.com",
    phone: "123-321-1234",
    totalPurchase: 760,
    lastPurchaseDate: "2023-07-28",
    status: "Inactive",
  },
  {
    id: 12,
    name: "Isabella White",
    email: "isabella@example.com",
    phone: "432-123-4321",
    totalPurchase: 940,
    lastPurchaseDate: "2023-07-25",
    status: "Active",
  },
];

const pageSizeOptions = [5, 10, 15];

export default function CustomerReport() {
  // Title as per reference page
  React.useEffect(() => {
    document.title = "Customer Report - Dreams POS";
  }, []);

  // Filters state
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered and paginated data
  const filteredData = useMemo(() => {
    return customersData.filter((c) => {
      return (
        c.name.toLowerCase().includes(searchName.toLowerCase()) &&
        c.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
        c.phone.toLowerCase().includes(searchPhone.toLowerCase()) &&
        (filterStatus === "" || c.status === filterStatus)
      );
    });
  }, [searchName, searchEmail, searchPhone, filterStatus]);

  const pageCount = Math.ceil(filteredData.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Handlers
  const handleReset = () => {
    setSearchName("");
    setSearchEmail("");
    setSearchPhone("");
    setFilterStatus("");
    setCurrentPage(1);
    setPageSize(10);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pageCount) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6">Customer Report</h1>

      {/* Filters Section */}
      <section className="bg-white rounded shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filter Customers</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          className="grid grid-cols-1 md:grid-cols-5 gap-4"
        >
          {/* Name */}
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-1 font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter name"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label htmlFor="phone" className="mb-1 font-medium text-gray-700">
              Phone
            </label>
            <input
              id="phone"
              type="text"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label htmlFor="status" className="mb-1 font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-end space-x-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Reset
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-white rounded shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Customer List</h2>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100 text-gray-700 text-left text-sm font-semibold">
              <tr>
                <th className="px-4 py-3 border-b border-gray-200">Name</th>
                <th className="px-4 py-3 border-b border-gray-200">Email</th>
                <th className="px-4 py-3 border-b border-gray-200">Phone</th>
                <th className="px-4 py-3 border-b border-gray-200">Total Purchase</th>
                <th className="px-4 py-3 border-b border-gray-200">Last Purchase Date</th>
                <th className="px-4 py-3 border-b border-gray-200">Status</th>
                <th className="px-4 py-3 border-b border-gray-200 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50 border-b border-gray-200"
                  >
                    <td className="px-4 py-3">{customer.name}</td>
                    <td className="px-4 py-3">{customer.email}</td>
                    <td className="px-4 py-3">{customer.phone}</td>
                    <td className="px-4 py-3">${customer.totalPurchase.toFixed(2)}</td>
                    <td className="px-4 py-3">{customer.lastPurchaseDate}</td>
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
                        type="button"
                        className="text-blue-600 hover:text-blue-800 focus:outline-none"
                        title="Edit"
                        onClick={() => alert(`Edit customer: ${customer.name}`)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800 focus:outline-none"
                        title="Delete"
                        onClick={() => alert(`Delete customer: ${customer.name}`)}
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
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-3 md:space-y-0">
          <div className="flex items-center space-x-2">
            <label htmlFor="pageSize" className="text-sm font-medium text-gray-700">
              Rows per page:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <nav
            className="inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label="Previous"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Page numbers */}
            {[...Array(pageCount)].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  aria-current={currentPage === page ? "page" : undefined}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    currentPage === page
                      ? "z-10 bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pageCount || pageCount === 0}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === pageCount || pageCount === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label="Next"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>
      </section>
    </div>
  );
}