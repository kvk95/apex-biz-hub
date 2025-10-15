import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const paymentMethods = ["All", "Credit Card", "Paypal", "Cash"];
const statuses = ["All", "Pending", "Completed", "Cancelled"];

export default function OnlineOrders() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("OnlineOrders");
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
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPayment, setFilterPayment] = useState("All");
  const [searchOrderId, setSearchOrderId] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");

  // Sorting state
  const [sortField, setSortField] = useState<keyof (typeof data)[0] | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    orderId: "",
    customer: "",
    date: "",
    status: "",
    paymentMethod: "",
    total: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Filtered and sorted data memoized
  const filteredData = useMemo(() => {
    let filtered = [...data];

    if (filterStatus !== "All") {
      filtered = filtered.filter((o) => o.status === filterStatus);
    }
    if (filterPayment !== "All") {
      filtered = filtered.filter((o) => o.paymentMethod === filterPayment);
    }
    if (searchOrderId.trim() !== "") {
      filtered = filtered.filter((o) =>
        o.orderId.toLowerCase().includes(searchOrderId.toLowerCase())
      );
    }
    if (searchCustomer.trim() !== "") {
      filtered = filtered.filter((o) =>
        o.customer.toLowerCase().includes(searchCustomer.toLowerCase())
      );
    }

    if (sortField) {
      filtered.sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, filterStatus, filterPayment, searchOrderId, searchCustomer, sortField, sortDirection]);

  // Calculate paginated data using Pagination component props
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleSort = (field: keyof (typeof data)[0]) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleClear = () => {
    setFilterStatus("All");
    setFilterPayment("All");
    setSearchOrderId("");
    setSearchCustomer("");
    setSortField(null);
    setSortDirection("asc");
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generated for current filtered orders.");
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        orderId: item.orderId,
        customer: item.customer,
        date: item.date.slice(0, 10),
        status: item.status,
        paymentMethod: item.paymentMethod,
        total: item.total.toString(),
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
      !editForm.customer.trim() ||
      !editForm.date ||
      !editForm.status ||
      !editForm.paymentMethod ||
      !editForm.total
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
                customer: editForm.customer.trim(),
                date: editForm.date,
                status: editForm.status,
                paymentMethod: editForm.paymentMethod,
                total: Number(editForm.total),
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
      <title>Online Orders - Dreams POS</title>
      <div className="min-h-screen bg-background font-sans p-6">
        <div className="max-w-7xl mx-auto bg-card rounded shadow p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-2xl font-semibold mb-4 md:mb-0 text-foreground">
              Online Orders
            </h1>
            <div className="flex space-x-3">
              <button
                onClick={handleReport}
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
                aria-label="Generate Report"
              >
                <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
              </button>
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
                aria-label="Clear"
              >
                <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
              </button>
            </div>
          </div>

          {/* Filters Section */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6"
            aria-label="Filter Orders Form"
          >
            <div>
              <label
                htmlFor="orderId"
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                Order ID
              </label>
              <input
                id="orderId"
                type="text"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                placeholder="Search Order ID"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label
                htmlFor="customer"
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                Customer
              </label>
              <input
                id="customer"
                type="text"
                value={searchCustomer}
                onChange={(e) => setSearchCustomer(e.target.value)}
                placeholder="Search Customer"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                Status
              </label>
              <select
                id="status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="paymentMethod"
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                Payment Method
              </label>
              <select
                id="paymentMethod"
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </form>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th
                    scope="col"
                    className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-muted-foreground select-none"
                    onClick={() => handleSort("orderId")}
                    aria-sort={
                      sortField === "orderId"
                        ? sortDirection === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                    tabIndex={0}
                    role="button"
                    aria-label="Sort by Order ID"
                  >
                    Order ID{" "}
                    {sortField === "orderId" && (
                      <i
                        className={`fa fa-sort-${sortDirection === "asc" ? "up" : "down"} ml-1 fa-light`}
                        aria-hidden="true"
                      ></i>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-muted-foreground select-none"
                    onClick={() => handleSort("customer")}
                    aria-sort={
                      sortField === "customer"
                        ? sortDirection === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                    tabIndex={0}
                    role="button"
                    aria-label="Sort by Customer"
                  >
                    Customer{" "}
                    {sortField === "customer" && (
                      <i
                        className={`fa fa-sort-${sortDirection === "asc" ? "up" : "down"} ml-1 fa-light`}
                        aria-hidden="true"
                      ></i>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-muted-foreground select-none"
                    onClick={() => handleSort("date")}
                    aria-sort={
                      sortField === "date"
                        ? sortDirection === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                    tabIndex={0}
                    role="button"
                    aria-label="Sort by Date"
                  >
                    Date{" "}
                    {sortField === "date" && (
                      <i
                        className={`fa fa-sort-${sortDirection === "asc" ? "up" : "down"} ml-1 fa-light`}
                        aria-hidden="true"
                      ></i>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-muted-foreground select-none"
                    onClick={() => handleSort("status")}
                    aria-sort={
                      sortField === "status"
                        ? sortDirection === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                    tabIndex={0}
                    role="button"
                    aria-label="Sort by Status"
                  >
                    Status{" "}
                    {sortField === "status" && (
                      <i
                        className={`fa fa-sort-${sortDirection === "asc" ? "up" : "down"} ml-1 fa-light`}
                        aria-hidden="true"
                      ></i>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-muted-foreground select-none"
                    onClick={() => handleSort("paymentMethod")}
                    aria-sort={
                      sortField === "paymentMethod"
                        ? sortDirection === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                    tabIndex={0}
                    role="button"
                    aria-label="Sort by Payment Method"
                  >
                    Payment Method{" "}
                    {sortField === "paymentMethod" && (
                      <i
                        className={`fa fa-sort-${sortDirection === "asc" ? "up" : "down"} ml-1 fa-light`}
                        aria-hidden="true"
                      ></i>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer px-4 py-3 text-right text-sm font-medium text-muted-foreground select-none"
                    onClick={() => handleSort("total")}
                    aria-sort={
                      sortField === "total"
                        ? sortDirection === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                    tabIndex={0}
                    role="button"
                    aria-label="Sort by Total"
                  >
                    Total{" "}
                    {sortField === "total" && (
                      <i
                        className={`fa fa-sort-${sortDirection === "asc" ? "up" : "down"} ml-1 fa-light`}
                        aria-hidden="true"
                      ></i>
                    )}
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center px-4 py-6 text-muted-foreground italic"
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((order, idx) => (
                    <tr
                      key={order.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-primary">
                        {order.orderId}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {order.customer}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            order.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : order.status === "Completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                          aria-label={`Status: ${order.status}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {order.paymentMethod}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-foreground">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center text-sm space-x-3">
                        <button
                          type="button"
                          className="text-primary hover:text-primary/80 transition-colors"
                          aria-label={`Edit order ${order.orderId}`}
                          onClick={() => handleEdit(order.id)}
                        >
                          <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                        </button>
                        <button
                          type="button"
                          className="text-primary hover:text-primary/80 transition-colors"
                          aria-label={`View details for order ${order.orderId}`}
                          onClick={() =>
                            alert(`Viewing details for order ${order.orderId}`)
                          }
                        >
                          <i className="fa fa-eye fa-light" aria-hidden="true"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredData.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setItemsPerPage}
          />
        </div>

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
                <div>
                  <label
                    htmlFor="editCustomer"
                    className="block text-sm font-medium mb-1"
                  >
                    Customer
                  </label>
                  <input
                    type="text"
                    id="editCustomer"
                    name="customer"
                    value={editForm.customer}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter customer name"
                  />
                </div>
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
                <div>
                  <label
                    htmlFor="editStatus"
                    className="block text-sm font-medium mb-1"
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
                    {statuses
                      .filter((s) => s !== "All")
                      .map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="editPaymentMethod"
                    className="block text-sm font-medium mb-1"
                  >
                    Payment Method
                  </label>
                  <select
                    id="editPaymentMethod"
                    name="paymentMethod"
                    value={editForm.paymentMethod}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {paymentMethods
                      .filter((m) => m !== "All")
                      .map((method) => (
                        <option key={method} value={method}>
                          {method}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="editTotal"
                    className="block text-sm font-medium mb-1"
                  >
                    Total
                  </label>
                  <input
                    type="number"
                    id="editTotal"
                    name="total"
                    value={editForm.total}
                    onChange={handleEditInputChange}
                    min={0}
                    step="0.01"
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter total amount"
                  />
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