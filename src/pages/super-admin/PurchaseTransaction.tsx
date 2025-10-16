import { apiService } from "@/services/ApiService";
import React, { useEffect, useState } from "react";

const suppliers = [
  "ABC Suppliers",
  "XYZ Traders",
  "Global Wholesale",
  "Sunrise Enterprises",
  "Metro Supplies",
  "Prime Distributors",
  "Eastern Traders",
  "Northern Wholesale",
  "Southern Supplies",
  "Western Traders",
];

const paymentMethods = ["Cash", "Cheque", "Bank Transfer", "Credit Card"];

const pageSize = 5;

export default function PurchaseTransaction() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("PurchaseTransaction");
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

  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);

  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    setPaginatedData(data.slice(start, start + pageSize));
  }, [currentPage, data]);

  const totalPages = Math.ceil(data.length / pageSize);

  const [form, setForm] = useState({
    invoiceNo: "",
    supplierName: "",
    purchaseDate: "",
    totalAmount: "",
    paidAmount: "",
    dueAmount: "",
    paymentMethod: paymentMethods[0],
    paymentDate: "",
    paymentNote: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("Save functionality is not implemented in this demo.");
  };

  const handleRefresh = () => {
    setForm({
      invoiceNo: "",
      supplierName: "",
      purchaseDate: "",
      totalAmount: "",
      paidAmount: "",
      dueAmount: "",
      paymentMethod: paymentMethods[0],
      paymentDate: "",
      paymentNote: "",
    });
  };

  const handleReport = () => {
    alert("Report functionality is not implemented in this demo.");
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Title */}
        <h1 className="text-lg font-semibold mb-6">Purchase Transaction</h1>

        {/* Purchase Transaction Form */}
        <section className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Purchase Details</h2>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="invoiceNo"
                className="block text-sm font-medium mb-1"
              >
                Invoice No
              </label>
              <input
                type="text"
                id="invoiceNo"
                name="invoiceNo"
                value={form.invoiceNo}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Invoice No"
              />
            </div>
            <div>
              <label
                htmlFor="supplierName"
                className="block text-sm font-medium mb-1"
              >
                Supplier Name
              </label>
              <select
                id="supplierName"
                name="supplierName"
                value={form.supplierName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Supplier</option>
                {suppliers.map((sup) => (
                  <option key={sup} value={sup}>
                    {sup}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="purchaseDate"
                className="block text-sm font-medium mb-1"
              >
                Purchase Date
              </label>
              <input
                type="date"
                id="purchaseDate"
                name="purchaseDate"
                value={form.purchaseDate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="totalAmount"
                className="block text-sm font-medium mb-1"
              >
                Total Amount
              </label>
              <input
                type="number"
                id="totalAmount"
                name="totalAmount"
                value={form.totalAmount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label
                htmlFor="paidAmount"
                className="block text-sm font-medium mb-1"
              >
                Paid Amount
              </label>
              <input
                type="number"
                id="paidAmount"
                name="paidAmount"
                value={form.paidAmount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label
                htmlFor="dueAmount"
                className="block text-sm font-medium mb-1"
              >
                Due Amount
              </label>
              <input
                type="number"
                id="dueAmount"
                name="dueAmount"
                value={form.dueAmount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label
                htmlFor="paymentMethod"
                className="block text-sm font-medium mb-1"
              >
                Payment Method
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="paymentDate"
                className="block text-sm font-medium mb-1"
              >
                Payment Date
              </label>
              <input
                type="date"
                id="paymentDate"
                name="paymentDate"
                value={form.paymentDate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-3">
              <label
                htmlFor="paymentNote"
                className="block text-sm font-medium mb-1"
              >
                Payment Note
              </label>
              <textarea
                id="paymentNote"
                name="paymentNote"
                value={form.paymentNote}
                onChange={handleInputChange}
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Enter any notes here"
              />
            </div>
          </form>

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <i className="fas fa-save mr-2"></i> Save
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <i className="fas fa-sync-alt mr-2"></i> Refresh
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <i className="fas fa-file-alt mr-2"></i> Report
            </button>
          </div>
        </section>

        {/* Purchase Transactions Table */}
        <section className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Purchase Transactions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-r border-gray-300">
                    Invoice No
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-r border-gray-300">
                    Supplier Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-r border-gray-300">
                    Purchase Date
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 border-r border-gray-300">
                    Total Amount
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 border-r border-gray-300">
                    Paid Amount
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 border-r border-gray-300">
                    Due Amount
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-700 border-r border-gray-300">
                    Status
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300">
                      {item.invoiceNo}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300">
                      {item.supplierName}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300">
                      {item.purchaseDate}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-right border-r border-gray-300">
                      ₹{item.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-right border-r border-gray-300">
                      ₹{item.paidAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-right border-r border-gray-300">
                      ₹{item.dueAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-center border-r border-gray-300">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : item.status === "Partial"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-center">
                      <button
                        type="button"
                        title="Edit"
                        className="text-blue-600 hover:text-blue-800 focus:outline-none"
                        onClick={() =>
                          alert(
                            `Edit functionality for ${item.invoiceNo} not implemented.`
                          )
                        }
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav
            className="flex items-center justify-between border-t border-gray-200 px-4 py-3 mt-4"
            aria-label="Pagination"
          >
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * pageSize, data.length)}
                  </span>{" "}
                  of <span className="font-medium">{data.length}</span> results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px ml-6"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="First"
                  >
                    <i className="fas fa-angle-double-left"></i>
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous"
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
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? "z-10 bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next"
                  >
                    <i className="fas fa-angle-right"></i>
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Last"
                  >
                    <i className="fas fa-angle-double-right"></i>
                  </button>
                </nav>
              </div>
            </div>
          </nav>
        </section>
      </div>
    </>
  );
}
