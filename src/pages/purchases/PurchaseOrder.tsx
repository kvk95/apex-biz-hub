import { apiService } from "@/services/ApiService";
import React, { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 3;

export default function PurchaseOrder() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("PurchaseOrder");
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [purchaseOrders, setPurchaseOrders] = useState(data);
  const [selectedPO, setSelectedPO] = useState<typeof data[0] | null>(null);

  // Form state for new/edit PO
  const [form, setForm] = useState({
    poNumber: "",
    supplier: "",
    date: "",
    status: "Pending",
    items: [
      {
        product: "",
        qty: 1,
        price: 0,
      },
    ],
  });

  // Pagination calculations
  const totalPages = Math.ceil(purchaseOrders.length / ITEMS_PER_PAGE);
  const paginatedPOs = purchaseOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number,
    field?: string
  ) => {
    if (typeof index === "number" && field) {
      // Item field change
      const newItems = [...form.items];
      if (field === "qty" || field === "price") {
        newItems[index][field] = Number(e.target.value);
      } else {
        newItems[index][field] = e.target.value;
      }
      setForm({ ...form, items: newItems });
    } else {
      // General form field change
      const { name, value } = e.target;
      setForm({ ...form, [name]: value });
    }
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { product: "", qty: 1, price: 0 }],
    });
  };

  const removeItem = (index: number) => {
    const newItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems.length ? newItems : [{ product: "", qty: 1, price: 0 }] });
  };

  const calculateItemTotal = (item: typeof form.items[0]) =>
    item.qty * item.price;

  const calculateFormTotal = () =>
    form.items.reduce((acc, item) => acc + calculateItemTotal(item), 0);

  const handleSave = () => {
    if (!form.poNumber || !form.supplier || !form.date) {
      alert("Please fill in PO Number, Supplier, and Date.");
      return;
    }
    const newPO = {
      id: purchaseOrders.length + 1,
      poNumber: form.poNumber,
      supplier: form.supplier,
      date: form.date,
      status: form.status,
      total: calculateFormTotal(),
      items: form.items.map((item, idx) => ({
        id: idx + 1,
        product: item.product,
        qty: item.qty,
        price: item.price,
        total: calculateItemTotal(item),
      })),
    };
    setPurchaseOrders([...purchaseOrders, newPO]);
    setForm({
      poNumber: "",
      supplier: "",
      date: "",
      status: "Pending",
      items: [{ product: "", qty: 1, price: 0 }],
    });
    setCurrentPage(totalPages + 1);
  };

  const handleRefresh = () => {
    setPurchaseOrders([]);
    setCurrentPage(1);
    setForm({
      poNumber: "",
      supplier: "",
      date: "",
      status: "Pending",
      items: [{ product: "", qty: 1, price: 0 }],
    });
    setSelectedPO(null);
    loadData();
  };

  const handleSelectPO = (po: typeof data[0]) => {
    setSelectedPO(po);
    setForm({
      poNumber: po.poNumber,
      supplier: po.supplier,
      date: po.date,
      status: po.status,
      items: po.items.map((item: any) => ({
        product: item.product,
        qty: item.qty,
        price: item.price,
      })),
    });
  };

  const handleUpdate = () => {
    if (!selectedPO) return;
    const updatedPO = {
      ...selectedPO,
      poNumber: form.poNumber,
      supplier: form.supplier,
      date: form.date,
      status: form.status,
      total: calculateFormTotal(),
      items: form.items.map((item, idx) => ({
        id: idx + 1,
        product: item.product,
        qty: item.qty,
        price: item.price,
        total: calculateItemTotal(item),
      })),
    };
    const updatedPOs = purchaseOrders.map((po) =>
      po.id === selectedPO.id ? updatedPO : po
    );
    setPurchaseOrders(updatedPOs);
    setSelectedPO(null);
    setForm({
      poNumber: "",
      supplier: "",
      date: "",
      status: "Pending",
      items: [{ product: "", qty: 1, price: 0 }],
    });
  };

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this Purchase Order? This action cannot be undone."
      )
    ) {
      const filteredPOs = purchaseOrders.filter((po) => po.id !== id);
      setPurchaseOrders(filteredPOs);
      if (selectedPO?.id === id) {
        setSelectedPO(null);
        setForm({
          poNumber: "",
          supplier: "",
          date: "",
          status: "Pending",
          items: [{ product: "", qty: 1, price: 0 }],
        });
      }
      if (currentPage > Math.ceil(filteredPOs.length / ITEMS_PER_PAGE)) {
        setCurrentPage((p) => Math.max(p - 1, 1));
      }
    }
  };

  // Page title
  useEffect(() => {
    document.title = "Purchase Order - Dreams POS";
  }, []);

  useEffect(() => {
    setPurchaseOrders(data);
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-indigo-700">
            Purchase Order
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={handleRefresh}
              title="Refresh"
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
              type="button"
            >
              <i className="fas fa-sync-alt"></i>
              <span>Refresh</span>
            </button>
            <button
              onClick={() => window.print()}
              title="Report"
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
              type="button"
            >
              <i className="fas fa-file-alt"></i>
              <span>Report</span>
            </button>
          </div>
        </header>

        {/* Company Info */}
        <section className="mb-8 bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Company Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
            <div>
              <span className="font-medium">Name:</span> Dreams Technologies
            </div>
            <div>
              <span className="font-medium">Address:</span> 123 Dream St, Dream City, DC 12345
            </div>
            <div>
              <span className="font-medium">Phone:</span> +1 234 567 890
            </div>
            <div>
              <span className="font-medium">Email:</span> info@dreamspos.dreamstechnologies.com
            </div>
          </div>
        </section>

        {/* Purchase Order Form */}
        <section className="mb-8 bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            {selectedPO ? "Edit Purchase Order" : "New Purchase Order"}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              selectedPO ? handleUpdate() : handleSave();
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label
                  htmlFor="poNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  PO Number
                </label>
                <input
                  type="text"
                  id="poNumber"
                  name="poNumber"
                  value={form.poNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="supplier"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Supplier
                </label>
                <input
                  type="text"
                  id="supplier"
                  name="supplier"
                  value={form.supplier}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
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
                  name="date"
                  value={form.date}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 rounded">
                <thead className="bg-indigo-100 text-indigo-700 text-left text-sm font-semibold">
                  <tr>
                    <th className="px-4 py-2 border-r border-indigo-300">Product</th>
                    <th className="px-4 py-2 border-r border-indigo-300 w-24">Qty</th>
                    <th className="px-4 py-2 border-r border-indigo-300 w-28">Price</th>
                    <th className="px-4 py-2 border-indigo-300 w-28">Total</th>
                    <th className="px-4 py-2 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {form.items.map((item, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-white" : "bg-indigo-50"}
                    >
                      <td className="px-4 py-2 border-r border-gray-300">
                        <input
                          type="text"
                          value={item.product}
                          onChange={(e) => handleInputChange(e, idx, "product")}
                          className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          required
                        />
                      </td>
                      <td className="px-4 py-2 border-r border-gray-300">
                        <input
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(e) => handleInputChange(e, idx, "qty")}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          required
                        />
                      </td>
                      <td className="px-4 py-2 border-r border-gray-300">
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={item.price}
                          onChange={(e) => handleInputChange(e, idx, "price")}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          required
                        />
                      </td>
                      <td className="px-4 py-2 border-gray-300 text-right font-semibold">
                        ${calculateItemTotal(item).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="text-red-600 hover:text-red-800"
                          title="Remove Item"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-indigo-100 font-semibold text-indigo-700">
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-right">
                      Total:
                    </td>
                    <td className="px-4 py-2 text-right">
                      ${calculateFormTotal().toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={addItem}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
              >
                <i className="fas fa-plus"></i>
                <span>Add Item</span>
              </button>

              <div className="space-x-3">
                {selectedPO && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPO(null);
                      setForm({
                        poNumber: "",
                        supplier: "",
                        date: "",
                        status: "Pending",
                        items: [{ product: "", qty: 1, price: 0 }],
                      });
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded shadow"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
                >
                  {selectedPO ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Purchase Orders List */}
        <section className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Purchase Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded">
              <thead className="bg-indigo-100 text-indigo-700 text-left text-sm font-semibold">
                <tr>
                  <th className="px-4 py-2 border-r border-indigo-300 w-32">PO Number</th>
                  <th className="px-4 py-2 border-r border-indigo-300">Supplier</th>
                  <th className="px-4 py-2 border-r border-indigo-300 w-36">Date</th>
                  <th className="px-4 py-2 border-r border-indigo-300 w-28">Status</th>
                  <th className="px-4 py-2 border-r border-indigo-300 w-32 text-right">Total</th>
                  <th className="px-4 py-2 w-36 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPOs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      No Purchase Orders found.
                    </td>
                  </tr>
                )}
                {paginatedPOs.map((po) => (
                  <tr
                    key={po.id}
                    className="even:bg-indigo-50 hover:bg-indigo-100 cursor-pointer"
                    onClick={() => handleSelectPO(po)}
                  >
                    <td className="px-4 py-2 border-r border-gray-300">{po.poNumber}</td>
                    <td className="px-4 py-2 border-r border-gray-300">{po.supplier}</td>
                    <td className="px-4 py-2 border-r border-gray-300">{po.date}</td>
                    <td className="px-4 py-2 border-r border-gray-300">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          po.status === "Completed"
                            ? "bg-green-200 text-green-800"
                            : po.status === "Pending"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {po.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-r border-gray-300 text-right font-semibold">
                      ${po.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPO(po);
                        }}
                        title="Edit"
                        className="text-indigo-600 hover:text-indigo-800"
                        type="button"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(po.id);
                        }}
                        title="Delete"
                        className="text-red-600 hover:text-red-800"
                        type="button"
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
            className="mt-4 flex justify-center items-center space-x-2"
            aria-label="Pagination"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Previous Page"
              type="button"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded border ${
                    page === currentPage
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                  }`}
                  type="button"
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Next Page"
              type="button"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </nav>
        </section>
      </div>
    </div>
  );
}