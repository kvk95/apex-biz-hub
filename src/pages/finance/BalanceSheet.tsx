import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

export default function BalanceSheet() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    accountName: "",
    debit: "",
    credit: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("BalanceSheet");
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

  const totalDebit = data.reduce((sum, item) => sum + item.debit, 0);
  const totalCredit = data.reduce((sum, item) => sum + item.credit, 0);

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        accountName: item.accountName,
        debit: item.debit.toString(),
        credit: item.credit.toString(),
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (!editForm.accountName.trim()) {
      alert("Please fill the Account Name.");
      return;
    }
    if (editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                accountName: editForm.accountName.trim(),
                debit: Number(editForm.debit) || 0,
                credit: Number(editForm.credit) || 0,
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

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generated");
  };

  // Calculate paginated data using Pagination component props
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <> 
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-lg font-semibold mb-6 sm:mb-0">Balance Sheet</h1>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              type="button"
              title="Report"
            >
              <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              type="button"
              title="Clear"
            >
              <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
            </button>
            <button
              onClick={() => alert("Balance sheet saved")}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              type="button"
              title="Save"
            >
              <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <section className="bg-card rounded shadow p-6 mb-6">
          <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="fromDate"
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                From Date
              </label>
              <input
                type="date"
                id="fromDate"
                name="fromDate"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              />
            </div>
            <div>
              <label
                htmlFor="toDate"
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                To Date
              </label>
              <input
                type="date"
                id="toDate"
                name="toDate"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              />
            </div>
            <div>
              <label
                htmlFor="accountType"
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                Account Type
              </label>
              <select
                id="accountType"
                name="accountType"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Account Type
                </option>
                <option value="asset">Asset</option>
                <option value="liability">Liability</option>
                <option value="equity">Equity</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </form>
        </section>

        {/* Balance Sheet Table */}
        <section className="bg-card rounded shadow py-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Account Name
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                    Debit
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                    Credit
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
                      colSpan={4}
                      className="text-center px-4 py-6 text-muted-foreground italic"
                    >
                      No balance sheet entries found.
                    </td>
                  </tr>
                )}
                {paginatedData.map(({ id, accountName, debit, credit }) => (
                  <tr
                    key={id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                      {accountName}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">
                      {debit > 0
                        ? debit.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">
                      {credit > 0
                        ? credit.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-center text-sm space-x-3">
                      <button
                        onClick={() => handleEdit(id)}
                        className="text-primary hover:text-primary/80 transition-colors"
                        aria-label={`Edit account ${accountName}`}
                        type="button"
                      >
                        <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/20 font-semibold text-foreground">
                <tr>
                  <td className="px-4 py-3 text-right">Total</td>
                  <td className="px-4 py-3 text-right">
                    {totalDebit.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {totalCredit.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
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
                Edit Balance Sheet Entry
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Account Name */}
                <div>
                  <label
                    htmlFor="editAccountName"
                    className="block text-sm font-medium mb-1"
                  >
                    Account Name
                  </label>
                  <input
                    type="text"
                    id="editAccountName"
                    name="accountName"
                    value={editForm.accountName}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter account name"
                  />
                </div>

                {/* Debit */}
                <div>
                  <label
                    htmlFor="editDebit"
                    className="block text-sm font-medium mb-1"
                  >
                    Debit
                  </label>
                  <input
                    type="number"
                    id="editDebit"
                    name="debit"
                    value={editForm.debit}
                    onChange={handleEditInputChange}
                    min={0}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter debit amount"
                  />
                </div>

                {/* Credit */}
                <div>
                  <label
                    htmlFor="editCredit"
                    className="block text-sm font-medium mb-1"
                  >
                    Credit
                  </label>
                  <input
                    type="number"
                    id="editCredit"
                    name="credit"
                    value={editForm.credit}
                    onChange={handleEditInputChange}
                    min={0}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter credit amount"
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