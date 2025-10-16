import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const InvoiceReport: React.FC = () => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<any>("InvoiceReport");
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

  // State for filters
  const [filters, setFilters] = useState({
    fromDate: "2022-01-01",
    toDate: "2022-12-31",
    customer: "",
    invoiceStatus: "All",
    paymentStatus: "All",
    paymentMethod: "All",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    invoiceNo: "",
    customer: "",
    date: "",
    dueDate: "",
    status: "All",
    paymentStatus: "All",
    paymentMethod: "All",
    total: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Handle filter change
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Extract filter option arrays from data or use empty arrays if not loaded
  const customers = data?.customers || [
    "All",
    "John Doe",
    "Jane Smith",
    "Acme Corp",
    "NyaInfo Technologies",
    "Customer A",
    "Customer B",
  ];
  const invoiceStatuses = data?.invoiceStatuses || [
    "All",
    "Paid",
    "Unpaid",
    "Partial",
  ];
  const paymentStatuses = data?.paymentStatuses || [
    "All",
    "Paid",
    "Unpaid",
    "Partial",
  ];
  const paymentMethods = data?.paymentMethods || [
    "All",
    "Cash",
    "Credit Card",
    "Cheque",
    "Bank Transfer",
  ];

  // Filter invoices based on filters
  const filteredInvoices = useMemo(() => {
    const invoices = data?.invoices || [];
    return invoices.filter((inv: any) => {
      // Filter by date range
      const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
      const toDate = filters.toDate ? new Date(filters.toDate) : null;
      const invoiceDate = new Date(inv.date);

      if (fromDate && invoiceDate < fromDate) return false;
      if (toDate && invoiceDate > toDate) return false;

      // Filter by customer
      if (filters.customer && filters.customer !== "All") {
        if (inv.customer !== filters.customer) return false;
      }

      // Filter by invoice status
      if (filters.invoiceStatus && filters.invoiceStatus !== "All") {
        if (inv.status !== filters.invoiceStatus) return false;
      }

      // Filter by payment status
      if (filters.paymentStatus && filters.paymentStatus !== "All") {
        if (inv.paymentStatus !== filters.paymentStatus) return false;
      }

      // Filter by payment method
      if (filters.paymentMethod && filters.paymentMethod !== "All") {
        if (inv.paymentMethod !== filters.paymentMethod) return false;
      }

      return true;
    });
  }, [filters, data]);

  // Handlers for pagination
  const setCurrentPageHandler = (page: number) => {
    setCurrentPage(page);
  };
  const setItemsPerPageHandler = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  // Paginated invoices slice
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Refresh button handler (reset filters)
  const handleClear = () => {
    setFilters({
      fromDate: "2022-01-01",
      toDate: "2022-12-31",
      customer: "",
      invoiceStatus: "All",
      paymentStatus: "All",
      paymentMethod: "All",
    });
    setCurrentPage(1);
  };

  // Report button handler (simulate report generation)
  const handleReport = () => {
    alert("Report generated for current filter selection.");
  };

  // Edit modal handlers
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Open edit modal and populate edit form if edit icon exists
  // Check if edit icon exists in the table row (it does not in original destination, so no edit icon)
  // Since no edit icon exists, do not add or modify edit controls or modal
  // But per instructions, if edit icon exists, replace inline edit with modal
  // Here, no edit icon exists, so skip modal implementation

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <h1 className="text-lg font-semibold mb-6"> Invoice Report </h1>

      {/* Filters Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Filter Options
        </h2>
        <form
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* From Date */}
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
              value={filters.fromDate}
              onChange={handleFilterChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* To Date */}
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
              value={filters.toDate}
              onChange={handleFilterChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Customer */}
          <div>
            <label
              htmlFor="customer"
              className="block text-sm font-medium mb-1 text-muted-foreground"
            >
              Customer
            </label>
            <select
              id="customer"
              name="customer"
              value={filters.customer}
              onChange={handleFilterChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {customers.map((cust) => (
                <option key={cust} value={cust}>
                  {cust}
                </option>
              ))}
            </select>
          </div>

          {/* Invoice Status */}
          <div>
            <label
              htmlFor="invoiceStatus"
              className="block text-sm font-medium mb-1 text-muted-foreground"
            >
              Invoice Status
            </label>
            <select
              id="invoiceStatus"
              name="invoiceStatus"
              value={filters.invoiceStatus}
              onChange={handleFilterChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {invoiceStatuses.map((status) => (
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
              className="block text-sm font-medium mb-1 text-muted-foreground"
            >
              Payment Status
            </label>
            <select
              id="paymentStatus"
              name="paymentStatus"
              value={filters.paymentStatus}
              onChange={handleFilterChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {paymentStatuses.map((status) => (
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
              className="block text-sm font-medium mb-1 text-muted-foreground"
            >
              Payment Method
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={filters.paymentMethod}
              onChange={handleFilterChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
        </form>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleReport}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <i className="fa fa-file-text fa-light" aria-hidden="true"></i>{" "}
            Generate Report
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
          </button>
        </div>
      </section>

      {/* Invoice Table Section */}
      <section className="bg-card rounded shadow py-6 px-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Invoice List
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-border divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground border-r border-border">
                  Invoice No
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground border-r border-border">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground border-r border-border">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground border-r border-border">
                  Due Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground border-r border-border">
                  Invoice Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground border-r border-border">
                  Payment Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground border-r border-border">
                  Payment Method
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Total ($)
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No invoices found.
                  </td>
                </tr>
              ) : (
                paginatedInvoices.map((inv: any, idx) => (
                  <tr
                    key={inv.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors cursor-default"
                    title={`Invoice ${inv.invoiceNo}`}
                  >
                    <td className="px-4 py-3 text-sm text-foreground border-r border-border font-semibold">
                      {inv.invoiceNo}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground border-r border-border">
                      {inv.customer}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground border-r border-border">
                      {inv.date}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground border-r border-border">
                      {inv.dueDate}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          inv.status === "Paid"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : inv.status === "Unpaid"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          inv.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : inv.paymentStatus === "Unpaid"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {inv.paymentMethod}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-foreground">
                      {inv.total.toFixed(2)}
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
          totalItems={filteredInvoices.length}
          onPageChange={setCurrentPageHandler}
          onPageSizeChange={setItemsPerPageHandler}
        />
      </section>
    </div>
  );
};

export default InvoiceReport;
