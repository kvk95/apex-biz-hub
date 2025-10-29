import { apiService } from "@/services/ApiService";
import React, { useEffect, useMemo, useState } from "react";
import { PageBase1, Column } from "@/pages/PageBase1";
import { DISCOUNT_TYPES, STATUSES } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";

interface DiscountPlan {
  id: number;
  discountPlanName: string;
  discountType: (typeof DISCOUNT_TYPES)[number];
  discountValue: number;
  startDate: string;
  endDate: string;
  status: (typeof STATUSES)[number];
}

export default function DiscountPlan() {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<DiscountPlan>({
    id: null as number | null,
    discountPlanName: "",
    discountType: DISCOUNT_TYPES[0],
    discountValue: 0,
    startDate: "",
    endDate: "",
    status: STATUSES[0],
  });

  const [plans, setPlans] = useState<DiscountPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredPlans = useMemo(() => {
    const result = !search.trim()
      ? plans
      : plans.filter((p) =>
          p.discountPlanName.toLowerCase().includes(search.toLowerCase())
        );
    console.log("DiscountPlan filteredPlans:", result, { search });
    return result;
  }, [plans, search]);

  const paginatedPlans = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredPlans.slice(start, end);
    console.log("DiscountPlan paginatedPlans:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
      totalItems: filteredPlans.length,
    });
    return result;
  }, [filteredPlans, currentPage, itemsPerPage]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<DiscountPlan[]>("DiscountPlan");
    if (response.status.code === "S") {
      setPlans(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("DiscountPlan loadData:", { data: response.result });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setFormMode("add");
    setForm({
      id: null,
      discountPlanName: "",
      discountType: DISCOUNT_TYPES[0],
      discountValue: 0,
      startDate: "",
      endDate: "",
      status: STATUSES[0],
    });
    console.log("DiscountPlan handleAddClick: Modal opened for add");
  };

  const handleEdit = (plan: DiscountPlan) => {
    setFormMode("edit");
    setForm(plan);
    console.log("DiscountPlan handleEdit: Modal opened for edit", { plan });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.discountPlanName.trim() ||
      !form.discountValue ||
      !form.startDate ||
      !form.endDate
    ) {
      alert("Please fill all required fields.");
      return;
    }
    const discountValue = Number(form.discountValue);
    if (isNaN(discountValue) || discountValue < 0) {
      alert("Discount value must be a valid number greater than or equal to 0");
      return;
    }
    if (formMode === "add") {
      const newId = plans.length ? Math.max(...plans.map((p) => p.id)) + 1 : 1;
      setPlans((prev) => [...prev, { ...form, id: newId, discountValue }]);
      const totalPages = Math.ceil((filteredPlans.length + 1) / itemsPerPage);
      setCurrentPage(totalPages);
    } else if (formMode === "edit" && form.id !== null) {
      setPlans((prev) =>
        prev.map((plan) =>
          plan.id === form.id ? { ...form, id: form.id, discountValue } : plan
        )
      );
    }
    setFormMode(null);
    console.log("DiscountPlan handleFormSubmit:", { form, formMode });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this discount plan?")) {
      setPlans((prev) => prev.filter((p) => p.id !== id));
      const totalPages = Math.ceil((filteredPlans.length - 1) / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
        console.log("DiscountPlan handleDelete: Adjusted to last page", {
          id,
          currentPage,
          totalPages,
        });
      } else if (totalPages === 0) {
        setCurrentPage(1);
        console.log("DiscountPlan handleDelete: Reset to page 1 (no data)", {
          id,
          currentPage,
          totalPages,
        });
      }
      console.log("DiscountPlan handleDelete:", { id, totalPages });
    }
  };

  const handleClear = () => {
    loadData();
    setFormMode(null);
    setSearch("");
    setCurrentPage(1);
    console.log("DiscountPlan handleClear");
  };

  const handleReport = () => {
    alert("Discount Plans Report:\n\n" + JSON.stringify(plans, null, 2));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    console.log("DiscountPlan handleSearchChange:", {
      search: e.target.value,
      currentPage: 1,
    });
  };

  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      console.log("DiscountPlan handlePageChange:", {
        page,
        totalPages,
        currentPage,
      });
    } else {
      console.warn("DiscountPlan handlePageChange: Invalid page or same page", {
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
      key: "discountPlanName",
      label: "Discount Plan Name",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "discountType", label: "Discount Type" },
    {
      key: "discountValue",
      label: "Discount Value",
      render: (value, row) =>
        row.discountType === "Percentage" ? `${value}%` : `$${value}`,
    },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
    { key: "status", label: "Status", render: renderStatusBadge },
  ];

  const rowActions = (row: DiscountPlan) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit discount plan ${row.discountPlanName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit discount plan</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete discount plan ${row.discountPlanName}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete discount plan</span>
      </button>
    </>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label
          htmlFor="discountPlanName"
          className="block text-sm font-medium mb-1"
        >
          Discount Plan Name <span className="text-destructive">*</span>
        </label>
        <input
          id="discountPlanName"
          name="discountPlanName"
          type="text"
          value={form.discountPlanName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter discount plan name"
          required
        />
      </div>
      <div>
        <label
          htmlFor="discountType"
          className="block text-sm font-medium mb-1"
        >
          Discount Type
        </label>
        <select
          id="discountType"
          name="discountType"
          value={form.discountType}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {DISCOUNT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="discountValue"
          className="block text-sm font-medium mb-1"
        >
          Discount Value <span className="text-destructive">*</span>
        </label>
        <input
          id="discountValue"
          name="discountValue"
          type="number"
          min={0}
          value={form.discountValue}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter discount value"
          required
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
      title="Discount Plans"
      description="Manage discount plans for your application."
      icon="fa fa-project-diagram"
      onAddClick={handleAddClick}
      onRefresh={handleClear}
      onReport={handleReport}
      search={search}
      onSearchChange={handleSearchChange}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredPlans.length}
      onPageChange={handlePageChange}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedPlans}
      rowActions={rowActions}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={
        formMode === "add" ? "Add Discount Plan" : "Edit Discount Plan"
      }
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
    />
  );
}
