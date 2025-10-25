import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";
import { PURCHASE_STATUSES, PAYMENT_STATUSES } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";

type PurchaseRecord = {
  purchaseNo: string;
  supplier: string;
  purchaseDate: string;
  purchaseStatus: string;
  grandTotal: string;
  paidAmount: string;
  dueAmount: string;
  paymentStatus: string;
};

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: PurchaseRecord) => JSX.Element;
  align?: "left" | "center" | "right";
}

const PurchaseReport: React.FC = () => {
  const [data, setData] = useState<PurchaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [purchaseNo, setPurchaseNo] = useState("");
  const [supplier, setSupplier] = useState("");
  const [purchaseStatus, setPurchaseStatus] = useState("All");
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<PurchaseRecord[]>("PurchaseReport");
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
      if (
        purchaseNo &&
        !item.purchaseNo.toLowerCase().includes(purchaseNo.toLowerCase())
      )
        return false;
      if (
        supplier &&
        !item.supplier.toLowerCase().includes(supplier.toLowerCase())
      )
        return false;
      if (purchaseStatus !== "All" && item.purchaseStatus !== purchaseStatus)
        return false;
      if (paymentStatus !== "All" && item.paymentStatus !== paymentStatus)
        return false;
      if (dateFrom && item.purchaseDate < dateFrom) return false;
      if (dateTo && item.purchaseDate > dateTo) return false;
      return true;
    });
  }, [data, purchaseNo, supplier, purchaseStatus, paymentStatus, dateFrom, dateTo]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleReset = () => {
    setPurchaseNo("");
    setSupplier("");
    setPurchaseStatus("All");
    setPaymentStatus("All");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report:\n\n" + JSON.stringify(filteredData, null, 2));
  };

  const columns: Column[] = [
    { key: "purchaseNo", label: "Purchase No", align: "left" },
    { key: "supplier", label: "Supplier", align: "left" },
    { key: "purchaseDate", label: "Purchase Date", align: "left" }, 
     {
          key: "purchaseStatus",
          label: "Purchase Status",
          align: "center",
          render: renderStatusBadge,
        }, 
    { key: "grandTotal", label: "Grand Total", align: "right", render: (v) => `₹${v}` },
    { key: "paidAmount", label: "Paid Amount", align: "right", render: (v) => `₹${v}` },
    { key: "dueAmount", label: "Due Amount", align: "right", render: (v) => `₹${v}` },
    {
          key: "paymentStatus",
          label: "Payment Status",
          align: "center",
          render: renderStatusBadge,
        }, 
  ];

  const customFilters = () => (
    <form onSubmit={handleSearch} className="flex flex-wrap gap-2 mb-4 items-center">
      <input
        type="text"
        value={purchaseNo}
        onChange={(e) => setPurchaseNo(e.target.value)}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="Purchase No"
      />
      <input
        type="text"
        value={supplier}
        onChange={(e) => setSupplier(e.target.value)}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="Supplier"
      />
      <select
        value={purchaseStatus}
        onChange={(e) => setPurchaseStatus(e.target.value)}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {PURCHASE_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <select
        value={paymentStatus}
        onChange={(e) => setPaymentStatus(e.target.value)}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {PAYMENT_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={dateFrom}
        onChange={(e) => setDateFrom(e.target.value)}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <input
        type="date"
        value={dateTo}
        onChange={(e) => setDateTo(e.target.value)}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </form>
  );

  return (
    <PageBase1
      title="Purchase Report"
      description="View and filter purchase report records."
      icon="fa fa-shopping-basket"
      onRefresh={handleReset}
      onReport={handleReport}      
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      customFilters={customFilters}
    />
  );
};

export default PurchaseReport;