import React, { useEffect, useState } from "react";
import { apiService } from "@/services/ApiService";

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
  const [productsPerPage] = useState(5);
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

  // Pagination calculations
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

    if (editId !== null) {
      // Edit existing product
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editId
            ? {
                ...p,
                productCode: formData.productCode.trim(),
                productName: formData.productName.trim(),
                category: formData.category,
                unit: formData.unit,
                purchasePrice: Number(formData.purchasePrice),
                salePrice: Number(formData.salePrice),
                stockQty: Number(formData.stockQty),
                status: formData.status,
              }
            : p
        )
      );
      setEditId(null);
    } else {
      // Add new product
      const newProduct = {
        id: products.length ? products[products.length - 1].id + 1 : 1,
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
    }
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

  const handleEdit = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setFormData({
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (editId === id) {
        setEditId(null);
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
      }
    }
  };

  const handleRefresh = () => {
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
  };

  const handleReport = () => {
    alert("Report generation is not implemented in this demo.");
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <title>Create Product - Dreams POS</title>
      <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-900">
            Create Product
          </h1>
          <div className="space-x-2">
            <button
              onClick={handleReport}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
              title="Report"
            >
              <i className="fas fa-file-alt mr-2"></i> Report
            </button>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md text-sm font-medium"
              title="Refresh"
            >
              <i className="fas fa-sync-alt mr-2"></i> Refresh
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
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
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Code <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="productCode"
                name="productCode"
                value={formData.productCode}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Enter product code"
                required
              />
            </div>

            <div>
              <label
                htmlFor="productName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category <span className="text-red-600">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
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
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Unit <span className="text-red-600">*</span>
              </label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
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
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Purchase Price <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                id="purchasePrice"
                name="purchasePrice"
                min="0"
                step="0.01"
                value={formData.purchasePrice}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Enter purchase price"
                required
              />
            </div>

            <div>
              <label
                htmlFor="salePrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sale Price <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                id="salePrice"
                name="salePrice"
                min="0"
                step="0.01"
                value={formData.salePrice}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Enter sale price"
                required
              />
            </div>

            <div>
              <label
                htmlFor="stockQty"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Stock Quantity <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                id="stockQty"
                name="stockQty"
                min="0"
                value={formData.stockQty}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Enter stock quantity"
                required
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status <span className="text-red-600">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="md:col-span-3 flex space-x-4 pt-4">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium"
                title="Save Product"
              >
                <i className="fas fa-save mr-2"></i>
                {editId !== null ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md text-sm font-medium"
                title="Clear Form"
              >
                <i className="fas fa-redo-alt mr-2"></i> Clear
              </button>
            </div>
          </form>
        </div>

        {/* Products Table Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Product List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b border-gray-300 bg-gray-50 font-medium text-gray-700">
                <tr>
                  <th className="px-4 py-3 w-24">Code</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3 w-36">Category</th>
                  <th className="px-4 py-3 w-24">Unit</th>
                  <th className="px-4 py-3 w-28 text-right">Purchase Price</th>
                  <th className="px-4 py-3 w-28 text-right">Sale Price</th>
                  <th className="px-4 py-3 w-24 text-right">Stock Qty</th>
                  <th className="px-4 py-3 w-28">Status</th>
                  <th className="px-4 py-3 w-32 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No products found.
                    </td>
                  </tr>
                )}
                {currentProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">{product.productCode}</td>
                    <td className="px-4 py-3">{product.productName}</td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3">{product.unit}</td>
                    <td className="px-4 py-3 text-right">
                      ${product.purchasePrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      ${product.salePrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">{product.stockQty}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          product.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(product.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav
            className="mt-6 flex justify-center items-center space-x-2"
            aria-label="Pagination"
          >
            <button
              onClick={() => paginate(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="First Page"
              title="First Page"
            >
              <i className="fas fa-angle-double-left"></i>
            </button>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Previous Page"
              title="Previous Page"
            >
              <i className="fas fa-angle-left"></i>
            </button>
            {[...Array(totalPages)].map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === pageNum
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-200"
                  }`}
                  aria-current={currentPage === pageNum ? "page" : undefined}
                  title={`Page ${pageNum}`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Next Page"
              title="Next Page"
            >
              <i className="fas fa-angle-right"></i>
            </button>
            <button
              onClick={() => paginate(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Last Page"
              title="Last Page"
            >
              <i className="fas fa-angle-double-right"></i>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}