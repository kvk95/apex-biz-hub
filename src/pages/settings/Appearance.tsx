import React, { useState } from "react";

const appearanceData = [
  {
    id: 1,
    name: "Dreams POS",
    theme: "Light",
    sidebar: "Expanded",
    header: "Fixed",
    footer: "Static",
    status: "Active",
  },
  {
    id: 2,
    name: "Dreams POS Dark",
    theme: "Dark",
    sidebar: "Collapsed",
    header: "Static",
    footer: "Fixed",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Dreams POS Blue",
    theme: "Blue",
    sidebar: "Expanded",
    header: "Fixed",
    footer: "Static",
    status: "Active",
  },
  {
    id: 4,
    name: "Dreams POS Green",
    theme: "Green",
    sidebar: "Collapsed",
    header: "Static",
    footer: "Fixed",
    status: "Active",
  },
  {
    id: 5,
    name: "Dreams POS Red",
    theme: "Red",
    sidebar: "Expanded",
    header: "Fixed",
    footer: "Static",
    status: "Inactive",
  },
  {
    id: 6,
    name: "Dreams POS Yellow",
    theme: "Yellow",
    sidebar: "Collapsed",
    header: "Static",
    footer: "Fixed",
    status: "Active",
  },
  {
    id: 7,
    name: "Dreams POS Purple",
    theme: "Purple",
    sidebar: "Expanded",
    header: "Fixed",
    footer: "Static",
    status: "Active",
  },
  {
    id: 8,
    name: "Dreams POS Orange",
    theme: "Orange",
    sidebar: "Collapsed",
    header: "Static",
    footer: "Fixed",
    status: "Inactive",
  },
  {
    id: 9,
    name: "Dreams POS Cyan",
    theme: "Cyan",
    sidebar: "Expanded",
    header: "Fixed",
    footer: "Static",
    status: "Active",
  },
  {
    id: 10,
    name: "Dreams POS Magenta",
    theme: "Magenta",
    sidebar: "Collapsed",
    header: "Static",
    footer: "Fixed",
    status: "Active",
  },
  {
    id: 11,
    name: "Dreams POS Lime",
    theme: "Lime",
    sidebar: "Expanded",
    header: "Fixed",
    footer: "Static",
    status: "Inactive",
  },
  {
    id: 12,
    name: "Dreams POS Teal",
    theme: "Teal",
    sidebar: "Collapsed",
    header: "Static",
    footer: "Fixed",
    status: "Active",
  },
];

const pageSize = 5;

export default function Appearance() {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    themeName: "",
    sidebarType: "Expanded",
    headerType: "Fixed",
    footerType: "Static",
    status: "Active",
  });

  const totalPages = Math.ceil(appearanceData.length / pageSize);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("Save functionality is not implemented in this demo.");
  };

  const handleRefresh = () => {
    alert("Refresh functionality is not implemented in this demo.");
  };

  const handleReport = () => {
    alert("Report functionality is not implemented in this demo.");
  };

  const paginatedData = appearanceData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <title>Appearance - Dreams POS</title>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <h1 className="text-3xl font-semibold mb-6">Appearance</h1>

        {/* Form Section */}
        <section className="bg-white rounded shadow p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Theme Settings</h2>
          <form className="space-y-6">
            {/* Theme Name */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
              <label
                htmlFor="themeName"
                className="w-full md:w-48 text-gray-700 font-medium mb-2 md:mb-0"
              >
                Theme Name
              </label>
              <input
                type="text"
                id="themeName"
                name="themeName"
                value={formData.themeName}
                onChange={handleInputChange}
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                placeholder="Enter theme name"
              />
            </div>

            {/* Sidebar Type */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
              <label className="w-full md:w-48 text-gray-700 font-medium mb-2 md:mb-0">
                Sidebar Type
              </label>
              <select
                name="sidebarType"
                value={formData.sidebarType}
                onChange={handleInputChange}
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              >
                <option>Expanded</option>
                <option>Collapsed</option>
              </select>
            </div>

            {/* Header Type */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
              <label className="w-full md:w-48 text-gray-700 font-medium mb-2 md:mb-0">
                Header Type
              </label>
              <select
                name="headerType"
                value={formData.headerType}
                onChange={handleInputChange}
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              >
                <option>Fixed</option>
                <option>Static</option>
              </select>
            </div>

            {/* Footer Type */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
              <label className="w-full md:w-48 text-gray-700 font-medium mb-2 md:mb-0">
                Footer Type
              </label>
              <select
                name="footerType"
                value={formData.footerType}
                onChange={handleInputChange}
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              >
                <option>Static</option>
                <option>Fixed</option>
              </select>
            </div>

            {/* Status */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
              <label className="w-full md:w-48 text-gray-700 font-medium mb-2 md:mb-0">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <i className="fas fa-save mr-2"></i> Save
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <i className="fas fa-sync-alt mr-2"></i> Refresh
              </button>
              <button
                type="button"
                onClick={handleReport}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <i className="fas fa-file-alt mr-2"></i> Report
              </button>
            </div>
          </form>
        </section>

        {/* Table Section */}
        <section className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Appearance List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-700">#</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Name</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Theme</th>
                  <th className="px-4 py-3 font-medium text-gray-700">
                    Sidebar
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-700">Header</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Footer</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-700 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }
                  >
                    <td className="px-4 py-3">{item.id}</td>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">{item.theme}</td>
                    <td className="px-4 py-3">{item.sidebar}</td>
                    <td className="px-4 py-3">{item.header}</td>
                    <td className="px-4 py-3">{item.footer}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          item.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        title="Edit"
                        className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                        onClick={() =>
                          alert(
                            `Edit functionality for "${item.name}" is not implemented in this demo.`
                          )
                        }
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        title="Delete"
                        className="text-red-600 hover:text-red-900 focus:outline-none"
                        onClick={() =>
                          alert(
                            `Delete functionality for "${item.name}" is not implemented in this demo.`
                          )
                        }
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav
            className="flex items-center justify-between border-t border-gray-200 px-4 py-3 mt-6"
            aria-label="Table navigation"
          >
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    const isCurrent = page === currentPage;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        aria-current={isCurrent ? "page" : undefined}
                        className={`relative z-10 inline-flex items-center border px-4 py-2 text-sm font-medium focus:outline-none ${
                          isCurrent
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </nav>
              </div>
            </div>
          </nav>
        </section>
      </div>
    </div>
  );
}