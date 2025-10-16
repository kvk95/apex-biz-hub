import React, { useEffect, useState } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const categories = [
  "Electronics",
  "Accessories",
  "Footwear",
  "Clothing",
  "Home Appliances",
];

const units = ["Piece", "Pair", "Box", "Packet"];

export default function CreateProduct() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    productCode: "",
    productName: "",
    category: "",
    unit: "",
    purchasePrice: "",
    salePrice: "",
    stockQty: "",
    status: "Active",
  });

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    productCode: "",
    productName: "",
    category: "",
    unit: "",
    purchasePrice: "",
    salePrice: "",
    stockQty: "",
    status: "Active",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("CreateProduct");
    if (response.status.code === "S") {
      setData(response.result);
      setProducts(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers for Add Section form inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save handler for Add Section (Add new product)
  const handleSave = () => {
    // Validate required fields (basic)
    if (
      !formData.productCode.trim() ||
      !formData.productName.trim() ||
      !formData.category ||
      !formData.unit ||
      !formData.purchasePrice ||
      !formData.salePrice ||
      !formData.stockQty
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const newProduct = {
      id: products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1,
      productCode: formData.productCode.trim(),
      productName: formData.productName.trim(),
      category: formData.category,
      unit: formData.unit,
      purchasePrice: Number(formData.purchasePrice),
      salePrice: Number(formData.salePrice),
      stockQty: Number(formData.stockQty),
      status: formData.status,
    };
    setProducts((prev) => [...prev, newProduct]);
    setFormData({
      productCode: "",
      productName: "",
      category: "",
      unit: "",
      purchasePrice: "",
      salePrice: "",
      stockQty: "",
      status: "Active",
    });
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setEditForm({
      productCode: product.productCode,
      productName: product.productName,
      category: product.category,
      unit: product.unit,
      purchasePrice: product.purchasePrice.toString(),
      salePrice: product.salePrice.toString(),
      stockQty: product.stockQty.toString(),
      status: product.status,
    });
    setEditId(id);
    setIsEditModalOpen(true);
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (
      !editForm.productCode.trim() ||
      !editForm.productName.trim() ||
      !editForm.category ||
      !editForm.unit ||
      !editForm.purchasePrice ||
      !editForm.salePrice ||
      !editForm.stockQty
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editId
            ? {
                ...p,
                productCode: editForm.productCode.trim(),
                productName: editForm.productName.trim(),
                category: editForm.category,
                unit: editForm.unit,
                purchasePrice: Number(editForm.purchasePrice),
                salePrice: Number(editForm.salePrice),
                stockQty: Number(editForm.stockQty),
                status: editForm.status,
              }
            : p
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

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (editId === id) {
        setEditId(null);
      }
      // If deleting last item on page, go to previous page if needed
      if (
        (currentPage - 1) * itemsPerPage >= products.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setFormData({
      productCode: "",
      productName: "",
      category: "",
      unit: "",
      purchasePrice: "",
      salePrice: "",
      stockQty: "",
      status: "Active",
    });
    setEditId(null);
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generation is not implemented in this demo.");
  };

  // Calculate paginated data using Pagination component props
  const paginatedData = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background "> 
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-lg font-semibold mb-6">Create Product</h1>
          <div className="space-x-2">
            <button
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              title="Report"
              type="button"
            >
              <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
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

        {/* Form Section (Add Section) - preserved exactly */}
        <section className="bg-card rounded shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Product Details</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div>
              <label
                htmlFor="productCode"
                className="block text-sm font-medium mb-1"
              >
                Product Code <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="productCode"
                name="productCode"
                value={formData.productCode}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter product code"
                required
              />
            </div>

            <div>
              <label
                htmlFor="productName"
                className="block text-sm font-medium mb-1"
              >
                Product Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium mb-1"
              >
                Category <span className="text-destructive">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="" disabled>
                  Select category
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="unit"
                className="block text-sm font-medium mb-1"
              >
                Unit <span className="text-destructive">*</span>
              </label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="" disabled>
                  Select unit
                </option>
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="purchasePrice"
                className="block text-sm font-medium mb-1"
              >
                Purchase Price <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                id="purchasePrice"
                name="purchasePrice"
                min="0"
                step="0.01"
                value={formData.purchasePrice}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter purchase price"
                required
              />
            </div>

            <div>
              <label
                htmlFor="salePrice"
                className="block text-sm font-medium mb-1"
              >
                Sale Price <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                id="salePrice"
                name="salePrice"
                min="0"
                step="0.01"
                value={formData.salePrice}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter sale price"
                required
              />
            </div>

            <div>
              <label
                htmlFor="stockQty"
                className="block text-sm font-medium mb-1"
              >
                Stock Quantity <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                id="stockQty"
                name="stockQty"
                min="0"
                value={formData.stockQty}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter stock quantity"
                required
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-1"
              >
                Status <span className="text-destructive">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="md:col-span-3 flex space-x-4 pt-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                title="Save Product"
              >
                <i className="fa fa-save fa-light" aria-hidden="true"></i>
                Save
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-6 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                title="Clear Form"
              >
                <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
              </button>
            </div>
          </form>
        </section>

        {/* Products Table Section */}
        <section className="bg-card rounded shadow py-6">
          <h2 className="text-xl font-semibold mb-4">Product List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-24">
                    Code
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-36">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-24">
                    Unit
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground w-28">
                    Purchase Price
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground w-28">
                    Sale Price
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground w-24">
                    Stock Qty
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-28">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground w-32">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center px-4 py-6 text-muted-foreground italic"
                    >
                      No products found.
                    </td>
                  </tr>
                )}
                {paginatedData.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {product.productCode}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {product.productName}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {product.category}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {product.unit}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">
                      ${product.purchasePrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">
                      ${product.salePrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">
                      {product.stockQty}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          product.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm space-x-3">
                      <button
                        onClick={() => handleEdit(product.id)}
                        className="text-primary hover:text-primary/80 transition-colors"
                        aria-label={`Edit product ${product.productName}`}
                        type="button"
                      >
                        <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                        aria-label={`Delete product ${product.productName}`}
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
            totalItems={products.length}
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
                Edit Product
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <option value="" disabled>
                      Select category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="editUnit"
                    className="block text-sm font-medium mb-1"
                  >
                    Unit
                  </label>
                  <select
                    id="editUnit"
                    name="unit"
                    value={editForm.unit}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="" disabled>
                      Select unit
                    </option>
                    {units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="editPurchasePrice"
                    className="block text-sm font-medium mb-1"
                  >
                    Purchase Price
                  </label>
                  <input
                    type="number"
                    id="editPurchasePrice"
                    name="purchasePrice"
                    min="0"
                    step="0.01"
                    value={editForm.purchasePrice}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter purchase price"
                  />
                </div>

                <div>
                  <label
                    htmlFor="editSalePrice"
                    className="block text-sm font-medium mb-1"
                  >
                    Sale Price
                  </label>
                  <input
                    type="number"
                    id="editSalePrice"
                    name="salePrice"
                    min="0"
                    step="0.01"
                    value={editForm.salePrice}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter sale price"
                  />
                </div>

                <div>
                  <label
                    htmlFor="editStockQty"
                    className="block text-sm font-medium mb-1"
                  >
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    id="editStockQty"
                    name="stockQty"
                    min="0"
                    value={editForm.stockQty}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter stock quantity"
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
                    <option value="Inactive">Inactive</option>
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
    </div>
  );
}