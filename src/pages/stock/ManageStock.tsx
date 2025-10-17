import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const categories = [
  "All Categories",
  "Mobile",
  "Accessories",
  "Computers",
  "Photography",
];

const suppliers = [
  "All Suppliers",
  "Apple Inc.",
  "Samsung",
  "Sony",
  "Dell",
  "Logitech",
  "Canon",
  "HP",
  "Bose",
  "Microsoft",
  "Google",
  "JBL",
];

const units = ["Piece", "Box", "Packet", "Kg"];

const pageSizeOptions = [10, 25, 50, 100];

export default function ManageStock() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [supplierFilter, setSupplierFilter] = useState("All Suppliers");
  const [unitFilter, setUnitFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    productName: "",
    productCode: "",
    category: "",
    supplier: "",
    unit: "",
    purchaseQty: 0,
    saleQty: 0,
    stockQty: 0,
    purchasePrice: 0,
    salePrice: 0,
    stockValue: 0,
  });
  const [editId, setEditId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("ManageStock");
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
    return data.filter((item) => {
      const matchesSearch =
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "All Categories" || item.category === categoryFilter;
      const matchesSupplier =
        supplierFilter === "All Suppliers" || item.supplier === supplierFilter;
      const matchesUnit = unitFilter === "" || item.unit === unitFilter;
      return matchesSearch && matchesCategory && matchesSupplier && matchesUnit;
    });
  }, [data, searchTerm, categoryFilter, supplierFilter, unitFilter]);

  const pageCount = Math.ceil(filteredData.length / pageSize);

  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page < 1) page = 1;
    else if (page > pageCount) page = pageCount;
    setCurrentPage(page);
  };

  // Handlers for buttons (refresh, report, save)
  const handleRefresh = () => {
    // For demo, just reset filters and page
    setSearchTerm("");
    setCategoryFilter("All Categories");
    setSupplierFilter("All Suppliers");
    setUnitFilter("");
    setPageSize(10);
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generation is not implemented in this demo.");
  };

  const handleSave = () => {
    alert("Save functionality is not implemented in this demo.");
  };

  // Edit Modal handlers
  const handleEdit = (id: number) => {
    const item = filteredData.find((i) => i.id === id);
    if (item) {
      setEditForm({
        productName: item.productName,
        productCode: item.productCode,
        category: item.category,
        supplier: item.supplier,
        unit: item.unit,
        purchaseQty: item.purchaseQty,
        saleQty: item.saleQty,
        stockQty: item.stockQty,
        purchasePrice: item.purchasePrice,
        salePrice: item.salePrice,
        stockValue: item.stockValue,
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
    if (editId !== null) {
      // Update logic here (not implemented in this example)
      setIsEditModalOpen(false);
      setEditId(null);
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setEditId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-full mx-auto p-6">
        {/* Page Title */}
        <h1 className="text-lg font-semibold mb-6 ">Manage Stock</h1>

        {/* Filters and Actions */}
        <div className="bg-card rounded shadow p-6 mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
            className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end"
          >
            {/* Search */}
            <div className="col-span-1 md:col-span-2">
              <label
                htmlFor="search"
                className="block text-sm font-medium mb-1"
              >
                Search Product Name or Code
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search..."
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
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
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
              >
                {suppliers.map((sup) => (
                  <option key={sup} value={sup}>
                    {sup}
                  </option>
                ))}
              </select>
            </div>

            {/* Unit */}
            <div>
              <label
                htmlFor="unit"
                className="block text-sm font-medium mb-1"
              >
                Unit
              </label>
              <select
                id="unit"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={unitFilter}
                onChange={(e) => setUnitFilter(e.target.value)}
              >
                <option value="">All Units</option>
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex space-x-2 md:justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <i className="fa fa-search fa-light" aria-hidden="true"></i> Search
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
              </button>
            </div>
          </form>
        </div>

        {/* Stock Table */}
        <div className="bg-card rounded shadow overflow-x-auto">
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
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Supplier
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Unit
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Purchase Qty
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Sale Qty
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Stock Qty
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Purchase Price
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Sale Price
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Stock Value
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pagedData.length === 0 && (
                <tr>
                  <td
                    colSpan={12}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No stock items found.
                  </td>
                </tr>
              )}
              {pagedData.map((item) => (
                <tr key={item.id} className="border-b border-border hover:bg-muted/50 transition-colors text-sm text-gray-500">
                  <td className="px-4 py-2">{item.productName}</td>
                  <td className="px-4 py-2">{item.productCode}</td>
                  <td className="px-4 py-2">{item.category}</td>
                  <td className="px-4 py-2">{item.supplier}</td>
                  <td className="px-4 py-2">{item.unit}</td>
                  <td className="px-4 py-2 text-right">{item.purchaseQty}</td>
                  <td className="px-4 py-2 text-right">{item.saleQty}</td>
                  <td className="px-4 py-2 text-right">{item.stockQty}</td>
                  <td className="px-4 py-2 text-right">${item.purchasePrice.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">${item.salePrice.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">${item.stockValue.toFixed(2)}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(item.id)}
                      aria-label={`Edit ${item.productName}`}
                      className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
                    >
                      <i className="fa fa-edit fa-light" aria-hidden="true"></i>
                      <span className="sr-only">Edit record</span>
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
                      onClick={() =>
                        alert(`Delete functionality not implemented for ${item.productName}`)
                      }
                    >
                      <i className="fa fa-trash-can-xmark fa-light" aria-hidden="true"></i>
                      <span className="sr-only">Delete record</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            itemsPerPage={pageSize}
            totalItems={filteredData.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
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
                Edit Stock Item
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Supplier */}
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
                    {suppliers.map((sup) => (
                      <option key={sup} value={sup}>
                        {sup}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Unit */}
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
                    {units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Purchase Qty */}
                <div>
                  <label
                    htmlFor="editPurchaseQty"
                    className="block text-sm font-medium mb-1"
                  >
                    Purchase Qty
                  </label>
                  <input
                    type="number"
                    id="editPurchaseQty"
                    name="purchaseQty"
                    value={editForm.purchaseQty}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Sale Qty */}
                <div>
                  <label
                    htmlFor="editSaleQty"
                    className="block text-sm font-medium mb-1"
                  >
                    Sale Qty
                  </label>
                  <input
                    type="number"
                    id="editSaleQty"
                    name="saleQty"
                    value={editForm.saleQty}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Stock Qty */}
                <div>
                  <label
                    htmlFor="editStockQty"
                    className="block text-sm font-medium mb-1"
                  >
                    Stock Qty
                  </label>
                  <input
                    type="number"
                    id="editStockQty"
                    name="stockQty"
                    value={editForm.stockQty}
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
                    step="0.01"
                    id="editPurchasePrice"
                    name="purchasePrice"
                    value={editForm.purchasePrice}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                    step="0.01"
                    id="editSalePrice"
                    name="salePrice"
                    value={editForm.salePrice}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Stock Value */}
                <div>
                  <label
                    htmlFor="editStockValue"
                    className="block text-sm font-medium mb-1"
                  >
                    Stock Value
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="editStockValue"
                    name="stockValue"
                    value={editForm.stockValue}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
    </div>
  );
}