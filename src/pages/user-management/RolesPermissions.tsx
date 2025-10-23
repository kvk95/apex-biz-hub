import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";
import { STATUSES } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";

type Role = {
  id: number;
  roleName: string;
  description: string;
  status: (typeof STATUSES)[number];
  createdDate: string;
};

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => JSX.Element;
}

export default function RolesPermissions() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [data, setData] = useState<Role[]>([]);
  const [search, setSearch] = useState("");
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<Role>({
    id: null as number | null,
    roleName: "",
    description: "",
    status: STATUSES[0],
    createdDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<Role[]>("RolesPermissions");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("RolesPermissions loadData:", { data: response.result });
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRoles = useMemo(() => {
    const result = !search.trim()
      ? data
      : data.filter((r) =>
          r.roleName.toLowerCase().includes(search.toLowerCase())
        );
    console.log("RolesPermissions filteredRoles:", result, { search });
    return result;
  }, [search, data]);

  const paginatedRoles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredRoles.slice(start, end);
    console.log("RolesPermissions paginatedRoles:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
      totalItems: filteredRoles.length,
    });
    return result;
  }, [currentPage, itemsPerPage, filteredRoles]);

  const handleAddClick = () => {
    setFormMode("add");
    setForm({
      id: null,
      roleName: "",
      description: "",
      status: STATUSES[0],
      createdDate: "",
    });
    console.log("RolesPermissions handleAddClick: Modal opened for add");
  };

  const handleRefresh = () => {
    loadData();
    setFormMode(null);
    setSearch("");
    setCurrentPage(1);
    console.log("RolesPermissions handleRefresh");
  };

  const handleReport = () => {
    alert("Roles Report:\n\n" + JSON.stringify(data, null, 2));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    console.log("RolesPermissions handleSearchChange:", {
      search: e.target.value,
      currentPage: 1,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleEdit = (role: Role) => {
    setFormMode("edit");
    setForm(role);
    console.log("RolesPermissions handleEdit: Modal opened for edit", { role });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      setData((prev) => prev.filter((r) => r.id !== id));
      const totalPages = Math.ceil((filteredRoles.length - 1) / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
        console.log("RolesPermissions handleDelete: Adjusted to last page", {
          id,
          currentPage,
          totalPages,
        });
      } else if (totalPages === 0) {
        setCurrentPage(1);
        console.log(
          "RolesPermissions handleDelete: Reset to page 1 (no data)",
          { id, currentPage, totalPages }
        );
      }
      console.log("RolesPermissions handleDelete:", { id, totalPages });
    }
  };

  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      console.log("RolesPermissions handlePageChange:", {
        page,
        totalPages,
        currentPage,
      });
    } else {
      console.warn(
        "RolesPermissions handlePageChange: Invalid page or same page",
        { page, totalPages, currentPage }
      );
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.roleName.trim()) {
      alert("Role Name is required.");
      return;
    }
    if (
      data.some(
        (r) =>
          r.roleName.toLowerCase() === form.roleName.toLowerCase() &&
          (formMode === "add" || (formMode === "edit" && r.id !== form.id))
      )
    ) {
      alert("Role Name must be unique.");
      return;
    }
    if (formMode === "add") {
      const newId = data.length ? Math.max(...data.map((r) => r.id)) + 1 : 1;
      setData((prev) => [
        ...prev,
        { ...form, id: newId, createdDate: new Date().toISOString() },
      ]);
      const totalPages = Math.ceil((filteredRoles.length + 1) / itemsPerPage);
      setCurrentPage(totalPages);
    } else if (formMode === "edit" && form.id !== null) {
      setData((prev) =>
        prev.map((r) =>
          r.id === form.id
            ? { ...form, id: form.id, createdDate: r.createdDate }
            : r
        )
      );
    }
    setFormMode(null);
    console.log("RolesPermissions handleFormSubmit:", { form, formMode });
  };

  const columns: Column[] = [
    {
      key: "roleName",
      label: "Role",
      render: (value) => (
        <span className="font-semibold text-gray-900">{value}</span>
      ),
    },
    { key: "description", label: "Description" },
    { key: "createdDate", label: "Created Date" },
    { key: "status", label: "Status", render: renderStatusBadge },
  ];

  const rowActions = (row: Role) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit permissions for ${row.roleName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-shield" aria-hidden="true"></i>
        <span className="sr-only">Edit permissions</span>
      </button>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit role ${row.roleName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit role</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete role ${row.roleName}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete role</span>
      </button>
    </>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <label htmlFor="roleName" className="block text-sm font-medium mb-1">
          Role Name <span className="text-destructive">*</span>
        </label>
        <input
          id="roleName"
          name="roleName"
          type="text"
          value={form.roleName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter role name"
          required
          autoFocus
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={form.description}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          placeholder="Enter role description"
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
      title="Roles & Permissions"
      description="Manage roles and their permissions for your application."
      icon="fa fa-user-shield"
      onAddClick={handleAddClick}
      onRefresh={handleRefresh}
      onReport={handleReport}
      search={search}
      onSearchChange={handleSearchChange}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredRoles.length}
      onPageChange={handlePageChange}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedRoles}
      rowActions={rowActions}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={formMode === "add" ? "Add New Role" : "Edit Role"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
    />
  );
}
