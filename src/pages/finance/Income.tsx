import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const categories = ["All", "Sales", "Service"];
const accounts = ["All", "Cash", "Bank"];
const paymentMethods = ["All", "Cash", "Card"];

export default function Income() {
  // Page title as in reference: "Income"
  useEffect(() => {}, []);

  // Filters state
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterAccount, setFilterAccount] = useState("All");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("All");
  const [searchInvoice, setSearchInvoice] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // API call and state variables
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    date: "",
    invoiceId: "",
    customer: "",
    category: "All",
    account: "All",
    amount: "",
    paymentMethod: "All",
    description: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Income");
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

  // Filtered and searched data memoized
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (filterDateFrom && item.date < filterDateFrom) return false;
      if (filterDateTo && item.date > filterDateTo) return false;
      if (filterCategory !== "All" && item.category !== filterCategory)
        return false;
      if (filterAccount !== "All" && item.account !== filterAccount) return false;
      if (
        filterPaymentMethod !== "All" &&
        item.paymentMethod !== filterPaymentMethod
      )
        return false;
      if (
        searchInvoice.trim() &&
        !item.invoiceId.toLowerCase().includes(searchInvoice.toLowerCase())
      )
        return false;
      return true;
    });
  }, [
    filterDateFrom,
    filterDateTo,
    filterCategory,
    filterAccount,
    filterPaymentMethod,
    searchInvoice,
    data,
  ]);

  // Paginated data using Pagination component props
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleResetFilters = () => {
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterCategory("All");
    setFilterAccount("All");
    setFilterPaymentMethod("All");
    setSearchInvoice("");
    setCurrentPage(1);
  };

  const handleClear = () => {
    handleResetFilters();
    setEditId(null);
  };

  const handleRefresh = () => {
    // For demo, just reset filters and page
    handleClear();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  // Edit modal handlers
  const openEditModal = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        date: item.date,
        invoiceId: item.invoiceId,
        customer: item.customer,
        category: item.category,
        account: item.account,
        amount: item.amount.toString(),
        paymentMethod: item.paymentMethod,
        description: item.description,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    // Validate required fields (date, invoiceId, amount)
    if (
      !editForm.date ||
      !editForm.invoiceId.trim() ||
      !editForm.amount
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
                invoiceId: editForm.invoiceId.trim(),
                customer: editForm.customer,
                category: editForm.category,
                account: editForm.account,
                amount: Number(editForm.amount),
                paymentMethod: editForm.paymentMethod,
                description: editForm.description,
              }
            : item
        )
      );
      setEditId(null);
      setIsEditModalOpen(false);
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setIsEditModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this income record?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      // If deleting last item on page, go to previous page if needed
      if (
        (currentPage - 1) * itemsPerPage >= data.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Title */}
      <h1 className="text-lg font-semibold mb-6">Income</h1>

      {/* Filter Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          className="grid grid-cols-1 md:grid-cols-6 gap-6 items-end"
        >
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
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
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
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Account */}
          <div>
            <label
              htmlFor="account"
              className="block text-sm font-medium mb-1"
            >
              Account
            </label>
            <select
              id="account"
              value={filterAccount}
              onChange={(e) => setFilterAccount(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {accounts.map((acc) => (
                <option key={acc} value={acc}>
                  {acc}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label
              htmlFor="paymentMethod"
              className="block text-sm font-medium mb-1"
            >
              Payment Method
            </label>
            <select
              id="paymentMethod"
              value={filterPaymentMethod}
              onChange={(e) => setFilterPaymentMethod(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {paymentMethods.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>

          {/* Search Invoice */}
          <div className="md:col-span-2">
            <label
              htmlFor="searchInvoice"
              className="block text-sm font-medium mb-1"
            >
              Search Invoice
            </label>
            <input
              type="text"
              id="searchInvoice"
              placeholder="Invoice ID"
              value={searchInvoice}
              onChange={(e) => setSearchInvoice(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 md:col-span-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-search fa-light" aria-hidden="true"></i> Search
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-undo fa-light" aria-hidden="true"></i> Reset
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
            </button>
          </div>
        </form>
      </section>

      {/* Income Table Section */}
      <section className="bg-card rounded shadow py-6">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Invoice ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Account
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Payment Method
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Description
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
                      colSpan={9}
                      className="text-center px-4 py-6 text-muted-foreground italic"
                    >
                      No income records found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                        {item.invoiceId}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                        {item.customer}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                        {item.category}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                        {item.account}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground text-right font-mono whitespace-nowrap">
                        ${item.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                        {item.paymentMethod}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                        {item.description}
                      </td>
                      <td className="px-4 py-3 text-center text-sm space-x-3 whitespace-nowrap">
                        <button
                          type="button"
                          title={`Edit income record ${item.invoiceId}`}
                          className="text-primary hover:text-primary/80 transition-colors"
                          onClick={() => openEditModal(item.id)}
                        >
                          <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                        </button>
                        <button
                          type="button"
                          title={`Delete income record ${item.invoiceId}`}
                          className="text-destructive hover:text-destructive/80 transition-colors"
                          onClick={() => handleDelete(item.id)}
                        >
                          <i className="fa fa-trash fa-light" aria-hidden="true"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredData.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handleItemsPerPageChange}
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
              Edit Income Record
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  placeholder="Enter invoice ID"
                />
              </div>

              {/* Customer */}
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

              {/* Account */}
              <div>
                <label
                  htmlFor="editAccount"
                  className="block text-sm font-medium mb-1"
                >
                  Account
                </label>
                <select
                  id="editAccount"
                  name="account"
                  value={editForm.account}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {accounts.map((acc) => (
                    <option key={acc} value={acc}>
                      {acc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label
                  htmlFor="editAmount"
                  className="block text-sm font-medium mb-1"
                >
                  Amount
                </label>
                <input
                  type="number"
                  id="editAmount"
                  name="amount"
                  value={editForm.amount}
                  onChange={handleEditInputChange}
                  min={0}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter amount"
                />
              </div>

              {/* Payment Method */}
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
                  {paymentMethods.map((pm) => (
                    <option key={pm} value={pm}>
                      {pm}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="md:col-span-3">
                <label
                  htmlFor="editDescription"
                  className="block text-sm font-medium mb-1"
                >
                  Description
                </label>
                <input
                  type="text"
                  id="editDescription"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter description"
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