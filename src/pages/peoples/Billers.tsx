import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";

interface Biller {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  gstNo: string;
  createdAt: string;
}

export default function Billers() {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState({
    id: null as number | null,
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    gstNo: "",
    createdAt: "",
  });
  const [billers, setBillers] = useState<Biller[]>([]);
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
    const response = await apiService.get<Biller[]>("Billers");
    if (response.status.code === "S") {
      setBillers(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("Billers loadData:", { data: response.result });
  };

  const filteredData = useMemo(() => {
    const result = !search.trim()
      ? billers
      : billers.filter(
          (biller) =>
            biller.name.toLowerCase().includes(search.toLowerCase()) ||
            biller.email.toLowerCase().includes(search.toLowerCase())
        );
    console.log("Billers filteredData:", result, { search });
    return result;
  }, [billers, search]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("Billers paginatedData:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
      totalItems: filteredData.length,
    });
    return result;
  }, [filteredData, currentPage, itemsPerPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setFormMode("add");
    setForm({
      id: null,
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      postalCode: "",
      gstNo: "",
      createdAt: "",
    });
    console.log("Billers handleAddClick: Modal opened for add");
  };

  const handleEdit = (biller: Biller) => {
    setFormMode("edit");
    setForm({
      id: biller.id,
      name: biller.name,
      email: biller.email,
      phone: biller.phone,
      address: biller.address,
      city: biller.city,
      country: biller.country,
      postalCode: biller.postalCode,
      gstNo: biller.gstNo,
      createdAt: biller.createdAt,
    });
    console.log("Billers handleEdit: Modal opened for edit", { biller });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.country.trim() ||
      !form.postalCode.trim() ||
      !form.gstNo.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (
      billers.some(
        (biller) =>
          biller.gstNo.toLowerCase() === form.gstNo.toLowerCase() &&
          (formMode === "edit" ? biller.id !== form.id : true)
      )
    ) {
      alert("GST No must be unique.");
      return;
    }
    if (formMode === "add") {
      const newBiller: Biller = {
        id: billers.length ? Math.max(...billers.map((b) => b.id)) + 1 : 1,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        country: form.country.trim(),
        postalCode: form.postalCode.trim(),
        gstNo: form.gstNo.trim(),
        createdAt: form.createdAt || new Date().toISOString().split("T")[0],
      };
      setBillers((prev) => [...prev, newBiller]);
      const totalPages = Math.ceil((filteredData.length + 1) / itemsPerPage);
      setCurrentPage(totalPages);
    } else if (formMode === "edit" && form.id !== null) {
      setBillers((prev) =>
        prev.map((b) =>
          b.id === form.id
            ? {
                id: form.id,
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                address: form.address.trim(),
                city: form.city.trim(),
                country: form.country.trim(),
                postalCode: form.postalCode.trim(),
                gstNo: form.gstNo.trim(),
                createdAt: form.createdAt || b.createdAt,
              }
            : b
        )
      );
    }
    setFormMode(null);
    console.log("Billers handleFormSubmit:", { form, formMode });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this biller?")) {
      setBillers((prev) => prev.filter((b) => b.id !== id));
      const totalPages = Math.ceil((filteredData.length - 1) / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
        console.log("Billers handleDelete: Adjusted to last page", {
          id,
          currentPage,
          totalPages,
        });
      } else if (totalPages === 0) {
        setCurrentPage(1);
        console.log("Billers handleDelete: Reset to page 1 (no data)", {
          id,
          currentPage,
          totalPages,
        });
      }
      console.log("Billers handleDelete:", { id, totalPages });
    }
  };

  const handleClear = () => {
    loadData();
    setFormMode(null);
    setSearch("");
    setCurrentPage(1);
    console.log("Billers handleClear");
  };

  const handleReport = () => {
    alert("Billers Report:\n\n" + JSON.stringify(billers, null, 2));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    console.log("Billers handleSearchChange:", {
      search: e.target.value,
      currentPage: 1,
    });
  };

  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      console.log("Billers handlePageChange:", {
        page,
        totalPages,
        currentPage,
      });
    } else {
      console.warn("Billers handlePageChange: Invalid page or same page", {
        page,
        totalPages,
        currentPage,
      });
    }
  };

  const columns: Column[] = [
    {
      key: "name",
      label: "Name",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    {
      key: "address",
      label: "Address",
      render: (value, row) => (
        <span>
          {row.address},<br /> {row.city}, {row.country}
        </span>
      ),
    },
    { key: "postalCode", label: "Postal Code" },
    { key: "gstNo", label: "GST No" },
    { key: "createdAt", label: "Created At" },
  ];

  const rowActions = (row: Biller) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit biller ${row.name}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit biller</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete biller ${row.name}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete biller</span>
      </button>
    </>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter name"
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
          value={form.phone}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter phone"
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
          value={form.address}
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
          value={form.city}
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
          value={form.country}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter country"
          required
        />
      </div>
      <div>
        <label htmlFor="postalCode" className="block text-sm font-medium mb-1">
          Postal Code <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="postalCode"
          name="postalCode"
          value={form.postalCode}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter postal code"
          required
        />
      </div>
      <div>
        <label htmlFor="gstNo" className="block text-sm font-medium mb-1">
          GST No <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="gstNo"
          name="gstNo"
          value={form.gstNo}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter GST No"
          required
        />
      </div>
      <div>
        <label htmlFor="createdAt" className="block text-sm font-medium mb-1">
          Created At
        </label>
        <input
          type="date"
          id="createdAt"
          name="createdAt"
          value={form.createdAt}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Billers"
      description="Manage billers for your application."
      
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
      modalTitle={formMode === "add" ? "Add Biller" : "Edit Biller"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit} loading={loading}
    />
  );
}
