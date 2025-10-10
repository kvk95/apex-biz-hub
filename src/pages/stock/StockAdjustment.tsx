import React, { useState, useMemo } from "react";

const stockAdjustmentData = [
  {
    id: 1,
    productName: "Fresh Organic Mustard Leaves",
    sku: "SKU-12345",
    stockInHand: 20,
    stockAdjusted: 0,
    stockAfterAdjustment: 20,
    unitCost: 25,
    totalCost: 500,
    reason: "Damaged",
  },
  {
    id: 2,
    productName: "Fresh Organic Broccoli",
    sku: "SKU-12346",
    stockInHand: 15,
    stockAdjusted: 0,
    stockAfterAdjustment: 15,
    unitCost: 30,
    totalCost: 450,
    reason: "Expired",
  },
  {
    id: 3,
    productName: "Fresh Organic Spinach",
    sku: "SKU-12347",
    stockInHand: 10,
    stockAdjusted: 0,
    stockAfterAdjustment: 10,
    unitCost: 20,
    totalCost: 200,
    reason: "Lost",
  },
  {
    id: 4,
    productName: "Fresh Organic Kale",
    sku: "SKU-12348",
    stockInHand: 25,
    stockAdjusted: 0,
    stockAfterAdjustment: 25,
    unitCost: 28,
    totalCost: 700,
    reason: "Damaged",
  },
  {
    id: 5,
    productName: "Fresh Organic Carrots",
    sku: "SKU-12349",
    stockInHand: 30,
    stockAdjusted: 0,
    stockAfterAdjustment: 30,
    unitCost: 15,
    totalCost: 450,
    reason: "Expired",
  },
  {
    id: 6,
    productName: "Fresh Organic Tomatoes",
    sku: "SKU-12350",
    stockInHand: 40,
    stockAdjusted: 0,
    stockAfterAdjustment: 40,
    unitCost: 18,
    totalCost: 720,
    reason: "Lost",
  },
  {
    id: 7,
    productName: "Fresh Organic Potatoes",
    sku: "SKU-12351",
    stockInHand: 50,
    stockAdjusted: 0,
    stockAfterAdjustment: 50,
    unitCost: 12,
    totalCost: 600,
    reason: "Damaged",
  },
  {
    id: 8,
    productName: "Fresh Organic Onions",
    sku: "SKU-12352",
    stockInHand: 45,
    stockAdjusted: 0,
    stockAfterAdjustment: 45,
    unitCost: 14,
    totalCost: 630,
    reason: "Expired",
  },
  {
    id: 9,
    productName: "Fresh Organic Garlic",
    sku: "SKU-12353",
    stockInHand: 35,
    stockAdjusted: 0,
    stockAfterAdjustment: 35,
    unitCost: 22,
    totalCost: 770,
    reason: "Lost",
  },
  {
    id: 10,
    productName: "Fresh Organic Ginger",
    sku: "SKU-12354",
    stockInHand: 28,
    stockAdjusted: 0,
    stockAfterAdjustment: 28,
    unitCost: 26,
    totalCost: 728,
    reason: "Damaged",
  },
  {
    id: 11,
    productName: "Fresh Organic Cucumber",
    sku: "SKU-12355",
    stockInHand: 18,
    stockAdjusted: 0,
    stockAfterAdjustment: 18,
    unitCost: 16,
    totalCost: 288,
    reason: "Expired",
  },
  {
    id: 12,
    productName: "Fresh Organic Bell Pepper",
    sku: "SKU-12356",
    stockInHand: 22,
    stockAdjusted: 0,
    stockAfterAdjustment: 22,
    unitCost: 24,
    totalCost: 528,
    reason: "Lost",
  },
];

const reasons = [
  "Damaged",
  "Expired",
  "Lost",
  "Theft",
  "Adjustment",
  "Other",
];

