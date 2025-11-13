import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";

const YEARS = ["2025", "2024", "2023", "2022", "2021", "2020"]; // Replace with YEARS from constants.ts if available
const BRANCHES = [
  { value: "all", label: "All Branches" },
  { value: "ny", label: "New York" },
  { value: "la", label: "Los Angeles" },
  { value: "chi", label: "Chicago" },
]; // Replace with BRANCHES from constants.ts if available

interface AnnualRecord {
  id: number;
  customer: string;
  orders: number;
  totalSpent: number;
  lastPurchase: string;
}

export default function AnnualReport() {
  const [data, setData] = useState<AnnualRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState("2025");
  const [branch, setBranch] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<AnnualRecord[]>("AnnualReport");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("AnnualReport loadData:", { data: response.result });
  };

  const filteredData = useMemo(() => {
    const result = data.filter((item) => {
      const itemYear = new Date(item.lastPurchase).getFullYear().toString();
      const matchYear = year !== "" ? itemYear === year : true;
      const matchBranch = branch !== "all" ? item.branch === branch : true;
      return matchYear && matchBranch;
    });
    console.log("AnnualReport filteredData:", result, { year, branch });
    return result;
  }, [data, year, branch]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("AnnualReport paginatedData:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
      totalItems: filteredData.length,
    });
    return result;
  }, [filteredData, currentPage, itemsPerPage]);

  const handleClear = () => {
    setYear("2025");
    setBranch("all");
    setCurrentPage(1);
    loadData();
    console.log("AnnualReport handleClear");
  };

  const handleReport = () => {
    alert("Annual Report:\n\n" + JSON.stringify(filteredData, null, 2));
    console.log("AnnualReport handleReport:", { filteredData });
  };

  const columns: Column[] = [
    {
      key: "customer",
      label: "Customer",
      align: "left",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "orders", label: "Orders", align: "left" },
    {
      key: "totalSpent",
      label: "Total Spent",
      align: "left",
      render: (value) =>
        `₹${value.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
    },
    {
      key: "lastPurchase",
      label: "Last Purchase",
      align: "left",
      render: (value) =>
        new Date(value).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
  ];

  const tableFooter = () => {
    const totals = filteredData.reduce(
      (acc, item) => ({
        orders: acc.orders + item.orders,
        totalSpent: acc.totalSpent + item.totalSpent,
      }),
      { orders: 0, totalSpent: 0 }
    );

    return (
      <tfoot className="bg-muted font-semibold text-foreground">
        <tr>
          <td className="px-4 py-3 text-left">Totals</td>
          <td className="px-4 py-3 text-left">{totals.orders}</td>
          <td className="px-4 py-3 text-left">
            ₹
            {totals.totalSpent.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </td>
          <td className="px-4 py-3 text-left"></td>
        </tr>
      </tfoot>
    );
  };

  const customFilters = () => (
    <div className="grid grid-cols-2 w-full justify-stretch px-3">
      <div className="flex justify-start  gap-2"></div>
      <div className="flex justify-end gap-2">
        <select
          value={year}
          onChange={(e) => {
            setYear(e.target.value);
            setCurrentPage(1);
            console.log("AnnualReport handleYearChange:", {
              year: e.target.value,
            });
          }}
          className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Filter by year"
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <select
          value={branch}
          onChange={(e) => {
            setBranch(e.target.value);
            setCurrentPage(1);
            console.log("AnnualReport handleBranchChange:", {
              branch: e.target.value,
            });
          }}
          className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Filter by branch"
        >
          {BRANCHES.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Annual Report"
      description="View and filter annual customer records."
      icon="fa fa-calendar-alt"
      onRefresh={handleClear}
      onReport={handleReport}
      search=""
      onSearchChange={() => {}} // No text-based search field
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      tableFooter={tableFooter}
      customFilters={customFilters} loading={loading}
    />
  );
}
