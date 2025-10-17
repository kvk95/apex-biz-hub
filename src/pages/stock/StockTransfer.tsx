import React, { useEffect, useMemo, useState } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const stores = ["Main Store", "Outlet 1", "Outlet 2", "Outlet 3"];
const statuses = ["All", "Completed", "Pending"];

export default function StockTransfer() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    date: "",
    referenceNo: "",
    fromStore: "",
    toStore: "",
    product: "",
    quantity: "",
    status: "Pending",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("StockTransfer");
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

  // Handlers for Add Section form inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    switch (id) {
      case "date":
        setFormDate(value);
        break;
      case "referenceNo":
        setFormReferenceNo(value);
        break;
      case "fromStore":
        setFormFromStore(value);
        break;
      case "toStore":
        setFormToStore(value);
        break;
      case "product":
        setFormProduct(value);
        break;
      case "quantity":
        setFormQuantity(value);
        break;
      case "status":
        setFormStatus(value);
        break;
      default:
        break;
    }
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setEditForm((prev) => ({ ...prev, [id]: value }));
  };

  // Save handler for Add Section (Add new stock transfer)
  const handleSave = () => {
    if (
      !formDate ||
      !formReferenceNo.trim() ||
      !formFromStore ||
      !formToStore ||
      !formProduct.trim() ||
      !formQuantity
    ) {
      alert("Please fill all fields.");
      return;
    }
    const newEntry = {
      id: data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1,
      date: formDate,
      referenceNo: formReferenceNo.trim(),
      fromStore: formFromStore,
      toStore: formToStore,
      product: formProduct.trim(),
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
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        date: item.date,
        referenceNo: item.referenceNo,
        fromStore: item.fromStore,
        toStore: item.toStore,
        product: item.product,
        quantity: item.quantity.toString(),
        status: item.status,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (
      !editForm.date ||
      !editForm.referenceNo.trim() ||
      !editForm.fromStore ||
      !editForm.toStore ||
      !editForm.product.trim() ||
      !editForm.quantity
    ) {
      alert("Please fill all fields.");
      return;
    }
    if (editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                date: editForm.date,
                referenceNo: editForm.referenceNo.trim(),
                fromStore: editForm.fromStore,
                toStore: editForm.toStore,
                product: editForm.product.trim(),
                quantity: Number(editForm.quantity),
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

  // Delete handler (no delete button in original destination, so no delete functionality added)

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setFilterFromStore("");
    setFilterToStore("");
    setFilterStatus("All");
    setSearchRef("");
    setCurrentPage(1);
  };

  function handleReport() {
    alert("Report generation is not implemented in this demo.");
  }

  // Calculate paginated data using Pagination component props
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Page Title */}
      <h1 className="text-lg font-semibold mb-6">Stock Transfer</h1>

      {/* Form Section (Add Section) - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Stock Transfer</h2>
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
              className="block text-sm font-medium mb-1"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              value={formDate}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
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
              type="text"
              id="referenceNo"
              value={formReferenceNo}
              onChange={handleInputChange}
              placeholder="Enter reference no"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div>
            <label
              htmlFor="fromStore"
              className="block text-sm font-medium mb-1"
            >
              From Store
            </label>
            <select
              id="fromStore"
              value={formFromStore}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="block text-sm font-medium mb-1"
            >
              To Store
            </label>
            <select
              id="toStore"
              value={formToStore}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="block text-sm font-medium mb-1"
            >
              Product
            </label>
            <input
              type="text"
              id="product"
              value={formProduct}
              onChange={handleInputChange}
              placeholder="Enter product name"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium mb-1"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              min={1}
              value={formQuantity}
              onChange={handleInputChange}
              placeholder="Enter quantity"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium mb-1"
            >
              Status
            </label>
            <select
              id="status"
              value={formStatus}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
            </button>
          </div>
        </form>
      </section>

      {/* Filters and Actions */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Stock Transfer List</h2>
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 mb-4">
          <input
            type="text"
            placeholder="Search Reference No"
            value={searchRef}
            onChange={(e) => setSearchRef(e.target.value)}
            className="border border-input rounded px-3 py-2 w-full md:w-1/4 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <select
            value={filterFromStore}
            onChange={(e) => setFilterFromStore(e.target.value)}
            className="border border-input rounded px-3 py-2 w-full md:w-1/5 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
            className="border border-input rounded px-3 py-2 w-full md:w-1/5 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
            className="border border-input rounded px-3 py-2 w-full md:w-1/6 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            title="Clear Filters"
          >
            <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
          </button>
          <button
            onClick={handleReport}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            title="Generate Report"
          >
            <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Reference No
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                  From Store
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                  To Store
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Status
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
                    colSpan={8}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No stock transfer records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors text-sm text-gray-500"
                  >
                    <td className="px-4 py-2 whitespace-nowrap">{item.date}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{item.referenceNo}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{item.fromStore}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{item.toStore}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{item.product}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-right">{item.quantity}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          item.status === "Completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center space-x-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleEdit(item.id)}
                        aria-label={`Edit stock transfer ${item.referenceNo}`}
                        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
                      >
                        <i className="fa fa-edit fa-light" aria-hidden="true"></i>
                        <span className="sr-only">Edit record</span>
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
              Edit Stock Transfer
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium mb-1"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={editForm.date}
                  onChange={handleEditInputChange}
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
                  type="text"
                  id="referenceNo"
                  value={editForm.referenceNo}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label
                  htmlFor="fromStore"
                  className="block text-sm font-medium mb-1"
                >
                  From Store
                </label>
                <select
                  id="fromStore"
                  value={editForm.fromStore}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                  className="block text-sm font-medium mb-1"
                >
                  To Store
                </label>
                <select
                  id="toStore"
                  value={editForm.toStore}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                  className="block text-sm font-medium mb-1"
                >
                  Product
                </label>
                <input
                  type="text"
                  id="product"
                  value={editForm.product}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium mb-1"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  min={1}
                  value={editForm.quantity}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
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