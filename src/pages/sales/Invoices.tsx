import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";
import {
  PAYMENT_STATUSES,
  SORT_OPTIONS,
  CURRENCY_SYMBOL,
} from "@/constants/constants";
import { useLocalization } from "@/utils/formatters";

// === Constants ===
type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
type SortOption = (typeof SORT_OPTIONS)[number];


type InvoiceItem = {
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
};

type Invoice = {
  id: number;
  invoiceId: string;
  invoiceNo: string;
  customerId: number;
  customerName: string;
  customerImage?: string;
  customerAddress?: string;
  customerEmail?: string;
  customerPhone?: string;
  date: string;
  dueDate: string;
  amount: number;
  paid: number;
  due: number;
  status: PaymentStatus;
  paymentStatus: PaymentStatus;
  fromInfo: {
    name: string;
    address: string;
    email: string;
    phone: string;
  };
  invoiceFor: string;
  items: InvoiceItem[];
  summary: {
    subTotal: number;
    discountPercent: number;
    discountAmount: number;
    vatPercent: number;
    vatAmount: number;
    totalAmount: number;
    amountInWords: string;
  };
  terms: string;
  notes: string;
  bankDetails: {
    bankName: string;
    branch: string;
    accountName: string;
    accountNumber: string;
    ifsc: string;
  };
  signature: {
    name: string;
    designation: string;
  };
};

