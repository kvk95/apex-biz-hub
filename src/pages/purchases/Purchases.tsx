import React, { useState, useMemo } from "react";

const purchasesData = [
  {
    id: 1,
    date: "2022-04-01",
    purchaseNo: "PUR-001",
    supplier: "Supplier A",
    warehouse: "Main Warehouse",
    productQty: 10,
    grandTotal: 1500,
    paid: 1000,
    due: 500,
    status: "Received",
  },
  {
    id: 2,
    date: "2022-04-05",
    purchaseNo: "PUR-002",
    supplier: "Supplier B",
    warehouse: "Secondary Warehouse",
    productQty: 5,
    grandTotal: 750,
    paid: 750,
    due: 0,
    status: "Pending",
  },
  {
    id: 3,
    date: "2022-04-10",
    purchaseNo: "PUR-003",
    supplier: "Supplier C",
    warehouse: "Main Warehouse",
    productQty: 20,
    grandTotal: 3000,
    paid: 1500,
    due: 1500,
    status: "Partial",
  },
  {
    id: 4,
    date: "2022-04-15",
    purchaseNo: "PUR-004",
    supplier: "Supplier D",
    warehouse: "Main Warehouse",
    productQty: 15,
    grandTotal: 2250,
    paid: 2250,
    due: 0,
    status: "Received",
  },
  {
    id: 5,
    date: "2022-04-20",
    purchaseNo: "PUR-005",
    supplier: "Supplier E",
    warehouse: "Secondary Warehouse",
    productQty: 8,
    grandTotal: 1200,
    paid: 600,
    due: 600,
    status: "Pending",
  },
  {
    id: 6,
    date: "2022-04-25",
    purchaseNo: "PUR-006",
    supplier: "Supplier F",
    warehouse: "Main Warehouse",
    productQty: 12,
    grandTotal: 1800,
    paid: 1800,
    due: 0,
    status: "Received",
  },
  {
    id: 7,
    date: "2022-04-28",
    purchaseNo: "PUR-007",
    supplier: "Supplier G",
    warehouse: "Secondary Warehouse",
    productQty: 7,
    grandTotal: 1050,
    paid: 500,
    due: 550,
    status: "Partial",
  },
  {
    id: 8,
    date: "2022-05-01",
    purchaseNo: "PUR-008",
    supplier: "Supplier H",
    warehouse: "Main Warehouse",
    productQty: 25,
    grandTotal: 3750,
    paid: 3750,
    due: 0,
    status: "Received",
  },
  {
    id: 9,
    date: "2022-05-05",
    purchaseNo: "PUR-009",
    supplier: "Supplier I",
    warehouse: "Secondary Warehouse",
    productQty: 9,
    grandTotal: 1350,
    paid: 1350,
    due: 0,
    status: "Received",
  },
  {
    id: 10,
    date: "2022-05-10",
    purchaseNo: "PUR-010",
    supplier: "Supplier J",
    warehouse: "Main Warehouse",
    productQty: 11,
    grandTotal: 1650,
    paid: 1000,
    due: 650,
    status: "Pending",
  },
  {
    id: 11,
    date: "2022-05-15",
    purchaseNo: "PUR-011",
    supplier: "Supplier K",
    warehouse: "Main Warehouse",
    productQty: 14,
    grandTotal: 2100,
    paid: 2100,
    due: 0,
    status: "Received",
  },
  {
    id: 12,
    date: "2022-05-20",
    purchaseNo: "PUR-012",
    supplier: "Supplier L",
    warehouse: "Secondary Warehouse",
    productQty: 6,
    grandTotal: 900,
    paid: 450,
    due: 450,
    status: "Partial",
  },
];

const suppliers = [
  "Supplier A",
  "Supplier B",
  "Supplier C",
  "Supplier D",
  "Supplier E",
  "Supplier F",
  "Supplier G",
  "Supplier H",
  "Supplier I",
  "Supplier J",
  "Supplier K",
  "Supplier L",
];

const warehouses = ["Main Warehouse", "Secondary Warehouse"];

const statusOptions = ["Received", "Pending", "Partial"];

