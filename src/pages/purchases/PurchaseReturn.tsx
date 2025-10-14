import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

export default function PurchaseReturn() {
  // Page title as per reference page
  React.useEffect(() => {}, []);

  // State for form inputs
  const [date, setDate] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [supplier, setSupplier] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [discount, setDiscount] = useState("");
  const [tax, setTax] = useState("");
  const [total, setTotal] = useState(0);

  // State for product list in current return
  const [products, setProducts] = useState<
    {
      id: number;
      code: string;
      name: string;
      quantity: number;
      unitCost: number;
      discount: number;
      tax: number;
      total: number;
    }[]
  >([]);

  // State for purchase returns list pagination and data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("PurchaseReturn");
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

  // Calculate total for product line
  React.useEffect(() => {
    const q = Number(quantity) || 0;
    const uc = Number(unitCost) || 0;
    const dis = Number(discount) || 0;
    const t = Number(tax) || 0;

    // Total = (unitCost * quantity) - discount + tax
    const lineTotal = q * uc - dis + t;
    setTotal(lineTotal > 0 ? lineTotal : 0);
  }, [quantity, unitCost, discount, tax]);

  // Add product to products list
  function addProduct() {
    if (
      !productCode.trim() ||
      !productName.trim() ||
      !quantity ||
      Number(quantity) <= 0 ||
      !unitCost ||
      Number(unitCost) <= 0
    )
      return;

    const newProduct = {
      id: Date.now(),
      code: productCode.trim(),
      name: productName.trim(),
      quantity: Number(quantity),
      unitCost: Number(unitCost),
      discount: Number(discount) || 0,
      tax: Number(tax) || 0,
      total,
    };
    setProducts((prev) => [...prev, newProduct]);

    // Reset product fields
    setProductCode("");
    setProductName("");
    setQuantity("");
    setUnitCost("");
    setDiscount("");
    setTax("");
    setTotal(0);
  }

  // Remove product by id
  function removeProduct(id: number) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  // Edit modal state and form
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    date: "",
    referenceNo: "",
    supplier: "",
    warehouse: "",
    productQty: 0,
    grandTotal: 0,
    status: "Pending",
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = data.find((d: any) => d.id === id);
    if (item) {
      setEditForm({
        date: item.date,
        referenceNo: item.referenceNo,
        supplier: item.supplier,
        warehouse: item.warehouse,
        productQty: item.productQty,
        grandTotal: item.grandTotal,
        status: item.status,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Handle edit form input changes
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
      !editForm.referenceNo.trim() ||
      !editForm.supplier.trim() ||
      !editForm.warehouse.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      setData((prev) =>
        prev.map((item: any) =>
          item.id === editId
            ? {
                ...item,
                date: editForm.date,
                referenceNo: editForm.referenceNo.trim(),
                supplier: editForm.supplier,
                warehouse: editForm.warehouse,
                productQty: Number(editForm.productQty),
                grandTotal: Number(editForm.grandTotal),
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

  // Delete handler for purchase returns
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this purchase return?")) {
      setData((prev) => prev.filter((d: any) => d.id !== id));
      // If deleting last item on page, go to previous page if needed
      if (
        (currentPage - 1) * itemsPerPage >= data.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setDate("");
    setReferenceNo("");
    setSupplier("");
    setWarehouse("");
    setProductCode("");
    setProductName("");
    setQuantity("");
    setUnitCost("");
    setDiscount("");
    setTax("");
    setTotal(0);
    setProducts([]);
    setCurrentPage(1);
  };

  // Dummy handlers for Save and Report buttons
  function onSave() {
    alert("Purchase Return saved (demo).");
  }

  function onReport() {
    alert("Report generated (demo).");
  }

  // Calculate paginated data using Pagination component props
  const paginatedReturns = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [currentPage, itemsPerPage, data]);

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      {/* Page Header */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Purchase Return</h1>
        <div className="flex space-x-3">
          <button
            onClick={onReport}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            title="Report"
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
          <button
            onClick={onSave}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            title="Save"
            type="button"
          >
            <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
          </button>
        </div>
      </header>

      <main>
        {/* Form Section */}
        <section className="bg-card rounded shadow p-6 mb-6">
          <form className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Date */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Reference No */}
            <div>
              <label
                htmlFor="referenceNo"
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                Reference No
              </label>
              <input
                type="text"
                id="referenceNo"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                placeholder="Reference No"
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
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select Supplier</option>
                {data.length > 0 &&
                  data[0].suppliers?.map((s: any) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
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
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select Warehouse</option>
                {data.length > 0 &&
                  data[0].warehouses?.map((w: any) => (
                    <option key={w.id} value={w.name}>
                      {w.name}
                    </option>
                  ))}
              </select>
            </div>
          </form>
        </section>

        {/* Product Entry Section */}
        <section className="bg-card rounded shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-muted-foreground">
            Add Product
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addProduct();
            }}
            className="grid grid-cols-1 md:grid-cols-8 gap-6 items-end"
          >
            {/* Product Code */}
            <div className="col-span-1 md:col-span-1">
              <label
                htmlFor="productCode"
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                Product Code
              </label>
              <input
                type="text"
                id="productCode"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Code"
              />
            </div>

            {/* Product Name */}
            <div className="col-span-1 md:col-span-2">
              <label
                htmlFor="productName"
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Name"
              />
            </div>

            {/* Quantity */}
            <div className="col-span-1 md:col-span-1">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Qty"
              />
            </div>

            {/* Unit Cost */}
            <div className="col-span-1 md:col-span-1">
              <label
                htmlFor="unitCost"
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                Unit Cost
              </label>
              <input
                type="number"
                id="unitCost"
                min="0"
                step="0.01"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Cost"
              />
            </div>

            {/* Discount */}
            <div className="col-span-1 md:col-span-1">
              <label
                htmlFor="discount"
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                Discount
              </label>
              <input
                type="number"
                id="discount"
                min="0"
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Discount"
              />
            </div>

            {/* Tax */}
            <div className="col-span-1 md:col-span-1">
              <label
                htmlFor="tax"
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                Tax
              </label>
              <input
                type="number"
                id="tax"
                min="0"
                step="0.01"
                value={tax}
                onChange={(e) => setTax(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Tax"
              />
            </div>

            {/* Total (read-only) */}
            <div className="col-span-1 md:col-span-1">
              <label
                htmlFor="total"
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                Total
              </label>
              <input
                type="text"
                id="total"
                value={total.toFixed(2)}
                readOnly
                className="w-full border border-input rounded px-3 py-2 bg-muted cursor-not-allowed"
              />
            </div>

            {/* Add Button */}
            <div className="col-span-1 md:col-span-1">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                title="Add Product"
              >
                <i className="fa fa-plus fa-light" aria-hidden="true"></i> Add
              </button>
            </div>
          </form>
        </section>

        {/* Products Table */}
        <section className="bg-card rounded shadow p-6 mb-6 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4 text-muted-foreground">
            Products
          </h2>
          <table className="min-w-full table-auto border-collapse border border-border">
            <thead>
              <tr className="bg-muted text-muted-foreground text-left text-sm font-semibold">
                <th className="border border-border px-4 py-3">Code</th>
                <th className="border border-border px-4 py-3">Name</th>
                <th className="border border-border px-4 py-3 text-right">
                  Quantity
                </th>
                <th className="border border-border px-4 py-3 text-right">
                  Unit Cost
                </th>
                <th className="border border-border px-4 py-3 text-right">
                  Discount
                </th>
                <th className="border border-border px-4 py-3 text-right">
                  Tax
                </th>
                <th className="border border-border px-4 py-3 text-right">
                  Total
                </th>
                <th className="border border-border px-4 py-3 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center px-4 py-6 text-muted-foreground italic">
                    No products added.
                  </td>
                </tr>
              )}
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="border border-border px-4 py-3 text-sm text-foreground">
                    {p.code}
                  </td>
                  <td className="border border-border px-4 py-3 text-sm text-foreground">
                    {p.name}
                  </td>
                  <td className="border border-border px-4 py-3 text-sm text-foreground text-right">
                    {p.quantity}
                  </td>
                  <td className="border border-border px-4 py-3 text-sm text-foreground text-right">
                    {p.unitCost.toFixed(2)}
                  </td>
                  <td className="border border-border px-4 py-3 text-sm text-foreground text-right">
                    {p.discount.toFixed(2)}
                  </td>
                  <td className="border border-border px-4 py-3 text-sm text-foreground text-right">
                    {p.tax.toFixed(2)}
                  </td>
                  <td className="border border-border px-4 py-3 text-sm text-foreground text-right">
                    {p.total.toFixed(2)}
                  </td>
                  <td className="border border-border px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => removeProduct(p.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      title="Remove Product"
                      type="button"
                    >
                      <i className="fa fa-trash fa-light" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Purchase Returns List Section */}
        <section className="bg-card rounded shadow py-6">
          <h2 className="text-lg font-semibold mb-6 text-muted-foreground">
            Purchase Return List
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-border">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-left text-sm font-semibold">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Reference No</th>
                  <th className="px-4 py-3">Supplier</th>
                  <th className="px-4 py-3">Warehouse</th>
                  <th className="px-4 py-3 text-right">Product Qty</th>
                  <th className="px-4 py-3 text-right">Grand Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReturns.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center px-4 py-6 text-muted-foreground italic">
                      No purchase returns found.
                    </td>
                  </tr>
                )}
                {paginatedReturns.map((pr: any) => (
                  <tr
                    key={pr.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">{pr.date}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{pr.referenceNo}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{pr.supplier}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{pr.warehouse}</td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">{pr.productQty}</td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">{pr.grandTotal.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          pr.status === "Completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {pr.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm space-x-3">
                      <button
                        onClick={() => handleEdit(pr.id)}
                        title="Edit"
                        className="text-primary hover:text-primary/80 transition-colors"
                        aria-label={`Edit purchase return ${pr.referenceNo}`}
                        type="button"
                      >
                        <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(pr.id)}
                        title="Delete"
                        className="text-destructive hover:text-destructive/80 transition-colors"
                        aria-label={`Delete purchase return ${pr.referenceNo}`}
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
            totalItems={data.length}
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
            <h2
              id="edit-modal-title"
              className="text-xl font-semibold mb-4 text-center"
            >
              Edit Purchase Return
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

              {/* Reference No */}
              <div>
                <label
                  htmlFor="editReferenceNo"
                  className="block text-sm font-medium mb-1 text-muted-foreground"
                >
                  Reference No
                </label>
                <input
                  type="text"
                  id="editReferenceNo"
                  name="referenceNo"
                  value={editForm.referenceNo}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                <input
                  type="text"
                  id="editSupplier"
                  name="supplier"
                  value={editForm.supplier}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Warehouse */}
              <div>
                <label
                  htmlFor="editWarehouse"
                  className="block text-sm font-medium mb-1 text-muted-foreground"
                >
                  Warehouse
                </label>
                <input
                  type="text"
                  id="editWarehouse"
                  name="warehouse"
                  value={editForm.warehouse}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
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
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
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