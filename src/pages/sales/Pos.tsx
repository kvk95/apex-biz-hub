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

const orders = [
  {
    orderId: "#45698",
    status: "Hold",
    customer: "Botsford",
    total: 900,
    date: "24 Dec 2024 13:39:11",
    note: "Customer need to recheck the product once",
  },
  {
    orderId: "#666659",
    status: "Unpaid",
    customer: "Botsford",
    total: 900,
    date: "24 Dec 2024 13:39:11",
    note: "",
  },
  {
    orderId: "#123456",
    status: "Paid",
    customer: "James",
    total: 500,
    date: "24 Dec 2024 13:45:22",
    note: "",
  },
];

// Sample transaction data
const transactionsData = [
  {
    id: 1,
    customer: "Carl Evans",
    reference: "INV/SL0101",
    date: "24 Dec 2024",
    amount: 1000,
    type: "Purchase",
  },
  {
    id: 2,
    customer: "Minerva Rameriz",
    reference: "INV/SL0102",
    date: "10 Dec 2024",
    amount: 1500,
    type: "Payment",
  },
  {
    id: 3,
    customer: "Robert Lamon",
    reference: "INV/SL0103",
    date: "27 Nov 2024",
    amount: 1500,
    type: "Return",
  },
  {
    id: 4,
    customer: "Patricia Lewis",
    reference: "INV/SL0104",
    date: "18 Nov 2024",
    amount: 2000,
    type: "Purchase",
  },
  {
    id: 5,
    customer: "Mark Joslyn",
    reference: "INV/SL0105",
    date: "06 Nov 2024",
    amount: 800,
    type: "Payment",
  },
  {
    id: 6,
    customer: "Marsha Betts",
    reference: "INV/SL0106",
    date: "25 Oct 2024",
    amount: 750,
    type: "Return",
  },
  {
    id: 7,
    customer: "Daniel Jude",
    reference: "INV/SL0107",
    date: "14 Oct 2024",
    amount: 1300,
    type: "Purchase",
  },
];

// Modal component for holding the order
const HoldOrderModal = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const [orderReference, setOrderReference] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Hold order</h2>
        <div className="bg-light br-10 p-4 text-center mb-3">
          <h2 className="display-1">4500.00</h2>
        </div>
        <div className="mb-3">
          <label className="form-label">
            Order Reference <span className="text-danger">*</span>
          </label>
          <input
            className="form-control"
            type="text"
            value={orderReference}
            onChange={(e) => setOrderReference(e.target.value)}
            placeholder="Enter reference"
          />
        </div>
        <p>
          The current order will be set on hold. You can retrieve this order
          from the pending order button. Providing a reference to it might help
          you identify the order more quickly.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-primary text-white rounded text-sm font-medium"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal for payment completed
const PaymentCompletedModal = ({
  isOpen,
  onClose,
  onPrintReceipt,
  onNextOrder,
}: {
  isOpen: boolean;
  onClose: () => void;
  onPrintReceipt: () => void;
  onNextOrder: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 text-center">
        <div className="text-green-500 text-4xl mb-4">
          <i className="fa fa-check-circle" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Payment Completed</h2>
        <p className="mb-4">
          Do you want to Print Receipt for the Completed Order?
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onPrintReceipt}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm px-4 py-2 rounded"
          >
            Print Receipt
          </button>
          <button
            onClick={onNextOrder}
            className="bg-green-500 hover:bg-green-600 text-white font-medium text-sm px-4 py-2 rounded"
          >
            Next Order
          </button>
        </div>
      </div>
    </div>
  );
};

// Confirm Action Modal
const ConfirmActionModal = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
        <div className="text-purple-500 text-4xl mb-4 w-full items-center justify-center">
          <i className="fa fa-exchange-alt" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Confirm Your Action</h2>
        <p className="mb-4">
          The current order will be cleared. But not deleted if it's persistent.
          Would you like to proceed?
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium text-sm px-4 py-2 rounded"
          >
            No, Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-green-500 hover:bg-green-600 text-white font-medium text-sm px-4 py-2 rounded"
          >
            Yes, Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