const Purchases: React.FC = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter form state
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    purchaseNo: "",
    supplier: "",
    warehouse: "",
    status: "",
  });

  // Handle filter input changes
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Filtered data based on filters
  const filteredData = useMemo(() => {
    return purchasesData.filter((item) => {
      if (
        filters.startDate &&
        new Date(item.date) < new Date(filters.startDate)
      )
        return false;
      if (filters.endDate && new Date(item.date) > new Date(filters.endDate))
        return false;
      if (
        filters.purchaseNo &&
        !item.purchaseNo.toLowerCase().includes(filters.purchaseNo.toLowerCase())
      )
        return false;
      if (filters.supplier && item.supplier !== filters.supplier) return false;
      if (filters.warehouse && item.warehouse !== filters.warehouse) return false;
      if (filters.status && item.status !== filters.status) return false;
      return true;
    });
  }, [filters]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset filters
  const handleReset = () => {
    setFilters({
      startDate: "",
      endDate: "",
      purchaseNo: "",
      supplier: "",
      warehouse: "",
      status: "",
    });
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Handle refresh (reset filters and page)
  const handleRefresh = () => {
    handleReset();
  };

  // Handle report button (dummy alert)
  const handleReport = () => {
    alert("Report generated (dummy action).");
  };

  // Handle save button (dummy alert)
  const handleSave = () => {
    alert("Save action triggered (dummy).");
  };

  return (
    <>
      <title>Purchases - Dreams POS</title>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
        <div className="max-w-7xl mx-auto p-6">
          {/* Page Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-semibold text-gray-900">Purchases</h1>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button
                onClick={handleReport}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                title="Generate Report"
              >
                <i className="fas fa-file-alt mr-2"></i> Report
              </button>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                title="Refresh"
              >
                <i className="fas fa-sync-alt mr-2"></i> Refresh
              </button>
            </div>
          </div>

          {/* Filter Section */}
          <section className="bg-white rounded-md shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Filter Purchases</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCurrentPage(1);
              }}
              className="grid grid-cols-1 md:grid-cols-6 gap-4"
            >
              {/* Start Date */}
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* End Date */}
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* Purchase No */}
              <div>
                <label
                  htmlFor="purchaseNo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Purchase No
                </label>
                <input
                  type="text"
                  id="purchaseNo"
                  name="purchaseNo"
                  placeholder="Purchase No"
                  value={filters.purchaseNo}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* Supplier */}
              <div>
                <label
                  htmlFor="supplier"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Supplier
                </label>
                <select
                  id="supplier"
                  name="supplier"
                  value={filters.supplier}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">All Suppliers</option>
                  {suppliers.map((sup) => (
                    <option key={sup} value={sup}>
                      {sup}
                    </option>
                  ))}
                </select>
              </div>

              {/* Warehouse */}
              <div>
                <label
                  htmlFor="warehouse"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Warehouse
                </label>
                <select
                  id="warehouse"
                  name="warehouse"
                  value={filters.warehouse}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">All Warehouses</option>
                  {warehouses.map((wh) => (
                    <option key={wh} value={wh}>
                      {wh}
                    </option>
                  ))}
                </select>
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
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">All Statuses</option>
                  {statusOptions.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="md:col-span-6 flex space-x-3 justify-end mt-2">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                  title="Search"
                >
                  <i className="fas fa-search mr-2"></i> Search
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  title="Reset"
                >
                  <i className="fas fa-redo-alt mr-2"></i> Reset
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                  title="Save"
                >
                  <i className="fas fa-save mr-2"></i> Save
                </button>
              </div>
            </form>
          </section>

          {/* Purchases Table */}
          <section className="bg-white rounded-md shadow p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left font-semibold text-gray-700"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left font-semibold text-gray-700"
                    >
                      Purchase No
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left font-semibold text-gray-700"
                    >
                      Supplier
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left font-semibold text-gray-700"
                    >
                      Warehouse
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right font-semibold text-gray-700"
                    >
                      Product Qty
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right font-semibold text-gray-700"
                    >
                      Grand Total
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right font-semibold text-gray-700"
                    >
                      Paid
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right font-semibold text-gray-700"
                    >
                      Due
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-center font-semibold text-gray-700"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-center font-semibold text-gray-700"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedData.length === 0 && (
                    <tr>
                      <td
                        colSpan={10}
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No purchases found.
                      </td>
                    </tr>
                  )}
                  {paginatedData.map((purchase) => (
                    <tr key={purchase.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        {purchase.date}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {purchase.purchaseNo}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {purchase.supplier}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {purchase.warehouse}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        {purchase.productQty}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        ${purchase.grandTotal.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        ${purchase.paid.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        ${purchase.due.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            purchase.status === "Received"
                              ? "bg-green-100 text-green-800"
                              : purchase.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {purchase.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <button
                          type="button"
                          title="Edit"
                          className="text-indigo-600 hover:text-indigo-900 mx-1"
                          onClick={() =>
                            alert(`Edit purchase ${purchase.purchaseNo}`)
                          }
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          className="text-red-600 hover:text-red-900 mx-1"
                          onClick={() =>
                            alert(`Delete purchase ${purchase.purchaseNo}`)
                          }
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <nav
              className="mt-6 flex items-center justify-between border-t border-gray-200 px-4 sm:px-0"
              aria-label="Pagination"
            >
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, filteredData.length)}
                    </span>{" "}
                    of <span className="font-medium">{filteredData.length}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm ml-6"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      const isCurrent = page === currentPage;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          aria-current={isCurrent ? "page" : undefined}
                          className={`relative z-10 inline-flex items-center border px-4 py-2 text-sm font-medium focus:z-20 ${
                            isCurrent
                              ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                              : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <i className="fas fa-chevron-right"></i>
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
};

export default Purchases;