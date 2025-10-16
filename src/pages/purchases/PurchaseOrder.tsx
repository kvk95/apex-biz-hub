import { apiService } from "@/services/ApiService";
import React, { useEffect, useState } from "react";
import { Pagination } from "@/components/Pagination/Pagination";

export default function PurchaseOrder() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("PurchaseOrder");
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

  // Data state for purchase orders
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  useEffect(() => {
    setPurchaseOrders(data);
  }, [data]);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    poNumber: "",
    supplier: "",
    date: "",
    status: "Pending",
    items: [
      {
        product: "",
        qty: 1,
        price: 0,
      },
    ],
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Form state for Add Section (preserved exactly)
  const [form, setForm] = useState({
    poNumber: "",
    supplier: "",
    date: "",
    status: "Pending",
    items: [
      {
        product: "",
        qty: 1,
        price: 0,
      },
    ],
  });

  // Handlers for Add Section form inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number,
    field?: string
  ) => {
    if (typeof index === "number" && field) {
      // Item field change
      const newItems = [...form.items];
      if (field === "qty" || field === "price") {
        newItems[index][field] = Number(e.target.value);
      } else {
        newItems[index][field] = e.target.value;
      }
      setForm({ ...form, items: newItems });
    } else {
      // General form field change
      const { name, value } = e.target;
      setForm({ ...form, [name]: value });
    }
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number,
    field?: string
  ) => {
    if (typeof index === "number" && field) {
      const newItems = [...editForm.items];
      if (field === "qty" || field === "price") {
        newItems[index][field] = Number(e.target.value);
      } else {
        newItems[index][field] = e.target.value;
      }
      setEditForm({ ...editForm, items: newItems });
    } else {
      const { name, value } = e.target;
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { product: "", qty: 1, price: 0 }],
    });
  };

  const removeItem = (index: number) => {
    const newItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems.length ? newItems : [{ product: "", qty: 1, price: 0 }] });
  };

  const addEditItem = () => {
    setEditForm({
      ...editForm,
      items: [...editForm.items, { product: "", qty: 1, price: 0 }],
    });
  };

  const removeEditItem = (index: number) => {
    const newItems = editForm.items.filter((_, i) => i !== index);
    setEditForm({ ...editForm, items: newItems.length ? newItems : [{ product: "", qty: 1, price: 0 }] });
  };

  const calculateItemTotal = (item: { qty: number; price: number }) =>
    item.qty * item.price;

  const calculateFormTotal = (items: typeof form.items) =>
    items.reduce((acc, item) => acc + calculateItemTotal(item), 0);

  // Save handler for Add Section (Add new PO)
  const handleSave = () => {
    if (!form.poNumber || !form.supplier || !form.date) {
      alert("Please fill in PO Number, Supplier, and Date.");
      return;
    }
    const newId = purchaseOrders.length ? Math.max(...purchaseOrders.map((d) => d.id)) + 1 : 1;
    const newPO = {
      id: newId,
      poNumber: form.poNumber,
      supplier: form.supplier,
      date: form.date,
      status: form.status,
      total: calculateFormTotal(form.items),
      items: form.items.map((item, idx) => ({
        id: idx + 1,
        product: item.product,
        qty: item.qty,
        price: item.price,
        total: calculateItemTotal(item),
      })),
    };
    setPurchaseOrders([...purchaseOrders, newPO]);
    setForm({
      poNumber: "",
      supplier: "",
      date: "",
      status: "Pending",
      items: [{ product: "", qty: 1, price: 0 }],
    });
    setCurrentPage(Math.ceil((purchaseOrders.length + 1) / itemsPerPage));
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = purchaseOrders.find((d) => d.id === id);
    if (item) {
      setEditForm({
        poNumber: item.poNumber,
        supplier: item.supplier,
        date: item.date,
        status: item.status,
        items: item.items.map((i: any) => ({
          product: i.product,
          qty: i.qty,
          price: i.price,
        })),
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (!editForm.poNumber || !editForm.supplier || !editForm.date) {
      alert("Please fill in PO Number, Supplier, and Date.");
      return;
    }
    if (editId !== null) {
      const updatedPO = {
        id: editId,
        poNumber: editForm.poNumber,
        supplier: editForm.supplier,
        date: editForm.date,
        status: editForm.status,
        total: calculateFormTotal(editForm.items),
        items: editForm.items.map((item, idx) => ({
          id: idx + 1,
          product: item.product,
          qty: item.qty,
          price: item.price,
          total: calculateItemTotal(item),
        })),
      };
      setPurchaseOrders((prev) =>
        prev.map((item) => (item.id === editId ? updatedPO : item))
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

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this Purchase Order? This action cannot be undone."
      )
    ) {
      const filteredPOs = purchaseOrders.filter((po) => po.id !== id);
      setPurchaseOrders(filteredPOs);
      if (editId === id) {
        setEditId(null);
        setIsEditModalOpen(false);
      }
      if (currentPage > Math.ceil(filteredPOs.length / itemsPerPage)) {
        setCurrentPage((p) => Math.max(p - 1, 1));
      }
    }
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setForm({
      poNumber: "",
      supplier: "",
      date: "",
      status: "Pending",
      items: [{ product: "", qty: 1, price: 0 }],
    });
    setEditId(null);
    setIsEditModalOpen(false);
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report Data:\n" + JSON.stringify(purchaseOrders, null, 2));
  };

  // Paginated data using Pagination component props
  const paginatedPOs = purchaseOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background"> 
      <h1 className="text-lg font-semibold mb-6">Purchase Order</h1>

      {/* Form Section (Add Section) - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label
              htmlFor="poNumber"
              className="block text-sm font-medium mb-1"
            >
              PO Number
            </label>
            <input
              type="text"
              id="poNumber"
              name="poNumber"
              value={form.poNumber}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter PO Number"
              required
            />
          </div>
          <div>
            <label
              htmlFor="supplier"
              className="block text-sm font-medium mb-1"
            >
              Supplier
            </label>
            <input
              type="text"
              id="supplier"
              name="supplier"
              value={form.supplier}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter Supplier"
              required
            />
          </div>
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
              name="date"
              value={form.date}
              onChange={handleInputChange}
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
              name="status"
              value={form.status}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full border border-border rounded">
            <thead className="bg-muted text-muted-foreground text-left text-sm font-semibold">
              <tr>
                <th className="px-4 py-2 border-r border-border">Product</th>
                <th className="px-4 py-2 border-r border-border w-24">Qty</th>
                <th className="px-4 py-2 border-r border-border w-28">Price</th>
                <th className="px-4 py-2 border-border w-28">Total</th>
                <th className="px-4 py-2 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {form.items.map((item, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-background" : "bg-muted/50"}
                >
                  <td className="px-4 py-2 border-r border-border">
                    <input
                      type="text"
                      value={item.product}
                      onChange={(e) => handleInputChange(e, idx, "product")}
                      className="w-full border border-input rounded px-2 py-1 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </td>
                  <td className="px-4 py-2 border-r border-border">
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => handleInputChange(e, idx, "qty")}
                      className="w-full border border-input rounded px-2 py-1 text-right bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </td>
                  <td className="px-4 py-2 border-r border-border">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.price}
                      onChange={(e) => handleInputChange(e, idx, "price")}
                      className="w-full border border-input rounded px-2 py-1 text-right bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </td>
                  <td className="px-4 py-2 border-border text-right font-semibold">
                    ${calculateItemTotal(item).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="text-destructive hover:text-destructive/80"
                      title="Remove Item"
                    >
                      <i className="fa fa-trash fa-light" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-muted font-semibold text-muted-foreground">
              <tr>
                <td colSpan={3} className="px-4 py-2 text-right">
                  Total:
                </td>
                <td className="px-4 py-2 text-right">
                  ${calculateFormTotal(form.items).toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <i className="fa fa-plus fa-light" aria-hidden="true"></i>
            Add Item
          </button>

          <div className="space-x-3">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-save fa-light" aria-hidden="true"></i>
              Save
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-refresh fa-light" aria-hidden="true"></i>
              Clear
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-file-text fa-light" aria-hidden="true"></i>
              Report
            </button>
          </div>
        </div>
      </section>

      {/* Purchase Orders List */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-32">
                  PO Number
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Supplier
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-36">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-28">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground w-32">
                  Total
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground w-36">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedPOs.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No Purchase Orders found.
                  </td>
                </tr>
              )}
              {paginatedPOs.map((po) => (
                <tr
                  key={po.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 text-sm text-foreground">{po.poNumber}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{po.supplier}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{po.date}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        po.status === "Completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : po.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {po.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-foreground">
                    ${po.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(po.id);
                      }}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit PO ${po.poNumber}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(po.id);
                      }}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete PO ${po.poNumber}`}
                      type="button"
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
          totalItems={purchaseOrders.length}
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
          <div className="bg-card rounded shadow-lg max-w-xl w-full p-6 relative">
            <h2
              id="edit-modal-title"
              className="text-xl font-semibold mb-4 text-center"
            >
              Edit Purchase Order
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label
                  htmlFor="editPoNumber"
                  className="block text-sm font-medium mb-1"
                >
                  PO Number
                </label>
                <input
                  type="text"
                  id="editPoNumber"
                  name="poNumber"
                  value={editForm.poNumber}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter PO Number"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="editSupplier"
                  className="block text-sm font-medium mb-1"
                >
                  Supplier
                </label>
                <input
                  type="text"
                  id="editSupplier"
                  name="supplier"
                  value={editForm.supplier}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter Supplier"
                  required
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
                  required
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
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full border border-border rounded">
                <thead className="bg-muted text-muted-foreground text-left text-sm font-semibold">
                  <tr>
                    <th className="px-4 py-2 border-r border-border">Product</th>
                    <th className="px-4 py-2 border-r border-border w-24">Qty</th>
                    <th className="px-4 py-2 border-r border-border w-28">Price</th>
                    <th className="px-4 py-2 border-border w-28">Total</th>
                    <th className="px-4 py-2 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {editForm.items.map((item, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-background" : "bg-muted/50"}
                    >
                      <td className="px-4 py-2 border-r border-border">
                        <input
                          type="text"
                          value={item.product}
                          onChange={(e) => handleEditInputChange(e, idx, "product")}
                          className="w-full border border-input rounded px-2 py-1 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                          required
                        />
                      </td>
                      <td className="px-4 py-2 border-r border-border">
                        <input
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(e) => handleEditInputChange(e, idx, "qty")}
                          className="w-full border border-input rounded px-2 py-1 text-right bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                          required
                        />
                      </td>
                      <td className="px-4 py-2 border-r border-border">
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={item.price}
                          onChange={(e) => handleEditInputChange(e, idx, "price")}
                          className="w-full border border-input rounded px-2 py-1 text-right bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                          required
                        />
                      </td>
                      <td className="px-4 py-2 border-border text-right font-semibold">
                        ${calculateItemTotal(item).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeEditItem(idx)}
                          className="text-destructive hover:text-destructive/80"
                          title="Remove Item"
                        >
                          <i className="fa fa-trash fa-light" aria-hidden="true"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted font-semibold text-muted-foreground">
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-right">
                      Total:
                    </td>
                    <td className="px-4 py-2 text-right">
                      ${calculateFormTotal(editForm.items).toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Modal Buttons */}
            <div className="mt-6 flex justify-between items-center">
              <button
                type="button"
                onClick={addEditItem}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <i className="fa fa-plus fa-light" aria-hidden="true"></i>
                Add Item
              </button>
              <div className="flex gap-3">
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
        </div>
      )}
    </div>
  );
}