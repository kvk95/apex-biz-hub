import { apiService } from "@/services/ApiService";
import { useEffect, useState } from "react";
import { Pagination } from "@/components/Pagination/Pagination";

const statusOptions = ["Active", "Inactive"];

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
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state
  const [ipAddress, setIpAddress] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState(statusOptions[0]);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    ipAddress: "",
    reason: "",
    status: statusOptions[0],
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Handlers for Add Section form inputs
  const resetForm = () => {
    setIpAddress("");
    setReason("");
    setStatus(statusOptions[0]);
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
            ? { ...item, ipAddress: ipAddress.trim(), reason: reason.trim(), status }
            : item
        )
      );
      setEditId(null);
    } else {
      // Add new
      const newEntry = {
        id: data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1,
        ipAddress: ipAddress.trim(),
        reason: reason.trim(),
        addedBy: "Admin",
        addedOn: new Date().toISOString().slice(0, 10),
        status,
      };
      setData((prev) => [newEntry, ...prev]);
      setCurrentPage(1);
    }
    resetForm();
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const entry = data.find((d) => d.id === id);
    if (entry) {
      setEditForm({
        ipAddress: entry.ipAddress,
        reason: entry.reason,
        status: entry.status,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (!editForm.ipAddress.trim() || !editForm.reason.trim()) {
      alert("Please fill in all required fields.");
      return;
    }
    if (editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                ipAddress: editForm.ipAddress.trim(),
                reason: editForm.reason.trim(),
                status: editForm.status,
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

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    resetForm();
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generated. Check console.");
    console.log("Report data:", data);
  };

  // Calculate paginated data using Pagination component props
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      <h1 className="text-2xl font-semibold mb-6">Ban IP Address</h1>

      {/* Form Section (Add Section) - preserved exactly except Clear button */}
      <section className="bg-card rounded shadow p-6 mb-6">
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
                name="ipAddress"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="Enter IP Address"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                name="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for ban"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {statusOptions.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
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

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  IP Address
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Reason
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Added By
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Added On
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
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
                    No banned IP addresses found.
                  </td>
                </tr>
              )}
              {paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">{item.ipAddress}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{item.reason}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{item.addedBy}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{item.addedOn}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        item.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit IP address ${item.ipAddress}`}
                      type="button"
                    >
                      <i className="fa fa-edit fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete IP address ${item.ipAddress}`}
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
          totalItems={data.length}
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
              Edit IP Address Ban
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="editIpAddress"
                  className="block text-sm font-medium mb-1"
                >
                  IP Address
                </label>
                <input
                  type="text"
                  id="editIpAddress"
                  name="ipAddress"
                  value={editForm.ipAddress}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter IP Address"
                />
              </div>
              <div>
                <label
                  htmlFor="editReason"
                  className="block text-sm font-medium mb-1"
                >
                  Reason
                </label>
                <input
                  type="text"
                  id="editReason"
                  name="reason"
                  value={editForm.reason}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter reason for ban"
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
                  name="status"
                  value={editForm.status}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {statusOptions.map((statusOption) => (
                    <option key={statusOption} value={statusOption}>
                      {statusOption}
                    </option>
                  ))}
                </select>
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