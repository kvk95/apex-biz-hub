import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";

type Role = {
  id: number;
  roleName: string;
  description: string;
  status: "Active" | "Inactive";
};

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => JSX.Element;
}

export default function RolesPermissions() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [data, setData] = useState<Role[]>([]);
  const [search, setSearch] = useState("");

  // Form state
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState({
    id: null as number | null,
    roleName: "",
    description: "",
    status: "Active" as "Active" | "Inactive",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data fetching
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
    console.log("loadData:", { data: response.result });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter data
  const filteredRoles = useMemo(() => {
    const result = !search.trim()
      ? data
      : data.filter((r) =>
          r.roleName.toLowerCase().includes(search.toLowerCase())
        );
    console.log("filteredRoles:", result, { search });
    return result;
  }, [search, data]);

  // Paginated data
  const paginatedRoles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredRoles.slice(start, end);
    console.log("paginatedRoles:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
    });
    return result;
  }, [currentPage, itemsPerPage, filteredRoles]);

  // Handlers
  const handleAddClick = () => {
    setFormMode("add");
    setForm({
      id: null,
      roleName: "",
      description: "",
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
    alert("Roles Report:\n\n" + JSON.stringify(data, null, 2));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    console.log("handleSearchChange:", { search: e.target.value });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handlePermission = (role: Role) => {
    setFormMode("edit");
    setForm({
      id: role.id,
      roleName: role.roleName,
      description: role.description,
      status: role.status,
    });
  };

  const handleEdit = (role: Role) => {
    setFormMode("edit");
    setForm({
      id: role.id,
      roleName: role.roleName,
      description: role.description,
      status: role.status,
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      setData((prev) => prev.filter((r) => r.id !== id));
      const totalPages = Math.ceil((filteredRoles.length - 1) / itemsPerPage);
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
    if (!form.roleName.trim()) {
      alert("Role Name is required.");
      return;
    }
    if (formMode === "add") {
      const newId = data.length ? Math.max(...data.map((r) => r.id)) + 1 : 1;
      setData((prev) => [...prev, { ...form, id: newId }]);
      const totalPages = Math.ceil((filteredRoles.length + 1) / itemsPerPage);
      setCurrentPage(totalPages);
    } else if (formMode === "edit" && form.id !== null) {
      setData((prev) =>
        prev.map((r) => (r.id === form.id ? { ...form, id: form.id } : r))
      );
    }
    setFormMode(null);
    console.log("handleFormSubmit:", { form, formMode });
  };

  // Table columns
  const columns: Column[] = [
    {
      key: "roleName",
      label: "Role",
      render: (value) => (
        <span className="font-semibold text-gray-900">{value}</span>
      ),
    },
    { key: "description", label: "Description" },
    {
      key: "createdDate",
      label: "Created Date",
      render: () => new Date().toLocaleDateString(),
    },
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
  const rowActions = (row: Role) => (
    <>
      <button
        onClick={() => handlePermission(row)}
        aria-label={`Edit permissions for ${row.roleName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-shield" aria-hidden="true"></i>
        <span className="sr-only">Permission</span>
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
            {formMode === "add" ? "Add New Role" : "Edit Role"}
          </h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="roleName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role Name <span className="text-red-600">*</span>
              </label>
              <input
                id="roleName"
                name="roleName"
                type="text"
                value={form.roleName}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                required
                autoFocus
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={form.description}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
              />
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedRoles}
      rowActions={rowActions}
      modal={modal}
    />
  );
}
