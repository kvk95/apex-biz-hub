import React, { useState, useMemo } from "react";

interface SupplierDue {
  supplierName: string;
  phone: string;
  email: string;
  dueAmount: number;
  paidAmount: number;
  totalAmount: number;
  action: string;
}

const supplierDueData: SupplierDue[] = [
  {
    supplierName: "Supplier One",
    phone: "1234567890",
    email: "supplier1@example.com",
    dueAmount: 1500,
    paidAmount: 5000,
    totalAmount: 6500,
    action: "View",
  },
  {
    supplierName: "Supplier Two",
    phone: "0987654321",
    email: "supplier2@example.com",
    dueAmount: 2500,
    paidAmount: 3000,
    totalAmount: 5500,
    action: "View",
  },
  {
    supplierName: "Supplier Three",
    phone: "1122334455",
    email: "supplier3@example.com",
    dueAmount: 1000,
    paidAmount: 4000,
    totalAmount: 5000,
    action: "View",
  },
  {
    supplierName: "Supplier Four",
    phone: "6677889900",
    email: "supplier4@example.com",
    dueAmount: 500,
    paidAmount: 2000,
    totalAmount: 2500,
    action: "View",
  },
  {
    supplierName: "Supplier Five",
    phone: "4455667788",
    email: "supplier5@example.com",
    dueAmount: 3000,
    paidAmount: 7000,
    totalAmount: 10000,
    action: "View",
  },
  {
    supplierName: "Supplier Six",
    phone: "5566778899",
    email: "supplier6@example.com",
    dueAmount: 1200,
    paidAmount: 3200,
    totalAmount: 4400,
    action: "View",
  },
  {
    supplierName: "Supplier Seven",
    phone: "9988776655",
    email: "supplier7@example.com",
    dueAmount: 800,
    paidAmount: 2200,
    totalAmount: 3000,
    action: "View",
  },
  {
    supplierName: "Supplier Eight",
    phone: "3344556677",
    email: "supplier8@example.com",
    dueAmount: 900,
    paidAmount: 1100,
    totalAmount: 2000,
    action: "View",
  },
  {
    supplierName: "Supplier Nine",
    phone: "2233445566",
    email: "supplier9@example.com",
    dueAmount: 600,
    paidAmount: 1400,
    totalAmount: 2000,
    action: "View",
  },
  {
    supplierName: "Supplier Ten",
    phone: "7788990011",
    email: "supplier10@example.com",
    dueAmount: 1100,
    paidAmount: 3900,
    totalAmount: 5000,
    action: "View",
  },
];

const pageSizeOptions = [5, 10, 15];

const SupplierDueReport: React.FC = () => {
  const [supplierName, setSupplierName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on inputs
  const filteredData = useMemo(() => {
    return supplierDueData.filter((item) => {
      const matchesSupplierName = item.supplierName
        .toLowerCase()
        .includes(supplierName.toLowerCase());
      const matchesPhone = item.phone.includes(phone);
      const matchesEmail = item.email.toLowerCase().includes(email.toLowerCase());

      // Date filters are present in the reference UI but no date data is available in sample data,
      // so date filtering is omitted here as no date field exists in data.

      return matchesSupplierName && matchesPhone && matchesEmail;
    });
  }, [supplierName, phone, email]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Handlers for pagination buttons
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Reset filters handler
  const handleReset = () => {
    setSupplierName("");
    setPhone("");
    setEmail("");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  // Placeholder handlers for buttons (Report, Refresh)
  const handleReport = () => {
    alert("Report generation is not implemented in this demo.");
  };
  const handleRefresh = () => {
    // For demo, just reset filters and page
    handleReset();
  };

  // Calculate totals for footer
  const totalDueAmount = filteredData.reduce((acc, cur) => acc + cur.dueAmount, 0);
  const totalPaidAmount = filteredData.reduce((acc, cur) => acc + cur.paidAmount, 0);
  const totalTotalAmount = filteredData.reduce((acc, cur) => acc + cur.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Supplier Due Report</h1>

      {/* Filter Section */}
      <section className="bg-white rounded shadow p-6 mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end"
        >
          {/* Supplier Name */}
          <div className="flex flex-col">
            <label htmlFor="supplierName" className="text-sm font-medium mb-1">
              Supplier Name
            </label>
            <input
              id="supplierName"
              type="text"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Supplier Name"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label htmlFor="phone" className="text-sm font-medium mb-1">
              Phone
            </label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Phone"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
            />
          </div>

          {/* Date From */}
          <div className="flex flex-col">
            <label htmlFor="dateFrom" className="text-sm font-medium mb-1">
              Date From
            </label>
            <input
              id="dateFrom"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date To */}
          <div className="flex flex-col">
            <label htmlFor="dateTo" className="text-sm font-medium mb-1">
              Date To
            </label>
            <input
              id="dateTo"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Reset
            </button>
          </div>
        </form>
      </section>

      {/* Action Buttons */}
      <section className="flex justify-end mb-4 space-x-2">
        <button
          onClick={handleReport}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          type="button"
        >
          Report
        </button>
        <button
          onClick={handleRefresh}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
          type="button"
        >
          Refresh
        </button>
      </section>

      {/* Table Section */}
      <section className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Supplier Name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Phone</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Due Amount</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Paid Amount</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Total Amount</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              paginatedData.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{item.supplierName}</td>
                  <td className="px-4 py-3">{item.phone}</td>
                  <td className="px-4 py-3">{item.email}</td>
                  <td className="px-4 py-3 text-right">{item.dueAmount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">{item.paidAmount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">{item.totalAmount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      className="text-blue-600 hover:underline focus:outline-none"
                      onClick={() => alert(`Viewing details for ${item.supplierName}`)}
                    >
                      {item.action}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {/* Footer totals */}
          <tfoot className="bg-gray-100 font-semibold text-gray-700">
            <tr>
              <td className="px-4 py-3 text-right" colSpan={3}>
                Total:
              </td>
              <td className="px-4 py-3 text-right">{totalDueAmount.toFixed(2)}</td>
              <td className="px-4 py-3 text-right">{totalPaidAmount.toFixed(2)}</td>
              <td className="px-4 py-3 text-right">{totalTotalAmount.toFixed(2)}</td>
              <td className="px-4 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </section>

      {/* Pagination */}
      <section className="flex justify-between items-center mt-4">
        <div>
          <label htmlFor="pageSize" className="mr-2 font-medium text-gray-700">
            Show
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
          <span className="ml-2 font-medium text-gray-700">entries</span>
        </div>

        <nav
          className="inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none ${
              currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
            }`}
            aria-label="Previous"
          >
            &laquo;
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                aria-current={isActive ? "page" : undefined}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:outline-none ${
                  isActive
                    ? "z-10 bg-blue-600 text-white border-blue-600"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none ${
              currentPage === totalPages || totalPages === 0
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
            aria-label="Next"
          >
            &raquo;
          </button>
        </nav>
      </section>
    </div>
  );
};

export default SupplierDueReport;