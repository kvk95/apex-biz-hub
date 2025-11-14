import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [customer, setCustomer] = useState<string>("");
  const [product, setProduct] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

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

  const filteredData = useMemo(() => {
    return data.filter((record) => {
      if (startDate && record.date < startDate) return false;
      if (endDate && record.date > endDate) return false;
      if (
        customer &&
        !record.customer.toLowerCase().includes(customer.toLowerCase())
      )
        return false;
      if (
        product &&
        !record.product.toLowerCase().includes(product.toLowerCase())
      )
        return false;
      return true;
    });
  }, [startDate, endDate, customer, product, data]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate, customer, product, itemsPerPage]);

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

  const columns: Column[] = [
    { key: "date", label: "Date", align: "left" },
    { key: "invoice", label: "Invoice", align: "left" },
    { key: "customer", label: "Customer", align: "left" },
    { key: "product", label: "Product", align: "left" },
    { key: "qty", label: "Qty", align: "right", render: (v) => v.toString() },
    {
      key: "price",
      label: "Price",
      align: "right",
      render: (v) => `₹${v.toFixed(2)}`,
    },
    {
      key: "discount",
      label: "Discount",
      align: "right",
      render: (v) => `₹${v.toFixed(2)}`,
    },
    {
      key: "tax",
      label: "Tax",
      align: "right",
      render: (v) => `₹${v.toFixed(2)}`,
    },
    {
      key: "total",
      label: "Total",
      align: "right",
      render: (v) => `₹${v.toFixed(2)}`,
    },
  ];

  const customFilters = () => (
    <div className="grid grid-cols-2 w-full justify-stretch px-3">
      <div className="flex justify-start gap-2">
        <input
          type="text"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Customer"
        />
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Product"
        />
      </div>
      <div className="flex justify-end gap-2">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-wrap gap-2 items-center"
        >
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {[5, 10, 15].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </form>
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Sales Report"
      description="View and filter sales report records."
      
      onRefresh={handleClear}
      onReport={handleReport}
      onSave={handleSave}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      customFilters={customFilters} loading={loading}
    />
  );
};

export default SalesReport;
