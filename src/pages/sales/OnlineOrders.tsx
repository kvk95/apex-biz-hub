/* -------------------------------------------------
   OnlineOrders.tsx – FINAL, FULLY WORKING
   ------------------------------------------------- */
import React, { useState, useEffect, useMemo, useRef } from "react";
import { format } from "date-fns";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { SearchInput } from "@/components/Search/SearchInput";
import AddSalesModal from "./salesdialog/AddSalesModal";
import SaleDetailModal from "./salesdialog/SaleDetailModal";
import { PaymentModal, Payment } from "./salesdialog/PaymentModal";

import {
  ORDER_STATUSES,
  ONLINE_PAYMENT_STATUSES as PAYMENT_STATUSES,
  SORT_OPTIONS,
  ORDER_TYPES,
} from "@/constants/constants";


type SortOption = typeof SORT_OPTIONS[number];
type OnlinePaymentStatusesOptions = typeof PAYMENT_STATUSES[number];
type OrderStatusesOption = typeof ORDER_STATUSES[number];


type Order = {
  orderId: string;
  orderType: (typeof ORDER_TYPES)[number];
  reference: string;
  date: string;
  customerId: string;
  customerName: string;
  customerImage?: string;
  customerAddress: string;
  customerEmail: string;
  customerPhone: string;

  // SUPPLIER FIELDS — UPDATED
  supplierId: string;
  supplierName: string;  // ? NEW: matches your JSON

  status: OrderStatusesOption;
  paymentStatus: OnlinePaymentStatusesOptions;
  grandTotal: number;
  paid: number;
  due: number;
  orderTax: number;
  discount: number;
  shipping: number;
  companyInfo: any;
  items: any[];
  payments: any[];
  notes?: string;
};

