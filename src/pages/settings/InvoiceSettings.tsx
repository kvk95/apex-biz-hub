import React, { useState, useEffect } from "react";

const invoiceSettingsData = {
  invoiceSettings: {
    invoicePrefix: "INV-",
    invoiceStartNo: 1001,
    invoiceFooter: "Thank you for your business!",
    invoiceTerms: "Payment due within 30 days.",
    invoiceNote: "Please contact us for any questions.",
    invoiceLogoUrl: "",
  },
  invoiceTemplates: [
    {
      id: 1,
      name: "Classic",
      previewUrl: "/images/template-classic.png",
      selected: true,
    },
    {
      id: 2,
      name: "Modern",
      previewUrl: "/images/template-modern.png",
      selected: false,
    },
    {
      id: 3,
      name: "Minimal",
      previewUrl: "/images/template-minimal.png",
      selected: false,
    },
  ],
  invoiceList: [
    {
      id: 1,
      invoiceNo: "INV-1001",
      customer: "John Doe",
      date: "2025-10-01",
      dueDate: "2025-10-31",
      total: "$1,200.00",
      status: "Paid",
    },
    {
      id: 2,
      invoiceNo: "INV-1002",
      customer: "Jane Smith",
      date: "2025-10-05",
      dueDate: "2025-11-04",
      total: "$850.00",
      status: "Unpaid",
    },
    {
      id: 3,
      invoiceNo: "INV-1003",
      customer: "Acme Corp",
      date: "2025-10-07",
      dueDate: "2025-11-06",
      total: "$2,450.00",
      status: "Partial",
    },
    {
      id: 4,
      invoiceNo: "INV-1004",
      customer: "Beta LLC",
      date: "2025-10-10",
      dueDate: "2025-11-09",
      total: "$3,100.00",
      status: "Paid",
    },
    {
      id: 5,
      invoiceNo: "INV-1005",
      customer: "Gamma Inc",
      date: "2025-10-12",
      dueDate: "2025-11-11",
      total: "$1,750.00",
      status: "Unpaid",
    },
    {
      id: 6,
      invoiceNo: "INV-1006",
      customer: "Delta Co",
      date: "2025-10-15",
      dueDate: "2025-11-14",
      total: "$980.00",
      status: "Paid",
    },
    {
      id: 7,
      invoiceNo: "INV-1007",
      customer: "Epsilon Ltd",
      date: "2025-10-18",
      dueDate: "2025-11-17",
      total: "$2,200.00",
      status: "Unpaid",
    },
    {
      id: 8,
      invoiceNo: "INV-1008",
      customer: "Zeta Partners",
      date: "2025-10-20",
      dueDate: "2025-11-19",
      total: "$1,300.00",
      status: "Partial",
    },
    {
      id: 9,
      invoiceNo: "INV-1009",
      customer: "Eta Group",
      date: "2025-10-22",
      dueDate: "2025-11-21",
      total: "$1,600.00",
      status: "Paid",
    },
    {
      id: 10,
      invoiceNo: "INV-1010",
      customer: "Theta Enterprises",
      date: "2025-10-25",
      dueDate: "2025-11-24",
      total: "$2,900.00",
      status: "Unpaid",
    },
  ],
};

const PAGE_SIZE = 5;

