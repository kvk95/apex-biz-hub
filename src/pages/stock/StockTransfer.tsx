import React, { useState, useMemo } from "react";

const stockTransferData = [
  {
    id: 1,
    date: "2023-08-01",
    referenceNo: "ST-001",
    fromStore: "Main Store",
    toStore: "Outlet 1",
    product: "Product A",
    quantity: 10,
    status: "Completed",
  },
  {
    id: 2,
    date: "2023-08-02",
    referenceNo: "ST-002",
    fromStore: "Main Store",
    toStore: "Outlet 2",
    product: "Product B",
    quantity: 5,
    status: "Pending",
  },
  {
    id: 3,
    date: "2023-08-03",
    referenceNo: "ST-003",
    fromStore: "Outlet 1",
    toStore: "Outlet 3",
    product: "Product C",
    quantity: 7,
    status: "Completed",
  },
  {
    id: 4,
    date: "2023-08-04",
    referenceNo: "ST-004",
    fromStore: "Outlet 2",
    toStore: "Main Store",
    product: "Product D",
    quantity: 12,
    status: "Pending",
  },
  {
    id: 5,
    date: "2023-08-05",
    referenceNo: "ST-005",
    fromStore: "Main Store",
    toStore: "Outlet 1",
    product: "Product E",
    quantity: 9,
    status: "Completed",
  },
  {
    id: 6,
    date: "2023-08-06",
    referenceNo: "ST-006",
    fromStore: "Outlet 3",
    toStore: "Outlet 2",
    product: "Product F",
    quantity: 4,
    status: "Pending",
  },
  {
    id: 7,
    date: "2023-08-07",
    referenceNo: "ST-007",
    fromStore: "Outlet 1",
    toStore: "Main Store",
    product: "Product G",
    quantity: 15,
    status: "Completed",
  },
  {
    id: 8,
    date: "2023-08-08",
    referenceNo: "ST-008",
    fromStore: "Outlet 2",
    toStore: "Outlet 3",
    product: "Product H",
    quantity: 6,
    status: "Pending",
  },
  {
    id: 9,
    date: "2023-08-09",
    referenceNo: "ST-009",
    fromStore: "Main Store",
    toStore: "Outlet 2",
    product: "Product I",
    quantity: 11,
    status: "Completed",
  },
  {
    id: 10,
    date: "2023-08-10",
    referenceNo: "ST-010",
    fromStore: "Outlet 3",
    toStore: "Main Store",
    product: "Product J",
    quantity: 8,
    status: "Pending",
  },
  {
    id: 11,
    date: "2023-08-11",
    referenceNo: "ST-011",
    fromStore: "Outlet 1",
    toStore: "Outlet 2",
    product: "Product K",
    quantity: 14,
    status: "Completed",
  },
  {
    id: 12,
    date: "2023-08-12",
    referenceNo: "ST-012",
    fromStore: "Main Store",
    toStore: "Outlet 3",
    product: "Product L",
    quantity: 3,
    status: "Pending",
  },
];

const stores = ["Main Store", "Outlet 1", "Outlet 2", "Outlet 3"];
const statuses = ["All", "Completed", "Pending"];

