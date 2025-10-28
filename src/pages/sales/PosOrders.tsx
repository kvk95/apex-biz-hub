import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";
import AddSalesModal from "./AddSalesModal";

interface OrderItem {
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  total: number;
}

interface Totals {
  subTotal: number;
  tax: number;
  discount: number;
  shipping: number;
  grandTotal: number;
  paid?: number;
  due?: number;
}

interface Order {
  id: number;
  orderId: string;
  orderType: string;
  date: string;
  customerId: number;
  customerName: string;
  supplierId: number;
  supplierName?: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  items: OrderItem[];
  totals: Totals;
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any, idx?: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

export default function PosOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("All");
  const [selectedSort, setSelectedSort] = useState("All Time");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await apiService.get<any>("OnlinePosOrders");
      if (response.status.code === "S") {
        const posOrders = response.result.filter((o: any) => o.orderType === "POS");
        setOrders(posOrders);
        console.log("PosOrders loadData:", { data: posOrders });
      }
    } catch (error) {
      console.error("Failed to load POS orders:", error);
    }
  };

  const filteredData = useMemo(() => {
    let result = [...orders];

    if (search.trim()) {
      result = result.filter(
        (o) =>
          o.customerName.toLowerCase().includes(search.toLowerCase()) ||
          o.orderId.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCustomer !== "All") result = result.filter((o) => o.customerName === selectedCustomer);
    if (selectedStatus !== "All") result = result.filter((o) => o.status === selectedStatus);
    if (selectedPaymentStatus !== "All") result = result.filter((o) => o.paymentStatus === selectedPaymentStatus);

    if (selectedSort === "Last 7 Days") {
      const last7 = new Date();
      last7.setDate(last7.getDate() - 7);
      result = result.filter((o) => new Date(o.date) >= last7);
    } else if (selectedSort === "This Month") {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      result = result.filter((o) => new Date(o.date) >= start);
    }

    console.log("PosOrders filteredData:", result, {
      search,
      selectedCustomer,
      selectedStatus,
      selectedPaymentStatus,
      selectedSort,
    });
    return result;
  }, [orders, search, selectedCustomer, selectedStatus, selectedPaymentStatus, selectedSort]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("PosOrders paginatedData:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
      totalItems: filteredData.length,
    });
    return result;
  }, [filteredData, currentPage, itemsPerPage]);

  const customerOptions = useMemo(() => ["All", ...Array.from(new Set(orders.map((o) => o.customerName)))], [orders]);

  const handleAddClick = () => {
    setIsModalOpen(true);
    console.log("PosOrders handleAddClick: Opening AddSalesModal");
  };

  const handleAddOrder = (newOrder: Order) => {
    if (!newOrder || newOrder.orderType !== "POS") return;
    setOrders((prev) => [newOrder, ...prev]);
    setIsModalOpen(false);
    const totalPages = Math.ceil((filteredData.length + 1) / itemsPerPage);
    setCurrentPage(totalPages);
    console.log("PosOrders handleAddOrder:", { newOrder });
  };

  const handleClear = () => {
    loadData();
    setSearch("");
    setSelectedCustomer("All");
    setSelectedStatus("All");
    setSelectedPaymentStatus("All");
    setSelectedSort("All Time");
    setCurrentPage(1);
    console.log("PosOrders handleClear");
  };

  const handleReport = () => {
    alert("POS Orders Report:\n\n" + JSON.stringify(orders, null, 2));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    console.log("PosOrders handleSearchChange:", { search: e.target.value, currentPage: 1 });
  };

  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      console.log("PosOrders handlePageChange:", { page, totalPages, currentPage });
    } else {
      console.warn("PosOrders handlePageChange: Invalid page", { page, totalPages, currentPage });
    }
  };

  const rowActions = (row: Order) => (
    <>
      <button
        onClick={() => {
          setIsModalOpen(true);
          console.log("PosOrders rowActions: Edit clicked", { row });
        }}
        aria-label={`Edit POS order ${row.orderId}`}
        className="text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded p-1 transition-colors"
        title="Edit"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit order</span>
      </button>

      <button
        onClick={() => {
          if (window.confirm("Are you sure you want to delete this POS order?")) {
            setOrders((prev) => prev.filter((o) => o.id !== row.id));
            console.log("PosOrders rowActions: Delete confirmed", { id: row.id });
          }
        }}
        aria-label={`Delete POS order ${row.orderId}`}
        className="text-gray-700 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1 transition-colors"
        title="Delete"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete order</span>
      </button>
    </>
  );

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
      render: (value) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${value === "Completed"
            ? "bg-green-100 text-green-700"
            : value === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-600"
            }`}
        >
          {value}
        </span>
      ),
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
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option>All</option>
        <option>Pending</option>
        <option>Completed</option>
        <option>Cancelled</option>
      </select>
      <select
        value={selectedPaymentStatus}
        onChange={(e) => setSelectedPaymentStatus(e.target.value)}
        className="border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option>All</option>
        <option>Paid</option>
        <option>Partial</option>
        <option>Unpaid</option>
      </select>
      <select
        value={selectedSort}
        onChange={(e) => setSelectedSort(e.target.value)}
        className="border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option>All Time</option>
        <option>Last 7 Days</option>
        <option>This Month</option>
      </select>
    </>
  );

  return (
    <>
      <PageBase1
        title="POS Orders"
        description="Manage Your POS Orders"
        icon="fa-light fa-cash-register"
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
        // Modal props (not used) — safe to pass undefined
        formMode={undefined}
        setFormMode={undefined}
        modalTitle={undefined}
        modalForm={undefined}
        onFormSubmit={undefined}
      />

      {/* Your existing AddSalesModal — fully preserved */}
      <AddSalesModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          console.log("PosOrders: AddSalesModal closed");
        }}
        onSave={handleAddOrder}
        orderType="POS"
      />
    </>
  );
}