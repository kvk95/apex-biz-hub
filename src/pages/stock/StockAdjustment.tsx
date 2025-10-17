import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const reasons = ["Damaged", "Expired", "Lost", "Theft", "Adjustment", "Other"];

const StockAdjustment: React.FC = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Data state
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [adjustmentDate, setAdjustmentDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [referenceNo, setReferenceNo] = useState("REF-123456");
  const [warehouse, setWarehouse] = useState("Main Warehouse");
  const [note, setNote] = useState("");

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("StockAdjustment");
    if (response.status.code === "S") {
      setData(response.result);
      setRows(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Paginated data
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return rows.slice(start, start + itemsPerPage);
  }, [currentPage, rows, itemsPerPage]);

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

  const handleClear = () => {
    setRows(data);
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

  const handleEdit = (row) => {
    setEditRow(row);
    setIsEditModalOpen(true);
  };

  const handleEditSave = () => {
    if (!editRow) return;
    setRows((prev) =>
      prev.map((r) => (r.id === editRow.id ? { ...editRow } : r))
    );
    setIsEditModalOpen(false);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setEditRow(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold text-muted-foreground">
            Stock Adjustment
          </h1>
          <div className="flex gap-3">
            <button
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              title="Report"
              type="button"
            >
              <i className="fa fa-file-text fa-light mr-2" aria-hidden="true"></i>
              Report
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              title="Clear"
              type="button"
            >
              <i className="fa fa-refresh fa-light mr-2" aria-hidden="true"></i>
              Clear
            </button>
          </div>
        </div>

        {/* Adjustment Info Section */}
        <section className="bg-card rounded shadow p-6 mb-6">
          <form className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label
                htmlFor="adjustmentDate"
                className="block text-sm font-medium mb-1"
              >
                Adjustment Date
              </label>
              <input
                id="adjustmentDate"
                type="date"
                value={adjustmentDate}
                onChange={(e) => setAdjustmentDate(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label
                htmlFor="referenceNo"
                className="block text-sm font-medium mb-1"
              >
                Reference No
              </label>
              <input
                id="referenceNo"
                type="text"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label
                htmlFor="warehouse"
                className="block text-sm font-medium mb-1"
              >
                Warehouse
              </label>
              <select
                id="warehouse"
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option>Main Warehouse</option>
                <option>Secondary Warehouse</option>
                <option>Remote Warehouse</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="note"
                className="block text-sm font-medium mb-1"
              >
                Note
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={1}
                className="w-full border border-input rounded px-3 py-2 bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </form>
        </section>

        {/* Stock Adjustment Table */}
        <section className="bg-card rounded shadow py-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Product Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                    Stock In Hand
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                    Stock Adjusted
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                    Stock After Adjustment
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                    Unit Cost
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                    Total Cost
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Reason
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center px-4 py-6 text-muted-foreground italic"
                    >
                      No records found.
                    </td>
                  </tr>
                )}
                {paginatedRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors text-sm text-gray-500"
                  >
                    <td className="px-4 py-2">{row.productName}</td>
                    <td className="px-4 py-2">{row.sku}</td>
                    <td className="px-4 py-2 text-right">{row.stockInHand}</td>
                    <td className="px-4 py-2 text-right">
                      <input
                        type="number"
                        value={row.stockAdjusted}
                        onChange={(e) =>
                          handleStockAdjustedChange(row.id, e.target.value)
                        }
                        className="w-20 border border-input rounded px-2 py-1 text-right bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        min={-row.stockInHand}
                        title="Enter stock adjustment (negative or positive)"
                      />
                    </td>
                    <td className="px-4 py-2 text-right">
                      {row.stockAfterAdjustment}
                    </td>
                    <td className="px-4 py-2 text-right">
                      ₹{row.unitCost.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      ₹{row.totalCost.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={row.reason}
                        onChange={(e) => handleReasonChange(row.id, e.target.value)}
                        className="border border-input rounded px-2 py-1 w-full bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        {reasons.map((reason) => (
                          <option key={reason} value={reason}>
                            {reason}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(row)}
                        aria-label={`Edit ${row.productName}`}
                        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
                      >
                        <i className="fa fa-edit fa-light" aria-hidden="true"></i>
                        <span className="sr-only">Edit record</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={rows.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setItemsPerPage}
          />
        </section>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
            title="Save"
          >
            <i className="fa fa-save fa-light mr-2" aria-hidden="true"></i>
            Save
          </button>
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && editRow && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-modal-title"
          >
            <div className="bg-white rounded shadow-lg max-w-xl w-full p-6 relative">
              <h2
                id="edit-modal-title"
                className="text-xl font-semibold mb-4 text-center"
              >
                Edit Stock Adjustment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={editRow.productName}
                    onChange={(e) =>
                      setEditRow({ ...editRow, productName: e.target.value })
                    }
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">SKU</label>
                  <input
                    type="text"
                    value={editRow.sku}
                    onChange={(e) =>
                      setEditRow({ ...editRow, sku: e.target.value })
                    }
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Stock In Hand
                  </label>
                  <input
                    type="number"
                    value={editRow.stockInHand}
                    onChange={(e) =>
                      setEditRow({
                        ...editRow,
                        stockInHand: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Stock Adjusted
                  </label>
                  <input
                    type="number"
                    value={editRow.stockAdjusted}
                    onChange={(e) =>
                      setEditRow({
                        ...editRow,
                        stockAdjusted: parseInt(e.target.value, 10),
                        stockAfterAdjustment:
                          editRow.stockInHand + parseInt(e.target.value, 10),
                        totalCost:
                          (editRow.stockInHand + parseInt(e.target.value, 10)) *
                          editRow.unitCost,
                      })
                    }
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Unit Cost
                  </label>
                  <input
                    type="number"
                    value={editRow.unitCost}
                    onChange={(e) =>
                      setEditRow({
                        ...editRow,
                        unitCost: parseFloat(e.target.value),
                        totalCost:
                          editRow.stockAfterAdjustment *
                          parseFloat(e.target.value),
                      })
                    }
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Reason
                  </label>
                  <select
                    value={editRow.reason}
                    onChange={(e) =>
                      setEditRow({ ...editRow, reason: e.target.value })
                    }
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {reasons.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={handleEditCancel}
                  className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                  type="button"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockAdjustment;