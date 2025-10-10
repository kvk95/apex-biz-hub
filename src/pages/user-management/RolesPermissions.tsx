import React, { useState, useEffect } from "react";

type Role = {
  id: number;
  roleName: string;
  description: string;
  status: "Active" | "Inactive";
};

const rolesData: Role[] = [
  {
    id: 1,
    roleName: "Administrator",
    description: "Full access to all system features and settings.",
    status: "Active",
  },
  {
    id: 2,
    roleName: "Manager",
    description: "Manage teams and projects with limited settings access.",
    status: "Active",
  },
  {
    id: 3,
    roleName: "Editor",
    description: "Can edit content but has no access to system settings.",
    status: "Active",
  },
  {
    id: 4,
    roleName: "Viewer",
    description: "Can view content but cannot make changes.",
    status: "Inactive",
  },
  {
    id: 5,
    roleName: "Guest",
    description: "Limited access for guest users with minimal permissions.",
    status: "Inactive",
  },
  {
    id: 6,
    roleName: "Support",
    description: "Access to support tickets and customer queries.",
    status: "Active",
  },
  {
    id: 7,
    roleName: "HR",
    description: "Manage employee records and payroll.",
    status: "Active",
  },
  {
    id: 8,
    roleName: "Finance",
    description: "Access to financial reports and billing.",
    status: "Active",
  },
  {
    id: 9,
    roleName: "Developer",
    description: "Access to development tools and logs.",
    status: "Active",
  },
  {
    id: 10,
    roleName: "Marketing",
    description: "Manage campaigns and marketing content.",
    status: "Active",
  },
  {
    id: 11,
    roleName: "Sales",
    description: "Access to sales data and client management.",
    status: "Active",
  },
  {
    id: 12,
    roleName: "Intern",
    description: "Temporary access with limited permissions.",
    status: "Inactive",
  },
];

const pageSize = 5;

export default function RolesPermissions() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [roles, setRoles] = useState<Role[]>(rolesData);

  // Form state for Add/Edit Role
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [formRoleName, setFormRoleName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");
  const [editRoleId, setEditRoleId] = useState<number | null>(null);

  // Pagination calculations
  const totalPages = Math.ceil(roles.length / pageSize);
  const pagedRoles = roles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddClick = () => {
    setFormMode("add");
    setFormRoleName("");
    setFormDescription("");
    setFormStatus("Active");
    setEditRoleId(null);
  };

  const handleEditClick = (role: Role) => {
    setFormMode("edit");
    setFormRoleName(role.roleName);
    setFormDescription(role.description);
    setFormStatus(role.status);
    setEditRoleId(role.id);
  };

  const handleDeleteClick = (id: number) => {
    if (confirm("Are you sure you want to delete this role?")) {
      setRoles((prev) => prev.filter((r) => r.id !== id));
      // Adjust page if needed
      if ((roles.length - 1) % pageSize === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRoleName.trim()) {
      alert("Role Name is required.");
      return;
    }
    if (formMode === "add") {
      const newRole: Role = {
        id: roles.length ? Math.max(...roles.map((r) => r.id)) + 1 : 1,
        roleName: formRoleName.trim(),
        description: formDescription.trim(),
        status: formStatus,
      };
      setRoles((prev) => [...prev, newRole]);
      setCurrentPage(totalPages + (roles.length % pageSize === 0 ? 1 : 0));
    } else if (formMode === "edit" && editRoleId !== null) {
      setRoles((prev) =>
        prev.map((r) =>
          r.id === editRoleId
            ? { ...r, roleName: formRoleName.trim(), description: formDescription.trim(), status: formStatus }
            : r
        )
      );
    }
    setFormMode(null);
    setEditRoleId(null);
  };

  const handleRefresh = () => {
    // Reset to initial data and first page
    setRoles(rolesData);
    setCurrentPage(1);
    setFormMode(null);
    setEditRoleId(null);
  };

  const handleReport = () => {
    // For demo: alert JSON of roles
    alert("Roles Report:\n\n" + JSON.stringify(roles, null, 2));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">Roles & Permissions</h1>

      {/* Controls: Add Role, Refresh, Report */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
        <button
          onClick={handleAddClick}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded shadow transition"
          type="button"
          aria-label="Add Role"
        >
          Add Role
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded shadow transition"
            type="button"
            aria-label="Refresh Roles"
          >
            Refresh
          </button>
          <button
            onClick={handleReport}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition"
            type="button"
            aria-label="Generate Report"
          >
            Report
          </button>
        </div>
      </div>

      {/* Roles Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-700 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 font-medium text-gray-700 uppercase tracking-wider">Role Name</th>
              <th className="px-6 py-3 font-medium text-gray-700 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 font-medium text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 font-medium text-gray-700 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pagedRoles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No roles found.
                </td>
              </tr>
            ) : (
              pagedRoles.map((role, idx) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{(currentPage - 1) * pageSize + idx + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{role.roleName}</td>
                  <td className="px-6 py-4 whitespace-normal max-w-xl">{role.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        role.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {role.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                    <button
                      onClick={() => handleEditClick(role)}
                      className="text-orange-600 hover:text-orange-800 font-semibold focus:outline-none"
                      aria-label={`Edit role ${role.roleName}`}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(role.id)}
                      className="text-red-600 hover:text-red-800 font-semibold focus:outline-none"
                      aria-label={`Delete role ${role.roleName}`}
                      type="button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <nav
        className="flex items-center justify-center mt-6 space-x-1"
        aria-label="Pagination Navigation"
      >
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-l border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label="Previous Page"
          type="button"
        >
          &laquo;
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-1 border-t border-b border-gray-300 hover:bg-gray-100 focus:outline-none ${
              page === currentPage
                ? "bg-orange-500 text-white font-semibold"
                : "bg-white text-gray-700"
            }`}
            aria-current={page === currentPage ? "page" : undefined}
            type="button"
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-r border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label="Next Page"
          type="button"
        >
          &raquo;
        </button>
      </nav>

      {/* Add/Edit Role Form Modal */}
      {(formMode === "add" || formMode === "edit") && (
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
                  value={formRoleName}
                  onChange={(e) => setFormRoleName(e.target.value)}
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
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
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
                  value={formStatus}
                  onChange={(e) =>
                    setFormStatus(e.target.value as "Active" | "Inactive")
                  }
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
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded shadow transition"
                >
                  {formMode === "add" ? "Save" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}