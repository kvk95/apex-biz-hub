import { apiService } from "@/services/ApiService";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type ExpenseCategory = {
  id: number;
  name: string;
  description: string;
  status: "Active" | "Inactive";
};

export default function ExpenseCategory() {
  // Page title as per reference page
  useEffect(() => {
    
  }, []);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("ExpenseCategory");
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

  // State for expense categories data
  const [categories, setCategories] = useState<ExpenseCategory[]>(data);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  // Form state for add/edit
  const [form, setForm] = useState({
    id: 0,
    name: "",
    description: "",
    status: "Active" as "Active" | "Inactive",
  });

  // Editing mode flag
  const [isEditing, setIsEditing] = useState(false);

  // Pagination slice of data
  const paginatedCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Expense Category Name is required.");
      return;
    }
    if (isEditing) {
      // Update existing category
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === form.id
            ? {
                id: form.id,
                name: form.name.trim(),
                description: form.description.trim(),
                status: form.status,
              }
            : cat
        )
      );
      alert("Expense Category updated successfully.");
    } else {
      // Add new category
      const newId =
        categories.length > 0
          ? Math.max(...categories.map((c) => c.id)) + 1
          : 1;
      setCategories((prev) => [
        ...prev,
        {
          id: newId,
          name: form.name.trim(),
          description: form.description.trim(),
          status: form.status,
        },
      ]);
      alert("Expense Category added successfully.");
    }
    resetForm();
  }

  function resetForm() {
    setForm({
      id: 0,
      name: "",
      description: "",
      status: "Active",
    });
    setIsEditing(false);
  }

  function handleEdit(id: number) {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    setForm({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      status: cat.status,
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id: number) {
    if (
      window.confirm(
        "Are you sure you want to delete this Expense Category?"
      )
    ) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      // If deleting last item on page, go back a page if possible
      if (
        (categories.length - 1) % itemsPerPage === 0 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
      alert("Expense Category deleted successfully.");
    }
  }

  function handleRefresh() {
    // Reset data to initial state
    setCategories(data);
    resetForm();
    setCurrentPage(1);
  }

  function handleReport() {
    // For demonstration, just alert
    alert("Report generated successfully.");
  }

  // Pagination controls
  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        Expense Category
      </h1>

      {/* Form Section */}
      <section className="bg-white rounded shadow p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Expense Category Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Expense Category Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Enter Expense Category Name"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Enter Description"
                rows={1}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm resize-none"
              />
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <i className={`fa fa-save mr-2`} aria-hidden="true"></i>
              {isEditing ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <i className="fa fa-refresh mr-2" aria-hidden="true"></i>
              Reset
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-green-600 ml-auto"
            >
              <i className="fa fa-file-text-o mr-2" aria-hidden="true"></i>
              Report
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <i className="fa fa-refresh mr-2" aria-hidden="true"></i>
              Refresh
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-white rounded shadow p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-left text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-900 font-semibold">
              <tr>
                <th className="px-4 py-3 border-r border-gray-300 w-16 text-center">
                  SL
                </th>
                <th className="px-4 py-3 border-r border-gray-300 w-48">
                  Expense Category Name
                </th>
                <th className="px-4 py-3 border-r border-gray-300">
                  Description
                </th>
                <th className="px-4 py-3 border-r border-gray-300 w-28 text-center">
                  Status
                </th>
                <th className="px-4 py-3 w-36 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No Expense Categories found.
                  </td>
                </tr>
              ) : (
                paginatedCategories.map((cat, idx) => (
                  <tr
                    key={cat.id}
                    className="border-t border-gray-300 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 border-r border-gray-300 text-center">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300">
                      {cat.name}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300">
                      {cat.description}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          cat.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {cat.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(cat.id)}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-600"
                        title="Edit"
                        type="button"
                      >
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-red-600"
                        title="Delete"
                        type="button"
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
          className="flex items-center justify-between border-t border-gray-300 px-4 py-3 mt-4"
          aria-label="Table pagination"
        >
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Previous
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, categories.length)}
                </span>{" "}
                of <span className="font-medium">{categories.length}</span>{" "}
                results
              </p>
            </div>
            <div>
              <ul className="inline-flex -space-x-px rounded-md shadow-sm">
                <li>
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous"
                  >
                    <i className="fa fa-chevron-left" aria-hidden="true"></i>
                  </button>
                </li>
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <li key={page}>
                      <button
                        onClick={() => goToPage(page)}
                        aria-current={page === currentPage ? "page" : undefined}
                        className={`relative inline-flex items-center border border-gray-300 px-4 py-2 text-sm font-medium focus:z-20 ${
                          page === currentPage
                            ? "z-10 bg-blue-600 text-white shadow"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    </li>
                  );
                })}
                <li>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next"
                  >
                    <i className="fa fa-chevron-right" aria-hidden="true"></i>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </section>
    </div>
  );
}