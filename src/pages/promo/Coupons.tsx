import { apiService } from "@/services/ApiService";
import React, { useEffect, useMemo, useState } from "react";
import { PageBase1, Column } from "@/pages/PageBase1";
import { COUPEN_TYPES, STATUSES } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";

interface Coupon {
  id: number;
  couponCode: string;
  couponType: (typeof COUPEN_TYPES)[number];
  discountAmount: string;
  maxDiscountAmount: string;
  minPurchaseAmount: string;
  startDate: string;
  endDate: string;
  status: (typeof STATUSES)[number];
}

export default function Coupons() {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState({
    id: null as number | null,
    couponCode: "",
    couponType: COUPEN_TYPES[0],
    discountAmount: "",
    maxDiscountAmount: "",
    minPurchaseAmount: "",
    startDate: "",
    endDate: "",
    status: STATUSES[0],
  });

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredCoupons = useMemo(() => {
    const result = !search.trim()
      ? coupons
      : coupons.filter((c) =>
          c.couponCode.toLowerCase().includes(search.toLowerCase())
        );
    console.log("Coupons filteredCoupons:", result, { search });
    return result;
  }, [search, coupons]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredCoupons.slice(start, end);
    console.log("Coupons paginatedData:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
      totalItems: filteredCoupons.length,
    });
    return result;
  }, [currentPage, itemsPerPage, filteredCoupons]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<Coupon[]>("Coupons");
    if (response.status.code === "S") {
      setCoupons(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("Coupons loadData:", { data: response.result });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleAddClick = () => {
    setFormMode("add");
    setForm({
      id: null,
      couponCode: "",
      couponType: COUPEN_TYPES[0],
      discountAmount: "",
      maxDiscountAmount: "",
      minPurchaseAmount: "",
      startDate: "",
      endDate: "",
      status: STATUSES[0],
    });
    console.log("Coupons handleAddClick: Modal opened for add");
  };

  const handleEdit = (coupon: Coupon) => {
    setFormMode("edit");
    setForm({ ...coupon });
    console.log("Coupons handleEdit: Modal opened for edit", { coupon });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.couponCode.trim() ||
      !form.discountAmount.trim() ||
      !form.startDate.trim() ||
      !form.endDate.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
    const discountAmount = Number(form.discountAmount);
    const maxDiscountAmount = form.maxDiscountAmount
      ? Number(form.maxDiscountAmount)
      : 0;
    const minPurchaseAmount = form.minPurchaseAmount
      ? Number(form.minPurchaseAmount)
      : 0;
    if (
      isNaN(discountAmount) ||
      discountAmount < 0 ||
      (form.maxDiscountAmount &&
        (isNaN(maxDiscountAmount) || maxDiscountAmount < 0)) ||
      (form.minPurchaseAmount &&
        (isNaN(minPurchaseAmount) || minPurchaseAmount < 0))
    ) {
      alert("Numeric fields must be valid numbers greater than or equal to 0.");
      return;
    }
    if (formMode === "add") {
      const newId = coupons.length
        ? Math.max(...coupons.map((c) => c.id)) + 1
        : 1;
      setCoupons((prev) => [...prev, { ...form, id: newId }]);
      const totalPages = Math.ceil((filteredCoupons.length + 1) / itemsPerPage);
      setCurrentPage(totalPages);
    } else if (formMode === "edit" && form.id !== null) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === form.id ? { ...form, id: form.id } : c))
      );
    }
    setFormMode(null);
    console.log("Coupons handleFormSubmit:", { form, formMode });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      const totalPages = Math.ceil((filteredCoupons.length - 1) / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
        console.log("Coupons handleDelete: Adjusted to last page", {
          id,
          currentPage,
          totalPages,
        });
      } else if (totalPages === 0) {
        setCurrentPage(1);
        console.log("Coupons handleDelete: Reset to page 1 (no data)", {
          id,
          currentPage,
          totalPages,
        });
      }
      console.log("Coupons handleDelete:", { id, totalPages });
    }
  };

  const handleClear = () => {
    loadData();
    setFormMode(null);
    setSearch("");
    setCurrentPage(1);
    console.log("Coupons handleClear");
  };

  const handleReport = () => {
    alert("Coupon Report:\n\n" + JSON.stringify(coupons, null, 2));
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      console.log("Coupons handlePageChange:", {
        page,
        totalPages,
        currentPage,
      });
    } else {
      console.warn("Coupons handlePageChange: Invalid page or same page", {
        page,
        totalPages,
        currentPage,
      });
    }
  };

  const columns: Column[] = [
    {
      key: "index",
      label: "#",
      render: (_, row, idx) => (currentPage - 1) * itemsPerPage + idx + 1,
    },
    {
      key: "couponCode",
      label: "Coupon Code",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "couponType", label: "Coupon Type" },
    {
      key: "discountAmount",
      label: "Discount Amount",
      render: (value, row) =>
        `${value}${row.couponType === "Percentage" ? "%" : ""}`,
    },
    {
      key: "maxDiscountAmount",
      label: "Max Discount Amount",
      render: (value) => value || "-",
    },
    {
      key: "minPurchaseAmount",
      label: "Min Purchase Amount",
      render: (value) => value || "-",
    },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
    { key: "status", label: "Status", render: renderStatusBadge },
  ];

  const rowActions = (row: Coupon) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit coupon ${row.couponCode}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit coupon</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete coupon ${row.couponCode}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete coupon</span>
      </button>
    </>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label htmlFor="couponCode" className="block text-sm font-medium mb-1">
          Coupon Code <span className="text-destructive">*</span>
        </label>
        <input
          id="couponCode"
          name="couponCode"
          type="text"
          value={form.couponCode}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter coupon code"
          required
        />
      </div>
      <div>
        <label htmlFor="couponType" className="block text-sm font-medium mb-1">
          Coupon Type
        </label>
        <select
          id="couponType"
          name="couponType"
          value={form.couponType}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {COUPEN_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="discountAmount"
          className="block text-sm font-medium mb-1"
        >
          Discount Amount <span className="text-destructive">*</span>
        </label>
        <input
          id="discountAmount"
          name="discountAmount"
          type="number"
          min={0}
          value={form.discountAmount}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter discount amount"
          required
        />
      </div>
      <div>
        <label
          htmlFor="maxDiscountAmount"
          className="block text-sm font-medium mb-1"
        >
          Max Discount Amount
        </label>
        <input
          id="maxDiscountAmount"
          name="maxDiscountAmount"
          type="number"
          min={0}
          value={form.maxDiscountAmount}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter max discount amount"
        />
      </div>
      <div>
        <label
          htmlFor="minPurchaseAmount"
          className="block text-sm font-medium mb-1"
        >
          Min Purchase Amount
        </label>
        <input
          id="minPurchaseAmount"
          name="minPurchaseAmount"
          type="number"
          min={0}
          value={form.minPurchaseAmount}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter min purchase amount"
        />
      </div>
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium mb-1">
          Start Date <span className="text-destructive">*</span>
        </label>
        <input
          id="startDate"
          name="startDate"
          type="date"
          value={form.startDate}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>
      <div>
        <label htmlFor="endDate" className="block text-sm font-medium mb-1">
          End Date <span className="text-destructive">*</span>
        </label>
        <input
          id="endDate"
          name="endDate"
          type="date"
          value={form.endDate}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium mb-1">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={form.status}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Coupons"
      description="Manage coupons for your application."
      icon="fa fa-ticket-alt"
      onAddClick={handleAddClick}
      onRefresh={handleClear}
      onReport={handleReport}
      search={search}
      onSearchChange={handleSearchChange}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredCoupons.length}
      onPageChange={handlePageChange}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={formMode === "add" ? "Add Coupon" : "Edit Coupon"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      loading={loading}
    />
  );
}
