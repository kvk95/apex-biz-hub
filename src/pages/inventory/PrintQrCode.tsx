import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";
import { CATEGORIES } from "@/constants/constants";

const PrintQrCode: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    productName: "",
    productCode: "",
    category: CATEGORIES[1],
    price: "",
    quantity: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Filter state
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("PrintQrCode");
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

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;
      const matchesSearch =
        item.productName.toLowerCase().includes(search.toLowerCase()) ||
        item.productCode.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, categoryFilter, data]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [currentPage, itemsPerPage, filteredData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearch("");
    setCategoryFilter("All");
    setCurrentPage(1);
  };

  const handleReport = () => alert("Report generated.");
  const handlePrint = () => window.print();

  // Edit Modal Handlers
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        productName: item.productName,
        productCode: item.productCode,
        category: item.category,
        price: item.price.toString(),
        quantity: item.quantity.toString(),
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
      !editForm.productName.trim() ||
      !editForm.productCode.trim() ||
      !editForm.price ||
      !editForm.quantity
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
                productCode: editForm.productCode.trim(),
                category: editForm.category,
                price: Number(editForm.price),
                quantity: Number(editForm.quantity),
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

  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-lg font-semibold mb-6 ">Print QR Code</h1>

      <section className="bg-card rounded shadow p-6 mb-6">
        <form className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-col w-full sm:w-1/3">
            <label
              htmlFor="search"
              className="mb-1 text-sm font-medium text-muted-foreground"
            >
              Search Product
            </label>
            <input
              id="search"
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by name or code"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col w-full sm:w-1/4">
            <label
              htmlFor="category"
              className="mb-1 text-sm font-medium text-muted-foreground"
            >
              Category
            </label>
            <select
              id="category"
              value={categoryFilter}
              onChange={handleCategoryChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              title="Clear"
            >
              <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              title="Generate Report"
            >
              <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              title="Print"
            >
              <i className="fa fa-print fa-light" aria-hidden="true"></i> Print
            </button>
          </div>
        </form>
      </section>

      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Product Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Product Code
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Category
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Price
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Quantity
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
                    colSpan={7}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.productName}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.productCode}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-center text-sm space-x-3">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-primary hover:text-primary/80 transition-colors"
                        aria-label={`Edit product ${item.productName}`}
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
              Edit Product
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {CATEGORIES.slice(1).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
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
                  min="0"
                  step="0.01"
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter price"
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
                  min="0"
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter quantity"
                />
              </div>
            </div>

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
};

export default PrintQrCode;