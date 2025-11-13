import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { USER_ROLE_STATUSES } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";
import { useNavigate } from "react-router-dom";
import { SearchInput } from "@/components/Search/SearchInput";

type Role = {
  id: number;
  roleName: string;
  status: (typeof USER_ROLE_STATUSES)[number];
  createdDate: string;
};

export default function RolesPermissions() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [data, setData] = useState<Role[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<Role>({
    id: null as number | null,
    roleName: "",
    status: USER_ROLE_STATUSES[0],
    createdDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

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
    return data.filter((item) => {
      // Search filter
      const matchesSearch =
        !search.trim() ||
        item.roleName.toLowerCase().includes(search.toLowerCase());

      // Status filter
      const matchesStatus =
        !statusFilter ||
        statusFilter === "All Status" ||
        item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

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
      status: USER_ROLE_STATUSES[0],
      createdDate: "",
    });
    console.log("RolesPermissions handleAddClick: Modal opened for add");
  };

  const handleRefresh = () => {
    loadData();
    setFormMode(null);
    setSearch("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Roles Report:\n\n" + JSON.stringify(data, null, 2));
  };

  const handleSearchChange = (query) => {
    setSearch(query);
    setCurrentPage(1);
    console.log("RolesPermissions handleSearchChange:", {
      search: query,
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

  const handlePermissionClick = (role: Role) => {
    navigate("/user-management/permissions", {
      state: {
        mode: "edit",
        roleRecord: role,
      },
    });
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
    { key: "createdDate", label: "Created Date", align: "center" },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: renderStatusBadge,
    },
  ];

  const rowActions = (row: Role) => (
    <>
      <button
        onClick={() => handlePermissionClick(row)}
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const customFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <div className="flex items-center">
        <SearchInput
          className=""
          value={search}
          placeholder="Search by role name..."
          onSearch={handleSearchChange}
        />
      </div>
      <div className="flex justify-end">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Status</option>
          {USER_ROLE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </div>
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
          {USER_ROLE_STATUSES.map((status) => (
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
      loading={loading}
      customFilters={customFilters}
    />
  );
}
