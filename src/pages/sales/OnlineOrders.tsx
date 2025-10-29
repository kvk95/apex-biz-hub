/* -------------------------------------------------
   OnlineOrders – fully template-compliant, no type errors
   ------------------------------------------------- */
import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { renderStatusBadge } from "@/utils/tableUtils";
import AddSalesModal from "./AddSalesModal";
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  SORT_OPTIONS,
  ORDER_TYPES,
} from "@/constants/constants";

type OrderItem = {
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  total: number;
};

type Totals = {
  subTotal: number;
  tax: number;
  discount: number;
  shipping: number;
  grandTotal: number;
  paid?: number;
  due?: number;
};

type Order = {
  id: number;
  orderId: string;
  orderType: (typeof ORDER_TYPES)[number];
  date: string;
  customerId: number;
  customerName: string;
  supplierId: number;
  supplierName?: string;
  paymentMethod: string;
  paymentStatus: (typeof PAYMENT_STATUSES)[number];
  status: (typeof ORDER_STATUSES)[number];
  items: OrderItem[];
  totals: Totals;
};

export default function OnlineOrders() {
  /* ---------- state ---------- */
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<(typeof ORDER_STATUSES)[number] | "All">("All");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<(typeof PAYMENT_STATUSES)[number] | "All">("All");
  const [selectedSort, setSelectedSort] = useState<(typeof SORT_OPTIONS)[number]>("All Time");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true); // Kept for future use
  const [error, setError] = useState<string | null>(null); // Kept for future use

  const currentOrderType = "ONLINE" as const;

  /* ---------- load data ---------- */
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<Order[]>("OnlineOrders");
      if (response.status.code === "S") {
        setOrders(response.result);
        setError(null);
        console.log("OnlineOrders loadData:", { data: response.result });
      } else {
        setError(response.status.description);
        console.error("OnlineOrders loadData error:", response.status);
      }
    } catch (err) {
      setError("Failed to load online orders.");
      console.error("OnlineOrders loadData exception:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- filtering ---------- */
  const filteredData = useMemo(() => {
    let result = [...orders];

    if (search.trim()) {
      result = result.filter(
        (o) =>
          o.customerName.toLowerCase().includes(search.toLowerCase()) ||
          o.orderId.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCustomer !== "All")
      result = result.filter((o) => o.customerName === selectedCustomer);
    if (selectedStatus !== "All")
      result = result.filter((o) => o.status === selectedStatus);
    if (selectedPaymentStatus !== "All")
      result = result.filter((o) => o.paymentStatus === selectedPaymentStatus);

    if (selectedSort === "Last 7 Days") {
      const last7 = new Date();
      last7.setDate(last7.getDate() - 7);
      result = result.filter((o) => new Date(o.date) >= last7);
    } else if (selectedSort === "This Month") {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      result = result.filter((o) => new Date(o.date) >= start);
    }

    console.log("OnlineOrders filteredData:", result, {
      search,
      selectedCustomer,
      selectedStatus,
      selectedPaymentStatus,
      selectedSort,
    });
    return result;
  }, [
    orders,
    search,
    selectedCustomer,
    selectedStatus,
    selectedPaymentStatus,
    selectedSort,
  ]);

  /* ---------- pagination ---------- */
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("OnlineOrders paginatedData:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
      totalItems: filteredData.length,
    });
    return result;
  }, [filteredData, currentPage, itemsPerPage]);

  /* ---------- derived options ---------- */
  const customerOptions = useMemo(
    () => ["All", ...Array.from(new Set(orders.map((o) => o.customerName)))],
    [orders]
  );

  /* ---------- handlers ---------- */
  const handleAddClick = () => {
    setIsModalOpen(true);
    console.log("OnlineOrders handleAddClick: Opening AddSalesModal");
  };

  const handleAddOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setIsModalOpen(false);
    const totalPages = Math.ceil((filteredData.length + 1) / itemsPerPage);
    setCurrentPage(totalPages);
    console.log("OnlineOrders handleAddOrder:", { newOrder });
  };

  const handleClear = () => {
    loadData();
    setSearch("");
    setSelectedCustomer("All");
    setSelectedStatus("All");
    setSelectedPaymentStatus("All");
    setSelectedSort("All Time");
    setCurrentPage(1);
    console.log("OnlineOrders handleClear");
  };

  const handleReport = () => {
    alert("Online Orders Report:\n\n" + JSON.stringify(orders, null, 2));
    console.log("OnlineOrders handleReport");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    console.log("OnlineOrders handleSearchChange:", {
      search: e.target.value,
      currentPage: 1,
    });
  };

  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      console.log("OnlineOrders handlePageChange:", {
        page,
        totalPages,
        currentPage,
      });
    } else {
      console.warn("OnlineOrders handlePageChange: Invalid page", {
        page,
        totalPages,
        currentPage,
      });
    }
  };

  /* ---------- row actions ---------- */
  const rowActions = (row: Order) => (
    <>
      <button
        onClick={() => {
          setIsModalOpen(true);
          console.log("OnlineOrders rowActions: Edit clicked", { row });
        }}
        aria-label={`Edit order ${row.orderId}`}
        className="text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded p-1 transition-colors"
        title="Edit"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit order</span>
      </button>

      <button
        onClick={() => {
          if (window.confirm("Are you sure you want to delete this order?")) {
            setOrders((prev) => prev.filter((o) => o.id !== row.id));
            const totalPages = Math.ceil((filteredData.length - 1) / itemsPerPage);
            if (currentPage > totalPages && totalPages > 0) {
              setCurrentPage(totalPages);
            } else if (totalPages === 0) {
              setCurrentPage(1);
            }
            console.log("OnlineOrders rowActions: Delete confirmed", {
              id: row.id,
              totalPages,
            });
          }
        }}
        aria-label={`Delete order ${row.orderId}`}
        className="text-gray-700 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1 transition-colors"
        title="Delete"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete order</span>
      </button>
    </>
  );

  /* ---------- table columns ---------- */
  const columns: Column[] = [
    {
      key: "index",
      label: "#",
      render: (_, __, idx) => (currentPage - 1) * itemsPerPage + (idx ?? 0) + 1,
      align: "center",
      className: "w-12",
    },
    { key: "customerName", label: "Customer" },
    { key: "orderId", label: "Reference" },
    { key: "date", label: "Date" },
    {
      key: "status",
      label: "Status",
      render: renderStatusBadge,
    },
    {
      key: "grandTotal",
      label: "Grand Total ($)",
      render: (_, row) => `$${Number(row.totals.grandTotal || 0).toFixed(2)}`,
      align: "right",
    },
    {
      key: "paid",
      label: "Paid ($)",
      render: (_, row) => {
        const paid = row.totals.paid ?? row.totals.grandTotal * 0.8;
        return `$${Number(paid || 0).toFixed(2)}`;
      },
      align: "right",
    },
    {
      key: "due",
      label: "Due ($)",
      render: (_, row) => {
        const paid = row.totals.paid ?? row.totals.grandTotal * 0.8;
        const due = row.totals.grandTotal - paid;
        return `$${Number(due || 0).toFixed(2)}`;
      },
      align: "right",
    },
    { key: "paymentStatus", label: "Payment Status" },
    {
      key: "supplierName",
      label: "Biller",
      render: (value) => value || "-",
    },
  ];

  /* ---------- custom filters ---------- */
  const customFilters = () => (
    <>
      <input
        type="text"
        placeholder="Search by Customer or Order ID..."
        value={search}
        onChange={handleSearchChange}
        className="border border-input rounded px-3 py-2 w-full md:w-64 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search"
      />
      <select
        value={selectedCustomer}
        onChange={(e) => setSelectedCustomer(e.target.value)}
        className="border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {customerOptions.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value as any)}
        className="border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option>All</option>
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <select
        value={selectedPaymentStatus}
        onChange={(e) => setSelectedPaymentStatus(e.target.value as any)}
        className="border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option>All</option>
        {PAYMENT_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <select
        value={selectedSort}
        onChange={(e) => setSelectedSort(e.target.value as any)}
        className="border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {SORT_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </>
  );

  /* ---------- render ---------- */
  return (
    <>
      <PageBase1
        title="Online Orders"
        description="Manage Your Online Orders"
        icon="fa-light fa-shopping-cart"
        onAddClick={handleAddClick}
        onRefresh={handleClear}
        onReport={handleReport}
        search={search}
        onSearchChange={handleSearchChange}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredData.length}
        onPageChange={handlePageChange}
        onPageSizeChange={setItemsPerPage}
        tableColumns={columns}
        tableData={paginatedData}
        rowActions={rowActions}
        customFilters={customFilters}
        formMode={undefined}
        setFormMode={undefined}
        modalTitle={undefined}
        modalForm={undefined}
        onFormSubmit={undefined}
      />

      <AddSalesModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          console.log("OnlineOrders: AddSalesModal closed");
        }}
        onSave={handleAddOrder}
        orderType={currentOrderType}
      />
    </>
  );
}