import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { ROLES, STATUSES } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";
import { generateUniqueId } from "@/utils/formatters";

type Customer = {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerCountry: string;
  customerZip: string;
  customerStatus: (typeof STATUSES)[number];
  customerImage: string;
};

export default function Customers() {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<Customer>({
    customerId: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    customerCity: "",
    customerCountry: "",
    customerZip: "",
    customerStatus: "Active",
    customerImage: "",
  });
  const [data, setData] = useState<Customer[]>([]);
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
    const response = await apiService.get<Customer[]>("Customers");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("Customers loadData:", { data: response.result });
  };

  const filteredData = useMemo(() => {
    const result = !search.trim()
      ? data
      : data.filter(
        (customer) =>
          customer.customerName.toLowerCase().includes(search.toLowerCase()) ||
          customer.customerEmail.toLowerCase().includes(search.toLowerCase())
      );
    console.log("Customers filteredData:", result, { search });
    return result;
  }, [data, search]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("Customers paginatedData:", result, {
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
      customerId: "",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerAddress: "",
      customerCity: "",
      customerCountry: "",
      customerZip: "",
      customerStatus: "Active",
      customerImage: "",
    });
    console.log("Customers handleAddClick: Modal opened for add");
  };

  const handleEdit = (customer: Customer) => {
    setFormMode("edit");
    setForm(customer);
    console.log("Customers handleEdit: Modal opened for edit", { customer });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.customerName.trim() ||
      !form.customerEmail.trim() ||
      !form.customerPhone.trim() ||
      !form.customerAddress.trim() ||
      !form.customerCity.trim() ||
      !form.customerCountry.trim() ||
      !form.customerZip.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.customerEmail)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (
      data.some(
        (customer) =>
          customer.customerEmail.toLowerCase() === form.customerEmail.toLowerCase() &&
          (formMode === "edit" ? customer.customerId !== form.customerId : true)
      )
    ) {
      alert("Email must be unique.");
      return;
    }
    if (formMode === "add") {

      const newId = generateUniqueId("CUST", 10);
      setData((prev) => [...prev, { customerId: newId, ...form }]);
      const totalPages = Math.ceil((filteredData.length + 1) / itemsPerPage);
      setCurrentPage(totalPages);
    } else if (formMode === "edit" && form.customerId !== "") {
      setData((prev) =>
        prev.map((item) => (item.customerId === form.customerId ? { ...item, ...form } : item))
      );
    }
    setFormMode(null);
    console.log("Customers handleFormSubmit:", { form, formMode });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setData((prev) => prev.filter((d) => d.customerId !== id));
      const totalPages = Math.ceil((filteredData.length - 1) / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
        console.log("Customers handleDelete: Adjusted to last page", {
          id,
          currentPage,
          totalPages,
        });
      } else if (totalPages === 0) {
        setCurrentPage(1);
        console.log("Customers handleDelete: Reset to page 1 (no data)", {
          id,
          currentPage,
          totalPages,
        });
      }
      console.log("Customers handleDelete:", { id, totalPages });
    }
  };

  const handleClear = () => {
    loadData();
    setFormMode(null);
    setSearch("");
    setCurrentPage(1);
    console.log("Customers handleClear");
  };

  const handleReport = () => {
    alert("Customer Report:\n\n" + JSON.stringify(data, null, 2));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    console.log("Customers handleSearchChange:", {
      search: e.target.value,
      currentPage: 1,
    });
  };

  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      console.log("Customers handlePageChange:", {
        page,
        totalPages,
        currentPage,
      });
    } else {
      console.warn("Customers handlePageChange: Invalid page or same page", {
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
      key: "name",
      label: "Name",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
    { key: "city", label: "City" },
    { key: "country", label: "Country" },
    { key: "zip", label: "Zip Code" },
    { key: "status", label: "Status", render: renderStatusBadge },
  ];

  const rowActions = (row: Customer) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit customer ${row.customerName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit customer</span>
      </button>
      <button
        onClick={() => handleDelete(row.customerId)}
        aria-label={`Delete customer ${row.customerName}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete customer</span>
      </button>
    </>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Customer Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.customerName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter customer name"
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
          value={form.customerEmail}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter email"
          required
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">
          Phone <span className="text-destructive">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={form.customerPhone}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter phone number"
          required
        />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-1">
          Address <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={form.customerAddress}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter address"
          required
        />
      </div>
      <div>
        <label htmlFor="city" className="block text-sm font-medium mb-1">
          City <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={form.customerCity}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter city"
          required
        />
      </div>
      <div>
        <label htmlFor="country" className="block text-sm font-medium mb-1">
          Country <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="country"
          name="country"
          value={form.customerCountry}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter country"
          required
        />
      </div>
      <div>
        <label htmlFor="zip" className="block text-sm font-medium mb-1">
          Zip Code <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="zip"
          name="zip"
          value={form.customerZip}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter zip code"
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
          value={form.customerStatus}
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
      title="Customers"
      description="Manage customers for your application."

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
      modalTitle={formMode === "add" ? "Add Customer" : "Edit Customer"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      loading={loading}
    />
  );
}
