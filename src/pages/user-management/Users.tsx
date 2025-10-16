import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const ROLES = ["Admin", "User"];
const STATUS = ["Active", "Inactive"];

export default function Users() { 
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form state for adding/editing user
  const [form, setForm] = useState({
    id: null as number | null,
    name: "",
    email: "",
    phone: "",
    role: "User",
    status: "Active",
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Users");
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

  // Users data state
  const [users, setUsers] = useState(data);

  // Sync users state with fetched data
  useEffect(() => {
    setUsers(data);
  }, [data]);

  // Search/filter state
  const [searchTerm, setSearchTerm] = useState("");

  // Editing mode
  const [isEditing, setIsEditing] = useState(false);

  // Filtered users based on searchTerm
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, users]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [currentPage, filteredUsers]);

  // Handlers
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSave() {
    if (!form.name.trim() || !form.email.trim()) {
      alert("Name and Email are required.");
      return;
    }
    if (isEditing && form.id !== null) {
      // Update existing user
      setUsers((prev) =>
        prev.map((u) => (u.id === form.id ? { ...form, id: form.id } : u))
      );
    } else {
      // Add new user
      const newId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      setUsers((prev) => [...prev, { ...form, id: newId }]);
    }
    resetForm();
  }

  function resetForm() {
    setForm({
      id: null,
      name: "",
      email: "",
      phone: "",
      role: "User",
      status: "Active",
    });
    setIsEditing(false);
  }

  function handleEdit(user: typeof users[0]) {
    setForm(user);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id: number) {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      if (paginatedUsers.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      }
    }
  }

  function handleRefresh() {
    loadData();
    resetForm();
    setSearchTerm("");
    setCurrentPage(1);
  }

  // Pagination buttons array
  const paginationButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationButtons.push(i);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page Title */}
      <h1 className="text-lg font-semibold mb-6">Users</h1>

      {/* User Form Section */}
      <section className="bg-white rounded shadow p-6 mb-8 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? "Edit User" : "Add User"}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          noValidate
        >
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full name"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block mb-1 font-medium">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label htmlFor="role" className="block mb-1 font-medium">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block mb-1 font-medium">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STATUS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end space-x-4 md:col-span-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isEditing ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>

      {/* Users List Section */}
      <section className="bg-white rounded shadow p-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="text-xl font-semibold mb-3 md:mb-0">Users List</h2>
          <div className="flex space-x-3">
            <button
              onClick={handleRefresh}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center"
              title="Refresh"
              aria-label="Refresh Users List"
              type="button"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582M20 20v-5h-.581M4.582 9A8 8 0 0112 4a8 8 0 017.418 5M19.418 15A8 8 0 0112 20a8 8 0 01-7.418-5"
                ></path>
              </svg>
              Refresh
            </button>
            <button
              onClick={() => window.print()}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
              title="Report"
              aria-label="Generate Report"
              type="button"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6"
                ></path>
              </svg>
              Report
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-1/3 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search users"
          />
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3 border-b border-gray-300">Name</th>
                <th className="text-left px-4 py-3 border-b border-gray-300">Email</th>
                <th className="text-left px-4 py-3 border-b border-gray-300">Phone</th>
                <th className="text-left px-4 py-3 border-b border-gray-300">Role</th>
                <th className="text-left px-4 py-3 border-b border-gray-300">Status</th>
                <th className="text-center px-4 py-3 border-b border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 even:bg-gray-50 odd:bg-white"
                    tabIndex={0}
                  >
                    <td className="px-4 py-3 border-b border-gray-300">{user.name}</td>
                    <td className="px-4 py-3 border-b border-gray-300">{user.email}</td>
                    <td className="px-4 py-3 border-b border-gray-300">{user.phone}</td>
                    <td className="px-4 py-3 border-b border-gray-300">{user.role}</td>
                    <td className="px-4 py-3 border-b border-gray-300">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-300 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-800 focus:outline-none"
                        aria-label={`Edit user ${user.name}`}
                        title="Edit"
                        type="button"
                      >
                        <svg
                          className="w-5 h-5 inline-block"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.232 5.232l3.536 3.536M9 11l6 6L7 21l-4-4 6-6z"
                          ></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-800 focus:outline-none"
                        aria-label={`Delete user ${user.name}`}
                        title="Delete"
                        type="button"
                      >
                        <svg
                          className="w-5 h-5 inline-block"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <nav
          className="mt-6 flex justify-center space-x-2 select-none"
          aria-label="Pagination"
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border border-gray-300 ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "hover:bg-gray-200 text-gray-700 cursor-pointer"
            }`}
            aria-label="Previous page"
            type="button"
          >
            &laquo;
          </button>
          {paginationButtons.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`px-3 py-1 rounded border border-gray-300 ${
                page === currentPage
                  ? "bg-blue-600 text-white cursor-default"
                  : "hover:bg-gray-200 text-gray-700 cursor-pointer"
              }`}
              type="button"
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border border-gray-300 ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "hover:bg-gray-200 text-gray-700 cursor-pointer"
            }`}
            aria-label="Next page"
            type="button"
          >
            &raquo;
          </button>
        </nav>
      </section>
    </div>
  );
}