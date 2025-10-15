import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const TAX_RATES = ["All", "5%", "6%", "7%", "8%", "9%", "10%", "11%", "12%"];

export default function TaxReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedTaxRate, setSelectedTaxRate] = useState("All");

  // Load data
  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("TaxReport");
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

  // Filtered data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && itemDate < start) return false;
      if (end && itemDate > end) return false;
      if (selectedTaxRate !== "All" && item.taxRate !== selectedTaxRate)
        return false;

      return true;
    });
  }, [data, startDate, endDate, selectedTaxRate]);

  // Paginated data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Totals for footer
  const totalTaxAmount = filteredData.reduce(
    (sum, item) => sum + item.taxAmount,
    0
  );
  const totalAmount = filteredData.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  );

  // Handlers
  function handleReset() {
    setStartDate("");
    setEndDate("");
    setSelectedTaxRate("All");
    setCurrentPage(1);
  }

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      {/* Page Title */}
      <title>Tax Report - Dreams POS</title>

      <h1 className="text-2xl font-semibold mb-6">Tax Report</h1>

      {/* Filter Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
        >
          {/* Start Date */}
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium mb-1"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Tax Rate */}
          <div>
            <label
              htmlFor="taxRate"
              className="block text-sm font-medium mb-1"
            >
              Tax Rate
            </label>
            <select
              id="taxRate"
              name="taxRate"
              value={selectedTaxRate}
              onChange={(e) => setSelectedTaxRate(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {TAX_RATES.map((rate) => (
                <option key={rate} value={rate}>
                  {rate}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-search fa-light" aria-hidden="true"></i> Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
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
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Invoice No
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Customer
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Tax Rate
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Tax Amount
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No records found.
                  </td>
                </tr>
              )}
              {paginatedData.map((item, idx) => (
                <tr
                  key={`${item.invoiceNo}-${idx}`}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.date}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.invoiceNo}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.customer}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-foreground">
                    {item.taxRate}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-foreground">
                    ${item.taxAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-foreground">
                    ${item.totalAmount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-muted/50 font-semibold text-foreground">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-right">
                  Totals:
                </td>
                <td className="px-4 py-3 text-right">
                  ${totalTaxAmount.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right">
                  ${totalAmount.toFixed(2)}
                </td>
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
    </div>
  );
}