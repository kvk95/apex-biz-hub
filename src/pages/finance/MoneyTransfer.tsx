import React, { useState, useMemo } from "react";

const customersData = [
  {
    id: 1,
    name: "John Doe",
    phone: "123-456-7890",
    email: "john@example.com",
    accountNo: "123456789",
    balance: 5000,
  },
  {
    id: 2,
    name: "Jane Smith",
    phone: "987-654-3210",
    email: "jane@example.com",
    accountNo: "987654321",
    balance: 7500,
  },
  {
    id: 3,
    name: "Michael Johnson",
    phone: "555-123-4567",
    email: "michael@example.com",
    accountNo: "555666777",
    balance: 12000,
  },
  {
    id: 4,
    name: "Emily Davis",
    phone: "444-555-6666",
    email: "emily@example.com",
    accountNo: "444555666",
    balance: 3000,
  },
  {
    id: 5,
    name: "William Brown",
    phone: "222-333-4444",
    email: "william@example.com",
    accountNo: "222333444",
    balance: 9800,
  },
  {
    id: 6,
    name: "Olivia Wilson",
    phone: "111-222-3333",
    email: "olivia@example.com",
    accountNo: "111222333",
    balance: 6700,
  },
  {
    id: 7,
    name: "James Taylor",
    phone: "999-888-7777",
    email: "james@example.com",
    accountNo: "999888777",
    balance: 4500,
  },
  {
    id: 8,
    name: "Sophia Martinez",
    phone: "666-777-8888",
    email: "sophia@example.com",
    accountNo: "666777888",
    balance: 8200,
  },
  {
    id: 9,
    name: "Benjamin Anderson",
    phone: "333-444-5555",
    email: "benjamin@example.com",
    accountNo: "333444555",
    balance: 15000,
  },
  {
    id: 10,
    name: "Isabella Thomas",
    phone: "777-888-9999",
    email: "isabella@example.com",
    accountNo: "777888999",
    balance: 4000,
  },
];

const banksData = [
  { id: 1, name: "Bank of America" },
  { id: 2, name: "Chase Bank" },
  { id: 3, name: "Wells Fargo" },
  { id: 4, name: "Citibank" },
  { id: 5, name: "HSBC" },
];

const currencies = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "INR", name: "Indian Rupee" },
  { code: "JPY", name: "Japanese Yen" },
];

const pageSize = 5;

