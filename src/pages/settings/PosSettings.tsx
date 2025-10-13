import { apiService } from "@/services/ApiService";
import React, { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 5;

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
  const [form, setForm] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  // Get current page data slice
  const currentData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("Settings saved (mock).");
  };

  const handleRefresh = () => {
    if (data.length > 0) {
      setForm(data[0]);
    }
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generated (mock).");
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    if (data.length > 0) {
      setForm(data[0]);
    }
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-800">
      <title>POS Settings | Dreams POS</title>

      <h1 className="text-3xl font-semibold mb-6">POS Settings</h1>

      {/* POS Settings Form */}
      <section className="bg-white rounded shadow p-6 mb-8">
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Footer text"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 mt-6">
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
            >
              <i className="fa fa-save"></i>
              <span>Save</span>
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded shadow"
            >
              <i className="fa fa-refresh"></i>
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow"
            >
              <i className="fa fa-file-text-o"></i>
              <span>Report</span>
            </button>
          </div>
        </form>
      </section>

      {/* POS Settings List Table */}
      <section className="bg-white rounded shadow p-6 max-w-6xl">
        <h2 className="text-xl font-semibold mb-4">POS Settings List</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-left text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border border-gray-300">#</th>
                <th className="px-4 py-2 border border-gray-300">POS Name</th>
                <th className="px-4 py-2 border border-gray-300">Email</th>
                <th className="px-4 py-2 border border-gray-300">Phone</th>
                <th className="px-4 py-2 border border-gray-300">Address</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item: any, idx: number) => (
                <tr
                  key={item.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.posName}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.posEmail}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.posPhone}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.posAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <nav
          className="flex justify-center items-center space-x-2 mt-6"
          aria-label="Pagination"
        >
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border border-gray-300 ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <i className="fa fa-chevron-left"></i>
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 rounded border border-gray-300 ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border border-gray-300 ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <i className="fa fa-chevron-right"></i>
          </button>
        </nav>
      </section>
    </div>
  );
}