import React, { useState, useEffect } from "react";

const customersData = [
  {
    id: 1,
    name: "John Doe",
    phone: "123-456-7890",
    address: "123 Main St, Cityville",
  },
  {
    id: 2,
    name: "Jane Smith",
    phone: "987-654-3210",
    address: "456 Oak Ave, Townsville",
  },
  {
    id: 3,
    name: "Michael Johnson",
    phone: "555-123-4567",
    address: "789 Pine Rd, Villagetown",
  },
  {
    id: 4,
    name: "Emily Davis",
    phone: "444-555-6666",
    address: "321 Elm St, Hamlet",
  },
  {
    id: 5,
    name: "William Brown",
    phone: "222-333-4444",
    address: "654 Maple Dr, Borough",
  },
  {
    id: 6,
    name: "Olivia Wilson",
    phone: "111-222-3333",
    address: "987 Cedar Ln, Metropolis",
  },
  {
    id: 7,
    name: "James Taylor",
    phone: "777-888-9999",
    address: "246 Birch Blvd, Capital City",
  },
  {
    id: 8,
    name: "Sophia Martinez",
    phone: "333-444-5555",
    address: "135 Spruce Ct, Downtown",
  },
  {
    id: 9,
    name: "Benjamin Anderson",
    phone: "666-777-8888",
    address: "864 Walnut St, Uptown",
  },
  {
    id: 10,
    name: "Isabella Thomas",
    phone: "999-000-1111",
    address: "753 Chestnut Ave, Suburbia",
  },
];

const productsData = [
  {
    id: 1,
    name: "T-Bone Steak",
    price: 66.0,
    quantity: 1,
  },
  {
    id: 2,
    name: "Soup of the Day",
    price: 7.5,
    quantity: 1,
  },
  {
    id: 3,
    name: "Pancakes",
    price: 27.0,
    quantity: 1,
  },
];

const ITEMS_PER_PAGE = 5;

