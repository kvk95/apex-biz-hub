import { apiService } from "@/services/ApiService";
import { useEffect, useState } from "react";

export default function BanIpAddress() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("BanIpAddress");
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form state
  const [ipAddress, setIpAddress] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("Active");

  // Editing state
  const [editId, setEditId] = useState<number | null>(null);

  // Pagination calculations
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const resetForm = () => {
    setIpAddress("");
    setReason("");
    setStatus("Active");
    setEditId(null);
  };

  const handleSave = () => {
    if (!ipAddress.trim() || !reason.trim()) {
      alert("Please fill in all required fields.");
      return;
    }
    if (editId !== null) {
      // Edit existing
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? { ...item, ipAddress, reason, status }
            : item
        )
      );
    } else {
      // Add new
      const newEntry = {
        id: data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1,
        ipAddress,
        reason,
        addedBy: "Admin",
        addedOn: new Date().toISOString().slice(0, 10),
        status,
      };
      setData((prev) => [newEntry, ...prev]);
      setCurrentPage(1);
    }
    resetForm();
  };

  const handleEdit = (id: number) => {
    const entry = data.find((d) => d.id === id);
    if (entry) {
      setIpAddress(entry.ipAddress);
      setReason(entry.reason);
      setStatus(entry.status);
      setEditId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this IP address ban entry?"
      )
    ) {
      setData((prev) => prev.filter((d) => d.id !== id));
      if (
        (currentPage - 1) * itemsPerPage >= data.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleRefresh = () => {
    loadData();
    resetForm();
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generated. Check console.");
    console.log("Report data:", data);
  };

  // Pagination controls
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Title set
  useEffect(() => {
    document.title = "Ban IP Address - DreamsPOS";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      <h1 className="text-3xl font-semibold mb-6">Ban IP Address</h1>

      {/* Form Section */}
      <section className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add / Edit IP Address</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="ipAddress"
                className="block text-sm font-medium mb-1"
              >
                IP Address <span className="text-red-600">*</span>
              </label>
              <input
                id="ipAddress"
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="Enter IP Address"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium mb-1"
              >
                Reason <span className="text-red-600">*</span>
              </label>
              <input
                id="reason"
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for ban"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-1"
              >
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded flex items-center"
            >
              <i className="fa fa-save mr-2" aria-hidden="true"></i> Save
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded flex items-center"
            >
              <i className="fa fa-refresh mr-2" aria-hidden="true"></i> Reset
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded flex items-center"
            >
              <i className="fa fa-sync-alt mr-2" aria-hidden="true"></i> Refresh
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded flex items-center ml-auto"
            >
              <i className="fa fa-file-alt mr-2" aria-hidden="true"></i> Report
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Banned IP Addresses</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100 text-gray-700 text-left text-sm uppercase font-semibold">
              <tr>
                <th className="px-4 py-3 border-b border-gray-300">IP Address</th>
                <th className="px-4 py-3 border-b border-gray-300">Reason</th>
                <th className="px-4 py-3 border-b border-gray-300">Added By</th>
                <th className="px-4 py-3 border-b border-gray-300">Added On</th>
                <th className="px-4 py-3 border-b border-gray-300">Status</th>
                <th className="px-4 py-3 border-b border-gray-300 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No banned IP addresses found.
                  </td>
                </tr>
              )}
              {paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 border-b border-gray-200"
                >
                  <td className="px-4 py-3">{item.ipAddress}</td>
                  <td className="px-4 py-3">{item.reason}</td>
                  <td className="px-4 py-3">{item.addedBy}</td>
                  <td className="px-4 py-3">{item.addedOn}</td>
                  <td className="px-4 py-3">{item.status}</td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(item.id)}
                      title="Edit"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <i className="fa fa-edit" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Delete"
                      className="text-red-600 hover:text-red-800"
                    >
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              ))}
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
            className={`flex items-center px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <i className="fa fa-chevron-left mr-2" aria-hidden="true"></i> Previous
          </button>

          <ul className="inline-flex -space-x-px">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page}>
                <button
                  onClick={() => goToPage(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`px-3 py-1.5 border border-gray-300 ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  } rounded-l first:rounded-l last:rounded-r focus:outline-none`}
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Next <i className="fa fa-chevron-right ml-2" aria-hidden="true"></i>
          </button>
        </nav>
      </section>
    </div>
  );
}