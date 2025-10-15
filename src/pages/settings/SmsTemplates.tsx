import { apiService } from "@/services/ApiService";
import React, { useEffect, useState } from "react";
import { Pagination } from "@/components/Pagination/Pagination";

const pageSizeOptions = [5, 10, 20];

export default function SmsTemplates() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [templates, setTemplates] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSizeOptions[0]);
  const [titleFilter, setTitleFilter] = useState("");
  const [messageFilter, setMessageFilter] = useState("");
  const [editingTemplate, setEditingTemplate] = useState<null | {
    id: number;
    title: string;
    message: string;
  }>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("SmsTemplates");
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

  useEffect(() => {
    setTemplates(data);
  }, [data]);

  // Filter templates based on title and message filters
  const filteredTemplates = templates.filter(
    (t) =>
      t?.title?.toLowerCase().includes(titleFilter.toLowerCase()) &&
      t?.message?.toLowerCase().includes(messageFilter.toLowerCase())
  );

  // Pagination calculations
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page if filters change and current page is out of range
  useEffect(() => {
    if (currentPage > Math.ceil(filteredTemplates.length / itemsPerPage))
      setCurrentPage(1);
  }, [titleFilter, messageFilter, itemsPerPage, currentPage]);

  // Handlers
  const handleEdit = (template: { id: number; title: string; message: string }) => {
    setEditingTemplate(template);
    setFormTitle(template.title);
    setFormMessage(template.message);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this SMS template? This action cannot be undone."
      )
    ) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      if (editingTemplate?.id === id) {
        setEditingTemplate(null);
        setFormTitle("");
        setFormMessage("");
      }
    }
  };

  const handleSave = () => {
    if (!formTitle.trim() || !formMessage.trim()) {
      alert("Please fill in both Title and Message fields.");
      return;
    }
    if (editingTemplate) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingTemplate.id ? { ...t, title: formTitle, message: formMessage } : t
        )
      );
      setEditingTemplate(null);
    } else {
      const newId = Math.max(...templates.map((t) => t.id)) + 1;
      setTemplates((prev) => [
        ...prev,
        { id: newId, title: formTitle, message: formMessage },
      ]);
    }
    setFormTitle("");
    setFormMessage("");
  };

  const handleCancel = () => {
    setEditingTemplate(null);
    setFormTitle("");
    setFormMessage("");
  };

  const handleEditSave = () => {
    handleSave();
    setIsEditModalOpen(false);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  const handleClear = () => {
    setTitleFilter("");
    setMessageFilter("");
    setCurrentPage(1);
    setFormTitle("");
    setFormMessage("");
  };

  const handleReport = () => {
    // For demo, just alert the JSON data of current filtered templates
    alert(
      "SMS Templates Report:\n\n" +
        JSON.stringify(filteredTemplates, null, 2)
    );
  };

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6">SMS Templates</h1>

      {/* Filters Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filter SMS Templates</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div>
            <label
              htmlFor="filterTitle"
              className="block text-sm font-medium mb-1"
            >
              Title
            </label>
            <input
              id="filterTitle"
              type="text"
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Search by title"
            />
          </div>
          <div>
            <label
              htmlFor="filterMessage"
              className="block text-sm font-medium mb-1"
            >
              Message
            </label>
            <input
              id="filterMessage"
              type="text"
              value={messageFilter}
              onChange={(e) => setMessageFilter(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Search by message"
            />
          </div>
          <div className="flex items-end space-x-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              title="Search"
            >
              <i className="fa fa-search fa-light mr-2" aria-hidden="true"></i> Search
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              title="Clear"
            >
              <i className="fa fa-refresh fa-light mr-2" aria-hidden="true"></i> Clear
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              title="Generate Report"
            >
              <i className="fa fa-file-text fa-light mr-2" aria-hidden="true"></i> Report
            </button>
          </div>
        </form>
      </section>

      {/* SMS Templates Table Section */}
      <section className="bg-card rounded shadow py-6 mb-6 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">SMS Templates List</h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Message
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTemplates.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No SMS templates found.
                  </td>
                </tr>
              ) : (
                paginatedTemplates.map((template, idx) => (
                  <tr
                    key={template.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {template.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground whitespace-pre-wrap">
                      {template.message}
                    </td>
                    <td className="px-4 py-3 text-center text-sm space-x-3">
                      <button
                        onClick={() => handleEdit(template)}
                        className="text-primary hover:text-primary/80 transition-colors"
                        title="Edit"
                        aria-label={`Edit template ${template.title}`}
                      >
                        <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(template.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                        title="Delete"
                        aria-label={`Delete template ${template.title}`}
                      >
                        <i className="fa fa-trash fa-light" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredTemplates.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
      </section>

      {/* Add Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {editingTemplate ? "Edit SMS Template" : "Add New SMS Template"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label
              htmlFor="templateTitle"
              className="block text-sm font-medium mb-1"
            >
              Title <span className="text-red-600">*</span>
            </label>
            <input
              id="templateTitle"
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter template title"
              required
            />
          </div>
          <div>
            <label
              htmlFor="templateMessage"
              className="block text-sm font-medium mb-1"
            >
              Message <span className="text-red-600">*</span>
            </label>
            <textarea
              id="templateMessage"
              value={formMessage}
              onChange={(e) => setFormMessage(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 h-24 resize-none bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter SMS message content"
              required
            />
          </div>
          <div className="md:col-span-2 flex space-x-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              title={editingTemplate ? "Save changes" : "Add template"}
            >
              <i className="fa fa-save fa-light mr-2" aria-hidden="true"></i>
              {editingTemplate ? "Save" : "Add"}
            </button>
            {editingTemplate && (
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-6 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                title="Cancel editing"
              >
                <i className="fa fa-times fa-light mr-2" aria-hidden="true"></i> Cancel
              </button>
            )}
          </div>
        </form>
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
              Edit SMS Template
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="editTemplateTitle"
                  className="block text-sm font-medium mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="editTemplateTitle"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter template title"
                />
              </div>
              <div>
                <label
                  htmlFor="editTemplateMessage"
                  className="block text-sm font-medium mb-1"
                >
                  Message
                </label>
                <textarea
                  id="editTemplateMessage"
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  className="w-full border border-input rounded px-3 py-2 h-24 resize-none bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter SMS message content"
                />
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
}