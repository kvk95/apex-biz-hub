import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

export default function AccountStatement() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [filters, setFilters] = useState({
    fromDate: "2023-01-01",
    toDate: "2023-12-31",
    customer: "John Doe",
    invoiceNo: "",
    paymentType: "All",
  });

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("AccountStatement");
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

  const filteredTransactions = useMemo(() => {
    return data.filter((t: any) => {
      const tDate = new Date(t.date);
      const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
      const toDate = filters.toDate ? new Date(filters.toDate) : null;
      if (fromDate && tDate < fromDate) return false;
      if (toDate && tDate > toDate) return false;
      if (
        filters.invoiceNo &&
        !t.invoiceNo.toLowerCase().includes(filters.invoiceNo.toLowerCase())
      )
        return false;
      if (
        filters.paymentType &&
        filters.paymentType !== "All" &&
        t.paymentType !== filters.paymentType
      )
        return false;
      if (filters.customer && filters.customer !== "John Doe") return false;
      return true;
    });
  }, [filters, data]);

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleClear = () => {
    setFilters({
      fromDate: "2023-01-01",
      toDate: "2023-12-31",
      customer: "John Doe",
      invoiceNo: "",
      paymentType: "All",
    });
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generation is not implemented in this demo.");
  };

  return (
    <> 
      <div className="min-h-screen bg-background ">
        <h1 className="text-lg font-semibold mb-6">Account Statement</h1>

        {/* Customer Info Section */}
        <section className="bg-card rounded shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Customer Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="customerName"
                className="block text-sm font-medium mb-1"
              >
                Customer Name
              </label>
              <input
                type="text"
                id="customerName"
                name="customer"
                value={filters.customer}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Customer Name"
              />
            </div>
            <div>
              <label
                htmlFor="customerId"
                className="block text-sm font-medium mb-1"
              >
                Customer ID
              </label>
              <input
                type="text"
                id="customerId"
                name="customerId"
                value="CUST-0001"
                readOnly
                className="w-full border border-input rounded px-3 py-2 bg-background cursor-not-allowed"
              />
            </div>
            <div>
              <label
                htmlFor="customerAddress"
                className="block text-sm font-medium mb-1"
              >
                Address
              </label>
              <textarea
                id="customerAddress"
                name="address"
                value="1234 Elm Street, Springfield, USA"
                readOnly
                rows={3}
                className="w-full border border-input rounded px-3 py-2 bg-background cursor-not-allowed resize-none"
              />
            </div>
            <div>
              <label
                htmlFor="customerPhone"
                className="block text-sm font-medium mb-1"
              >
                Phone
              </label>
              <input
                type="text"
                id="customerPhone"
                name="phone"
                value="+1 234 567 890"
                readOnly
                className="w-full border border-input rounded px-3 py-2 bg-background cursor-not-allowed"
              />
            </div>
            <div>
              <label
                htmlFor="customerEmail"
                className="block text-sm font-medium mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="customerEmail"
                name="email"
                value="john.doe@example.com"
                readOnly
                className="w-full border border-input rounded px-3 py-2 bg-background cursor-not-allowed"
              />
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="bg-card rounded shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
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
                value={filters.fromDate}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                value={filters.toDate}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label
                htmlFor="invoiceNo"
                className="block text-sm font-medium mb-1"
              >
                Invoice No
              </label>
              <input
                type="text"
                id="invoiceNo"
                name="invoiceNo"
                value={filters.invoiceNo}
                onChange={handleInputChange}
                placeholder="Invoice No"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label
                htmlFor="paymentType"
                className="block text-sm font-medium mb-1"
              >
                Payment Type
              </label>
              <select
                id="paymentType"
                name="paymentType"
                value={filters.paymentType}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {["All", "Cash", "Card", "Cheque", "Bank Transfer"].map((pt) => (
                  <option key={pt} value={pt}>
                    {pt}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-4 flex flex-wrap gap-3 pt-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <i className="fa fa-filter fa-light" aria-hidden="true"></i> Filter
              </button>
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
                <i className="fa fa-file-pdf-o fa-light" aria-hidden="true"></i> Report
              </button>
            </div>
          </form>
        </section>

        {/* Transactions Table Section */}
        <section className="bg-card rounded shadow py-6">
          <h2 className="text-lg font-semibold mb-4 px-6">Transactions</h2>
          <div className="overflow-x-auto px-6">
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
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Payment Type
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                    Debit
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                    Credit
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center px-4 py-6 text-muted-foreground italic"
                    >
                      No transactions found.
                    </td>
                  </tr>
                )}
                {paginatedTransactions.map((t, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {t.date}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {t.invoiceNo}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {t.description}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {t.paymentType}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">
                      {t.debit === 0 ? "" : t.debit.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">
                      {t.credit === 0 ? "" : t.credit.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right font-semibold">
                      {t.balance.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 px-6">
            <Pagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredTransactions.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={setItemsPerPage}
            />
          </div>
        </section>
      </div>
    </>
  );
}