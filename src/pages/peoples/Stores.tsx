import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { STORE_TYPES, STATUSES } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";

interface Store {
  id: number;
  storeName: string;
  storeCode: string;
  storeType: (typeof STORE_TYPES)[number];
  storeLocation: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  status: (typeof STATUSES)[number];
}

export default function Stores() {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<Store>({
    id: 0,
    storeName: "",
    storeCode: "",
    storeType: STORE_TYPES[0],
    storeLocation: "",
    contactPerson: "",
    contactNumber: "",
    email: "",
    status: STATUSES[0],
  });
  const [data, setData] = useState<Store[]>([]);
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
    const response = await apiService.get<Store[]>("Stores");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("Stores loadData:", { data: response.result });
  };

  const filteredData = useMemo(() => {
    const result = !search.trim()
      ? data
      : data.filter(
          (store) =>
            store.storeName.toLowerCase().includes(search.toLowerCase()) ||
            store.storeCode.toLowerCase().includes(search.toLowerCase()) ||
            store.email.toLowerCase().includes(search.toLowerCase())
        );
    console.log("Stores filteredData:", result, { search });
    return result;
  }, [data, search]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("Stores paginatedData:", result, {
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
      storeName: "",
      storeCode: "",
      storeType: STORE_TYPES[0],
      storeLocation: "",
      contactPerson: "",
      contactNumber: "",
      email: "",
      status: "Active",
    });
    console.log("Stores handleAddClick: Modal opened for add");
  };

  const handleEdit = (store: Store) => {
    setFormMode("edit");
    setForm(store);
    console.log("Stores handleEdit: Modal opened for edit", { store });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.storeName.trim() ||
      !form.storeCode.trim() ||
      !form.storeLocation.trim() ||
      !form.contactPerson.trim() ||
      !form.contactNumber.trim() ||
      !form.email.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!/[\d\s\-\+\(\)]{7,}/.test(form.contactNumber)) {
      alert("Contact number must be at least 7 characters long.");
      return;
    }
    if (
      data.some(
        (store) =>
          store.email.toLowerCase() === form.email.toLowerCase() &&
          (formMode === "edit" ? store.id !== form.id : true)
      )
    ) {
      alert("Email must be unique.");
      return;
    }
    if (
      data.some(
        (store) =>
          store.storeCode.toLowerCase() === form.storeCode.toLowerCase() &&
          (formMode === "edit" ? store.id !== form.id : true)
      )
    ) {
      alert("Store Code must be unique.");
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
    console.log("Stores handleFormSubmit:", { form, formMode });
  };

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this store? This action cannot be undone."
      )
    ) {
      setData((prev) => prev.filter((d) => d.id !== id));
      const totalPages = Math.ceil((filteredData.length - 1) / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
        console.log("Stores handleDelete: Adjusted to last page", {
          id,
          currentPage,
          totalPages,
        });
      } else if (totalPages === 0) {
        setCurrentPage(1);
        console.log("Stores handleDelete: Reset to page 1 (no data)", {
          id,
          currentPage,
          totalPages,
        });
      }
      console.log("Stores handleDelete:", { id, totalPages });
    }
  };

  const handleClear = () => {
    loadData();
    setFormMode(null);
    setSearch("");
    setCurrentPage(1);
    console.log("Stores handleClear");
  };

  const handleReport = () => {
    alert("Store Report:\n\n" + JSON.stringify(data, null, 2));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    console.log("Stores handleSearchChange:", {
      search: e.target.value,
      currentPage: 1,
    });
  };

  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      console.log("Stores handlePageChange:", {
        page,
        totalPages,
        currentPage,
      });
    } else {
      console.warn("Stores handlePageChange: Invalid page or same page", {
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
      render: (_, __, idx) => (currentPage - 1) * itemsPerPage + (idx ?? 0) + 1,
    },
    {
      key: "storeName",
      label: "Store Name",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "storeCode", label: "Store Code" },
    { key: "storeType", label: "Store Type" },
    { key: "storeLocation", label: "Location" },
    { key: "contactPerson", label: "Contact Person" },
    { key: "contactNumber", label: "Contact Number" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status", render: renderStatusBadge },
  ];

  const rowActions = (row: Store) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit store ${row.storeName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit store</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete store ${row.storeName}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete store</span>
      </button>
    </>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label htmlFor="storeName" className="block text-sm font-medium mb-1">
          Store Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="storeName"
          name="storeName"
          value={form.storeName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter store name"
          required
        />
      </div>
      <div>
        <label htmlFor="storeCode" className="block text-sm font-medium mb-1">
          Store Code <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="storeCode"
          name="storeCode"
          value={form.storeCode}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter store code"
          required
        />
      </div>
      <div>
        <label htmlFor="storeType" className="block text-sm font-medium mb-1">
          Store Type <span className="text-destructive">*</span>
        </label>
        <select
          id="storeType"
          name="storeType"
          value={form.storeType}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {STORE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="storeLocation"
          className="block text-sm font-medium mb-1"
        >
          Store Location <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="storeLocation"
          name="storeLocation"
          value={form.storeLocation}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter store location"
          required
        />
      </div>
      <div>
        <label
          htmlFor="contactPerson"
          className="block text-sm font-medium mb-1"
        >
          Contact Person <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="contactPerson"
          name="contactPerson"
          value={form.contactPerson}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter contact person"
          required
        />
      </div>
      <div>
        <label
          htmlFor="contactNumber"
          className="block text-sm font-medium mb-1"
        >
          Contact Number <span className="text-destructive">*</span>
        </label>
        <input
          type="tel"
          id="contactNumber"
          name="contactNumber"
          value={form.contactNumber}
          onChange={handleInputChange}
          pattern="[\d\s\-\+\(\)]{7,}"
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter contact number"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email <span className="text-destructive">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter email address"
          required
        />
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium mb-1">
          Status <span className="text-destructive">*</span>
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
      title="Stores"
      description="Manage stores for your application."
      icon="fa fa-store"
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
      modalTitle={formMode === "add" ? "Add Store" : "Edit Store"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
    />
  );
}
