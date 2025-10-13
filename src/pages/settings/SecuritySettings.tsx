import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const roles = ["Admin", "User", "Moderator"];
const statuses = ["Active", "Inactive"];

const SecuritySettings: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  // Pagination calculations
  const totalPages = Math.ceil(data.length > 0 ? data.length : 0 / itemsPerPage);
  const paginatedUsers = data.length > 0 ? data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) : [];

  // Handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

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

  const handleRefreshSessions = () => {
    alert("Sessions refreshed.");
  };

  const handleLogoutSession = (id: number) => {
    setActiveSessions((prev) => prev.filter((session) => session.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900">
      <h1 className="text-3xl font-semibold mb-6">Security Settings</h1>

      {/* Password Change Section */}
      <section className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <i className="fas fa-lock mr-2 text-indigo-600"></i> Change Password
        </h2>
        <form onSubmit={handlePasswordSave} className="space-y-4 max-w-md">
          <div>
            <label htmlFor="currentPassword" className="block font-medium mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((v) => !v)}
                className="absolute right-2 top-2 text-gray-500 hover:text-indigo-600"
                aria-label="Toggle current password visibility"
              >
                <i className={`fas ${showCurrentPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="newPassword" className="block font-medium mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((v) => !v)}
                className="absolute right-2 top-2 text-gray-500 hover:text-indigo-600"
                aria-label="Toggle new password visibility"
              >
                <i className={`fas ${showNewPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block font-medium mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-2 top-2 text-gray-500 hover:text-indigo-600"
                aria-label="Toggle confirm password visibility"
              >
                <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded shadow transition"
          >
            Save Password
          </button>
        </form>
      </section>

      {/* Two-Factor Authentication Section */}
      <section className="bg-white shadow rounded-lg p-6 mb-8 max-w-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <i className="fas fa-shield-alt mr-2 text-indigo-600"></i> Two-Factor Authentication
        </h2>
        <form onSubmit={handleTwoFASave} className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              id="twoFAEnabled"
              type="checkbox"
              checked={twoFAEnabled}
              onChange={(e) => setTwoFAEnabled(e.target.checked)}
              className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="twoFAEnabled" className="font-medium">
              Enable Two-Factor Authentication
            </label>
          </div>

          <div>
            <label htmlFor="twoFAMethod" className="block font-medium mb-1">
              Select Method
            </label>
            <select
              id="twoFAMethod"
              value={twoFAMethod}
              onChange={(e) => setTwoFAMethod(e.target.value)}
              disabled={!twoFAEnabled}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
            >
              <option value="SMS">SMS</option>
              <option value="Authenticator App">Authenticator App</option>
              <option value="Email">Email</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!twoFAEnabled}
            className={`font-semibold px-5 py-2 rounded shadow transition ${
              twoFAEnabled
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Save Settings
          </button>
        </form>
      </section>

      {/* Login Alerts Section */}
      <section className="bg-white shadow rounded-lg p-6 mb-8 max-w-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <i className="fas fa-bell mr-2 text-indigo-600"></i> Login Alerts
        </h2>
        <form onSubmit={handleLoginAlertsSave} className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              id="loginAlertsEnabled"
              type="checkbox"
              checked={loginAlertsEnabled}
              onChange={(e) => setLoginAlertsEnabled(e.target.checked)}
              className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="loginAlertsEnabled" className="font-medium">
              Enable Login Alerts
            </label>
          </div>

          <div>
            <label htmlFor="alertMethod" className="block font-medium mb-1">
              Alert Method
            </label>
            <select
              id="alertMethod"
              value={alertMethod}
              onChange={(e) => setAlertMethod(e.target.value)}
              disabled={!loginAlertsEnabled}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
            >
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
              <option value="Push Notification">Push Notification</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!loginAlertsEnabled}
            className={`font-semibold px-5 py-2 rounded shadow transition ${
              loginAlertsEnabled
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Save Settings
          </button>
        </form>
      </section>

      {/* Active Sessions Section */}
      <section className="bg-white shadow rounded-lg p-6 mb-8 max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <i className="fas fa-desktop mr-2 text-indigo-600"></i> Active Sessions
          </h2>
          <button
            onClick={handleRefreshSessions}
            className="text-indigo-600 hover:text-indigo-800 focus:outline-none"
            aria-label="Refresh sessions"
            title="Refresh sessions"
          >
            <i className="fas fa-sync-alt fa-lg"></i>
          </button>
        </div>
        {activeSessions.length === 0 ? (
          <p className="text-gray-600">No active sessions found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-200 text-left text-sm">
            <thead className="bg-indigo-50">
              <tr>
                <th className="border border-gray-200 px-4 py-2">Device</th>
                <th className="border border-gray-200 px-4 py-2">Location</th>
                <th className="border border-gray-200 px-4 py-2">Last Active</th>
                <th className="border border-gray-200 px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {activeSessions.map((session) => (
                <tr key={session.id} className="even:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2">{session.device}</td>
                  <td className="border border-gray-200 px-4 py-2">{session.location}</td>
                  <td className="border border-gray-200 px-4 py-2">{session.lastActive}</td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    <button
                      onClick={() => handleLogoutSession(session.id)}
                      className="text-red-600 hover:text-red-800 focus:outline-none"
                      title="Logout this session"
                      aria-label={`Logout session on ${session.device}`}
                    >
                      <i className="fas fa-sign-out-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Users Table with Pagination */}
      <section className="bg-white shadow rounded-lg p-6 max-w-6xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <i className="fas fa-users mr-2 text-indigo-600"></i> User Access Management
        </h2>
        <table className="w-full border-collapse border border-gray-200 text-left text-sm">
          <thead className="bg-indigo-50">
            <tr>
              <th className="border border-gray-200 px-4 py-2">Name</th>
              <th className="border border-gray-200 px-4 py-2">Email</th>
              <th className="border border-gray-200 px-4 py-2">Role</th>
              <th className="border border-gray-200 px-4 py-2">Status</th>
              <th className="border border-gray-200 px-4 py-2">Last Login</th>
              <th className="border border-gray-200 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="even:bg-gray-50">
                <td className="border border-gray-200 px-4 py-2">{user.name}</td>
                <td className="border border-gray-200 px-4 py-2">{user.email}</td>
                <td className="border border-gray-200 px-4 py-2">
                  <select
                    defaultValue={user.role}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label={`Change role for ${user.name}`}
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  <select
                    defaultValue={user.status}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label={`Change status for ${user.name}`}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-gray-200 px-4 py-2">{user.lastLogin}</td>
                <td className="border border-gray-200 px-4 py-2 text-center space-x-2">
                  <button
                    className="text-indigo-600 hover:text-indigo-800"
                    title={`Edit ${user.name}`}
                    aria-label={`Edit ${user.name}`}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    title={`Delete ${user.name}`}
                    aria-label={`Delete ${user.name}`}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <nav
          className="flex justify-between items-center mt-4"
          aria-label="User table pagination"
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border border-gray-300 ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-indigo-600 hover:bg-indigo-100"
            }`}
            aria-label="Previous page"
          >
            <i className="fas fa-chevron-left"></i> Prev
          </button>

          <div className="text-sm text-gray-700" aria-live="polite">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border border-gray-300 ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-indigo-600 hover:bg-indigo-100"
            }`}
            aria-label="Next page"
          >
            Next <i className="fas fa-chevron-right"></i>
          </button>
        </nav>
      </section>
    </div>
  );
};

export default SecuritySettings;