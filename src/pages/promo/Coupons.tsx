import { apiService } from "@/services/ApiService";
import React, { useEffect, useMemo, useState } from "react";
import { PageBase1 } from "@/pages/PageBase1";

const couponTypes = ["Percentage", "Flat"];
const couponStatuses = ["Active", "Inactive"];

interface Coupon {
  id: number;
  couponCode: string;
  couponType: string;
  discountAmount: string;
  maxDiscountAmount: string;
  minPurchaseAmount: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => JSX.Element;
}

export default function Coupons() {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState({
    id: null as number | null,
    couponCode: "",
    couponType: couponTypes[0],
    discountAmount: "",
    maxDiscountAmount: "",
    minPurchaseAmount: "",
    startDate: "",
    endDate: "",
    status: couponStatuses[0],
  });

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Pagination calculation with filtering
  const filteredCoupons = useMemo(() => {
    const result = !search.trim()
      ? coupons
      : coupons.filter((c) =>
          c.couponCode.toLowerCase().includes(search.toLowerCase())
        );
    console.log("filteredCoupons:", result, { search });
    return result;
  }, [search, coupons]);

  // Paginated data slice
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredCoupons.slice(start, end);
    console.log("paginatedData:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
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
    console.log("loadData:", { data: response.result });
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
      couponType: couponTypes[0],
      discountAmount: "",
      maxDiscountAmount: "",
      minPurchaseAmount: "",
      startDate: "",
      endDate: "",
      status: couponStatuses[0],
    });
  };

  const handleEdit = (coupon: Coupon) => {
    setFormMode("edit");
    setForm({ ...coupon });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.couponCode.trim() ||
      !form.discountAmount.trim() ||
      !form.startDate.trim() ||
      !form.endDate.trim()
    ) {
      alert("Please fill in all required fields.");
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
    console.log("handleFormSubmit:", { form, formMode });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      const totalPages = Math.ceil((filteredCoupons.length - 1) / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      } else if (totalPages === 0) {
        setCurrentPage(1);
      }
      console.log("handleDelete:", { id, totalPages });
    }
  };

  const handleClear = () => {
    loadData();
    setFormMode(null);
    setSearch("");
    setCurrentPage(1);
    console.log("handleClear");
  };

  const handleReport = () => {
    alert("Coupon Report:\n\n" + JSON.stringify(coupons, null, 2));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    console.log("handleSearchChange:", { search: e.target.value });
  };

  // Table columns
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
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`inline-block px-2 py-1 rounded font-semibold ${
            value === "Active"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  // Row actions
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

  // Modal for add/edit
  const modal = (themeStyles: ThemeStyles) => {
    return formMode === "add" || formMode === "edit" ? (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="bg-white rounded shadow-lg max-w-xl w-full p-6">
          <h2
            id="modal-title"
            className="text-xl font-semibold mb-4 text-center"
          >
            {formMode === "add" ? "Add Coupon" : "Edit Coupon"}
          </h2>
          <form
            onSubmit={handleFormSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div>
              <label
                htmlFor="couponCode"
                className="block text-sm font-medium mb-1"
              >
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
              <label
                htmlFor="couponType"
                className="block text-sm font-medium mb-1"
              >
                Coupon Type
              </label>
              <select
                id="couponType"
                name="couponType"
                value={form.couponType}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {couponTypes.map((type) => (
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
              <label
                htmlFor="startDate"
                className="block text-sm font-medium mb-1"
              >
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
              <label
                htmlFor="endDate"
                className="block text-sm font-medium mb-1"
              >
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
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {couponStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </form>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setFormMode(null)}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-white font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleFormSubmit}
              className="inline-flex items-center gap-2 text-white font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              style={
                {
                  backgroundColor: themeStyles.selectionBg,
                  "--hover-bg": themeStyles.hoverColor,
                } as React.CSSProperties
              }
              type="button"
            >
              {formMode === "add" ? "Save" : "Update"}
            </button>
          </div>
        </div>
      </div>
    ) : null;
  };

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
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      modal={modal}
    />
  );
}
