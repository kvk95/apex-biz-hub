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
type StoreItem = AutoCompleteItem;
type PersonItem = AutoCompleteItem;

// API types
type Warehouse = { id: number; warehouseName: string; warehouseCode: string };
type Store = { id: number; storeName: string };
type Person = { id: number; name: string };
type Product = {
  id: number;
  productName: string;
  sku: string;
  productImage?: string;
  categoryName?: string;
};

type StockAdjustmentRecord = {
  stockAdjustmentId: number;
  warehouseId: string;
  warehouseName: string;
  storeId: string;
  storeName: string;
  productId: string;
  productName: string;
  productImage?: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
  referenceNumber: string;
  date: string;
  personId: string;
  personName: string;
  personImage?: string;
  notes?: string;
};

const ProductAutoComplete = AutoCompleteTextBox<ProductItem>;
const WarehouseAutoComplete = AutoCompleteTextBox<WarehouseItem>;
const StoreAutoComplete = AutoCompleteTextBox<StoreItem>;
const PersonAutoComplete = AutoCompleteTextBox<PersonItem>;

export default function StockAdjustment() {
  const [data, setData] = useState<StockAdjustmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [filterWarehouse, setFilterWarehouse] = useState<"All" | string>("All");
  const [sortBy, setSortBy] = useState<"Last 7 Days" | "Last 30 Days" | "Custom">("Last 7 Days");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState({
    stockAdjustmentId: 0,
    productSearch: "",
    productId: 0,
    productName: "",
    productImage: "",
    sku: "",
    categoryName: "",
    warehouseSearch: "",
    warehouseId: 0,
    warehouseName: "",
    referenceNumber: "",
    storeSearch: "",
    storeId: 0,
    storeName: "",
    personSearch: "",
    personId: 0,
    personName: "",
    personImage: "",
    quantity: 0,
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  // Master data
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [filteredWarehouses, setFilteredWarehouses] = useState<WarehouseItem[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<StoreItem[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [filteredPersons, setFilteredPersons] = useState<PersonItem[]>([]);

  // Load master data
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [prodRes, whRes, storeRes, personRes] = await Promise.all([
          apiService.get<Product[]>("Products"),
          apiService.get<Warehouse[]>("Warehouses"),
          apiService.get<Store[]>("Stores"),
          apiService.get<Person[]>("Users"),
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
          setFilteredWarehouses(
            whRes.result.map((w) => ({ id: w.id, display: w.warehouseName }))
          );
        }
        if (storeRes?.status?.code === "S") {
          setStores(storeRes.result);
          setFilteredStores(
            storeRes.result.map((s) => ({ id: s.id, display: s.storeName }))
          );
        }
        if (personRes?.status?.code === "S") {
          setPersons(personRes.result);
          setFilteredPersons(
            personRes.result.map((p) => ({ id: p.id, display: p.name }))
          );
        }
      } catch (err) {
        console.error("[StockAdjustment] Master data error:", err);
      }
    };
    fetchMasterData();
  }, []);

  // Load adjustments
  useEffect(() => {
    loadAdjustments();
  }, []);

  const loadAdjustments = async () => {
    setLoading(true);
    try {
      const res = await apiService.get<StockAdjustmentRecord[]>("StockAdjustment");
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
        item.productName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchText.toLowerCase()) ||
        item.referenceNumber.toLowerCase().includes(searchText.toLowerCase());
      const matchesWarehouse = filterWarehouse === "All" || item.warehouseName === filterWarehouse;
      return matchesSearch && matchesWarehouse;
    });
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return filtered;
  }, [data, searchText, filterWarehouse]);

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
    setForm((p) => ({ ...p, productSearch: query, productId: 0 }));
  };

  const handleProductSelect = (item: ProductItem) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) return;
    setForm((p) => ({
      ...p,
      productSearch: product.productName,
      productId: product.id,
      productName: product.productName,
      productImage: product.productImage || "",
      sku: product.sku,
      categoryName: product.categoryName || "",
    }));
    setFilteredProducts(products.map((p) => ({
      id: p.id,
      display: p.productName,
      extra: { SKU: p.sku },
    })));
  };

  const handleWarehouseSearch = (query: string) => {
    const filtered = warehouses
      .filter((w) => w.warehouseName.toLowerCase().includes(query.toLowerCase()))
      .map((w) => ({ id: w.id, display: w.warehouseName }));
    setFilteredWarehouses(filtered);
    setForm((p) => ({ ...p, warehouseSearch: query, warehouseId: 0 }));
  };

  const handleWarehouseSelect = (item: WarehouseItem) => {
    const wh = warehouses.find((w) => w.id === item.id);
    if (!wh) return;
    setForm((p) => ({
      ...p,
      warehouseSearch: wh.warehouseName,
      warehouseId: wh.id,
      warehouseName: wh.warehouseName,
    }));
    setFilteredWarehouses(warehouses.map((w) => ({ id: w.id, display: w.warehouseName })));
  };

  const handleStoreSearch = (query: string) => {
    const filtered = stores
      .filter((s) => s.storeName.toLowerCase().includes(query.toLowerCase()))
      .map((s) => ({ id: s.id, display: s.storeName }));
    setFilteredStores(filtered);
    setForm((p) => ({ ...p, storeSearch: query, storeId: 0 }));
  };

  const handleStoreSelect = (item: StoreItem) => {
    const store = stores.find((s) => s.id === item.id);
    if (!store) return;
    setForm((p) => ({
      ...p,
      storeSearch: store.storeName,
      storeId: store.id,
      storeName: store.storeName,
    }));
    setFilteredStores(stores.map((s) => ({ id: s.id, display: s.storeName })));
  };

  const handlePersonSearch = (query: string) => {
    const filtered = persons
      .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
      .map((p) => ({ id: p.id, display: p.name }));
    setFilteredPersons(filtered);
    setForm((p) => ({ ...p, personSearch: query, personId: 0 }));
  };

  const handlePersonSelect = (item: PersonItem) => {
    const person = persons.find((p) => p.id === item.id);
    if (!person) return;
    setForm((p) => ({
      ...p,
      personSearch: person.name,
      personId: person.id,
      personName: person.name,
      personImage: person.id === 1 ? "/assets/images/avathar2.png" : "/assets/images/avathar1.png",
    }));
    setFilteredPersons(persons.map((p) => ({ id: p.id, display: p.name })));
  };

  // Form Actions
  const handleAdd = () => {
    const today = new Date().toISOString().split("T")[0];
    const ref = `PT${String(Math.floor(Math.random() * 9000) + 1000)}`;
    setForm({
      stockAdjustmentId: 0,
      productSearch: "",
      productId: 0,
      productName: "",
      productImage: "",
      sku: "",
      categoryName: "",
      warehouseSearch: "",
      warehouseId: 0,
      warehouseName: "",
      referenceNumber: ref,
      storeSearch: "",
      storeId: 0,
      storeName: "",
      personSearch: "",
      personId: 0,
      personName: "",
      personImage: "",
      quantity: 0,
      date: today,
      notes: "",
    });
    setFormMode("add");
  };

  const handleEdit = (record: StockAdjustmentRecord) => {
    setForm({
      stockAdjustmentId: record.stockAdjustmentId,
      productSearch: record.productName,
      productId: Number(record.productId),
      productName: record.productName,
      productImage: record.productImage || "",
      sku: record.sku,
      categoryName: record.categoryName,
      warehouseSearch: record.warehouseName,
      warehouseId: Number(record.warehouseId),
      warehouseName: record.warehouseName,
      referenceNumber: record.referenceNumber,
      storeSearch: record.storeName,
      storeId: Number(record.storeId),
      storeName: record.storeName,
      personSearch: record.personName,
      personId: Number(record.personId),
      personName: record.personName,
      personImage: record.personImage || "",
      quantity: record.quantity,
      date: record.date,
      notes: record.notes || "",
    });
    setFormMode("edit");
  };

  const handleDelete = (stockAdjustmentId: number) => {
    if (window.confirm("Delete this stock adjustment?")) {
      setData((prev) => prev.filter((d) => d.stockAdjustmentId !== stockAdjustmentId));
    }
  };

  const handleClear = () => {
    setSearchText("");
    setFilterWarehouse("All");
    setCurrentPage(1);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productId || !form.warehouseId || !form.storeId || !form.personId) {
      alert("Please fill all required fields.");
      return;
    }

    const newRecord: StockAdjustmentRecord = {
      stockAdjustmentId: formMode === "add" ? Date.now() : form.stockAdjustmentId,
      warehouseId: form.warehouseId.toString(),
      warehouseName: form.warehouseName,
      storeId: form.storeId.toString(),
      storeName: form.storeName,
      productId: form.productId.toString(),
      productName: form.productName,
      productImage: form.productImage,
      sku: form.sku,
      categoryId: "1",
      categoryName: form.categoryName,
      quantity: form.quantity,
      referenceNumber: form.referenceNumber,
      date: form.date,
      personId: form.personId.toString(),
      personName: form.personName,
      personImage: form.personImage,
      notes: form.notes,
    };

    if (formMode === "add") {
      setData((prev) => [...prev, newRecord]);
    } else {
      setData((prev) =>
        prev.map((d) =>
          d.stockAdjustmentId === form.stockAdjustmentId ? newRecord : d
        )
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
    { key: "warehouseName", label: "Warehouse", align: "left" },
    { key: "storeName", label: "Store", align: "left" },
    {
      key: "productName",
      label: "Product",
      align: "left",
      render: (value, row: any) => (
        <div className="flex items-center gap-3">
          {row.productImage && (
            <img src={row.productImage} alt={value} className="w-10 h-10 rounded object-cover" />
          )}
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      align: "center",
      render: (value) => formatIndianDate(value),
    },
    {
      key: "personName",
      label: "Person",
      align: "left",
      render: (value, row: any) => (
        <div className="flex items-center gap-2">
          {row.personImage && (
            <img src={row.personImage} alt={value} className="w-8 h-8 rounded-full" />
          )}
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: "quantity",
      label: "Qty",
      align: "center",
      render: (value) => <span className="font-semibold text-primary">{value}</span>,
    },
  ];

  const rowActions = (row: StockAdjustmentRecord) => (
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
        onClick={() => handleDelete(row.stockAdjustmentId)}
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
          value={filterWarehouse}
          onChange={(e) => {
            setFilterWarehouse(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="All">Warehouse</option>
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
      {/* Product */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Product <span className="text-red-500">*</span>
        </label>
        <ProductAutoComplete
          value={form.productSearch}
          onSearch={handleProductSearch}
          onSelect={handleProductSelect}
          items={filteredProducts}
          placeholder="Search product..."
        />
      </div>

      {/* Warehouse & Reference */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Warehouse <span className="text-red-500">*</span>
          </label>
          <WarehouseAutoComplete
            value={form.warehouseSearch}
            onSearch={handleWarehouseSearch}
            onSelect={handleWarehouseSelect}
            items={filteredWarehouses}
            placeholder="Search warehouse..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Reference Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.referenceNumber}
            onChange={(e) => setForm((p) => ({ ...p, referenceNumber: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
      </div>

      {/* Product Table */}
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
            <tr>
              <td className="py-3 flex items-center gap-3">
                {form.productImage && (
                  <img src={form.productImage} alt="" className="w-10 h-10 rounded object-cover" />
                )}
                <span className="font-medium">{form.productName || "-"}</span>
              </td>
              <td className="text-center">{form.sku || "-"}</td>
              <td className="text-center">{form.categoryName || "-"}</td>
              <td className="text-center">
                <input
                  type="number"
                  value={form.quantity}
                  onChange={(e) => setForm((p) => ({ ...p, quantity: Number(e.target.value) || 0 }))}
                  className="w-20 border rounded px-2 py-1 text-center"
                  min="1"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Store & Person */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Store <span className="text-red-500">*</span>
          </label>
          <StoreAutoComplete
            value={form.storeSearch}
            onSearch={handleStoreSearch}
            onSelect={handleStoreSelect}
            items={filteredStores}
            placeholder="Search store..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Responsible Person <span className="text-red-500">*</span>
          </label>
          <PersonAutoComplete
            value={form.personSearch}
            onSearch={handlePersonSearch}
            onSelect={handlePersonSelect}
            items={filteredPersons}
            placeholder="Search person..."
          />
        </div>
      </div>

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
      title="Stock Adjustment"
      description="Manage stock levels across warehouses and stores"
      icon="fa-light fa-sliders-h"
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
      modalTitle={formMode === "add" ? "Add Stock Adjustment" : "Edit Stock Adjustment"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
      loading={loading}
    />
  );
}