export default function Invoices() {
  /* ---------- state ---------- */
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | "All">(
    "All"
  );
  const [selectedSort, setSelectedSort] =
    useState<SortOption>("Recently Added");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"view" | null>(null);
  const [loading, setLoading] = useState(true);
  const { formatDate, formatCurrency } = useLocalization();

  const [form, setForm] = useState({
    id: null as number | null,
    invoiceNo: "",
    customerId: "",
    customerName: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    invoiceFor: "",
    items: [] as InvoiceItem[],
    terms:
      "Please pay within 15 days from the date of invoice, overdue interest @ 14% will be charged on delayed payments.",
    notes: "Please quote invoice number when remitting funds.",
  });

  /* ---------- load data ---------- */
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [invRes] = await Promise.all([
        apiService.get<Invoice[]>("Invoices"),
      ]);

      if (invRes.status.code === "S") setInvoices(invRes.result);
    } catch (err) {
      console.error("Invoices load error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- filtering ---------- */
  const filteredData = useMemo(() => {
    let result = [...invoices];
    if (search.trim()) {
      result = result.filter(
        (i) =>
          i.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
          i.customerName.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedCustomer !== "All") {
      result = result.filter((i) => i.customerName === selectedCustomer);
    }
    if (selectedStatus !== "All") {
      result = result.filter((i) => i.paymentStatus === selectedStatus);
    }
    if (selectedSort === "Recently Added") {
      result.sort((a, b) => b.id - a.id);
    } else if (selectedSort === "Ascending") {
      result.sort((a, b) => a.amount - b.amount);
    } else if (selectedSort === "Descending") {
      result.sort((a, b) => b.amount - a.amount);
    } else if (selectedSort === "Last 7 Days") {
      const last7 = new Date();
      last7.setDate(last7.getDate() - 7);
      result = result.filter((i) => new Date(i.date) >= last7);
    } else if (selectedSort === "Last Month") {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      result = result.filter((i) => {
        const d = new Date(i.date);
        return d >= start && d <= end;
      });
    }
    return result;
  }, [invoices, search, selectedCustomer, selectedStatus, selectedSort]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const customerOptions = useMemo(() => {
    return ["All", ...Array.from(new Set(invoices.map((i) => i.customerName)))];
  }, [invoices]);

  const handleView = (invoice: Invoice) => {
    setFormMode("view");
    setForm({
      id: invoice.id,
      invoiceNo: invoice.invoiceNo,
      customerId: invoice.customerId.toString(),
      customerName: invoice.customerName,
      date: invoice.date,
      dueDate: invoice.dueDate,
      invoiceFor: invoice.invoiceFor,
      items: invoice.items,
      terms: invoice.terms,
      notes: invoice.notes,
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this invoice?")) {
      setInvoices((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const handleClear = () => {
    setSearch("");
    setSelectedCustomer("All");
    setSelectedStatus("All");
    setSelectedSort("Recently Added");
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("PDF Report Generated!");
  };

  /* ---------- totals ---------- */
  const totals = useMemo(() => {
    const subTotal = form.items.reduce(
      (s, i) => s + i.unitPrice * i.quantity,
      0
    );
    const discountTotal = form.items.reduce((s, i) => s + i.discount, 0);
    const taxTotal = form.items.reduce((s, i) => s + i.taxAmount, 0);
    const grand = subTotal - discountTotal + taxTotal;
    return {
      subTotal,
      discountTotal,
      taxTotal,
      grand: parseFloat(grand.toFixed(2)),
    };
  }, [form.items]);

  /* ---------- submit ---------- */
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formMode === "view") {
      setFormMode(null);
      return;
    }
  };

  /* ---------- table columns ---------- */
  const columns: Column[] = [
    {
      key: "index",
      label: "#",
      render: (_, __, idx) => (currentPage - 1) * itemsPerPage + (idx ?? 0) + 1,
      align: "center",
      className: "w-12",
    },
    { key: "invoiceNo", label: "Invoice No" },
    {
      key: "customerName",
      label: "Customer",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          {row.customerImage ? (
            <img
              src={row.customerImage}
              alt={value}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-dashed" />
          )}
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: "dueDate",
      label: "Due Date",
      render: (v) => formatDate(v),
    },
    {
      key: "amount",
      label: "Amount",
      render: formatCurrency,
      align: "right",
    },
    {
      key: "paid",
      label: "Paid",
      render: formatCurrency,
      align: "right",
    },
    {
      key: "due",
      label: "Amount Due",
      render: formatCurrency,
      align: "right",
    },
    {
      key: "paymentStatus",
      label: "Status",
      render: renderStatusBadge,
      align: "center",
    },
  ];

  /* ---------- row actions: View + Delete only ---------- */
  const rowActions = (row: Invoice) => (
    <>
      <button
        type="button"
        onClick={() => handleView(row)}
        aria-label={`View ${row.invoiceNo}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-eye" aria-hidden="true"></i>
        <span className="sr-only">View</span>
      </button>
      <button
        type="button"
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete ${row.invoiceNo}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can" aria-hidden="true"></i>
        <span className="sr-only">Delete</span>
      </button>
    </>
  );

  /* ---------- custom filters ---------- */
  const customFilters = () => (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-3 w-full">
      <div className="w-full md:w-auto md:max-w-md">
        <SearchInput
          value={search}
          placeholder="Search by Invoice No or Customer..."
          onSearch={(query) => {
            setSearch(query);
            setCurrentPage(1);
          }}
          className="w-full"
        />
      </div>
      <div className="flex gap-2 flex-wrap justify-end w-full md:w-auto">
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[130px]"
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
          className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[100px]"
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
          className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[140px]"
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

  /* ---------- modal form: View Only – Scrollable + Scroll-to-Top ---------- */
  const modalForm = () => {
    const isView = formMode === "view";

    const handlePrint = () => {
      window.print();
    };

    const handleClone = () => {
      alert("Implementation of invoice clone pending");
    };

    return (
      <div className="p-6 space-y-8">
        {/* === SCROLLABLE CONTENT === */}
        <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-8">
          {/* === Header Info === */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="font-semibold text-gray-700">Invoice No</div>
              <div className="mt-1 text-gray-900">{form.invoiceNo}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700">Customer</div>
              <div className="mt-1 text-gray-900">{form.customerName}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700">Date</div>
              <div className="mt-1 text-gray-900">{formatDate(form.date)}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700">Due Date</div>
              <div className="mt-1 text-gray-900">
                {formatDate(form.dueDate)}
              </div>
            </div>
            <div>
              <div className="font-semibold text-gray-700">Invoice For</div>
              <div className="mt-1 text-gray-900">{form.invoiceFor || "—"}</div>
            </div>
          </div>

          {/* === Items Table === */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Product</th>
                  <th className="px-4 py-3 text-center font-medium">Qty</th>
                  <th className="px-4 py-3 text-right font-medium">
                    Cost({CURRENCY_SYMBOL})
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    Discount({CURRENCY_SYMBOL})
                  </th>
                  <th className="px-4 py-3 text-right font-medium">Tax(%)</th>
                  <th className="px-4 py-3 text-right font-medium">
                    Tax Amt({CURRENCY_SYMBOL})
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    Total({CURRENCY_SYMBOL})
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {form.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{item.productName}</td>
                    <td className="px-4 py-3 text-center">{item.quantity}</td>
                    <td className="px-4 py-3 text-right">
                      {item.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {item.discount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">{item.taxPercent}</td>
                    <td className="px-4 py-3 text-right">
                      {item.taxAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* === Totals === */}
          <div className="flex justify-end">
            <div className="w-80 bg-gray-50 p-5 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Sub Total:</span>
                <span>{formatCurrency(totals.subTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>{formatCurrency(totals.discountTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{formatCurrency(totals.taxTotal)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-300">
                <span>Grand Total:</span>
                <span>{formatCurrency(totals.grand)}</span>
              </div>
            </div>
          </div>

          {/* === Terms & Notes === */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <div className="font-semibold text-gray-700 mb-1">Terms</div>
              <p className="text-gray-600 leading-relaxed">{form.terms}</p>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-1">Notes</div>
              <p className="text-gray-600 leading-relaxed">{form.notes}</p>
            </div>
          </div>
        </div>

        {/* === Fixed Action Bar (Sticky Bottom) === */}
        {isView && (
          <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 pt-4 -mx-6 px-6 pb-6 mt-8">
            <div className="flex justify-end gap-4 items-center">
              {/* Print */}
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition"
              >
                <i className="fa fa-print"></i> Print Invoice
              </button>

              {/* Clone */}
              <button
                type="button"
                onClick={handleClone}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition"
              >
                <i className="fa fa-copy"></i> Clone Invoice
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <PageBase1
      title="Invoices"
      description="Manage your invoices"
      onAddClick={null}
      onRefresh={handleClear}
      onReport={handleReport}
      search={search}
      onSearchChange={(q) => {
        setSearch(q);
        setCurrentPage(1);
      }}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle="Invoice Details"
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
      loading={loading}
    />
  );
}
