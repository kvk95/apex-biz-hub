import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";
import {
  STATUSES,
  EXPIRED_STATUSES,
  PAYMENT_TYPES,
  PAYMENT_STATUSES,
} from "@/constants/constants";

// Interfaces
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
  image: string;
}

export default function Pos1() {
  const [products, setProducts] = useState<
    (ProductRecord & { quantity?: number })[]
  >([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [customerPage, setCustomerPage] = useState(1);
  const [customerItemsPerPage, setCustomerItemsPerPage] = useState(10);
  const [productPage, setProductPage] = useState(1);
  const [productItemsPerPage, setProductItemsPerPage] = useState(10);

  // Search & Filter
  const [productSearch, setProductSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [customerSearch, setCustomerSearch] = useState("");

  // Cart & Payment
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [discount, setDiscount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentStatus, setPaymentStatus] = useState("Paid");

  // Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);
  const [editId, setEditId] = useState<number | null>(null);

  // Load Data
  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, custRes, catRes] = await Promise.all([
        apiService.get<ProductRecord[]>("Products"),
        apiService.get<Customer[]>("Customers"),
        apiService.get<CategoryRecord[]>("Category"),
      ]);

      if (prodRes.status.code === "S") {
        setProducts((prodRes.result || []).map((p) => ({ ...p, quantity: 0 })));
      } else setError(prodRes.status.description || "Failed to load products.");

      if (custRes.status.code === "S") {
        setCustomers(custRes.result || []);
      } else
        setError((prev) =>
          prev
            ? `${prev}\n${custRes.status.description}`
            : custRes.status.description
        );

      if (catRes.status.code === "S") {
        setCategories(catRes.result || []);
      } else
        setError((prev) =>
          prev
            ? `${prev}\n${catRes.status.description}`
            : catRes.status.description
        );

      setError(null);
    } catch (err) {
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (customers.length > 0 && !selectedCustomer) {
      setSelectedCustomer(customers[0]);
    }
  }, [customers, selectedCustomer]);

  // Filters
  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const filteredProducts = products.filter(
    (p) =>
      (selectedCategory === "All" || p.category === selectedCategory) &&
      p.productName.toLowerCase().includes(productSearch.toLowerCase())
  );

  const pagedFilteredProducts = filteredProducts.slice(
    (productPage - 1) * productItemsPerPage,
    productPage * productItemsPerPage
  );

  // Calculations
  const cartItems = products.filter((p) => (p.quantity || 0) > 0);
  const subtotal = cartItems.reduce(
    (sum, p) => sum + p.price * (p.quantity || 0),
    0
  );
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;
  const dueAmount = total - paidAmount;

  // Handlers
  const handleAddToCart = (id: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: (p.quantity || 0) + 1 } : p
      )
    );
  };

  const handleQuantityChange = (id: number, qty: number) => {
    if (qty < 0) return;
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: qty } : p))
    );
  };

  const handleRemoveFromCart = (id: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: 0 } : p))
    );
  };

  const handleClear = () => {
    setProducts((prev) => prev.map((p) => ({ ...p, quantity: 0 })));
    setDiscount(0);
    setPaidAmount(0);
    setPaymentMethod("Cash");
    setPaymentStatus("Paid");
    setCustomerSearch("");
    setProductPage(1);
    setSelectedCustomer(customers[0] || null);
  };

  const handleEdit = (id: number) => {
    const item = products.find((p) => p.id === id);
    if (item) {
      setEditForm({ ...item });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  const handleEditSave = () => {
    if (!editForm || editId === null) return;
    if (
      !editForm.productName?.trim() ||
      editForm.price < 0 ||
      editForm.quantity < 0
    ) {
      alert("Please fill all fields correctly.");
      return;
    }
    setProducts((prev) =>
      prev.map((p) =>
        p.id === editId
          ? { ...p, ...editForm, productName: editForm.productName.trim() }
          : p
      )
    );
    setIsEditModalOpen(false);
    setEditId(null);
  };

  return (
    <div className="h-[calc(100vh-75px)] w-full bg-muted/20 flex flex-col">
      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 gap-3 p-1 overflow-hidden">
        {/* Left: Product Selection */}
        <section className="col-span-8 bg-card rounded-lg shadow-sm flex flex-col overflow-hidden">
          {/* Search & Categories */}
          <div className="p-3 space-y-3 border-b">
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {["All", ...categories.map((c) => c.categoryName)].map((name) => {
                const cat = categories.find((c) => c.categoryName === name);
                const isAll = name === "All";
                return (
                  <button
                    key={name}
                    onClick={() => {
                      setSelectedCategory(name);
                      setProductPage(1);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-sm border transition-all whitespace-nowrap
                      ${
                        selectedCategory === name
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-white text-muted-foreground border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    {!isAll && cat?.image ? (
                      <img
                        src={cat.image}
                        alt={name}
                        className="w-4 h-4 rounded object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          (
                            e.target as HTMLImageElement
                          ).nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <i
                      className={`fa fa-tags text-xs ${
                        !isAll && cat?.image ? "hidden" : ""
                      }`}
                    />
                    <span>{name}</span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative">
              <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
              <input
                type="text"
                placeholder="Search product or scan barcode..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto p-3">
            {loading ? (
              <div className="text-center py-12">
                <i className="fa fa-spinner fa-spin text-2xl text-primary" />
                <p className="mt-2 text-muted-foreground">
                  Loading products...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-destructive">{error}</div>
            ) : pagedFilteredProducts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground italic">
                No products found.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {pagedFilteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className="relative h-32 bg-gray-100 flex items-center justify-center">
                      <img
                        src={p.image}
                        alt={p.productName}
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          const tried = img.getAttribute("data-fallback");
                          if (!tried && p.category) {
                            img.setAttribute("data-fallback", "true");
                            img.src = `/assets/images/categories/${p.category.toLowerCase()}.png`;
                          } else {
                            img.style.display = "none";
                            img.nextElementSibling?.classList.remove("hidden");
                          }
                        }}
                      />
                      <i className="fa fa-box-open fa-3x text-gray-400 hidden absolute" />
                      <span className="absolute top-1 right-1 bg-primary text-white text-xs px-2 py-0.5 rounded">
                        {p.stock} Qty
                      </span>
                    </div>
                    <div className="p-2 flex flex-col flex-grow">
                      <div className="text-xs text-muted-foreground">
                        {p.category}
                      </div>
                      <div
                        className="font-medium text-sm truncate"
                        title={p.productName}
                      >
                        {p.productName}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-primary">
                          ₹{p.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleAddToCart(p.id)}
                          className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded-full transition-colors"
                        >
                          <i className="fa fa-plus" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="p-2 border-t">
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

        {/* Right: Order Summary */}
        <section className="col-span-4 bg-card rounded-lg shadow-sm flex flex-col overflow-y-auto">
          <div className="p-3 border-b">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Current Order #1234</h3>
              <div className="flex gap-1">
                <button className="p-1.5 bg-yellow-400 rounded hover:bg-yellow-500">
                  <i className="fa fa-plus text-xs" />
                </button>
                <button className="p-1.5 bg-blue-400 rounded hover:bg-blue-500">
                  <i className="fa fa-pause text-xs" />
                </button>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="p-3 border-b space-y-2">
            <select
              value={selectedCustomer?.id || ""}
              onChange={(e) => {
                const cust = customers.find(
                  (c) => c.id === Number(e.target.value)
                );
                if (cust) setSelectedCustomer(cust);
              }}
              className="w-full text-sm border rounded px-2 py-1.5"
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
            {selectedCustomer && (
              <div className="text-xs p-2 bg-muted/50 rounded border border-dashed">
                <p className="font-medium">{selectedCustomer.name}</p>
                <p className="text-muted-foreground">
                  {selectedCustomer.phone} | {selectedCustomer.address}
                </p>
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto1 p-3 space-y-2">
            <h3 className="font-medium text-sm">
              Order Items ({cartItems.length})
            </h3>
            {cartItems.length === 0 ? (
              <>
                <div
                  className="flex items-center p-2 items-center justify-center mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
                  role="alert"
                >
                  <i className="fa fa-shopping-cart fa-light me-2 text-lg"></i>
                  <span className="sr-only">Info</span>
                  <div>
                    <span className="font-medium">Cart is empty</span> !
                  </div>
                </div>
              </>
            ) : (
              cartItems.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 p-2 bg-background rounded border text-xs"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <img
                      src={p.image}
                      alt={p.productName}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        const tried = img.getAttribute("data-fallback");
                        if (!tried && p.category) {
                          img.setAttribute("data-fallback", "true");
                          img.src = `/assets/images/categories/${p.category.toLowerCase()}.png`;
                        } else {
                          img.style.display = "none";
                          img.nextElementSibling?.classList.remove("hidden");
                        }
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold truncate">{p.productName}</div>
                    <div className="text-muted-foreground">
                      ₹{p.price.toFixed(2)}
                    </div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={p.quantity || 0}
                    onChange={(e) =>
                      handleQuantityChange(p.id, Number(e.target.value))
                    }
                    className="w-12 text-center border rounded"
                  />
                  <span className="w-16 text-right font-medium">
                    ₹{(p.price * (p.quantity || 0)).toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleRemoveFromCart(p.id)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <i className="fa fa-trash" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div
            className="flex items-center p-6 mb-4 mx-3 text-sm  border-t-4 border-yellow-300 text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
            role="alert"
          >
            <i className="fa fa-info-circle mr-1 text-3xl me-4" />
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">Flat $10 Discount Applied!</span>{" "}
              You have received a flat discount on this order.
            </div>
          </div>

          <div className="p-3 border-b space-y-3 flex border-t">
            <div className="grid grid-cols-3 gap-2 justify-between flex-1">
              <div>
                <div className="text-xs font-medium">Order Tax</div>
                <select
                  className="w-full text-sm border rounded px-2 py-1.5"
                  onChange={(e) => alert("Tax updated!")}
                >
                  <option>10%</option>
                  <option>15%</option>
                  <option>20%</option>
                </select>
              </div>
              <div>
                <div className="text-xs font-medium">Shipping</div>
                <select
                  className="w-full text-sm border rounded px-2 py-1.5"
                  onChange={(e) => alert("Shipping updated!")}
                >
                  <option>Standard</option>
                  <option>Express</option>
                </select>
              </div>
              <div>
                <div className="text-xs font-medium">Discount</div>
                <select
                  className="w-full text-sm border rounded px-2 py-1.5"
                  onChange={(e) => alert("Discount updated!")}
                >
                  <option>5%</option>
                  <option>10%</option>
                  <option>Flat $10</option>
                </select>
              </div>
            </div>
            {/* Discount Alert */}
          </div>

          {/* Totals */}
          <div className="p-3 border-t space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <label>Discount (%):</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) =>
                    setDiscount(
                      Math.min(100, Math.max(0, Number(e.target.value)))
                    )
                  }
                  className="w-12 text-center border rounded text-xs"
                />
                <span className="text-red-600">
                  (-₹{discountAmount.toFixed(2)})
                </span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg text-primary pt-1">
              <span>TOTAL:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment */}
          <div className="p-3 space-y-3 border-t">
            <div className="grid grid-cols-2 gap-2 justify-between flex-1">
              <div>
                <label className="text-xs block mb-1">Payment Mode</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-xs border rounded px-2 py-1.5 w-full"
                >
                            {PAYMENT_TYPES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                </select>
              </div>
              <div>
                <label className="text-xs block mb-1">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="text-xs border rounded px-2 py-1.5 w-full"
                >

                            {PAYMENT_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                </select>
              </div>
              <div>
                <label className="text-xs block mb-1">Paid</label>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) =>
                    setPaidAmount(
                      Math.min(total, Math.max(0, Number(e.target.value)))
                    )
                  }
                  className="w-full border rounded px-2 py-1.5 text-sm font-medium text-right"
                />
              </div>
              <div>
                <label className="text-xs block mb-1">Due</label>
                <div
                  className={`w-full text-right py-1.5 rounded font-bold text-lg ${
                    dueAmount > 0
                      ? "text-red-600 bg-red-50"
                      : "text-green-600 bg-green-50"
                  }`}
                >
                  ₹ {dueAmount.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleClear}
                className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground py-2 rounded font-medium text-sm"
              >
                Clear
              </button>
              <button
                onClick={() => alert("Sale finalized!")}
                className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 rounded font-medium text-sm"
              >
                Finalize Sale
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="p-2 bg-white border-t flex justify-center gap-2 flex-wrap">
        {[
          { icon: "fa-pause", label: "Hold", color: "from-red-400 to-red-600" },
          {
            icon: "fa-trash",
            label: "Void",
            color: "from-blue-500 to-blue-700",
          },
          {
            icon: "fa-money-bill",
            label: "Payment",
            color: "from-teal-400 to-teal-600",
          },
          {
            icon: "fa-cart-shopping",
            label: "Orders",
            color: "from-lime-200 to-lime-500 text-gray-900",
          },
          {
            icon: "fa-undo",
            label: "Reset",
            color: "from-purple-500 to-purple-700",
          },
          {
            icon: "fa-exchange-alt",
            label: "Transactions",
            color: "from-pink-400 to-pink-600",
          },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={() => alert(`${btn.label} clicked`)}
            className={`bg-gradient-to-r ${btn.color} hover:bg-gradient-to-br text-white font-medium text-xs px-3 py-1.5 rounded shadow-sm transition-all`}
          >
            <i className={`fa ${btn.icon} me-1`} /> {btn.label}
          </button>
        ))}
      </footer>

      {/* Edit Modal */}
      {isEditModalOpen && editForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold mb-4 text-center">Edit Product</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  name="productName"
                  value={editForm.productName || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, productName: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={editForm.price || 0}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: Number(e.target.value) })
                  }
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={editForm.stock || 0}
                  onChange={(e) =>
                    setEditForm({ ...editForm, stock: Number(e.target.value) })
                  }
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border rounded text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-primary text-white rounded text-sm font-medium"
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
