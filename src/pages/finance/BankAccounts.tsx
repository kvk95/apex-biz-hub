import React, { useState, useMemo } from "react";

const bankAccountsData = [
  {
    id: 1,
    bankName: "Axis Bank",
    branchName: "New York",
    accountNumber: "1234567890",
    accountHolder: "John Doe",
    accountType: "Savings",
    openingBalance: 5000,
    currentBalance: 7000,
    status: "Active",
  },
  {
    id: 2,
    bankName: "HDFC Bank",
    branchName: "Los Angeles",
    accountNumber: "9876543210",
    accountHolder: "Jane Smith",
    accountType: "Current",
    openingBalance: 10000,
    currentBalance: 12000,
    status: "Active",
  },
  {
    id: 3,
    bankName: "ICICI Bank",
    branchName: "Chicago",
    accountNumber: "1122334455",
    accountHolder: "Robert Johnson",
    accountType: "Savings",
    openingBalance: 8000,
    currentBalance: 8500,
    status: "Inactive",
  },
  {
    id: 4,
    bankName: "State Bank of India",
    branchName: "Houston",
    accountNumber: "6677889900",
    accountHolder: "Emily Davis",
    accountType: "Current",
    openingBalance: 15000,
    currentBalance: 16000,
    status: "Active",
  },
  {
    id: 5,
    bankName: "Punjab National Bank",
    branchName: "Phoenix",
    accountNumber: "5544332211",
    accountHolder: "Michael Brown",
    accountType: "Savings",
    openingBalance: 4000,
    currentBalance: 4500,
    status: "Active",
  },
  {
    id: 6,
    bankName: "Kotak Mahindra Bank",
    branchName: "Philadelphia",
    accountNumber: "9988776655",
    accountHolder: "Linda Wilson",
    accountType: "Current",
    openingBalance: 20000,
    currentBalance: 21000,
    status: "Inactive",
  },
  {
    id: 7,
    bankName: "Yes Bank",
    branchName: "San Antonio",
    accountNumber: "4433221100",
    accountHolder: "William Martinez",
    accountType: "Savings",
    openingBalance: 7000,
    currentBalance: 7200,
    status: "Active",
  },
  {
    id: 8,
    bankName: "Bank of Baroda",
    branchName: "San Diego",
    accountNumber: "7766554433",
    accountHolder: "Patricia Anderson",
    accountType: "Current",
    openingBalance: 9000,
    currentBalance: 9300,
    status: "Active",
  },
  {
    id: 9,
    bankName: "IDFC First Bank",
    branchName: "Dallas",
    accountNumber: "3322110099",
    accountHolder: "Jennifer Thomas",
    accountType: "Savings",
    openingBalance: 6000,
    currentBalance: 6500,
    status: "Inactive",
  },
  {
    id: 10,
    bankName: "IndusInd Bank",
    branchName: "San Jose",
    accountNumber: "2211003344",
    accountHolder: "Charles Jackson",
    accountType: "Current",
    openingBalance: 11000,
    currentBalance: 11500,
    status: "Active",
  },
];

const accountTypes = ["Savings", "Current"];
const statuses = ["Active", "Inactive"];

