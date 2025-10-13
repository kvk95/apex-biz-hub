import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const pageSize = 5;

export default function MoneyTransfer() {
  const [customersData, setCustomersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("MoneyTransfer");
    if (response.status.code === "S") {
      setCustomersData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);

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

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return customersData.slice(start, start + pageSize);
  }, [currentPage, customersData]);

  const totalPages = Math.ceil(customersData.length / pageSize);

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
          <h1 className="text-3xl font-semibold mb-6">Money Transfer</h1>

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
                  <option value="Bank of America">Bank of America</option>
                  <option value="Chase Bank">Chase Bank</option>
                  <option value="Wells Fargo">Wells Fargo</option>
                  <option value="Citibank">Citibank</option>
                  <option value="HSBC">HSBC</option>
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
                  <option value="USD">US Dollar</option>
                  <option value="EUR">Euro</option>
                  <option value="GBP">British Pound</option>
                  <option value="INR">Indian Rupee</option>
                  <option value="JPY">Japanese Yen</option>
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