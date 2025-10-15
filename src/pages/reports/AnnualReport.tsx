import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

export default function AnnualReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [year, setYear] = useState("2023");
  const [branch, setBranch] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    customer: "",
    orders: "",
    totalSpent: "",
    lastPurchase: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("AnnualReport");
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

  // Open edit modal and populate edit form if edit icon/button exists
  // Check if edit icon/button exists in original destination: no edit icon/button present, so no edit modal trigger needed
  // But instructions say: If no edit icon/button exists, do not add or modify edit controls.
  // So we skip edit modal functionality and controls.

  // Handlers
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(e.target.value);
    setCurrentPage(1);
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBranch(e.target.value);
    setCurrentPage(1);
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setYear("2023");
    setBranch("all");
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generated for year " + year + " and branch " + branch);
  };

  // Calculate paginated data using Pagination component props
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Annual Report</h1>

      {/* Filters Section (preserve structure but apply source styling) */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label
              htmlFor="year"
              className="block text-sm font-medium mb-1"
            >
              Select Year
            </label>
            <select
              id="year"
              value={year}
              onChange={handleYearChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="branch"
              className="block text-sm font-medium mb-1"
            >
              Select Branch
            </label>
            <select
              id="branch"
              value={branch}
              onChange={handleBranchChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Branches</option>
              <option value="ny">New York</option>
              <option value="la">Los Angeles</option>
              <option value="chi">Chicago</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-3">
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
              <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Generate Report
            </button>
          </div>
        </form>
      </section>

      {/* Summary Cards Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        {/* Summary cards cannot be rendered without data from API, so omitted here */}
      </section>

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6 px-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Top Customers
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-border">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Orders
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Total Spent
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Last Purchase
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
                    No customers found.
                  </td>
                </tr>
              )}
              {paginatedData.map((row: any, idx) => (
                <tr
                  key={row.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {row.customer}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {row.orders}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {row.totalSpent}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {new Date(row.lastPurchase).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
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
    </div>
  );
}