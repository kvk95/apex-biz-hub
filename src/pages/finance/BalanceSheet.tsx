import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { PAYMENT_TYPES } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";

interface BalanceSheetItem {
  id: number;
  accountName: string;
  debit: number;
  credit: number;
  paymentMethod: string;
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
      const matchesPaymentMethod =
        paymentMethod !== "All" && item.paymentMethod // Assuming paymentMethod exists; adjust if not
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

  const handleFilterChangePaymentMethod = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
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
    {
      key: "debit",
      label: "Debit",
      align: "right",
      render: (v) => (v > 0 ? `₹${v.toLocaleString()}` : "-"),
    },
    {
      key: "credit",
      label: "Credit",
      align: "right",
      render: (v) => (v > 0 ? `₹${v.toLocaleString()}` : "-"),
    },
  ];

  const customFilters = () => (
    <div className="grid grid-cols-2 w-full justify-stretch px-3">
      <div className="flex justify-start  gap-2">
        <SearchInput
          className=""
          value={search}
          placeholder="Search account"
          onSearch={(query) => {
            setSearch(query);
            setCurrentPage(1);
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <select
          value={paymentMethod}
          onChange={handleFilterChangePaymentMethod}
          className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {PAYMENT_TYPES.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </div>
    </div>
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
      loading={loading}
    />
  );
};

export default BalanceSheet;