export default function InvoiceSettings() {
  // State for invoice settings form
  const [invoicePrefix, setInvoicePrefix] = useState(
    invoiceSettingsData.invoiceSettings.invoicePrefix
  );
  const [invoiceStartNo, setInvoiceStartNo] = useState(
    invoiceSettingsData.invoiceSettings.invoiceStartNo
  );
  const [invoiceFooter, setInvoiceFooter] = useState(
    invoiceSettingsData.invoiceSettings.invoiceFooter
  );
  const [invoiceTerms, setInvoiceTerms] = useState(
    invoiceSettingsData.invoiceSettings.invoiceTerms
  );
  const [invoiceNote, setInvoiceNote] = useState(
    invoiceSettingsData.invoiceSettings.invoiceNote
  );
  const [invoiceLogoUrl, setInvoiceLogoUrl] = useState(
    invoiceSettingsData.invoiceSettings.invoiceLogoUrl
  );

  // Invoice template selection state
  const [templates, setTemplates] = useState(invoiceSettingsData.invoiceTemplates);

  // Invoice list pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(invoiceSettingsData.invoiceList.length / PAGE_SIZE);

  // Paginated invoices
  const paginatedInvoices = invoiceSettingsData.invoiceList.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Handlers
  const handleTemplateSelect = (id: number) => {
    setTemplates((prev) =>
      prev.map((t) => ({ ...t, selected: t.id === id }))
    );
  };

  const handleRefresh = () => {
    // Reset form to initial data
    setInvoicePrefix(invoiceSettingsData.invoiceSettings.invoicePrefix);
    setInvoiceStartNo(invoiceSettingsData.invoiceSettings.invoiceStartNo);
    setInvoiceFooter(invoiceSettingsData.invoiceSettings.invoiceFooter);
    setInvoiceTerms(invoiceSettingsData.invoiceSettings.invoiceTerms);
    setInvoiceNote(invoiceSettingsData.invoiceSettings.invoiceNote);
    setInvoiceLogoUrl(invoiceSettingsData.invoiceSettings.invoiceLogoUrl);
    setTemplates(invoiceSettingsData.invoiceTemplates);
    setCurrentPage(1);
  };

  const handleSave = () => {
    // For demo, just alert saved data
    alert("Invoice settings saved successfully!");
  };

  const handleReport = () => {
    // For demo, alert report generation
    alert("Invoice report generated!");
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Title */}
      <h1 className="text-3xl font-semibold mb-6">Invoice Settings</h1>

      {/* Invoice Settings Form */}
      <section className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Invoice Settings</h2>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="invoicePrefix"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Invoice Prefix
              </label>
              <input
                type="text"
                id="invoicePrefix"
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. INV-"
              />
            </div>
            <div>
              <label
                htmlFor="invoiceStartNo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Invoice Start Number
              </label>
              <input
                type="number"
                id="invoiceStartNo"
                value={invoiceStartNo}
                onChange={(e) => setInvoiceStartNo(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min={1}
              />
            </div>
            <div>
              <label
                htmlFor="invoiceLogo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Invoice Logo URL
              </label>
              <input
                type="text"
                id="invoiceLogo"
                value={invoiceLogoUrl}
                onChange={(e) => setInvoiceLogoUrl(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Paste logo image URL"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="invoiceFooter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Invoice Footer
            </label>
            <textarea
              id="invoiceFooter"
              value={invoiceFooter}
              onChange={(e) => setInvoiceFooter(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Footer text for invoices"
            />
          </div>

          <div>
            <label
              htmlFor="invoiceTerms"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Invoice Terms
            </label>
            <textarea
              id="invoiceTerms"
              value={invoiceTerms}
              onChange={(e) => setInvoiceTerms(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Terms and conditions"
            />
          </div>

          <div>
            <label
              htmlFor="invoiceNote"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Invoice Note
            </label>
            <textarea
              id="invoiceNote"
              value={invoiceNote}
              onChange={(e) => setInvoiceNote(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Additional notes"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow"
            >
              <i className="fa fa-save mr-2" aria-hidden="true"></i> Save
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded shadow"
            >
              <i className="fa fa-refresh mr-2" aria-hidden="true"></i> Refresh
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow"
            >
              <i className="fa fa-file-text-o mr-2" aria-hidden="true"></i> Report
            </button>
          </div>
        </form>
      </section>

      {/* Invoice Template Selection */}
      <section className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Invoice Template</h2>
        <div className="flex flex-wrap gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template.id)}
              className={`cursor-pointer border rounded-lg p-3 w-40 flex flex-col items-center transition-shadow ${
                template.selected
                  ? "border-indigo-600 shadow-lg"
                  : "border-gray-300 hover:shadow-md"
              }`}
              aria-label={`Select ${template.name} template`}
            >
              <img
                src={template.previewUrl}
                alt={`${template.name} preview`}
                className="w-full h-24 object-contain mb-2"
                loading="lazy"
              />
              <span className="text-center font-medium">{template.name}</span>
              {template.selected && (
                <i
                  className="fa fa-check-circle text-indigo-600 mt-1"
                  aria-hidden="true"
                ></i>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Invoice List with Pagination */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Invoices</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-left text-sm">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-4 py-3 border-b border-gray-200">Invoice No</th>
                <th className="px-4 py-3 border-b border-gray-200">Customer</th>
                <th className="px-4 py-3 border-b border-gray-200">Date</th>
                <th className="px-4 py-3 border-b border-gray-200">Due Date</th>
                <th className="px-4 py-3 border-b border-gray-200">Total</th>
                <th className="px-4 py-3 border-b border-gray-200">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-indigo-50 transition-colors"
                >
                  <td className="px-4 py-3 border-b border-gray-200">{invoice.invoiceNo}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{invoice.customer}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{invoice.date}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{invoice.dueDate}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{invoice.total}</td>
                  <td className="px-4 py-3 border-b border-gray-200">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        invoice.status === "Paid"
                          ? "bg-green-100 text-green-800"
                          : invoice.status === "Unpaid"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
              {paginatedInvoices.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-gray-500 italic border-b border-gray-200"
                  >
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <nav
          className="flex justify-between items-center mt-6"
          aria-label="Pagination"
        >
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`inline-flex items-center px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label="Previous page"
          >
            <i className="fa fa-chevron-left mr-1" aria-hidden="true"></i> Prev
          </button>

          <ul className="inline-flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page}>
                <button
                  onClick={() => goToPage(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`px-3 py-1 rounded border ${
                    page === currentPage
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`inline-flex items-center px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label="Next page"
          >
            Next <i className="fa fa-chevron-right ml-1" aria-hidden="true"></i>
          </button>
        </nav>
      </section>
    </div>
  );
}