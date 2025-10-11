import React, { useState, useEffect } from "react";

const smsTemplatesData = [
  {
    id: 1,
    title: "Order Confirmation",
    message:
      "Dear {customer_name}, your order #{order_id} has been confirmed. Thank you for shopping with us!",
  },
  {
    id: 2,
    title: "Delivery Update",
    message:
      "Hello {customer_name}, your order #{order_id} is out for delivery and will reach you soon.",
  },
  {
    id: 3,
    title: "Payment Reminder",
    message:
      "Dear {customer_name}, this is a reminder that your payment for order #{order_id} is due on {due_date}.",
  },
  {
    id: 4,
    title: "Promotional Offer",
    message:
      "Hi {customer_name}, enjoy a special discount of 20% on your next purchase. Use code SAVE20.",
  },
  {
    id: 5,
    title: "Account Activation",
    message:
      "Welcome {customer_name}! Your account has been activated successfully. Start shopping now.",
  },
  {
    id: 6,
    title: "Password Reset",
    message:
      "Dear {customer_name}, click the link to reset your password: {reset_link}. If you didn't request this, ignore this message.",
  },
  {
    id: 7,
    title: "Feedback Request",
    message:
      "Hi {customer_name}, we value your feedback. Please rate your recent purchase experience.",
  },
  {
    id: 8,
    title: "Subscription Renewal",
    message:
      "Dear {customer_name}, your subscription will renew on {renewal_date}. Thank you for staying with us.",
  },
  {
    id: 9,
    title: "Event Invitation",
    message:
      "Hello {customer_name}, you're invited to our exclusive event on {event_date}. RSVP now!",
  },
  {
    id: 10,
    title: "Thank You Note",
    message:
      "Dear {customer_name}, thank you for your recent purchase. We appreciate your business!",
  },
  {
    id: 11,
    title: "Order Cancellation",
    message:
      "Dear {customer_name}, your order #{order_id} has been cancelled as per your request.",
  },
  {
    id: 12,
    title: "Shipping Delay",
    message:
      "Hello {customer_name}, due to unforeseen circumstances, your order #{order_id} delivery is delayed.",
  },
];

const pageSize = 5;

export default function SmsTemplates() {
  const [templates, setTemplates] = useState(smsTemplatesData);
  const [currentPage, setCurrentPage] = useState(1);
  const [titleFilter, setTitleFilter] = useState("");
  const [messageFilter, setMessageFilter] = useState("");
  const [editingTemplate, setEditingTemplate] = useState<null | {
    id: number;
    title: string;
    message: string;
  }>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formMessage, setFormMessage] = useState("");

  // Filter templates based on title and message filters
  const filteredTemplates = templates.filter(
    (t) =>
      t.title.toLowerCase().includes(titleFilter.toLowerCase()) &&
      t.message.toLowerCase().includes(messageFilter.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredTemplates.length / pageSize);
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset page if filters change and current page is out of range
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [titleFilter, messageFilter, totalPages, currentPage]);

  // Handlers
  const handleEdit = (template: { id: number; title: string; message: string }) => {
    setEditingTemplate(template);
    setFormTitle(template.title);
    setFormMessage(template.message);
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

  const handleRefresh = () => {
    setTitleFilter("");
    setMessageFilter("");
    setCurrentPage(1);
  };

  const handleReport = () => {
    // For demo, just alert the JSON data of current filtered templates
    alert(
      "SMS Templates Report:\n\n" +
        JSON.stringify(filteredTemplates, null, 2)
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-800">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6">SMS Templates</h1>

      {/* Filters Section */}
      <section className="bg-white rounded shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filter SMS Templates</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
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
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by message"
            />
          </div>
          <div className="flex items-end space-x-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
              title="Search"
            >
              <i className="fa fa-search mr-2" aria-hidden="true"></i> Search
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 flex items-center"
              title="Refresh"
            >
              <i className="fa fa-refresh mr-2" aria-hidden="true"></i> Refresh
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
              title="Generate Report"
            >
              <i className="fa fa-file-text-o mr-2" aria-hidden="true"></i> Report
            </button>
          </div>
        </form>
      </section>

      {/* SMS Templates Table Section */}
      <section className="bg-white rounded shadow p-4 mb-6 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">SMS Templates List</h2>
        <table className="min-w-full border border-gray-300 text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border border-gray-300 px-4 py-2 w-16">#</th>
              <th className="border border-gray-300 px-4 py-2 w-48">Title</th>
              <th className="border border-gray-300 px-4 py-2">Message</th>
              <th className="border border-gray-300 px-4 py-2 w-36">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTemplates.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="border border-gray-300 px-4 py-6 text-center text-gray-500"
                >
                  No SMS templates found.
                </td>
              </tr>
            ) : (
              paginatedTemplates.map((template, idx) => (
                <tr
                  key={template.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border border-gray-300 px-4 py-2 align-top">
                    {(currentPage - 1) * pageSize + idx + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 align-top">
                    {template.title}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 align-top whitespace-pre-wrap">
                    {template.message}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 align-top space-x-2">
                    <button
                      onClick={() => handleEdit(template)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                      aria-label={`Edit template ${template.title}`}
                    >
                      <i className="fa fa-pencil" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                      aria-label={`Delete template ${template.title}`}
                    >
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <nav
          className="flex justify-between items-center mt-4"
          aria-label="Pagination"
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border border-gray-300 ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "text-gray-700 hover:bg-gray-200"
            } flex items-center`}
            aria-label="Previous page"
          >
            <i className="fa fa-chevron-left mr-1" aria-hidden="true"></i> Prev
          </button>

          <ul className="inline-flex -space-x-px">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page}>
                <button
                  onClick={() => setCurrentPage(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`px-3 py-1 border border-gray-300 ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-3 py-1 rounded border border-gray-300 ${
              currentPage === totalPages || totalPages === 0
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "text-gray-700 hover:bg-gray-200"
            } flex items-center`}
            aria-label="Next page"
          >
            Next <i className="fa fa-chevron-right ml-1" aria-hidden="true"></i>
          </button>
        </nav>
      </section>

      {/* Add/Edit SMS Template Section */}
      <section className="bg-white rounded shadow p-4">
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
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter SMS message content"
              required
            />
          </div>
          <div className="md:col-span-2 flex space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center"
              title={editingTemplate ? "Save changes" : "Add template"}
            >
              <i className="fa fa-save mr-2" aria-hidden="true"></i>
              {editingTemplate ? "Save" : "Add"}
            </button>
            {editingTemplate && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 flex items-center"
                title="Cancel editing"
              >
                <i className="fa fa-times mr-2" aria-hidden="true"></i> Cancel
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}