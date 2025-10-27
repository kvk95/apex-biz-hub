// src\pages\reports\TrialBalance.tsx

import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";

// Use the provided constant
const accountsOptions = [
  "Cash",
  "Accounts Receivable",
  "Inventory",
  "Prepaid Expenses",
  "Accounts Payable",
  "Notes Payable",
  "Owner's Equity",
  "Sales Revenue",
  "Service Revenue",
  "Salaries Expense",
  "Rent Expense",
  "Utilities Expense",
  "Depreciation Expense",
  "Interest Expense",
  "Miscellaneous Expense",
] as const;

interface TrialBalanceItem {
  id: number; // Assumed for uniqueness
  accountName: string;
  debit: number;
  credit: number;
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: TrialBalanceItem) => JSX.Element;
  align?: "left" | "center" | "right";
}

const TrialBalance: React.FC = () => {
  const [data, setData] = useState<TrialBalanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [accountFilter, setAccountFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<TrialBalanceItem[]>("TrialBalance");
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
      const matchesAccount = accountFilter === "" || item.accountName === accountFilter;
      const matchesSearch = searchTerm === "" || item.accountName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesAccount && matchesSearch;
    });
  }, [accountFilter, searchTerm, data]);

  const totalDebit = useMemo(() => {
    return filteredData.reduce((acc, cur) => acc + (cur.debit || 0), 0);
  }, [filteredData]);

  const totalCredit = useMemo(() => {
    return filteredData.reduce((acc, cur) => acc + (cur.credit || 0), 0);
  }, [filteredData]);

  const handleFilterChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleFilterChangeAccount = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAccountFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setAccountFilter("");
    setCurrentPage(1);
    loadData(); // Reload data
  };

  const handleReport = () => {
    alert("Report generated (placeholder)");
  };

  const columns: Column[] = [
    { key: "accountName", label: "Account Name", align: "left" },
    { key: "debit", label: "Debit", align: "right", render: (v) => (v > 0 ? `₹${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "-") },
    { key: "credit", label: "Credit", align: "right", render: (v) => (v > 0 ? `₹${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "-") },
  ];

  const customFilters = () => (
    <form onSubmit={(e) => { e.preventDefault(); setCurrentPage(1); }} className="flex flex-wrap gap-2 mb-4 items-center">
      <input
        type="text"
        value={searchTerm}
        onChange={handleFilterChangeSearch}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="Search account"
      />
      <select
        value={accountFilter}
        onChange={handleFilterChangeAccount}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">All Accounts</option>
        {accountsOptions.map((acc) => (
          <option key={acc} value={acc}>
            {acc}
          </option>
        ))}
      </select>
    </form>
  );

  return (
    <PageBase1
      title="Trial Balance"
      description="View Your Balance Sheet."
      icon="fa fa-file-contract"
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
        <tfoot className="bg-muted font-semibold text-foreground">
          <tr>
            <td className="px-4 py-3 text-right">Total</td>
            <td className="px-4 py-3 text-right">{`₹${totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
            <td className="px-4 py-3 text-right">{`₹${totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
          </tr>
        </tfoot>
      )}
    />
  );
};

export default TrialBalance;