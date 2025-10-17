import React, { useMemo, useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const pageTitle = "Superadmin Dashboard";

export default function SuperadminDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchOrderId, setSearchOrderId] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    orderId: "",
    customerName: "",
    product: "",
    quantity: 0,
    price: 0,
    status: "",
    date: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<any>("SuperadminDashboard");
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

  // Fallback to empty arrays if data is not structured yet
  const summaryCardsData = data.summaryCardsData || [];
  const salesReportData = data.salesReportData || [];
  const recentOrdersData = data.recentOrdersData || [];

  // Filter recent orders by search fields
  const filteredOrders = useMemo(() => {
    return recentOrdersData.filter((order: any) => {
      return (
        order.orderId.toLowerCase().includes(searchOrderId.toLowerCase()) &&
        order.customerName.toLowerCase().includes(searchCustomer.toLowerCase()) &&
        (searchStatus === "" || order.status === searchStatus)
      );
    });
  }, [searchOrderId, searchCustomer, searchStatus, recentOrdersData]);

  // Paginated data
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleClear = () => {
    setSearchOrderId("");
    setSearchCustomer("");
    setSearchStatus("");
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generated (placeholder)");
  };

  // Edit modal handlers
  const handleEdit = (order: any) => {
    setEditForm({
      orderId: order.orderId,
      customerName: order.customerName,
      product: order.product,
      quantity: order.quantity,
      price: order.price,
      status: order.status,
      date: order.date,
    });
    setEditId(order.id);
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    // In a real app, you would update the data here and close the modal
    setIsEditModalOpen(false);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card rounded shadow px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">{pageTitle}</h1>
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Clear"
          title="Clear"
        >
          <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
        </button>
      </header>

      <main className="p-6 space-y-8">
        {/* Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryCardsData.map(({ title, value, icon, bgColor }: any) => (
            <div
              key={title}
              className={`flex items-center p-4 rounded-lg shadow-md text-white ${bgColor}`}
            >
              <div className="text-3xl mr-4">
                <i className={`${icon} fa-light`}></i>
              </div>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xl font-bold">{value}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Sales Report Section */}
        <section className="bg-card rounded shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Sales Report</h2>
            <button
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Generate Report"
              title="Generate Report"
            >
              <i className="fa fa-file-alt fa-light" aria-hidden="true"></i> Report
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Month</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Sales ($)</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Orders</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Customers</th>
                </tr>
              </thead>
              <tbody>
                {salesReportData.map(({ month, sales, orders, customers }: any) => (
                  <tr key={month} className="border-b border-border hover:bg-muted/50 transition-colors text-sm text-gray-500">
                    <td className="px-4 py-2">{month}</td>
                    <td className="px-4 py-2">{sales.toLocaleString()}</td>
                    <td className="px-4 py-2">{orders.toLocaleString()}</td>
                    <td className="px-4 py-2">{customers.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Orders Section */}
        <section className="bg-card rounded shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <button
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Generate Report"
              title="Generate Report"
            >
              <i className="fa fa-file-alt fa-light" aria-hidden="true"></i> Report
            </button>
          </div>

          {/* Filters */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
            className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div>
              <label htmlFor="searchOrderId" className="block text-sm font-medium mb-1">
                Order ID
              </label>
              <input
                id="searchOrderId"
                type="text"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                placeholder="Search Order ID"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="searchCustomer" className="block text-sm font-medium mb-1">
                Customer Name
              </label>
              <input
                id="searchCustomer"
                type="text"
                value={searchCustomer}
                onChange={(e) => setSearchCustomer(e.target.value)}
                placeholder="Search Customer"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="searchStatus" className="block text-sm font-medium mb-1">
                Status
              </label>
              <select
                id="searchStatus"
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">All</option>
                <option value="Delivered">Delivered</option>
                <option value="Processing">Processing</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </form>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Order ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Product</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Quantity</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Price ($)</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center px-4 py-6 text-muted-foreground italic">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map(
                    ({
                      id,
                      orderId,
                      customerName,
                      product,
                      quantity,
                      price,
                      status,
                      date,
                    }: any) => (
                      <tr
                        key={id}
                        className="border-b border-border hover:bg-muted/50 transition-colors text-sm text-gray-500"
                      >
                        <td className="px-4 py-2 font-mono">{orderId}</td>
                        <td className="px-4 py-2">{customerName}</td>
                        <td className="px-4 py-2">{product}</td>
                        <td className="px-4 py-2 text-center">{quantity}</td>
                        <td className="px-4 py-2 text-right">{price.toFixed(2)}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              status === "Delivered"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : status === "Processing"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {new Date(date).toLocaleDateString("en-US")}
                        </td>
                        <td className="px-4 py-2 text-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleEdit({ id, orderId, customerName, product, quantity, price, status, date })}
                            aria-label={`Edit order ${orderId}`}
                            className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
                          >
                            <i className="fa fa-edit fa-light" aria-hidden="true"></i>
                            <span className="sr-only">Edit record</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => alert(`Delete functionality for ${orderId}`)}
                            aria-label={`Delete order ${orderId}`}
                            className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
                          >
                            <i className="fa fa-trash-can-xmark fa-light" aria-hidden="true"></i>
                            <span className="sr-only">Delete record</span>
                          </button>
                        </td>
                      </tr>
                    )
                  )
                )}
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
      </main>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-modal-title"
        >
          <div className="bg-white rounded shadow-lg max-w-xl w-full p-6 relative">
            <h2 id="edit-modal-title" className="text-xl font-semibold mb-4 text-center">
              Edit Order
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="editOrderId" className="block text-sm font-medium mb-1">
                  Order ID
                </label>
                <input
                  type="text"
                  id="editOrderId"
                  name="orderId"
                  value={editForm.orderId}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Order ID"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="editCustomerName" className="block text-sm font-medium mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  id="editCustomerName"
                  name="customerName"
                  value={editForm.customerName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Customer Name"
                />
              </div>
              <div>
                <label htmlFor="editProduct" className="block text-sm font-medium mb-1">
                  Product
                </label>
                <input
                  type="text"
                  id="editProduct"
                  name="product"
                  value={editForm.product}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Product"
                />
              </div>
              <div>
                <label htmlFor="editQuantity" className="block text-sm font-medium mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  id="editQuantity"
                  name="quantity"
                  value={editForm.quantity}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Quantity"
                />
              </div>
              <div>
                <label htmlFor="editPrice" className="block text-sm font-medium mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  id="editPrice"
                  name="price"
                  value={editForm.price}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Price"
                />
              </div>
              <div>
                <label htmlFor="editStatus" className="block text-sm font-medium mb-1">
                  Status
                </label>
                <select
                  id="editStatus"
                  name="status"
                  value={editForm.status}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Delivered">Delivered</option>
                  <option value="Processing">Processing</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label htmlFor="editDate" className="block text-sm font-medium mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="editDate"
                  name="date"
                  value={editForm.date}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Date"
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
  );
}