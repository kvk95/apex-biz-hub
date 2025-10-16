import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const pageSizeOptions = [5, 10, 15, 20];

export default function Notification() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    notificationType: "",
    notificationTitle: "",
    notificationDetails: "",
    notificationDate: "",
    status: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Notification");
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

  // Filtered and searched notifications
  const filteredNotifications = useMemo(() => {
    return data
      .filter((n) => (filterType ? n.notificationType === filterType : true))
      .filter((n) => (filterStatus ? n.status === filterStatus : true))
      .filter((n) =>
        searchText
          ? n.notificationTitle
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            n.notificationDetails
              .toLowerCase()
              .includes(searchText.toLowerCase())
          : true
      );
  }, [data, filterType, filterStatus, searchText]);

  // Paginated data using Pagination component props
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    // Changed Refresh to Clear per instructions
    setFilterType("");
    setFilterStatus("");
    setSearchText("");
    setItemsPerPage(5);
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generated (demo).");
  };

  // Edit modal handlers
  const handleEditOpen = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        notificationType: item.notificationType,
        notificationTitle: item.notificationTitle,
        notificationDetails: item.notificationDetails,
        notificationDate: item.notificationDate,
        status: item.status,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    if (
      !editForm.notificationType.trim() ||
      !editForm.notificationTitle.trim() ||
      !editForm.notificationDetails.trim() ||
      !editForm.notificationDate.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                notificationType: editForm.notificationType.trim(),
                notificationTitle: editForm.notificationTitle.trim(),
                notificationDetails: editForm.notificationDetails.trim(),
                notificationDate: editForm.notificationDate.trim(),
                status: editForm.status,
              }
            : item
        )
      );
      setEditId(null);
      setIsEditModalOpen(false);
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <h1 className="text-lg font-semibold mb-6">Notification</h1>

        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex space-x-3">
            <button
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              type="button"
              aria-label="Generate Report"
            >
              <i className="fa fa-file-text fa-light" aria-hidden="true"></i>{" "}
              Report
            </button>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              type="button"
              aria-label="Clear"
            >
              <i className="fa fa-refresh fa-light" aria-hidden="true"></i>{" "}
              Clear
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="bg-card rounded shadow p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
            {/* Notification Type */}
            <div>
              <label
                htmlFor="notificationType"
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                Notification Type
              </label>
              <select
                id="notificationType"
                name="notificationType"
                value={filterType}
                onChange={handleFilterTypeChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">All Types</option>
                <option value="Order">Order</option>
                <option value="Payment">Payment</option>
                <option value="Shipping">Shipping</option>
                <option value="Promotion">Promotion</option>
                <option value="Alert">Alert</option>
                <option value="System">System</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filterStatus}
                onChange={handleFilterStatusChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Search */}
            <div className="md:col-span-2">
              <label
                htmlFor="search"
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                Search
              </label>
              <input
                type="text"
                id="search"
                name="search"
                placeholder="Search notifications..."
                value={searchText}
                onChange={handleSearchChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Page Size */}
            <div>
              <label
                htmlFor="pageSize"
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                Show Entries
              </label>
              <select
                id="pageSize"
                name="pageSize"
                value={itemsPerPage}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>

        {/* Notification Table */}
        <section className="bg-card rounded shadow py-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-28">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Details
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-40">
                    Date &amp; Time
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-24">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedNotifications.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center px-4 py-6 text-muted-foreground italic"
                    >
                      No notifications found.
                    </td>
                  </tr>
                ) : (
                  paginatedNotifications.map((n, idx) => (
                    <tr
                      key={n.id}
                      className={`border-b border-border hover:bg-muted/50 transition-colors ${
                        n.status === "Inactive"
                          ? "text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      <td className="px-4 py-3 text-sm font-medium">
                        {n.notificationType}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {n.notificationTitle}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {n.notificationDetails}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {n.notificationDate}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            n.status === "Active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {n.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm space-x-3">
                        <button
                          onClick={() => handleEditOpen(n.id)}
                          className="text-primary hover:text-primary/80 transition-colors"
                          aria-label={`Edit notification ${n.notificationTitle}`}
                          type="button"
                        >
                          <i
                            className="fa fa-pencil fa-light"
                            aria-hidden="true"
                          ></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredNotifications.length}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
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
                Edit Notification
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Notification Type */}
                <div>
                  <label
                    htmlFor="editNotificationType"
                    className="block text-sm font-medium mb-1"
                  >
                    Notification Type
                  </label>
                  <select
                    id="editNotificationType"
                    name="notificationType"
                    value={editForm.notificationType}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="Order">Order</option>
                    <option value="Payment">Payment</option>
                    <option value="Shipping">Shipping</option>
                    <option value="Promotion">Promotion</option>
                    <option value="Alert">Alert</option>
                    <option value="System">System</option>
                  </select>
                </div>

                {/* Notification Title */}
                <div>
                  <label
                    htmlFor="editNotificationTitle"
                    className="block text-sm font-medium mb-1"
                  >
                    Notification Title
                  </label>
                  <input
                    type="text"
                    id="editNotificationTitle"
                    name="notificationTitle"
                    value={editForm.notificationTitle}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter notification title"
                  />
                </div>

                {/* Notification Details */}
                <div>
                  <label
                    htmlFor="editNotificationDetails"
                    className="block text-sm font-medium mb-1"
                  >
                    Notification Details
                  </label>
                  <input
                    type="text"
                    id="editNotificationDetails"
                    name="notificationDetails"
                    value={editForm.notificationDetails}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter notification details"
                  />
                </div>

                {/* Notification Date */}
                <div>
                  <label
                    htmlFor="editNotificationDate"
                    className="block text-sm font-medium mb-1"
                  >
                    Date &amp; Time
                  </label>
                  <input
                    type="datetime-local"
                    id="editNotificationDate"
                    name="notificationDate"
                    value={editForm.notificationDate}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                    value={editForm.status}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
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
    </>
  );
}
