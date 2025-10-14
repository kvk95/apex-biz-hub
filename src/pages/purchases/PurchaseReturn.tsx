import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const PAGE_SIZE = 5;

export default function PurchaseReturn() {
  // Page title as per reference page
  React.useEffect(() => {}, []);

  // State for form inputs
  const [date, setDate] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [supplier, setSupplier] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [discount, setDiscount] = useState("");
  const [tax, setTax] = useState("");
  const [total, setTotal] = useState(0);

  // State for product list in current return
  const [products, setProducts] = useState<
    {
      id: number;
      code: string;
      name: string;
      quantity: number;
      unitCost: number;
      discount: number;
      tax: number;
      total: number;
    }[]
  >([]);

  // State for purchase returns list pagination and data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("PurchaseReturn");
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate total for product line
  React.useEffect(() => {
    const q = Number(quantity) || 0;
    const uc = Number(unitCost) || 0;
    const dis = Number(discount) || 0;
    const t = Number(tax) || 0;

    // Total = (unitCost * quantity) - discount + tax
    const lineTotal = q * uc - dis + t;
    setTotal(lineTotal > 0 ? lineTotal : 0);
  }, [quantity, unitCost, discount, tax]);

  // Add product to products list
  function addProduct() {
    if (
      !productCode.trim() ||
      !productName.trim() ||
      !quantity ||
      Number(quantity) <= 0 ||
      !unitCost ||
      Number(unitCost) <= 0
    )
      return;

    const newProduct = {
      id: Date.now(),
      code: productCode.trim(),
      name: productName.trim(),
      quantity: Number(quantity),
      unitCost: Number(unitCost),
      discount: Number(discount) || 0,
      tax: Number(tax) || 0,
      total,
    };
    setProducts((prev) => [...prev, newProduct]);

    // Reset product fields
    setProductCode("");
    setProductName("");
    setQuantity("");
    setUnitCost("");
    setDiscount("");
    setTax("");
    setTotal(0);
  }

  // Remove product by id
  function removeProduct(id: number) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  // Pagination logic for purchase returns table
  const totalPages = Math.ceil(data.length / PAGE_SIZE);

  const paginatedReturns = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return data.slice(start, start + PAGE_SIZE);
  }, [currentPage, data]);


  // Handler for page change
  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  // Dummy handlers for buttons (Refresh, Save, Report)
  function onRefresh() {
    // For demo, just reset form and products
    setDate("");
    setReferenceNo("");
    setSupplier("");
    setWarehouse("");
    setProductCode("");
    setProductName("");
    setQuantity("");
    setUnitCost("");
    setDiscount("");
    setTax("");
    setTotal(0);
    setProducts([]);
  }

  function onSave() {
    // For demo, alert saved data
    alert("Purchase Return saved (demo).");
  }

  function onReport() {
    // For demo, alert report generation
    alert("Report generated (demo).");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Page Header */}
      <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Purchase Return
        </h1>
        <div className="space-x-2">
          <button
            onClick={onReport}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            title="Report"
          >
            <i className="fas fa-file-alt mr-2" aria-hidden="true"></i> Report
          </button>
          <button
            onClick={onRefresh}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-100 focus:outline-none"
            title="Refresh"
          >
            <i className="fas fa-sync-alt mr-2" aria-hidden="true"></i> Refresh
          </button>
          <button
            onClick={onSave}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
            title="Save"
          >
            <i className="fas fa-save mr-2" aria-hidden="true"></i> Save
          </button>
        </div>
      </header>

      <main className="px-6 py-6 max-w-7xl mx-auto">
        {/* Form Section */}
        <section className="bg-white rounded shadow p-6 mb-8">
          <form className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Date */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Reference No */}
            <div>
              <label
                htmlFor="referenceNo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Reference No
              </label>
              <input
                type="text"
                id="referenceNo"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                placeholder="Reference No"
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Supplier */}
            <div>
              <label
                htmlFor="supplier"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Supplier
              </label>
              <select
                id="supplier"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Supplier</option>
                {data.length > 0 &&
                  data[0].suppliers?.map((s: any) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Warehouse */}
            <div>
              <label
                htmlFor="warehouse"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Warehouse
              </label>
              <select
                id="warehouse"
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Warehouse</option>
                {data.length > 0 &&
                  data[0].warehouses?.map((w: any) => (
                    <option key={w.id} value={w.name}>
                      {w.name}
                    </option>
                  ))}
              </select>
            </div>
          </form>
        </section>

        {/* Product Entry Section */}
        <section className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Add Product
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addProduct();
            }}
            className="grid grid-cols-1 md:grid-cols-8 gap-4 items-end"
          >
            {/* Product Code */}
            <div className="col-span-1 md:col-span-1">
              <label
                htmlFor="productCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Code
              </label>
              <input
                type="text"
                id="productCode"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Code"
              />
            </div>

            {/* Product Name */}
            <div className="col-span-1 md:col-span-2">
              <label
                htmlFor="productName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Name"
              />
            </div>

            {/* Quantity */}
            <div className="col-span-1 md:col-span-1">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Qty"
              />
            </div>

            {/* Unit Cost */}
            <div className="col-span-1 md:col-span-1">
              <label
                htmlFor="unitCost"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Unit Cost
              </label>
              <input
                type="number"
                id="unitCost"
                min="0"
                step="0.01"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Cost"
              />
            </div>

            {/* Discount */}
            <div className="col-span-1 md:col-span-1">
              <label
                htmlFor="discount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Discount
              </label>
              <input
                type="number"
                id="discount"
                min="0"
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Discount"
              />
            </div>

            {/* Tax */}
            <div className="col-span-1 md:col-span-1">
              <label
                htmlFor="tax"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tax
              </label>
              <input
                type="number"
                id="tax"
                min="0"
                step="0.01"
                value={tax}
                onChange={(e) => setTax(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Tax"
              />
            </div>

            {/* Total (read-only) */}
            <div className="col-span-1 md:col-span-1">
              <label
                htmlFor="total"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Total
              </label>
              <input
                type="text"
                id="total"
                value={total.toFixed(2)}
                readOnly
                className="block w-full rounded border border-gray-300 px-3 py-2 bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Add Button */}
            <div className="col-span-1 md:col-span-1">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-4 py-2 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded shadow focus:outline-none"
                title="Add Product"
              >
                <i className="fas fa-plus mr-2" aria-hidden="true"></i> Add
              </button>
            </div>
          </form>
        </section>

        {/* Products Table */}
        <section className="bg-white rounded shadow p-6 mb-8 overflow-x-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Products</h2>
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left text-sm font-semibold">
                <th className="border border-gray-300 px-3 py-2">Code</th>
                <th className="border border-gray-300 px-3 py-2">Name</th>
                <th className="border border-gray-300 px-3 py-2 text-right">
                  Quantity
                </th>
                <th className="border border-gray-300 px-3 py-2 text-right">
                  Unit Cost
                </th>
                <th className="border border-gray-300 px-3 py-2 text-right">
                  Discount
                </th>
                <th className="border border-gray-300 px-3 py-2 text-right">
                  Tax
                </th>
                <th className="border border-gray-300 px-3 py-2 text-right">
                  Total
                </th>
                <th className="border border-gray-300 px-3 py-2 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    No products added.
                  </td>
                </tr>
              )}
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2">{p.code}</td>
                  <td className="border border-gray-300 px-3 py-2">{p.name}</td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {p.quantity}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {p.unitCost.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {p.discount.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {p.tax.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {p.total.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <button
                      onClick={() => removeProduct(p.id)}
                      className="text-red-600 hover:text-red-800 focus:outline-none"
                      title="Remove Product"
                    >
                      <i className="fas fa-trash-alt" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Purchase Returns List Section */}
        <section className="bg-white rounded shadow p-6 overflow-x-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Purchase Return List
          </h2>
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left text-sm font-semibold">
                <th className="border border-gray-300 px-3 py-2">Date</th>
                <th className="border border-gray-300 px-3 py-2">
                  Reference No
                </th>
                <th className="border border-gray-300 px-3 py-2">Supplier</th>
                <th className="border border-gray-300 px-3 py-2">Warehouse</th>
                <th className="border border-gray-300 px-3 py-2 text-right">
                  Product Qty
                </th>
                <th className="border border-gray-300 px-3 py-2 text-right">
                  Grand Total
                </th>
                <th className="border border-gray-300 px-3 py-2">Status</th>
                <th className="border border-gray-300 px-3 py-2 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedReturns.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    No purchase returns found.
                  </td>
                </tr>
              )}
              {paginatedReturns.map((pr: any) => (
                <tr key={pr.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2">
                    {pr.date}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    {pr.referenceNo}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    {pr.supplier}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    {pr.warehouse}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {pr.productQty}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {pr.grandTotal.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        pr.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {pr.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center space-x-2">
                    <button
                      title="Edit"
                      className="text-indigo-600 hover:text-indigo-800 focus:outline-none"
                      aria-label={`Edit purchase return ${pr.referenceNo}`}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      title="Delete"
                      className="text-red-600 hover:text-red-800 focus:outline-none"
                      aria-label={`Delete purchase return ${pr.referenceNo}`}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <nav
            className="flex items-center justify-between mt-4"
            aria-label="Pagination"
          >
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`inline-flex items-center px-3 py-1 border border-gray-300 rounded text-sm font-medium ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed bg-gray-100"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              aria-label="Previous page"
            >
              <i className="fas fa-chevron-left mr-1"></i> Prev
            </button>

            <ul className="inline-flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <li key={page}>
                    <button
                      onClick={() => goToPage(page)}
                      aria-current={page === currentPage ? "page" : undefined}
                      className={`px-3 py-1 border rounded text-sm font-medium ${
                        page === currentPage
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  </li>
                )
              )}
            </ul>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`inline-flex items-center px-3 py-1 border border-gray-300 rounded text-sm font-medium ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed bg-gray-100"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              aria-label="Next page"
            >
              Next <i className="fas fa-chevron-right ml-1"></i>
            </button>
          </nav>
        </section>
      </main>
    </div>
  );
}
