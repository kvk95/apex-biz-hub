// src\pages\reports\AccountStatement.tsx

import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";

interface AccountStatementItem {
  id: number; // Assumed for uniqueness
  date: string;
  invoiceNo: string;
  description: string;
  paymentType: string;
  debit: number;
  credit: number;
  balance: number;
  customer?: string; // Optional, based on previous filter logic
}

const AccountStatement: React.FC = () => {
  const [data, setData] = useState<AccountStatementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    fromDate: "2023-01-01",
    toDate: "2023-12-31",
    customer: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<{ status: { code: string; description: string }; result: AccountStatementItem[] }>("AccountStatement");
    if (response.status.code === "S") {
      setData(response.result || []);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  const filteredTransactions = useMemo(() => {
    return data.filter((t) => {
      const tDate = new Date(t.date);
      const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
      const toDate = filters.toDate ? new Date(filters.toDate) : null;
      if (fromDate && tDate < fromDate) return false;
      if (toDate && tDate > toDate) return false;
      if (filters.customer && t.customer !== filters.customer) return false;
      return true;
    });
  }, [filters, data]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleRefresh = () => {
    setFilters({
      fromDate: "2023-01-01",
      toDate: "2023-12-31",
      customer: "John Doe",
    });
    setCurrentPage(1);
    loadData(); // Reload data
  };

  const handleReport = () => {
    alert("Report generation is not implemented in this demo.");
  };

  const columns: Column[] = [
    { key: "date", label: "Date", align: "left" },
    { key: "invoiceNo", label: "Invoice No", align: "left" },
    { key: "description", label: "Description", align: "left" },
    { key: "paymentType", label: "Payment Type", align: "left" },
    { key: "debit", label: "Debit", align: "right", render: (v) => (v > 0 ? `₹${v.toFixed(2)}` : "-") },
    { key: "credit", label: "Credit", align: "right", render: (v) => (v > 0 ? `₹${v.toFixed(2)}` : "-") },
    { key: "balance", label: "Balance", align: "right", render: (v) => `₹${v.toFixed(2)}` },
  ];

  const customFilters = () => (
    <form onSubmit={(e) => { e.preventDefault(); setCurrentPage(1); }} className="flex flex-wrap gap-2 mb-4 items-center">
      <input
        type="date"
        name="fromDate"
        value={filters.fromDate}
        onChange={handleFilterChange}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <input
        type="date"
        name="toDate"
        value={filters.toDate}
        onChange={handleFilterChange}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <input
        type="text"
        name="customer"
        value={filters.customer}
        onChange={handleFilterChange}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="Customer"
      />
    </form>
  );

  return (
    <PageBase1
      title="Account Statement"
      description="View and filter account statement records."
      icon="fa fa-file-invoice-dollar"
      onRefresh={handleRefresh}
      onReport={handleReport}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredTransactions.length} // Corrected to use filteredTransactions
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData} // Use paginatedData for display
      customFilters={customFilters}
    />
  );
};

export default AccountStatement;