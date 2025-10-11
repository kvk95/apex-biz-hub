import React, { useState, useEffect } from "react";
import { useApiService } from "@/hooks/useApiService";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  lastLogin: string;
}

export default function LoginBasic() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data, loading, error } = useApiService<User[]>("/loginUsers.json");
  const users = data || [];

  // Pagination calculations
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const paginatedUsers = users.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      setLoginMessage(`Welcome back, ${user.username}! Role: ${user.role}`);
    } else {
      setLoginMessage("Invalid username or password.");
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setLoginMessage("");
    setUsername("");
    setPassword("");
  };

  const handleReport = () => {
    alert("Report generated for current users.");
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <>
      <title>Login Basic - Dreams POS</title>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
        {/* Login Card */}
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 mb-10">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
            Login to your account
          </h2>
          <form className="space-y-6" onSubmit={handleLogin} noValidate>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember_me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/auth/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <i className="fas fa-sign-in-alt mr-2"></i> Sign In
              </button>
            </div>
          </form>
          {loginMessage && (
            <p
              className={`mt-4 text-center text-sm ${
                loginMessage.startsWith("Welcome")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {loginMessage}
            </p>
          )}
        </div>

        {/* Users Table Section */}
        <section className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              User List
            </h3>
            <div className="space-x-2">
              <button
                onClick={handleReport}
                className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 text-sm font-medium rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Generate Report"
              >
                <i className="fas fa-file-alt mr-2"></i> Report
              </button>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-3 py-1.5 border border-gray-400 text-gray-700 text-sm font-medium rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                aria-label="Refresh List"
              >
                <i className="fas fa-sync-alt mr-2"></i> Refresh
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-md">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Username
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Last Login
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.map((user, idx) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav
            className="mt-4 flex justify-center items-center space-x-1"
            aria-label="Pagination"
          >
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Previous Page"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-1 rounded-md border ${
                    isActive
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 text-gray-700 hover:bg-gray-200"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Next Page"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </nav>
        </section>
      </div>
    </>
  );
}