import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";

interface CashFlowItem {
  id: number;
  date: string;
  description: string;
  income: number;
  expense: number;
  balance: number;
}

const CashFlow: React.FC = () => {
  const [data, setData] = useState<CashFlowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchDate, setSearchDate] = useState("");
  const [searchDescription, setSearchDescription] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<CashFlowItem[]>("CashFlow");
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
      const matchesDate = searchDate ? item.date === searchDate : true;
      const matchesDesc = searchDescription
        ? item.description
            .toLowerCase()
            .includes(searchDescription.toLowerCase())
        : true;
      return matchesDate && matchesDesc;
    });
  }, [data, searchDate, searchDescription]);

  const handleRefresh = () => {
    setSearchDate("");
    setSearchDescription("");
    setCurrentPage(1);
    loadData(); // Reload data
  };

  const handleReport = () => {
    alert("Report generated for current filtered data.");
  };

  const columns: Column[] = [
    { key: "date", label: "Date", align: "left" },
    {
      key: "accountNumb",
      label: "Bank & Account Number",
      align: "left",
      render: (v) => "~AC~",
    },
    { key: "description", label: "Description", align: "left" },
    {
      key: "income",
      label: "Credit",
      align: "right",
      render: (v) => (v > 0 ? `₹${v.toLocaleString()}` : "-"),
    },
    {
      key: "expense",
      label: "Debit",
      align: "right",
      render: (v) => (v > 0 ? `₹${v.toLocaleString()}` : "-"),
    },
    {
      key: "balance",
      label: "Account Balance",
      align: "right",
      render: (v) => `₹${v.toLocaleString()}`,
    },
    {
      key: "balance",
      label: "Total Balance",
      align: "right",
      render: (v) => `₹${v.toLocaleString()}`,
    },
    {
      key: "paymentMethod",
      label: "Payment Method",
      align: "left",
      render: (v) => "~PM~",
    },
  ];

  const customFilters = () => (
    <div className="grid grid-cols-2 w-full justify-stretch px-3">
      <div className="flex justify-start  gap-2">
        <SearchInput
          className=""
          value={searchDescription}
          placeholder="Search description"
          onSearch={(query) => {
            setSearchDescription(query);
            setCurrentPage(1);
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <SearchInput
          className=""
          type="date"
          value={searchDate}
          onSearch={(query) => {
            setSearchDate(query);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Cash Flow"
      description="View and filter cash flow records."
      icon="fa fa-chart-line"
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
      loading={loading}
    />
  );
};

export default CashFlow;
