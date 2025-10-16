import React, { useMemo, useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const paymentStatusOptions = ["All", "Paid", "Pending"];
const orderStatusOptions = ["All", "Delivered", "Processing", "Cancelled"];

export default function PosOrders() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("PosOrders");
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

  // Filters state
  const [filterOrderId, setFilterOrderId] = useState("");
  const [filterCustomerName, setFilterCustomerName] = useState("");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("All");
  const [filterOrderStatus, setFilterOrderStatus] = useState("All");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  // Sorting state
  const [sortField, setSortField] = useState<keyof typeof data[0] | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    orderId: "",
    customerName: "",
    date: "",
    totalAmount: "",
    paymentStatus: paymentStatusOptions[0],
    orderStatus: orderStatusOptions[0],
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Handlers for sorting
  const handleSort = (field: keyof typeof data[0]) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filtered and sorted data memoized
  const filteredOrders = useMemo(() => {
    return data
      .filter((order) => {
        const matchesOrderId = order.orderId
          .toLowerCase()
          .includes(filterOrderId.toLowerCase());
        const matchesCustomerName = order.customerName
          .toLowerCase()
          .includes(filterCustomerName.toLowerCase());
        const matchesPaymentStatus =
          filterPaymentStatus === "All"
            ? true
            : order.paymentStatus === filterPaymentStatus;
        const matchesOrderStatus =
          filterOrderStatus === "All"
            ? true
            : order.orderStatus === filterOrderStatus;
        const orderDate = new Date(order.date);
        const fromDate = filterDateFrom ? new Date(filterDateFrom) : null;
        const toDate = filterDateTo ? new Date(filterDateTo) : null;
        const matchesDateFrom = fromDate ? orderDate >= fromDate : true;
        const matchesDateTo = toDate ? orderDate <= toDate : true;

        return (
          matchesOrderId &&
          matchesCustomerName &&
          matchesPaymentStatus &&
          matchesOrderStatus &&
          matchesDateFrom &&
          matchesDateTo
        );
      })
      .sort((a, b) => {
        if (!sortField) return 0;
        let aVal: any = a[sortField];
        let bVal: any = b[sortField];
        if (sortField === "date") {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [
    data,
    filterOrderId,
    filterCustomerName,
    filterPaymentStatus,
    filterOrderStatus,
    filterDateFrom,
    filterDateTo,
    sortField,
    sortDirection,
  ]);

  // Paginated data using Pagination component props
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset filters handler
  const resetFilters = () => {
    setFilterOrderId("");
    setFilterCustomerName("");
    setFilterPaymentStatus("All");
    setFilterOrderStatus("All");
    setFilterDateFrom("");
    setFilterDateTo("");
    setSortField(null);
    setSortDirection("asc");
    setCurrentPage(1);
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    resetFilters();
  };

  // Report handler (simulate report generation)
  const generateReport = () => {
    alert("Report generation is not implemented in this demo.");
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        orderId: item.orderId,
        customerName: item.customerName,
        date: item.date,
        totalAmount: item.totalAmount.toString(),
        paymentStatus: item.paymentStatus,
        orderStatus: item.orderStatus,
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
      !editForm.orderId.trim() ||
      !editForm.customerName.trim() ||
      !editForm.date ||
      !editForm.totalAmount
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
                orderId: editForm.orderId.trim(),
                customerName: editForm.customerName.trim(),
                date: editForm.date,
                totalAmount: Number(editForm.totalAmount),
                paymentStatus: editForm.paymentStatus,
                orderStatus: editForm.orderStatus,
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

  return (
    <> 
      <div className="min-h-screen bg-background">
        {/* Page Title */}
        <h1 className="text-lg font-semibold mb-6">POS Orders</h1>

        {/* Filters Section */}
        <section className="bg-card rounded shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Filter Orders</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {/* Order ID */}
            <div>
              <label
                htmlFor="orderId"
                className="block text-sm font-medium mb-1"
              >
                Order ID
              </label>
              <input
                type="text"
                id="orderId"
                name="orderId"
                value={filterOrderId}
                onChange={(e) => setFilterOrderId(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Search Order ID"
              />
            </div>

            {/* Customer Name */}
            <div>
              <label
                htmlFor="customerName"
                className="block text-sm font-medium mb-1"
              >
                Customer Name
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={filterCustomerName}
                onChange={(e) => setFilterCustomerName(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Search Customer"
              />
            </div>

            {/* Payment Status */}
            <div>
              <label
                htmlFor="paymentStatus"
                className="block text-sm font-medium mb-1"
              >
                Payment Status
              </label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                value={filterPaymentStatus}
                onChange={(e) => setFilterPaymentStatus(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {paymentStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Order Status */}
            <div>
              <label
                htmlFor="orderStatus"
                className="block text-sm font-medium mb-1"
              >
                Order Status
              </label>
              <select
                id="orderStatus"
                name="orderStatus"
                value={filterOrderStatus}
                onChange={(e) => setFilterOrderStatus(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {orderStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div>
              <label
                htmlFor="dateFrom"
                className="block text-sm font-medium mb-1"
              >
                Date From
              </label>
              <input
                type="date"
                id="dateFrom"
                name="dateFrom"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Date To */}
            <div>
              <label
                htmlFor="dateTo"
                className="block text-sm font-medium mb-1"
              >
                Date To
              </label>
              <input
                type="date"
                id="dateTo"
                name="dateTo"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-end space-x-3 md:col-span-6 lg:col-span-6">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <i className="fa fa-filter fa-light"></i> Filter
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <i className="fa fa-undo-alt fa-light"></i> Reset
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <i className="fa fa-refresh fa-light"></i> Clear
              </button>
              <button
                type="button"
                onClick={generateReport}
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <i className="fa fa-file-text fa-light"></i> Report
              </button>
            </div>
          </form>
        </section>

        {/* Orders Table Section */}
        <section className="bg-card rounded shadow py-6">
          <h2 className="text-xl font-semibold mb-4">Orders List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer select-none"
                    onClick={() => handleSort("orderId")}
                  >
                    Order ID{" "}
                    {sortField === "orderId" && (
                      <i
                        className={`fa fa-sort-${
                          sortDirection === "asc" ? "up" : "down"
                        } fa-light ml-1`}
                      ></i>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer select-none"
                    onClick={() => handleSort("customerName")}
                  >
                    Customer Name{" "}
                    {sortField === "customerName" && (
                      <i
                        className={`fa fa-sort-${
                          sortDirection === "asc" ? "up" : "down"
                        } fa-light ml-1`}
                      ></i>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer select-none"
                    onClick={() => handleSort("date")}
                  >
                    Date{" "}
                    {sortField === "date" && (
                      <i
                        className={`fa fa-sort-${
                          sortDirection === "asc" ? "up" : "down"
                        } fa-light ml-1`}
                      ></i>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-sm font-medium text-muted-foreground cursor-pointer select-none"
                    onClick={() => handleSort("totalAmount")}
                  >
                    Total Amount{" "}
                    {sortField === "totalAmount" && (
                      <i
                        className={`fa fa-sort-${
                          sortDirection === "asc" ? "up" : "down"
                        } fa-light ml-1`}
                      ></i>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer select-none"
                    onClick={() => handleSort("paymentStatus")}
                  >
                    Payment Status{" "}
                    {sortField === "paymentStatus" && (
                      <i
                        className={`fa fa-sort-${
                          sortDirection === "asc" ? "up" : "down"
                        } fa-light ml-1`}
                      ></i>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer select-none"
                    onClick={() => handleSort("orderStatus")}
                  >
                    Order Status{" "}
                    {sortField === "orderStatus" && (
                      <i
                        className={`fa fa-sort-${
                          sortDirection === "asc" ? "up" : "down"
                        } fa-light ml-1`}
                      ></i>
                    )}
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center px-4 py-6 text-muted-foreground italic"
                    >
                      No orders found.
                    </td>
                  </tr>
                )}
                {paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                      {order.orderId}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                      {order.customerName}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                      {order.date}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right whitespace-nowrap">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      {order.paymentStatus === "Paid" ? (
                        <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Paid
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      {order.orderStatus === "Delivered" ? (
                        <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          Delivered
                        </span>
                      ) : order.orderStatus === "Processing" ? (
                        <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                          Processing
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          Cancelled
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-sm space-x-3 whitespace-nowrap">
                      <button
                        type="button"
                        className="text-primary hover:text-primary/80 transition-colors"
                        onClick={() => handleEdit(order.id)}
                        aria-label={`Edit order ${order.orderId}`}
                      >
                        <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
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
            totalItems={filteredOrders.length}
            onPageChange={setCurrentPage}
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
                Edit Order
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Order ID */}
                <div>
                  <label
                    htmlFor="editOrderId"
                    className="block text-sm font-medium mb-1"
                  >
                    Order ID
                  </label>
                  <input
                    type="text"
                    id="editOrderId"
                    name="orderId"
                    value={editForm.orderId}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter order ID"
                  />
                </div>

                {/* Customer Name */}
                <div>
                  <label
                    htmlFor="editCustomerName"
                    className="block text-sm font-medium mb-1"
                  >
                    Customer Name
                  </label>
                  <input
                    type="text"
                    id="editCustomerName"
                    name="customerName"
                    value={editForm.customerName}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter customer name"
                  />
                </div>

                {/* Date */}
                <div>
                  <label
                    htmlFor="editDate"
                    className="block text-sm font-medium mb-1"
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

                {/* Total Amount */}
                <div>
                  <label
                    htmlFor="editTotalAmount"
                    className="block text-sm font-medium mb-1"
                  >
                    Total Amount
                  </label>
                  <input
                    type="number"
                    id="editTotalAmount"
                    name="totalAmount"
                    value={editForm.totalAmount}
                    onChange={handleEditInputChange}
                    min={0}
                    step="0.01"
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter total amount"
                  />
                </div>

                {/* Payment Status */}
                <div>
                  <label
                    htmlFor="editPaymentStatus"
                    className="block text-sm font-medium mb-1"
                  >
                    Payment Status
                  </label>
                  <select
                    id="editPaymentStatus"
                    name="paymentStatus"
                    value={editForm.paymentStatus}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {paymentStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Order Status */}
                <div>
                  <label
                    htmlFor="editOrderStatus"
                    className="block text-sm font-medium mb-1"
                  >
                    Order Status
                  </label>
                  <select
                    id="editOrderStatus"
                    name="orderStatus"
                    value={editForm.orderStatus}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {orderStatusOptions.map((status) => (
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
}