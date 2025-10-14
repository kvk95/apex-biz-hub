import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Purchases");
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter form state
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    purchaseNo: "",
    supplier: "",
    warehouse: "",
    status: "",
  });

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    date: "",
    purchaseNo: "",
    supplier: "",
    warehouse: "",
    productQty: "",
    grandTotal: "",
    paid: "",
    due: "",
    status: statusOptions[0],
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Handle filter input changes
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Filtered data based on filters
  const filteredData = useMemo(() => {
    return data.filter((item) => {
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
  }, [filters, data]);

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        date: item.date,
        purchaseNo: item.purchaseNo,
        supplier: item.supplier,
        warehouse: item.warehouse,
        productQty: item.productQty.toString(),
        grandTotal: item.grandTotal.toString(),
        paid: item.paid.toString(),
        due: item.due.toString(),
        status: item.status,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (
      !editForm.date ||
      !editForm.purchaseNo.trim() ||
      !editForm.supplier.trim() ||
      !editForm.warehouse.trim() ||
      !editForm.productQty ||
      !editForm.grandTotal ||
      !editForm.paid ||
      !editForm.due
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                date: editForm.date,
                purchaseNo: editForm.purchaseNo.trim(),
                supplier: editForm.supplier,
                warehouse: editForm.warehouse,
                productQty: Number(editForm.productQty),
                grandTotal: Number(editForm.grandTotal),
                paid: Number(editForm.paid),
                due: Number(editForm.due),
                status: editForm.status,
              }
            : item
        )
      );
      setEditId(null);
      setIsEditModalOpen(false);
    }
  };

  // Cancel editing modal
  const handleEditCancel = () => {
    setEditId(null);
    setIsEditModalOpen(false);
  };

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

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    handleReset();
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle report button (dummy alert)
  const handleReport = () => {
    alert("Report generated (dummy action).");
  };

  // Handle save button (dummy alert)
  const handleSave = () => {
    alert("Save action triggered (dummy).");
  };

  // Calculate paginated data using Pagination component props
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <title>Purchases - Dreams POS</title>
      <div className="min-h-screen bg-background font-sans p-6">
        {/* Page Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold mb-4 md:mb-0">Purchases</h1>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              title="Generate Report"
              type="button"
            >
              <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              title="Clear"
              type="button"
            >
              <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <section className="bg-card rounded shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Filter Purchases</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
            className="grid grid-cols-1 md:grid-cols-6 gap-6"
          >
            {/* Start Date */}
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Purchase No */}
            <div>
              <label
                htmlFor="purchaseNo"
                className="block text-sm font-medium mb-1 text-muted-foreground"
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
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Supplier */}
            <div>
              <label
                htmlFor="supplier"
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                Supplier
              </label>
              <select
                id="supplier"
                name="supplier"
                value={filters.supplier}
                onChange={handleFilterChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                Warehouse
              </label>
              <select
                id="warehouse"
                name="warehouse"
                value={filters.warehouse}
                onChange={handleFilterChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
            <div className="md:col-span-6 flex flex-wrap gap-3 justify-end mt-6">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                title="Search"
              >
                <i className="fa fa-search fa-light" aria-hidden="true"></i> Search
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                title="Reset"
              >
                <i className="fa fa-redo fa-light" aria-hidden="true"></i> Reset
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                title="Save"
              >
                <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
              </button>
            </div>
          </form>
        </section>

        {/* Purchases Table */}
        <section className="bg-card rounded shadow py-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Purchase No
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Supplier
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Warehouse
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                    Product Qty
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                    Grand Total
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                    Paid
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                    Due
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      className="text-center px-4 py-6 text-muted-foreground italic"
                    >
                      No purchases found.
                    </td>
                  </tr>
                )}
                {paginatedData.map((purchase) => (
                  <tr
                    key={purchase.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {purchase.date}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {purchase.purchaseNo}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {purchase.supplier}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {purchase.warehouse}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">
                      {purchase.productQty}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">
                      ${purchase.grandTotal.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">
                      ${purchase.paid.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">
                      ${purchase.due.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          purchase.status === "Received"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : purchase.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }`}
                      >
                        {purchase.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm space-x-3">
                      <button
                        type="button"
                        title="Edit"
                        className="text-primary hover:text-primary/80 transition-colors"
                        onClick={() => handleEdit(purchase.id)}
                      >
                        <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        className="text-destructive hover:text-destructive/80 transition-colors"
                        onClick={() =>
                          window.confirm(
                            `Are you sure you want to delete purchase ${purchase.purchaseNo}?`
                          ) &&
                          setData((prev) =>
                            prev.filter((d) => d.id !== purchase.id)
                          )
                        }
                      >
                        <i className="fa fa-trash fa-light" aria-hidden="true"></i>
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
            totalItems={filteredData.length}
            onPageChange={handlePageChange}
            onPageSizeChange={setItemsPerPage}
          />
        </section>

        {/* Edit Modal */}
        {isEditModalOpen && (
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
                Edit Purchase
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Date */}
                <div>
                  <label
                    htmlFor="editDate"
                    className="block text-sm font-medium mb-1 text-muted-foreground"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="editDate"
                    name="date"
                    value={editForm.date}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Purchase No */}
                <div>
                  <label
                    htmlFor="editPurchaseNo"
                    className="block text-sm font-medium mb-1 text-muted-foreground"
                  >
                    Purchase No
                  </label>
                  <input
                    type="text"
                    id="editPurchaseNo"
                    name="purchaseNo"
                    value={editForm.purchaseNo}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter purchase number"
                  />
                </div>

                {/* Supplier */}
                <div>
                  <label
                    htmlFor="editSupplier"
                    className="block text-sm font-medium mb-1 text-muted-foreground"
                  >
                    Supplier
                  </label>
                  <select
                    id="editSupplier"
                    name="supplier"
                    value={editForm.supplier}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
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
                    htmlFor="editWarehouse"
                    className="block text-sm font-medium mb-1 text-muted-foreground"
                  >
                    Warehouse
                  </label>
                  <select
                    id="editWarehouse"
                    name="warehouse"
                    value={editForm.warehouse}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {warehouses.map((wh) => (
                      <option key={wh} value={wh}>
                        {wh}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product Qty */}
                <div>
                  <label
                    htmlFor="editProductQty"
                    className="block text-sm font-medium mb-1 text-muted-foreground"
                  >
                    Product Qty
                  </label>
                  <input
                    type="number"
                    id="editProductQty"
                    name="productQty"
                    value={editForm.productQty}
                    onChange={handleEditInputChange}
                    min={0}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter product quantity"
                  />
                </div>

                {/* Grand Total */}
                <div>
                  <label
                    htmlFor="editGrandTotal"
                    className="block text-sm font-medium mb-1 text-muted-foreground"
                  >
                    Grand Total
                  </label>
                  <input
                    type="number"
                    id="editGrandTotal"
                    name="grandTotal"
                    value={editForm.grandTotal}
                    onChange={handleEditInputChange}
                    min={0}
                    step="0.01"
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter grand total"
                  />
                </div>

                {/* Paid */}
                <div>
                  <label
                    htmlFor="editPaid"
                    className="block text-sm font-medium mb-1 text-muted-foreground"
                  >
                    Paid
                  </label>
                  <input
                    type="number"
                    id="editPaid"
                    name="paid"
                    value={editForm.paid}
                    onChange={handleEditInputChange}
                    min={0}
                    step="0.01"
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter paid amount"
                  />
                </div>

                {/* Due */}
                <div>
                  <label
                    htmlFor="editDue"
                    className="block text-sm font-medium mb-1 text-muted-foreground"
                  >
                    Due
                  </label>
                  <input
                    type="number"
                    id="editDue"
                    name="due"
                    value={editForm.due}
                    onChange={handleEditInputChange}
                    min={0}
                    step="0.01"
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter due amount"
                  />
                </div>

                {/* Status */}
                <div>
                  <label
                    htmlFor="editStatus"
                    className="block text-sm font-medium mb-1 text-muted-foreground"
                  >
                    Status
                  </label>
                  <select
                    id="editStatus"
                    name="status"
                    value={editForm.status}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Modal Buttons */}
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
    </>
  );
};

export default Purchases;