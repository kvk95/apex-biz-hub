import React, { useState, useMemo } from "react";

const giftCardsData = [
  {
    id: 1,
    cardNumber: "1234 5678 9012 3456",
    cardHolder: "John Doe",
    issueDate: "2023-01-15",
    expiryDate: "2025-01-15",
    balance: 150.0,
    status: "Active",
  },
  {
    id: 2,
    cardNumber: "2345 6789 0123 4567",
    cardHolder: "Jane Smith",
    issueDate: "2023-02-10",
    expiryDate: "2025-02-10",
    balance: 75.5,
    status: "Active",
  },
  {
    id: 3,
    cardNumber: "3456 7890 1234 5678",
    cardHolder: "Alice Johnson",
    issueDate: "2022-12-05",
    expiryDate: "2024-12-05",
    balance: 0,
    status: "Expired",
  },
  {
    id: 4,
    cardNumber: "4567 8901 2345 6789",
    cardHolder: "Bob Williams",
    issueDate: "2023-03-20",
    expiryDate: "2025-03-20",
    balance: 200,
    status: "Active",
  },
  {
    id: 5,
    cardNumber: "5678 9012 3456 7890",
    cardHolder: "Carol Davis",
    issueDate: "2023-04-01",
    expiryDate: "2025-04-01",
    balance: 50,
    status: "Active",
  },
  {
    id: 6,
    cardNumber: "6789 0123 4567 8901",
    cardHolder: "David Brown",
    issueDate: "2023-05-15",
    expiryDate: "2025-05-15",
    balance: 120,
    status: "Active",
  },
  {
    id: 7,
    cardNumber: "7890 1234 5678 9012",
    cardHolder: "Eva Green",
    issueDate: "2023-06-10",
    expiryDate: "2025-06-10",
    balance: 95,
    status: "Active",
  },
  {
    id: 8,
    cardNumber: "8901 2345 6789 0123",
    cardHolder: "Frank Moore",
    issueDate: "2023-07-05",
    expiryDate: "2025-07-05",
    balance: 0,
    status: "Expired",
  },
  {
    id: 9,
    cardNumber: "9012 3456 7890 1234",
    cardHolder: "Grace Lee",
    issueDate: "2023-08-20",
    expiryDate: "2025-08-20",
    balance: 180,
    status: "Active",
  },
  {
    id: 10,
    cardNumber: "0123 4567 8901 2345",
    cardHolder: "Henry King",
    issueDate: "2023-09-01",
    expiryDate: "2025-09-01",
    balance: 60,
    status: "Active",
  },
  {
    id: 11,
    cardNumber: "1122 3344 5566 7788",
    cardHolder: "Ivy Scott",
    issueDate: "2023-10-10",
    expiryDate: "2025-10-10",
    balance: 130,
    status: "Active",
  },
  {
    id: 12,
    cardNumber: "2233 4455 6677 8899",
    cardHolder: "Jack White",
    issueDate: "2023-11-15",
    expiryDate: "2025-11-15",
    balance: 0,
    status: "Expired",
  },
];

const pageSizeOptions = [5, 10, 15];

