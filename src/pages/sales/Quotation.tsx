/* -------------------------------------------------
   Quotation – with description, no footer buttons
   ------------------------------------------------- */
import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { renderStatusBadge } from "@/utils/tableUtils";
import { AutoCompleteTextBox, AutoCompleteItem } from "@/components/Search/AutoCompleteTextBox";
import { QUOTATION_STATUSES, SORT_OPTIONS } from "@/constants/constants";

/* ---------- Types ---------- */
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

type QuotationStatus = typeof QUOTATION_STATUSES[number];
const statusSent: QuotationStatus = "Sent";

type Quotation = {
  id: number;
  productId: string;
  productName: string;
  customerName: string;
  customerId: string;
  status: QuotationStatus;
  Total: string;
  description?: string;   // Added
};

type CustomerOption = AutoCompleteItem;
type ProductOption = AutoCompleteItem & { extra: { SKU: string; Price: string } };

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

interface FormState {
  id?: number;
  quotationNo: string;
  quotationDate: string;
  customerId: string;
  customerName: string;
  reference: string;
  productRows: ProductRow[];
  orderTax: string;
  discount: string;
  shipping: string;
  status?: QuotationStatus;
  description: string;
}

/* ------------------------------------------------------------------ */
export default function Quotation() {
  /* ---------- state ---------- */
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<QuotationStatus | "All">("All");
  const [selectedSort, setSelectedSort] = useState<(typeof SORT_OPTIONS)[number]>("Recently Added");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    quotationNo: "",
    quotationDate: "",
    customerId: "",
    customerName: "",
    reference: "",
    productRows: [],
    orderTax: "0",
    discount: "0",
    shipping: "0",
    description: "",
  });

  /* ---------- load data ---------- */
  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [quotRes, custRes, prodRes] = await Promise.all([
        apiService.get<Quotation[]>("Quotation"),
        apiService.get<Customer[]>("Customers"),
        apiService.get<Product[]>("Products"),
      ]);
      if (quotRes.status.code === "S") setQuotations(quotRes.result);
      if (custRes.status.code === "S") {
        setAllCustomers(custRes.result);
        setFilteredCustomers(custRes.result);
      }
      if (prodRes.status.code === "S") {
        setAllProducts(prodRes.result);
        setFilteredProducts(prodRes.result);
      }
      setError(null);
    } catch (err) {
      setError("Failed to load data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- filtering & pagination ---------- */
  const filteredData = useMemo(() => {
    let res = [...quotations];
    if (search.trim())
      res = res.filter(q =>
        q.productName.toLowerCase().includes(search.toLowerCase()) ||
        q.customerName.toLowerCase().includes(search.toLowerCase()) ||
        (q.description?.toLowerCase().includes(search.toLowerCase()) ?? false)
      );
    if (selectedCustomer !== "All") res = res.filter(q => q.customerName === selectedCustomer);
    if (selectedStatus !== "All") res = res.filter(q => q.status === selectedStatus);

    if (selectedSort === "Recently Added") res.sort((a, b) => b.id - a.id);
    else if (selectedSort === "Ascending") res.sort((a, b) => parseFloat(a.Total) - parseFloat(b.Total));
    else if (selectedSort === "Descending") res.sort((a, b) => parseFloat(b.Total) - parseFloat(a.Total));

    return res;
  }, [quotations, search, selectedCustomer, selectedStatus, selectedSort]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const customerOptions = useMemo(
    () => ["All", ...Array.from(new Set(quotations.map(q => q.customerName)))],
    [quotations]
  );

  /* ---------- handlers ---------- */
  const handleAddClick = () => {
    const newId = quotations.length ? Math.max(...quotations.map(q => q.id)) + 1 : 1;
    setForm({
      id: undefined,
      quotationNo: `QTN-${String(newId).padStart(4, "0")}`,
      quotationDate: new Date().toISOString().split("T")[0],
      customerId: "",
      customerName: "",
      reference: "",
      productRows: [{ id: 1, productId: 0, productName: "", sku: "", price: 0, quantity: 1, unit: "", total: 0 }],
      orderTax: "0",
      discount: "0",
      shipping: "0",
      description: "",
    });
    setFormMode("add");
  };

  const handleEdit = (row: Quotation) => {
    const prod = allProducts.find(p => p.id.toString() === row.productId);
    const price = prod?.price ?? 0;
    const quantity = price ? Math.round(parseFloat(row.Total) / price) : 1;
    const total = price * quantity;

    setForm({
      id: row.id,
      quotationNo: `QTN-${String(row.id).padStart(4, "0")}`,
      quotationDate: new Date().toISOString().split("T")[0],
      customerId: row.customerId,
      customerName: row.customerName,
      reference: "",
      productRows: [{
        id: 1,
        productId: parseInt(row.productId) || 0,
        productName: row.productName,
        sku: prod?.sku ?? "",
        price,
        quantity,
        unit: prod?.unit ?? "",
        total,
      }],
      orderTax: "0",
      discount: "0",
      shipping: "0",
      description: row.description ?? "",   // Load description
      status: row.status,
    });
    setFormMode("edit");
  };

  /* ---------- autocomplete ---------- */
  const handleCustomerSearch = (q: string) => {
    const f = allCustomers.filter(c => c.name.toLowerCase().includes(q.toLowerCase()));
    setFilteredCustomers(f);
    setForm(p => ({ ...p, customerName: q, customerId: "" }));
  };
  const handleCustomerSelect = (c: CustomerOption) => {
    setForm(p => ({ ...p, customerId: c.id.toString(), customerName: c.display }));
    setFilteredCustomers(allCustomers);
  };

  const handleProductSearch = (q: string, rowId: number) => {
    const f = allProducts.filter(p =>
      p.productName.toLowerCase().includes(q.toLowerCase()) ||
      p.sku.toLowerCase().includes(q.toLowerCase())
    );
    setFilteredProducts(f);
    setForm(p => ({
      ...p,
      productRows: p.productRows.map(r => (r.id === rowId ? { ...r, productName: q, productId: 0 } : r)),
    }));
  };
  const handleProductSelect = (rowId: number, sel: ProductOption) => {
    const prod = allProducts.find(p => p.id === sel.id);
    if (!prod) return;
    const price = Number(prod.price) || 0;
    const qty = form.productRows.find(r => r.id === rowId)?.quantity || 1;
    const total = price * qty;
    setForm(p => ({
      ...p,
      productRows: p.productRows.map(r =>
        r.id === rowId
          ? { ...r, productId: prod.id, productName: prod.productName, sku: prod.sku, price, unit: prod.unit, total }
          : r
      ),
    }));
    setFilteredProducts(allProducts);
  };

  const addProductRow = () => {
    const newId = form.productRows.length ? Math.max(...form.productRows.map(r => r.id)) + 1 : 1;
    setForm(p => ({
      ...p,
      productRows: [...p.productRows, { id: newId, productId: 0, productName: "", sku: "", price: 0, quantity: 1, unit: "", total: 0 }],
    }));
  };
  const removeProductRow = (rowId: number) => {
    setForm(p => ({ ...p, productRows: p.productRows.filter(r => r.id !== rowId) }));
  };
  const handleQuantityChange = (rowId: number, qty: number) => {
    setForm(p => ({
      ...p,
      productRows: p.productRows.map(r =>
        r.id === rowId ? { ...r, quantity: qty < 1 ? 1 : qty, total: r.price * (qty < 1 ? 1 : qty) } : r
      ),
    }));
  };

  /* ---------- calculations ---------- */
  const subTotal = useMemo(() => form.productRows.reduce((s, r) => s + r.price * r.quantity, 0), [form.productRows]);
  const discountAmt = (subTotal * parseFloat(form.discount || "0")) / 100;
  const taxable = subTotal - discountAmt;
  const taxAmt = (taxable * parseFloat(form.orderTax || "0")) / 100;
  const grandTotal = taxable + taxAmt + parseFloat(form.shipping || "0");

  /* ---------- form submit ---------- */
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerId) { alert("Please select a customer."); return; }
    if (form.productRows.some(r => !r.productId)) { alert("Please select a product for all rows."); return; }

    const productName = form.productRows.map(r => r.productName).join(", ");
    const productId = form.productRows[0]?.productId.toString() || "";

    const newQuotation: Quotation = {
      id: form.id ?? (quotations.length ? Math.max(...quotations.map(q => q.id)) + 1 : 1),
      productId,
      productName,
      customerName: form.customerName,
      customerId: form.customerId,
      status: formMode === "add" ? statusSent : (form.status ?? statusSent),
      Total: grandTotal.toFixed(2),
      description: form.description,   // Save description
    };

    if (formMode === "add") {
      setQuotations(p => [newQuotation, ...p]);
      const totalPages = Math.ceil((filteredData.length + 1) / itemsPerPage);
      setCurrentPage(totalPages);
    } else if (formMode === "edit" && form.id !== undefined) {
      setQuotations(p =>
        p.map(q =>
          q.id === form.id
            ? { ...q, productId, productName, customerName: form.customerName, customerId: form.customerId, Total: grandTotal.toFixed(2), description: form.description }
            : q
        )
      );
    }
    setFormMode(null);
  };

  /* ---------- other handlers ---------- */
  const handleDelete = (id: number) => {
    if (window.confirm("Delete this quotation?")) {
      setQuotations(p => p.filter(q => q.id !== id));
      const totalPages = Math.ceil((filteredData.length - 1) / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
      else if (totalPages === 0) setCurrentPage(1);
    }
  };
  const handleClear = () => {
    loadData();
    setSearch("");
    setSelectedCustomer("All");
    setSelectedStatus("All");
    setSelectedSort("Recently Added");
    setCurrentPage(1);
  };
  const handleReport = () => alert("Quotation Report:\n\n" + JSON.stringify(quotations, null, 2));
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };
  const handlePageChange = (page: number) => {
    const total = Math.ceil(filteredData.length / itemsPerPage);
    if (page >= 1 && page <= total && page !== currentPage) setCurrentPage(page);
  };

  /* ---------- table columns ---------- */
  const columns: Column[] = [
    { key: "index", label: "#", render: (_, __, idx) => (currentPage - 1) * itemsPerPage + (idx ?? 0) + 1, align: "center", className: "w-12" },
    { key: "productName", label: "Product Name" },
    { key: "customerName", label: "Customer Name" },
    { key: "status", label: "Status", render: renderStatusBadge, align: "center" },
    { key: "Total", label: "Total", render: v => `$${Number(v).toFixed(2)}`, align: "right" },
    { key: "description", label: "Description", render: (v: string | undefined) => v || "-", className: "max-w-xs truncate" },
  ];

  const rowActions = (row: Quotation) => (
    <>
      <button onClick={() => handleEdit(row)} className="text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded p-1 transition-colors" title="Edit">
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button onClick={() => handleDelete(row.id)} className="text-gray-700 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1 transition-colors" title="Delete">
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete</span>
      </button>
    </>
  );

  const customFilters = () => (
    <>
      <input
        type="text"
        placeholder="Search by Product, Customer, or Description..."
        value={search}
        onChange={handleSearchChange}
        className="border border-input rounded px-3 py-2 w-full md:w-64 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search"
      />
      <select
        value={selectedCustomer}
        onChange={e => setSelectedCustomer(e.target.value)}
        className="border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {customerOptions.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select
        value={selectedStatus}
        onChange={e => setSelectedStatus(e.target.value as any)}
        className="border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option>All</option>
        {QUOTATION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <select
        value={selectedSort}
        onChange={e => setSelectedSort(e.target.value as any)}
        className="border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {SORT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </>
  );

  /* ---------- MODAL FORM – NO FOOTER BUTTONS ---------- */
  const modalForm = () => (
    <form onSubmit={handleFormSubmit} className="space-y-6">

      {/* ==== Header – Customer / Date / Reference ==== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Customer Name <span className="text-red-600">*</span>
          </label>
          <AutoCompleteTextBox
            value={form.customerName}
            onSearch={handleCustomerSearch}
            onSelect={handleCustomerSelect}
            items={filteredCustomers.map(c => ({ id: c.id, display: c.name }))}
            placeholder="Select"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Date <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            value={form.quotationDate}
            onChange={e => setForm(p => ({ ...p, quotationDate: e.target.value }))}
            required
            className="w-full border border-input rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Reference <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={form.reference}
            onChange={e => setForm(p => ({ ...p, reference: e.target.value }))}
            required
            placeholder="Reference"
            className="w-full border border-input rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* ==== Product Autocomplete ==== */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Product <span className="text-red-600">*</span>
        </label>
        <AutoCompleteTextBox
          value={form.productRows[0]?.productName ?? ""}
          onSearch={q => handleProductSearch(q, form.productRows[0]?.id ?? 1)}
          onSelect={sel => handleProductSelect(form.productRows[0]?.id ?? 1, sel as ProductOption)}
          items={filteredProducts.map(p => ({
            id: p.id,
            display: p.productName,
            extra: { SKU: p.sku, Price: `$${p.price}` },
          }))}
          placeholder="Please type product code and select"
        />
      </div>

      {/* ==== Product Table ==== */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Price($)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount($)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax(%)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Amount($)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Cost($)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost(%)</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {form.productRows.map(row => {
              const discountAmtRow = (row.price * row.quantity * parseFloat(form.discount || "0")) / 100;
              const taxAmtRow = ((row.price * row.quantity - discountAmtRow) * parseFloat(form.orderTax || "0")) / 100;
              const unitCost = row.price;
              const totalCost = row.price * row.quantity - discountAmtRow + taxAmtRow;

              return (
                <tr key={row.id}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{row.productName}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min="1"
                      value={row.quantity}
                      onChange={e => handleQuantityChange(row.id, Number(e.target.value))}
                      className="w-20 border border-input rounded px-2 py-1 text-right text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </td>
                  <td className="px-4 py-2 text-sm text-right">{row.price.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm text-right">{discountAmtRow.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={form.orderTax}
                      onChange={e => setForm(p => ({ ...p, orderTax: e.target.value }))}
                      className="w-16 border border-input rounded px-2 py-1 text-right text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </td>
                  <td className="px-4 py-2 text-sm text-right">{taxAmtRow.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm text-right">{unitCost.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm text-right">{totalCost.toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">
                    {form.productRows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProductRow(row.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <button
          type="button"
          onClick={addProductRow}
          className="mt-3 flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium"
        >
          <i className="fa fa-plus-circle" aria-hidden="true"></i> Add Product
        </button>
      </div>

      {/* ==== Bottom Row – Tax / Discount / Shipping / Status ==== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Order Tax <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={form.orderTax}
            onChange={e => setForm(p => ({ ...p, orderTax: e.target.value }))}
            className="w-full border border-input rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Discount <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={form.discount}
            onChange={e => setForm(p => ({ ...p, discount: e.target.value }))}
            className="w-full border border-input rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Shipping <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.shipping}
            onChange={e => setForm(p => ({ ...p, shipping: e.target.value }))}
            className="w-full border border-input rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Status <span className="text-red-600">*</span>
          </label>
          <select
            value={form.status ?? statusSent}
            onChange={e => setForm(p => ({ ...p, status: e.target.value as QuotationStatus }))}
            className="w-full border border-input rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {QUOTATION_STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ==== Description ==== */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Description</label>
        <textarea
          rows={4}
          value={form.description}
          onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
          className="w-full border border-input rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter description..."
        />
      </div>

      {/* NO FOOTER BUTTONS – Handled by PageBase1 */}
    </form>
  );

  /* ---------- render ---------- */
  if (loading) return <div className="flex items-center justify-center min-h-screen"><i className="fa fa-spinner fa-spin text-3xl text-primary" /></div>;
  if (error) return <div className="flex flex-col items-center justify-center min-h-screen text-red-600"><p>{error}</p><button onClick={loadData} className="mt-4 px-4 py-2 bg-primary text-white rounded">Retry</button></div>;

  return (
    <PageBase1
      title="Quotation"
      description="Create and manage quotations"
      icon="fa-light fa-file-invoice"
      onAddClick={handleAddClick}
      onRefresh={handleClear}
      onReport={handleReport}
      search={search}
      onSearchChange={handleSearchChange}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={handlePageChange}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={formMode === "add" ? "Add Quotation" : "Edit Quotation"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
    />
  );
}