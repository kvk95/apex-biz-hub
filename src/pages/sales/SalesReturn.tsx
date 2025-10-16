import { apiService } from "@/services/ApiService";
import { useEffect, useState } from "react";
import { Pagination } from "@/components/Pagination/Pagination";

export default function SalesReturn() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);
  const [editId, setEditId] = useState<number | null>(null);

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

  // Calculate paginated data
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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

  // Handlers for buttons
  const handleClear = () => {
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
    setEditId(null);
    setIsEditModalOpen(false);
    setCurrentPage(1);
  };

  const handleSave = () => {
    alert("Save functionality is not implemented in this demo.");
  };

  const handleReport = () => {
    alert("Report functionality is not implemented in this demo.");
  };

  // Edit modal handlers
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
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
    if (editId !== null && editForm) {
      setData((prev) =>
        prev.map((item) => (item.id === editId ? { ...item, ...editForm } : item))
      );
      setEditId(null);
      setIsEditModalOpen(false);
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setIsEditModalOpen(false);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Title */}
      <h1 className="text-lg font-semibold mb-6">Sales Return</h1>

      {/* Customer & Invoice Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="w-full border border-input rounded px-3 py-2 bg-muted cursor-not-allowed"
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
              className="w-full border border-input rounded px-3 py-2 bg-muted cursor-not-allowed"
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
              className="w-full border border-input rounded px-3 py-2 bg-muted cursor-not-allowed"
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
              className="w-full border border-input rounded px-3 py-2 bg-muted cursor-not-allowed"
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
              className="w-full border border-input rounded px-3 py-2 bg-muted cursor-not-allowed"
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
              className="w-full border border-input rounded px-3 py-2 bg-muted cursor-not-allowed"
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
              className="w-full border border-input rounded px-3 py-2 bg-muted cursor-not-allowed"
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
      <section className="bg-card rounded shadow p-6 mb-6 overflow-x-auto">
        <table className="min-w-full border border-border text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="border border-border px-3 py-2 w-24">Code</th>
              <th className="border border-border px-3 py-2 w-48">Product Name</th>
              <th className="border border-border px-3 py-2 w-20">Unit</th>
              <th className="border border-border px-3 py-2 w-24">Quantity</th>
              <th className="border border-border px-3 py-2 w-28">Price</th>
              <th className="border border-border px-3 py-2 w-28">Discount</th>
              <th className="border border-border px-3 py-2 w-20">Tax %</th>
              <th className="border border-border px-3 py-2 w-28">Total</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="even:bg-muted/50">
                <td className="border border-border px-3 py-2">{p.productCode}</td>
                <td className="border border-border px-3 py-2">{p.productName}</td>
                <td className="border border-border px-3 py-2">{p.unit}</td>
                <td className="border border-border px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    value={p.quantity}
                    onChange={(e) => handleProductChange(p.id, "quantity", e.target.value)}
                    className="w-full border border-input rounded px-2 py-1 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </td>
                <td className="border border-border px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={p.price}
                    onChange={(e) => handleProductChange(p.id, "price", e.target.value)}
                    className="w-full border border-input rounded px-2 py-1 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </td>
                <td className="border border-border px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={p.discount}
                    onChange={(e) => handleProductChange(p.id, "discount", e.target.value)}
                    className="w-full border border-input rounded px-2 py-1 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </td>
                <td className="border border-border px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={p.tax}
                    onChange={(e) => handleProductChange(p.id, "tax", e.target.value)}
                    className="w-full border border-input rounded px-2 py-1 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </td>
                <td className="border border-border px-3 py-2 text-right font-semibold">
                  {p.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-muted/30 font-semibold">
            <tr>
              <td className="border border-border px-3 py-2 text-center" colSpan={3}>
                Total
              </td>
              <td className="border border-border px-3 py-2 text-center">{totalQuantity}</td>
              <td className="border border-border px-3 py-2 text-right">{totalPrice.toFixed(2)}</td>
              <td className="border border-border px-3 py-2 text-right">{totalDiscount.toFixed(2)}</td>
              <td className="border border-border px-3 py-2 text-right">{totalTax.toFixed(2)}</td>
              <td className="border border-border px-3 py-2 text-right">{grandTotal.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </section>

      {/* Payment Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="w-full border border-input rounded px-3 py-2 resize-none bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="flex flex-wrap gap-3 mb-6">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
        </button>
        <button
          type="button"
          onClick={handleReport}
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
        </button>
      </section>

      {/* Sales Return Records Table with Pagination */}
      <section className="bg-card rounded shadow py-6">
        <h2 className="text-xl font-semibold mb-4 px-6">Sales Return Records</h2>
        <div className="overflow-x-auto px-6">
          <table className="min-w-full border border-border text-left text-sm">
            <thead className="bg-muted/50">
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-28">
                  Invoice No
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-28">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Customer
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground w-32">
                  Total Amount
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground w-32">
                  Paid Amount
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground w-32">
                  Due Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-24">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No sales return records found.
                  </td>
                </tr>
              )}
              {paginatedData.map((record, idx) => (
                <tr
                  key={record.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">{record.invoiceNo}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{record.date}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{record.customer}</td>
                  <td className="px-4 py-3 text-sm text-right text-foreground">
                    {(record.totalAmount ?? 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-foreground">
                    {(record.paidAmount ?? 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-foreground">
                    {(record.dueAmount ?? 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${record.status === "Paid"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : record.status === "Partial"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(record.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit sales return ${record.invoiceNo}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
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
              Edit Sales Return
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Invoice No */}
              <div>
                <label
                  htmlFor="editInvoiceNo"
                  className="block text-sm font-medium mb-1"
                >
                  Invoice No
                </label>
                <input
                  type="text"
                  id="editInvoiceNo"
                  name="invoiceNo"
                  value={editForm.invoiceNo || ""}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter Invoice No"
                />
              </div>

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
                  value={editForm.date || ""}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                  value={editForm.customer || ""}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter Customer"
                />
              </div>

              {/* Total Amount */}
              <div>
                <label
                  htmlFor="editTotalAmount"
                  className="block text-sm font-medium mb-1"
                >
                  Total Amount
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  id="editTotalAmount"
                  name="totalAmount"
                  value={editForm.totalAmount?.toString() || ""}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter Total Amount"
                />
              </div>

              {/* Paid Amount */}
              <div>
                <label
                  htmlFor="editPaidAmount"
                  className="block text-sm font-medium mb-1"
                >
                  Paid Amount
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  id="editPaidAmount"
                  name="paidAmount"
                  value={editForm.paidAmount?.toString() || ""}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter Paid Amount"
                />
              </div>

              {/* Due Amount */}
              <div>
                <label
                  htmlFor="editDueAmount"
                  className="block text-sm font-medium mb-1"
                >
                  Due Amount
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  id="editDueAmount"
                  name="dueAmount"
                  value={editForm.dueAmount?.toString() || ""}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter Due Amount"
                />
              </div>

              {/* Status */}
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
                  value={editForm.status || ""}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Paid">Paid</option>
                  <option value="Partial">Partial</option>
                  <option value="Due">Due</option>
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