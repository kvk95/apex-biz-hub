import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

export default function ExpiredProducts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    productName: "",
    productCode: "",
    category: "",
    supplier: "",
    expiredDate: "",
    quantity: "",
    unit: "",
    cost: "",
    price: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("ExpiredProducts");
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

  // Pagination slice of data
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle edit icon click - open modal and populate form
  const handleEdit = (index: number) => {
    const item = paginatedData[index];
    if (item) {
      setEditForm({
        productName: item.productName || "",
        productCode: item.productCode || "",
        category: item.category || "",
        supplier: item.supplier || "",
        expiredDate: item.expiredDate || "",
        quantity: item.quantity?.toString() || "",
        unit: item.unit || "",
        cost: item.cost?.toString() || "",
        price: item.price?.toString() || "",
      });
      setEditIndex((currentPage - 1) * itemsPerPage + index);
      setIsEditModalOpen(true);
    }
  };

  // Handle edit modal input changes
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save changes from edit modal
  const handleEditSave = () => {
    // Basic validation: productName and expiredDate required
    if (!editForm.productName.trim() || !editForm.expiredDate) {
      alert("Please fill all required fields.");
      return;
    }
    if (editIndex !== null) {
      setData((prev) =>
        prev.map((item, idx) =>
          idx === editIndex
            ? {
                ...item,
                productName: editForm.productName.trim(),
                productCode: editForm.productCode.trim(),
                category: editForm.category,
                supplier: editForm.supplier,
                expiredDate: editForm.expiredDate,
                quantity: Number(editForm.quantity) || 0,
                unit: editForm.unit,
                cost: Number(editForm.cost) || 0,
                price: Number(editForm.price) || 0,
              }
            : item
        )
      );
      setEditIndex(null);
      setIsEditModalOpen(false);
    }
  };

  // Cancel editing modal
  const handleEditCancel = () => {
    setEditIndex(null);
    setIsEditModalOpen(false);
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setCurrentPage(1);
    // Optionally clear filters if any (not specified)
  };

  const handleReport = () => {
    alert("Report generated for expired products.");
  };

  return (
    <div className="min-h-screen bg-background  ">
      <h1 className="text-lg font-semibold mb-6">Expired Products</h1>

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex space-x-3">
          <button
            onClick={handleReport}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            title="Generate Report"
            type="button"
          >
            <i className="fa fa-file-pdf-o fa-light" aria-hidden="true"></i>{" "}
            Report
          </button>
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            title="Clear"
            type="button"
          >
            <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
          </button>
        </div>
      </div>

      {/* Preserved Add Section (filters form) exactly as is */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <form className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label
              htmlFor="productName"
              className="block text-sm font-medium mb-1 text-foreground"
            >
              Product Name
            </label>
            <input
              id="productName"
              name="productName"
              type="text"
              placeholder="Product Name"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-1 text-foreground"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              defaultValue=""
            >
              <option value="" disabled>
                Select Category
              </option>
              <option>Fruits</option>
              <option>Dairy</option>
              <option>Bakery</option>
              <option>Vegetables</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="supplier"
              className="block text-sm font-medium mb-1 text-foreground"
            >
              Supplier
            </label>
            <select
              id="supplier"
              name="supplier"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              defaultValue=""
            >
              <option value="" disabled>
                Select Supplier
              </option>
              <option>Supplier A</option>
              <option>Supplier B</option>
              <option>Supplier C</option>
              <option>Supplier D</option>
              <option>Supplier E</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="expiredDate"
              className="block text-sm font-medium mb-1 text-foreground"
            >
              Expired Date
            </label>
            <input
              id="expiredDate"
              name="expiredDate"
              type="date"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
            />
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                Product Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                Product Code
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                Category
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                Supplier
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                Expired Date
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground whitespace-nowrap">
                Quantity
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                Unit
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground whitespace-nowrap">
                Cost
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground whitespace-nowrap">
                Price
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="text-center px-4 py-6 text-muted-foreground italic"
                >
                  No expired products found.
                </td>
              </tr>
            )}
            {paginatedData.map((item, idx) => (
              <tr
                key={idx}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                  {item.productName}
                </td>
                <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                  {item.productCode}
                </td>
                <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                  {item.category}
                </td>
                <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                  {item.supplier}
                </td>
                <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                  {item.expiredDate}
                </td>
                <td className="px-4 py-3 text-sm text-foreground text-right whitespace-nowrap">
                  {item.quantity}
                </td>
                <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                  {item.unit}
                </td>
                <td className="px-4 py-3 text-sm text-foreground text-right whitespace-nowrap">
                  ${item.cost?.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-foreground text-right whitespace-nowrap">
                  ${item.price?.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center text-sm space-x-3">
                  <button
                    onClick={() => handleEdit(idx)}
                    className="text-primary hover:text-primary/80 transition-colors"
                    aria-label={`Edit product ${item.productName}`}
                    type="button"
                  >
                    <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
              className="text-xl font-semibold mb-4 text-center text-foreground"
            >
              Edit Expired Product
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-foreground">
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
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label
                  htmlFor="editProductCode"
                  className="block text-sm font-medium mb-1"
                >
                  Product Code
                </label>
                <input
                  type="text"
                  id="editProductCode"
                  name="productCode"
                  value={editForm.productCode}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter product code"
                />
              </div>
              <div>
                <label
                  htmlFor="editCategory"
                  className="block text-sm font-medium mb-1"
                >
                  Category
                </label>
                <select
                  id="editCategory"
                  name="category"
                  value={editForm.category}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select Category</option>
                  <option>Fruits</option>
                  <option>Dairy</option>
                  <option>Bakery</option>
                  <option>Vegetables</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="editSupplier"
                  className="block text-sm font-medium mb-1"
                >
                  Supplier
                </label>
                <select
                  id="editSupplier"
                  name="supplier"
                  value={editForm.supplier}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select Supplier</option>
                  <option>Supplier A</option>
                  <option>Supplier B</option>
                  <option>Supplier C</option>
                  <option>Supplier D</option>
                  <option>Supplier E</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="editExpiredDate"
                  className="block text-sm font-medium mb-1"
                >
                  Expired Date
                </label>
                <input
                  type="date"
                  id="editExpiredDate"
                  name="expiredDate"
                  value={editForm.expiredDate}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label
                  htmlFor="editQuantity"
                  className="block text-sm font-medium mb-1"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="editQuantity"
                  name="quantity"
                  value={editForm.quantity}
                  onChange={handleEditInputChange}
                  min={0}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter quantity"
                />
              </div>
              <div>
                <label
                  htmlFor="editUnit"
                  className="block text-sm font-medium mb-1"
                >
                  Unit
                </label>
                <input
                  type="text"
                  id="editUnit"
                  name="unit"
                  value={editForm.unit}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter unit"
                />
              </div>
              <div>
                <label
                  htmlFor="editCost"
                  className="block text-sm font-medium mb-1"
                >
                  Cost
                </label>
                <input
                  type="number"
                  id="editCost"
                  name="cost"
                  value={editForm.cost}
                  onChange={handleEditInputChange}
                  min={0}
                  step="0.01"
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter cost"
                />
              </div>
              <div>
                <label
                  htmlFor="editPrice"
                  className="block text-sm font-medium mb-1"
                >
                  Price
                </label>
                <input
                  type="number"
                  id="editPrice"
                  name="price"
                  value={editForm.price}
                  onChange={handleEditInputChange}
                  min={0}
                  step="0.01"
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter price"
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
