import React, { useState, useMemo } from "react";

const emailTemplatesData = [
  {
    id: 1,
    title: "Order Confirmation",
    subject: "Your order has been confirmed!",
    status: "Active",
    createdDate: "2023-01-15",
  },
  {
    id: 2,
    title: "Shipping Notification",
    subject: "Your order is on the way",
    status: "Active",
    createdDate: "2023-02-10",
  },
  {
    id: 3,
    title: "Password Reset",
    subject: "Reset your password instructions",
    status: "Inactive",
    createdDate: "2023-03-05",
  },
  {
    id: 4,
    title: "Welcome Email",
    subject: "Welcome to our service!",
    status: "Active",
    createdDate: "2023-04-01",
  },
  {
    id: 5,
    title: "Subscription Expiry",
    subject: "Your subscription is about to expire",
    status: "Inactive",
    createdDate: "2023-05-20",
  },
  {
    id: 6,
    title: "Invoice",
    subject: "Your invoice is ready",
    status: "Active",
    createdDate: "2023-06-15",
  },
  {
    id: 7,
    title: "Feedback Request",
    subject: "We value your feedback",
    status: "Active",
    createdDate: "2023-07-10",
  },
  {
    id: 8,
    title: "Account Activation",
    subject: "Activate your account",
    status: "Inactive",
    createdDate: "2023-08-05",
  },
  {
    id: 9,
    title: "Promotion",
    subject: "Special offer just for you",
    status: "Active",
    createdDate: "2023-09-01",
  },
  {
    id: 10,
    title: "Newsletter",
    subject: "Monthly news and updates",
    status: "Active",
    createdDate: "2023-10-01",
  },
  {
    id: 11,
    title: "Event Invitation",
    subject: "You're invited!",
    status: "Active",
    createdDate: "2023-10-05",
  },
  {
    id: 12,
    title: "Account Suspension",
    subject: "Your account has been suspended",
    status: "Inactive",
    createdDate: "2023-10-07",
  },
];

const PAGE_SIZE = 5;

const EmailTemplates: React.FC = () => {
  const [templates, setTemplates] = useState(emailTemplatesData);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedTemplate, setEditedTemplate] = useState<{
    title: string;
    subject: string;
    status: string;
  }>({ title: "", subject: "", status: "Active" });

  // Filter and search
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "All" ? true : t.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [templates, searchTerm, filterStatus]);

  // Pagination
  const pageCount = Math.ceil(filteredTemplates.length / PAGE_SIZE);
  const currentTemplates = filteredTemplates.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Handlers
  const onEdit = (id: number) => {
    const tpl = templates.find((t) => t.id === id);
    if (!tpl) return;
    setEditingId(id);
    setEditedTemplate({
      title: tpl.title,
      subject: tpl.subject,
      status: tpl.status,
    });
  };

  const onCancelEdit = () => {
    setEditingId(null);
    setEditedTemplate({ title: "", subject: "", status: "Active" });
  };

  const onSave = () => {
    if (editingId === null) return;
    setTemplates((prev) =>
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
    setEditedTemplate({ title: "", subject: "", status: "Active" });
  };

  const onDelete = (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this email template? This action cannot be undone."
      )
    ) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      if ((currentPage - 1) * PAGE_SIZE >= filteredTemplates.length - 1) {
        setCurrentPage(Math.max(currentPage - 1, 1));
      }
    }
  };

  const onRefresh = () => {
    setTemplates(emailTemplatesData);
    setSearchTerm("");
    setFilterStatus("All");
    setCurrentPage(1);
    setEditingId(null);
    setEditedTemplate({ title: "", subject: "", status: "Active" });
  };

  // Pagination buttons component (using basic buttons as React pagination libs are not specified)
  const Pagination = () => {
    const pages = [];
    for (let i = 1; i <= pageCount; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`mx-1 px-3 py-1 rounded ${
            i === currentPage
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          aria-current={i === currentPage ? "page" : undefined}
          aria-label={`Go to page ${i}`}
          type="button"
        >
          {i}
        </button>
      );
    }
    return (
      <nav
        className="flex items-center justify-center space-x-2 mt-4"
        aria-label="Pagination"
      >
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
          aria-label="Previous page"
        >
          <i className="fa fa-chevron-left" />
        </button>
        {pages}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, pageCount))}
          disabled={currentPage === pageCount}
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
          aria-label="Next page"
        >
          <i className="fa fa-chevron-right" />
        </button>
      </nav>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900">
      <h1 className="text-3xl font-semibold mb-6">Email Templates</h1>

      {/* Controls: Search, Filter, Refresh, Report */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <input
            type="text"
            placeholder="Search by Title or Subject"
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-72"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Search email templates"
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by status"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded transition"
            type="button"
            aria-label="Refresh templates"
          >
            <i className="fa fa-sync-alt" />
            Refresh
          </button>
          <button
            onClick={() => alert("Report functionality is not implemented.")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            type="button"
            aria-label="Generate report"
          >
            <i className="fa fa-file-alt" />
            Report
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Subject
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Created Date
              </th>
              <th
                scope="col"
                className="relative px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentTemplates.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                >
                  No templates found.
                </td>
              </tr>
            )}
            {currentTemplates.map((tpl) => (
              <tr key={tpl.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingId === tpl.id ? (
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editedTemplate.title}
                      onChange={(e) =>
                        setEditedTemplate((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      aria-label="Edit title"
                    />
                  ) : (
                    tpl.title
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingId === tpl.id ? (
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editedTemplate.subject}
                      onChange={(e) =>
                        setEditedTemplate((prev) => ({
                          ...prev,
                          subject: e.target.value,
                        }))
                      }
                      aria-label="Edit subject"
                    />
                  ) : (
                    tpl.subject
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingId === tpl.id ? (
                    <select
                      className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editedTemplate.status}
                      onChange={(e) =>
                        setEditedTemplate((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      aria-label="Edit status"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                        tpl.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {tpl.status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tpl.createdDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                  {editingId === tpl.id ? (
                    <>
                      <button
                        onClick={onSave}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition"
                        type="button"
                        aria-label="Save changes"
                      >
                        <i className="fa fa-save" />
                        Save
                      </button>
                      <button
                        onClick={onCancelEdit}
                        className="flex items-center gap-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded transition"
                        type="button"
                        aria-label="Cancel editing"
                      >
                        <i className="fa fa-times" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => onEdit(tpl.id)}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
                        type="button"
                        aria-label={`Edit template ${tpl.title}`}
                      >
                        <i className="fa fa-edit" />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(tpl.id)}
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                        type="button"
                        aria-label={`Delete template ${tpl.title}`}
                      >
                        <i className="fa fa-trash" />
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageCount > 1 && <Pagination />}
    </div>
  );
};

export default EmailTemplates;