export default function MoneyTransfer() {
  // Pagination state for customer list
  const [currentPage, setCurrentPage] = useState(1);

  // Form state
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAccountNo: "",
    customerBalance: "",
    transferFrom: "",
    transferTo: "",
    bankName: "",
    accountNo: "",
    amount: "",
    currency: "USD",
    description: "",
  });

  // Filtered and paginated customers for table
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return customersData.slice(start, start + pageSize);
  }, [currentPage]);

  const totalPages = Math.ceil(customersData.length / pageSize);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomerSelect = (customer: typeof customersData[0]) => {
    setForm((prev) => ({
      ...prev,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      customerAccountNo: customer.accountNo,
      customerBalance: customer.balance.toString(),
    }));
  };

  const handleReset = () => {
    setForm({
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      customerAccountNo: "",
      customerBalance: "",
      transferFrom: "",
      transferTo: "",
      bankName: "",
      accountNo: "",
      amount: "",
      currency: "USD",
      description: "",
    });
  };

  const handleSave = () => {
    alert("Save functionality triggered (not implemented).");
  };

  const handleRefresh = () => {
    alert("Refresh functionality triggered (not implemented).");
  };

  const handleReport = () => {
    alert("Report functionality triggered (not implemented).");
  };

  return (
    <>
      <title>Money Transfer - Dreams POS</title>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
        <div className="max-w-7xl mx-auto p-6">
          {/* Page Title */}
          <h1 className="text-3xl font-semibold mb-6">Money Transfer</h1>

          {/* Customer Details Section */}
          <section className="bg-white rounded shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleInputChange}
                  placeholder="Customer Name"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label htmlFor="customerPhone" className="block text-sm font-medium mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  id="customerPhone"
                  name="customerPhone"
                  value={form.customerPhone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label htmlFor="customerEmail" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="customerEmail"
                  name="customerEmail"
                  value={form.customerEmail}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label htmlFor="customerAccountNo" className="block text-sm font-medium mb-1">
                  Account No
                </label>
                <input
                  type="text"
                  id="customerAccountNo"
                  name="customerAccountNo"
                  value={form.customerAccountNo}
                  onChange={handleInputChange}
                  placeholder="Account No"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label htmlFor="customerBalance" className="block text-sm font-medium mb-1">
                  Balance
                </label>
                <input
                  type="text"
                  id="customerBalance"
                  name="customerBalance"
                  value={form.customerBalance}
                  readOnly
                  className="w-full border border-gray-300 rounded bg-gray-100 px-3 py-2 cursor-not-allowed"
                />
              </div>
            </div>
          </section>

          {/* Transfer Section */}
          <section className="bg-white rounded shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Transfer Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label htmlFor="transferFrom" className="block text-sm font-medium mb-1">
                  Transfer From
                </label>
                <select
                  id="transferFrom"
                  name="transferFrom"
                  value={form.transferFrom}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Select Account</option>
                  {customersData.map((c) => (
                    <option key={c.id} value={c.accountNo}>
                      {c.name} - {c.accountNo}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="transferTo" className="block text-sm font-medium mb-1">
                  Transfer To
                </label>
                <input
                  type="text"
                  id="transferTo"
                  name="transferTo"
                  value={form.transferTo}
                  onChange={handleInputChange}
                  placeholder="Beneficiary Name"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label htmlFor="bankName" className="block text-sm font-medium mb-1">
                  Bank Name
                </label>
                <select
                  id="bankName"
                  name="bankName"
                  value={form.bankName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Select Bank</option>
                  {banksData.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="accountNo" className="block text-sm font-medium mb-1">
                  Account No
                </label>
                <input
                  type="text"
                  id="accountNo"
                  name="accountNo"
                  value={form.accountNo}
                  onChange={handleInputChange}
                  placeholder="Account Number"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={form.amount}
                  onChange={handleInputChange}
                  placeholder="Amount"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  min={0}
                />
              </div>
              <div>
                <label htmlFor="currency" className="block text-sm font-medium mb-1">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={form.currency}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                />
              </div>
            </div>
          </section>

          {/* Buttons */}
          <section className="flex flex-wrap gap-3 mb-6">
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <i className="fas fa-save"></i> Save
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <i className="fas fa-sync-alt"></i> Refresh
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <i className="fas fa-file-alt"></i> Report
            </button>
          </section>

          {/* Customer List Table with Pagination */}
          <section className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Customer List</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                      #
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Customer Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Phone
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Email
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Account No
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Balance
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCustomers.map((customer, idx) => (
                    <tr
                      key={customer.id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                        {customer.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                        {customer.phone}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                        {customer.email}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                        {customer.accountNo}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                        ${customer.balance.toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <button
                          type="button"
                          title="Select Customer"
                          onClick={() => handleCustomerSelect(customer)}
                          className="text-blue-600 hover:text-blue-800 focus:outline-none"
                        >
                          <i className="fas fa-check-circle text-lg"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginatedCustomers.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-4 text-gray-500 text-sm"
                      >
                        No customers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <nav
              className="flex justify-end items-center mt-4 space-x-2"
              aria-label="Pagination"
            >
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${
                  currentPage === 1
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-gray-400 text-gray-700 hover:bg-gray-200"
                }`}
                aria-label="First Page"
              >
                <i className="fas fa-angle-double-left"></i>
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${
                  currentPage === 1
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-gray-400 text-gray-700 hover:bg-gray-200"
                }`}
                aria-label="Previous Page"
              >
                <i className="fas fa-angle-left"></i>
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`px-3 py-1 rounded border ${
                      currentPage === page
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-400 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded border ${
                  currentPage === totalPages
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-gray-400 text-gray-700 hover:bg-gray-200"
                }`}
                aria-label="Next Page"
              >
                <i className="fas fa-angle-right"></i>
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded border ${
                  currentPage === totalPages
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-gray-400 text-gray-700 hover:bg-gray-200"
                }`}
                aria-label="Last Page"
              >
                <i className="fas fa-angle-double-right"></i>
              </button>
            </nav>
          </section>
        </div>
      </div>
    </>
  );
}