import { apiService } from "@/services/ApiService";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 5;

export default function SalesReturn() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);O

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("SalesReturn");
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

  // Pagination state for sales return table
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState(
    data.slice(0, ITEMS_PER_PAGE)
  );

  // Form states
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customerDetails, setCustomerDetails] = useState({
    mobile: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  });

  const [invoiceNo, setInvoiceNo] = useState("");
  const [salesDate, setSalesDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [paymentType, setPaymentType] = useState("Cash");
  const [paymentStatus, setPaymentStatus] = useState("Paid");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNote, setPaymentNote] = useState("");

  const [products, setProducts] = useState([]);

  // Pagination handlers
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    setPaginatedData(data.slice(startIndex, startIndex + ITEMS_PER_PAGE));
  };

  // Customer selection handler
  useEffect(() => {
    if (!selectedCustomerId) {
      setCustomerDetails({
        mobile: "",
        email: "",
        address: "",
        city: "",
        state: "",
        country: "",
        zip: "",
      });
      return;
    }
    // Since customersData is removed, no local data to find customer details
    // You may want to fetch or handle this differently
    setCustomerDetails({
      mobile: "",
      email: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zip: "",
    });
  }, [selectedCustomerId]);

  // Product quantity change handler
  const handleProductChange = (id: number, field: string, value: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p };
          if (field === "quantity") updated.quantity = Number(value) || 0;
          if (field === "price") updated.price = Number(value) || 0;
          if (field === "discount") updated.discount = Number(value) || 0;
          if (field === "tax") updated.tax = Number(value) || 0;
          // Recalculate total
          const priceAfterDiscount = updated.price - updated.discount;
          const taxAmount = (priceAfterDiscount * updated.tax) / 100;
          updated.total = (priceAfterDiscount + taxAmount) * updated.quantity;
          return updated;
        }
        return p;
      })
    );
  };

  // Calculate totals for products table footer
  const totalQuantity = products.reduce((acc, p) => acc + p.quantity, 0);
  const totalPrice = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const totalDiscount = products.reduce((acc, p) => acc + p.discount * p.quantity, 0);
  const totalTax = products.reduce(
    (acc, p) => acc + ((p.price - p.discount) * p.tax * p.quantity) / 100,
    0
  );
  const grandTotal = products.reduce((acc, p) => acc + p.total, 0);

  // Handlers for buttons (refresh, save, report) - here just placeholders
  const handleRefresh = () => {
    setSelectedCustomerId("");
    setCustomerDetails({
      mobile: "",
      email: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zip: "",
    });
    setInvoiceNo("");
    setSalesDate("");
    setReturnDate("");
    setPaymentType("Cash");
    setPaymentStatus("Paid");
    setPaymentAmount("");
    setPaymentNote("");
    setProducts([]);
  };

  const handleSave = () => {
    alert("Save functionality is not implemented in this demo.");
  };

  const handleReport = () => {
    alert("Report functionality is not implemented in this demo.");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-800">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">Sales Return</h1>

      {/* Customer & Invoice Section */}
      <section className="bg-white p-6 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Customer Select */}
          <div>
            <label htmlFor="customer" className="block text-sm font-medium mb-1">
              Customer
            </label>
            <select
              id="customer"
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Customer</option>
              {/* No customersData available */}
            </select>
          </div>

          {/* Mobile */}
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium mb-1">
              Mobile
            </label>
            <input
              type="text"
              id="mobile"
              value={customerDetails.mobile}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 cursor-not-allowed"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={customerDetails.email}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              Address
            </label>
            <input
              type="text"
              id="address"
              value={customerDetails.address}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 cursor-not-allowed"
            />
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-1">
              City
            </label>
            <input
              type="text"
              id="city"
              value={customerDetails.city}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 cursor-not-allowed"
            />
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium mb-1">
              State
            </label>
            <input
              type="text"
              id="state"
              value={customerDetails.state}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 cursor-not-allowed"
            />
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-1">
              Country
            </label>
            <input
              type="text"
              id="country"
              value={customerDetails.country}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Zip */}
          <div>
            <label htmlFor="zip" className="block text-sm font-medium mb-1">
              Zip
            </label>
            <input
              type="text"
              id="zip"
              value={customerDetails.zip}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 cursor-not-allowed"
            />
          </div>

          {/* Invoice No */}
          <div>
            <label htmlFor="invoiceNo" className="block text-sm font-medium mb-1">
              Invoice No
            </label>
            <input
              type="text"
              id="invoiceNo"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              placeholder="Enter Invoice No"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Sales Date */}
          <div>
            <label htmlFor="salesDate" className="block text-sm font-medium mb-1">
              Sales Date
            </label>
            <input
              type="date"
              id="salesDate"
              value={salesDate}
              onChange={(e) => setSalesDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Return Date */}
          <div>
            <label htmlFor="returnDate" className="block text-sm font-medium mb-1">
              Return Date
            </label>
            <input
              type="date"
              id="returnDate"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Payment Type */}
          <div>
            <label htmlFor="paymentType" className="block text-sm font-medium mb-1">
              Payment Type
            </label>
            <select
              id="paymentType"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Cash</option>
              <option>Cheque</option>
              <option>Credit Card</option>
              <option>Other</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products Table Section */}
      <section className="bg-white p-6 rounded shadow mb-6 overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border border-gray-300 px-3 py-2 w-24">Code</th>
              <th className="border border-gray-300 px-3 py-2 w-48">Product Name</th>
              <th className="border border-gray-300 px-3 py-2 w-20">Unit</th>
              <th className="border border-gray-300 px-3 py-2 w-24">Quantity</th>
              <th className="border border-gray-300 px-3 py-2 w-28">Price</th>
              <th className="border border-gray-300 px-3 py-2 w-28">Discount</th>
              <th className="border border-gray-300 px-3 py-2 w-20">Tax %</th>
              <th className="border border-gray-300 px-3 py-2 w-28">Total</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="even:bg-gray-50">
                <td className="border border-gray-300 px-3 py-2">{p.productCode}</td>
                <td className="border border-gray-300 px-3 py-2">{p.productName}</td>
                <td className="border border-gray-300 px-3 py-2">{p.unit}</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    value={p.quantity}
                    onChange={(e) => handleProductChange(p.id, "quantity", e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={p.price}
                    onChange={(e) => handleProductChange(p.id, "price", e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={p.discount}
                    onChange={(e) => handleProductChange(p.id, "discount", e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={p.tax}
                    onChange={(e) => handleProductChange(p.id, "tax", e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right font-semibold">
                  {p.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100 font-semibold">
            <tr>
              <td className="border border-gray-300 px-3 py-2 text-center" colSpan={3}>
                Total
              </td>
              <td className="border border-gray-300 px-3 py-2 text-center">{totalQuantity}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{totalPrice.toFixed(2)}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{totalDiscount.toFixed(2)}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{totalTax.toFixed(2)}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{grandTotal.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </section>

      {/* Payment Section */}
      <section className="bg-white p-6 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Payment Status */}
          <div>
            <label htmlFor="paymentStatus" className="block text-sm font-medium mb-1">
              Payment Status
            </label>
            <select
              id="paymentStatus"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Paid</option>
              <option>Partial</option>
              <option>Due</option>
            </select>
          </div>

          {/* Payment Amount */}
          <div>
            <label htmlFor="paymentAmount" className="block text-sm font-medium mb-1">
              Payment Amount
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              id="paymentAmount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="Enter Payment Amount"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Payment Note */}
          <div>
            <label htmlFor="paymentNote" className="block text-sm font-medium mb-1">
              Payment Note
            </label>
            <textarea
              id="paymentNote"
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              rows={3}
              placeholder="Enter Payment Note"
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="flex flex-wrap gap-4 mb-6">
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
        >
          <i className="fas fa-save"></i> Save
        </button>
        <button
          type="button"
          onClick={handleRefresh}
          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded shadow"
        >
          <i className="fas fa-sync-alt"></i> Refresh
        </button>
        <button
          type="button"
          onClick={handleReport}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow"
        >
          <i className="fas fa-file-alt"></i> Report
        </button>
      </section>

      {/* Sales Return Records Table with Pagination */}
      <section className="bg-white p-6 rounded shadow overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Sales Return Records</h2>
        <table className="min-w-full border border-gray-300 text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border border-gray-300 px-3 py-2 w-28">Invoice No</th>
              <th className="border border-gray-300 px-3 py-2 w-28">Date</th>
              <th className="border border-gray-300 px-3 py-2">Customer</th>
              <th className="border border-gray-300 px-3 py-2 w-32 text-right">Total Amount</th>
              <th className="border border-gray-300 px-3 py-2 w-32 text-right">Paid Amount</th>
              <th className="border border-gray-300 px-3 py-2 w-32 text-right">Due Amount</th>
              <th className="border border-gray-300 px-3 py-2 w-24">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((record) => (
              <tr key={record.id} className="even:bg-gray-50">
                <td className="border border-gray-300 px-3 py-2">{record.invoiceNo}</td>
                <td className="border border-gray-300 px-3 py-2">{record.date}</td>
                <td className="border border-gray-300 px-3 py-2">{record.customer}</td>
                <td className="border border-gray-300 px-3 py-2 text-right">
                  {record.totalAmount.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right">
                  {record.paidAmount.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right">
                  {record.dueAmount.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      record.status === "Paid"
                        ? "bg-green-200 text-green-800"
                        : record.status === "Partial"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <nav
          className="flex justify-center items-center mt-4 space-x-2"
          aria-label="Pagination"
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border border-gray-300 ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "hover:bg-gray-200"
            }`}
            aria-label="Previous Page"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded border border-gray-300 ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-200"
              }`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border border-gray-300 ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "hover:bg-gray-200"
            }`}
            aria-label="Next Page"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </nav>
      </section>
    </div>
  );
}