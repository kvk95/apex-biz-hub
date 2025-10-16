import React, { useMemo, useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

interface SupplierDue {
  supplierName: string;
  phone: string;
  email: string;
  dueAmount: number;
  paidAmount: number;
  totalAmount: number;
  action: string;
}

const SupplierDueReport: React.FC = () => {
  const [supplierName, setSupplierName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const [data, setData] = useState<SupplierDue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<SupplierDue>({
    supplierName: "",
    phone: "",
    email: "",
    dueAmount: 0,
    paidAmount: 0,
    totalAmount: 0,
    action: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<SupplierDue[]>("SupplierDueReport");
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

  // Filter data based on inputs
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSupplierName = item.supplierName
        .toLowerCase()
        .includes(supplierName.toLowerCase());
      const matchesPhone = item.phone.includes(phone);
      const matchesEmail = item.email.toLowerCase().includes(email.toLowerCase());

      // Date filters are present in the reference UI but no date data is available in sample data,
      // so date filtering is omitted here as no date field exists in data.

      return matchesSupplierName && matchesPhone && matchesEmail;
    });
  }, [supplierName, phone, email, data]);

  // Calculate paginated data using Pagination component props
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Handlers for modal edit inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]:
        name === "dueAmount" ||
        name === "paidAmount" ||
        name === "totalAmount"
          ? Number(value)
          : value,
    }));
  };

  // Open edit modal and populate edit form
  const handleEdit = (index: number) => {
    const item = paginatedData[index];
    if (item) {
      setEditForm({ ...item });
      setEditIndex(index + (currentPage - 1) * itemsPerPage);
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (
      !editForm.supplierName.trim() ||
      !editForm.phone.trim() ||
      !editForm.email.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (editIndex !== null) {
      setData((prev) =>
        prev.map((item, idx) =>
          idx === editIndex ? { ...editForm } : item
        )
      );
      setEditIndex(null);
      setIsEditModalOpen(false);
    }
  };

  // Cancel editing modal
  const handleEditCancel = () => {
    setEditIndex(null);
    setIsEditModalOpen(false);
  };

  // Reset filters handler (Clear button)
  const handleClear = () => {
    setSupplierName("");
    setPhone("");
    setEmail("");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  // Placeholder handlers for buttons (Report)
  const handleReport = () => {
    alert("Report generation is not implemented in this demo.");
  };

  // Calculate totals for footer
  const totalDueAmount = filteredData.reduce((acc, cur) => acc + cur.dueAmount, 0);
  const totalPaidAmount = filteredData.reduce((acc, cur) => acc + cur.paidAmount, 0);
  const totalTotalAmount = filteredData.reduce((acc, cur) => acc + cur.totalAmount, 0);

  return (
    <div className="min-h-screen bg-background"> 

      <h1 className="text-lg font-semibold mb-6">Supplier Due Report</h1>

      {/* Filter Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          className="grid grid-cols-1 md:grid-cols-6 gap-6 items-end"
        >
          {/* Supplier Name */}
          <div>
            <label
              htmlFor="supplierName"
              className="block text-sm font-medium mb-1"
            >
              Supplier Name
            </label>
            <input
              id="supplierName"
              type="text"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Supplier Name"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone
            </label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Phone"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Email"
            />
          </div>

          {/* Date From */}
          <div>
            <label htmlFor="dateFrom" className="block text-sm font-medium mb-1">
              Date From
            </label>
            <input
              id="dateFrom"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Date To */}
          <div>
            <label htmlFor="dateTo" className="block text-sm font-medium mb-1">
              Date To
            </label>
            <input
              id="dateTo"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-search fa-light" aria-hidden="true"></i> Search
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
            </button>
          </div>
        </form>
      </section>

      {/* Action Buttons */}
      <section className="flex justify-end mb-6 space-x-3">
        <button
          onClick={handleReport}
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
          type="button"
        >
          <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
        </button>
      </section>

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Supplier Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Email
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                Due Amount
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                Paid Amount
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                Total Amount
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center px-4 py-6 text-muted-foreground italic"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              paginatedData.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.supplierName}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{item.phone}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{item.email}</td>
                  <td className="px-4 py-3 text-sm text-foreground text-right">
                    {item.dueAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground text-right">
                    {item.paidAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground text-right">
                    {item.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      type="button"
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit supplier due ${item.supplierName}`}
                      onClick={() => handleEdit(idx)}
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      type="button"
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`View details for ${item.supplierName}`}
                      onClick={() => alert(`Viewing details for ${item.supplierName}`)}
                    >
                      {item.action}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {/* Footer totals */}
          <tfoot className="bg-muted/20 font-semibold text-muted-foreground">
            <tr>
              <td className="px-4 py-3 text-right" colSpan={3}>
                Total:
              </td>
              <td className="px-4 py-3 text-right">{totalDueAmount.toFixed(2)}</td>
              <td className="px-4 py-3 text-right">{totalPaidAmount.toFixed(2)}</td>
              <td className="px-4 py-3 text-right">{totalTotalAmount.toFixed(2)}</td>
              <td className="px-4 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </section>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredData.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setItemsPerPage(size);
          setCurrentPage(1);
        }}
      />

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
              Edit Supplier Due
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Supplier Name */}
              <div>
                <label
                  htmlFor="editSupplierName"
                  className="block text-sm font-medium mb-1"
                >
                  Supplier Name
                </label>
                <input
                  type="text"
                  id="editSupplierName"
                  name="supplierName"
                  value={editForm.supplierName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter supplier name"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="editPhone"
                  className="block text-sm font-medium mb-1"
                >
                  Phone
                </label>
                <input
                  type="text"
                  id="editPhone"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="editEmail"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="editEmail"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter email"
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
                  id="editDueAmount"
                  name="dueAmount"
                  value={editForm.dueAmount}
                  onChange={handleEditInputChange}
                  min={0}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter due amount"
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
                  id="editPaidAmount"
                  name="paidAmount"
                  value={editForm.paidAmount}
                  onChange={handleEditInputChange}
                  min={0}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter paid amount"
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
                  id="editTotalAmount"
                  name="totalAmount"
                  value={editForm.totalAmount}
                  onChange={handleEditInputChange}
                  min={0}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter total amount"
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
};

export default SupplierDueReport;