// Receipt Print Modal
const ReceiptModal = ({
  isOpen,
  onClose,
  cartItems,
  total,
}: {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[];
  total: number;
}) => {
  if (!isOpen) return null;

  const formatReceipt = () => {
    return cartItems.map((item, index) => (
      <div key={index} className="flex justify-between text-sm mb-2">
        <span>
          {item.productName} (x{item.quantity})
        </span>
        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <div className="mb-4">
          <h3 className="text-center font-bold text-xl">Tax Invoice</h3>
          <p className="text-center">Dreamguys Technologies Pvt Ltd.</p>
        </div>
        <div className="mb-4">
          <h4>Items</h4>
          {formatReceipt()}
        </div>
        <div className="mb-4 flex justify-between font-semibold text-lg">
          <span>Total:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onClose}
            className="bg-green-500 hover:bg-green-600 text-white font-medium text-sm px-4 py-2 rounded"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

// Order Popup Modal with Tabs
const OrderPopupModal = ({
  isOpen,
  onClose,
  orders,
}: {
  isOpen: boolean;
  onClose: () => void;
  orders: any[];
}) => {
  const [activeTab, setActiveTab] = useState("Hold");

  if (!isOpen) return null;

  // Filter orders based on the active tab
  const filteredOrders = orders.filter((order) => order.status === activeTab);

  const handleOpenOrder = (orderId: string) => {
    alert(`Order #${orderId} is now opened for further operations.`);
  };

  const handleViewProducts = (orderId: string) => {
    alert(`Viewing products for order #${orderId}`);
  };

  const handlePrintReceipt = (orderId: string) => {
    alert(`Printing receipt for order #${orderId}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6">
        {/* Modal Header */}
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold text-xl">Orders</h2>
          <button onClick={onClose} className="text-red-500 text-lg">
            X
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-4">
          {["Hold", "Unpaid", "Paid"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 mx-2 text-sm font-medium ${
                activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No orders found in this tab.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.orderId}
                className="p-4 bg-gray-50 border rounded-lg"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-medium">
                    Order ID: #{order.orderId}
                  </span>
                  <span className="font-medium">Total: ${order.total}</span>
                </div>
                <div className="mb-2">
                  <span>Customer: {order.customer}</span> |
                  <span> Date: {order.date}</span>
                </div>
                <div className="mb-3 text-sm text-blue-500">{order.note}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenOrder(order.orderId)}
                    className="bg-orange-500 text-white py-2 px-4 rounded"
                  >
                    Open Order
                  </button>
                  <button
                    onClick={() => handleViewProducts(order.orderId)}
                    className="bg-green-500 text-white py-2 px-4 rounded"
                  >
                    View Products
                  </button>
                  <button
                    onClick={() => handlePrintReceipt(order.orderId)}
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                  >
                    Print
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Modal for recent transactions
const TransactionsModal = ({
  isOpen,
  onClose,
  transactions,
}: {
  isOpen: boolean;
  onClose: () => void;
  transactions: any[];
}) => {
  const [activeTab, setActiveTab] = useState("Purchase");

  if (!isOpen) return null;

  // Filter transactions based on the active tab
  const filteredTransactions = transactions.filter(
    (transaction) => transaction.type === activeTab
  );

  const handleView = (id: number) => {
    alert(`Viewing transaction #${id}`);
  };

  const handleEdit = (id: number) => {
    alert(`Editing transaction #${id}`);
  };

  const handleDelete = (id: number) => {
    alert(`Deleting transaction #${id}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6">
        {/* Modal Header */}
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold text-xl">Recent Transactions</h2>
          <button onClick={onClose} className="text-red-500 text-lg">
            X
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-4">
          {["Purchase", "Payment", "Return"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 mx-2 text-sm font-medium ${
                activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left border">Customer</th>
                <th className="px-4 py-2 text-left border">Reference</th>
                <th className="px-4 py-2 text-left border">Date</th>
                <th className="px-4 py-2 text-left border">Amount</th>
                <th className="px-4 py-2 text-left border">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-4 py-2 border">{transaction.customer}</td>
                  <td className="px-4 py-2 border">{transaction.reference}</td>
                  <td className="px-4 py-2 border">{transaction.date}</td>
                  <td className="px-4 py-2 border">${transaction.amount}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleView(transaction.id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      <i className="fa fa-eye" />
                    </button>
                    <button
                      onClick={() => handleEdit(transaction.id)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mx-2"
                    >
                      <i className="fa fa-edit" />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      <i className="fa fa-trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Create Customer Modal
const CreateCustomerModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customerData: any) => void;
}) => {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!customerName || !phone) {
      alert("Customer Name and Phone are required.");
      return;
    }
    const customerData = {
      customerName,
      phone,
      email,
      address,
      city,
      country,
    };
    onSubmit(customerData);
    onClose(); // Close the modal after submission
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold text-xl">Create Customer</h2>
          <button onClick={onClose} className="text-red-500 text-lg">
            X
          </button>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium">
            Customer Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium">
            Phone <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-sm font-medium text-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded text-sm font-medium"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

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

  const [isHoldModalOpen, setIsHoldModalOpen] = useState(false);
  const [isPaymentCompletedModalOpen, setIsPaymentCompletedModalOpen] =
    useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [isCreateCustomerModalOpen, setIsCreateCustomerModalOpen] =
    useState(false);

  const handleFooterHoldClick = () => {
    setIsHoldModalOpen(true);
  };

  const handleFooterConfirmHold = () => {
    alert("Order placed on hold with reference.");
  };

  const handleFooterVoidClick = () => {
    alert("Void clicked");
  };

  const handleFooterPaymentClick = () => {
    setIsPaymentCompletedModalOpen(true);
  };

  const handleFooterOrdersClick = () => {
    setIsOrdersModalOpen(true);
  };

  const handleFooterResetClick = () => {
    setIsConfirmModalOpen(true);
  };

  const handleFooterTransactionsClick = () => {
    setIsTransactionsModalOpen(true);
  };

  const handlePrintReceipt = () => {
    setIsReceiptModalOpen(true);
    setIsPaymentCompletedModalOpen(false);
  };

  const handleNextOrder = () => {
    alert("Next Order clicked");
    setIsPaymentCompletedModalOpen(false);
  };

  const handleCloseReceipt = () => {
    setIsReceiptModalOpen(false);
  };

  // Handle Confirm Reset
  const handleConfirmReset = () => {
    alert("Order has been reset!");
    setIsConfirmModalOpen(false);
    // Add your order reset logic here
  };

  // Handle Add Customer Button
  const handleAddCustomer = () => {
    setIsCreateCustomerModalOpen(true);
  };

  // Handle Submit Customer Form
  const handleSubmitCustomer = (customerData: any) => {
    console.log("New Customer Created:", customerData);
    // You can add the API call to save the customer data here.
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
                <button className="p-1.5 bg-blue-400 rounded hover:bg-blue-500 text-white  text-sm px-3 py-2 rounded">
                  <i className="fa fa-pause " />
                </button>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="p-3 border-b space-y-2">
            <div className="flex gap-2">
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
            <button
              onClick={handleAddCustomer}
              className="bg-teal-500 hover:bg-teal-600 text-white text-sm px-3 py-2 rounded"
            >
              <i className="fa fa-user-plus" aria-hidden="true"></i>
            </button>
            </div>
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
               <i className="fa fa-cart-shopping fa-light " /> Finalize Sale
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="p-2 bg-white border-t flex justify-center gap-2 flex-wrap">
        {[
          {
            icon: "fa-pause",
            label: "Hold",
            color: "from-red-400 to-red-600",
            handler: handleFooterHoldClick,
          },
          {
            icon: "fa-trash",
            label: "Void",
            color: "from-blue-500 to-blue-700",
            handler: handleFooterVoidClick,
          },
          {
            icon: "fa-money-bill",
            label: "Payment",
            color: "from-teal-400 to-teal-600",
            handler: handleFooterPaymentClick,
          },
          {
            icon: "fa-cart-shopping",
            label: "Orders",
            color: "from-lime-200 to-lime-500 text-gray-900",
            handler: handleFooterOrdersClick,
          },
          {
            icon: "fa-undo",
            label: "Reset",
            color: "from-purple-500 to-purple-700",
            handler: handleFooterResetClick,
          },
          {
            icon: "fa-exchange-alt",
            label: "Transactions",
            color: "from-pink-400 to-pink-600",
            handler: handleFooterTransactionsClick,
          },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.handler}
            className={`bg-gradient-to-r ${btn.color} hover:bg-gradient-to-br text-white font-medium text-xs px-3 py-1.5 rounded shadow-sm transition-all`}
          >
            <i className={`fa ${btn.icon} me-1`} /> {btn.label}
          </button>
        ))}
      </footer>

      {/* Hold Order Modal */}
      <HoldOrderModal
        isOpen={isHoldModalOpen}
        onClose={() => setIsHoldModalOpen(false)}
        onConfirm={handleFooterConfirmHold}
      />

      {/* Payment Completed Modal */}
      <PaymentCompletedModal
        isOpen={isPaymentCompletedModalOpen}
        onClose={() => setIsPaymentCompletedModalOpen(false)}
        onPrintReceipt={handlePrintReceipt}
        onNextOrder={handleNextOrder}
      />

      {/* Receipt Print Modal */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={handleCloseReceipt}
        cartItems={cartItems}
        total={total}
      />

      {/* Orders Modal */}
      <OrderPopupModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
        orders={orders}
      />

      {/* Confirm Action Modal */}
      <ConfirmActionModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmReset}
      />

      {/* Transactions Modal */}
      <TransactionsModal
        isOpen={isTransactionsModalOpen}
        onClose={() => setIsTransactionsModalOpen(false)}
        transactions={transactionsData}
      />

      {/* Create Customer Modal */}
      <CreateCustomerModal
        isOpen={isCreateCustomerModalOpen}
        onClose={() => setIsCreateCustomerModalOpen(false)}
        onSubmit={handleSubmitCustomer}
      />

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
