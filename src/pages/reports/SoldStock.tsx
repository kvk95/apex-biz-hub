import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { CATEGORIES } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";

interface SoldStockItem {
  invoiceId: string;
  stockId: string;
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customerName: string;
  date: string;
}

const SoldStock: React.FC = () => {
  const [data, setData] = useState<SoldStockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [invoiceIdFilter, setInvoiceIdFilter] = useState("");
  const [stockIdFilter, setStockIdFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [customerNameFilter, setCustomerNameFilter] = useState("");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<SoldStockItem[]>("SoldStock");
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
      if (
        invoiceIdFilter &&
        !item.invoiceId.toLowerCase().includes(invoiceIdFilter.toLowerCase())
      )
        return false;
      if (
        stockIdFilter &&
        !item.stockId.toLowerCase().includes(stockIdFilter.toLowerCase())
      )
        return false;
      if (categoryFilter !== "All" && item.category !== categoryFilter)
        return false;
      if (
        customerNameFilter &&
        !item.customerName
          .toLowerCase()
          .includes(customerNameFilter.toLowerCase())
      )
        return false;
      if (dateFromFilter && item.date < dateFromFilter) return false;
      if (dateToFilter && item.date > dateToFilter) return false;
      return true;
    });
  }, [
    data,
    invoiceIdFilter,
    stockIdFilter,
    categoryFilter,
    customerNameFilter,
    dateFromFilter,
    dateToFilter,
  ]);

  const handleResetFilters = () => {
    setInvoiceIdFilter("");
    setStockIdFilter("");
    setCategoryFilter("All");
    setCustomerNameFilter("");
    setDateFromFilter("");
    setDateToFilter("");
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    handleResetFilters(); // Reset filters and page on refresh
    loadData(); // Reload data
  };

  const handleReport = () => {
    alert("Report generated for current filtered data.");
  };

  const columns: Column[] = [
    { key: "invoiceId", label: "Invoice ID", align: "left" },
    { key: "stockId", label: "Stock ID", align: "left" },
    { key: "productName", label: "Product Name", align: "left" },
    { key: "category", label: "Category", align: "left" },
    {
      key: "quantity",
      label: "Quantity",
      align: "right",
      render: (v) => v.toString(),
    },
    {
      key: "unitPrice",
      label: "Unit Price",
      align: "right",
      render: (v) => `₹${v.toFixed(2)}`,
    },
    {
      key: "totalPrice",
      label: "Total Price",
      align: "right",
      render: (v) => `₹${v.toFixed(2)}`,
    },
    { key: "customerName", label: "Customer Name", align: "left" },
    { key: "date", label: "Date", align: "left" },
  ];

  const customFilters = () => (
    <div className="grid grid-cols-2 w-full justify-stretch px-3">
      <div className="flex justify-start  gap-2">
        <SearchInput
          className=""
          value={invoiceIdFilter}
          placeholder="Invoice ID"
          onSearch={(query) => {
            setInvoiceIdFilter(query);
          }}
        />
        <SearchInput
          className=""
          value={stockIdFilter}
          placeholder="Stock ID"
          onSearch={(query) => {
            setStockIdFilter(query);
          }}
        />
        <SearchInput
          className=""
          value={customerNameFilter}
          placeholder="Customer Name"
          onSearch={(query) => {
            setCustomerNameFilter(query);
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          className="flex  gap-2  "
        >
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dateFromFilter}
            onChange={(e) => setDateFromFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="date"
            value={dateToFilter}
            onChange={(e) => setDateToFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </form>
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Sold Stock"
      description="View and filter sold stock records."
      icon="fa fa-box-open"
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

export default SoldStock;
