import { apiService } from "@/services/ApiService";
import React, { useEffect, useState } from "react";

const pageSize = 5;

export default function Brands() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Brands");
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

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  // State for form inputs
  const [form, setForm] = useState({
    brandName: "",
    brandCode: "",
    brandDescription: "",
    brandStatus: "Active",
  });
  // State for brands list (simulate data source)
  const [brands, setBrands] = useState(data);
  // State for editing
  const [editId, setEditId] = useState<number | null>(null);

  // Pagination calculations
  const totalPages = Math.ceil(brands.length / pageSize);
  const paginatedBrands = brands.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!form.brandName.trim() || !form.brandCode.trim()) {
      alert("Brand Name and Brand Code are required.");
      return;
    }
    if (editId !== null) {
      // Update existing brand
      setBrands((prev) =>
        prev.map((b) =>
          b.id === editId
            ? {
                ...b,
                brandName: form.brandName,
                brandCode: form.brandCode,
                brandDescription: form.brandDescription,
                brandStatus: form.brandStatus,
              }
            : b
        )
      );
      setEditId(null);
    } else {
      // Add new brand
      const newBrand = {
        id: brands.length ? brands[brands.length - 1].id + 1 : 1,
        brandName: form.brandName,
        brandCode: form.brandCode,
        brandDescription: form.brandDescription,
        brandStatus: form.brandStatus,
      };
      setBrands((prev) => [...prev, newBrand]);
      // If new brand added on last page and page full, move to last page
      if ((brands.length + 1) > pageSize * totalPages) {
        setCurrentPage(totalPages + 1);
      }
    }
    // Clear form
    setForm({
      brandName: "",
      brandCode: "",
      brandDescription: "",
      brandStatus: "Active",
    });
  };

  const handleEdit = (id: number) => {
    const brand = brands.find((b) => b.id === id);
    if (brand) {
      setForm({
        brandName: brand.brandName,
        brandCode: brand.brandCode,
        brandDescription: brand.brandDescription,
        brandStatus: brand.brandStatus,
      });
      setEditId(id);
    }
  };

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this brand? This action cannot be undone."
      )
    ) {
      setBrands((prev) => prev.filter((b) => b.id !== id));
      // Adjust page if deleting last item on page
      if (
        (brands.length - 1) <= (currentPage - 1) * pageSize &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
      // Clear form if editing deleted brand
      if (editId === id) {
        setEditId(null);
        setForm({
          brandName: "",
          brandCode: "",
          brandDescription: "",
          brandStatus: "Active",
        });
      }
    }
  };

  const handleRefresh = () => {
    setBrands(data);
    setCurrentPage(1);
    setEditId(null);
    setForm({
      brandName: "",
      brandCode: "",
      brandDescription: "",
      brandStatus: "Active",
    });
  };

  const handleReport = () => {
    // For demonstration, just alert JSON data
    alert("Brands Report:\n\n" + JSON.stringify(brands, null, 2));
  };

  // Pagination controls
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Title as per reference page
  useEffect(() => {
    
  }, []);

  useEffect(() => {
    setBrands(data);
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <h1 className="text-3xl font-semibold mb-6">Brands</h1>

        {/* Form Section */}
        <section className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add / Edit Brand</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Brand Name */}
              <div>
                <label
                  htmlFor="brandName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Brand Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="brandName"
                  name="brandName"
                  value={form.brandName}
                  onChange={handleInputChange}
                  className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter Brand Name"
                  required
                />
              </div>

              {/* Brand Code */}
              <div>
                <label
                  htmlFor="brandCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Brand Code <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="brandCode"
                  name="brandCode"
                  value={form.brandCode}
                  onChange={handleInputChange}
                  className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter Brand Code"
                  required
                />
              </div>

              {/* Brand Description */}
              <div className="md:col-span-2">
                <label
                  htmlFor="brandDescription"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Brand Description
                </label>
                <textarea
                  id="brandDescription"
                  name="brandDescription"
                  value={form.brandDescription}
                  onChange={handleInputChange}
                  rows={1}
                  className="block w-full rounded border border-gray-300 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter Brand Description"
                />
              </div>

              {/* Brand Status */}
              <div>
                <label
                  htmlFor="brandStatus"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Brand Status
                </label>
                <select
                  id="brandStatus"
                  name="brandStatus"
                  value={form.brandStatus}
                  onChange={handleInputChange}
                  className="block w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 mt-4">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <i className="fa fa-save mr-2" aria-hidden="true"></i>
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm({
                    brandName: "",
                    brandCode: "",
                    brandDescription: "",
                    brandStatus: "Active",
                  });
                  setEditId(null);
                }}
                className="inline-flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <i className="fa fa-times mr-2" aria-hidden="true"></i>
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="ml-auto inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <i className="fa fa-refresh mr-2" aria-hidden="true"></i>
                Refresh
              </button>
              <button
                type="button"
                onClick={handleReport}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <i className="fa fa-file-text-o mr-2" aria-hidden="true"></i>
                Report
              </button>
            </div>
          </form>
        </section>

        {/* Brands Table Section */}
        <section className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Brands List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                    Brand Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                    Brand Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                    Brand Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                    Brand Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedBrands.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No brands found.
                    </td>
                  </tr>
                ) : (
                  paginatedBrands.map((brand, idx) => (
                    <tr key={brand.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 border-r border-gray-300">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        {brand.brandName}
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        {brand.brandCode}
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        {brand.brandDescription}
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                            brand.brandStatus === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {brand.brandStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center space-x-2">
                        <button
                          onClick={() => handleEdit(brand.id)}
                          title="Edit"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <i className="fa fa-pencil" aria-hidden="true"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(brand.id)}
                          title="Delete"
                          className="text-red-600 hover:text-red-900"
                        >
                          <i className="fa fa-trash" aria-hidden="true"></i>
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
            className="flex items-center justify-between border-t border-gray-200 px-4 py-3 mt-6"
            aria-label="Pagination"
          >
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
              <ul className="inline-flex -space-x-px rounded-md shadow-sm">
                <li>
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    aria-label="Previous"
                  >
                    <i className="fa fa-angle-left" aria-hidden="true"></i>
                  </button>
                </li>
                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <li key={page}>
                      <button
                        onClick={() => goToPage(page)}
                        aria-current={page === currentPage ? "page" : undefined}
                        className={`relative inline-flex items-center border border-gray-300 px-4 py-2 text-sm font-medium focus:z-20 ${
                          page === currentPage
                            ? "z-10 bg-indigo-600 text-white shadow"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    </li>
                  )
                )}
                <li>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    aria-label="Next"
                  >
                    <i className="fa fa-angle-right" aria-hidden="true"></i>
                  </button>
                </li>
              </ul>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:justify-end sm:text-sm sm:text-gray-700">
              Page <span className="font-medium mx-1">{currentPage}</span> of{" "}
              <span className="font-medium mx-1">{totalPages}</span>
            </div>
          </nav>
        </section>
      </div>
    </div>
  );
}