import React, { useMemo, useEffect, useState } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const statusOptions = ["Active", "Inactive"];

const EmailTemplates: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedTemplate, setEditedTemplate] = useState<{
    title: string;
    subject: string;
    status: string;
  }>({ title: "", subject: "", status: statusOptions[0] });

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("EmailTemplates");
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

  // Filter and search
  const filteredTemplates = useMemo(() => {
    return data.filter((t: any) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "All" ? true : t.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [data, searchTerm, filterStatus]);

  // Paginated data slice
  const paginatedData = filteredTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Open edit modal and populate form
  const onEdit = (id: number) => {
    const tpl = data.find((t: any) => t.id === id);
    if (!tpl) return;
    setEditingId(id);
    setEditedTemplate({
      title: tpl.title,
      subject: tpl.subject,
      status: tpl.status,
    });
    setIsEditModalOpen(true);
  };

  // Cancel editing modal
  const onCancelEdit = () => {
    setEditingId(null);
    setEditedTemplate({ title: "", subject: "", status: statusOptions[0] });
    setIsEditModalOpen(false);
  };

  // Save changes from modal
  const onSave = () => {
    if (editingId === null) return;
    if (!editedTemplate.title.trim() || !editedTemplate.subject.trim()) {
      alert("Please fill all required fields.");
      return;
    }
    setData((prev: any[]) =>
      prev.map((t) =>
        t.id === editingId
          ? {
              ...t,
              title: editedTemplate.title.trim(),
              subject: editedTemplate.subject.trim(),
              status: editedTemplate.status,
            }
          : t
      )
    );
    setEditingId(null);
    setEditedTemplate({ title: "", subject: "", status: statusOptions[0] });
    setIsEditModalOpen(false);
  };

  const onDelete = (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this email template? This action cannot be undone."
      )
    ) {
      setData((prev) => prev.filter((t) => t.id !== id));
      if ((currentPage - 1) * itemsPerPage >= filteredTemplates.length - 1) {
        setCurrentPage(Math.max(currentPage - 1, 1));
      }
    }
  };

  // Clear button handler (replaces Refresh)
  const onClear = () => {
    setSearchTerm("");
    setFilterStatus("All");
    setCurrentPage(1);
    setEditingId(null);
    setEditedTemplate({ title: "", subject: "", status: statusOptions[0] });
  };

  const onReport = () => {
    alert("Report functionality is not implemented.");
  };

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      <h1 className="text-2xl font-semibold mb-6">Email Templates</h1>

      {/* Controls: Search, Filter, Clear, Report */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <input
            type="text"
            placeholder="Search by Title or Subject"
            className="w-full sm:w-72 border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Search email templates"
          />
          <select
            className="border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by status"
          >
            <option value="All">All Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClear}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
            aria-label="Clear filters"
          >
            <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
          </button>
          <button
            onClick={onReport}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
            aria-label="Generate report"
          >
            <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
          </button>
        </div>
      </div>

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Subject
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Created Date
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
                    No templates found.
                  </td>
                </tr>
              )}
              {paginatedData.map((tpl, idx) => (
                <tr
                  key={tpl.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">{tpl.title}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{tpl.subject}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        tpl.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {tpl.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {tpl.createdDate}
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => onEdit(tpl.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit template ${tpl.title}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => onDelete(tpl.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete template ${tpl.title}`}
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
          totalItems={filteredTemplates.length}
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
              Edit Email Template
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="editTitle"
                  className="block text-sm font-medium mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="editTitle"
                  name="title"
                  value={editedTemplate.title}
                  onChange={(e) =>
                    setEditedTemplate((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter title"
                />
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="editSubject"
                  className="block text-sm font-medium mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="editSubject"
                  name="subject"
                  value={editedTemplate.subject}
                  onChange={(e) =>
                    setEditedTemplate((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter subject"
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
                  value={editedTemplate.status}
                  onChange={(e) =>
                    setEditedTemplate((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onCancelEdit}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
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

export default EmailTemplates;