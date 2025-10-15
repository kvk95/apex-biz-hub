import { apiService } from "@/services/ApiService";
import React, { useEffect, useMemo, useState } from "react";
import { Pagination } from "@/components/Pagination/Pagination";

type ProductExpiry = {
  productName: string;
  productCode: string;
  barcode: string;
  category: string;
  subCategory: string;
  brand: string;
  unit: string;
  quantity: number;
  expiryDate: string; // ISO string yyyy-mm-dd
  purchasePrice: number;
  salePrice: number;
  warehouse: string;
  supplier: string;
  status: "Expired" | "Expiring" | "Safe";
};

const CATEGORIES = [
  "All",
  "Beverages",
  "Dairy",
  "Condiments",
  "Spices",
];

const BRANDS = [
  "All",
  "FreshFarms",
  "DairyBest",
  "CheeseCo",
  "ButterKing",
  "SauceMaster",
  "SpiceWorld",
];

const WAREHOUSES = [
  "All",
  "Main Warehouse",
  "Secondary Warehouse",
];

const SUPPLIERS = [
  "All",
  "Supplier A",
  "Supplier B",
  "Supplier C",
  "Supplier D",
  "Supplier E",
];

const STATUS_OPTIONS = [
  "All",
  "Expired",
  "Expiring",
  "Safe",
];