export default function StockTransfer() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filters and form state
  const [filterFromStore, setFilterFromStore] = useState("");
  const [filterToStore, setFilterToStore] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchRef, setSearchRef] = useState("");

  // Form inputs for new stock transfer
  const [formDate, setFormDate] = useState("");
  const [formReferenceNo, setFormReferenceNo] = useState("");
  const [formFromStore, setFormFromStore] = useState("");
  const [formToStore, setFormToStore] = useState("");
  const [formProduct, setFormProduct] = useState("");
  const [formQuantity, setFormQuantity] = useState("");
  const [formStatus, setFormStatus] = useState("Pending");

  // Data state
  const [data, setData] = useState(stockTransferData);

  // Filtered and searched data memoized
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchFromStore = filterFromStore
        ? item.fromStore === filterFromStore
        : true;
      const matchToStore = filterToStore ? item.toStore === filterToStore : true;
      const matchStatus =
        filterStatus === "All" ? true : item.status === filterStatus;
      const matchRef = searchRef
        ? item.referenceNo.toLowerCase().includes(searchRef.toLowerCase())
        : true;
      return matchFromStore && matchToStore && matchStatus && matchRef;
    });
  }, [data, filterFromStore, filterToStore, filterStatus, searchRef]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  function handleRefresh() {
    setFilterFromStore("");
    setFilterToStore("");
    setFilterStatus("All");
    setSearchRef("");
    setCurrentPage(1);
  }

  function handleSave() {
    if (
      !formDate ||
      !formReferenceNo ||
      !formFromStore ||
      !formToStore ||
      !formProduct ||
      !formQuantity
    ) {
      alert("Please fill all fields.");
      return;
    }
    const newEntry = {
      id: data.length + 1,
      date: formDate,
      referenceNo: formReferenceNo,
      fromStore: formFromStore,
      toStore: formToStore,
      product: formProduct,
      quantity: Number(formQuantity),
      status: formStatus,
    };
    setData([newEntry, ...data]);
    // Reset form
    setFormDate("");
    setFormReferenceNo("");
    setFormFromStore("");
    setFormToStore("");
    setFormProduct("");
    setFormQuantity("");
    setFormStatus("Pending");
    setCurrentPage(1);
  }

  function handleReport() {
    // For demo, just alert or console log
    alert("Report generation is not implemented in this demo.");
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-800">
      <title>Stock Transfer</title>

      {/* Page Title */}
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">Stock Transfer</h1>

      {/* Form Section */}
      <section className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Add Stock Transfer</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
          noValidate
        >
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="referenceNo"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Reference No
            </label>
            <input
              type="text"
              id="referenceNo"
              value={formReferenceNo}
              onChange={(e) => setFormReferenceNo(e.target.value)}
              placeholder="Enter reference no"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="fromStore"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              From Store
            </label>
            <select
              id="fromStore"
              value={formFromStore}
              onChange={(e) => setFormFromStore(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="" disabled>
                Select store
              </option>
              {stores.map((store) => (
                <option key={store} value={store}>
                  {store}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="toStore"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              To Store
            </label>
            <select
              id="toStore"
              value={formToStore}
              onChange={(e) => setFormToStore(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="" disabled>
                Select store
              </option>
              {stores.map((store) => (
                <option key={store} value={store}>
                  {store}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="product"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Product
            </label>
            <input
              type="text"
              id="product"
              value={formProduct}
              onChange={(e) => setFormProduct(e.target.value)}
              placeholder="Enter product name"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              min={1}
              value={formQuantity}
              onChange={(e) => setFormQuantity(e.target.value)}
              placeholder="Enter quantity"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              {statuses
                .filter((s) => s !== "All")
                .map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
            </select>
          </div>

          <div className="md:col-span-4 flex justify-end items-end">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <i className="fas fa-save mr-2"></i> Save
            </button>
          </div>
        </form>
      </section>

      {/* Filters and Actions */}
      <section className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Stock Transfer List</h2>
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 mb-4">
          <input
            type="text"
            placeholder="Search Reference No"
            value={searchRef}
            onChange={(e) => setSearchRef(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={filterFromStore}
            onChange={(e) => setFilterFromStore(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">From Store (All)</option>
            {stores.map((store) => (
              <option key={store} value={store}>
                {store}
              </option>
            ))}
          </select>
          <select
            value={filterToStore}
            onChange={(e) => setFilterToStore(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">To Store (All)</option>
            {stores.map((store) => (
              <option key={store} value={store}>
                {store}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/6 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Refresh Filters"
          >
            <i className="fas fa-sync-alt mr-2"></i> Refresh
          </button>
          <button
            onClick={handleReport}
            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
            title="Generate Report"
          >
            <i className="fas fa-file-alt mr-2"></i> Report
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded">
            <thead className="bg-indigo-600 text-white text-left">
              <tr>
                <th className="px-4 py-3 border-r border-indigo-500 whitespace-nowrap">
                  Date
                </th>
                <th className="px-4 py-3 border-r border-indigo-500 whitespace-nowrap">
                  Reference No
                </th>
                <th className="px-4 py-3 border-r border-indigo-500 whitespace-nowrap">
                  From Store
                </th>
                <th className="px-4 py-3 border-r border-indigo-500 whitespace-nowrap">
                  To Store
                </th>
                <th className="px-4 py-3 border-r border-indigo-500 whitespace-nowrap">
                  Product
                </th>
                <th className="px-4 py-3 border-r border-indigo-500 whitespace-nowrap">
                  Quantity
                </th>
                <th className="px-4 py-3 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No stock transfer records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-r border-gray-300 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300 whitespace-nowrap">
                      {item.referenceNo}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300 whitespace-nowrap">
                      {item.fromStore}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300 whitespace-nowrap">
                      {item.toStore}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300 whitespace-nowrap">
                      {item.product}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300 whitespace-nowrap text-right">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 text-sm rounded-full font-semibold ${
                          item.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <nav
          className="flex items-center justify-between mt-4"
          aria-label="Pagination"
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Previous Page"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <ul className="inline-flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page}>
                <button
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded border ${
                    page === currentPage
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-200"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              currentPage === totalPages || totalPages === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            aria-label="Next Page"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </nav>
      </section>
    </div>
  );
}