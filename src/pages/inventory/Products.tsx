import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const categories = [
  "All Categories",
  "Mobile",
  "Laptop",
  "Accessories",
  "Wearable",
  "Camera",
];

const statuses = ["All Status", "Active", "Inactive"];

export default function Products() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    productName: "",
    category: categories[1],
    price: "",
    stock: "",
    status: statuses[1],
    image: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Products");
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

  // Filtered and searched products
  const filteredProducts = useMemo(() => {
    return data
      .filter((p) =>
        selectedCategory === "All Categories"
          ? true
          : p.category === selectedCategory
      )
      .filter((p) =>
        selectedStatus === "All Status" ? true : p.status === selectedStatus
      )
      .filter((p) =>
        p.productName.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
  }, [data, searchTerm, selectedCategory, selectedStatus]);

  // Paginated products using Pagination component props
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setSelectedStatus("All Status");
    setCurrentPage(1);
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        productName: item.productName,
        category: item.category,
        price: item.price.toString(),
        stock: item.stock.toString(),
        status: item.status,
        image: item.image,
      });
      setEditId(id);
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
      !editForm.productName.trim() ||
      !editForm.price ||
      !editForm.stock ||
      !editForm.category ||
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
                productName: editForm.productName.trim(),
                category: editForm.category,
                price: Number(editForm.price),
                stock: Number(editForm.stock),
                status: editForm.status,
                image: editForm.image,
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

  // Delete handler
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      // If deleting last item on page, go to previous page if needed
      if (
        (currentPage - 1) * itemsPerPage >= filteredProducts.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  return (
    <> 
      <div className="min-h-screen bg-background">
        
        <h1 className="text-lg font-semibold mb-6">Products</h1>

        {/* Filters Section */}
        <section className="bg-card rounded shadow p-6 mb-6">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                Search Product
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by product name"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium mb-1 text-muted-foreground"
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

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-1 text-muted-foreground"
              >
                Status
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={handleStatusChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleRefresh}
                className="w-full inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                title="Clear Filters"
              >
                <i className="fa fa-times fa-light" aria-hidden="true"></i>
                Clear Filters
              </button>
            </div>
          </form>
        </section>

        {/* Products Table */}
        <section className="bg-card rounded shadow py-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Category
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                    Price ($)
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center px-4 py-6 text-muted-foreground italic"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : paginatedProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center px-4 py-6 text-muted-foreground italic"
                    >
                      No products found.
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((product, idx) => (
                    <tr
                      key={product.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-foreground">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground flex items-center space-x-3">
                        <img
                          src={product.image}
                          alt={product.productName}
                          className="w-12 h-12 rounded object-contain"
                        />
                        <span>{product.productName}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {product.category}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground text-right font-semibold">
                        {product.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground text-right">
                        {product.stock}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground text-center">
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
                          title="Edit"
                        >
                          <i
                            className="fa fa-pencil fa-light"
                            aria-hidden="true"
                          ></i>
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-destructive hover:text-destructive/80 transition-colors"
                          aria-label={`Delete product ${product.productName}`}
                          type="button"
                          title="Delete"
                        >
                          <i
                            className="fa fa-trash fa-light"
                            aria-hidden="true"
                          ></i>
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
            totalItems={filteredProducts.length}
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
                {/* Product Name */}
                <div>
                  <label
                    htmlFor="editProductName"
                    className="block text-sm font-medium mb-1 text-muted-foreground"
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

                {/* Category */}
                <div>
                  <label
                    htmlFor="editCategory"
                    className="block text-sm font-medium mb-1 text-muted-foreground"
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
                    {categories.slice(1).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label
                    htmlFor="editPrice"
                    className="block text-sm font-medium mb-1 text-muted-foreground"
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
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter price"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label
                    htmlFor="editStock"
                    className="block text-sm font-medium mb-1 text-muted-foreground"
                  >
                    Stock
                  </label>
                  <input
                    type="number"
                    id="editStock"
                    name="stock"
                    value={editForm.stock}
                    onChange={handleEditInputChange}
                    min={0}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter stock quantity"
                  />
                </div>

                {/* Status */}
                <div>
                  <label
                    htmlFor="editStatus"
                    className="block text-sm font-medium mb-1 text-muted-foreground"
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
                    {statuses.slice(1).map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image URL */}
                <div>
                  <label
                    htmlFor="editImage"
                    className="block text-sm font-medium mb-1 text-muted-foreground"
                  >
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="editImage"
                    name="image"
                    value={editForm.image}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter image URL"
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