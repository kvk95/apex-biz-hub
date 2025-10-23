import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";
import { ROLES, STATUSES } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: (typeof ROLES)[number];
  status: (typeof STATUSES)[number];
};

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => JSX.Element;
}

export default function Users() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [data, setData] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<User>({
    id: null as number | null,
    name: "",
    email: "",
    phone: "",
    role: ROLES[0],
    status: STATUSES[0],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<User[]>("Users");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("Users loadData:", { data: response.result });
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredUsers = useMemo(() => {
    const result = !search.trim()
      ? data
      : data.filter(
          (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.phone.toLowerCase().includes(search.toLowerCase()) ||
            u.role.toLowerCase().includes(search.toLowerCase()) ||
            u.status.toLowerCase().includes(search.toLowerCase())
        );
    console.log("Users filteredUsers:", result, { search });
    return result;
  }, [search, data]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredUsers.slice(start, end);
    console.log("Users paginatedUsers:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
      totalItems: filteredUsers.length,
    });
    return result;
  }, [currentPage, itemsPerPage, filteredUsers]);

  const handleAddClick = () => {
    setFormMode("add");
    setForm({
      id: null,
      name: "",
      email: "",
      phone: "",
    role: ROLES[0],
    status: STATUSES[0],
    });
    console.log("Users handleAddClick: Modal opened for add");
  };

  const handleRefresh = () => {
    loadData();
    setFormMode(null);
    setSearch("");
    setCurrentPage(1);
    console.log("Users handleRefresh");
  };

  const handleReport = () => {
    alert("Users Report:\n\n" + JSON.stringify(data, null, 2));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    console.log("Users handleSearchChange:", {
      search: e.target.value,
      currentPage: 1,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleEdit = (user: User) => {
    setFormMode("edit");
    setForm(user);
    console.log("Users handleEdit: Modal opened for edit", { user });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setData((prev) => prev.filter((u) => u.id !== id));
      const totalPages = Math.ceil((filteredUsers.length - 1) / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
        console.log("Users handleDelete: Adjusted to last page", {
          id,
          currentPage,
          totalPages,
        });
      } else if (totalPages === 0) {
        setCurrentPage(1);
        console.log("Users handleDelete: Reset to page 1 (no data)", {
          id,
          currentPage,
          totalPages,
        });
      }
      console.log("Users handleDelete:", { id, totalPages });
    }
  };

  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      console.log("Users handlePageChange:", { page, totalPages, currentPage });
    } else {
      console.warn("Users handlePageChange: Invalid page or same page", {
        page,
        totalPages,
        currentPage,
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      alert("Name and Email are required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (formMode === "edit" && form.id !== null) {
      setData((prev) =>
        prev.map((u) => (u.id === form.id ? { ...form, id: form.id } : u))
      );
    } else if (formMode === "add") {
      const newId = data.length ? Math.max(...data.map((u) => u.id)) + 1 : 1;
      setData((prev) => [...prev, { ...form, id: newId }]);
      const totalPages = Math.ceil((filteredUsers.length + 1) / itemsPerPage);
      setCurrentPage(totalPages);
    }
    setFormMode(null);
    console.log("Users handleFormSubmit:", { form, formMode });
  };

  const columns: Column[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status", render: renderStatusBadge },
  ];

  const rowActions = (row: User) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit user ${row.name}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit user</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete user ${row.name}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete user</span>
      </button>
    </>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name <span className="text-destructive">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter full name"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email <span className="text-destructive">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter email address"
          required
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter phone number"
        />
      </div>
      <div>
        <label htmlFor="role" className="block text-sm font-medium mb-1">
          Role
        </label>
        <select
          id="role"
          name="role"
          value={form.role}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
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
      title="Users"
      description="Manage users and their roles for your application."
      icon="fa fa-user"
      onAddClick={handleAddClick}
      onRefresh={handleRefresh}
      onReport={handleReport}
      search={search}
      onSearchChange={handleSearchChange}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredUsers.length}
      onPageChange={handlePageChange}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedUsers}
      rowActions={rowActions}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={formMode === "add" ? "Add New User" : "Edit User"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
    />
  );
}
