import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const roles = ["Admin", "User", "Moderator"];
const statuses = ["Active", "Inactive"];

const SecuritySettings: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: roles[0],
    status: statuses[0],
    lastLogin: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Form state for Password Change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state for Two-Factor Authentication
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFAMethod, setTwoFAMethod] = useState("SMS");

  // Form state for Login Alerts
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(true);
  const [alertMethod, setAlertMethod] = useState("Email");

  // Form state for Active Sessions
  const [activeSessions, setActiveSessions] = useState([
    {
      id: 1,
      device: "Chrome on Windows 10",
      location: "New York, USA",
      lastActive: "2025-10-11 03:00",
    },
    {
      id: 2,
      device: "Firefox on macOS",
      location: "San Francisco, USA",
      lastActive: "2025-10-10 22:15",
    },
  ]);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("SecuritySettings");
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
  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }
    alert("Password changed successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleTwoFASave = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Two-Factor Authentication ${twoFAEnabled ? "enabled" : "disabled"} via ${twoFAMethod}.`);
  };

  const handleLoginAlertsSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Login alerts ${loginAlertsEnabled ? "enabled" : "disabled"} via ${alertMethod}.`);
  };

  const handleClearSessions = () => {
    setActiveSessions([]);
  };

  const handleLogoutSession = (id: number) => {
    setActiveSessions((prev) => prev.filter((session) => session.id !== id));
  };

  // Edit modal handlers
  const handleEdit = (id: number) => {
    const user = data.find((u) => u.id === id);
    if (user) {
      setEditForm({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        lastLogin: user.lastLogin,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      setData((prev) =>
        prev.map((user) =>
          user.id === editId
            ? {
                ...user,
                name: editForm.name.trim(),
                email: editForm.email.trim(),
                role: editForm.role,
                status: editForm.status,
                lastLogin: editForm.lastLogin,
              }
            : user
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

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setData((prev) => prev.filter((user) => user.id !== id));
      // If deleting last item on page, go to previous page if needed
      if ((currentPage - 1) * itemsPerPage >= data.length - 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      <h1 className="text-2xl font-semibold mb-6">Security Settings</h1>

      {/* Password Change Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <i className="fa fa-lock fa-light mr-2" aria-hidden="true"></i> Change Password
        </h2>
        <form onSubmit={handlePasswordSave} className="space-y-4 max-w-md">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((v) => !v)}
                className="absolute right-2 top-2 text-muted-foreground hover:text-primary"
                aria-label="Toggle current password visibility"
              >
                <i className={`fa ${showCurrentPassword ? "fa-eye-slash fa-light" : "fa-eye fa-light"}`} aria-hidden="true"></i>
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((v) => !v)}
                className="absolute right-2 top-2 text-muted-foreground hover:text-primary"
                aria-label="Toggle new password visibility"
              >
                <i className={`fa ${showNewPassword ? "fa-eye-slash fa-light" : "fa-eye fa-light"}`} aria-hidden="true"></i>
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-2 top-2 text-muted-foreground hover:text-primary"
                aria-label="Toggle confirm password visibility"
              >
                <i className={`fa ${showConfirmPassword ? "fa-eye-slash fa-light" : "fa-eye fa-light"}`} aria-hidden="true"></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <i className="fa fa-save fa-light" aria-hidden="true"></i> Save Password
          </button>
        </form>
      </section>

      {/* Two-Factor Authentication Section */}
      <section className="bg-card rounded shadow p-6 mb-6 max-w-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <i className="fa fa-shield-alt fa-light mr-2" aria-hidden="true"></i> Two-Factor Authentication
        </h2>
        <form onSubmit={handleTwoFASave} className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              id="twoFAEnabled"
              type="checkbox"
              checked={twoFAEnabled}
              onChange={(e) => setTwoFAEnabled(e.target.checked)}
              className="h-5 w-5 text-primary border-input rounded focus:ring-ring"
            />
            <label htmlFor="twoFAEnabled" className="text-sm font-medium">
              Enable Two-Factor Authentication
            </label>
          </div>

          <div>
            <label htmlFor="twoFAMethod" className="block text-sm font-medium mb-1">
              Select Method
            </label>
            <select
              id="twoFAMethod"
              value={twoFAMethod}
              onChange={(e) => setTwoFAMethod(e.target.value)}
              disabled={!twoFAEnabled}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-muted/50"
            >
              <option value="SMS">SMS</option>
              <option value="Authenticator App">Authenticator App</option>
              <option value="Email">Email</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!twoFAEnabled}
            className={`inline-flex items-center gap-2 font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring ${
              twoFAEnabled
                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            <i className="fa fa-save fa-light" aria-hidden="true"></i> Save Settings
          </button>
        </form>
      </section>

      {/* Login Alerts Section */}
      <section className="bg-card rounded shadow p-6 mb-6 max-w-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <i className="fa fa-bell fa-light mr-2" aria-hidden="true"></i> Login Alerts
        </h2>
        <form onSubmit={handleLoginAlertsSave} className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              id="loginAlertsEnabled"
              type="checkbox"
              checked={loginAlertsEnabled}
              onChange={(e) => setLoginAlertsEnabled(e.target.checked)}
              className="h-5 w-5 text-primary border-input rounded focus:ring-ring"
            />
            <label htmlFor="loginAlertsEnabled" className="text-sm font-medium">
              Enable Login Alerts
            </label>
          </div>

          <div>
            <label htmlFor="alertMethod" className="block text-sm font-medium mb-1">
              Alert Method
            </label>
            <select
              id="alertMethod"
              value={alertMethod}
              onChange={(e) => setAlertMethod(e.target.value)}
              disabled={!loginAlertsEnabled}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-muted/50"
            >
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
              <option value="Push Notification">Push Notification</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!loginAlertsEnabled}
            className={`inline-flex items-center gap-2 font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring ${
              loginAlertsEnabled
                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            <i className="fa fa-save fa-light" aria-hidden="true"></i> Save Settings
          </button>
        </form>
      </section>

      {/* Active Sessions Section */}
      <section className="bg-card rounded shadow p-6 mb-6 max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <i className="fa fa-desktop fa-light mr-2" aria-hidden="true"></i> Active Sessions
          </h2>
          <button
            onClick={handleClearSessions}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Clear sessions"
            title="Clear sessions"
          >
            <i className="fa fa-trash fa-light" aria-hidden="true"></i> Clear
          </button>
        </div>
        {activeSessions.length === 0 ? (
          <p className="text-muted-foreground italic">No active sessions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Device</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Last Active</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {activeSessions.map((session) => (
                  <tr key={session.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-foreground">{session.device}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{session.location}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{session.lastActive}</td>
                    <td className="px-4 py-3 text-center text-sm">
                      <button
                        onClick={() => handleLogoutSession(session.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                        title="Logout this session"
                        aria-label={`Logout session on ${session.device}`}
                      >
                        <i className="fa fa-sign-out-alt fa-light" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Users Table with Pagination */}
      <section className="bg-card rounded shadow p-6 max-w-6xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <i className="fa fa-users fa-light mr-2" aria-hidden="true"></i> User Access Management
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Last Login</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center px-4 py-6 text-muted-foreground italic">
                    No users found.
                  </td>
                </tr>
              )}
              {data
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((user, idx) => (
                  <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-foreground">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{user.role}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{user.status}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{user.lastLogin}</td>
                    <td className="px-4 py-3 text-center text-sm space-x-3">
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="text-primary hover:text-primary/80 transition-colors"
                        title={`Edit ${user.name}`}
                        aria-label={`Edit ${user.name}`}
                      >
                        <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                        title={`Delete ${user.name}`}
                        aria-label={`Delete ${user.name}`}
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
            <h2 id="edit-modal-title" className="text-xl font-semibold mb-4 text-center">
              Edit User
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="editName" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="editName"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label htmlFor="editEmail" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="editEmail"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label htmlFor="editRole" className="block text-sm font-medium mb-1">
                  Role
                </label>
                <select
                  id="editRole"
                  name="role"
                  value={editForm.role}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="editStatus" className="block text-sm font-medium mb-1">
                  Status
                </label>
                <select
                  id="editStatus"
                  name="status"
                  value={editForm.status}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="editLastLogin" className="block text-sm font-medium mb-1">
                  Last Login
                </label>
                <input
                  type="text"
                  id="editLastLogin"
                  name="lastLogin"
                  value={editForm.lastLogin}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter last login"
                />
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
};

export default SecuritySettings;