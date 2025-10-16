import React, { useMemo, useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const suppliers = [
  { value: "", label: "Select Supplier" },
  { value: "Supplier X", label: "Supplier X" },
  { value: "Supplier Y", label: "Supplier Y" },
  { value: "Supplier Z", label: "Supplier Z" },
];

const products = [
  { value: "", label: "Select Product" },
  { value: "Product A", label: "Product A" },
  { value: "Product B", label: "Product B" },
  { value: "Product C", label: "Product C" },
  { value: "Product D", label: "Product D" },
  { value: "Product E", label: "Product E" },
  { value: "Product F", label: "Product F" },
  { value: "Product G", label: "Product G" },
  { value: "Product H", label: "Product H" },
  { value: "Product I", label: "Product I" },
  { value: "Product J", label: "Product J" },
  { value: "Product K", label: "Product K" },
  { value: "Product L", label: "Product L" },
];

const StockHistory: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("StockHistory");
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
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal editing state (no edit icon/button exists, so no modal needed)
  // (No edit modal or edit controls added as per instructions)

  // Filtered data memoized
  const filteredData = useMemo(() => {
    return data.filter((item: any) => {
      const itemDate = new Date(item.date);
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;

      if (fromDate && itemDate < fromDate) return false;
      if (toDate && itemDate > toDate) return false;
      if (selectedSupplier && item.supplierName !== selectedSupplier)
        return false;
      if (selectedProduct && item.productName !== selectedProduct) return false;
      return true;
    });
  }, [data, dateFrom, dateTo, selectedSupplier, selectedProduct]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [dateFrom, dateTo, selectedSupplier, selectedProduct]);

  // Handlers
  const handleReset = () => {
    setDateFrom("");
    setDateTo("");
    setSelectedSupplier("");
    setSelectedProduct("");
  };

  // Clear button replaces Refresh button
  const handleClear = () => {
    handleReset();
    setCurrentPage(1);
  };

  const handleReport = () => {
    // For demo, alert report generation
    alert("Report generated for current filtered data.");
  };

  // Paginated data using Pagination component logic
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <h1 className="text-lg font-semibold mb-6">Stock History</h1>

      {/* Filters Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end"
        >
          {/* Date From */}
          <div>
            <label
              htmlFor="dateFrom"
              className="block text-sm font-medium mb-1 text-muted-foreground"
            >
              Date From
            </label>
            <input
              type="date"
              id="dateFrom"
              name="dateFrom"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Date To */}
          <div>
            <label
              htmlFor="dateTo"
              className="block text-sm font-medium mb-1 text-muted-foreground"
            >
              Date To
            </label>
            <input
              type="date"
              id="dateTo"
              name="dateTo"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Supplier */}
          <div>
            <label
              htmlFor="supplier"
              className="block text-sm font-medium mb-1 text-muted-foreground"
            >
              Supplier
            </label>
            <select
              id="supplier"
              name="supplier"
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {suppliers.map((sup) => (
                <option key={sup.value} value={sup.value}>
                  {sup.label}
                </option>
              ))}
            </select>
          </div>

          {/* Product */}
          <div>
            <label
              htmlFor="product"
              className="block text-sm font-medium mb-1 text-muted-foreground"
            >
              Product
            </label>
            <select
              id="product"
              name="product"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {products.map((prod) => (
                <option key={prod.value} value={prod.value}>
                  {prod.label}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i
                className="fa fa-magnifying-glass fa-light"
                aria-hidden="true"
              ></i>{" "}
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-rotate-left fa-light" aria-hidden="true"></i>{" "}
              Reset
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
              <i
                className="fa fa-file-chart-column fa-light"
                aria-hidden="true"
              ></i>{" "}
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
                  Product Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Product Code
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Supplier Name
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Purchase Qty
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Purchase Return Qty
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Sales Qty
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Sales Return Qty
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Stock Qty
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Unit Price
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Total Price
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => (
                  <tr
                    key={`${item.productCode}-${item.date}-${idx}`}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                      {item.productName}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                      {item.productCode}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                      {item.supplierName}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right whitespace-nowrap">
                      {item.purchaseQty}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right whitespace-nowrap">
                      {item.purchaseReturnQty}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right whitespace-nowrap">
                      {item.salesQty}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right whitespace-nowrap">
                      {item.salesReturnQty}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right whitespace-nowrap">
                      {item.stockQty}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right whitespace-nowrap">
                      ${item.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right whitespace-nowrap">
                      ${item.totalPrice.toFixed(2)}
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
    </div>
  );
};

export default StockHistory;
