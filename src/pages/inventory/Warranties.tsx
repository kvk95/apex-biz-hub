import { apiService } from "@/services/ApiService";
import React, { useEffect, useMemo, useState } from "react";
import { Pagination } from "@/components/Pagination/Pagination";

export default function Warranties() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Search/filter state
  const [searchWarrantyNo, setSearchWarrantyNo] = useState("");
  const [searchCustomerName, setSearchCustomerName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    warrantyNo: "",
    customerName: "",
    productName: "",
    purchaseDate: "",
    warrantyPeriod: "",
    status: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Warranties");
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

  // Filtered data based on search inputs
  const filteredData = useMemo(() => {
    return data.filter((w) => {
      return (
        w.warrantyNo.toLowerCase().includes(searchWarrantyNo.toLowerCase()) &&
        w.customerName.toLowerCase().includes(searchCustomerName.toLowerCase()) &&
        (searchStatus === "" || w.status === searchStatus)
      );
    });
  }, [data, searchWarrantyNo, searchCustomerName, searchStatus]);

  // Paginated data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleClear = () => {
    setSearchWarrantyNo("");
    setSearchCustomerName("");
    setSearchStatus("");
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generation is not implemented in this demo.");
  };

  // Edit modal handlers
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        warrantyNo: item.warrantyNo,
        customerName: item.customerName,
        productName: item.productName,
        purchaseDate: item.purchaseDate,
        warrantyPeriod: item.warrantyPeriod,
        status: item.status,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    if (
      !editForm.warrantyNo.trim() ||
      !editForm.customerName.trim() ||
      !editForm.productName.trim() ||
      !editForm.purchaseDate ||
      !editForm.warrantyPeriod ||
      !editForm.status
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                warrantyNo: editForm.warrantyNo.trim(),
                customerName: editForm.customerName.trim(),
                productName: editForm.productName.trim(),
                purchaseDate: editForm.purchaseDate,
                warrantyPeriod: editForm.warrantyPeriod,
                status: editForm.status,
              }
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
    if (window.confirm("Are you sure you want to delete this warranty?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      if (
        (currentPage - 1) * itemsPerPage >= data.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Title */}
      <h1 className="text-lg font-semibold mb-6">Warranties</h1>

      {/* Search / Filter Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div>
            <label
              htmlFor="warrantyNo"
              className="block text-sm font-medium mb-1"
            >
              Warranty No
            </label>
            <input
              id="warrantyNo"
              type="text"
              value={searchWarrantyNo}
              onChange={(e) => setSearchWarrantyNo(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter Warranty No"
            />
          </div>
          <div>
            <label
              htmlFor="customerName"
              className="block text-sm font-medium mb-1"
            >
              Customer Name
            </label>
            <input
              id="customerName"
              type="text"
              value={searchCustomerName}
              onChange={(e) => setSearchCustomerName(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter Customer Name"
            />
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium mb-1"
            >
              Status
            </label>
            <select
              id="status"
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full inline-flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-search fa-light" aria-hidden="true"></i> Search
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Warranty No
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Customer Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Product Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Purchase Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Warranty Period
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-muted-foreground italic"
                  >
                    No warranties found.
                  </td>
                </tr>
              )}
              {paginatedData.map((warranty) => (
                <tr
                  key={warranty.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {warranty.warrantyNo}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {warranty.customerName}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {warranty.productName}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {new Date(warranty.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {warranty.warrantyPeriod}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        warranty.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {warranty.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(warranty.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit warranty ${warranty.warrantyNo}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(warranty.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete warranty ${warranty.warrantyNo}`}
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
          totalItems={filteredData.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
      </section>

      {/* Buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={handleReport}
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
          type="button"
        >
          <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
        </button>
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
          type="button"
        >
          <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
        </button>
      </div>

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
              Edit Warranty
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="editWarrantyNo"
                  className="block text-sm font-medium mb-1"
                >
                  Warranty No
                </label>
                <input
                  type="text"
                  id="editWarrantyNo"
                  name="warrantyNo"
                  value={editForm.warrantyNo}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter Warranty No"
                />
              </div>
              <div>
                <label
                  htmlFor="editCustomerName"
                  className="block text-sm font-medium mb-1"
                >
                  Customer Name
                </label>
                <input
                  type="text"
                  id="editCustomerName"
                  name="customerName"
                  value={editForm.customerName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter Customer Name"
                />
              </div>
              <div>
                <label
                  htmlFor="editProductName"
                  className="block text-sm font-medium mb-1"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  id="editProductName"
                  name="productName"
                  value={editForm.productName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter Product Name"
                />
              </div>
              <div>
                <label
                  htmlFor="editPurchaseDate"
                  className="block text-sm font-medium mb-1"
                >
                  Purchase Date
                </label>
                <input
                  type="date"
                  id="editPurchaseDate"
                  name="purchaseDate"
                  value={editForm.purchaseDate}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label
                  htmlFor="editWarrantyPeriod"
                  className="block text-sm font-medium mb-1"
                >
                  Warranty Period
                </label>
                <input
                  type="text"
                  id="editWarrantyPeriod"
                  name="warrantyPeriod"
                  value={editForm.warrantyPeriod}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter Warranty Period"
                />
              </div>
              <div>
                <label
                  htmlFor="editStatus"
                  className="block text-sm font-medium mb-1"
                >
                  Status
                </label>
                <select
                  id="editStatus"
                  name="status"
                  value={editForm.status}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                </select>
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