import React, { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { SearchInput } from "@/components/Search/SearchInput";
import { AutoCompleteTextBox, AutoCompleteItem } from "@/components/Search/AutoCompleteTextBox";
import { SORT_OPTIONS } from "@/constants/constants";

// Autocomplete item types
type ProductItem = AutoCompleteItem & { extra?: { SKU: string } };
type WarehouseItem = AutoCompleteItem;

// API types
type Warehouse = { id: number; warehouseName: string; warehouseCode: string };
type Product = {
  id: number;
  productName: string;
  sku: string;
  productImage?: string;
  categoryName?: string;
};

type StockTransferProduct = {
  productId: string;
  productName: string;
  productImage?: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
};

type StockTransferRecord = {
  stockTransferId: number;
  fromWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseId: string;
  toWarehouseName: string;
  referenceNumber: string;
  date: string;
  totalProducts: number;
  totalQuantity: number;
  notes?: string;
  products: StockTransferProduct[];
};

const ProductAutoComplete = AutoCompleteTextBox<ProductItem>;
const WarehouseAutoComplete = AutoCompleteTextBox<WarehouseItem>;

export default function StockTransfer() {
  const [data, setData] = useState<StockTransferRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [filterFromWarehouse, setFilterFromWarehouse] = useState<"All" | string>("All");
  const [filterToWarehouse, setFilterToWarehouse] = useState<"All" | string>("All");
  const [sortBy, setSortBy] = useState<"Last 7 Days" | "Last 30 Days" | "Custom">("Last 7 Days");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState({
    stockTransferId: 0,
    fromWarehouseSearch: "",
    fromWarehouseId: 0,
    fromWarehouseName: "",
    toWarehouseSearch: "",
    toWarehouseId: 0,
    toWarehouseName: "",
    referenceNumber: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    products: [] as { productId: number; productName: string; productImage: string; sku: string; categoryName: string; quantity: number }[],
  });

  // Master data
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [filteredFromWarehouses, setFilteredFromWarehouses] = useState<WarehouseItem[]>([]);
  const [filteredToWarehouses, setFilteredToWarehouses] = useState<WarehouseItem[]>([]);

  // Load master data
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [prodRes, whRes] = await Promise.all([
          apiService.get<Product[]>("Products"),
          apiService.get<Warehouse[]>("Warehouses"),
        ]);

        if (prodRes?.status?.code === "S") {
          setProducts(prodRes.result);
          setFilteredProducts(
            prodRes.result.map((p) => ({
              id: p.id,
              display: p.productName,
              extra: { SKU: p.sku },
            }))
          );
        }
        if (whRes?.status?.code === "S") {
          setWarehouses(whRes.result);
          const items = whRes.result.map((w) => ({ id: w.id, display: w.warehouseName }));
          setFilteredFromWarehouses(items);
          setFilteredToWarehouses(items);
        }
      } catch (err) {
        console.error("[StockTransfer] Master data error:", err);
      }
    };
    fetchMasterData();
  }, []);

  // Load transfers
  useEffect(() => {
    loadTransfers();
  }, []);

  const loadTransfers = async () => {
    setLoading(true);
    try {
      const res = await apiService.get<StockTransferRecord[]>("StockTransfer");
      if (res.status.code === "S") setData(res.result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatIndianDate = (isoString: string) => {
    try {
      return format(new Date(isoString), "d MMM yyyy");
    } catch {
      return isoString;
    }
  };

  const filteredAndSortedData = useMemo(() => {
    const filtered = data.filter((item) => {
      const matchesSearch =
        item.referenceNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.fromWarehouseName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.toWarehouseName.toLowerCase().includes(searchText.toLowerCase());
      const matchesFrom = filterFromWarehouse === "All" || item.fromWarehouseName === filterFromWarehouse;
      const matchesTo = filterToWarehouse === "All" || item.toWarehouseName === filterToWarehouse;
      return matchesSearch && matchesFrom && matchesTo;
    });
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return filtered;
  }, [data, searchText, filterFromWarehouse, filterToWarehouse]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(start, start + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  // Autocomplete Handlers
  const handleProductSearch = (query: string) => {
    const filtered = products
      .filter(
        (p) =>
          p.productName.toLowerCase().includes(query.toLowerCase()) ||
          p.sku.toLowerCase().includes(query.toLowerCase())
      )
      .map((p) => ({
        id: p.id,
        display: p.productName,
        extra: { SKU: p.sku },
      }));
    setFilteredProducts(filtered);
  };

  const handleProductSelect = (item: ProductItem) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) return;

    setForm((prev) => ({
      ...prev,
      products: [
        ...prev.products.filter((p) => p.productId !== product.id),
        {
          productId: product.id,
          productName: product.productName,
          productImage: product.productImage || "",
          sku: product.sku,
          categoryName: product.categoryName || "",
          quantity: 1,
        },
      ],
    }));
    setFilteredProducts(products.map((p) => ({
      id: p.id,
      display: p.productName,
      extra: { SKU: p.sku },
    })));
  };

  const updateProductQty = (productId: number, qty: number) => {
    if (qty < 1) {
      setForm((prev) => ({
        ...prev,
        products: prev.products.filter((p) => p.productId !== productId),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        products: prev.products.map((p) =>
          p.productId === productId ? { ...p, quantity: qty } : p
        ),
      }));
    }
  };

  const handleFromWarehouseSearch = (query: string) => {
    const filtered = warehouses
      .filter((w) => w.warehouseName.toLowerCase().includes(query.toLowerCase()))
      .map((w) => ({ id: w.id, display: w.warehouseName }));
    setFilteredFromWarehouses(filtered);
    setForm((p) => ({ ...p, fromWarehouseSearch: query, fromWarehouseId: 0 }));
  };

  const handleFromWarehouseSelect = (item: WarehouseItem) => {
    const wh = warehouses.find((w) => w.id === item.id);
    if (!wh) return;
    setForm((p) => ({
      ...p,
      fromWarehouseSearch: wh.warehouseName,
      fromWarehouseId: wh.id,
      fromWarehouseName: wh.warehouseName,
    }));
    setFilteredFromWarehouses(warehouses.map((w) => ({ id: w.id, display: w.warehouseName })));
  };

  const handleToWarehouseSearch = (query: string) => {
    const filtered = warehouses
      .filter((w) => w.warehouseName.toLowerCase().includes(query.toLowerCase()))
      .map((w) => ({ id: w.id, display: w.warehouseName }));
    setFilteredToWarehouses(filtered);
    setForm((p) => ({ ...p, toWarehouseSearch: query, toWarehouseId: 0 }));
  };

  const handleToWarehouseSelect = (item: WarehouseItem) => {
    const wh = warehouses.find((w) => w.id === item.id);
    if (!wh) return;
    setForm((p) => ({
      ...p,
      toWarehouseSearch: wh.warehouseName,
      toWarehouseId: wh.id,
      toWarehouseName: wh.warehouseName,
    }));
    setFilteredToWarehouses(warehouses.map((w) => ({ id: w.id, display: w.warehouseName })));
  };

  // Form Actions
  const handleAdd = () => {
    const ref = `#ST${new Date().toISOString().slice(0, 10).replace(/-/g, "")}01`;
    setForm({
      stockTransferId: 0,
      fromWarehouseSearch: "",
      fromWarehouseId: 0,
      fromWarehouseName: "",
      toWarehouseSearch: "",
      toWarehouseId: 0,
      toWarehouseName: "",
      referenceNumber: ref,
      date: new Date().toISOString().split("T")[0],
      notes: "",
      products: [],
    });
    setFormMode("add");
  };

  const handleEdit = (record: StockTransferRecord) => {
    setForm({
      stockTransferId: record.stockTransferId,
      fromWarehouseSearch: record.fromWarehouseName,
      fromWarehouseId: Number(record.fromWarehouseId),
      fromWarehouseName: record.fromWarehouseName,
      toWarehouseSearch: record.toWarehouseName,
      toWarehouseId: Number(record.toWarehouseId),
      toWarehouseName: record.toWarehouseName,
      referenceNumber: record.referenceNumber,
      date: record.date,
      notes: record.notes || "",
      products: record.products.map((p) => ({
        productId: Number(p.productId),
        productName: p.productName,
        productImage: p.productImage || "",
        sku: p.sku,
        categoryName: p.categoryName,
        quantity: p.quantity,
      })),
    });
    setFormMode("edit");
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this stock transfer?")) {
      setData((prev) => prev.filter((d) => d.stockTransferId !== id));
    }
  };

  const handleClear = () => {
    setSearchText("");
    setFilterFromWarehouse("All");
    setFilterToWarehouse("All");
    setCurrentPage(1);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fromWarehouseId || !form.toWarehouseId || form.products.length === 0) {
      alert("Please select warehouses and add at least one product.");
      return;
    }
    if (form.fromWarehouseId === form.toWarehouseId) {
      alert("From Warehouse and To Warehouse cannot be the same.");
      return;
    }

    const totalProducts = form.products.length;
    const totalQuantity = form.products.reduce((sum, p) => sum + p.quantity, 0);

    const newRecord: StockTransferRecord = {
      stockTransferId: formMode === "add" ? Date.now() : form.stockTransferId,
      fromWarehouseId: form.fromWarehouseId.toString(),
      fromWarehouseName: form.fromWarehouseName,
      toWarehouseId: form.toWarehouseId.toString(),
      toWarehouseName: form.toWarehouseName,
      referenceNumber: form.referenceNumber,
      date: form.date,
      totalProducts,
      totalQuantity,
      notes: form.notes,
      products: form.products.map((p) => ({
        productId: p.productId.toString(),
        productName: p.productName,
        productImage: p.productImage,
        sku: p.sku,
        categoryId: "1",
        categoryName: p.categoryName,
        quantity: p.quantity,
      })),
    };

    if (formMode === "add") {
      setData((prev) => [...prev, newRecord]);
    } else {
      setData((prev) =>
        prev.map((d) => (d.stockTransferId === form.stockTransferId ? newRecord : d))
      );
    }
    setFormMode(null);
  };

  const showNotes = (notes?: string) => {
    if (!notes) {
      alert("No notes available.");
      return;
    }
    const modal = document.createElement("div");
    modal.className = "fixed inset-0 bg-black/50 flex items-center justify-center z-50";
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 p-6 relative">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Notes</h3>
          <button onclick="this.closest('.fixed').remove()" class="text-red-500 hover:text-red-700">
            <i class="fa fa-times"></i>
          </button>
        </div>
        <div class="text-sm text-gray-700 whitespace-pre-wrap">${notes.replace(/\n/g, "<br>")}</div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });
  };

  const columns: Column[] = [
    { key: "fromWarehouseName", label: "From Warehouse", align: "left" },
    { key: "toWarehouseName", label: "To Warehouse", align: "left" },
    {
      key: "totalProducts",
      label: "No of Products",
      align: "center",
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: "totalQuantity",
      label: "Quantity Transferred",
      align: "center",
      render: (value) => <span className="font-semibold text-primary">{value}</span>,
    },
    { key: "referenceNumber", label: "Ref Number", align: "left" },
    {
      key: "date",
      label: "Date",
      align: "center",
      render: (value) => formatIndianDate(value),
    },
  ];

  const rowActions = (row: StockTransferRecord) => (
    <>
      <button
        onClick={() => showNotes(row.notes)}
        className="text-gray-700 border border-gray-700 hover:bg-orange-500 hover:text-white rounded-lg text-xs p-2 me-1"
        aria-label="View Notes"
      >
        <i className="fa fa-sticky-note"></i>
      </button>
      <button
        onClick={() => handleEdit(row)}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white rounded-lg text-xs p-2 me-1"
        aria-label="Edit"
      >
        <i className="fa fa-edit"></i>
      </button>
      <button
        onClick={() => handleDelete(row.stockTransferId)}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white rounded-lg text-xs p-2"
        aria-label="Delete"
      >
        <i className="fa fa-trash-can"></i>
      </button>
    </>
  );

  const customFilters = () => (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-3 w-full">
      <div className="w-full md:w-auto md:max-w-md">
        <SearchInput
          value={searchText}
          placeholder="Search"
          onSearch={(q) => {
            setSearchText(q);
            setCurrentPage(1);
          }}
          className="w-full"
        />
      </div>
      <div className="flex gap-3">
        <select
          value={filterFromWarehouse}
          onChange={(e) => {
            setFilterFromWarehouse(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="All">From Warehouse</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.warehouseName}>
              {w.warehouseName}
            </option>
          ))}
        </select>
        <select
          value={filterToWarehouse}
          onChange={(e) => {
            setFilterToWarehouse(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="All">To Warehouse</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.warehouseName}>
              {w.warehouseName}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>Sort By: {opt}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const modalForm = () => (
    <div className="space-y-6">
      {/* Warehouses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Warehouse From <span className="text-red-500">*</span>
          </label>
          <WarehouseAutoComplete
            value={form.fromWarehouseSearch}
            onSearch={handleFromWarehouseSearch}
            onSelect={handleFromWarehouseSelect}
            items={filteredFromWarehouses}
            placeholder="Search from warehouse..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Warehouse To <span className="text-red-500">*</span>
          </label>
          <WarehouseAutoComplete
            value={form.toWarehouseSearch}
            onSearch={handleToWarehouseSearch}
            onSelect={handleToWarehouseSelect}
            items={filteredToWarehouses}
            placeholder="Search to warehouse..."
          />
        </div>
      </div>

      {/* Reference */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Reference No <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.referenceNumber}
          onChange={(e) => setForm((p) => ({ ...p, referenceNumber: e.target.value }))}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      {/* Product Autocomplete */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Product <span className="text-red-500">*</span>
        </label>
        <ProductAutoComplete
          value=""
          onSearch={handleProductSearch}
          onSelect={handleProductSelect}
          items={filteredProducts}
          placeholder="Search product..."
        />
      </div>

      {/* Products Table */}
      {form.products.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Product</th>
                <th className="text-center py-2">SKU</th>
                <th className="text-center py-2">Category</th>
                <th className="text-center py-2">Qty</th>
              </tr>
            </thead>
            <tbody>
              {form.products.map((p) => (
                <tr key={p.productId}>
                  <td className="py-3 flex items-center gap-3">
                    {p.productImage && (
                      <img src={p.productImage} alt="" className="w-10 h-10 rounded object-cover" />
                    )}
                    <span className="font-medium">{p.productName}</span>
                  </td>
                  <td className="text-center">{p.sku}</td>
                  <td className="text-center">{p.categoryName}</td>
                  <td className="text-center">
                    <input
                      type="number"
                      value={p.quantity}
                      onChange={(e) => updateProductQty(p.productId, Number(e.target.value) || 0)}
                      className="w-20 border rounded px-2 py-1 text-center"
                      min="1"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Notes <span className="text-red-500">*</span>
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="Enter notes..."
        />
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Stock Transfer"
      description="Transfer stock between warehouses"
      icon="fa-light fa fa-truck"
      onAddClick={handleAdd}
      onRefresh={handleClear}
      onReport={() => alert("PDF Report Generated!")}
      onExcelReport={() => alert("Excel Report Exported!")}
      search={searchText}
      onSearchChange={(val) => {
        setSearchText(val);
        setCurrentPage(1);
      }}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredAndSortedData.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={formMode === "add" ? "Add Stock Transfer" : "Edit Stock Transfer"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
      loading={loading}
    />
  );
}