export default function ProductExpiryReport() {
  const [data, setData] = useState<ProductExpiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<ProductExpiry[]>("ProductExpiryReport");
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

  // Filters state
  const [productName, setProductName] = useState("");
  const [productCode, setProductCode] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [warehouse, setWarehouse] = useState("All");
  const [supplier, setSupplier] = useState("All");
  const [status, setStatus] = useState("All");
  const [expiryFrom, setExpiryFrom] = useState("");
  const [expiryTo, setExpiryTo] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<ProductExpiry>({
    productName: "",
    productCode: "",
    barcode: "",
    category: "",
    subCategory: "",
    brand: "",
    unit: "",
    quantity: 0,
    expiryDate: "",
    purchasePrice: 0,
    salePrice: 0,
    warehouse: "",
    supplier: "",
    status: "Safe",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Filtered data memoized
  const filteredData = useMemo(() => {
    return data.filter((p) => {
      if (productName && !p.productName.toLowerCase().includes(productName.toLowerCase()))
        return false;
      if (productCode && !p.productCode.toLowerCase().includes(productCode.toLowerCase()))
        return false;
      if (category !== "All" && p.category !== category) return false;
      if (brand !== "All" && p.brand !== brand) return false;
      if (warehouse !== "All" && p.warehouse !== warehouse) return false;
      if (supplier !== "All" && p.supplier !== supplier) return false;
      if (status !== "All" && p.status !== status) return false;
      if (expiryFrom && p.expiryDate < expiryFrom) return false;
      if (expiryTo && p.expiryDate > expiryTo) return false;
      return true;
    });
  }, [data, productName, productCode, category, brand, warehouse, supplier, status, expiryFrom, expiryTo]);

  // Paginated data using Pagination component props
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const onResetFilters = () => {
    setProductName("");
    setProductCode("");
    setCategory("All");
    setBrand("All");
    setWarehouse("All");
    setSupplier("All");
    setStatus("All");
    setExpiryFrom("");
    setExpiryTo("");
    setCurrentPage(1);
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onPageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  // Edit modal handlers
  const handleEditClick = (index: number) => {
    const item = paginatedData[index];
    if (item) {
      setEditForm({ ...item });
      setEditIndex((currentPage - 1) * itemsPerPage + index);
      setIsEditModalOpen(true);
    }
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "purchasePrice" || name === "salePrice"
          ? Number(value)
          : value,
    }));
  };

  const handleEditSave = () => {
    if (
      !editForm.productName.trim() ||
      !editForm.productCode.trim() ||
      !editForm.expiryDate
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (editIndex !== null) {
      setData((prev) =>
        prev.map((item, idx) => (idx === editIndex ? editForm : item))
      );
      setEditIndex(null);
      setIsEditModalOpen(false);
    }
  };

  const handleEditCancel = () => {
    setEditIndex(null);
    setIsEditModalOpen(false);
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    onResetFilters();
  };

  // Title as in reference page
  React.useEffect(() => {
    document.title = "Product Expiry Report";
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      <h1 className="text-2xl font-semibold mb-6">Product Expiry Report</h1>

      {/* Filter Section */}
      <form
        onSubmit={onSearch}
        className="bg-card rounded shadow p-6 mb-6"
        aria-label="Filter product expiry report"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Product Name */}
          <div>
            <label
              htmlFor="productName"
              className="block text-sm font-medium mb-1"
            >
              Product Name
            </label>
            <input
              id="productName"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter product name"
            />
          </div>

          {/* Product Code */}
          <div>
            <label
              htmlFor="productCode"
              className="block text-sm font-medium mb-1"
            >
              Product Code
            </label>
            <input
              id="productCode"
              type="text"
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter product code"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-1"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div>
            <label
              htmlFor="brand"
              className="block text-sm font-medium mb-1"
            >
              Brand
            </label>
            <select
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Warehouse */}
          <div>
            <label
              htmlFor="warehouse"
              className="block text-sm font-medium mb-1"
            >
              Warehouse
            </label>
            <select
              id="warehouse"
              value={warehouse}
              onChange={(e) => setWarehouse(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {WAREHOUSES.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          {/* Supplier */}
          <div>
            <label
              htmlFor="supplier"
              className="block text-sm font-medium mb-1"
            >
              Supplier
            </label>
            <select
              id="supplier"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {SUPPLIERS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium mb-1"
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Expiry Date From */}
          <div>
            <label
              htmlFor="expiryFrom"
              className="block text-sm font-medium mb-1"
            >
              Expiry Date From
            </label>
            <input
              id="expiryFrom"
              type="date"
              value={expiryFrom}
              onChange={(e) => setExpiryFrom(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Expiry Date To */}
          <div>
            <label
              htmlFor="expiryTo"
              className="block text-sm font-medium mb-1"
            >
              Expiry Date To
            </label>
            <input
              id="expiryTo"
              type="date"
              value={expiryTo}
              onChange={(e) => setExpiryTo(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <i className="fa fa-search fa-light" aria-hidden="true"></i> Search
          </button>
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <i className="fa fa-undo fa-light" aria-hidden="true"></i> Reset
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="ml-auto inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Print Report
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
          </button>
        </div>
      </form>

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
                  Product Code
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Barcode
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Sub Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Brand
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Unit
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Expiry Date
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Purchase Price
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Sale Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Warehouse
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Supplier
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
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={15}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((p, idx) => (
                  <tr
                    key={`${p.productCode}-${idx}`}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">{p.productName}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{p.productCode}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{p.barcode}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{p.category}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{p.subCategory}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{p.brand}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{p.unit}</td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">{p.quantity}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{p.expiryDate}</td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">${p.purchasePrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">${p.salePrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{p.warehouse}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{p.supplier}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          p.status === "Expired"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : p.status === "Expiring"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm space-x-3">
                      <button
                        onClick={() => handleEditClick(idx)}
                        className="text-primary hover:text-primary/80 transition-colors"
                        aria-label={`Edit product ${p.productName}`}
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
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
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
              Edit Product Expiry
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Product Name */}
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

              {/* Product Code */}
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

              {/* Barcode */}
              <div>
                <label
                  htmlFor="editBarcode"
                  className="block text-sm font-medium mb-1"
                >
                  Barcode
                </label>
                <input
                  type="text"
                  id="editBarcode"
                  name="barcode"
                  value={editForm.barcode}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter barcode"
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
                <input
                  type="text"
                  id="editCategory"
                  name="category"
                  value={editForm.category}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter category"
                />
              </div>

              {/* Sub Category */}
              <div>
                <label
                  htmlFor="editSubCategory"
                  className="block text-sm font-medium mb-1"
                >
                  Sub Category
                </label>
                <input
                  type="text"
                  id="editSubCategory"
                  name="subCategory"
                  value={editForm.subCategory}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter sub category"
                />
              </div>

              {/* Brand */}
              <div>
                <label
                  htmlFor="editBrand"
                  className="block text-sm font-medium mb-1"
                >
                  Brand
                </label>
                <input
                  type="text"
                  id="editBrand"
                  name="brand"
                  value={editForm.brand}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter brand"
                />
              </div>

              {/* Unit */}
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

              {/* Expiry Date */}
              <div>
                <label
                  htmlFor="editExpiryDate"
                  className="block text-sm font-medium mb-1"
                >
                  Expiry Date
                </label>
                <input
                  type="date"
                  id="editExpiryDate"
                  name="expiryDate"
                  value={editForm.expiryDate}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Purchase Price */}
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
                  value={editForm.purchasePrice}
                  onChange={handleEditInputChange}
                  min={0}
                  step="0.01"
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter purchase price"
                />
              </div>

              {/* Sale Price */}
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
                  value={editForm.salePrice}
                  onChange={handleEditInputChange}
                  min={0}
                  step="0.01"
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter sale price"
                />
              </div>

              {/* Warehouse */}
              <div>
                <label
                  htmlFor="editWarehouse"
                  className="block text-sm font-medium mb-1"
                >
                  Warehouse
                </label>
                <input
                  type="text"
                  id="editWarehouse"
                  name="warehouse"
                  value={editForm.warehouse}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter warehouse"
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
                  placeholder="Enter supplier"
                />
              </div>

              {/* Status */}
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
                  {STATUS_OPTIONS.filter((st) => st !== "All").map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
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