import React, { useState, useMemo } from "react";

const profileData = {
  user: {
    name: "John Doe",
    role: "Admin",
    email: "johndoe@example.com",
    phone: "+1 234 567 890",
    address: "1234 Elm Street, Springfield, USA",
    dob: "1990-01-01",
    gender: "Male",
    profileImage:
      "https://dreamspos.dreamstechnologies.com/html/template/assets/images/avatar/avatar-1.jpg",
  },
  accountInfo: {
    username: "johndoe",
    email: "johndoe@example.com",
    phone: "+1 234 567 890",
    address: "1234 Elm Street, Springfield, USA",
    dob: "1990-01-01",
    gender: "Male",
  },
  changePassword: {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  },
  orders: [
    {
      id: 1,
      orderId: "#12345",
      date: "2025-10-01",
      status: "Delivered",
      total: "$150.00",
    },
    {
      id: 2,
      orderId: "#12346",
      date: "2025-09-15",
      status: "Processing",
      total: "$200.00",
    },
    {
      id: 3,
      orderId: "#12347",
      date: "2025-09-10",
      status: "Cancelled",
      total: "$75.00",
    },
    {
      id: 4,
      orderId: "#12348",
      date: "2025-08-30",
      status: "Delivered",
      total: "$320.00",
    },
    {
      id: 5,
      orderId: "#12349",
      date: "2025-08-20",
      status: "Delivered",
      total: "$50.00",
    },
    {
      id: 6,
      orderId: "#12350",
      date: "2025-08-10",
      status: "Processing",
      total: "$400.00",
    },
    {
      id: 7,
      orderId: "#12351",
      date: "2025-07-25",
      status: "Delivered",
      total: "$120.00",
    },
    {
      id: 8,
      orderId: "#12352",
      date: "2025-07-10",
      status: "Cancelled",
      total: "$90.00",
    },
    {
      id: 9,
      orderId: "#12353",
      date: "2025-06-30",
      status: "Delivered",
      total: "$250.00",
    },
    {
      id: 10,
      orderId: "#12354",
      date: "2025-06-15",
      status: "Processing",
      total: "$180.00",
    },
  ],
};

const PAGE_SIZE = 5;

