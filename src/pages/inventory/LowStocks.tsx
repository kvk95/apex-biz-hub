import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const categories = [
  "All Categories",
  "Mobile",
  "Headphones",
  "Laptop",
  "Accessories",
  "Smart Home",
  "Tablet",
  "Speaker",
  "Camera",
];

export default function LowStocks() {
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filters states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    product: "",
    category: "",
    quantity: "",
    price: "",
    supplier: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("LowStocks");
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

  // Filtered and searched data
  const filteredData = useMemo(() => {
    return data.filter((item: any) => {
      const matchesCategory =
        selectedCategory === "All Categories" ||
        item.category === selectedCategory;
      const matchesSearch =
        item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [data, searchTerm, selectedCategory]);

  // Pagination logic handled by Pagination component, so just slice data accordingly
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [currentPage, itemsPerPage, filteredData]);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generated for low stock items.");
  };

  // Open edit modal and populate edit form
  const handleEdit = (index: number) => {
    const item = paginatedData[index];
    if (item) {
      setEditForm({
        product: item.product,
        category: item.category,
        quantity: item.quantity.toString(),
        price: item.price.toString(),
        supplier: item.supplier,
      });
      setEditIndex((currentPage - 1) * itemsPerPage + index);
      setIsEditModalOpen(true);
    }
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (
      !editForm.product.trim() ||
      !editForm.category.trim() ||
      !editForm.quantity ||
      !editForm.price ||
      !editForm.supplier.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (editIndex !== null) {
      setData((prev) =>
        prev.map((item, idx) =>
          idx === editIndex
            ? {
                ...item,
                product: editForm.product.trim(),
                category: editForm.category.trim(),
                quantity: Number(editForm.quantity),
                price: Number(editForm.price),
                supplier: editForm.supplier.trim(),
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

  return (
    <> 
      <div className="min-h-screen bg-background">
        {/* Title */}
        <h1 className="text-lg font-semibold mb-6">Low Stocks</h1>

        {/* Filters Section */}
        <section className="bg-card rounded shadow p-6 mb-6">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium mb-1"
              >
                Search Product or Supplier
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by product or supplier"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium mb-1"
              >
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end space-x-3">
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
                aria-label="Clear"
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
          </form>
        </section>

        {/* Table Section */}
        <section className="bg-card rounded shadow py-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Product Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Category
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                    Price ($)
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Supplier
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center px-4 py-6 text-muted-foreground italic"
                    >
                      No low stock items found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, idx) => (
                    <tr
                      key={`${item.product}-${idx}`}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-foreground">
                        {item.product}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {item.category}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground text-right">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground text-right">
                        {Number(item.price).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {item.supplier}
                      </td>
                      <td className="px-4 py-3 text-center text-sm space-x-3">
                        <button
                          onClick={() => handleEdit(idx)}
                          className="text-primary hover:text-primary/80 transition-colors"
                          aria-label={`Edit low stock item ${item.product}`}
                          type="button"
                        >
                          <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
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
            totalItems={filteredData.length}
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
                Edit Low Stock Item
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Product */}
                <div>
                  <label
                    htmlFor="editProduct"
                    className="block text-sm font-medium mb-1"
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="editProduct"
                    name="product"
                    value={editForm.product}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter product name"
                  />
                </div>

                {/* Category */}
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
                    {categories
                      .filter((cat) => cat !== "All Categories")
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Quantity */}
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

                {/* Price */}
                <div>
                  <label
                    htmlFor="editPrice"
                    className="block text-sm font-medium mb-1"
                  >
                    Price ($)
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

                {/* Supplier */}
                <div>
                  <label
                    htmlFor="editSupplier"
                    className="block text-sm font-medium mb-1"
                  >
                    Supplier
                  </label>
                  <input
                    type="text"
                    id="editSupplier"
                    name="supplier"
                    value={editForm.supplier}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter supplier name"
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
    </>
  );
}