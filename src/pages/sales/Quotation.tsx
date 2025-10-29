/* -------------------------------------------------
   Quotation – Matches AddSalesModal autocomplete
   ------------------------------------------------- */
import React, {
  useState,
  useEffect,
  useMemo,
  ChangeEvent,
} from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { AutoCompleteTextBox, AutoCompleteItem } from "@/components/Search/AutoCompleteTextBox";

type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
};

type Product = {
  id: number;
  productName: string;
  sku: string;
  price: number;
  unit: string;
};

type CustomerOption = {
  id: number;
  display: string;
};

type ProductOption = {
  id: number;
  display: string;
  extra: { SKU: string; Price: string };
};

const CustomerAutoComplete = AutoCompleteTextBox<CustomerOption>;
const ProductAutoComplete = AutoCompleteTextBox<ProductOption>;

type ProductRow = {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  unit: string;
  total: number;
};

export default function Quotation() {
  /* ---------- state ---------- */
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [formMode, setFormMode] = useState<"add" | null>(null);

  const [quotationNo, setQuotationNo] = useState("QTN-0001");
  const [quotationDate, setQuotationDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });

  const [customerId, setCustomerId] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerDetails, setCustomerDetails] = useState<Customer | null>(null);

  const [productRows, setProductRows] = useState<ProductRow[]>([
    {
      id: 1,
      productId: 0,
      productName: "",
      sku: "",
      price: 0,
      quantity: 1,
      unit: "",
      total: 0,
    },
  ]);

  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------- load initial data ---------- */
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [custRes, prodRes] = await Promise.all([
        apiService.get<any>("Quotation"),
        apiService.get<any>("Products"),
      ]);

      if (custRes?.status?.code === "S" && Array.isArray(custRes.result)) {
        setAllCustomers(custRes.result);
        setFilteredCustomers(custRes.result);
      }

      if (prodRes?.status?.code === "S" && Array.isArray(prodRes.result)) {
        setAllProducts(prodRes.result);
        setFilteredProducts(prodRes.result);
      }

      setError(null);
    } catch (err) {
      setError("Failed to load data.");
      console.error("Quotation load error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- form reset ---------- */
  const resetForm = () => {
    setQuotationNo(`QTN-${Date.now().toString().slice(-4)}`);
    setQuotationDate(new Date().toISOString().split("T")[0]);
    setCustomerId(null);
    setCustomerName("");
    setCustomerDetails(null);
    setProductRows([
      {
        id: 1,
        productId: 0,
        productName: "",
        sku: "",
        price: 0,
        quantity: 1,
        unit: "",
        total: 0,
      },
    ]);
    setDiscount(0);
    setTax(0);
  };

  const openAddModal = () => {
    resetForm();
    setFormMode("add");
  };

  const closeModal = () => {
    setFormMode(null);
  };

  /* ---------- Customer Autocomplete (same as AddSalesModal) ---------- */
  const handleCustomerSearch = (query: string) => {
    const filtered = allCustomers.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCustomers(filtered);
    setCustomerName(query);
  };

  const handleCustomerSelect = (sel: CustomerOption) => {
    const cust = allCustomers.find((c) => c.id === sel.id);
    if (cust) {
      setCustomerId(cust.id);
      setCustomerName(cust.name);
      setCustomerDetails(cust);
      setFilteredCustomers(allCustomers); // reset list
    }
  };

  /* ---------- Product Autocomplete (same as AddSalesModal) ---------- */
  const handleProductSearch = (query: string, rowId: number) => {
    const filtered = allProducts.filter(
      (p) =>
        p.productName.toLowerCase().includes(query.toLowerCase()) ||
        p.sku.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);

    setProductRows((rows) =>
      rows.map((r) =>
        r.id === rowId ? { ...r, productName: query, productId: 0 } : r
      )
    );
  };

  const handleProductSelect = (rowId: number, sel: ProductOption) => {
    const prod = allProducts.find((p) => p.id === sel.id);
    if (!prod) return;

    const price = Number(prod.price) || 0;
    const quantity = productRows.find((r) => r.id === rowId)?.quantity || 1;
    const total = price * quantity;

    setProductRows((rows) =>
      rows.map((r) =>
        r.id === rowId
          ? {
            ...r,
            productId: prod.id,
            productName: prod.productName,
            sku: prod.sku,
            price,
            unit: prod.unit,
            total,
          }
          : r
      )
    );

    setFilteredProducts(allProducts); // reset list
  };

  /* ---------- Product Row Logic ---------- */
  const addProductRow = () => {
    const newId = productRows.length ? Math.max(...productRows.map((r) => r.id)) + 1 : 1;
    setProductRows((rows) => [
      ...rows,
      {
        id: newId,
        productId: 0,
        productName: "",
        sku: "",
        price: 0,
        quantity: 1,
        unit: "",
        total: 0,
      },
    ]);
  };

  const removeProductRow = (rowId: number) => {
    setProductRows((rows) => rows.filter((r) => r.id !== rowId));
  };

  const handleQuantityChange = (rowId: number, qty: number) => {
    setProductRows((rows) =>
      rows.map((r) =>
        r.id === rowId
          ? { ...r, quantity: qty, total: r.price * qty }
          : r
      )
    );
  };

  /* ---------- Calculations ---------- */
  const subTotal = useMemo(
    () => productRows.reduce((s, r) => s + r.price * r.quantity, 0),
    [productRows]
  );
  const discountAmount = (subTotal * discount) / 100;
  const taxAmount = ((subTotal - discountAmount) * tax) / 100;
  const grandTotal = subTotal - discountAmount + taxAmount;

  /* ---------- Save ---------- */
  const handleSave = () => {
    if (!customerId) {
      alert("Please select a customer.");
      return;
    }
    if (productRows.some((r) => !r.productId)) {
      alert("Please select a product for all rows.");
      return;
    }

    alert("Quotation saved successfully!");
    closeModal();
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearch("");
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report coming soon!");
  };

  /* ---------- Table Search + Pagination ---------- */
  const filteredTableCustomers = useMemo(() => {
    const term = search.toLowerCase();
    return allCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.phone.includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.address.toLowerCase().includes(term)
    );
  }, [allCustomers, search]);

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTableCustomers.slice(start, start + itemsPerPage);
  }, [filteredTableCustomers, currentPage, itemsPerPage]);

  const customerColumns: Column[] = [
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
  ];

  const customFilters = () => (
    <input
      type="text"
      placeholder="Search customers..."
      value={search}
      onChange={handleSearchChange}
      className="border border-input rounded px-3 py-2 w-full md:w-64 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
    />
  );

  /* ---------- Modal Form ---------- */
  const modalForm = () => (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Quotation No</label>
          <input
            type="text"
            value={quotationNo}
            readOnly
            className="w-full border border-input rounded px-3 py-2 bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={quotationDate}
            onChange={(e) => setQuotationDate(e.target.value)}
            className="w-full border border-input rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Customer *</label>
          <CustomerAutoComplete
            value={customerName}
            onSearch={handleCustomerSearch}
            onSelect={handleCustomerSelect}
            items={filteredCustomers.map((c) => ({
              id: c.id,
              display: c.name,
            }))}
            placeholder="Search customer..."
          />
        </div>
      </div>

      {customerDetails && (
        <div className="bg-gray-50 p-4 rounded border text-sm">
          <h3 className="font-semibold mb-2">Customer Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><strong>Name:</strong> {customerDetails.name}</div>
            <div><strong>Phone:</strong> {customerDetails.phone}</div>
            <div><strong>Email:</strong> {customerDetails.email}</div>
            <div><strong>Address:</strong> {customerDetails.address}</div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div>
        <h3 className="font-semibold mb-2">Products</h3>
        <div className="space-y-2">
          {productRows.map((row) => (
            <div key={row.id} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4">
                <ProductAutoComplete
                  value={row.productName}
                  onSearch={(q) => handleProductSearch(q, row.id)}
                  onSelect={(sel) => {
                    const prod = allProducts.find((p) => p.id === sel.id);
                    if (prod) handleProductSelect(row.id, sel);
                  }}
                  items={filteredProducts.map((p) => ({
                    id: p.id,
                    display: p.productName,
                    extra: { SKU: p.sku, Price: `$${p.price}` },
                  }))}
                  placeholder="Search product..."
                />
              </div>
              <div className="col-span-1 text-center">{row.sku || "-"}</div>
              <div className="col-span-1 text-right">${row.price.toFixed(2)}</div>
              <div className="col-span-1">
                <input
                  type="number"
                  min="1"
                  value={row.quantity}
                  onChange={(e) => handleQuantityChange(row.id, Number(e.target.value))}
                  className="w-full border rounded px-2 py-1 text-right"
                />
              </div>
              <div className="col-span-1 text-center">{row.unit}</div>
              <div className="col-span-2 text-right font-medium">${row.total.toFixed(2)}</div>
              <div className="col-span-1 text-center">
                <button
                  type="button"
                  onClick={() => removeProductRow(row.id)}
                  className="text-red-600"
                >
                  <i className="fa fa-trash" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addProductRow}
          className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
        >
          <i className="fa fa-plus-circle" /> Add Product
        </button>
      </div>

      {/* Totals */}
      <div className="max-w-md ml-auto space-y-2 text-sm">
        <div className="flex justify-between"><span>Sub Total:</span> <span>${subTotal.toFixed(2)}</span></div>
        <div className="flex justify-between items-center">
          <span>Discount (%):</span>
          <input
            type="number"
            min="0"
            max="100"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="w-20 border rounded px-2 py-1 text-right"
          />
        </div>
        <div className="flex justify-between items-center">
          <span>Tax (%):</span>
          <input
            type="number"
            min="0"
            max="100"
            value={tax}
            onChange={(e) => setTax(Number(e.target.value))}
            className="w-20 border rounded px-2 py-1 text-right"
          />
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Grand Total:</span> <span>${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 mt-6">
        <button type="button" onClick={closeModal} className="px-4 py-2 border rounded-lg hover:bg-gray-100">
          Cancel
        </button>
        <button type="button" onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          Save Quotation
        </button>
      </div>
    </form>
  );

  /* ---------- Render ---------- */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <i className="fa fa-spinner fa-spin text-3xl text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-600">
        <p className="text-lg">{error}</p>
        <button onClick={loadInitialData} className="mt-4 px-4 py-2 bg-primary text-white rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <PageBase1
      title="Quotation"
      description="Create and manage quotations"
      icon="fa-light fa-file-invoice"
      onAddClick={openAddModal}
      onRefresh={handleClear}
      onReport={handleReport}
      search={search}
      onSearchChange={handleSearchChange}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredTableCustomers.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={customerColumns}
      tableData={paginatedCustomers}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle="Add Quotation"
      modalForm={modalForm}
      onFormSubmit={() => { }} // Disabled
      customFilters={customFilters}
    />
  );
}