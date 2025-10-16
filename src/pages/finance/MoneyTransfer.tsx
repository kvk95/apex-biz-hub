import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

export default function MoneyTransfer() {
  const [customersData, setCustomersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state for Add Section (preserved exactly)
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAccountNo: "",
    customerBalance: "",
    transferFrom: "",
    transferTo: "",
    bankName: "",
    accountNo: "",
    amount: "",
    currency: "USD",
    description: "",
  });

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAccountNo: "",
    customerBalance: "",
    transferFrom: "",
    transferTo: "",
    bankName: "",
    accountNo: "",
    amount: "",
    currency: "USD",
    description: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("MoneyTransfer");
    if (response.status.code === "S") {
      setCustomersData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  // Handlers for Add Section form inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const customer = customersData.find((c) => c.id === id);
    if (customer) {
      setEditForm({
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        customerAccountNo: customer.accountNo,
        customerBalance: customer.balance.toString(),
        transferFrom: "",
        transferTo: "",
        bankName: "",
        accountNo: "",
        amount: "",
        currency: "USD",
        description: "",
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (
      !editForm.customerName.trim() ||
      !editForm.customerPhone.trim() ||
      !editForm.customerEmail.trim() ||
      !editForm.customerAccountNo.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      setCustomersData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                name: editForm.customerName.trim(),
                phone: editForm.customerPhone.trim(),
                email: editForm.customerEmail.trim(),
                accountNo: editForm.customerAccountNo.trim(),
                balance: Number(editForm.customerBalance) || item.balance,
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

  // Select customer from list to populate Add Section form
  const handleCustomerSelect = (customer: typeof customersData[0]) => {
    setForm((prev) => ({
      ...prev,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      customerAccountNo: customer.accountNo,
      customerBalance: customer.balance.toString(),
    }));
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setForm({
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      customerAccountNo: "",
      customerBalance: "",
      transferFrom: "",
      transferTo: "",
      bankName: "",
      accountNo: "",
      amount: "",
      currency: "USD",
      description: "",
    });
    setEditId(null);
    setCurrentPage(1);
  };

  const handleSave = () => {
    alert("Save functionality triggered (not implemented).");
  };

  const handleReport = () => {
    alert("Report functionality triggered (not implemented).");
  };

  // Calculate paginated data using Pagination component props
  const paginatedCustomers = customersData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="min-h-screen bg-background  ">
        <h1 className="text-lg font-semibold mb-6">Money Transfer</h1>

        {/* Form Section (Add Section) - preserved exactly */}
        <section className="bg-card rounded shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium mb-1">
                Customer Name
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={form.customerName}
                onChange={handleInputChange}
                placeholder="Customer Name"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium mb-1">
                Phone
              </label>
              <input
                type="text"
                id="customerPhone"
                name="customerPhone"
                value={form.customerPhone}
                onChange={handleInputChange}
                placeholder="Phone"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={form.customerEmail}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="customerAccountNo" className="block text-sm font-medium mb-1">
                Account No
              </label>
              <input
                type="text"
                id="customerAccountNo"
                name="customerAccountNo"
                value={form.customerAccountNo}
                onChange={handleInputChange}
                placeholder="Account No"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="customerBalance" className="block text-sm font-medium mb-1">
                Balance
              </label>
              <input
                type="text"
                id="customerBalance"
                name="customerBalance"
                value={form.customerBalance}
                readOnly
                className="w-full border border-input rounded bg-muted px-3 py-2 cursor-not-allowed"
              />
            </div>
          </div>

          <section className="mt-6 flex flex-wrap gap-3">
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
        </section>

        {/* Table Section */}
        <section className="bg-card rounded shadow py-6">
          <h2 className="text-xl font-semibold mb-4">Customer List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-border">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Customer Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Account No
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Balance
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center px-4 py-6 text-muted-foreground italic"
                    >
                      No customers found.
                    </td>
                  </tr>
                )}
                {paginatedCustomers.map((customer, idx) => (
                  <tr
                    key={customer.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{customer.name}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{customer.phone}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{customer.email}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{customer.accountNo}</td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      ${customer.balance.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center text-sm space-x-3">
                      <button
                        type="button"
                        title={`Edit customer ${customer.name}`}
                        onClick={() => handleEdit(customer.id)}
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                      </button>
                      <button
                        type="button"
                        title={`Select customer ${customer.name}`}
                        onClick={() => handleCustomerSelect(customer)}
                        className="text-blue-600 hover:text-blue-800 focus:outline-none"
                      >
                        <i className="fa fa-check-circle fa-light text-lg"></i>
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
            totalItems={customersData.length}
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
                Edit Customer
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label
                    htmlFor="editCustomerName"
                    className="block text-sm font-medium mb-1"
                  >
                    Customer Name
                  </label>
                  <input
                    type="text"
                    id="editCustomerName"
                    name="customerName"
                    value={editForm.customerName}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Customer Name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="editCustomerPhone"
                    className="block text-sm font-medium mb-1"
                  >
                    Phone
                  </label>
                  <input
                    type="text"
                    id="editCustomerPhone"
                    name="customerPhone"
                    value={editForm.customerPhone}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Phone"
                  />
                </div>
                <div>
                  <label
                    htmlFor="editCustomerEmail"
                    className="block text-sm font-medium mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="editCustomerEmail"
                    name="customerEmail"
                    value={editForm.customerEmail}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label
                    htmlFor="editCustomerAccountNo"
                    className="block text-sm font-medium mb-1"
                  >
                    Account No
                  </label>
                  <input
                    type="text"
                    id="editCustomerAccountNo"
                    name="customerAccountNo"
                    value={editForm.customerAccountNo}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Account No"
                  />
                </div>
                <div>
                  <label
                    htmlFor="editCustomerBalance"
                    className="block text-sm font-medium mb-1"
                  >
                    Balance
                  </label>
                  <input
                    type="number"
                    id="editCustomerBalance"
                    name="customerBalance"
                    value={editForm.customerBalance}
                    onChange={handleEditInputChange}
                    min={0}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Balance"
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
    </>
  );
}