export default function Profile() {
  // Page title as in reference
  React.useEffect(() => {
    document.title = "Profile - DreamsPOS";
  }, []);

  // Tabs state
  const [activeTab, setActiveTab] = useState<"profile" | "account" | "password" | "orders">(
    "profile"
  );

  // Form states for Account Info
  const [accountForm, setAccountForm] = useState({
    username: profileData.accountInfo.username,
    email: profileData.accountInfo.email,
    phone: profileData.accountInfo.phone,
    address: profileData.accountInfo.address,
    dob: profileData.accountInfo.dob,
    gender: profileData.accountInfo.gender,
  });

  // Form states for Change Password
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Orders pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(profileData.orders.length / PAGE_SIZE);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return profileData.orders.slice(start, start + PAGE_SIZE);
  }, [currentPage]);

  // Handlers
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAccountForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccountSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Account information saved (mock)"); // mock save
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    alert("Password changed successfully (mock)"); // mock save
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleRefreshOrders = () => {
    alert("Orders refreshed (mock)"); // mock refresh
  };

  const handleReportOrders = () => {
    alert("Report generated (mock)"); // mock report
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto p-6">
        {/* Page Title */}
        <h1 className="text-3xl font-semibold mb-6">Profile</h1>

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-6 mb-8">
          <img
            src={profileData.user.profileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border border-gray-300"
          />
          <div>
            <h2 className="text-2xl font-bold">{profileData.user.name}</h2>
            <p className="text-indigo-600 font-semibold">{profileData.user.role}</p>
            <p className="text-gray-600 mt-1">{profileData.user.email}</p>
            <p className="text-gray-600">{profileData.user.phone}</p>
            <p className="text-gray-600">{profileData.user.address}</p>
            <p className="text-gray-600">DOB: {profileData.user.dob}</p>
            <p className="text-gray-600">Gender: {profileData.user.gender}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <nav className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-3 text-center font-medium text-sm ${
                activeTab === "profile"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
              aria-current={activeTab === "profile" ? "page" : undefined}
            >
              Profile Info
            </button>
            <button
              onClick={() => setActiveTab("account")}
              className={`flex-1 py-3 text-center font-medium text-sm ${
                activeTab === "account"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
              aria-current={activeTab === "account" ? "page" : undefined}
            >
              Account Info
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex-1 py-3 text-center font-medium text-sm ${
                activeTab === "password"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
              aria-current={activeTab === "password" ? "page" : undefined}
            >
              Change Password
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 py-3 text-center font-medium text-sm ${
                activeTab === "orders"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
              aria-current={activeTab === "orders" ? "page" : undefined}
            >
              Orders
            </button>
          </nav>

          {/* Tab Panels */}
          <div className="p-6">
            {/* Profile Info Tab */}
            {activeTab === "profile" && (
              <section aria-label="Profile Information" className="space-y-4 max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={profileData.user.name}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input
                      type="text"
                      readOnly
                      value={profileData.user.role}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      readOnly
                      value={profileData.user.email}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      readOnly
                      value={profileData.user.phone}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      readOnly
                      value={profileData.user.address}
                      rows={2}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      readOnly
                      value={profileData.user.dob}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <input
                      type="text"
                      readOnly
                      value={profileData.user.gender}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Account Info Tab */}
            {activeTab === "account" && (
              <form
                onSubmit={handleAccountSave}
                aria-label="Account Information Form"
                className="space-y-6 max-w-3xl mx-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={accountForm.username}
                      onChange={handleAccountChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={accountForm.email}
                      onChange={handleAccountChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={accountForm.phone}
                      onChange={handleAccountChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      id="dob"
                      name="dob"
                      type="date"
                      value={accountForm.dob}
                      onChange={handleAccountChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={2}
                      value={accountForm.address}
                      onChange={handleAccountChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={accountForm.gender}
                      onChange={handleAccountChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="reset"
                    onClick={() => setAccountForm(profileData.accountInfo)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <i className="fa fa-refresh mr-2" aria-hidden="true"></i> Reset
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    <i className="fa fa-save mr-2" aria-hidden="true"></i> Save
                  </button>
                </div>
              </form>
            )}

            {/* Change Password Tab */}
            {activeTab === "password" && (
              <form
                onSubmit={handlePasswordSave}
                aria-label="Change Password Form"
                className="space-y-6 max-w-2xl mx-auto"
              >
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="reset"
                    onClick={() =>
                      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
                    }
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <i className="fa fa-refresh mr-2" aria-hidden="true"></i> Reset
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    <i className="fa fa-save mr-2" aria-hidden="true"></i> Change Password
                  </button>
                </div>
              </form>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <section aria-label="Orders List" className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Orders</h3>
                  <div className="space-x-2">
                    <button
                      onClick={handleReportOrders}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                      title="Generate Report"
                    >
                      <i className="fa fa-file-pdf-o mr-2" aria-hidden="true"></i> Report
                    </button>
                    <button
                      onClick={handleRefreshOrders}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                      title="Refresh Orders"
                    >
                      <i className="fa fa-refresh mr-2" aria-hidden="true"></i> Refresh
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto border border-gray-300 rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Order ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Details</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {order.orderId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "Processing"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.total}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              className="text-indigo-600 hover:text-indigo-900"
                              title="View Details"
                              onClick={() => alert(`Viewing details for order ${order.orderId} (mock)`)}
                            >
                              <i className="fa fa-eye" aria-hidden="true"></i>
                            </button>
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
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`inline-flex items-center px-3 py-1 rounded-md border border-gray-300 text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed bg-gray-100"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                    aria-label="Previous Page"
                  >
                    <i className="fa fa-chevron-left" aria-hidden="true"></i>
                  </button>
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        aria-current={currentPage === page ? "page" : undefined}
                        className={`inline-flex items-center px-3 py-1 rounded-md border border-gray-300 text-sm font-medium ${
                          currentPage === page
                            ? "bg-indigo-600 text-white"
                            : "text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`inline-flex items-center px-3 py-1 rounded-md border border-gray-300 text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed bg-gray-100"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                    aria-label="Next Page"
                  >
                    <i className="fa fa-chevron-right" aria-hidden="true"></i>
                  </button>
                </nav>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}