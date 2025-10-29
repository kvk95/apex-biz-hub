// src\pages\reports\BalanceSheet.tsx

import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";

// Placeholder constant (to be adjusted based on actual data or requirements)
export const PAYMENT_METHODS = ["All", "Cash", "Credit Card", "Cheque", "Bank Transfer"] as const;

interface BalanceSheetItem {
  id: number;
  accountName: string;
  debit: number;
  credit: number;
  paymentMethod:string;
}

const BalanceSheet: React.FC = () => {
  const [data, setData] = useState<BalanceSheetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState(""); // Interpreted as "Search" for accountName
  const [paymentMethod, setPaymentMethod] = useState("All"); // Added for "Payment methods"

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
        setLoading(true);
        const response = await apiService.get<BalanceSheetItem[]>("BalanceSheet");
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
      const matchesSearch = search
        ? item.accountName.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesPaymentMethod = paymentMethod !== "All" && item.paymentMethod // Assuming paymentMethod exists; adjust if not
        ? item.paymentMethod === paymentMethod
        : true;
      return matchesSearch && matchesPaymentMethod;
    });
  }, [data, search, paymentMethod]);

  const totalDebit = useMemo(() => {
    return data.reduce((sum, item) => sum + (item.debit || 0), 0);
  }, [data]);

  const totalCredit = useMemo(() => {
    return data.reduce((sum, item) => sum + (item.credit || 0), 0);
  }, [data]);

  const handleFilterChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleFilterChangePaymentMethod = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleRefresh = () => {
    setSearch("");
    setPaymentMethod("All");
    setCurrentPage(1);
    loadData(); // Reload data
  };

  const handleReport = () => {
    alert("Report generated");
  };

  const columns: Column[] = [
    { key: "accountName", label: "Account Name", align: "left" },
    { key: "debit", label: "Debit", align: "right", render: (v) => (v > 0 ? `₹${v.toLocaleString()}` : "-") },
    { key: "credit", label: "Credit", align: "right", render: (v) => (v > 0 ? `₹${v.toLocaleString()}` : "-") },
  ];

  const customFilters = () => (
    <form onSubmit={(e) => { e.preventDefault(); setCurrentPage(1); }} className="flex flex-wrap gap-2 mb-4 items-center">
      <input
        type="text"
        value={search}
        onChange={handleFilterChangeSearch}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="Search account"
      />
      <select
        value={paymentMethod}
        onChange={handleFilterChangePaymentMethod}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {PAYMENT_METHODS.map((method) => (
          <option key={method} value={method}>
            {method}
          </option>
        ))}
      </select>
    </form>
  );

  return (
    <PageBase1
      title="Balance Sheet"
      description="View and filter balance sheet records."
      icon="fa fa-balance-scale-left"
      onRefresh={handleRefresh}
      onReport={handleReport}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={filteredData} // Pass filteredData for pagination by PageBase1
      tableFooter={() => (
        <tfoot className="bg-muted/20 font-semibold text-foreground">
          <tr>
            <td className="px-4 py-3 text-right">Total</td>
            <td className="px-4 py-3 text-right">{`₹${totalDebit.toLocaleString()}`}</td>
            <td className="px-4 py-3 text-right">{`₹${totalCredit.toLocaleString()}`}</td>
          </tr>
        </tfoot>
      )}
    />
  );
};

export default BalanceSheet;