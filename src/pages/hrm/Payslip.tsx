import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

export default function Payslip() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Data state
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>({
    id: null,
    date: "",
    description: "",
    amount: "",
    type: "Credit",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<{}>("Payslip");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev: any) => ({ ...prev, [name]: value }));
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = data.transactions?.find((t: any) => t.id === id);
    if (item) {
      setEditForm({
        id: item.id,
        date: item.date,
        description: item.description,
        amount: item.amount.toString(),
        type: item.type,
      });
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (
      !editForm.date.trim() ||
      !editForm.description.trim() ||
      !editForm.amount ||
      !editForm.type.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
    setData((prev: any) => {
      const updatedTransactions = prev.transactions.map((item: any) =>
        item.id === editForm.id
          ? {
              ...item,
              date: editForm.date,
              description: editForm.description.trim(),
              amount: Number(editForm.amount),
              type: editForm.type,
            }
          : item
      );
      return { ...prev, transactions: updatedTransactions };
    });
    setIsEditModalOpen(false);
  };

  // Cancel editing modal
  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setCurrentPage(1);
  };

  const savePayslip = () => {
    alert("Payslip saved (dummy action).");
  };

  const generateReport = () => {
    alert("Report generated (dummy action).");
  };

  const totalSalary = data.salaryDetails?.reduce(
    (acc: number, cur: { amount: number }) => acc + cur.amount,
    0
  ) ?? 0;
  const totalDeductions = data.deductions?.reduce(
    (acc: number, cur: { amount: number }) => acc + cur.amount,
    0
  ) ?? 0;
  const netSalary = totalSalary - totalDeductions;

  const paginatedTransactions = data.transactions?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) ?? [];

  return (
    <> 
      <div className="min-h-screen bg-background">
        <h1 className="text-lg font-semibold mb-6">Payslip</h1>
        <div className="max-w-7xl mx-auto bg-card rounded shadow border border-border">
          {/* Header */}
          <header className="p-6 border-b border-border flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div>
              <p className="text-sm text-muted-foreground mt-1">
                {data.employee?.payslipMonth}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
                aria-label="Clear"
              >
                <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
              </button>
              <button
                onClick={savePayslip}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
                aria-label="Save Payslip"
              >
                <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
              </button>
              <button
                onClick={generateReport}
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
                aria-label="Generate Report"
              >
                <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
              </button>
            </div>
          </header>

          {/* Company & Employee Info */}
          <section className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-border">
            {/* Company Info */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Company Information
              </h2>
              <p className="text-foreground font-semibold text-xl">
                {data.company?.name}
              </p>
              <p className="text-muted-foreground">{data.company?.addressLine1}</p>
              <p className="text-muted-foreground">{data.company?.addressLine2}</p>
              <p className="text-muted-foreground">Phone: {data.company?.phone}</p>
              <p className="text-muted-foreground">Email: {data.company?.email}</p>
              <p className="text-muted-foreground">Website: {data.company?.website}</p>
            </div>

            {/* Employee Info */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Employee Information
              </h2>
              <div className="space-y-2 text-foreground">
                <div className="flex justify-between">
                  <label className="font-semibold">Name:</label>
                  <span>{data.employee?.name}</span>
                </div>
                <div className="flex justify-between">
                  <label className="font-semibold">Designation:</label>
                  <span>{data.employee?.designation}</span>
                </div>
                <div className="flex justify-between">
                  <label className="font-semibold">Department:</label>
                  <span>{data.employee?.department}</span>
                </div>
                <div className="flex justify-between">
                  <label className="font-semibold">Employee ID:</label>
                  <span>{data.employee?.employeeId}</span>
                </div>
                <div className="flex justify-between">
                  <label className="font-semibold">Joining Date:</label>
                  <span>{data.employee?.joiningDate}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Salary and Deductions */}
          <section className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-border">
            {/* Salary Details */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Salary Details
              </h2>
              <table className="w-full text-left border border-border rounded-md">
                <thead className="bg-muted/20">
                  <tr>
                    <th className="py-2 px-3 border-b border-border font-semibold text-muted-foreground">
                      Description
                    </th>
                    <th className="py-2 px-3 border-b border-border font-semibold text-muted-foreground text-right">
                      Amount ($)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.salaryDetails?.map(({ id, description, amount }: any) => (
                    <tr key={id} className="odd:bg-background even:bg-muted/50">
                      <td className="py-2 px-3 border-b border-border">{description}</td>
                      <td className="py-2 px-3 border-b border-border text-right font-mono">
                        {amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-muted/20 font-semibold text-foreground">
                    <td className="py-2 px-3 border-t border-border">Total Salary</td>
                    <td className="py-2 px-3 border-t border-border text-right font-mono">
                      {totalSalary.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Deductions */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Deductions
              </h2>
              <table className="w-full text-left border border-border rounded-md">
                <thead className="bg-muted/20">
                  <tr>
                    <th className="py-2 px-3 border-b border-border font-semibold text-muted-foreground">
                      Description
                    </th>
                    <th className="py-2 px-3 border-b border-border font-semibold text-muted-foreground text-right">
                      Amount ($)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.deductions?.map(({ id, description, amount }: any) => (
                    <tr key={id} className="odd:bg-background even:bg-muted/50">
                      <td className="py-2 px-3 border-b border-border">{description}</td>
                      <td className="py-2 px-3 border-b border-border text-right font-mono">
                        {amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-muted/20 font-semibold text-foreground">
                    <td className="py-2 px-3 border-t border-border">Total Deductions</td>
                    <td className="py-2 px-3 border-t border-border text-right font-mono">
                      {totalDeductions.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Net Salary */}
          <section className="p-6 border-b border-border flex justify-end">
            <div className="bg-green-100 border border-green-400 rounded-md px-6 py-4 text-green-900 font-semibold text-xl">
              Net Salary: ${netSalary.toFixed(2)}
            </div>
          </section>

          {/* Transactions Table with Pagination */}
          <section className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Transactions
            </h2>
            <div className="overflow-x-auto border border-border rounded-md">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/20">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground border-b border-border">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground border-b border-border">
                      Description
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground border-b border-border">
                      Amount ($)
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground border-b border-border">
                      Type
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground border-b border-border">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-background">
                  {paginatedTransactions.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center px-4 py-6 text-muted-foreground italic"
                      >
                        No transactions found.
                      </td>
                    </tr>
                  )}
                  {paginatedTransactions.map(({ id, date, description, amount, type }: any) => (
                    <tr
                      key={id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-foreground font-mono">
                        {date}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {description}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm font-mono text-right ${
                          type === "Credit" ? "text-green-800" : "text-red-800"
                        }`}
                      >
                        {amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            type === "Credit"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm space-x-3">
                        <button
                          onClick={() => handleEdit(id)}
                          className="text-primary hover:text-primary/80 transition-colors"
                          aria-label={`Edit transaction ${description}`}
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
              totalItems={data.transactions?.length ?? 0}
              onPageChange={setCurrentPage}
              onPageSizeChange={setItemsPerPage}
            />
          </section>
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-modal-title"
          >
            <div className="bg-card rounded shadow-lg max-w-xl w-full p-6 relative">
              <h2
                id="edit-modal-title"
                className="text-xl font-semibold mb-4 text-center text-foreground"
              >
                Edit Transaction
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Date */}
                <div>
                  <label
                    htmlFor="editDate"
                    className="block text-sm font-medium mb-1 text-foreground"
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

                {/* Description */}
                <div>
                  <label
                    htmlFor="editDescription"
                    className="block text-sm font-medium mb-1 text-foreground"
                  >
                    Description
                  </label>
                  <input
                    type="text"
                    id="editDescription"
                    name="description"
                    value={editForm.description}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter description"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label
                    htmlFor="editAmount"
                    className="block text-sm font-medium mb-1 text-foreground"
                  >
                    Amount
                  </label>
                  <input
                    type="number"
                    id="editAmount"
                    name="amount"
                    value={editForm.amount}
                    onChange={handleEditInputChange}
                    min={0}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter amount"
                  />
                </div>

                {/* Type */}
                <div>
                  <label
                    htmlFor="editType"
                    className="block text-sm font-medium mb-1 text-foreground"
                  >
                    Type
                  </label>
                  <select
                    id="editType"
                    name="type"
                    value={editForm.type}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="Credit">Credit</option>
                    <option value="Debit">Debit</option>
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
    </>
  );
}