import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";
import { STATUSES, EXPIRED_STATUSES } from "@/constants/constants";

// Interfaces from provided code
interface ProductRecord {
  id: number;
  productName: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  status: string;
  image: string;
}

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zip: string;
  status: (typeof STATUSES)[number];
};

interface CategoryRecord {
  id: number;
  categoryName: string;
  description: string;
  status: (typeof EXPIRED_STATUSES)[number];
}

export default function Pos1() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
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

  // Placeholder for product search/filtering (logic would be needed for a real filter)
  const [productSearch, setProductSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsResponse, customersResponse, categoriesResponse] =
        await Promise.all([
          apiService.get<ProductRecord[]>("Products"),
          apiService.get<Customer[]>("Customers"),
          apiService.get<CategoryRecord[]>("Category"),
        ]);
      if (productsResponse.status.code === "S") {
        setProducts(productsResponse.result || []);
      } else {
        setError(
          productsResponse.status.description || "Failed to load products."
        );
      }
      if (customersResponse.status.code === "S") {
        setCustomers(customersResponse.result || []);
      } else {
        setError((prev) =>
          prev
            ? `${prev}\nFailed to load customers: ${customersResponse.status.description}`
            : `Failed to load customers: ${customersResponse.status.description}`
        );
      }
      if (categoriesResponse.status.code === "S") {
        setCategories(categoriesResponse.result || []);
      } else {
        setError((prev) =>
          prev
            ? `${prev}\nFailed to load categories: ${categoriesResponse.status.description}`
            : `Failed to load categories: ${categoriesResponse.status.description}`
        );
      }
      setError(null); // Clear error if all succeed
    } catch (err) {
      setError("An error occurred while loading data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Customer selection and search
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  // Product list state (copy from data.products for editing quantities)
  // Already handled by setProducts above

  // Payment and discount states
  const [discount, setDiscount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentStatus, setPaymentStatus] = useState("Paid");

  // Sync products state when data changes
  useEffect(() => {
    if (products.length > 0) {
      setProducts(products); // Ensure products are set initially
    }
    if (customers.length > 0 && !selectedCustomer) {
      setSelectedCustomer(customers[0]);
    }
  }, [products, customers, selectedCustomer]);

  // Filter customers by search
  const filteredCustomers = (customers || []).filter((c) =>
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
  const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
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
    if (products.length > 0) setProducts(products);
    if (customers.length > 0) setSelectedCustomer(customers[0]);
    setCustomerPage(1);
    setProductPage(1);
    setCustomerSearch("");
  };

  // Report handler
  const handleReport = () => {
    alert("Report Data:\n" + JSON.stringify({ customers, products }, null, 2));
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
    if (editForm.quantity < 1 || editForm.price < 0 || !editForm.name?.trim()) {
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

  // Simple filter to show the concept
  const filteredProducts = products.filter(
    (p) =>
      (selectedCategory === "All" || p.category === selectedCategory) &&
      p.productName.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Paginated products will now use filteredProducts
  const pagedFilteredProducts = filteredProducts.slice(
    (productPage - 1) * productItemsPerPage,
    productPage * productItemsPerPage
  );

  return (
    // Removed max-w to utilize full available space
    <div className=" h-[calc(100vh-200px)] w-full bg-muted/20 p-1">
      {/* --- Header (kept simple as Navbar now handles main functions) --- */}
      <header
        className="mb-4 flex justify-end items-center"
        style={{ marginTop: "1px" }}
      >
        <div className="flex space-x-3">
          {/* Placeholder for Pending Orders quick view */}
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onClick={() => alert("Viewing Pending Orders")}
          >
            <i className="fa fa-clock fa-light" aria-hidden="true"></i> Pending
            Orders
          </button>
        </div>
      </header>

      {/* --- Main POS Grid: Product Selection (Left) vs. Order Management (Right) --- */}
      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-200px)] ">
        {/* 🚀 Left Panel: Product Selection (col-span-8 to maximize product visibility) */}
        <section className="col-span-8 bg-card rounded-lg shadow-xl p-4 flex flex-col space-y-4 overflow-y-auto  ">
          {/* Top Row: Search and Category Tabs */}
          <div className="flex flex-col space-y-3">
            {/* Product Search */}
            <div className="w-full relative">
              <i className="fa fa-search fa-light absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"></i>
              <input
                type="text"
                placeholder="Search Product or Scan Barcode"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full border border-input rounded-lg px-3 pl-10 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
              />
            </div>

            {/* Categories/Tags (Horizontal Scrollable) */}
            {/* Categories/Tags (Horizontal Scrollable) */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {["All", ...categories.map((cat) => cat.categoryName)].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setProductPage(1); // Reset product pagination on category change
                    }}
                    className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground shadow"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                    type="button"
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Product List as Cards (Main Scroll Area) */}
          <div className="flex-1 overflow-y-auto pr-2">
            {loading ? (
              <div className="text-center py-10 text-xl text-primary font-semibold">
                <i className="fa fa-spinner fa-spin mr-2"></i> Loading
                Products...
              </div>
            ) : error ? (
              <div className="text-center py-10 text-destructive text-lg">
                Error: {error}
              </div>
            ) : pagedFilteredProducts.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground italic">
                No products found for this category/search.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {pagedFilteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-background border border-border rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col justify-between"
                  >
                    {/* Card Image Placeholder */}
                    <div className="relative w-full h-24 bg-gray-200 flex items-center justify-center">
                      <img
                        src={p.image}
                        alt={p.productName}
                        className="w-full h-full object-contain max-w-24"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextSibling?.classList.remove("hidden");
                        }}
                      />
                      <i className="fa fa-box-open fa-3x text-gray-400 hidden absolute"></i>
                      <span className="absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 bg-green-500 text-white rounded">
                        {p.stock} Qty
                      </span>
                    </div>
                    <div className="p-3 flex flex-col flex-grow">
                      <p
                        className="text-sm font-semibold truncate mb-1"
                        title={p.productName}
                      >
                        {p.productName}
                      </p>
                      <div className="flex justify-between items-end mt-auto">
                        <span className="text-lg font-bold text-primary">
                          ${p.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(p.id, p.quantity + 1)
                          } // Simulate Add
                          className="text-sm px-3 py-1 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow"
                          aria-label={`Add ${p.productName} to cart`}
                          type="button"
                        >
                          <i className="fa fa-plus fa-light"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Pagination */}
          <div className="flex justify-center border-t pt-4">
            <Pagination
              currentPage={productPage}
              itemsPerPage={productItemsPerPage}
              totalItems={filteredProducts.length}
              onPageChange={setProductPage}
              onPageSizeChange={(size) => {
                setProductItemsPerPage(size);
                setProductPage(1);
              }}
            />
          </div>
        </section>

        {/* 💳 Right Panel: Order Details (col-span-4) */}
        <section className="col-span-4 bg-card rounded-lg shadow-xl p-4 flex flex-col space-y-4 overflow-y-auto">
          {/* 1. Pending Order List (Top Row) - Placeholder */}
          <div className="border-b pb-3 mb-3">
            <h3 className="text-base font-semibold text-muted-foreground mb-2">
              Current Order
            </h3>
            <div className="flex space-x-2">
              <div className="flex-1 p-2 border border-primary bg-primary/10 rounded-lg text-center font-bold text-primary">
                Order #1234
              </div>
              <button
                type="button"
                className="p-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors shadow"
                onClick={() => alert("New Order")}
              >
                <i className="fa fa-plus fa-light"></i> New
              </button>
              <button
                type="button"
                className="p-2 bg-blue-400 text-black rounded-lg hover:bg-blue-500 transition-colors shadow"
                onClick={() => alert("Hold Order")}
              >
                <i className="fa fa-pause fa-light"></i> Hold
              </button>
            </div>
          </div>

          {/* 2. Customer Type & Details */}
          <div className="space-y-3 border-b pb-3">
            <h3 className="text-base font-semibold text-muted-foreground">
              Customer Details
            </h3>
            <select
              className="w-full border border-input rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedCustomer?.id || ""}
              onChange={(e) => {
                const customer = customers.find(
                  (c) => c.id === Number(e.target.value)
                );
                if (customer) handleCustomerSelect(customer);
              }}
            >
              <option value="" disabled>
                Select Customer
              </option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
            <div className="p-3 border border-dashed border-border rounded-lg bg-muted/50">
              {selectedCustomer ? (
                <>
                  <p className="font-semibold">{selectedCustomer.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedCustomer.phone} | {selectedCustomer.address}
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground italic text-sm">
                  No customer selected
                </p>
              )}
            </div>
          </div>

          {/* 3. Order List (Cart) */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 border-b pb-4">
            <h3 className="text-base font-semibold text-muted-foreground">
              Order Items ({products.length})
            </h3>
            {products.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground italic">
                Add products to start an order.
              </div>
            ) : (
              <div className="space-y-2">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2 border rounded-lg bg-background"
                  >
                    <div className="flex items-center space-x-2">
                      {/* Product Image/Icon */}
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-sm">
                        <i className="fa fa-tags fa-light"></i>
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-tight">
                          {p.productName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ${p.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Quantity Input */}
                      <input
                        type="number"
                        min={1}
                        className="w-10 text-center border border-input rounded text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                        value={p.quantity}
                        onChange={(e) =>
                          handleQuantityChange(p.id, Number(e.target.value))
                        }
                      />
                      {/* Total Price */}
                      <span className="text-sm font-semibold w-12 text-right">
                        ${(p.price * p.quantity).toFixed(2)}
                      </span>
                      {/* Remove Icon */}
                      <button
                        onClick={() =>
                          setProducts((prev) =>
                            prev.filter((item) => item.id !== p.id)
                          )
                        }
                        className="text-destructive hover:text-destructive/80 p-1 rounded transition-colors"
                        aria-label={`Remove ${p.productName}`}
                        type="button"
                      >
                        <i className="fa fa-trash fa-light"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Total/Subtotal/Tax/Shipping Rates */}
          <div className="space-y-2 border-b pb-4">
            {/* Subtotal */}
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {/* Discount */}
            <div className="flex justify-between items-center text-sm">
              <label htmlFor="discount" className="text-muted-foreground">
                Discount (%):
              </label>
              <div className="flex items-center space-x-1">
                <input
                  id="discount"
                  type="number"
                  min={0}
                  max={100}
                  value={discount}
                  onChange={(e) => handleDiscountChange(Number(e.target.value))}
                  className="w-12 text-center border border-input rounded px-1 py-0.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="text-red-500 font-medium">
                  (-${discountAmount.toFixed(2)})
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between font-bold text-xl text-primary pt-2">
              <label>TOTAL:</label>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* 5. Payment Methods & Checkout */}
          <div className="space-y-3">
            {/* Payment Method & Status */}
            <div className="grid grid-cols-2 gap-3">
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border border-input rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                <option>Cash</option>
                <option>Card</option>
                <option>Mobile Payment</option>
              </select>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full border border-input rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                <option>Paid</option>
                <option>Unpaid</option>
                <option>Partial</option>
              </select>
            </div>

            {/* Paid/Due Amount */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <label
                  htmlFor="paidAmount"
                  className="text-xs font-medium text-muted-foreground mb-1"
                >
                  Paid Amount
                </label>
                <input
                  id="paidAmount"
                  type="number"
                  min={0}
                  max={total}
                  value={paidAmount}
                  onChange={(e) =>
                    handlePaidAmountChange(Number(e.target.value))
                  }
                  className="w-full border border-input rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-medium text-muted-foreground mb-1">
                  Due Amount
                </label>
                <div
                  className={`w-full border border-input rounded-lg px-3 py-2 text-lg font-bold ${
                    dueAmount > 0
                      ? "text-red-500 bg-red-50"
                      : "text-green-600 bg-green-50"
                  }`}
                >
                  ${dueAmount.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Checkout Buttons */}
            <div className="flex space-x-3 pt-3">
              <button
                type="button"
                onClick={handleClear}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-3 rounded-lg shadow-md transition-colors"
              >
                <i className="fa fa-times fa-light" aria-hidden="true"></i>{" "}
                Clear
              </button>
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Sale finalized!");
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-3 rounded-lg shadow-md transition-colors"
              >
                <i
                  className="fa fa-cash-register fa-light"
                  aria-hidden="true"
                ></i>{" "}
                Finalize Sale
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* --- Edit Modal (kept as is) --- */}
      {isEditModalOpen && editForm && (
        // ... (Edit Modal JSX remains the same) ...
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-modal-title"
        >
          {/* ... Modal Content ... */}
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