const StockAdjustment: React.FC = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Data state for stock adjustments
  const [rows, setRows] = useState(stockAdjustmentData);

  // Form state
  const [adjustmentDate, setAdjustmentDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [referenceNo, setReferenceNo] = useState("REF-123456");
  const [warehouse, setWarehouse] = useState("Main Warehouse");
  const [note, setNote] = useState("");

  // Pagination calculations
  const totalPages = Math.ceil(rows.length / itemsPerPage);
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return rows.slice(start, start + itemsPerPage);
  }, [currentPage, rows]);

  // Handlers
  const handleStockAdjustedChange = (id: number, value: string) => {
    const val = parseInt(value, 10);
    if (isNaN(val)) return;
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              stockAdjusted: val,
              stockAfterAdjustment: r.stockInHand + val,
              totalCost: (r.stockInHand + val) * r.unitCost,
            }
          : r
      )
    );
  };

  const handleReasonChange = (id: number, value: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reason: value } : r))
    );
  };

  const handleRefresh = () => {
    setRows(stockAdjustmentData);
    setAdjustmentDate(new Date().toISOString().slice(0, 10));
    setReferenceNo("REF-123456");
    setWarehouse("Main Warehouse");
    setNote("");
    setCurrentPage(1);
  };

  const handleSave = () => {
    alert("Stock adjustment saved successfully!");
  };

  const handleReport = () => {
    alert("Report generated!");
  };

  // Pagination buttons array
  const paginationButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationButtons.push(i);
  }

  return (
    <>
      <title>Stock Adjustment - Dreams POS</title>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-700">
        <div className="container mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Stock Adjustment
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={handleReport}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
                title="Report"
                type="button"
              >
                <i className="fa fa-file-text-o mr-2" aria-hidden="true"></i>
                Report
              </button>
              <button
                onClick={handleRefresh}
                className="flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded shadow"
                title="Refresh"
                type="button"
              >
                <i className="fa fa-refresh mr-2" aria-hidden="true"></i>
                Refresh
              </button>
            </div>
          </div>

          {/* Adjustment Info Section */}
          <div className="bg-white rounded shadow p-6 mb-6">
            <form className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label
                  htmlFor="adjustmentDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Adjustment Date
                </label>
                <input
                  id="adjustmentDate"
                  type="date"
                  value={adjustmentDate}
                  onChange={(e) => setAdjustmentDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="referenceNo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Reference No
                </label>
                <input
                  id="referenceNo"
                  type="text"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="warehouse"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Warehouse
                </label>
                <select
                  id="warehouse"
                  value={warehouse}
                  onChange={(e) => setWarehouse(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Main Warehouse</option>
                  <option>Secondary Warehouse</option>
                  <option>Remote Warehouse</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="note"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Note
                </label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={1}
                  className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>
          </div>

          {/* Stock Adjustment Table */}
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 whitespace-nowrap">
                    Product Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 whitespace-nowrap">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700 whitespace-nowrap">
                    Stock In Hand
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700 whitespace-nowrap">
                    Stock Adjusted
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700 whitespace-nowrap">
                    Stock After Adjustment
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700 whitespace-nowrap">
                    Unit Cost
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700 whitespace-nowrap">
                    Total Cost
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 whitespace-nowrap">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedRows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">{row.productName}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.sku}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {row.stockInHand}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <input
                        type="number"
                        value={row.stockAdjusted}
                        onChange={(e) =>
                          handleStockAdjustedChange(row.id, e.target.value)
                        }
                        className="w-20 border border-gray-300 rounded px-2 py-1 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min={-row.stockInHand}
                        title="Enter stock adjustment (negative or positive)"
                      />
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {row.stockAfterAdjustment}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      ₹{row.unitCost.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      ₹{row.totalCost.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <select
                        value={row.reason}
                        onChange={(e) => handleReasonChange(row.id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {reasons.map((reason) => (
                          <option key={reason} value={reason}>
                            {reason}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {paginatedRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center py-4">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span>{" "}
              to{" "}
              <span className="font-semibold">
                {Math.min(currentPage * itemsPerPage, rows.length)}
              </span>{" "}
              of <span className="font-semibold">{rows.length}</span> entries
            </div>
            <nav
              className="inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}
                aria-label="Previous"
                type="button"
              >
                <i className="fa fa-chevron-left" aria-hidden="true"></i>
              </button>
              {paginationButtons.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === currentPage
                      ? "z-10 bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  type="button"
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                  currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
                }`}
                aria-label="Next"
                type="button"
              >
                <i className="fa fa-chevron-right" aria-hidden="true"></i>
              </button>
            </nav>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={handleSave}
              className="flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow"
              type="button"
              title="Save"
            >
              <i className="fa fa-floppy-o mr-2" aria-hidden="true"></i>
              Save
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded shadow"
              type="button"
              title="Refresh"
            >
              <i className="fa fa-refresh mr-2" aria-hidden="true"></i>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StockAdjustment;