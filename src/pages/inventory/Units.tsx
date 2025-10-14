import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

type Unit = {
  id: number;
  unitName: string;
  shortName: string;
  description: string;
};

export default function Units() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Units state
  const [data, setData] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Units");
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

  // Form state for add section (preserved exactly)
  const [unitName, setUnitName] = useState("");
  const [shortName, setShortName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  // Filter/search state
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered units based on search term
  const filteredUnits = data.filter(
    (u) =>
      u.unitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset page if filteredUnits length changes and currentPage is out of range
  useEffect(() => {
    if (currentPage > Math.ceil(filteredUnits.length / itemsPerPage)) setCurrentPage(1);
  }, [filteredUnits, currentPage, itemsPerPage]);

  // Handlers for form inputs (Add Section)
  const handleUnitNameChange = (e: ChangeEvent<HTMLInputElement>) => setUnitName(e.target.value);
  const handleShortNameChange = (e: ChangeEvent<HTMLInputElement>) => setShortName(e.target.value);
  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value);

  // Handle form submit for add section (Add new unit)
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!unitName.trim() || !shortName.trim()) {
      alert("Please fill all required fields.");
      return;
    }

    const newUnit: Unit = {
      id: data.length > 0 ? Math.max(...data.map((u) => u.id)) + 1 : 1,
      unitName: unitName.trim(),
      shortName: shortName.trim(),
      description: description.trim(),
    };
    setData((prev) => [...prev, newUnit]);

    // Reset form
    setUnitName("");
    setShortName("");
    setDescription("");
  };

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    unitName: "",
    shortName: "",
    description: "",
  });

  // Open edit modal and populate edit form
  const handleEdit = (unit: Unit) => {
    setEditForm({
      unitName: unit.unitName,
      shortName: unit.shortName,
      description: unit.description,
    });
    setEditId(unit.id);
    setIsEditModalOpen(true);
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (!editForm.unitName.trim() || !editForm.shortName.trim()) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                unitName: editForm.unitName.trim(),
                shortName: editForm.shortName.trim(),
                description: editForm.description.trim(),
              }
            : item
        )
      );
      setEditId(null);
      setIsEditModalOpen(false);
    }
  };

  // Cancel editing modal
  const handleEditCancel = () => {
    setEditId(null);
    setIsEditModalOpen(false);
  };

  // Handle delete button click
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this unit?")) {
      setData((prev) => prev.filter((u) => u.id !== id));
      if ((currentPage - 1) * itemsPerPage >= filteredUnits.length - 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setUnitName("");
    setShortName("");
    setDescription("");
    setEditId(null);
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Handle report button click - for demo, alert with JSON data
  const handleReport = () => {
    alert("Units Report:\n\n" + JSON.stringify(data, null, 2));
  };

  // Paginated units using Pagination component props
  const paginatedUnits = filteredUnits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Units</h1>

      {/* Form Section (Add Section) - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div>
            <label htmlFor="unitName" className="block text-sm font-medium mb-1">
              Unit Name <span className="text-destructive">*</span>
            </label>
            <input
              id="unitName"
              type="text"
              name="unitName"
              value={unitName}
              onChange={handleUnitNameChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter Unit Name"
              required
            />
          </div>
          <div>
            <label htmlFor="shortName" className="block text-sm font-medium mb-1">
              Short Name <span className="text-destructive">*</span>
            </label>
            <input
              id="shortName"
              type="text"
              name="shortName"
              value={shortName}
              onChange={handleShortNameChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter Short Name"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <input
              id="description"
              type="text"
              name="description"
              value={description}
              onChange={handleDescriptionChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter Description"
            />
          </div>
          <div className="flex gap-3">
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
              <i className="fa fa-times fa-light" aria-hidden="true"></i> Clear
            </button>
          </div>
        </form>
      </section>

      {/* Search Section */}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search Units..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-input rounded px-3 py-2 w-64 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">#</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Unit Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Short Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Description</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUnits.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center px-4 py-6 text-muted-foreground italic">
                    No units found.
                  </td>
                </tr>
              ) : (
                paginatedUnits.map((unit, idx) => (
                  <tr
                    key={unit.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{unit.unitName}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{unit.shortName}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{unit.description}</td>
                    <td className="px-4 py-3 text-center text-sm space-x-3">
                      <button
                        onClick={() => handleEdit(unit)}
                        className="text-primary hover:text-primary/80 transition-colors"
                        aria-label={`Edit unit ${unit.unitName}`}
                        type="button"
                      >
                        <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(unit.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                        aria-label={`Delete unit ${unit.unitName}`}
                        type="button"
                      >
                        <i className="fa fa-trash fa-light" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredUnits.length}
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
              Edit Unit
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="editUnitName" className="block text-sm font-medium mb-1">
                  Unit Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="editUnitName"
                  name="unitName"
                  value={editForm.unitName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter Unit Name"
                  required
                />
              </div>
              <div>
                <label htmlFor="editShortName" className="block text-sm font-medium mb-1">
                  Short Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="editShortName"
                  name="shortName"
                  value={editForm.shortName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter Short Name"
                  required
                />
              </div>
              <div>
                <label htmlFor="editDescription" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <input
                  type="text"
                  id="editDescription"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
}