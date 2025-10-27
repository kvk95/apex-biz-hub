import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";
import { PAYMENT_TYPES , EXPENSE_HEADS} from "@/constants/constants";

interface Expense {
  id: number;
  date: string;
  expenseHead: string;
  paymentType: string;
  amount: number;
  description: string;
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any, idx?: number) => JSX.Element;
  align?: "left" | "center" | "right";
}

export default function ExpenseReport() {
  const [data, setData] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [expenseHead, setExpenseHead] = useState("All");
  const [paymentType, setPaymentType] = useState("All");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [description, setDescription] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<Expense[]>("ExpenseReport");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("ExpenseReport loadData:", { data: response.result });
  };

  const filteredData = useMemo(() => {
    const result = data.filter((item) => {
      const matchDate = date ? item.date === date : true;
      const matchExpenseHead = expenseHead !== "All" ? item.expenseHead === expenseHead : true;
      const matchPaymentType = paymentType !== "All" ? item.paymentType === paymentType : true;
      const matchMinAmount = minAmount ? item.amount >= Number(minAmount) : true;
      const matchMaxAmount = maxAmount ? item.amount <= Number(maxAmount) : true;
      const matchDescription = description
        ? item.description.toLowerCase().includes(description.toLowerCase())
        : true;
      return (
        matchDate &&
        matchExpenseHead &&
        matchPaymentType &&
        matchMinAmount &&
        matchMaxAmount &&
        matchDescription
      );
    });
    console.log("ExpenseReport filteredData:", result, {
      date,
      expenseHead,
      paymentType,
      minAmount,
      maxAmount,
      description,
    });
    return result;
  }, [data, date, expenseHead, paymentType, minAmount, maxAmount, description]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("ExpenseReport paginatedData:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
      totalItems: filteredData.length,
    });
    return result;
  }, [filteredData, currentPage, itemsPerPage]);

  const handleClear = () => {
    setDate("");
    setExpenseHead("All");
    setPaymentType("All");
    setMinAmount("");
    setMaxAmount("");
    setDescription("");
    setCurrentPage(1);
    loadData();
    console.log("ExpenseReport handleClear");
  };

  const handleReport = () => {
    alert("Expense Report:\n\n" + JSON.stringify(filteredData, null, 2));
    console.log("ExpenseReport handleReport:", { filteredData });
  };

  const columns: Column[] = [
    { key: "date", label: "Date", align: "left" },
    {
      key: "expenseHead",
      label: "Expense Head",
      align: "left",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "paymentType", label: "Payment Type", align: "left" },
    {
      key: "amount",
      label: "Amount",
      align: "right",
      render: (value) => `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    { key: "description", label: "Description", align: "left" },
  ];

  const tableFooter = () => (
    <tfoot className="bg-muted font-semibold text-foreground">
      <tr>
        <td className="px-4 py-3 text-right" colSpan={3}>
          Total
        </td>
        <td className="px-4 py-3 text-right">{`₹${filteredData
          .reduce((acc, cur) => acc + cur.amount, 0)
          .toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
        <td className="px-4 py-3"></td>
      </tr>
    </tfoot>
  );

  const customFilters = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        type="date"
        placeholder="Date"
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
          setCurrentPage(1);
          console.log("ExpenseReport handleDateChange:", { date: e.target.value });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by date"
      />
      <select
        value={expenseHead}
        onChange={(e) => {
          setExpenseHead(e.target.value);
          setCurrentPage(1);
          console.log("ExpenseReport handleExpenseHeadChange:", {
            expenseHead: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by expense head"
      >
        {EXPENSE_HEADS.map((head) => (
          <option key={head} value={head}>
            {head}
          </option>
        ))}
      </select>
      <select
        value={paymentType}
        onChange={(e) => {
          setPaymentType(e.target.value);
          setCurrentPage(1);
          console.log("ExpenseReport handlePaymentTypeChange:", {
            paymentType: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by payment type"
      >
        {PAYMENT_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Min Amount"
        value={minAmount}
        onChange={(e) => {
          setMinAmount(e.target.value);
          setCurrentPage(1);
          console.log("ExpenseReport handleMinAmountChange:", {
            minAmount: e.target.value,
          });
        }}
        min="0"
        step="0.01"
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by minimum amount"
      />
      <input
        type="number"
        placeholder="Max Amount"
        value={maxAmount}
        onChange={(e) => {
          setMaxAmount(e.target.value);
          setCurrentPage(1);
          console.log("ExpenseReport handleMaxAmountChange:", {
            maxAmount: e.target.value,
          });
        }}
        min="0"
        step="0.01"
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by maximum amount"
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          setCurrentPage(1);
          console.log("ExpenseReport handleDescriptionChange:", {
            description: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search by description"
      />
    </div>
  );

  return (
    <PageBase1
      title="Expense Report"
      description="View and filter expense records."
      icon="fa fa-money-bill-wave"
      onRefresh={handleClear}
      onReport={handleReport}
      search={description}
      onSearchChange={(e) => {
        setDescription(e.target.value);
        setCurrentPage(1);
        console.log("ExpenseReport handleDescriptionChange:", {
          description: e.target.value,
        });
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
}