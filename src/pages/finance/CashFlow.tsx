import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

export default function CashFlow() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchDate, setSearchDate] = useState("");
  const [searchDescription, setSearchDescription] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    date: "",
    description: "",
    income: "",
    expense: "",
    balance: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("CashFlow");
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

  // Filter data by search inputs
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesDate = searchDate ? item.date === searchDate : true;
      const matchesDesc = searchDescription
        ? item.description
            .toLowerCase()
            .includes(searchDescription.toLowerCase())
        : true;
      return matchesDate && matchesDesc;
    });
  }, [data, searchDate, searchDescription]);

  // Calculate paginated data using Pagination component props
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Handlers
  const handleClear = () => {
    setSearchDate("");
    setSearchDescription("");
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generated for current filtered data.");
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        date: item.date,
        description: item.description,
        income: item.income?.toString() ?? "",
        expense: item.expense?.toString() ?? "",
        balance: item.balance?.toString() ?? "",
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (
      !editForm.date ||
      !editForm.description.trim() ||
      editForm.income === "" ||
      editForm.expense === "" ||
      editForm.balance === ""
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                date: editForm.date,
                description: editForm.description.trim(),
                income: Number(editForm.income),
                expense: Number(editForm.expense),
                balance: Number(editForm.balance),
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

  return (
    <div className="min-h-screen bg-background">
      {/* Title */}
      <h1 className="text-lg font-semibold mb-6 text-foreground">Cash Flow</h1>

      {/* Search & Action Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
        >
          {/* Date Filter */}
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium mb-1 text-muted-foreground"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Description Filter */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1 text-muted-foreground"
            >
              Description
            </label>
            <input
              type="text"
              id="description"
              placeholder="Search description"
              value={searchDescription}
              onChange={(e) => setSearchDescription(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 md:col-span-2 justify-start md:justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-search fa-light" aria-hidden="true"></i>{" "}
              Search
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-refresh fa-light" aria-hidden="true"></i>{" "}
              Clear
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-file-text fa-light" aria-hidden="true"></i>{" "}
              Report
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
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Description
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Income
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Expense
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Balance
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                      {item.description}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-foreground font-semibold whitespace-nowrap">
                      {item.income > 0 ? item.income.toLocaleString() : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-foreground font-semibold whitespace-nowrap">
                      {item.expense > 0 ? item.expense.toLocaleString() : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-foreground whitespace-nowrap">
                      {item.balance.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center text-sm space-x-3 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-primary hover:text-primary/80 transition-colors"
                        aria-label={`Edit cash flow record ${item.description}`}
                        type="button"
                      >
                        <i
                          className="fa fa-pencil fa-light"
                          aria-hidden="true"
                        ></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
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
              className="text-xl font-semibold mb-4 text-center text-foreground"
            >
              Edit Cash Flow
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Date */}
              <div>
                <label
                  htmlFor="editDate"
                  className="block text-sm font-medium mb-1 text-muted-foreground"
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
                  className="block text-sm font-medium mb-1 text-muted-foreground"
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

              {/* Income */}
              <div>
                <label
                  htmlFor="editIncome"
                  className="block text-sm font-medium mb-1 text-muted-foreground"
                >
                  Income
                </label>
                <input
                  type="number"
                  id="editIncome"
                  name="income"
                  value={editForm.income}
                  onChange={handleEditInputChange}
                  min={0}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter income"
                />
              </div>

              {/* Expense */}
              <div>
                <label
                  htmlFor="editExpense"
                  className="block text-sm font-medium mb-1 text-muted-foreground"
                >
                  Expense
                </label>
                <input
                  type="number"
                  id="editExpense"
                  name="expense"
                  value={editForm.expense}
                  onChange={handleEditInputChange}
                  min={0}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter expense"
                />
              </div>

              {/* Balance */}
              <div>
                <label
                  htmlFor="editBalance"
                  className="block text-sm font-medium mb-1 text-muted-foreground"
                >
                  Balance
                </label>
                <input
                  type="number"
                  id="editBalance"
                  name="balance"
                  value={editForm.balance}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter balance"
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
}
