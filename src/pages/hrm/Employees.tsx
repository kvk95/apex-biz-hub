import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const roles = ["Admin", "Manager", "Staff"];
const statuses = ["Active", "Inactive"];

const formFields = [
  { id: "name", label: "Name", type: "text" },
  { id: "email", label: "Email", type: "email" },
  { id: "role", label: "Role", type: "select", options: roles },
  { id: "status", label: "Status", type: "select", options: statuses },
  // Add all other fields exactly as in the reference
];

const Employees = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<any>({});
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [editId, setEditId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Employees");
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

  // Filter employees based on search
  const filteredEmployees = data.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate paginated data using Pagination component props
  const paginatedData = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle form input changes for Add Section
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission (Add Section)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields (e.g., name, email)
    if (!formData.name?.trim() || !formData.email?.trim()) {
      alert("Please fill all required fields.");
      return;
    }
    const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
    setData((prev) => [
      ...prev,
      {
        id: newId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role || roles[0],
        status: formData.status || statuses[0],
        joinDate: formData.joinDate || "",
      },
    ]);
    setFormData({});
    setCurrentPage(1);
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const employee = data.find((emp) => emp.id === id);
    if (employee) {
      setEditForm({
        name: employee.name,
        email: employee.email,
        role: employee.role,
        status: employee.status,
        joinDate: employee.joinDate || "",
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Handle edit modal input changes
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (!editForm.name?.trim() || !editForm.email?.trim()) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                name: editForm.name.trim(),
                email: editForm.email.trim(),
                role: editForm.role || roles[0],
                status: editForm.status || statuses[0],
                joinDate: editForm.joinDate || "",
              }
            : item
        )
      );
      setEditId(null);
      setIsEditModalOpen(false);
    }
  };

  // Cancel editing modal
  const handleEditCancel = () => {
    setEditId(null);
    setIsEditModalOpen(false);
  };

  // Handle delete
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      // If deleting last item on page, go to previous page if needed
      if (
        (currentPage - 1) * itemsPerPage >= data.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setFormData({});
    setEditId(null);
    setCurrentPage(1);
    setSearchTerm("");
  };

  // Report handler
  const handleReport = () => {
    alert("Report Data:\n" + JSON.stringify(data, null, 2));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6">Employees</h1>

      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search..."
            className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="fa fa-search fa-light absolute left-3 top-2.5 text-muted-foreground pointer-events-none"></i>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
          </button>
          <button
            onClick={handleReport}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
          </button>
        </div>
      </div>

      {/* Form Section (Add Section) - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Add Employee</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {formFields.map((field) => (
              <div key={field.id}>
                <label
                  htmlFor={field.id}
                  className="block text-sm font-medium mb-1"
                >
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    id={field.id}
                    name={field.id}
                    value={formData[field.id] || ""}
                    onChange={handleInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    value={formData[field.id] || ""}
                    onChange={handleInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder={field.label}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Join Date
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
                    colSpan={6}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No employees found.
                  </td>
                </tr>
              )}
              {paginatedData.map((employee, idx) => (
                <tr
                  key={employee.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {employee.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {employee.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {employee.role}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        employee.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {employee.joinDate || "-"}
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(employee.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit employee ${employee.name}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(employee.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete employee ${employee.name}`}
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
          itemsPerPage={itemsPerPage}
          totalItems={filteredEmployees.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
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
              Edit Employee
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {formFields.map((field) => (
                <div key={field.id}>
                  <label
                    htmlFor={"edit" + field.id}
                    className="block text-sm font-medium mb-1"
                  >
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <select
                      id={"edit" + field.id}
                      name={field.id}
                      value={editForm[field.id] || ""}
                      onChange={handleEditInputChange}
                      className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      id={"edit" + field.id}
                      name={field.id}
                      value={editForm[field.id] || ""}
                      onChange={handleEditInputChange}
                      className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder={field.label}
                    />
                  )}
                </div>
              ))}
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

export default Employees;