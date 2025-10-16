import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

interface SaleRecord {
  date: string;
  invoice: string;
  customer: string;
  product: string;
  qty: number;
  price: number;
  discount: number;
  tax: number;
  total: number;
}

const SalesReport: React.FC = () => {
  const [data, setData] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<SaleRecord[]>("SalesReport");
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

  // Filters states
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [customer, setCustomer] = useState<string>("");
  const [product, setProduct] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filtered data based on inputs
  const filteredData = useMemo(() => {
    return data.filter((record) => {
      if (startDate && record.date < startDate) return false;
      if (endDate && record.date > endDate) return false;
      if (customer && !record.customer.toLowerCase().includes(customer.toLowerCase()))
        return false;
      if (product && !record.product.toLowerCase().includes(product.toLowerCase()))
        return false;
      return true;
    });
  }, [startDate, endDate, customer, product, data]);

  // Pagination calculations
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Reset page when filters or pageSize change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate, customer, product, itemsPerPage]);

  // Handlers for buttons
  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setCustomer("");
    setProduct("");
    setItemsPerPage(5);
    setCurrentPage(1);
  };

  const handleSave = () => {
    alert("Save functionality is not implemented in this demo.");
  };

  const handleReport = () => {
    alert("Report generation is not implemented in this demo.");
  };

  return (
    <div className="min-h-screen bg-background">
      
      <h1 className="text-lg font-semibold mb-6">Sales Report</h1>

      {/* Filters Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="grid grid-cols-1 md:grid-cols-5 gap-6"
        >
          {/* Date From */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium mb-1">
              Date From
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Date To */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium mb-1">
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

          {/* Customer */}
          <div>
            <label htmlFor="customer" className="block text-sm font-medium mb-1">
              Customer
            </label>
            <input
              type="text"
              id="customer"
              placeholder="Customer Name"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Product */}
          <div>
            <label htmlFor="product" className="block text-sm font-medium mb-1">
              Product
            </label>
            <input
              type="text"
              id="product"
              placeholder="Product Name"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Page Size */}
          <div>
            <label htmlFor="itemsPerPage" className="block text-sm font-medium mb-1">
              Items per page
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {[5, 10, 15].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleReport}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
          </button>
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
          </button>
        </div>
      </section>

      {/* Sales Table Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Invoice</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Product</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Qty</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Discount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tax</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Total</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center px-4 py-6 text-muted-foreground italic">
                    No records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((record, idx) => (
                  <tr
                    key={`${record.invoice}-${idx}`}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">{record.date}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{record.invoice}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{record.customer}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{record.product}</td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">{record.qty}</td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">${record.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">${record.discount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">${record.tax.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">${record.total.toFixed(2)}</td>
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
    </div>
  );
};

export default SalesReport;