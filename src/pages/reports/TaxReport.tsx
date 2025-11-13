import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";

const TAX_RATES = ["All", "5%", "6%", "7%", "8%", "9%", "10%", "11%", "12%"]; // Replace with TAX_RATES from constants.ts if available

interface TaxRecord {
  date: string;
  invoiceNo: string;
  customer: string;
  taxRate: string;
  taxAmount: number;
  totalAmount: number;
}

export default function TaxReport() {
  const [data, setData] = useState<TaxRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedTaxRate, setSelectedTaxRate] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<TaxRecord[]>("TaxReport");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("TaxReport loadData:", { data: response.result });
  };

  const filteredData = useMemo(() => {
    const result = data.filter((item) => {
      const itemDate = new Date(item.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      const matchStartDate = start ? itemDate >= start : true;
      const matchEndDate = end ? itemDate <= end : true;
      const matchTaxRate =
        selectedTaxRate !== "All" ? item.taxRate === selectedTaxRate : true;
      return matchStartDate && matchEndDate && matchTaxRate;
    });
    console.log("TaxReport filteredData:", result, {
      startDate,
      endDate,
      selectedTaxRate,
    });
    return result;
  }, [data, startDate, endDate, selectedTaxRate]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("TaxReport paginatedData:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
      totalItems: filteredData.length,
    });
    return result;
  }, [filteredData, currentPage, itemsPerPage]);

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setSelectedTaxRate("All");
    setCurrentPage(1);
    loadData();
    console.log("TaxReport handleClear");
  };

  const handleReport = () => {
    alert("Tax Report:\n\n" + JSON.stringify(filteredData, null, 2));
    console.log("TaxReport handleReport:", { filteredData });
  };

  const columns: Column[] = [
    { key: "date", label: "Date", align: "left" },
    {
      key: "invoiceNo",
      label: "Invoice No",
      align: "left",
      render: (value) => (
        <span className="font-semibold font-mono text-blue-600 dark:text-blue-400">
          {value}
        </span>
      ),
    },
    { key: "customer", label: "Customer", align: "left" },
    { key: "taxRate", label: "Tax Rate", align: "right" },
    {
      key: "taxAmount",
      label: "Tax Amount",
      align: "right",
      render: (value) =>
        `₹${value.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
    },
    {
      key: "totalAmount",
      label: "Total Amount",
      align: "right",
      render: (value) =>
        `₹${value.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
    },
  ];

  const tableFooter = () => (
    <tfoot className="bg-muted font-semibold text-foreground">
      <tr>
        <td className="px-4 py-3 text-right" colSpan={4}>
          Totals
        </td>
        <td className="px-4 py-3 text-right">{`₹${filteredData
          .reduce((sum, item) => sum + item.taxAmount, 0)
          .toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}</td>
        <td className="px-4 py-3 text-right">{`₹${filteredData
          .reduce((sum, item) => sum + item.totalAmount, 0)
          .toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}</td>
      </tr>
    </tfoot>
  );

  const customFilters = () => (
    <div className="grid grid-cols-2 w-full justify-stretch px-3">
      <div className="flex justify-start  gap-2">
        <SearchInput
          className=""
          type="date"
          placeholder="Start Date"
          value={startDate}
          onSearch={(query) => {
            setStartDate(query);
            setCurrentPage(1);
          }}
        />
        <SearchInput
          className=""
          type="date"
          placeholder="End Date"
          value={endDate}
          onSearch={(query) => {
            setEndDate(query);
            setCurrentPage(1);
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <select
          value={selectedTaxRate}
          onChange={(e) => {
            setSelectedTaxRate(e.target.value);
            setCurrentPage(1); 
          }}
          className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Filter by tax rate"
        >
          {TAX_RATES.map((rate) => (
            <option key={rate} value={rate}>
              {rate}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Tax Report"
      description="View and filter tax records."
      icon="fa fa-file-invoice-dollar"
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
