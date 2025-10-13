import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const pageSizeOptions = [5, 10, 20];

export default function Signatures() {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState({
    customerName: "",
    customerId: "",
    signatureDate: "",
    signatureStatus: "Active",
    remarks: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Signatures");
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

  // Filtered and paginated data
  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        item.customerName.toLowerCase().includes(search.toLowerCase()) ||
        item.customerId.toLowerCase().includes(search.toLowerCase()) ||
        item.signatureStatus.toLowerCase().includes(search.toLowerCase()) ||
        item.remarks.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  const pageCount = Math.ceil(filteredData.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = () => {
    if (!form.customerName || !form.customerId || !form.signatureDate) {
      alert("Please fill in all required fields.");
      return;
    }
    if (editId !== null) {
      // Edit existing
      setData((d) =>
        d.map((item) =>
          item.id === editId
            ? {
                ...item,
                ...form,
              }
            : item
        )
      );
      setEditId(null);
    } else {
      // Add new
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((d) => [...d, { id: newId, ...form }]);
    }
    setForm({
      customerName: "",
      customerId: "",
      signatureDate: "",
      signatureStatus: "Active",
      remarks: "",
    });
  };

  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setForm({
        customerName: item.customerName,
        customerId: item.customerId,
        signatureDate: item.signatureDate,
        signatureStatus: item.signatureStatus,
        remarks: item.remarks,
      });
      setEditId(id);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this signature?")) {
      setData((d) => d.filter((item) => item.id !== id));
      if (editId === id) {
        setEditId(null);
        setForm({
          customerName: "",
          customerId: "",
          signatureDate: "",
          signatureStatus: "Active",
          remarks: "",
        });
      }
    }
  };

  const handleRefresh = () => {
    setSearch("");
    setPageSize(5);
    setCurrentPage(1);
    setForm({
      customerName: "",
      customerId: "",
      signatureDate: "",
      signatureStatus: "Active",
      remarks: "",
    });
    setEditId(null);
    loadData();
  };

  // Pagination navigation handlers
  const goToPage = (page: number) => {
    if (page < 1) page = 1;
    else if (page > pageCount) page = pageCount;
    setCurrentPage(page);
  }; 

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-800">
      <h1 className="text-3xl font-semibold mb-6">Signatures</h1>

      {/* Form Section */}
      <section className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add / Edit Signature</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          noValidate
        >
          <div>
            <label
              htmlFor="customerName"
              className="block mb-1 font-medium text-gray-700"
            >
              Customer Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={form.customerName}
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter customer name"
            />
          </div>

          <div>
            <label
              htmlFor="customerId"
              className="block mb-1 font-medium text-gray-700"
            >
              Customer ID <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="customerId"
              name="customerId"
              value={form.customerId}
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter customer ID"
            />
          </div>

          <div>
            <label
              htmlFor="signatureDate"
              className="block mb-1 font-medium text-gray-700"
            >
              Signature Date <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              id="signatureDate"
              name="signatureDate"
              value={form.signatureDate}
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="signatureStatus"
              className="block mb-1 font-medium text-gray-700"
            >
              Signature Status
            </label>
            <select
              id="signatureStatus"
              name="signatureStatus"
              value={form.signatureStatus}
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="remarks"
              className="block mb-1 font-medium text-gray-700"
            >
              Remarks
            </label>
            <textarea
              id="remarks"
              name="remarks"
              value={form.remarks}
              onChange={handleInputChange}
              rows={2}
              className="w-full rounded border border-gray-300 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter remarks"
            />
          </div>

          <div className="flex items-end space-x-3">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded flex items-center"
              title={editId !== null ? "Update Signature" : "Save Signature"}
            >
              <i className="fas fa-save mr-2" aria-hidden="true"></i>
              {editId !== null ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm({
                  customerName: "",
                  customerId: "",
                  signatureDate: "",
                  signatureStatus: "Active",
                  remarks: "",
                });
                setEditId(null);
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-5 py-2 rounded flex items-center"
              title="Clear Form"
            >
              <i className="fas fa-undo mr-2" aria-hidden="true"></i> Clear
            </button>
          </div>
        </form>
      </section>

      {/* Search and Actions */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-3 md:space-y-0">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search signatures..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded border border-gray-300 px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleRefresh}
            title="Refresh Data"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded flex items-center"
          >
            <i className="fas fa-sync-alt mr-2" aria-hidden="true"></i> Refresh
          </button>
          <button
            onClick={() => alert("Report generation not implemented")}
            title="Generate Report"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center"
          >
            <i className="fas fa-file-alt mr-2" aria-hidden="true"></i> Report
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <label
            htmlFor="pageSize"
            className="font-medium text-gray-700 whitespace-nowrap"
          >
            Rows per page:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Table Section */}
      <section className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Customer Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Customer ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Signature Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Remarks
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                >
                  No signatures found.
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.customerId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.signatureDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                        item.signatureStatus === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.signatureStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.remarks}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                    <button
                      onClick={() => handleEdit(item.id)}
                      title="Edit Signature"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <i className="fas fa-edit" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Delete Signature"
                      className="text-red-600 hover:text-red-800"
                    >
                      <i className="fas fa-trash-alt" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* Pagination Controls */}
      <nav
        className="flex items-center justify-between mt-4"
        aria-label="Pagination"
      >
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              currentPage === 1
                ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                : "text-gray-700 bg-white hover:bg-gray-50"
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === pageCount || pageCount === 0}
            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              currentPage === pageCount || pageCount === 0
                ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                : "text-gray-700 bg-white hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
          <ul className="inline-flex -space-x-px rounded-md shadow-sm">
            <li>
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
                aria-label="Go to first page"
              >
                <i className="fas fa-angle-double-left" aria-hidden="true"></i>
              </button>
            </li>
            <li>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
                aria-label="Go to previous page"
              >
                <i className="fas fa-angle-left" aria-hidden="true"></i>
              </button>
            </li>

            {/* Show page numbers with max 5 pages visible */}
            {Array.from(
              {
                length: Math.min(pageCount, 5),
              },
              (_, i) => {
                let pageNumber = i + 1;
                // If currentPage > 3 and pageCount > 5, shift pages
                if (currentPage > 3 && pageCount > 5) {
                  if (currentPage + 2 <= pageCount) {
                    pageNumber = currentPage - 3 + i + 1;
                  } else {
                    pageNumber = pageCount - 4 + i;
                  }
                }
                if (pageNumber < 1 || pageNumber > pageCount) return null;
                return (
                  <li key={pageNumber}>
                    <button
                      onClick={() => goToPage(pageNumber)}
                      aria-current={pageNumber === currentPage ? "page" : undefined}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNumber === currentPage
                          ? "z-10 bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  </li>
                );
              }
            )}

            <li>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === pageCount || pageCount === 0}
                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === pageCount || pageCount === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
                aria-label="Go to next page"
              >
                <i className="fas fa-angle-right" aria-hidden="true"></i>
              </button>
            </li>
            <li>
              <button
                onClick={() => goToPage(pageCount)}
                disabled={currentPage === pageCount || pageCount === 0}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === pageCount || pageCount === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
                aria-label="Go to last page"
              >
                <i className="fas fa-angle-double-right" aria-hidden="true"></i>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}