import React, { useEffect, useState } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const Designation: React.FC = () => {
  // Page title as in reference: "Designation"
  useEffect(() => {
    // No effect needed here
  }, []);

  // Form state
  const [designation, setDesignation] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    designation: "",
    description: "",
  });

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Designation");
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
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Pagination slice
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const resetForm = () => {
    setDesignation("");
    setDescription("");
    setEditId(null);
  };

  const handleSave = () => {
    if (!designation.trim()) {
      alert("Please enter Designation");
      return;
    }
    if (editId !== null) {
      // Edit existing
      setData((prev) =>
        prev.map((item) =>
          item.id === editId ? { ...item, designation, description } : item
        )
      );
    } else {
      // Add new
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [
        ...prev,
        { id: newId, designation, description },
      ]);
      // If new item added on last page, may need to adjust page
      if (currentPage !== Math.ceil(data.length / itemsPerPage))
        setCurrentPage(Math.ceil(data.length / itemsPerPage));
    }
    resetForm();
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        designation: item.designation,
        description: item.description,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  const handleEditSave = () => {
    if (!editForm.designation.trim()) {
      alert("Please enter Designation");
      return;
    }
    if (editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? { ...item, designation: editForm.designation, description: editForm.description }
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

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this designation?"
      )
    ) {
      setData((prev) => prev.filter((item) => item.id !== id));
      // Adjust page if needed
      if (
        (currentPage - 1) * itemsPerPage >=
        data.length - 1
      ) {
        setCurrentPage((p) => Math.max(p - 1, 1));
      }
      if (editId === id) resetForm();
    }
  };

  const handleClear = () => {
    setDesignation("");
    setDescription("");
    setEditId(null);
    setCurrentPage(1);
  };

  const handleReport = () => {
    // For demo, just alert JSON data
    alert("Designation Report:\n" + JSON.stringify(data, null, 2));
  };

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Designation</h1>

      {/* Form Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Designation */}
          <div>
            <label
              htmlFor="designation"
              className="block text-sm font-medium mb-1"
            >
              Designation
            </label>
            <input
              type="text"
              id="designation"
              name="designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter Designation"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 resize-none bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
              placeholder="Enter Description"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
          </button>

          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
          </button>

          <button
            onClick={handleReport}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
          </button>
        </div>
      </section>

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Designation
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Description
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No designations found.
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
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.designation}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.description}
                  </td>
                  <td className="px-4 py-3 text-center space-x-3">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit designation ${item.designation}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete designation ${item.designation}`}
                      type="button"
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
            <h2
              id="edit-modal-title"
              className="text-xl font-semibold mb-4 text-center"
            >
              Edit Designation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Designation */}
              <div>
                <label
                  htmlFor="editDesignation"
                  className="block text-sm font-medium mb-1"
                >
                  Designation
                </label>
                <input
                  type="text"
                  id="editDesignation"
                  name="designation"
                  value={editForm.designation}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter Designation"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="editDescription"
                  className="block text-sm font-medium mb-1"
                >
                  Description
                </label>
                <textarea
                  id="editDescription"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 resize-none bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={3}
                  placeholder="Enter Description"
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

export default Designation;