export default function Pos1() {
  // Page title
  useEffect(() => {
    document.title = "POS 1 | Dreams POS";
  }, []);

  // Customer selection and search
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(customersData[0]);

  // Pagination for customers
  const [customerPage, setCustomerPage] = useState(1);
  const totalCustomerPages = Math.ceil(customersData.length / ITEMS_PER_PAGE);
  const pagedCustomers = customersData.slice(
    (customerPage - 1) * ITEMS_PER_PAGE,
    customerPage * ITEMS_PER_PAGE
  );

  // Product list and pagination
  const [products, setProducts] = useState(productsData);
  const [productPage, setProductPage] = useState(1);
  const totalProductPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const pagedProducts = products.slice(
    (productPage - 1) * ITEMS_PER_PAGE,
    productPage * ITEMS_PER_PAGE
  );

  // Payment and discount states
  const [discount, setDiscount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentStatus, setPaymentStatus] = useState("Paid");

  // Calculate totals
  const subtotal = products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;
  const dueAmount = total - paidAmount;

  // Handlers
  const handleCustomerSelect = (customer: typeof customersData[0]) => {
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

  const handleRefresh = () => {
    setDiscount(0);
    setPaidAmount(0);
    setPaymentMethod("Cash");
    setPaymentStatus("Paid");
    setProducts(productsData);
    setSelectedCustomer(customersData[0]);
    setCustomerPage(1);
    setProductPage(1);
    setCustomerSearch("");
  };

  // Filter customers by search
  const filteredCustomers = customersData.filter((c) =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase())
  );

  // Pagination controls
  const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => {
    return (
      <div className="flex items-center space-x-2 text-gray-700">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
          aria-label="First Page"
        >
          <i className="fas fa-angle-double-left"></i>
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
          aria-label="Previous Page"
        >
          <i className="fas fa-angle-left"></i>
        </button>
        <span className="px-2 font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
          aria-label="Next Page"
        >
          <i className="fas fa-angle-right"></i>
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
          aria-label="Last Page"
        >
          <i className="fas fa-angle-double-right"></i>
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      {/* Container */}
      <div className="max-w-[1280px] mx-auto p-4">
        {/* Header */}
        <header className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-700">POS 1</h1>
          <div className="flex space-x-2">
            <button
              type="button"
              className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
              onClick={() => alert("Report functionality not implemented")}
            >
              <i className="fas fa-file-alt"></i>
              <span>Report</span>
            </button>
            <button
              type="button"
              className="flex items-center space-x-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded"
              onClick={handleRefresh}
            >
              <i className="fas fa-sync-alt"></i>
              <span>Refresh</span>
            </button>
          </div>
        </header>

        {/* Main grid */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left panel: Customer & Product selection */}
          <section className="col-span-7 bg-white rounded shadow p-4 flex flex-col space-y-6">
            {/* Customer Section */}
            <div>
              <h2 className="text-lg font-semibold mb-2 text-indigo-700">
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
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                {/* Customer Details */}
                <div className="w-64 border border-gray-300 rounded p-3 bg-gray-50">
                  {selectedCustomer ? (
                    <>
                      <p className="font-semibold">{selectedCustomer.name}</p>
                      <p className="text-sm text-gray-600">
                        Phone: {selectedCustomer.phone}
                      </p>
                      <p className="text-sm text-gray-600">
                        Address: {selectedCustomer.address}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-500">No customer selected</p>
                  )}
                </div>
              </div>
              {/* Customer List with Pagination */}
              <div className="mt-3 border border-gray-300 rounded max-h-48 overflow-y-auto bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-indigo-100 text-indigo-700 font-semibold">
                    <tr>
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.length === 0 && (
                      <tr>
                        <td
                          colSpan={2}
                          className="px-3 py-2 text-center text-gray-500"
                        >
                          No customers found
                        </td>
                      </tr>
                    )}
                    {filteredCustomers
                      .slice(
                        (customerPage - 1) * ITEMS_PER_PAGE,
                        customerPage * ITEMS_PER_PAGE
                      )
                      .map((c) => (
                        <tr
                          key={c.id}
                          className={`cursor-pointer hover:bg-indigo-50 ${
                            selectedCustomer?.id === c.id
                              ? "bg-indigo-200 font-semibold"
                              : ""
                          }`}
                          onClick={() => handleCustomerSelect(c)}
                        >
                          <td className="px-3 py-2">{c.name}</td>
                          <td className="px-3 py-2">{c.phone}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <div className="p-1 flex justify-end">
                  <Pagination
                    currentPage={customerPage}
                    totalPages={Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE) || 1}
                    onPageChange={(page) => {
                      if (
                        page >= 1 &&
                        page <= Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE)
                      )
                        setCustomerPage(page);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Product Section */}
            <div>
              <h2 className="text-lg font-semibold mb-2 text-indigo-700">
                Products
              </h2>
              <div className="border border-gray-300 rounded bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-indigo-100 text-indigo-700 font-semibold">
                    <tr>
                      <th className="px-3 py-2 w-1/2">Product</th>
                      <th className="px-3 py-2 w-1/6">Price</th>
                      <th className="px-3 py-2 w-1/6">Quantity</th>
                      <th className="px-3 py-2 w-1/6">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedProducts.map((p) => (
                      <tr key={p.id} className="border-b border-gray-200">
                        <td className="px-3 py-2">{p.name}</td>
                        <td className="px-3 py-2">${p.price.toFixed(2)}</td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            min={1}
                            className="w-16 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={p.quantity}
                            onChange={(e) =>
                              handleQuantityChange(p.id, Number(e.target.value))
                            }
                          />
                        </td>
                        <td className="px-3 py-2">
                          ${(p.price * p.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-1 flex justify-end">
                  <Pagination
                    currentPage={productPage}
                    totalPages={totalProductPages}
                    onPageChange={(page) => {
                      if (page >= 1 && page <= totalProductPages) setProductPage(page);
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Right panel: Payment & Summary */}
          <section className="col-span-5 bg-white rounded shadow p-4 flex flex-col space-y-6">
            <h2 className="text-lg font-semibold mb-2 text-indigo-700">
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
                <label className="font-semibold">Subtotal:</label>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {/* Discount */}
              <div className="flex justify-between items-center">
                <label htmlFor="discount" className="font-semibold">
                  Discount (%):
                </label>
                <input
                  id="discount"
                  type="number"
                  min={0}
                  max={100}
                  value={discount}
                  onChange={(e) => handleDiscountChange(Number(e.target.value))}
                  className="w-20 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Total */}
              <div className="flex justify-between font-bold text-indigo-700 text-lg">
                <label>Total:</label>
                <span>${total.toFixed(2)}</span>
              </div>

              {/* Paid Amount */}
              <div className="flex justify-between items-center">
                <label htmlFor="paidAmount" className="font-semibold">
                  Paid Amount:
                </label>
                <input
                  id="paidAmount"
                  type="number"
                  min={0}
                  max={total}
                  value={paidAmount}
                  onChange={(e) => handlePaidAmountChange(Number(e.target.value))}
                  className="w-32 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Due Amount */}
              <div className="flex justify-between">
                <label className="font-semibold">Due Amount:</label>
                <span>${dueAmount.toFixed(2)}</span>
              </div>

              {/* Payment Method */}
              <div className="flex justify-between items-center">
                <label htmlFor="paymentMethod" className="font-semibold">
                  Payment Method:
                </label>
                <select
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-32 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Cash</option>
                  <option>Card</option>
                  <option>Cheque</option>
                  <option>Mobile Payment</option>
                </select>
              </div>

              {/* Payment Status */}
              <div className="flex justify-between items-center">
                <label htmlFor="paymentStatus" className="font-semibold">
                  Payment Status:
                </label>
                <select
                  id="paymentStatus"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-32 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded flex items-center space-x-2"
                >
                  <i className="fas fa-save"></i>
                  <span>Save</span>
                </button>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded flex items-center space-x-2"
                >
                  <i className="fas fa-sync-alt"></i>
                  <span>Refresh</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}