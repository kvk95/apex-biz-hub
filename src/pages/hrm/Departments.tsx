import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const pageSizeOptions = [5, 10, 20];

const Departments: React.FC = () => {
  useEffect(() => {
    // Load data on mount
  }, []);

  // State for form inputs
  const [departmentName, setDepartmentName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");

  // State for table data and pagination
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // State for editing
  const [editId, setEditId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    departmentName: "",
    description: "",
    status: "Active",
  });

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Departments");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Pagination calculations
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, currentPage, pageSize]);

  // Handlers
  const resetForm = () => {
    setDepartmentName("");
    setDescription("");
    setStatus("Active");
    setEditId(null);
  };

  const handleSave = () => {
    if (!departmentName.trim()) {
      alert("Department Name is required.");
      return;
    }
    if (editId !== null) {
      // Edit existing
      setData((prev) =>
        prev.map((d) =>
          d.id === editId
            ? { ...d, departmentName, description, status }
            : d
        )
      );
    } else {
      // Add new
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [
        ...prev,
        { id: newId, departmentName, description, status },
      ]);
    }
    resetForm();
  };

  const handleEdit = (id: number) => {
    const dept = data.find((d) => d.id === id);
    if (dept) {
      setEditForm({
        departmentName: dept.departmentName,
        description: dept.description,
        status: dept.status,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this department?"
      )
    ) {
      setData((prev) => prev.filter((d) => d.id !== id));
      if ((currentPage - 1) * pageSize >= data.length - 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleClear = () => {
    resetForm();
    setCurrentPage(1);
    setPageSize(5);
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    if (
      !editForm.departmentName.trim() ||
      !editForm.description.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
              ...item,
              departmentName: editForm.departmentName,
              description: editForm.description,
              status: editForm.status,
            }
            : item
        )
      );
      setEditId(null);
      setIsEditModalOpen(false);
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setIsEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Departments</h1>

      {/* Form Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Department Name */}
          <div>
            <label
              htmlFor="departmentName"
              className="block text-sm font-medium mb-1"
            >
              Department Name
            </label>
            <input
              type="text"
              id="departmentName"
              name="departmentName"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter department name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter description"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
          </button>

          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
          </button>

          <button
            onClick={() => alert("Report generated")}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
          </button>
        </div>
      </section>

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Department Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No departments found.
                  </td>
                </tr>
              )}
              {paginatedData.map((dept, idx) => (
                <tr
                  key={dept.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {(currentPage - 1) * pageSize + idx + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {dept.departmentName}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {dept.description}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${dept.status === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                    >
                      {dept.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(dept.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit department ${dept.departmentName}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(dept.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete department ${dept.departmentName}`}
                      type="button"
                    >
                      <i className="fa fa-trash fa-light" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          itemsPerPage={pageSize}
          totalItems={data.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </section>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-modal-title"
        >
          <div className="bg-white rounded shadow-lg max-w-xl w-full p-6 relative">
            <h2
              id="edit-modal-title"
              className="text-xl font-semibold mb-4 text-center"
            >
              Edit Department
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Department Name */}
              <div>
                <label
                  htmlFor="editDepartmentName"
                  className="block text-sm font-medium mb-1"
                >
                  Department Name
                </label>
                <input
                  type="text"
                  id="editDepartmentName"
                  name="departmentName"
                  value={editForm.departmentName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter department name"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="editDescription"
                  className="block text-sm font-medium mb-1"
                >
                  Description
                </label>
                <textarea
                  id="editDescription"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditInputChange}
                  rows={3}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter description"
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="editStatus"
                  className="block text-sm font-medium mb-1"
                >
                  Status
                </label>
                <select
                  id="editStatus"
                  name="status"
                  value={editForm.status}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleEditCancel}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;