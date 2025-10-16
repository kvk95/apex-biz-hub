import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

interface OtpSetting {
  id: number;
  otpType: string;
  otpLength: number;
  otpValidity: number;
  otpResendTime: number;
  otpMessage: string;
  status: string;
}

export default function OtpSettings() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Form state for Add Section
  const [otpType, setOtpType] = useState("Numeric");
  const [otpLength, setOtpLength] = useState(6);
  const [otpValidity, setOtpValidity] = useState(5);
  const [otpResendTime, setOtpResendTime] = useState(1);
  const [otpMessage, setOtpMessage] = useState(
    "Your OTP is {{otp}}. Please do not share it with anyone."
  );
  const [status, setStatus] = useState("Active");

  // Data state
  const [data, setData] = useState<OtpSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<OtpSetting>({
    id: 0,
    otpType: "Numeric",
    otpLength: 6,
    otpValidity: 5,
    otpResendTime: 1,
    otpMessage: "Your OTP is {{otp}}. Please do not share it with anyone.",
    status: "Active",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<OtpSetting[]>("OtpSettings");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  const handleSave = () => {
    const existingIndex = data.findIndex(
      (item) =>
        item.otpType === otpType &&
        item.otpLength === otpLength &&
        item.otpValidity === otpValidity &&
        item.otpResendTime === otpResendTime
    );
    if (existingIndex !== -1) {
      const newData = [...data];
      newData[existingIndex] = {
        ...newData[existingIndex],
        otpMessage,
        status,
      };
      setData(newData);
      alert("OTP Setting updated successfully.");
    } else {
      const newEntry = {
        id: data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1,
        otpType,
        otpLength,
        otpValidity,
        otpResendTime,
        otpMessage,
        status,
      };
      setData([newEntry, ...data]);
      alert("OTP Setting added successfully.");
    }
    setCurrentPage(1);
  };

  const handleClear = () => {
    setOtpType("Numeric");
    setOtpLength(6);
    setOtpValidity(5);
    setOtpResendTime(1);
    setOtpMessage("Your OTP is {{otp}}. Please do not share it with anyone.");
    setStatus("Active");
  };

  const handleEdit = (item: OtpSetting) => {
    setEditForm(item);
    setIsEditModalOpen(true);
  };

  const handleEditSave = () => {
    setData((prev) =>
      prev.map((item) =>
        item.id === editForm.id
          ? {
              ...item,
              otpType: editForm.otpType,
              otpLength: editForm.otpLength,
              otpValidity: editForm.otpValidity,
              otpResendTime: editForm.otpResendTime,
              otpMessage: editForm.otpMessage,
              status: editForm.status,
            }
          : item
      )
    );
    setIsEditModalOpen(false);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  const handleReport = () => {
    alert("Report Data:\n" + JSON.stringify(data, null, 2));
  };

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-lg font-semibold mb-6">OTP Settings</h1>

      {/* Add Section - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add / Edit OTP Settings</h2>
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
                htmlFor="otpType"
                className="block text-sm font-medium mb-1"
              >
                OTP Type
              </label>
              <select
                id="otpType"
                value={otpType}
                onChange={(e) => setOtpType(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option>Numeric</option>
                <option>Alphanumeric</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="otpLength"
                className="block text-sm font-medium mb-1"
              >
                OTP Length
              </label>
              <input
                type="number"
                id="otpLength"
                min={1}
                max={10}
                value={otpLength}
                onChange={(e) => setOtpLength(Number(e.target.value))}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label
                htmlFor="otpValidity"
                className="block text-sm font-medium mb-1"
              >
                OTP Validity (Minutes)
              </label>
              <input
                type="number"
                id="otpValidity"
                min={1}
                max={60}
                value={otpValidity}
                onChange={(e) => setOtpValidity(Number(e.target.value))}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label
                htmlFor="otpResendTime"
                className="block text-sm font-medium mb-1"
              >
                OTP Resend Time (Minutes)
              </label>
              <input
                type="number"
                id="otpResendTime"
                min={1}
                max={60}
                value={otpResendTime}
                onChange={(e) => setOtpResendTime(Number(e.target.value))}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="otpMessage"
                className="block text-sm font-medium mb-1"
              >
                OTP Message
              </label>
              <textarea
                id="otpMessage"
                rows={3}
                value={otpMessage}
                onChange={(e) => setOtpMessage(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter OTP message template"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use <code className="font-mono bg-muted px-1 rounded">{"{{otp}}"}</code> as placeholder for OTP code.
              </p>
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
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option>Active</option>
                <option>Inactive</option>
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
        <h2 className="text-xl font-semibold mb-4 px-6">OTP Settings List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">#</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">OTP Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">OTP Length</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">OTP Validity (min)</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">OTP Resend Time (min)</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">OTP Message</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center px-4 py-6 text-muted-foreground italic">
                    No OTP settings found.
                  </td>
                </tr>
              )}
              {paginatedData.map((item, idx) => (
                <tr
                  key={item.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{item.otpType}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{item.otpLength}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{item.otpValidity}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{item.otpResendTime}</td>
                  <td className="px-4 py-3 text-sm text-foreground truncate max-w-xs" title={item.otpMessage}>
                    {item.otpMessage}
                  </td>
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
                      onClick={() => handleEdit(item)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit OTP setting ${item.id}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
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
              Edit OTP Setting
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="editOtpType"
                  className="block text-sm font-medium mb-1"
                >
                  OTP Type
                </label>
                <select
                  id="editOtpType"
                  value={editForm.otpType}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      otpType: e.target.value,
                    }))
                  }
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>Numeric</option>
                  <option>Alphanumeric</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="editOtpLength"
                  className="block text-sm font-medium mb-1"
                >
                  OTP Length
                </label>
                <input
                  type="number"
                  id="editOtpLength"
                  min={1}
                  max={10}
                  value={editForm.otpLength}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      otpLength: Number(e.target.value),
                    }))
                  }
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label
                  htmlFor="editOtpValidity"
                  className="block text-sm font-medium mb-1"
                >
                  OTP Validity (Minutes)
                </label>
                <input
                  type="number"
                  id="editOtpValidity"
                  min={1}
                  max={60}
                  value={editForm.otpValidity}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      otpValidity: Number(e.target.value),
                    }))
                  }
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label
                  htmlFor="editOtpResendTime"
                  className="block text-sm font-medium mb-1"
                >
                  OTP Resend Time (Minutes)
                </label>
                <input
                  type="number"
                  id="editOtpResendTime"
                  min={1}
                  max={60}
                  value={editForm.otpResendTime}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      otpResendTime: Number(e.target.value),
                    }))
                  }
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="editOtpMessage"
                  className="block text-sm font-medium mb-1"
                >
                  OTP Message
                </label>
                <textarea
                  id="editOtpMessage"
                  rows={3}
                  value={editForm.otpMessage}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      otpMessage: e.target.value,
                    }))
                  }
                  className="w-full border border-input rounded px-3 py-2 bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter OTP message template"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use <code className="font-mono bg-muted px-1 rounded">{"{{otp}}"}</code> as placeholder for OTP code.
                </p>
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
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>Active</option>
                  <option>Inactive</option>
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