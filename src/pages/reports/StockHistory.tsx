import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";

interface StockHistoryItem {
  date: string;
  productName: string;
  productCode: string;
  supplierName: string;
  purchaseQty: number;
  purchaseReturnQty: number;
  salesQty: number;
  salesReturnQty: number;
  stockQty: number;
  unitPrice: number;
  totalPrice: number;
}
 
const SUPPLIERS = [
  { value: "", label: "Select Supplier" },
  { value: "Supplier X", label: "Supplier X" },
  { value: "Supplier Y", label: "Supplier Y" },
  { value: "Supplier Z", label: "Supplier Z" },
];

const PRODUCTS = [
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
  const [data, setData] = useState<StockHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<StockHistoryItem[]>("StockHistory");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;

      if (fromDate && itemDate < fromDate) return false;
      if (toDate && itemDate > toDate) return false;
      if (selectedSupplier && item.supplierName !== selectedSupplier) return false;
      if (selectedProduct && item.productName !== selectedProduct) return false;
      return true;
    });
  }, [data, dateFrom, dateTo, selectedSupplier, selectedProduct]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [dateFrom, dateTo, selectedSupplier, selectedProduct]);

  const handleReset = () => {
    setDateFrom("");
    setDateTo("");
    setSelectedSupplier("");
    setSelectedProduct("");
  };

  const handleRefresh = () => {
    handleReset(); // Reset filters
    setCurrentPage(1); // Reset page
    loadData(); // Reload data
  };

  const handleReport = () => {
    alert("Report generated for current filtered data.");
  };

  const columns: Column[] = [
    { key: "date", label: "Date", align: "left" },
    { key: "productName", label: "Product Name", align: "left" },
    { key: "productCode", label: "Product Code", align: "left" },
    { key: "supplierName", label: "Supplier Name", align: "left" },
    { key: "purchaseQty", label: "Purchase Qty", align: "right", render: (v) => v.toString() },
    { key: "purchaseReturnQty", label: "Purchase Return Qty", align: "right", render: (v) => v.toString() },
    { key: "salesQty", label: "Sales Qty", align: "right", render: (v) => v.toString() },
    { key: "salesReturnQty", label: "Sales Return Qty", align: "right", render: (v) => v.toString() },
    { key: "stockQty", label: "Stock Qty", align: "right", render: (v) => v.toString() },
    { key: "unitPrice", label: "Unit Price", align: "right", render: (v) => `₹${v.toFixed(2)}` },
    { key: "totalPrice", label: "Total Price", align: "right", render: (v) => `₹${v.toFixed(2)}` },
  ];

  const customFilters = () => (
    <form onSubmit={(e) => { e.preventDefault(); setCurrentPage(1); }} className="flex flex-wrap gap-2 mb-4 items-center">
      <input
        type="date"
        value={dateFrom}
        onChange={(e) => setDateFrom(e.target.value)}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <input
        type="date"
        value={dateTo}
        onChange={(e) => setDateTo(e.target.value)}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <select
        value={selectedSupplier}
        onChange={(e) => setSelectedSupplier(e.target.value)}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {SUPPLIERS.map((sup) => (
          <option key={sup.value} value={sup.value}>
            {sup.label}
          </option>
        ))}
      </select>
      <select
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {PRODUCTS.map((prod) => (
          <option key={prod.value} value={prod.value}>
            {prod.label}
          </option>
        ))}
      </select>
    </form>
  );

  return (
    <PageBase1
      title="Stock History"
      description="View and filter stock history records."
      icon="fa fa-history"
      onRefresh={handleRefresh}
      onReport={handleReport}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={filteredData} // Pass filteredData for pagination by PageBase1
      customFilters={customFilters}
    />
  );
};

export default StockHistory;