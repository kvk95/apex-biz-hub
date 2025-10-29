import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { STATUSES } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";

interface Warehouse {
  id: number;
  warehouseName: string;
  warehouseCode: string;
  warehousePhone: string;
  warehouseEmail: string;
  warehouseAddress: string;
  warehouseStatus: (typeof STATUSES)[number];
}

export default function Warehouses() {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<Warehouse>({
    id: 0,
    warehouseName: "",
    warehouseCode: "",
    warehousePhone: "",
    warehouseEmail: "",
    warehouseAddress: "",
    warehouseStatus: STATUSES[0],
  });
  const [data, setData] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<Warehouse[]>("Warehouses");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("Warehouses loadData:", { data: response.result });
  };

  const filteredData = useMemo(() => {
    const result = !search.trim()
      ? data
      : data.filter(
          (warehouse) =>
            warehouse.warehouseName
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            warehouse.warehouseCode
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            warehouse.warehouseEmail
              .toLowerCase()
              .includes(search.toLowerCase())
        );
    console.log("Warehouses filteredData:", result, { search });
    return result;
  }, [data, search]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("Warehouses paginatedData:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
      totalItems: filteredData.length,
    });
    return result;
  }, [filteredData, currentPage, itemsPerPage]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setFormMode("add");
    setForm({
      id: 0,
      warehouseName: "",
      warehouseCode: "",
      warehousePhone: "",
      warehouseEmail: "",
      warehouseAddress: "",
      warehouseStatus: STATUSES[0],
    });
    console.log("Warehouses handleAddClick: Modal opened for add");
  };

  const handleEdit = (warehouse: Warehouse) => {
    setFormMode("edit");
    setForm(warehouse);
    console.log("Warehouses handleEdit: Modal opened for edit", { warehouse });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.warehouseName.trim() || !form.warehouseCode.trim()) {
      alert("Please fill all required fields.");
      return;
    }
    if (
      form.warehouseEmail &&
      !/^[^@]+@[^@]+\.[^@]+$/.test(form.warehouseEmail)
    ) {
      alert("Please enter a valid email address.");
      return;
    }
    if (
      form.warehouseEmail &&
      data.some(
        (warehouse) =>
          warehouse.warehouseEmail.toLowerCase() ===
            form.warehouseEmail.toLowerCase() &&
          (formMode === "edit" ? warehouse.id !== form.id : true)
      )
    ) {
      alert("Email must be unique.");
      return;
    }
    if (
      data.some(
        (warehouse) =>
          warehouse.warehouseCode.toLowerCase() ===
            form.warehouseCode.toLowerCase() &&
          (formMode === "edit" ? warehouse.id !== form.id : true)
      )
    ) {
      alert("Warehouse Code must be unique.");
      return;
    }
    if (formMode === "add") {
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [...prev, { id: newId, ...form }]);
      const totalPages = Math.ceil((filteredData.length + 1) / itemsPerPage);
      setCurrentPage(totalPages);
    } else if (formMode === "edit" && form.id !== 0) {
      setData((prev) =>
        prev.map((item) => (item.id === form.id ? { ...item, ...form } : item))
      );
    }
    setFormMode(null);
    console.log("Warehouses handleFormSubmit:", { form, formMode });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this warehouse?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      const totalPages = Math.ceil((filteredData.length - 1) / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
        console.log("Warehouses handleDelete: Adjusted to last page", {
          id,
          currentPage,
          totalPages,
        });
      } else if (totalPages === 0) {
        setCurrentPage(1);
        console.log("Warehouses handleDelete: Reset to page 1 (no data)", {
          id,
          currentPage,
          totalPages,
        });
      }
      console.log("Warehouses handleDelete:", { id, totalPages });
    }
  };

  const handleClear = () => {
    loadData();
    setFormMode(null);
    setSearch("");
    setCurrentPage(1);
    console.log("Warehouses handleClear");
  };

  const handleReport = () => {
    alert("Warehouse Report:\n\n" + JSON.stringify(data, null, 2));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    console.log("Warehouses handleSearchChange:", {
      search: e.target.value,
      currentPage: 1,
    });
  };

  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      console.log("Warehouses handlePageChange:", {
        page,
        totalPages,
        currentPage,
      });
    } else {
      console.warn("Warehouses handlePageChange: Invalid page or same page", {
        page,
        totalPages,
        currentPage,
      });
    }
  };

  const columns: Column[] = [
    {
      key: "warehouseName",
      label: "Warehouse Name",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "warehouseCode", label: "Code" },
    { key: "warehousePhone", label: "Phone" },
    { key: "warehouseEmail", label: "Email" },
    { key: "warehouseAddress", label: "Address" },
    { key: "warehouseStatus", label: "Status", render: renderStatusBadge },
  ];

  const rowActions = (row: Warehouse) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit warehouse ${row.warehouseName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit warehouse</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete warehouse ${row.warehouseName}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete warehouse</span>
      </button>
    </>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label
          htmlFor="warehouseName"
          className="block text-sm font-medium mb-1"
        >
          Warehouse Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="warehouseName"
          name="warehouseName"
          value={form.warehouseName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter warehouse name"
          required
        />
      </div>
      <div>
        <label
          htmlFor="warehouseCode"
          className="block text-sm font-medium mb-1"
        >
          Warehouse Code <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="warehouseCode"
          name="warehouseCode"
          value={form.warehouseCode}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter warehouse code"
          required
        />
      </div>
      <div>
        <label
          htmlFor="warehousePhone"
          className="block text-sm font-medium mb-1"
        >
          Warehouse Phone
        </label>
        <input
          type="tel"
          id="warehousePhone"
          name="warehousePhone"
          value={form.warehousePhone}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter phone number"
        />
      </div>
      <div>
        <label
          htmlFor="warehouseEmail"
          className="block text-sm font-medium mb-1"
        >
          Warehouse Email
        </label>
        <input
          type="email"
          id="warehouseEmail"
          name="warehouseEmail"
          value={form.warehouseEmail}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter email address"
        />
      </div>
      <div>
        <label
          htmlFor="warehouseAddress"
          className="block text-sm font-medium mb-1"
        >
          Warehouse Address
        </label>
        <input
          type="text"
          id="warehouseAddress"
          name="warehouseAddress"
          value={form.warehouseAddress}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter address"
        />
      </div>
      <div>
        <label
          htmlFor="warehouseStatus"
          className="block text-sm font-medium mb-1"
        >
          Warehouse Status
        </label>
        <select
          id="warehouseStatus"
          name="warehouseStatus"
          value={form.warehouseStatus}
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
      title="Warehouses"
      description="Manage warehouses for your application."
      icon="fa fa-warehouse"
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
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={formMode === "add" ? "Add Warehouse" : "Edit Warehouse"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
    />
  );
}
