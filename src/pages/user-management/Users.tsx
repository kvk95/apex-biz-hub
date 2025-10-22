import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";

const ROLES = ["Admin", "User"];
const STATUS = ["Active", "Inactive"];

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
};

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => JSX.Element;
}

export default function Users() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [data, setData] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  // Form state
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState({
    id: null as number | null,
    name: "",
    email: "",
    phone: "",
    role: "User",
    status: "Active",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data fetching
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
    console.log("loadData:", { data: response.result });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter data
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
    console.log("filteredUsers:", result, { search });
    return result;
  }, [search, data]);

  // Paginated data
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredUsers.slice(start, end);
    console.log("paginatedUsers:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
    });
    return result;
  }, [currentPage, itemsPerPage, filteredUsers]);

  // Handlers
  const handleAddClick = () => {
    setFormMode("add");
    setForm({
      id: null,
      name: "",
      email: "",
      phone: "",
      role: "User",
      status: "Active",
    });
  };

  const handleRefresh = () => {
    loadData();
    setFormMode(null);
    setSearch("");
    setCurrentPage(1);
    console.log("handleRefresh");
  };

  const handleReport = () => {
    alert("Users Report:\n\n" + JSON.stringify(data, null, 2));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    console.log("handleSearchChange:", { search: e.target.value });
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
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setData((prev) => prev.filter((u) => u.id !== id));
      const totalPages = Math.ceil((filteredUsers.length - 1) / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      } else if (totalPages === 0) {
        setCurrentPage(1);
      }
      console.log("handleDelete:", { id, totalPages });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      alert("Name and Email are required.");
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
    console.log("handleFormSubmit:", { form, formMode });
  };

  // Table columns
  const columns: Column[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "role", label: "Role" },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
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

  // Modal
  const modal = (themeStyles: ThemeStyles) => {
    return formMode === "add" || formMode === "edit" ? (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 mx-4">
          <h2
            id="modal-title"
            className="text-xl font-semibold text-gray-900 mb-4"
          >
            {formMode === "add" ? "Add New User" : "Edit User"}
          </h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name <span className="text-red-600">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email <span className="text-red-600">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder="Enter email address"
                required
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              >
                {STATUS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setFormMode(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded shadow transition"
              >
                Cancel
              </button>
              <button
              className="inline-flex items-center gap-2 text-white font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              style={
                {
                  backgroundColor: themeStyles.selectionBg,
                  "--hover-bg": themeStyles.hoverColor,
                } as React.CSSProperties
              }
              type="button"
                type="button"
              >
                {formMode === "add" ? "Save" : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    ) : null;
  };

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
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedUsers}
      rowActions={rowActions}
      modal={modal}
    />
  );
}
