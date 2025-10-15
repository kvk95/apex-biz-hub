import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const categories = [
  "All",
  "Smartphones",
  "Headphones",
  "Laptops",
  "Accessories",
];

const SoldStock: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("SoldStock");
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

  // Filters state
  const [invoiceIdFilter, setInvoiceIdFilter] = useState("");
  const [stockIdFilter, setStockIdFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [customerNameFilter, setCustomerNameFilter] = useState("");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    invoiceId: "",
    stockId: "",
    productName: "",
    category: "All",
    quantity: "",
    unitPrice: "",
    totalPrice: "",
    customerName: "",
    date: "",
  });
  const [editKey, setEditKey] = useState<string | null>(null);

  // Filtered data based on filters
  const filteredData = useMemo(() => {
    return data.filter((item: any) => {
      if (
        invoiceIdFilter &&
        !item.invoiceId.toLowerCase().includes(invoiceIdFilter.toLowerCase())
      )
        return false;
      if (
        stockIdFilter &&
        !item.stockId.toLowerCase().includes(stockIdFilter.toLowerCase())
      )
        return false;
      if (categoryFilter !== "All" && item.category !== categoryFilter)
        return false;
      if (
        customerNameFilter &&
        !item.customerName.toLowerCase().includes(customerNameFilter.toLowerCase())
      )
        return false;
      if (dateFromFilter && item.date < dateFromFilter) return false;
      if (dateToFilter && item.date > dateToFilter) return false;
      return true;
    });
  }, [
    data,
    invoiceIdFilter,
    stockIdFilter,
    categoryFilter,
    customerNameFilter,
    dateFromFilter,
    dateToFilter,
  ]);

  // Paginated data using Pagination component logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Handlers
  const handleResetFilters = () => {
    setInvoiceIdFilter("");
    setStockIdFilter("");
    setCategoryFilter("All");
    setCustomerNameFilter("");
    setDateFromFilter("");
    setDateToFilter("");
    setCurrentPage(1);
  };

  const handleClear = () => {
    handleResetFilters();
    setEditKey(null);
  };

  const handleRefresh = () => {
    // For demo, just reset filters and page
    handleClear();
  };

  const handleReport = () => {
    // For demo, alert report generation
    alert("Report generated for current filtered data.");
  };

  // Edit modal handlers
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (key: string) => {
    const item = data.find(
      (d: any) => d.invoiceId + d.stockId === key
    );
    if (item) {
      setEditForm({
        invoiceId: item.invoiceId,
        stockId: item.stockId,
        productName: item.productName,
        category: item.category,
        quantity: item.quantity.toString(),
        unitPrice: item.unitPrice.toString(),
        totalPrice: item.totalPrice.toString(),
        customerName: item.customerName,
        date: item.date,
      });
      setEditKey(key);
      setIsEditModalOpen(true);
    }
  };

  const handleEditSave = () => {
    if (
      !editForm.invoiceId.trim() ||
      !editForm.stockId.trim() ||
      !editForm.productName.trim() ||
      !editForm.category.trim() ||
      !editForm.quantity ||
      !editForm.unitPrice ||
      !editForm.totalPrice ||
      !editForm.customerName.trim() ||
      !editForm.date
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (editKey !== null) {
      setData((prev) =>
        prev.map((item: any) =>
          item.invoiceId + item.stockId === editKey
            ? {
                invoiceId: editForm.invoiceId.trim(),
                stockId: editForm.stockId.trim(),
                productName: editForm.productName.trim(),
                category: editForm.category,
                quantity: Number(editForm.quantity),
                unitPrice: Number(editForm.unitPrice),
                totalPrice: Number(editForm.totalPrice),
                customerName: editForm.customerName.trim(),
                date: editForm.date,
              }
            : item
        )
      );
      setEditKey(null);
      setIsEditModalOpen(false);
    }
  };

  const handleEditCancel = () => {
    setEditKey(null);
    setIsEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Sold Stock</h1>

      {/* Filters Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6"
          aria-label="Filter Sold Stock"
        >
          {/* Invoice ID */}
          <div>
            <label
              htmlFor="invoiceId"
              className="block text-sm font-medium mb-1"
            >
              Invoice ID
            </label>
            <input
              id="invoiceId"
              type="text"
              value={invoiceIdFilter}
              onChange={(e) => setInvoiceIdFilter(e.target.value)}
              placeholder="Invoice ID"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Stock ID */}
          <div>
            <label
              htmlFor="stockId"
              className="block text-sm font-medium mb-1"
            >
              Stock ID
            </label>
            <input
              id="stockId"
              type="text"
              value={stockIdFilter}
              onChange={(e) => setStockIdFilter(e.target.value)}
              placeholder="Stock ID"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-1"
            >
              Category
            </label>
            <select
              id="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
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
              id="customerName"
              type="text"
              value={customerNameFilter}
              onChange={(e) => setCustomerNameFilter(e.target.value)}
              placeholder="Customer Name"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
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
              id="dateFrom"
              type="date"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
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
              id="dateTo"
              type="date"
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Buttons Row */}
          <div className="md:col-span-3 lg:col-span-6 flex flex-wrap gap-3 mt-6">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Search Sold Stock"
            >
              <i className="fa fa-search fa-light" aria-hidden="true"></i> Search
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Reset Filters"
            >
              <i className="fa fa-undo fa-light" aria-hidden="true"></i> Reset
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Clear Filters"
            >
              <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Generate Report"
            >
              <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Invoice ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Stock ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Product Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Category
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Quantity
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Unit Price ($)
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Total Price ($)
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Customer Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Date
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No sold stock found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item: any, idx: number) => (
                  <tr
                    key={item.invoiceId + item.stockId}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                      {item.invoiceId}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                      {item.stockId}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                      {item.productName}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right whitespace-nowrap">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right whitespace-nowrap">
                      {item.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right whitespace-nowrap">
                      {item.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                      {item.customerName}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="px-4 py-3 text-center text-sm space-x-3">
                      <button
                        onClick={() => handleEdit(item.invoiceId + item.stockId)}
                        className="text-primary hover:text-primary/80 transition-colors"
                        aria-label={`Edit sold stock ${item.invoiceId} ${item.stockId}`}
                        type="button"
                      >
                        <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
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
              Edit Sold Stock
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Invoice ID */}
              <div>
                <label
                  htmlFor="editInvoiceId"
                  className="block text-sm font-medium mb-1"
                >
                  Invoice ID
                </label>
                <input
                  type="text"
                  id="editInvoiceId"
                  name="invoiceId"
                  value={editForm.invoiceId}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Invoice ID"
                />
              </div>

              {/* Stock ID */}
              <div>
                <label
                  htmlFor="editStockId"
                  className="block text-sm font-medium mb-1"
                >
                  Stock ID
                </label>
                <input
                  type="text"
                  id="editStockId"
                  name="stockId"
                  value={editForm.stockId}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Stock ID"
                />
              </div>

              {/* Product Name */}
              <div>
                <label
                  htmlFor="editProductName"
                  className="block text-sm font-medium mb-1"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  id="editProductName"
                  name="productName"
                  value={editForm.productName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Product Name"
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="editCategory"
                  className="block text-sm font-medium mb-1"
                >
                  Category
                </label>
                <select
                  id="editCategory"
                  name="category"
                  value={editForm.category}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label
                  htmlFor="editQuantity"
                  className="block text-sm font-medium mb-1"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="editQuantity"
                  name="quantity"
                  value={editForm.quantity}
                  onChange={handleEditInputChange}
                  min={0}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Quantity"
                />
              </div>

              {/* Unit Price */}
              <div>
                <label
                  htmlFor="editUnitPrice"
                  className="block text-sm font-medium mb-1"
                >
                  Unit Price ($)
                </label>
                <input
                  type="number"
                  id="editUnitPrice"
                  name="unitPrice"
                  value={editForm.unitPrice}
                  onChange={handleEditInputChange}
                  min={0}
                  step="0.01"
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Unit Price"
                />
              </div>

              {/* Total Price */}
              <div>
                <label
                  htmlFor="editTotalPrice"
                  className="block text-sm font-medium mb-1"
                >
                  Total Price ($)
                </label>
                <input
                  type="number"
                  id="editTotalPrice"
                  name="totalPrice"
                  value={editForm.totalPrice}
                  onChange={handleEditInputChange}
                  min={0}
                  step="0.01"
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Total Price"
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
                  placeholder="Customer Name"
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
};

export default SoldStock;