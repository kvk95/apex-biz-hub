import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";

interface ProfitLossRecord {
  id: string;
  date: string;
  totalSales: number;
  totalPurchase: number;
  expense: number;
  profitLoss: number;
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any, idx?: number) => JSX.Element;
  align?: "left" | "center" | "right";
}

export default function ProfitLoss() {
  const [data, setData] = useState<ProfitLossRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<ProfitLossRecord[]>("ProfitLoss");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("ProfitLoss loadData:", { data: response.result });
  };

  const filteredData = useMemo(() => {
    const result = data.filter((item) => {
      const itemDate = new Date(item.date);
      const start = fromDate ? new Date(fromDate) : null;
      const end = toDate ? new Date(toDate) : null;
      const matchStartDate = start ? itemDate >= start : true;
      const matchEndDate = end ? itemDate <= end : true;
      return matchStartDate && matchEndDate;
    });
    console.log("ProfitLoss filteredData:", result, { fromDate, toDate });
    return result;
  }, [data, fromDate, toDate]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("ProfitLoss paginatedData:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
      totalItems: filteredData.length,
    });
    return result;
  }, [filteredData, currentPage, itemsPerPage]);

  const handleClear = () => {
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
    loadData();
    console.log("ProfitLoss handleClear");
  };

  const handleReport = () => {
    alert("Profit Loss Report:\n\n" + JSON.stringify(filteredData, null, 2));
    console.log("ProfitLoss handleReport:", { filteredData });
  };

  const columns: Column[] = [
    {
      key: "date",
      label: "Date",
      align: "left",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      key: "totalSales",
      label: "Total Sales",
      align: "right",
      render: (value) => `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      key: "totalPurchase",
      label: "Total Purchase",
      align: "right",
      render: (value) => `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      key: "expense",
      label: "Expense",
      align: "right",
      render: (value) => `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      key: "profitLoss",
      label: "Profit / Loss",
      align: "right",
      render: (value) => (
        <span className={`font-semibold ${value >= 0 ? "text-green-600" : "text-red-600"}`}>
          ₹{Math.abs(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
    },
  ];

  const tableFooter = () => {
    const totals = filteredData.reduce(
      (acc, item) => ({
        totalSales: acc.totalSales + item.totalSales,
        totalPurchase: acc.totalPurchase + item.totalPurchase,
        expense: acc.expense + item.expense,
        profitLoss: acc.profitLoss + item.profitLoss,
      }),
      { totalSales: 0, totalPurchase: 0, expense: 0, profitLoss: 0 }
    );

    return (
      <tfoot className="bg-muted font-semibold text-foreground">
        <tr>
          <td className="px-4 py-3 text-left">Total</td>
          <td className="px-4 py-3 text-right">
            ₹{totals.totalSales.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </td>
          <td className="px-4 py-3 text-right">
            ₹{totals.totalPurchase.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </td>
          <td className="px-4 py-3 text-right">
            ₹{totals.expense.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </td>
          <td className={`px-4 py-3 text-right ${totals.profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
            ₹{Math.abs(totals.profitLoss).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </td>
        </tr>
      </tfoot>
    );
  };

  const customFilters = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        type="date"
        placeholder="From Date"
        value={fromDate}
        onChange={(e) => {
          setFromDate(e.target.value);
          setCurrentPage(1);
          console.log("ProfitLoss handleFromDateChange:", { fromDate: e.target.value });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by from date"
      />
      <input
        type="date"
        placeholder="To Date"
        value={toDate}
        onChange={(e) => {
          setToDate(e.target.value);
          setCurrentPage(1);
          console.log("ProfitLoss handleToDateChange:", { toDate: e.target.value });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by to date"
      />
    </div>
  );

  return (
    <PageBase1
      title="Profit Loss Report"
      description="View and filter profit and loss records."
      icon="fa fa-balance-scale"
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
      customFilters={customFilters}
    />
  );
}