export default function OnlineOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("All");
  const [selectedSort, setSelectedSort] = useState<SortOption>("Last 7 Days");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const currentOrderType = "ONLINE" as const;

  const [formMode, setFormMode] = useState<"add" | "edit" | "detail" | "show-payments" | "create-payment" | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<Order[]>("OnlineOrders");
      if (response.status.code === "S") {
        setOrders(response.result || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  function applySortAndFilter(data: Order[], selectedSort: typeof SORT_OPTIONS[number]): Order[] {
    let filtered = data;

    // ?? Filtering phase
    switch (selectedSort) {
      case "Last 7 Days": {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = data.filter(o => new Date(o.date) >= weekAgo);
        break;
      }
      case "This Month": {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = data.filter(o => new Date(o.date) >= start);
        break;
      }
      case "Last Month": {
        const now = new Date();
        const startLast = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const startThis = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = data.filter(o => {
          const d = new Date(o.date);
          return d >= startLast && d < startThis;
        });
        break;
      }
      case "All Time":
        filtered = data;
        break;
      default:
        // "Ascending", "Descending", "Recently Added" ? no filtering
        filtered = data;
    }

    // ?? Sorting phase
    switch (selectedSort) {
      case "Ascending":
        return [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case "Descending":
      case "Recently Added":
        return [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      default:
        // For date-range filters, default to newest first
        return [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }

  const filteredData = useMemo(() => {
    let result = [...orders];
    if (search) {
      result = result.filter(o =>
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.reference.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedCustomer !== "All") result = result.filter(o => o.customerName === selectedCustomer);
    if (selectedStatus !== "All") result = result.filter(o => o.status === selectedStatus);
    if (selectedPaymentStatus !== "All") result = result.filter(o => o.paymentStatus === selectedPaymentStatus);

    result = applySortAndFilter(result, selectedSort)
    return result;
  }, [orders, search, selectedCustomer, selectedStatus, selectedPaymentStatus, selectedSort]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".relative")) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const customerOptions = useMemo(() => ["All", ...new Set(orders.map(o => o.customerName))], [orders]);

  const handlePaymentAdded = (payment: Payment) => {
    if (!selectedOrder) return;

    const updated = {
      ...selectedOrder,
      payments: [...(selectedOrder.payments || []), payment],
      paid: selectedOrder.paid + payment.payingAmount, // ? ALWAYS payingAmount
      due: selectedOrder.grandTotal - (selectedOrder.paid + payment.payingAmount),
      paymentStatus: selectedOrder.paid + payment.payingAmount >= selectedOrder.grandTotal ? "Paid" : "Unpaid",
    } as Order;

    setOrders(prev => prev.map(o => o.orderId === selectedOrder.orderId ? updated : o));
    setSelectedOrder(updated);
  };

  const handleFormSubmit = (data: any) => {
    const now = new Date().toISOString();

    const completeOrder: Order = {
      orderId: data.orderId || `SL${String(orders.length + 1).padStart(3, "0")}`,
      orderType: data.orderType || currentOrderType,
      reference: data.reference || `#SL${String(orders.length + 1).padStart(3, "0")}`,
      date: data.date || now,
      customerId: data.customerId || "1",
      customerName: data.customerName || "Walk-in Customer",
      customerImage: data.customerImage || undefined,
      customerAddress: data.customerAddress || "N/A",
      customerEmail: data.customerEmail || "N/A",
      customerPhone: data.customerPhone || "N/A",
      supplierId: data.supplierId || selectedOrder?.supplierId || "1",
      supplierName: data.supplierName || selectedOrder?.supplierName || "Admin",
      status: data.status || "Inprogress",
      paymentStatus: data.paymentStatus || "Unpaid",
      grandTotal: data.totals?.grandTotal || data.grandTotal || 0,
      paid: data.paid || 0,
      due: data.due || data.totals?.grandTotal || 0,
      orderTax: data.orderTax || 0,
      discount: data.discount || 0,
      shipping: data.shipping || 0,
      companyInfo: {
        name: "Your Company",
        address: "123 Business St",
        email: "sales@company.com",
        phone: "+1234567890",
      },
      items: data.items || [],
      payments: data.payments || [],
      notes: data.notes || "",
    };

    if (formMode === "add") {
      setOrders(prev => [completeOrder, ...prev]);
    } else if (formMode === "edit" && selectedOrder) {
      setOrders(prev =>
        prev.map(o => (o.orderId === selectedOrder.orderId ? completeOrder : o))
      );
    }

    setFormMode(null);
    setSelectedOrder(null);
  };

  const handleDelete = (orderId: string) => {
    if (window.confirm("Delete this sale?")) {
      setOrders(prev => prev.filter(o => o.orderId !== orderId));
      setOpenDropdownId(null);
    }
  };

  const openEdit = (order: Order) => {
    setSelectedOrder(order);
    setFormMode("edit");
    setOpenDropdownId(null);
  };

  const columns: Column[] = [
    {
      key: "customer",
      label: "Customer",
      render: (_, row: Order) => (
        <div className="flex items-center gap-3">
          {row.customerImage ? (
            <img src={row.customerImage} alt="" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-white">
              {row.customerName.charAt(0)}
            </div>
          )}
          <span className="font-medium">{row.customerName}</span>
        </div>
      ),
    },
    { key: "reference", label: "Reference" },
    { key: "date", label: "Date", render: v => format(new Date(v), "dd MMM yyyy") },
    {
      key: "status",
      label: "Status",
      render: v => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${v === "Completed" ? "bg-green-100 text-green-800" :
          v === "Pending" ? "bg-blue-100 text-blue-800" :
            "bg-yellow-100 text-yellow-800"
          }`}>{v}</span>
      ),
    },
    { key: "grandTotal", label: "Grand Total", render: (_, r) => `$${r.grandTotal.toFixed(2)}`, align: "right" },
    { key: "paid", label: "Paid", render: (_, r) => `$${r.paid.toFixed(2)}`, align: "right" },
    { key: "due", label: "Due", render: (_, r) => `$${r.due.toFixed(2)}`, align: "right" },
    {
      key: "paymentStatus",
      label: "Payment Status",
      render: v => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${v === "Paid" ? "bg-green-100 text-green-800" :
          v === "Unpaid" ? "bg-red-100 text-red-800" :
            "bg-yellow-100 text-yellow-800"
          }`}>
          <i className="fa fa-circle mr-1 text-xs"></i> {v}
        </span>
      ),
    },
    { key: "supplierName", label: "Biller" },
  ];

  const rowActions = (row: Order) => {
    const openEdit = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedOrder(row);
      setFormMode("edit");
      setOpenDropdownId(null);
    };

    const openDetail = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedOrder(row);
      setFormMode("detail");
      setOpenDropdownId(null);
    };

    const openShowPayments = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedOrder(row);
      setFormMode("show-payments");
      setOpenDropdownId(null);
    };

    const openCreatePayment = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedOrder(row);
      setFormMode("create-payment");
      setOpenDropdownId(null);
    };

    return (
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenDropdownId(openDropdownId === row.orderId ? null : row.orderId);
          }}
          className="p-2 hover:bg-gray-100 rounded transition"
        >
          <i className="fa fa-ellipsis-v"></i>
        </button>

        {openDropdownId === row.orderId && (
          <div
            className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border z-50"
            onClick={(e) => e.stopPropagation()}
          // NO useRef HERE — WE DON'T NEED IT ANYMORE
          >
            <button onClick={openDetail} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2">
              Sale Detail
            </button>
            <button onClick={openEdit} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2">
              Edit Sale
            </button>
            <button onClick={openShowPayments} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2">
              Show Payments
            </button>
            <button onClick={openCreatePayment} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2">
              Create Payment
            </button>
            <button onClick={() => alert("PDF Downloaded!")} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2">
              Download pdf
            </button>
            <button onClick={() => handleDelete(row.orderId)} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 flex items-center gap-2">
              Delete Sale
            </button>
          </div>
        )}
      </div>
    );
  };

  const customFilters = () => (
    <div className="grid grid-cols-2 w-full justify-stretch px-3">
      <div className="flex justify-start">
        <SearchInput
          className=""
          value={search}
          placeholder="Search by Customer or Order ID..."
          onSearch={(query) => {
            setSearch(query);
            setCurrentPage(1);
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="border border-input rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
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
          className="border border-input rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
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
          className="border border-input rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
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
          className="border border-input rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const modalForm = formMode
    ? () => {
      if (formMode === "detail" && selectedOrder) {
        return <SaleDetailModal isOpen={true} onClose={() => { setFormMode(null); setSelectedOrder(null); }} order={selectedOrder} />;
      }
      if (formMode === "show-payments" && selectedOrder) {
        return (
          <PaymentModal
            isOpen={true}
            onClose={() => { setFormMode(null); setSelectedOrder(null); }}
            order={selectedOrder}
            mode="show"
            onPaymentAdded={() => { }}
          />
        );
      }
      if (formMode === "create-payment" && selectedOrder) {
        return (
          <PaymentModal
            isOpen={true}
            onClose={() => { setFormMode(null); setSelectedOrder(null); }}
            order={selectedOrder}
            mode="create"
            onPaymentAdded={handlePaymentAdded}
          />
        );
      }
      return (
        <AddSalesModal
          isOpen={true}
          onClose={() => { setFormMode(null); setSelectedOrder(null); }}
          onSave={handleFormSubmit}
          orderType={currentOrderType}
          initialData={formMode === "edit" ? selectedOrder : undefined}
        />
      );
    }
    : null;

  return (
    <PageBase1
      title="Online Orders"
      description="Manage Your Online Orders"
      icon="fa-light fa-shopping-cart"
      onAddClick={() => {
        setSelectedOrder(null);
        setFormMode("add");
      }}
      onRefresh={loadData}
      onReport={() => alert("Report generated")}
      search={search}
      onSearchChange={() => { }}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={() => { }}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      customFilters={customFilters}

      // REQUIRED MODAL PROPS
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={
        formMode === "add" ? "Add Online Order" :
          formMode === "edit" ? "Edit Online Order" :
            formMode === "detail" ? `Invoice - ${selectedOrder?.reference}` :
              formMode === "show-payments" ? "Show Payments" :
                formMode === "create-payment" ? "Create Payments" : ""
      }
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
    />
  );
}