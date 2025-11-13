import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";
import { DEFAULT_PAGE_SIZE } from "@/constants/constants";
import { SearchInput } from "@/components/Search/SearchInput";
import { Pagination } from "@/components/Pagination/Pagination";

interface ModulePermission {
  module: string;
  allowAll: boolean;
  read: boolean;
  write: boolean;
  create: boolean;
  delete: boolean;
  import: boolean;
  export: boolean;
}

interface Role {
  id: number;
  roleName: string;
}

export default function Permissions() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const role: Role = state?.roleRecord || { id: 0, roleName: "Unknown" };
  const [permissions, setPermissions] = useState<ModulePermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_PAGE_SIZE);

  // Load permissions
  useEffect(() => {
    loadPermissions();
  }, [role.id]);

  const loadPermissions = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<ModulePermission[]>(`Permissions`);
      if (response.status.code === "S") {
        setPermissions(response.result);
      } else {
        setPermissions([]);
      }
    } catch {
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter & Pagination
  const filteredModules = useMemo(() => {
    return !search.trim()
      ? permissions
      : permissions.filter((m) =>
          m.module.toLowerCase().includes(search.toLowerCase())
        );
  }, [search, permissions]);

  const paginatedModules = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredModules.slice(start, end);
  }, [currentPage, itemsPerPage, filteredModules]);

  // Handlers
  const handlePermissionChange = (
    module: string,
    field: keyof Omit<ModulePermission, "module">
  ) => {
    setPermissions((prev) =>
      prev.map((p) =>
        p.module === module
          ? {
              ...p,
              [field]: !p[field],
              allowAll: field !== "allowAll" ? false : !p.allowAll,
            }
          : p
      )
    );
  };

  const handleAllowAll = (module: string) => {
    const perm = permissions.find((p) => p.module === module);
    if (!perm) return;
    const newAllowAll = !perm.allowAll;
    setPermissions((prev) =>
      prev.map((p) =>
        p.module === module
          ? {
              ...p,
              allowAll: newAllowAll,
              read: newAllowAll,
              write: newAllowAll,
              create: newAllowAll,
              delete: newAllowAll,
              import: newAllowAll,
              export: newAllowAll,
            }
          : p
      )
    );
  };

  const handleSave = async () => {
    try {
      const response = await apiService.post(`Permissions/${role.id}`, {
        permissions,
      });
      if (response.status.code === "S") {
        alert("Permissions saved successfully!");
      }
    } catch {
      alert("Failed to save permissions.");
    }
  };

  const handleBack = () => {
    navigate("/user-management/roles-permissions");
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // Custom Header – Back Button
  const customHeaderFields = () => (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 bg-blue-950 hover:bg-blue-800 text-white font-medium px-4 py-2 rounded"
    >
      <i className="fa fa-arrow-left"></i> Back to Roles
    </button>
  );

  return (
    <PageBase1
      title="Permissions"
      description={
        <>
          Manage permissions for <strong>Role:</strong>{" "}
          <span className="theme-color-text font-semibold uppercase text-sm">
            {role.roleName}
          </span>
        </>
      }
      icon="fa fa-shield"
      search={search}
      onSearchChange={handleSearchChange}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredModules.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      loading={loading}
      customHeaderFields={customHeaderFields}
    >
      {/* Children – Permissions Table */}
      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full px-3 py-2">
          <SearchInput
            value={search}
            onSearch={handleSearchChange}
            placeholder="Search modules..."
            className="w-full sm:max-w-xs"
          />
          <div className="text-sm font-medium text-foreground">
            Role:{" "}
            <span className="theme-color-text text-lg font-semibold uppercase">
              {role.roleName}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Modules
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Allow All
                </th>
                {[
                  { label: "Read", icon: "fa-eye" },
                  { label: "Write", icon: "fa-pen" },
                  { label: "Create", icon: "fa-plus" },
                  { label: "Delete", icon: "fa-trash" },
                  { label: "Import", icon: "fa-file-import" },
                  { label: "Export", icon: "fa-file-export" },
                ].map((item) => (
                  <th
                    key={item.label}
                    className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    <i
                      className={`fa ${item.icon} mr-1 fa-light`}
                      aria-hidden="true"
                    ></i>
                    {item.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {paginatedModules.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-muted-foreground italic"
                  >
                    No modules found.
                  </td>
                </tr>
              ) : (
                paginatedModules.map((perm) => (
                  <tr key={perm.module} className="hover:bg-muted/50">
                    <td className="px-6 py-3 font-medium text-foreground">
                      {perm.module}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={perm.allowAll}
                        onChange={() => handleAllowAll(perm.module)}
                        className="w-4 h-4 theme-color-text border-gray-300 rounded focus:ring-primary"
                      />
                    </td>
                    {[
                      "read",
                      "write",
                      "create",
                      "delete",
                      "import",
                      "export",
                    ].map((field) => (
                      <td key={field} className="px-6 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={perm[field as keyof typeof perm]}
                          onChange={() =>
                            handlePermissionChange(
                              perm.module,
                              field as keyof Omit<ModulePermission, "module">
                            )
                          }
                          disabled={perm.allowAll}
                          className="w-4 h-4 theme-color-text bg-neutral-secondary-medium border-default-medium rounded-xs focus:ring-red-500 dark:focus:ring-red-600 ring-offset-neutral-primary focus:ring-2"
                        />
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border">
          <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredModules.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setItemsPerPage}
          />
        </div>

        {/* Save Button */}
        <div className="p-4 border-t border-border flex justify-end">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2 rounded shadow"
          >
            <i className="fa fa-save"></i> Save Permissions
          </button>
        </div>
      </div>
    </PageBase1>
  );
}
