import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

export default function InvoiceSettings() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Invoice settings form state
  const [invoicePrefix, setInvoicePrefix] = useState("");
  const [invoiceStartNo, setInvoiceStartNo] = useState(0);
  const [invoiceFooter, setInvoiceFooter] = useState("");
  const [invoiceTerms, setInvoiceTerms] = useState("");
  const [invoiceNote, setInvoiceNote] = useState("");
  const [invoiceLogoUrl, setInvoiceLogoUrl] = useState("");

  // Invoice template selection state
  const [templates, setTemplates] = useState<any[]>([]);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editInvoice, setEditInvoice] = useState<any>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<any>("InvoiceSettings");
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

  // Handlers
  const handleTemplateSelect = (id: number) => {
    setTemplates((prev) =>
      prev.map((t) => ({ ...t, selected: t.id === id }))
    );
  };

  const handleClear = () => {
    setInvoicePrefix("");
    setInvoiceStartNo(0);
    setInvoiceFooter("");
    setInvoiceTerms("");
    setInvoiceNote("");
    setInvoiceLogoUrl("");
    setCurrentPage(1);
  };

  const handleSave = () => {
    alert("Invoice settings saved successfully!");
  };

  const handleReport = () => {
    alert("Invoice report generated!");
  };

  // Modal handlers
  const handleEdit = (invoice: any) => {
    setEditInvoice(invoice);
    setIsEditModalOpen(true);
  };

  const handleEditSave = () => {
    // In a real app, update the invoice here and close the modal
    setIsEditModalOpen(false);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    if (data) {
      setInvoicePrefix(data.invoiceSettings?.invoicePrefix || "");
      setInvoiceStartNo(data.invoiceSettings?.invoiceStartNo || 0);
      setInvoiceFooter(data.invoiceSettings?.invoiceFooter || "");
      setInvoiceTerms(data.invoiceSettings?.invoiceTerms || "");
      setInvoiceNote(data.invoiceSettings?.invoiceNote || "");
      setInvoiceLogoUrl(data.invoiceSettings?.invoiceLogoUrl || "");
      setTemplates(data.invoiceTemplates || []);
    }
  }, [data]);

  // Paginated invoices
  const paginatedInvoices = data?.invoiceList?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) || [];

  if (loading) return <div className="min-h-screen bg-background p-6 font-sans">Loading...</div>;
  if (error) return <div className="min-h-screen bg-background p-6 font-sans">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-lg font-semibold mb-6">Invoice Settings</h1>

      <section className="bg-card rounded shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Invoice Settings</h2>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="invoicePrefix"
                className="block text-sm font-medium mb-1"
              >
                Invoice Prefix
              </label>
              <input
                type="text"
                id="invoicePrefix"
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="e.g. INV-"
              />
            </div>
            <div>
              <label
                htmlFor="invoiceStartNo"
                className="block text-sm font-medium mb-1"
              >
                Invoice Start Number
              </label>
              <input
                type="number"
                id="invoiceStartNo"
                value={invoiceStartNo}
                onChange={(e) => setInvoiceStartNo(Number(e.target.value))}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                min={1}
              />
            </div>
            <div>
              <label
                htmlFor="invoiceLogo"
                className="block text-sm font-medium mb-1"
              >
                Invoice Logo URL
              </label>
              <input
                type="text"
                id="invoiceLogo"
                value={invoiceLogoUrl}
                onChange={(e) => setInvoiceLogoUrl(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Paste logo image URL"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="invoiceFooter"
              className="block text-sm font-medium mb-1"
            >
              Invoice Footer
            </label>
            <textarea
              id="invoiceFooter"
              value={invoiceFooter}
              onChange={(e) => setInvoiceFooter(e.target.value)}
              rows={2}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Footer text for invoices"
            />
          </div>

          <div>
            <label
              htmlFor="invoiceTerms"
              className="block text-sm font-medium mb-1"
            >
              Invoice Terms
            </label>
            <textarea
              id="invoiceTerms"
              value={invoiceTerms}
              onChange={(e) => setInvoiceTerms(e.target.value)}
              rows={3}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Terms and conditions"
            />
          </div>

          <div>
            <label
              htmlFor="invoiceNote"
              className="block text-sm font-medium mb-1"
            >
              Invoice Note
            </label>
            <textarea
              id="invoiceNote"
              value={invoiceNote}
              onChange={(e) => setInvoiceNote(e.target.value)}
              rows={3}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Additional notes"
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
            </button>
          </div>
        </form>
      </section>

      <section className="bg-card rounded shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Invoice Template</h2>
        <div className="flex flex-wrap gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template.id)}
              className={`cursor-pointer border rounded-lg p-3 w-40 flex flex-col items-center transition-shadow ${
                template.selected
                  ? "border-primary shadow-lg"
                  : "border-border hover:shadow-md"
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
                  className="fa fa-check-circle fa-light text-primary mt-1"
                  aria-hidden="true"
                ></i>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Invoices</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Invoice No</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Due Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Total</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No invoices found.
                  </td>
                </tr>
              )}
              {paginatedInvoices.map((invoice, idx) => (
                <tr
                  key={invoice.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">{invoice.invoiceNo}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{invoice.customer}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{invoice.date}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{invoice.dueDate}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{invoice.total}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        invoice.status === "Paid"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : invoice.status === "Unpaid"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(invoice)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit invoice ${invoice.invoiceNo}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => {}}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`View invoice ${invoice.invoiceNo}`}
                      type="button"
                    >
                      <i className="fa fa-eye fa-light" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={data?.invoiceList?.length || 0}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
      </section>

      {/* Edit Modal */}
      {isEditModalOpen && editInvoice && (
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
              Edit Invoice
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="editInvoiceNo"
                  className="block text-sm font-medium mb-1"
                >
                  Invoice No
                </label>
                <input
                  type="text"
                  id="editInvoiceNo"
                  value={editInvoice.invoiceNo}
                  readOnly
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label
                  htmlFor="editCustomer"
                  className="block text-sm font-medium mb-1"
                >
                  Customer
                </label>
                <input
                  type="text"
                  id="editCustomer"
                  value={editInvoice.customer}
                  readOnly
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label
                  htmlFor="editDate"
                  className="block text-sm font-medium mb-1"
                >
                  Date
                </label>
                <input
                  type="text"
                  id="editDate"
                  value={editInvoice.date}
                  readOnly
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label
                  htmlFor="editDueDate"
                  className="block text-sm font-medium mb-1"
                >
                  Due Date
                </label>
                <input
                  type="text"
                  id="editDueDate"
                  value={editInvoice.dueDate}
                  readOnly
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label
                  htmlFor="editTotal"
                  className="block text-sm font-medium mb-1"
                >
                  Total
                </label>
                <input
                  type="text"
                  id="editTotal"
                  value={editInvoice.total}
                  readOnly
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label
                  htmlFor="editStatus"
                  className="block text-sm font-medium mb-1"
                >
                  Status
                </label>
                <select
                  id="editStatus"
                  value={editInvoice.status}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

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