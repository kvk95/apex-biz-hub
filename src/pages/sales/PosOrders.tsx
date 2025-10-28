import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  FileText,
  FileSpreadsheet,
  RefreshCcw,
} from "lucide-react";
import { apiService } from "@/services/ApiService";
import AddSalesModal from "./AddSalesModal";
import { Pagination } from "@/components/Pagination/Pagination";

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

const PosOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("All");
  const [selectedSort, setSelectedSort] = useState("All Time");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // ✅ Fetch POS Orders
  const fetchOrders = async () => {
    try {
      const response = await apiService.get<any>("Online_Pos_Orders");
      if (response.status.code === "S") {
        const posOrders = response.result.filter(
          (o: any) => o.orderType === "POS"
        );
        setOrders(posOrders);
        setFilteredOrders(posOrders);
      }
    } catch (error) {
      console.error("Failed to load POS orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Filter + Search Logic
  useEffect(() => {
    let data = [...orders];

    if (searchTerm.trim() !== "") {
      data = data.filter(
        (o) =>
          o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCustomer !== "All") {
      data = data.filter((o) => o.customerName === selectedCustomer);
    }

    if (selectedStatus !== "All") {
      data = data.filter((o) => o.status === selectedStatus);
    }

    if (selectedPaymentStatus !== "All") {
      data = data.filter((o) => o.paymentStatus === selectedPaymentStatus);
    }

    // Sorting Logic
    if (selectedSort === "Last 7 Days") {
      const now = new Date();
      const last7 = new Date();
      last7.setDate(now.getDate() - 7);
      data = data.filter((o) => new Date(o.date) >= last7);
    } else if (selectedSort === "This Month") {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      data = data.filter((o) => new Date(o.date) >= start);
    }

    setFilteredOrders(data);
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedCustomer,
    selectedStatus,
    selectedPaymentStatus,
    selectedSort,
    orders,
  ]);

  // ✅ Add New Order (instantly updates grid)
  const handleAddOrder = (newOrder: Order) => {
    if (!newOrder || newOrder.orderType !== "POS") return;
    setOrders((prev) => [newOrder, ...prev]);
    setFilteredOrders((prev) => [newOrder, ...prev]);
  };

  // ✅ Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // ✅ Customer Dropdown
  const customerOptions = ["All", ...Array.from(new Set(orders.map((o) => o.customerName)))];

  if (loading) return <p className="p-4 text-gray-600">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* 🔹 Header Section */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">POS Orders</h1>
          <p className="text-sm text-gray-500">Manage Your POS Orders</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
            onClick={() => console.log("TODO: Export PDF")}
          >
            <FileText size={16} /> PDF
          </button>
          <button
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
            onClick={() => console.log("TODO: Export Excel")}
          >
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
            onClick={fetchOrders}
          >
            <RefreshCcw size={16} /> Refresh
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600"
          >
            <Plus className="w-4 h-4" /> Add POS Order
          </button>
        </div>
      </div>

      {/* 🔹 Filters Row */}
      <div className="flex flex-wrap gap-3 items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Customer or Order ID..."
            className="pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring focus:ring-blue-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="border px-3 py-2 rounded-lg text-sm"
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
        >
          {customerOptions.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          className="border px-3 py-2 rounded-lg text-sm"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>

        <select
          className="border px-3 py-2 rounded-lg text-sm"
          value={selectedPaymentStatus}
          onChange={(e) => setSelectedPaymentStatus(e.target.value)}
        >
          <option>All</option>
          <option>Paid</option>
          <option>Partial</option>
          <option>Unpaid</option>
        </select>

        <select
          className="border px-3 py-2 rounded-lg text-sm"
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
        >
          <option>All Time</option>
          <option>Last 7 Days</option>
          <option>This Month</option>
        </select>
      </div>

      {/* 🔹 Orders Table */}
      <div className="overflow-x-auto bg-white shadow-sm rounded-lg">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Reference</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-right">Grand Total ($)</th>
              <th className="px-4 py-2 text-right">Paid ($)</th>
              <th className="px-4 py-2 text-right">Due ($)</th>
              <th className="px-4 py-2 text-left">Payment Status</th>
              <th className="px-4 py-2 text-left">Biller</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => {
                const paid = order.totals.paid ?? order.totals.grandTotal * 0.8;
                const due = order.totals.grandTotal - paid;

                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{order.customerName}</td>
                    <td className="px-4 py-2">{order.orderId}</td>
                    <td className="px-4 py-2">{order.date}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${order.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right">
                      ${order.totals.grandTotal.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right">${paid.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right">${due.toFixed(2)}</td>
                    <td className="px-4 py-2">{order.paymentStatus}</td>
                    <td className="px-4 py-2">{order.supplierName || "-"}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-6 text-gray-500 text-sm"
                >
                  No POS Orders Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Pagination */}
      {filteredOrders.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalItems={filteredOrders.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* 🔹 Add Modal */}
      <AddSalesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddOrder}
        orderType="POS"
      />
    </div>
  );
};

export default PosOrders;
