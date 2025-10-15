import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

export default function ProfitLoss() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("ProfitLoss");
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

  // Filter data by date range if set
  const filteredData = data.filter((item: any) => {
    if (fromDate && new Date(item.date) < new Date(fromDate)) return false;
    if (toDate && new Date(item.date) > new Date(toDate)) return false;
    return true;
  });

  // Pagination logic
  const pagedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate totals for displayed page
  const totals = pagedData.reduce(
    (acc, item) => {
      acc.totalSales += item.totalSales;
      acc.totalPurchase += item.totalPurchase;
      acc.expense += item.expense;
      acc.profitLoss += item.profitLoss;
      return acc;
    },
    { totalSales: 0, totalPurchase: 0, expense: 0, profitLoss: 0 }
  );

  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleClear = () => {
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold mb-4 md:mb-0">Profit Loss</h1>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Clear"
            title="Clear"
          >
            <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Save"
            title="Save"
            onClick={() => alert("Save functionality not implemented")}
          >
            <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Report"
            title="Report"
            onClick={() => alert("Report functionality not implemented")}
          >
            <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <form
        onSubmit={handleSearch}
        className="bg-card rounded shadow p-6 mb-6 grid grid-cols-1 md:grid-cols-5 gap-6 items-end"
        aria-label="Filter Profit Loss"
      >
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
            className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            aria-required="false"
          />
        </div>
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
            className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            aria-required="false"
          />
        </div>
        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Search"
          >
            <i className="fa fa-search fa-light" aria-hidden="true"></i> Search
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Reset"
          >
            <i className="fa fa-undo fa-light" aria-hidden="true"></i> Reset
          </button>
        </div>
      </form>

      {/* Table Section */}
      <div className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Total Sales
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Total Purchase
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Expense
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Profit / Loss
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pagedData.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No data available for selected date range.
                  </td>
                </tr>
              )}
              {pagedData.map((item: any, idx) => (
                <tr
                  key={item.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.date}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground text-right">
                    {item.totalSales.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground text-right">
                    {item.totalPurchase.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground text-right">
                    {item.expense.toLocaleString()}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm text-right font-semibold ${
                      item.profitLoss >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.profitLoss.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Footer Totals */}
            {pagedData.length > 0 && (
              <tfoot className="bg-muted/50 font-semibold text-foreground">
                <tr>
                  <td className="px-4 py-3 text-left">Total</td>
                  <td className="px-4 py-3 text-right">
                    {totals.totalSales.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {totals.totalPurchase.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {totals.expense.toLocaleString()}
                  </td>
                  <td
                    className={`px-4 py-3 text-right ${
                      totals.profitLoss >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {totals.profitLoss.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            )}
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
      </div>
    </div>
  );
}