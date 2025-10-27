import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";
import { PAYMENT_STATUSES , PAYMENT_TYPES} from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";

interface Income {
  date: string;
  invoiceNo: string;
  customer: string;
  paymentStatus: "Paid" | "Unpaid";
  paymentMethod: string;
  totalAmount: number;
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any, idx?: number) => JSX.Element;
  align?: "left" | "center" | "right";
}

const IncomeReport: React.FC = () => {
  const [data, setData] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [paymentMethod, setPaymentMethod] = useState("All");
  const [searchInvoice, setSearchInvoice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<Income[]>("IncomeReport");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("IncomeReport loadData:", { data: response.result });
  };

  const filteredData = useMemo(() => {
    const result = data.filter((item) => {
      const matchStartDate = startDate ? item.date >= startDate : true;
      const matchEndDate = endDate ? item.date <= endDate : true;
      const matchPaymentStatus = paymentStatus !== "All" ? item.paymentStatus === paymentStatus : true;
      const matchPaymentMethod = paymentMethod !== "All" ? item.paymentMethod === paymentMethod : true;
      const matchInvoice = searchInvoice
        ? item.invoiceNo.toLowerCase().includes(searchInvoice.toLowerCase())
        : true;
      return matchStartDate && matchEndDate && matchPaymentStatus && matchPaymentMethod && matchInvoice;
    });
    console.log("IncomeReport filteredData:", result, {
      startDate,
      endDate,
      paymentStatus,
      paymentMethod,
      searchInvoice,
    });
    return result;
  }, [data, startDate, endDate, paymentStatus, paymentMethod, searchInvoice]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("IncomeReport paginatedData:", result, {
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
    setPaymentStatus("All");
    setPaymentMethod("All");
    setSearchInvoice("");
    setCurrentPage(1);
    loadData();
    console.log("IncomeReport handleClear");
  };

  const handleReport = () => {
    alert("Income Report:\n\n" + JSON.stringify(filteredData, null, 2));
    console.log("IncomeReport handleReport:", { filteredData });
  };

  const columns: Column[] = [
    { key: "date", label: "Date", align: "left" },
    {
      key: "invoiceNo",
      label: "Invoice No",
      align: "left",
      render: (value) => <span className="font-semibold font-mono text-blue-600 dark:text-blue-400">{value}</span>,
    },
    { key: "customer", label: "Customer", align: "left" }, 
    {
      key: "paymentStatus",
      label: "Payment Status",
      align: "center",
      render: renderStatusBadge,
    },    
    { key: "paymentMethod", label: "Payment Method", align: "left" },
    {
      key: "totalAmount",
      label: "Total Amount",
      align: "right",
      render: (value) => `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
  ];

  const tableFooter = () => (
    <tfoot className="bg-muted font-semibold text-foreground">
      <tr>
        <td className="px-4 py-3 text-right" colSpan={5}>
          Total
        </td>
        <td className="px-4 py-3 text-right">{`₹${filteredData
          .reduce((acc, cur) => acc + cur.totalAmount, 0)
          .toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
      </tr>
    </tfoot>
  );

  const customFilters = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        type="date"
        placeholder="Date From"
        value={startDate}
        onChange={(e) => {
          setStartDate(e.target.value);
          setCurrentPage(1);
          console.log("IncomeReport handleStartDateChange:", { startDate: e.target.value });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by start date"
      />
      <input
        type="date"
        placeholder="Date To"
        value={endDate}
        onChange={(e) => {
          setEndDate(e.target.value);
          setCurrentPage(1);
          console.log("IncomeReport handleEndDateChange:", { endDate: e.target.value });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by end date"
      />
      <select
        value={paymentStatus}
        onChange={(e) => {
          setPaymentStatus(e.target.value);
          setCurrentPage(1);
          console.log("IncomeReport handlePaymentStatusChange:", { paymentStatus: e.target.value });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by payment status"
      >
        {PAYMENT_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <select
        value={paymentMethod}
        onChange={(e) => {
          setPaymentMethod(e.target.value);
          setCurrentPage(1);
          console.log("IncomeReport handlePaymentMethodChange:", { paymentMethod: e.target.value });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by payment method"
      >
        {PAYMENT_TYPES.map((method) => (
          <option key={method} value={method}>
            {method}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Invoice No"
        value={searchInvoice}
        onChange={(e) => {
          setSearchInvoice(e.target.value);
          setCurrentPage(1);
          console.log("IncomeReport handleSearchInvoiceChange:", { searchInvoice: e.target.value });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search by invoice number"
      />
    </div>
  );

  return (
    <PageBase1
      title="Income Report"
      description="View and filter income records."
      icon="fa fa-coins"
      onRefresh={handleClear}
      onReport={handleReport}
      search={searchInvoice}
      onSearchChange={(e) => {
        setSearchInvoice(e.target.value);
        setCurrentPage(1);
        console.log("IncomeReport handleSearchInvoiceChange:", { searchInvoice: e.target.value });
      }}
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
};

export default IncomeReport;