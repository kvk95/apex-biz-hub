import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

type PurchaseRecord = {
  purchaseNo: string;
  supplier: string;
  purchaseDate: string;
  purchaseStatus: string;
  grandTotal: string;
  paidAmount: string;
  dueAmount: string;
  paymentStatus: string;
};

const purchaseStatuses = [
  "All",
  "Received",
  "Pending",
  "Ordered",
  "Canceled",
];

const paymentStatuses = ["All", "Paid", "Partial", "Due"];

const PurchaseReport: React.FC = () => {
  const [data, setData] = useState<PurchaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<PurchaseRecord[]>("PurchaseReport");
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
  const [purchaseNo, setPurchaseNo] = useState("");
  const [supplier, setSupplier] = useState("");
  const [purchaseStatus, setPurchaseStatus] = useState("All");
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Filtered data based on inputs
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (
        purchaseNo &&
        !item.purchaseNo.toLowerCase().includes(purchaseNo.toLowerCase())
      )
        return false;
      if (
        supplier &&
        !item.supplier.toLowerCase().includes(supplier.toLowerCase())
      )
        return false;
      if (purchaseStatus !== "All" && item.purchaseStatus !== purchaseStatus)
        return false;
      if (paymentStatus !== "All" && item.paymentStatus !== paymentStatus)
        return false;
      if (dateFrom && item.purchaseDate < dateFrom) return false;
      if (dateTo && item.purchaseDate > dateTo) return false;
      return true;
    });
  }, [data, purchaseNo, supplier, purchaseStatus, paymentStatus, dateFrom, dateTo]);

  // Pagination calculations
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleReset = () => {
    setPurchaseNo("");
    setSupplier("");
    setPurchaseStatus("All");
    setPaymentStatus("All");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6">Purchase Report</h1>

      {/* Filter Section */}
      <form
        onSubmit={handleSearch}
        className="bg-card rounded shadow p-6 mb-6"
        aria-label="Purchase report filters"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {/* Purchase No */}
          <div>
            <label
              htmlFor="purchaseNo"
              className="block text-sm font-medium mb-1"
            >
              Purchase No
            </label>
            <input
              id="purchaseNo"
              type="text"
              value={purchaseNo}
              onChange={(e) => setPurchaseNo(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Purchase No"
            />
          </div>

          {/* Supplier */}
          <div>
            <label
              htmlFor="supplier"
              className="block text-sm font-medium mb-1"
            >
              Supplier
            </label>
            <input
              id="supplier"
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Supplier"
            />
          </div>

          {/* Purchase Status */}
          <div>
            <label
              htmlFor="purchaseStatus"
              className="block text-sm font-medium mb-1"
            >
              Purchase Status
            </label>
            <select
              id="purchaseStatus"
              value={purchaseStatus}
              onChange={(e) => setPurchaseStatus(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {purchaseStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
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
              {paymentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label
              htmlFor="dateFrom"
              className="block text-sm font-medium mb-1"
            >
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
            <label
              htmlFor="dateTo"
              className="block text-sm font-medium mb-1"
            >
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
        </div>

        {/* Buttons */}
        <div className="mt-6 flex space-x-4 justify-start">
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
            <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Reset
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <i className="fa fa-sync fa-light" aria-hidden="true"></i> Refresh
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
                  Purchase No
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Supplier
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Purchase Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Purchase Status
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Grand Total
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Paid Amount
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Due Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Payment Status
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No records found.
                  </td>
                </tr>
              )}
              {paginatedData.map((item) => (
                <tr
                  key={item.purchaseNo}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.purchaseNo}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.supplier}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.purchaseDate}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        item.purchaseStatus === "Received"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : item.purchaseStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : item.purchaseStatus === "Canceled"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }`}
                    >
                      {item.purchaseStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-foreground">
                    ${item.grandTotal}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-foreground">
                    ${item.paidAmount}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-foreground">
                    ${item.dueAmount}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        item.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : item.paymentStatus === "Partial"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : item.paymentStatus === "Due"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }`}
                    >
                      {item.paymentStatus}
                    </span>
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
          totalItems={filteredData.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
      </div>
    </div>
  );
};

export default PurchaseReport;