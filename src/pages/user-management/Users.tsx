import React, { useState, useEffect, useMemo, useRef } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { ROLES, STATUSES } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: (typeof ROLES)[number];
  status: (typeof STATUSES)[number];
  image: string;
};

export default function Users() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [data, setData] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);

  // Form state WITHOUT password
  const [form, setForm] = useState<Omit<User, "id"> & { id: number | null }>({
    id: null,
    name: "",
    email: "",
    phone: "",
    role: ROLES[0],
    status: STATUSES[0],
    image: "",
  });

  const [preview, setPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);

  // Separate password states (only for Add)
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<{ status: { code: string }; result: User[] }>("Users");
      if (response.status.code === "S") {
        setData(response.result || []);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.status.toLowerCase().includes(q)
    );
  }, [search, data]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
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
      image: "",
    });
    setPreview("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleRefresh = () => {
    loadData();
    setFormMode(null);
    setSearch("");
    setCurrentPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearch(q);
    setCurrentPage(1);
  };

  const handleEdit = (user: User) => {
    setFormMode("edit");
    setForm(user);
    setPreview(user.image);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Delete this user?")) return;
    setData((prev) => prev.filter((u) => u.id !== id));
  };

  const handlePageChange = (page: number) => {
    const pages = Math.ceil(filteredUsers.length / itemsPerPage);
    if (page >= 1 && page <= pages) setCurrentPage(page);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be ≤ 2 MB");
      return;
    }
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      alert("Only JPEG/PNG allowed");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setForm((f) => ({ ...f, image: base64 }));
      setPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      alert("Name and Email are required.");
      return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email)) {
      alert("Invalid email.");
      return;
    }

    if (formMode === "add") {
      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
      }
    }

    if (formMode === "add") {
      const newId = data.length ? Math.max(...data.map((u) => u.id)) + 1 : 1;
      setData((prev) => [...prev, { ...form, id: newId }]);
    } else if (formMode === "edit" && form.id !== null) {
      setData((prev) => prev.map((u) => (u.id === form.id ? form : u)));
    }

    setFormMode(null);
  };

  const columns: Column[] = [
    {
      key: "name",
      label: "Name",
      render: (_, row: User) => (
        <div className="flex items-center gap-3">
          {row.image ? (
            <img
              src={row.image}
              alt={row.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-white">
              {row.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status", render: renderStatusBadge },
  ];

  const rowActions = (row: User) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white rounded-lg text-xs p-2 inline-flex items-center me-1"
      >
        <i className="fa fa-edit" />
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white rounded-lg text-xs p-2 inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" />
      </button>
    </>
  );

  const modalForm = () => (
    <div className="space-y-6">
      {/* Image Upload */}
      <div className="flex items-start gap-4">
        <div className="relative">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover border"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 border flex items-center justify-center text-2xl font-bold text-gray-500">
              {form.name.charAt(0).toUpperCase() || "?"}
            </div>
          )}
          {preview && (
            <button
              type="button"
              onClick={() => {
                setPreview("");
                setForm((f) => ({ ...f, image: "" }));
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
            >
              X
            </button>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleImageChange}
            className="hidden"
            id="user-image"
          />
          <label
            htmlFor="user-image"
            className="cursor-pointer inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Change Image
          </label>
          <p className="text-xs text-muted-foreground mt-1">
            JPEG, PNG up to 2 MB
          </p>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            User <span className="text-destructive">*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleInputChange}
            className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter full name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Role <span className="text-destructive">*</span>
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleInputChange}
            className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Email <span className="text-destructive">*</span>
          </label>
          <input
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
          <label className="block text-sm font-medium mb-1">
            Phone <span className="text-destructive">*</span>
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleInputChange}
            className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter phone number"
            required
          />
        </div>

        {/* Password Fields – Only on Add */}
        {formMode === "add" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                Password <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring pr-10"
                  placeholder="••••••••"
                  required
                />
                <i className="fa fa-sync absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Password <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring pr-10"
                  placeholder="••••••••"
                  required
                />
                <i className="fa fa-sync absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer" />
              </div>
            </div>
          </>
        )}

        {/* Status Toggle */}
        <div className="md:col-span-2 flex items-center justify-between">
          <label className="text-sm font-medium">Status</label>
          <button
            type="button"
            onClick={() =>
              setForm((f) => ({
                ...f,
                status: f.status === "Active" ? "Inactive" : "Active",
              }))
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              form.status === "Active" ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                form.status === "Active" ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Users"
      description="Manage users and their roles for your application."
      onAddClick={handleAddClick}
      onRefresh={handleRefresh}
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
      loading={loading}
    />
  );
}