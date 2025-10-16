import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const paymentStatusOptions = ["All", "Paid", "Unpaid"];
const paymentMethodOptions = ["All", "Cash", "Credit Card", "Bank Transfer"];

const IncomeReport: React.FC = () => {
  // API state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("IncomeReport");
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

  // Filters state
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("All");
  const [paymentMethod, setPaymentMethod] = useState<string>("All");
  const [searchInvoice, setSearchInvoice] = useState<string>("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  // Filtered data based on filters
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Filter by date range
      if (startDate && item.date < startDate) return false;
      if (endDate && item.date > endDate) return false;

      // Filter by payment status
      if (paymentStatus !== "All" && item.paymentStatus !== paymentStatus)
        return false;

      // Filter by payment method
      if (paymentMethod !== "All" && item.paymentMethod !== paymentMethod)
        return false;

      // Filter by invoice no search (case insensitive)
      if (
        searchInvoice.trim() !== "" &&
        !item.invoiceNo.toLowerCase().includes(searchInvoice.toLowerCase())
      )
        return false;

      return true;
    });
  }, [data, startDate, endDate, paymentStatus, paymentMethod, searchInvoice]);

  // Pagination calculations
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setPaymentStatus("All");
    setPaymentMethod("All");
    setSearchInvoice("");
    setCurrentPage(1);
  };

  const handleClear = () => {
    handleResetFilters();
  };

  const handleRefresh = () => {
    loadData();
    handleResetFilters();
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > Math.ceil(filteredData.length / itemsPerPage))
      return;
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">

      <h1 className="text-lg font-semibold mb-6">Income Report</h1>

      <div className="max-w-7xl mx-auto bg-card rounded shadow-lg p-6"> 
        {/* Filters Section */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          className="mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
            {/* Date From */}
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium mb-1"
              >
                Date From
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Select start date"
              />
            </div>

            {/* Date To */}
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium mb-1"
              >
                Date To
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Payment Status */}
            <div>
              <label
                htmlFor="paymentStatus"
                className="block text-sm font-medium mb-1"
              >
                Payment Status
              </label>
              <select
                id="paymentStatus"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {paymentStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label
                htmlFor="paymentMethod"
                className="block text-sm font-medium mb-1"
              >
                Payment Method
              </label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {paymentMethodOptions.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            {/* Invoice No Search */}
            <div>
              <label
                htmlFor="searchInvoice"
                className="block text-sm font-medium mb-1"
              >
                Invoice No
              </label>
              <input
                type="text"
                id="searchInvoice"
                placeholder="Search Invoice No"
                value={searchInvoice}
                onChange={(e) => setSearchInvoice(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex space-x-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-search fa-light" aria-hidden="true"></i> Search
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-undo fa-light" aria-hidden="true"></i> Reset
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Refresh
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-trash fa-light" aria-hidden="true"></i> Clear
            </button>
          </div>
        </form>

        {/* Table Section */}
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
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Payment Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Payment Method
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Total Amount
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
                    key={item.invoiceNo}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.date}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground font-mono text-blue-600">
                      {item.invoiceNo}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.customer}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${item.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                      >
                        {item.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.paymentMethod}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                      ${item.totalAmount.toFixed(2)}
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
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
};

export default IncomeReport;