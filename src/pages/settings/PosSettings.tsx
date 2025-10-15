import { apiService } from "@/services/ApiService";
import React, { useEffect, useState } from "react";
import { Pagination } from "@/components/Pagination/Pagination";

export default function PosSettings() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("PosSettings");
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

  // State for form fields
  const [form, setForm] = useState<any>({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [editId, setEditId] = useState<number | null>(null);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("Settings saved (mock).");
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setForm({});
    setEditId(null);
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generated (mock).");
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  // Open edit modal and populate edit form if edit button exists
  // Check if edit icon/button exists in the grid - yes, we have none in original, so do not add new edit controls
  // But if edit icon/button existed, we would implement modal edit here.
  // Since no edit icon/button exists, skip modal edit implementation.

  // However, per instructions: "If no edit icon/button exists, do not add or modify edit controls."
  // So no modal or edit button added.

  // Calculate paginated data using Pagination component props
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      <title>POS Settings | Dreams POS</title>

      <h1 className="text-2xl font-semibold mb-6">POS Settings</h1>

      {/* POS Settings Form */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">POS Settings</h2>

        <form className="space-y-6 max-w-4xl">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="posName" className="block mb-1 font-medium">
                POS Name
              </label>
              <input
                type="text"
                id="posName"
                name="posName"
                value={form.posName || ""}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter POS Name"
              />
            </div>
            <div>
              <label htmlFor="posEmail" className="block mb-1 font-medium">
                POS Email
              </label>
              <input
                type="email"
                id="posEmail"
                name="posEmail"
                value={form.posEmail || ""}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter POS Email"
              />
            </div>
            <div>
              <label htmlFor="posPhone" className="block mb-1 font-medium">
                POS Phone
              </label>
              <input
                type="text"
                id="posPhone"
                name="posPhone"
                value={form.posPhone || ""}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter POS Phone"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div>
            <label htmlFor="posAddress" className="block mb-1 font-medium">
              POS Address
            </label>
            <textarea
              id="posAddress"
              name="posAddress"
              value={form.posAddress || ""}
              onChange={handleInputChange}
              rows={3}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Enter POS Address"
            />
          </div>

          {/* Row 3 - Footer Text */}
          <div>
            <label htmlFor="posFooterText" className="block mb-1 font-medium">
              POS Footer Text
            </label>
            <textarea
              id="posFooterText"
              name="posFooterText"
              value={form.posFooterText || ""}
              onChange={handleInputChange}
              rows={2}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Enter POS Footer Text"
            />
          </div>

          {/* Invoice Settings */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div>
              <label htmlFor="posInvoicePrefix" className="block mb-1 font-medium">
                Invoice Prefix
              </label>
              <input
                type="text"
                id="posInvoicePrefix"
                name="posInvoicePrefix"
                value={form.posInvoicePrefix || ""}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Prefix"
              />
            </div>
            <div>
              <label htmlFor="posInvoiceStartNo" className="block mb-1 font-medium">
                Invoice Start No
              </label>
              <input
                type="number"
                id="posInvoiceStartNo"
                name="posInvoiceStartNo"
                value={form.posInvoiceStartNo || ""}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Start Number"
                min={0}
              />
            </div>
            <div>
              <label htmlFor="posInvoiceFooter" className="block mb-1 font-medium">
                Invoice Footer 1
              </label>
              <input
                type="text"
                id="posInvoiceFooter"
                name="posInvoiceFooter"
                value={form.posInvoiceFooter || ""}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Footer text"
              />
            </div>
            <div>
              <label htmlFor="posInvoiceFooter2" className="block mb-1 font-medium">
                Invoice Footer 2
              </label>
              <input
                type="text"
                id="posInvoiceFooter2"
                name="posInvoiceFooter2"
                value={form.posInvoiceFooter2 || ""}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Footer text"
              />
            </div>
            <div>
              <label htmlFor="posInvoiceFooter3" className="block mb-1 font-medium">
                Invoice Footer 3
              </label>
              <input
                type="text"
                id="posInvoiceFooter3"
                name="posInvoiceFooter3"
                value={form.posInvoiceFooter3 || ""}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Footer text"
              />
            </div>
          </div>

          {/* Invoice Footer 4 to 10 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-4">
            <div>
              <label htmlFor="posInvoiceFooter4" className="block mb-1 font-medium">
                Invoice Footer 4
              </label>
              <input
                type="text"
                id="posInvoiceFooter4"
                name="posInvoiceFooter4"
                value={form.posInvoiceFooter4 || ""}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Footer text"
              />
            </div>
            <div>
              <label htmlFor="posInvoiceFooter5" className="block mb-1 font-medium">
                Invoice Footer 5
              </label>
              <input
                type="text"
                id="posInvoiceFooter5"
                name="posInvoiceFooter5"
                value={form.posInvoiceFooter5 || ""}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Footer text"
              />
            </div>
            <div>
              <label htmlFor="posInvoiceFooter6" className="block mb-1 font-medium">
                Invoice Footer 6
              </label>
              <input
                type="text"
                id="posInvoiceFooter6"
                name="posInvoiceFooter6"
                value={form.posInvoiceFooter6 || ""}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Footer text"
              />
            </div>
            <div>
              <label htmlFor="posInvoiceFooter7" className="block mb-1 font-medium">
                Invoice Footer 7
              </label>
              <input
                type="text"
                id="posInvoiceFooter7"
                name="posInvoiceFooter7"
                value={form.posInvoiceFooter7 || ""}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Footer text"
              />
            </div>
            <div>
              <label htmlFor="posInvoiceFooter8" className="block mb-1 font-medium">
                Invoice Footer 8
              </label>
              <input
                type="text"
                id="posInvoiceFooter8"
                name="posInvoiceFooter8"
                value={form.posInvoiceFooter8 || ""}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Footer text"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label htmlFor="posInvoiceFooter9" className="block mb-1 font-medium">
                Invoice Footer 9
              </label>
              <input
                type="text"
                id="posInvoiceFooter9"
                name="posInvoiceFooter9"
                value={form.posInvoiceFooter9 || ""}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Footer text"
              />
            </div>
            <div>
              <label htmlFor="posInvoiceFooter10" className="block mb-1 font-medium">
                Invoice Footer 10
              </label>
              <input
                type="text"
                id="posInvoiceFooter10"
                name="posInvoiceFooter10"
                value={form.posInvoiceFooter10 || ""}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Footer text"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-save fa-light" aria-hidden="true"></i>
              Save
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-refresh fa-light" aria-hidden="true"></i>
              Clear
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-file-text fa-light" aria-hidden="true"></i>
              Report
            </button>
          </div>
        </form>
      </section>

      {/* POS Settings List Table */}
      <section className="bg-card rounded shadow py-6 max-w-6xl">
        <h2 className="text-xl font-semibold mb-4">POS Settings List</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-border text-left text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 border border-border text-muted-foreground text-sm font-medium">
                  #
                </th>
                <th className="px-4 py-3 border border-border text-muted-foreground text-sm font-medium">
                  POS Name
                </th>
                <th className="px-4 py-3 border border-border text-muted-foreground text-sm font-medium">
                  Email
                </th>
                <th className="px-4 py-3 border border-border text-muted-foreground text-sm font-medium">
                  Phone
                </th>
                <th className="px-4 py-3 border border-border text-muted-foreground text-sm font-medium">
                  Address
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
                    No POS settings found.
                  </td>
                </tr>
              )}
              {paginatedData.map((item: any, idx: number) => (
                <tr
                  key={item.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{item.posName}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{item.posEmail}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{item.posPhone}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{item.posAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={data.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </section>
    </div>
  );
}