import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const accountsOptions = [
  "Cash",
  "Accounts Receivable",
  "Inventory",
  "Prepaid Expenses",
  "Accounts Payable",
  "Notes Payable",
  "Owner's Equity",
  "Sales Revenue",
  "Service Revenue",
  "Salaries Expense",
  "Rent Expense",
  "Utilities Expense",
  "Depreciation Expense",
  "Interest Expense",
  "Miscellaneous Expense",
];

export default function TrialBalance() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [accountFilter, setAccountFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    accountName: "",
    debit: "",
    credit: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("TrialBalance");
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

  // Filtered data based on account filter and search term
  const filteredData = useMemo(() => {
    return data.filter((item: any) => {
      const matchesAccount =
        accountFilter === "" || item.accountName === accountFilter;
      const matchesSearch =
        searchTerm === "" ||
        item.accountName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesAccount && matchesSearch;
    });
  }, [accountFilter, searchTerm, data]);

  // Paginated data using Pagination component props
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Totals for the current filtered data (all pages)
  const totalDebit = filteredData.reduce((acc, cur) => acc + cur.debit, 0);
  const totalCredit = filteredData.reduce((acc, cur) => acc + cur.credit, 0);

  // Handlers
  const onClear = () => {
    setFromDate("");
    setToDate("");
    setAccountFilter("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const onReport = () => {
    alert("Report generated (placeholder)");
  };

  const onSave = () => {
    alert("Save action triggered (placeholder)");
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onPageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  // Edit modal handlers
  const handleEditClick = (index: number) => {
    const item = paginatedData[index];
    if (item) {
      setEditForm({
        accountName: item.accountName,
        debit: item.debit.toString(),
        credit: item.credit.toString(),
      });
      setEditIndex((currentPage - 1) * itemsPerPage + index);
      setIsEditModalOpen(true);
    }
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    if (!editForm.accountName.trim()) {
      alert("Please fill the Account Name.");
      return;
    }
    if (editIndex !== null) {
      setData((prev) =>
        prev.map((item, idx) =>
          idx === editIndex
            ? {
                ...item,
                accountName: editForm.accountName.trim(),
                debit: Number(editForm.debit) || 0,
                credit: Number(editForm.credit) || 0,
              }
            : item
        )
      );
      setEditIndex(null);
      setIsEditModalOpen(false);
    }
  };

  const handleEditCancel = () => {
    setEditIndex(null);
    setIsEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      <div className="container mx-auto">
        {/* Title */}
        <h1 className="text-2xl font-semibold mb-6">Trial Balance</h1>

        {/* Filters Section */}
        <section className="bg-card rounded shadow p-6 mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
            className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end"
          >
            {/* From Date */}
            <div>
              <label
                htmlFor="fromDate"
                className="block text-sm font-medium mb-1"
              >
                From Date
              </label>
              <input
                type="date"
                id="fromDate"
                name="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* To Date */}
            <div>
              <label
                htmlFor="toDate"
                className="block text-sm font-medium mb-1"
              >
                To Date
              </label>
              <input
                type="date"
                id="toDate"
                name="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Account Dropdown */}
            <div>
              <label
                htmlFor="account"
                className="block text-sm font-medium mb-1"
              >
                Account
              </label>
              <select
                id="account"
                name="account"
                value={accountFilter}
                onChange={(e) => setAccountFilter(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">All Accounts</option>
                {accountsOptions.map((acc) => (
                  <option key={acc} value={acc}>
                    {acc}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium mb-1"
              >
                Search
              </label>
              <input
                type="text"
                id="search"
                name="search"
                placeholder="Search Account"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                title="Search"
              >
                <i className="fa fa-search fa-light" aria-hidden="true"></i> Search
              </button>
              <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                title="Clear"
              >
                <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
              </button>
              <button
                type="button"
                onClick={onReport}
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                title="Report"
              >
                <i className="fa fa-file-pdf-o fa-light" aria-hidden="true"></i> Report
              </button>
              <button
                type="button"
                onClick={onSave}
                className="inline-flex items-center gap-2 bg-warning hover:bg-warning/90 text-warning-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                title="Save"
              >
                <i className="fa fa-floppy-o fa-light" aria-hidden="true"></i> Save
              </button>
            </div>
          </form>
        </section>

        {/* Table Section */}
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
                      No data found.
                    </td>
                  </tr>
                )}
                {paginatedData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {row.accountName}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-foreground">
                      {row.debit.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-foreground">
                      {row.credit.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-3 text-center text-sm space-x-3">
                      <button
                        onClick={() => handleEditClick(idx)}
                        className="text-primary hover:text-primary/80 transition-colors"
                        aria-label={`Edit account ${row.accountName}`}
                        type="button"
                      >
                        <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-muted font-semibold text-foreground">
                  <td className="px-4 py-3 text-right">Total</td>
                  <td className="px-4 py-3 text-right">
                    {totalDebit.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {totalCredit.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
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
            totalItems={filteredData.length}
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
                Edit Account
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
                    step="0.01"
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
                    step="0.01"
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
    </div>
  );
}