export default function BankAccounts() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form state for Add/Edit
  const initialFormState = {
    bankName: "",
    branchName: "",
    accountNumber: "",
    accountHolder: "",
    accountType: "Savings",
    openingBalance: "",
    currentBalance: "",
    status: "Active",
  };
  const [form, setForm] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Data state
  const [accounts, setAccounts] = useState(bankAccountsData);

  // Pagination calculations
  const totalPages = Math.ceil(accounts.length / itemsPerPage);

  const paginatedAccounts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return accounts.slice(start, start + itemsPerPage);
  }, [accounts, currentPage]);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "openingBalance" || name === "currentBalance"
          ? value.replace(/\D/g, "")
          : value,
    }));
  };

  const handleSave = () => {
    // Validate required fields (basic)
    if (
      !form.bankName.trim() ||
      !form.branchName.trim() ||
      !form.accountNumber.trim() ||
      !form.accountHolder.trim() ||
      !form.openingBalance.trim() ||
      !form.currentBalance.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (isEditing && editId !== null) {
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === editId
            ? {
                ...acc,
                bankName: form.bankName,
                branchName: form.branchName,
                accountNumber: form.accountNumber,
                accountHolder: form.accountHolder,
                accountType: form.accountType,
                openingBalance: Number(form.openingBalance),
                currentBalance: Number(form.currentBalance),
                status: form.status,
              }
            : acc
        )
      );
    } else {
      const newAccount = {
        id: accounts.length ? accounts[accounts.length - 1].id + 1 : 1,
        bankName: form.bankName,
        branchName: form.branchName,
        accountNumber: form.accountNumber,
        accountHolder: form.accountHolder,
        accountType: form.accountType,
        openingBalance: Number(form.openingBalance),
        currentBalance: Number(form.currentBalance),
        status: form.status,
      };
      setAccounts((prev) => [...prev, newAccount]);
      // If last page was full, move to new last page
      if ((accounts.length + 1) > itemsPerPage * totalPages) {
        setCurrentPage(totalPages + 1);
      }
    }
    setForm(initialFormState);
    setIsEditing(false);
    setEditId(null);
  };

  const handleEdit = (id: number) => {
    const acc = accounts.find((a) => a.id === id);
    if (!acc) return;
    setForm({
      bankName: acc.bankName,
      branchName: acc.branchName,
      accountNumber: acc.accountNumber,
      accountHolder: acc.accountHolder,
      accountType: acc.accountType,
      openingBalance: acc.openingBalance.toString(),
      currentBalance: acc.currentBalance.toString(),
      status: acc.status,
    });
    setIsEditing(true);
    setEditId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      setAccounts((prev) => prev.filter((a) => a.id !== id));
      // Adjust page if needed
      if (
        currentPage > 1 &&
        (accounts.length - 1) <= itemsPerPage * (currentPage - 1)
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleRefresh = () => {
    setAccounts(bankAccountsData);
    setForm(initialFormState);
    setIsEditing(false);
    setEditId(null);
    setCurrentPage(1);
  };

  const handleReport = () => {
    // For demo, just alert JSON data
    alert("Report generated for current accounts data.");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <title>Bank Accounts - Dreams POS</title>

      <main className="max-w-7xl mx-auto p-6">
        {/* Page Title */}
        <h1 className="text-3xl font-semibold mb-6 text-gray-900">
          Bank Accounts
        </h1>

        {/* Form Section */}
        <section className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {isEditing ? "Edit Bank Account" : "Add Bank Account"}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Bank Name */}
            <div>
              <label
                htmlFor="bankName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Bank Name <span className="text-red-600">*</span>
              </label>
              <input
                id="bankName"
                name="bankName"
                type="text"
                value={form.bankName}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Branch Name */}
            <div>
              <label
                htmlFor="branchName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Branch Name <span className="text-red-600">*</span>
              </label>
              <input
                id="branchName"
                name="branchName"
                type="text"
                value={form.branchName}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Account Number */}
            <div>
              <label
                htmlFor="accountNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Account Number <span className="text-red-600">*</span>
              </label>
              <input
                id="accountNumber"
                name="accountNumber"
                type="text"
                value={form.accountNumber}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Account Holder */}
            <div>
              <label
                htmlFor="accountHolder"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Account Holder <span className="text-red-600">*</span>
              </label>
              <input
                id="accountHolder"
                name="accountHolder"
                type="text"
                value={form.accountHolder}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Account Type */}
            <div>
              <label
                htmlFor="accountType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Account Type <span className="text-red-600">*</span>
              </label>
              <select
                id="accountType"
                name="accountType"
                value={form.accountType}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                {accountTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Opening Balance */}
            <div>
              <label
                htmlFor="openingBalance"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Opening Balance <span className="text-red-600">*</span>
              </label>
              <input
                id="openingBalance"
                name="openingBalance"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.openingBalance}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Current Balance */}
            <div>
              <label
                htmlFor="currentBalance"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Current Balance <span className="text-red-600">*</span>
              </label>
              <input
                id="currentBalance"
                name="currentBalance"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.currentBalance}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status <span className="text-red-600">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="md:col-span-3 flex space-x-4 justify-start pt-4">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow transition"
              >
                <i className="fa fa-save mr-2" aria-hidden="true"></i>
                {isEditing ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm(initialFormState);
                  setIsEditing(false);
                  setEditId(null);
                }}
                className="inline-flex items-center px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded shadow transition"
              >
                <i className="fa fa-times mr-2" aria-hidden="true"></i> Cancel
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded shadow transition"
              >
                <i className="fa fa-refresh mr-2" aria-hidden="true"></i> Refresh
              </button>
              <button
                type="button"
                onClick={handleReport}
                className="inline-flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow transition"
              >
                <i className="fa fa-file-text-o mr-2" aria-hidden="true"></i> Report
              </button>
            </div>
          </form>
        </section>

        {/* Table Section */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Bank Accounts List
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">
                    #
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">
                    Bank Name
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">
                    Branch Name
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">
                    Account Number
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">
                    Account Holder
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">
                    Account Type
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-gray-700">
                    Opening Balance
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-gray-700">
                    Current Balance
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-2 text-center font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedAccounts.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No bank accounts found.
                    </td>
                  </tr>
                )}
                {paginatedAccounts.map((acc, idx) => (
                  <tr
                    key={acc.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td className="px-4 py-3">{acc.bankName}</td>
                    <td className="px-4 py-3">{acc.branchName}</td>
                    <td className="px-4 py-3">{acc.accountNumber}</td>
                    <td className="px-4 py-3">{acc.accountHolder}</td>
                    <td className="px-4 py-3">{acc.accountType}</td>
                    <td className="px-4 py-3 text-right">
                      ₹{acc.openingBalance.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      ₹{acc.currentBalance.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          acc.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {acc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(acc.id)}
                        title="Edit"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(acc.id)}
                        title="Delete"
                        className="text-red-600 hover:text-red-800"
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
            className="flex items-center justify-between mt-6"
            aria-label="Pagination"
          >
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="First Page"
            >
              <i className="fa fa-angle-double-left" aria-hidden="true"></i>
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Previous Page"
            >
              <i className="fa fa-angle-left" aria-hidden="true"></i>
            </button>

            {/* Page numbers */}
            <ul className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page}>
                  <button
                    onClick={() => setCurrentPage(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`px-3 py-1 rounded border ${
                      page === currentPage
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "border-gray-300 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Next Page"
            >
              <i className="fa fa-angle-right" aria-hidden="true"></i>
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Last Page"
            >
              <i className="fa fa-angle-double-right" aria-hidden="true"></i>
            </button>
          </nav>
        </section>
      </main>
    </div>
  );
}