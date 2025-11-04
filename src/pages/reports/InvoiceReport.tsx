import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import {
  PAYMENT_STATUSES,
  PAYMENT_TYPES,
  BRANDS,
} from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";

interface InvoiceItem {
  id: number; // Assumed for uniqueness
  invoiceNo: string;
  customer: string;
  date: string;
  dueDate: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
}

const InvoiceReport: React.FC = () => {
  const [data, setData] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    fromDate: "2022-01-01",
    toDate: "2022-12-31",
    customer: "",
    invoiceStatus: "All",
    paymentStatus: "All",
    paymentMethod: "All",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<InvoiceItem[]>("InvoiceReport");
    if (response.status.code === "S") {
      setData(response.result); // Normalize API response
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  const filteredInvoices = useMemo(() => {
    return data.filter((inv) => {
      const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
      const toDate = filters.toDate ? new Date(filters.toDate) : null;
      const invoiceDate = new Date(inv.date);

      if (fromDate && invoiceDate < fromDate) return false;
      if (toDate && invoiceDate > toDate) return false;

      if (filters.customer && filters.customer !== "All") {
        if (inv.customer !== filters.customer) return false;
      }

      if (filters.invoiceStatus && filters.invoiceStatus !== "All") {
        if (inv.status !== filters.invoiceStatus) return false;
      }

      if (filters.paymentStatus && filters.paymentStatus !== "All") {
        if (inv.paymentStatus !== filters.paymentStatus) return false;
      }

      if (filters.paymentMethod && filters.paymentMethod !== "All") {
        if (inv.paymentMethod !== filters.paymentMethod) return false;
      }

      return true;
    });
  }, [filters, data]);

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

  const handleRefresh = () => {
    setFilters({
      fromDate: "2022-01-01",
      toDate: "2022-12-31",
      customer: "",
      invoiceStatus: "All",
      paymentStatus: "All",
      paymentMethod: "All",
    });
    setCurrentPage(1);
    loadData(); // Reload data
  };

  const handleReport = () => {
    alert("Report generated for current filter selection.");
  };

  const columns: Column[] = [
    { key: "invoiceNo", label: "Invoice No", align: "left" },
    { key: "customer", label: "Customer", align: "left" },
    { key: "date", label: "Date", align: "left" },
    { key: "dueDate", label: "Due Date", align: "left" },
    {
      key: "status",
      label: "Invoice Status",
      align: "center",
      render: renderStatusBadge,
    },
    {
      key: "paymentStatus",
      label: "Payment Status",
      align: "center",
      render: renderStatusBadge,
    },
    { key: "paymentMethod", label: "Payment Method", align: "left" },
    {
      key: "total",
      label: "Total",
      align: "right",
      render: (v) => `₹${v.toFixed(2)}`,
    },
  ];

  const customFilters = () => (
    <div className="grid grid-cols-2 w-full justify-stretch px-3">
      <div className="flex justify-start  gap-2">
        <SearchInput
          className=""
          value={filters.customer}
          placeholder="Customer Name"
          onSearch={(query) => {
            filters.customer = query;
            setCurrentPage(1);
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          className="flex gap-2 "
        >
          <select
            name="invoiceStatus"
            value={filters.invoiceStatus}
            onChange={handleFilterChange}
            className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {PAYMENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            name="paymentStatus"
            value={filters.paymentStatus}
            onChange={handleFilterChange}
            className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {PAYMENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            name="paymentMethod"
            value={filters.paymentMethod}
            onChange={handleFilterChange}
            className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {PAYMENT_TYPES.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleFilterChange}
            className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleFilterChange}
            className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </form>
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Invoice Report"
      description="View and filter invoice report records."
      icon="fa fa-file-invoice"
      onRefresh={handleRefresh}
      onReport={handleReport}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredInvoices.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={filteredInvoices} // Pass filteredInvoices for pagination by PageBase1
      customFilters={customFilters}
    />
  );
};

export default InvoiceReport;
