import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

export default function Pos1() {
  const [data, setData] = useState<{
    customers: any[];
    products: any[];
  }>({ customers: [], products: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state for customers and products
  const [customerPage, setCustomerPage] = useState(1);
  const [customerItemsPerPage, setCustomerItemsPerPage] = useState(10);
  const [productPage, setProductPage] = useState(1);
  const [productItemsPerPage, setProductItemsPerPage] = useState(10);

  // Modal editing state for products (assuming edit exists for products)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<{
      customers: any[];
      products: any[];
    }>("Pos1");
    if (response.status.code === "S") {
      setData(response.result || { customers: [], products: [] });
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Customer selection and search
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  // Product list state (copy from data.products for editing quantities)
  const [products, setProducts] = useState<any[]>([]);

  // Payment and discount states
  const [discount, setDiscount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentStatus, setPaymentStatus] = useState("Paid");

  // Sync products state when data changes
  useEffect(() => {
    if (data.products) {
      setProducts(data.products);
    }
    if (data.customers && data.customers.length > 0 && !selectedCustomer) {
      setSelectedCustomer(data.customers[0]);
    }
  }, [data]);

  // Filter customers by search
  const filteredCustomers = (data.customers || []).filter((c) =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase())
  );

  // Paginated customers and products using Pagination component logic
  const pagedCustomers = filteredCustomers.slice(
    (customerPage - 1) * customerItemsPerPage,
    customerPage * customerItemsPerPage
  );
  const pagedProducts = products.slice(
    (productPage - 1) * productItemsPerPage,
    productPage * productItemsPerPage
  );

  // Calculate totals
  const subtotal = products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;
  const dueAmount = total - paidAmount;

  // Handlers
  const handleCustomerSelect = (customer: any) => {
    setSelectedCustomer(customer);
  };

  const handleQuantityChange = (id: number, qty: number) => {
    if (qty < 1) return;
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: qty } : p))
    );
  };

  const handleDiscountChange = (val: number) => {
    if (val < 0) val = 0;
    if (val > 100) val = 100;
    setDiscount(val);
  };

  const handlePaidAmountChange = (val: number) => {
    if (val < 0) val = 0;
    if (val > total) val = total;
    setPaidAmount(val);
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setDiscount(0);
    setPaidAmount(0);
    setPaymentMethod("Cash");
    setPaymentStatus("Paid");
    if (data.products) setProducts(data.products);
    if (data.customers && data.customers.length > 0) setSelectedCustomer(data.customers[0]);
    setCustomerPage(1);
    setProductPage(1);
    setCustomerSearch("");
  };

  // Report handler
  const handleReport = () => {
    alert("Report Data:\n" + JSON.stringify({ customers: data.customers, products }, null, 2));
  };

  // Edit modal handlers (assuming edit icon/button exists on product rows)
  const handleEdit = (id: number) => {
    const item = products.find((p) => p.id === id);
    if (item) {
      setEditForm({ ...item });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    if (!editForm) return;
    // Basic validation for quantity and price (optional)
    if (
      editForm.quantity < 1 ||
      editForm.price < 0 ||
      !editForm.name?.trim()
    ) {
      alert("Please fill all required fields correctly.");
      return;
    }
    if (editId !== null) {
      setProducts((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                name: editForm.name.trim(),
                price: Number(editForm.price),
                quantity: Number(editForm.quantity),
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-lg font-semibold">POS 1</h1>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
            </button>
          </div>
        </header>

        {/* Main grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left panel: Customer & Product selection */}
          <section className="col-span-7 bg-card rounded shadow p-6 flex flex-col space-y-6">
            {/* Customer Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-muted-foreground">
                Customer
              </h2>
              <div className="flex space-x-4">
                {/* Customer Search */}
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search Customer"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                {/* Customer Details */}
                <div className="w-64 border border-input rounded p-4 bg-background">
                  {selectedCustomer ? (
                    <>
                      <p className="font-semibold">{selectedCustomer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Phone: {selectedCustomer.phone}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Address: {selectedCustomer.address}
                      </p>
                    </>
                  ) : (
                    <p className="text-muted-foreground italic">No customer selected</p>
                  )}
                </div>
              </div>
              {/* Customer List with Pagination */}
              <div className="mt-4 border border-input rounded max-h-48 overflow-y-auto bg-background">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-muted-foreground font-medium">Name</th>
                      <th className="px-4 py-3 text-muted-foreground font-medium">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedCustomers.length === 0 && (
                      <tr>
                        <td colSpan={2} className="text-center px-4 py-6 text-muted-foreground italic">
                          No customers found.
                        </td>
                      </tr>
                    )}
                    {pagedCustomers.map((c) => (
                      <tr
                        key={c.id}
                        className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedCustomer?.id === c.id ? "bg-muted font-semibold" : ""
                        }`}
                        onClick={() => handleCustomerSelect(c)}
                      >
                        <td className="px-4 py-3 text-foreground">{c.name}</td>
                        <td className="px-4 py-3 text-foreground">{c.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-2 flex justify-end">
                  <Pagination
                    currentPage={customerPage}
                    itemsPerPage={customerItemsPerPage}
                    totalItems={filteredCustomers.length}
                    onPageChange={(page) => {
                      if (page >= 1 && page <= Math.ceil(filteredCustomers.length / customerItemsPerPage))
                        setCustomerPage(page);
                    }}
                    onPageSizeChange={(size) => {
                      setCustomerItemsPerPage(size);
                      setCustomerPage(1);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Product Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-muted-foreground">
                Products
              </h2>
              <div className="border border-input rounded bg-background">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-muted-foreground font-medium w-1/2">Product</th>
                      <th className="px-4 py-3 text-muted-foreground font-medium w-1/6">Price</th>
                      <th className="px-4 py-3 text-muted-foreground font-medium w-1/6">Quantity</th>
                      <th className="px-4 py-3 text-muted-foreground font-medium w-1/6">Total</th>
                      <th className="px-4 py-3 text-center text-muted-foreground font-medium w-1/6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedProducts.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center px-4 py-6 text-muted-foreground italic">
                          No products found.
                        </td>
                      </tr>
                    )}
                    {pagedProducts.map((p) => (
                      <tr key={p.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 text-foreground">{p.name}</td>
                        <td className="px-4 py-3 text-foreground">${p.price.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min={1}
                            className="w-16 border border-input rounded px-2 py-1 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                            value={p.quantity}
                            onChange={(e) =>
                              handleQuantityChange(p.id, Number(e.target.value))
                            }
                          />
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          ${(p.price * p.quantity).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-center text-sm space-x-3">
                          <button
                            onClick={() => handleEdit(p.id)}
                            className="text-primary hover:text-primary/80 transition-colors"
                            aria-label={`Edit product ${p.name}`}
                            type="button"
                          >
                            <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-2 flex justify-end">
                  <Pagination
                    currentPage={productPage}
                    itemsPerPage={productItemsPerPage}
                    totalItems={products.length}
                    onPageChange={(page) => {
                      if (page >= 1 && page <= Math.ceil(products.length / productItemsPerPage))
                        setProductPage(page);
                    }}
                    onPageSizeChange={(size) => {
                      setProductItemsPerPage(size);
                      setProductPage(1);
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Right panel: Payment & Summary */}
          <section className="col-span-5 bg-card rounded shadow p-6 flex flex-col space-y-6">
            <h2 className="text-lg font-semibold mb-4 text-muted-foreground">
              Payment Details
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Save functionality not implemented");
              }}
              className="flex flex-col space-y-4"
            >
              {/* Subtotal */}
              <div className="flex justify-between">
                <label className="font-semibold text-muted-foreground">Subtotal:</label>
                <span className="text-foreground">${subtotal.toFixed(2)}</span>
              </div>

              {/* Discount */}
              <div className="flex justify-between items-center">
                <label htmlFor="discount" className="font-semibold text-muted-foreground">
                  Discount (%):
                </label>
                <input
                  id="discount"
                  type="number"
                  min={0}
                  max={100}
                  value={discount}
                  onChange={(e) => handleDiscountChange(Number(e.target.value))}
                  className="w-20 border border-input rounded px-2 py-1 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Total */}
              <div className="flex justify-between font-bold text-primary text-lg">
                <label>Total:</label>
                <span>${total.toFixed(2)}</span>
              </div>

              {/* Paid Amount */}
              <div className="flex justify-between items-center">
                <label htmlFor="paidAmount" className="font-semibold text-muted-foreground">
                  Paid Amount:
                </label>
                <input
                  id="paidAmount"
                  type="number"
                  min={0}
                  max={total}
                  value={paidAmount}
                  onChange={(e) => handlePaidAmountChange(Number(e.target.value))}
                  className="w-32 border border-input rounded px-2 py-1 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Due Amount */}
              <div className="flex justify-between">
                <label className="font-semibold text-muted-foreground">Due Amount:</label>
                <span className="text-foreground">${dueAmount.toFixed(2)}</span>
              </div>

              {/* Payment Method */}
              <div className="flex justify-between items-center">
                <label htmlFor="paymentMethod" className="font-semibold text-muted-foreground">
                  Payment Method:
                </label>
                <select
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-32 border border-input rounded px-2 py-1 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>Cash</option>
                  <option>Card</option>
                  <option>Cheque</option>
                  <option>Mobile Payment</option>
                </select>
              </div>

              {/* Payment Status */}
              <div className="flex justify-between items-center">
                <label htmlFor="paymentStatus" className="font-semibold text-muted-foreground">
                  Payment Status:
                </label>
                <select
                  id="paymentStatus"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-32 border border-input rounded px-2 py-1 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>Paid</option>
                  <option>Unpaid</option>
                  <option>Partial</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <i className="fa fa-save fa-light" aria-hidden="true"></i>
                  <span>Save</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-5 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <i className="fa fa-refresh fa-light" aria-hidden="true"></i>
                  <span>Clear</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editForm && (
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
              Edit Product
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Product Name */}
              <div>
                <label
                  htmlFor="editName"
                  className="block text-sm font-medium mb-1"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  id="editName"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter product name"
                />
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="editPrice"
                  className="block text-sm font-medium mb-1"
                >
                  Price
                </label>
                <input
                  type="number"
                  id="editPrice"
                  name="price"
                  min={0}
                  value={editForm.price}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter price"
                />
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
                  min={1}
                  value={editForm.quantity}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter quantity"
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