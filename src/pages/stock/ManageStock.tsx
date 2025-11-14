import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { SearchInput } from "@/components/Search/SearchInput";

type Warehouse = { id: number; warehouseName: string; warehouseCode: string };
type Store = { id: number; storeName: string; storeCode: string };
type Product = { id: number; productName: string; sku: string; productImage: string; categoryName: string };
type Employee = { id: number; name: string; image?: string };

type StockEntry = {
  id: number;
  warehouseId: string;
  warehouseName: string;
  storeId: string;
  storeName: string;
  productId: string;
  productName: string;
  productImage: string;
  categoryName: string;
  sku: string;
  date: string;
  personId: string;
  personName: string;
  personImage?: string;
  quantity: number;
};

export default function ManageStock() {
  const [data, setData] = useState<StockEntry[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [filterWarehouse, setFilterWarehouse] = useState("All");
  const [filterStore, setFilterStore] = useState("All");
  const [filterProduct, setFilterProduct] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);

  const [form, setForm] = useState({
    warehouseId: "",
    storeId: "",
    personId: "",
    productId: "",
    quantity: 1,
    date: new Date().toISOString().split("T")[0],
    productSearch: "",
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    Promise.all([
      apiService.get<any[]>("Warehouses"),
      apiService.get<any[]>("Stores"),
      apiService.get<any[]>("Products"),
      apiService.get<any[]>("Employees"),
      apiService.get<any[]>("ManageStock"),
    ]).then(([whRes, stRes, prRes, empRes, stockRes]) => {
      setWarehouses(whRes.result || []);
      setStores(stRes.result || []);
      setProducts(prRes.result || []);
      setEmployees(empRes.result || []);
      setData(stockRes.result || []);
      setLoading(false);
    });
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.productName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchText.toLowerCase());
      const matchesWarehouse = filterWarehouse === "All" || item.warehouseName === filterWarehouse;
      const matchesStore = filterStore === "All" || item.storeName === filterStore;
      const matchesProduct = filterProduct === "All" || item.productName === filterProduct;
      return matchesSearch && matchesWarehouse && matchesStore && matchesProduct;
    });
  }, [data, searchText, filterWarehouse, filterStore, filterProduct]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.warehouseId || !form.storeId || !form.personId || !form.productId || form.quantity <= 0) {
      alert("Please fill all required fields.");
      return;
    }

    const warehouse = warehouses.find(w => w.id.toString() === form.warehouseId);
    const store = stores.find(s => s.id.toString() === form.storeId);
    const person = employees.find(e => e.id.toString() === form.personId);
    const product = products.find(p => p.id.toString() === form.productId);

    if (!warehouse || !store || !person || !product) return;

    const newEntry: StockEntry = {
      id: data.length ? Math.max(...data.map(d => d.id)) + 1 : 1,
      warehouseId: warehouse.warehouseCode,
      warehouseName: warehouse.warehouseName,
      storeId: store.storeCode,
      storeName: store.storeName,
      productId: product.id.toString(),
      productName: product.productName,
      productImage: product.productImage,
      categoryName: product.categoryName,
      sku: product.sku,
      date: form.date,
      personId: person.id.toString(),
      personName: person.name,
      personImage: person.image || "/assets/images/avatar.png",
      quantity: form.quantity,
    };

    if (formMode === "add") {
      setData(prev => [...prev, newEntry]);
    } else {
      setData(prev => prev.map(d => (d.id === newEntry.id ? newEntry : d)));
    }

    setFormMode(null);
    setSelectedProduct(null);
    setForm({
      warehouseId: "",
      storeId: "",
      personId: "",
      productId: "",
      quantity: 1,
      date: new Date().toISOString().split("T")[0],
      productSearch: "",
    });
  };

  const columns: Column[] = [
    { key: "warehouseName", label: "Warehouse", align: "left" },
    { key: "storeName", label: "Store", align: "left" },
    {
      key: "productName",
      label: "Product",
      align: "left",
      render: (value, row: StockEntry) => (
        <div className="flex items-center gap-3">
          <img src={row.productImage} alt={value} className="w-10 h-10 rounded object-cover" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      align: "left",
      render: (value) => new Date(value).toLocaleDateString("en-IN"),
    },
    {
      key: "personName",
      label: "Person",
      align: "left",
      render: (value, row: StockEntry) => (
        <div className="flex items-center gap-2">
          <img src={row.personImage} alt={value} className="w-8 h-8 rounded-full" />
          <span>{value}</span>
        </div>
      ),
    },
    { key: "quantity", label: "Qty", align: "right" },
  ];

  const rowActions = (row: StockEntry) => (
    <>
      <button
        onClick={() => {
          const warehouse = warehouses.find(w => w.warehouseName === row.warehouseName);
          const store = stores.find(s => s.storeName === row.storeName);
          const person = employees.find(e => e.name === row.personName);
          const product = products.find(p => p.id.toString() === row.productId);

          setForm({
            warehouseId: warehouse?.id.toString() || "",
            storeId: store?.id.toString() || "",
            personId: person?.id.toString() || "",
            productId: row.productId,
            quantity: row.quantity,
            date: row.date,
            productSearch: product?.productName || "",
          });
          setSelectedProduct(product || null);
          setFormMode("edit");
        }}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white rounded-lg text-xs p-2 me-1"
        title="Edit"
      >
        <i className="fa fa-edit"></i>
      </button>
      <button
        onClick={() => {
          if (window.confirm("Delete this stock entry?")) {
            setData(prev => prev.filter(d => d.id !== row.id));
          }
        }}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white rounded-lg text-xs p-2"
        title="Delete"
      >
        <i className="fa fa-trash-can-xmark"></i>
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
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="All">Warehouse</option>
          {warehouses.map(w => (
            <option key={w.id} value={w.warehouseName}>{w.warehouseName}</option>
          ))}
        </select>
        <select
          value={filterStore}
          onChange={(e) => {
            setFilterStore(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="All">Store</option>
          {stores.map(s => (
            <option key={s.id} value={s.storeName}>{s.storeName}</option>
          ))}
        </select>
        <select
          value={filterProduct}
          onChange={(e) => {
            setFilterProduct(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="All">Product</option>
          {products.map(p => (
            <option key={p.id} value={p.productName}>{p.productName}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const modalForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Warehouse */}
      <div>
        <label htmlFor="warehouse" className="block text-sm font-medium mb-1">
          Warehouse <span className="text-red-500">*</span>
        </label>
        <select
          id="warehouse"
          value={form.warehouseId}
          onChange={(e) => setForm(p => ({ ...p, warehouseId: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
          required
          aria-required="true"
        >
          <option value="">Select Warehouse</option>
          {warehouses.map(w => (
            <option key={w.id} value={w.id}>{w.warehouseName}</option>
          ))}
        </select>
      </div>

      {/* Store */}
      <div>
        <label htmlFor="store" className="block text-sm font-medium mb-1">
          Store <span className="text-red-500">*</span>
        </label>
        <select
          id="store"
          value={form.storeId}
          onChange={(e) => setForm(p => ({ ...p, storeId: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
          required
          aria-required="true"
        >
          <option value="">Select Store</option>
          {stores.map(s => (
            <option key={s.id} value={s.id}>{s.storeName}</option>
          ))}
        </select>
      </div>

      {/* Responsible Person */}
      <div>
        <label htmlFor="person" className="block text-sm font-medium mb-1">
          Responsible Person <span className="text-red-500">*</span>
        </label>
        <select
          id="person"
          value={form.personId}
          onChange={(e) => setForm(p => ({ ...p, personId: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
          required
          aria-required="true"
        >
          <option value="">Select Person</option>
          {employees.map(e => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
      </div>

      {/* Product Search + Table */}
      <div>
        <label htmlFor="productSearch" className="block text-sm font-medium mb-1">
          Product <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            <i className="fa fa-search"></i>
          </div>
          <input
            id="productSearch"
            type="text"
            placeholder="Nike Jordan"
            value={form.productSearch}
            onChange={(e) => {
              const query = e.target.value;
              setForm(p => ({ ...p, productSearch: query }));

              const match = products.find(p =>
                p.productName.toLowerCase().includes(query.toLowerCase()) ||
                p.sku.toLowerCase().includes(query.toLowerCase())
              );
              if (match) {
                setSelectedProduct(match);
                setForm(p => ({ ...p, productId: match.id.toString() }));
              } else if (!query) {
                setSelectedProduct(null);
                setForm(p => ({ ...p, productId: "" }));
              }
            }}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
            required
            aria-required="true"
          />
        </div>

        {selectedProduct && (
          <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 grid grid-cols-12 text-sm font-medium text-gray-700">
              <div className="col-span-5 px-4 py-3">Product</div>
              <div className="col-span-2 px-4 py-3">SKU</div>
              <div className="col-span-3 px-4 py-3">Category</div>
              <div className="col-span-2 px-4 py-3 text-center">Qty</div>
            </div>

            <div className="grid grid-cols-12 items-center bg-white">
              <div className="col-span-5 px-4 py-3 flex items-center gap-3">
                <img
                  src={selectedProduct.productImage}
                  alt={selectedProduct.productName}
                  className="w-10 h-10 rounded object-cover"
                />
                <span className="font-medium">{selectedProduct.productName}</span>
              </div>
              <div className="col-span-2 px-4 py-3 text-gray-600">{selectedProduct.sku}</div>
              <div className="col-span-3 px-4 py-3 text-gray-600">{selectedProduct.categoryName}</div>
              <div className="col-span-2 px-4 py-3 flex justify-center items-center gap-2">
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, quantity: Math.max(1, p.quantity - 1) }))}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  <i className="fa fa-minus text-xs"></i>
                </button>
                <input
                  type="number"
                  value={form.quantity}
                  onChange={(e) => setForm(p => ({ ...p, quantity: parseInt(e.target.value) || 1 }))}
                  className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                  min="1"
                />
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, quantity: p.quantity + 1 }))}
                  className="w-8 h-8 rounded-full border border-primary bg-primary text-white flex items-center justify-center hover:bg-primary/90"
                >
                  <i className="fa fa-plus text-xs"></i>
                </button>
              </div>
            </div>

            <div className="h-1 bg-orange-500"></div>
          </div>
        )}
      </div>
    </form>
  );

  return (
    <PageBase1
      title="Manage Stock"
      description="Track and manage stock across warehouses and stores"
      onAddClick={() => {
        setFormMode("add");
        setSelectedProduct(null);
        setForm({
          warehouseId: "",
          storeId: "",
          personId: "",
          productId: "",
          quantity: 1,
          date: new Date().toISOString().split("T")[0],
          productSearch: "",
        });
      }}
      onRefresh={() => window.location.reload()}
      onReport={() => alert("PDF Report Generated!")}
      onExcelReport={() => alert("Excel Report Exported!")}
      search={searchText}
      onSearchChange={(val) => {
        setSearchText(val);
        setCurrentPage(1);
      }}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={formMode === "add" ? "Add Stock Entry" : "Edit Stock Entry"}
      modalForm={modalForm}
      onFormSubmit={handleSubmit}
      customFilters={customFilters}
      loading={loading}
    />
  );
}