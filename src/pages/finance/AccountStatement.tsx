import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";

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
    const response = await apiService.get<{
      status: { code: string; description: string };
      result: AccountStatementItem[];
    }>("AccountStatement");
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

  const handleFilterChange = (
    param: React.ChangeEvent<HTMLInputElement> | string
  ) => {
    if (typeof param === "string") {
      setFilters((prev) => ({ ...prev, query: param }));
      setCurrentPage(1); // Reset to first page on query change
    } else {
      const { name, value } = param.target;
      setFilters((prev) => ({ ...prev, [name]: value }));
      setCurrentPage(1); // Reset to first page on filter change
    }
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
    {
      key: "debit",
      label: "Debit",
      align: "right",
      render: (v) => (v > 0 ? `₹${v.toFixed(2)}` : "-"),
    },
    {
      key: "credit",
      label: "Credit",
      align: "right",
      render: (v) => (v > 0 ? `₹${v.toFixed(2)}` : "-"),
    },
    {
      key: "balance",
      label: "Balance",
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
          placeholder="Customer"
          onSearch={handleFilterChange}
        />
      </div>
      <div className="flex justify-end gap-2">
        <SearchInput
          className=""
          type="date"
          id="fromDate"
          value={filters.fromDate}
          placeholder="Customer"
          onSearch={handleFilterChange}
        />
        <SearchInput
          className=""
          type="date"
          id="toDate"
          value={filters.toDate}
          onSearch={handleFilterChange}
        />
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Account Statement"
      description="View and filter account statement records."
      
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
      loading={loading}
    />
  );
};

export default AccountStatement;