export default function GiftCards() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Form state for Add/Edit Gift Card
  const [form, setForm] = useState({
    cardNumber: "",
    cardHolder: "",
    issueDate: "",
    expiryDate: "",
    balance: "",
    status: "Active",
  });

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);

  // Filter state (search by card number or holder)
  const [searchTerm, setSearchTerm] = useState("");

  // Data state (simulate data update)
  const [data, setData] = useState(giftCardsData);

  // Filtered and paginated data
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    return data.filter(
      (card) =>
        card.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.cardHolder.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = () => {
    if (
      !form.cardNumber.trim() ||
      !form.cardHolder.trim() ||
      !form.issueDate ||
      !form.expiryDate ||
      form.balance === ""
    ) {
      alert("Please fill all fields");
      return;
    }
    if (editingId !== null) {
      // Edit existing
      setData((d) =>
        d.map((card) =>
          card.id === editingId
            ? {
                ...card,
                cardNumber: form.cardNumber,
                cardHolder: form.cardHolder,
                issueDate: form.issueDate,
                expiryDate: form.expiryDate,
                balance: Number(form.balance),
                status: form.status,
              }
            : card
        )
      );
      setEditingId(null);
    } else {
      // Add new
      const newCard = {
        id: data.length ? Math.max(...data.map((c) => c.id)) + 1 : 1,
        cardNumber: form.cardNumber,
        cardHolder: form.cardHolder,
        issueDate: form.issueDate,
        expiryDate: form.expiryDate,
        balance: Number(form.balance),
        status: form.status,
      };
      setData((d) => [newCard, ...d]);
    }
    setForm({
      cardNumber: "",
      cardHolder: "",
      issueDate: "",
      expiryDate: "",
      balance: "",
      status: "Active",
    });
  };

  const handleEdit = (id: number) => {
    const card = data.find((c) => c.id === id);
    if (!card) return;
    setForm({
      cardNumber: card.cardNumber,
      cardHolder: card.cardHolder,
      issueDate: card.issueDate,
      expiryDate: card.expiryDate,
      balance: card.balance.toString(),
      status: card.status,
    });
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      cardNumber: "",
      cardHolder: "",
      issueDate: "",
      expiryDate: "",
      balance: "",
      status: "Active",
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this gift card?")) {
      setData((d) => d.filter((card) => card.id !== id));
      if ((currentPage - 1) * pageSize >= data.length - 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleRefresh = () => {
    setData(giftCardsData);
    setSearchTerm("");
    setCurrentPage(1);
    setPageSize(10);
    setEditingId(null);
    setForm({
      cardNumber: "",
      cardHolder: "",
      issueDate: "",
      expiryDate: "",
      balance: "",
      status: "Active",
    });
  };

  const handleReport = () => {
    // For demo, just alert JSON data
    alert("Report generated for current gift cards data.");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-800">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Gift Cards</h1>

      {/* Controls: Search, Report, Refresh */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center space-x-2 w-full md:w-1/3">
          <label
            htmlFor="search"
            className="text-sm font-semibold text-gray-700"
          >
            Search:
          </label>
          <input
            id="search"
            type="text"
            placeholder="Card Number or Holder"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-grow border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleReport}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold transition"
            title="Generate Report"
            type="button"
          >
            <i className="fas fa-file-alt"></i>
            <span>Report</span>
          </button>
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-semibold transition"
            title="Refresh"
            type="button"
          >
            <i className="fas fa-sync-alt"></i>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Add/Edit Gift Card Form */}
      <div className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          {editingId !== null ? "Edit Gift Card" : "Add Gift Card"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div>
            <label
              htmlFor="cardNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Card Number
            </label>
            <input
              id="cardNumber"
              name="cardNumber"
              type="text"
              value={form.cardNumber}
              onChange={handleInputChange}
              placeholder="XXXX XXXX XXXX XXXX"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              maxLength={19}
              pattern="[\d\s]+"
              title="Card number format: digits and spaces only"
            />
          </div>
          <div>
            <label
              htmlFor="cardHolder"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Card Holder
            </label>
            <input
              id="cardHolder"
              name="cardHolder"
              type="text"
              value={form.cardHolder}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="issueDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Issue Date
            </label>
            <input
              id="issueDate"
              name="issueDate"
              type="date"
              value={form.issueDate}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="expiryDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Expiry Date
            </label>
            <input
              id="expiryDate"
              name="expiryDate"
              type="date"
              value={form.expiryDate}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="balance"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Balance
            </label>
            <input
              id="balance"
              name="balance"
              type="number"
              min="0"
              step="0.01"
              value={form.balance}
              onChange={handleInputChange}
              placeholder="0.00"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
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
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          <div className="md:col-span-3 flex space-x-3 justify-end pt-4">
            {editingId !== null && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded text-sm font-semibold transition"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded text-sm font-semibold transition"
            >
              {editingId !== null ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>

      {/* Gift Cards Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left font-semibold text-gray-700"
              >
                Card Number
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left font-semibold text-gray-700"
              >
                Card Holder
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left font-semibold text-gray-700"
              >
                Issue Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left font-semibold text-gray-700"
              >
                Expiry Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right font-semibold text-gray-700"
              >
                Balance
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center font-semibold text-gray-700"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center font-semibold text-gray-700"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-4 text-center text-gray-500 italic"
                >
                  No gift cards found.
                </td>
              </tr>
            )}
            {paginatedData.map((card) => (
              <tr key={card.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{card.cardNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{card.cardHolder}</td>
                <td className="px-6 py-4 whitespace-nowrap">{card.issueDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">{card.expiryDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  ${card.balance.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      card.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {card.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                  <button
                    onClick={() => handleEdit(card.id)}
                    title="Edit"
                    className="text-blue-600 hover:text-blue-800"
                    type="button"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(card.id)}
                    title="Delete"
                    className="text-red-600 hover:text-red-800"
                    type="button"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-4 space-y-3 md:space-y-0">
        <div className="flex items-center space-x-2 text-sm text-gray-700">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
            {filteredData.length} entries
          </span>
          <select
            aria-label="Select page size"
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt} per page
              </option>
            ))}
          </select>
        </div>

        <nav
          className="inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
            }`}
            aria-label="First Page"
            type="button"
          >
            <i className="fas fa-angle-double-left"></i>
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
            }`}
            aria-label="Previous Page"
            type="button"
          >
            <i className="fas fa-angle-left"></i>
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            // Show max 5 pages with ellipsis if needed
            if (
              totalPages > 5 &&
              page !== 1 &&
              page !== totalPages &&
              (page < currentPage - 1 || page > currentPage + 1)
            ) {
              if (
                (page === 2 && currentPage > 4) ||
                (page === totalPages - 1 && currentPage < totalPages - 3)
              ) {
                return (
                  <span
                    key={"ellipsis-" + page}
                    className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                  >
                    &hellip;
                  </span>
                );
              }
              return null;
            }
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                aria-current={page === currentPage ? "page" : undefined}
                className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium focus:z-20 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  page === currentPage
                    ? "z-10 bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
                type="button"
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              currentPage === totalPages || totalPages === 0
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
            aria-label="Next Page"
            type="button"
          >
            <i className="fas fa-angle-right"></i>
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              currentPage === totalPages || totalPages === 0
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
            aria-label="Last Page"
            type="button"
          >
            <i className="fas fa-angle-double-right"></i>
          </button>
        </nav>
      </div>
    </div>
  );
}