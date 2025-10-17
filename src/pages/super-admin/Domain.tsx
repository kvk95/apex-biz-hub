import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const domainTypes = ["Primary", "Secondary"];
const domainStatuses = ["Active", "Inactive"];

export default function Domain() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Form state for adding/editing domain
  const [form, setForm] = useState({
    domainName: "",
    domainUrl: "",
    domainType: "Primary",
    domainStatus: "Active",
    domainExpireDate: "",
    domainOwner: "",
  });

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    domainName: "",
    domainUrl: "",
    domainType: "Primary",
    domainStatus: "Active",
    domainExpireDate: "",
    domainOwner: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Data state
  const [domains, setDomains] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Domain");
    if (response.status.code === "S") {
      setData(response.result);
      setDomains(response.result);
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
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (
      !form.domainName.trim() ||
      !form.domainUrl.trim() ||
      !form.domainExpireDate.trim() ||
      !form.domainOwner.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      setDomains((prev) =>
        prev.map((d) => (d.id === editId ? { ...d, ...form } : d))
      );
      setIsEditing(false);
      setEditId(null);
    } else {
      const newDomain = {
        id: domains.length ? Math.max(...domains.map((d) => d.id)) + 1 : 1,
        ...form,
      };
      setDomains((prev) => [...prev, newDomain]);
    }
    setForm({
      domainName: "",
      domainUrl: "",
      domainType: "Primary",
      domainStatus: "Active",
      domainExpireDate: "",
      domainOwner: "",
    });
  };

  const handleEdit = (id: number) => {
    const domain = domains.find((d) => d.id === id);
    if (domain) {
      setEditForm({
        domainName: domain.domainName,
        domainUrl: domain.domainUrl,
        domainType: domain.domainType,
        domainStatus: domain.domainStatus,
        domainExpireDate: domain.domainExpireDate,
        domainOwner: domain.domainOwner,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  const handleEditSave = () => {
    if (
      !editForm.domainName.trim() ||
      !editForm.domainUrl.trim() ||
      !editForm.domainExpireDate.trim() ||
      !editForm.domainOwner.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      setDomains((prev) =>
        prev.map((d) => (d.id === editId ? { ...d, ...editForm } : d))
      );
      setIsEditModalOpen(false);
      setEditId(null);
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setEditId(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this domain?")) {
      setDomains((prev) => prev.filter((d) => d.id !== id));
      // Adjust page if needed
      if (
        (currentPage - 1) * itemsPerPage >=
        domains.length - 1 /* after deletion */
      ) {
        setCurrentPage((p) => Math.max(p - 1, 1));
      }
    }
  };

  const handleClear = () => {
    setForm({
      domainName: "",
      domainUrl: "",
      domainType: "Primary",
      domainStatus: "Active",
      domainExpireDate: "",
      domainOwner: "",
    });
    setIsEditModalOpen(false);
    setEditId(null);
    setCurrentPage(1);
  };

  const handleReport = () => {
    // For demo, just alert JSON data
    alert(JSON.stringify(domains, null, 2));
  };

  // Calculate paginated data using Pagination component props
  const paginatedDomains = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return domains.slice(start, start + itemsPerPage);
  }, [currentPage, domains]);

  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-lg font-semibold mb-6">Domain</h1>

      {/* Domain Form Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Domain Name */}
          <div>
            <label
              htmlFor="domainName"
              className="block text-sm font-medium mb-1"
            >
              Domain Name
            </label>
            <input
              type="text"
              id="domainName"
              name="domainName"
              value={form.domainName}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter domain name"
            />
          </div>

          {/* Domain URL */}
          <div>
            <label
              htmlFor="domainUrl"
              className="block text-sm font-medium mb-1"
            >
              Domain URL
            </label>
            <input
              type="url"
              id="domainUrl"
              name="domainUrl"
              value={form.domainUrl}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="https://example.com"
            />
          </div>

          {/* Domain Type */}
          <div>
            <label
              htmlFor="domainType"
              className="block text-sm font-medium mb-1"
            >
              Domain Type
            </label>
            <select
              id="domainType"
              name="domainType"
              value={form.domainType}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {domainTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Domain Status */}
          <div>
            <label
              htmlFor="domainStatus"
              className="block text-sm font-medium mb-1"
            >
              Domain Status
            </label>
            <select
              id="domainStatus"
              name="domainStatus"
              value={form.domainStatus}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {domainStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Domain Expire Date */}
          <div>
            <label
              htmlFor="domainExpireDate"
              className="block text-sm font-medium mb-1"
            >
              Domain Expire Date
            </label>
            <input
              type="date"
              id="domainExpireDate"
              name="domainExpireDate"
              value={form.domainExpireDate}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Domain Owner */}
          <div>
            <label
              htmlFor="domainOwner"
              className="block text-sm font-medium mb-1"
            >
              Domain Owner
            </label>
            <input
              type="text"
              id="domainOwner"
              name="domainOwner"
              value={form.domainOwner}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter domain owner"
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

      {/* Domain List Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Domain Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Domain URL
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Domain Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Domain Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Expire Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Domain Owner
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedDomains.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No domains found.
                  </td>
                </tr>
              ) : (
                paginatedDomains.map((domain) => (
                  <tr
                    key={domain.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors text-sm text-gray-500"
                  >
                    <td className="px-4 py-2">{domain.domainName}</td>
                    <td className="px-4 py-2">
                      <a
                        href={domain.domainUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-indigo-800"
                      >
                        {domain.domainUrl}
                      </a>
                    </td>
                    <td className="px-4 py-2">{domain.domainType}</td>
                    <td
                      className={`px-4 py-2 text-sm ${
                        domain.domainStatus === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {domain.domainStatus}
                    </td>
                    <td className="px-4 py-2">{domain.domainExpireDate}</td>
                    <td className="px-4 py-2">{domain.domainOwner}</td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(domain.id)}
                        aria-label={`Edit domain ${domain.domainName}`}
                        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1 "
                      >
                        <i className="fa fa-edit fa-light" aria-hidden="true"></i>
                        <span className="sr-only">Edit record</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(domain.id)}
                        aria-label={`Delete domain ${domain.domainName}`}
                        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1 "
                      >
                        <i
                          className="fa fa-trash-can-xmark fa-light"
                          aria-hidden="true"
                        ></i>
                        <span className="sr-only">Delete record</span>
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
          totalItems={domains.length}
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
              Edit Domain
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Domain Name */}
              <div>
                <label
                  htmlFor="editDomainName"
                  className="block text-sm font-medium mb-1"
                >
                  Domain Name
                </label>
                <input
                  type="text"
                  id="editDomainName"
                  name="domainName"
                  value={editForm.domainName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter domain name"
                />
              </div>

              {/* Domain URL */}
              <div>
                <label
                  htmlFor="editDomainUrl"
                  className="block text-sm font-medium mb-1"
                >
                  Domain URL
                </label>
                <input
                  type="url"
                  id="editDomainUrl"
                  name="domainUrl"
                  value={editForm.domainUrl}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="https://example.com"
                />
              </div>

              {/* Domain Type */}
              <div>
                <label
                  htmlFor="editDomainType"
                  className="block text-sm font-medium mb-1"
                >
                  Domain Type
                </label>
                <select
                  id="editDomainType"
                  name="domainType"
                  value={editForm.domainType}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {domainTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Domain Status */}
              <div>
                <label
                  htmlFor="editDomainStatus"
                  className="block text-sm font-medium mb-1"
                >
                  Domain Status
                </label>
                <select
                  id="editDomainStatus"
                  name="domainStatus"
                  value={editForm.domainStatus}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {domainStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Domain Expire Date */}
              <div>
                <label
                  htmlFor="editDomainExpireDate"
                  className="block text-sm font-medium mb-1"
                >
                  Domain Expire Date
                </label>
                <input
                  type="date"
                  id="editDomainExpireDate"
                  name="domainExpireDate"
                  value={editForm.domainExpireDate}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Domain Owner */}
              <div>
                <label
                  htmlFor="editDomainOwner"
                  className="block text-sm font-medium mb-1"
                >
                  Domain Owner
                </label>
                <input
                  type="text"
                  id="editDomainOwner"
                  name="domainOwner"
                  value={editForm.domainOwner}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter domain owner"
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