import React, { useState, useEffect, useRef } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";
import {
  AutoCompleteTextBox,
  AutoCompleteItem,
} from "@/components/Search/AutoCompleteTextBox";
import QRCode from "react-qr-code";

// === Types ===
type Warehouse = { id: number; warehouseName: string };
type Store = { id: number; storeName: string };
type Product = {
  id: number;
  productName: string;
  productImage?: string;
  sku: string;
  code: string;
};

type PrintItem = {
  productId: number | null;
  productName: string;
  productImage?: string;
  sku: string;
  code: string;
  referenceNumber: string;
  quantity: number;
  searchQuery: string;
  isValid: boolean; // NEW: Track if row is valid
};

type PrintQrCodeResponse = {
  warehouse: { id: number; name: string };
  store: { id: number; name: string };
  products: {
    productId: number | null;
    productName: string;
    productImage?: string;
    sku: string;
    code: string;
    referenceNumber: string;
    quantity: number;
  }[];
  paperSize: string;
  generateReferenceNumber: boolean;
};

type PrintQrCodeForm = {
  warehouseId: string;
  warehouseName: string;
  storeId: string;
  storeName: string;
  paperSize: string;
  generateReferenceNumber: boolean;
  items: PrintItem[];
};

// Preview Modal
const QrPreviewModal = ({
  items,
  paperSize,
  onClose,
  onPrint,
}: {
  items: PrintItem[];
  paperSize: string;
  onClose: () => void;
  onPrint: () => void;
}) => {
  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-full overflow-y-auto">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold">QR Code Preview</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 text-2xl"
            aria-label="Close"
          >
            X
          </button>
        </div>

        <div className="p-6" ref={previewRef}>
          <p className="mb-4 text-sm text-muted-foreground">
            Preview of QR codes on <strong>{paperSize}</strong> paper.
          </p>

          <div className="space-y-6">
            {items.map((item, idx) => (
              <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-semibold text-lg mb-2">
                  {item.productName} (Qty: {item.quantity})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {[...Array(item.quantity)].map((_, i) => (
                    <div
                      key={i}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center space-y-2 text-center"
                    >
                      <div className="bg-gray-200   w-24 h-24 flex items-center justify-center">
                        <QRCode
                          size={256}
                          style={{
                            height: "auto",
                            maxWidth: "100%",
                            width: "100%",
                          }}
                          value= {item.referenceNumber || "REF-XXXX"}
                          viewBox={`0 0 256 256`}
                        />
                      </div>
                      <div className="text-xs font-mono break-all">
                        {item.referenceNumber || "REF-XXXX"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.sku} | {item.code}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Close
          </button>
          <button
            onClick={onPrint}
            className="px-5 py-2 border rounded-md bg-green-600 text-white hover:bg-green-700 flex items-center"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default function PrintQrCode() {
  const [form, setForm] = useState<PrintQrCodeForm>({
    warehouseId: "",
    warehouseName: "",
    storeId: "",
    storeName: "",
    paperSize: "A4",
    generateReferenceNumber: true,
    items: [],
  });

  const [filteredWarehouses, setFilteredWarehouses] = useState<Warehouse[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Timeouts
  let warehouseTimeout: NodeJS.Timeout;
  let storeTimeout: NodeJS.Timeout;
  let productTimeout: NodeJS.Timeout;

  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = async () => {
    try {
      const [whRes, stRes, qrRes] = await Promise.all([
        apiService.get<Warehouse[]>("Warehouses"),
        apiService.get<Store[]>("Stores"),
        apiService.get<PrintQrCodeResponse>("PrintQrCode"), // Fixed type
      ]);

      // Populate autocomplete lists
      if (whRes.status.code === "S") setFilteredWarehouses(whRes.result);
      if (stRes.status.code === "S") setFilteredStores(stRes.result);

      // Load form from PrintQrCode.json
      if (qrRes.status.code === "S") {
        const data = qrRes.result;
        setForm({
          warehouseId: data.warehouse.id.toString(),
          warehouseName: data.warehouse.name,
          storeId: data.store.id.toString(),
          storeName: data.store.name,
          paperSize: data.paperSize,
          generateReferenceNumber: data.generateReferenceNumber,
          items: data.products.map((p) => ({
            productId: p.productId ?? null,
            productName: p.productName,
            productImage: p.productImage,
            sku: p.sku,
            code: p.code,
            referenceNumber: p.referenceNumber,
            quantity: p.quantity,
            searchQuery: p.productName,
            isValid: true, // Mark as valid even if productId is null
          })),
        });

        // Populate filteredProducts (only if productId exists)
        const productList: Product[] = data.products
          .filter((p) => p.productId !== null)
          .map((p) => ({
            id: p.productId!,
            productName: p.productName,
            productImage: p.productImage,
            sku: p.sku,
            code: p.code,
          }));
        setFilteredProducts(productList);
      }
    } catch (err) {
      console.error("Load error:", err);
    }
  };

  /* ---------- Autocomplete Handlers ---------- */
  const handleWarehouseSearch = async (query: string) => {
    clearTimeout(warehouseTimeout);
    setForm((p) => ({ ...p, warehouseName: query, warehouseId: "" }));
    if (!query.trim()) {
      setFilteredWarehouses([]);
      return;
    }

    warehouseTimeout = setTimeout(async () => {
      const res = await apiService.get<Warehouse[]>("Warehouses");
      if (res.status.code === "S") {
        setFilteredWarehouses(
          res.result.filter((w) =>
            w.warehouseName.toLowerCase().includes(query.toLowerCase())
          )
        );
      }
    }, 300);
  };

  const handleWarehouseSelect = (item: AutoCompleteItem) => {
    setForm((p) => ({
      ...p,
      warehouseId: item.id.toString(),
      warehouseName: item.display,
    }));
    setFilteredWarehouses([]);
  };

  const handleStoreSearch = async (query: string) => {
    clearTimeout(storeTimeout);
    setForm((p) => ({ ...p, storeName: query, storeId: "" }));
    if (!query.trim()) {
      setFilteredStores([]);
      return;
    }

    storeTimeout = setTimeout(async () => {
      const res = await apiService.get<Store[]>("Stores");
      if (res.status.code === "S") {
        setFilteredStores(
          res.result.filter((s) =>
            s.storeName.toLowerCase().includes(query.toLowerCase())
          )
        );
      }
    }, 300);
  };

  const handleStoreSelect = (item: AutoCompleteItem) => {
    setForm((p) => ({
      ...p,
      storeId: item.id.toString(),
      storeName: item.display,
    }));
    setFilteredStores([]);
  };

  const handleProductSearch = async (query: string, idx: number) => {
    clearTimeout(productTimeout);
    const items = [...form.items];
    items[idx].searchQuery = query;
    items[idx].productId = null;
    items[idx].isValid = false;
    setForm((p) => ({ ...p, items }));

    if (!query.trim()) {
      setFilteredProducts([]);
      return;
    }

    productTimeout = setTimeout(async () => {
      const res = await apiService.get<Product[]>("Products");
      if (res.status.code === "S") {
        setFilteredProducts(
          res.result.filter(
            (p) =>
              p.productName.toLowerCase().includes(query.toLowerCase()) ||
              p.sku.toLowerCase().includes(query.toLowerCase()) ||
              p.code.toLowerCase().includes(query.toLowerCase())
          )
        );
      }
    }, 300);
  };

  const handleProductSelect = (idx: number, item: AutoCompleteItem) => {
    const prod = filteredProducts.find((p) => p.id === item.id);
    if (!prod) return;

    const items = [...form.items];
    items[idx] = {
      ...items[idx],
      productId: prod.id,
      productName: prod.productName,
      productImage: prod.productImage,
      sku: prod.sku,
      code: prod.code,
      referenceNumber: form.generateReferenceNumber
        ? `32RRR${Math.floor(Math.random() * 9999)
            .toString()
            .padStart(4, "0")}`
        : "",
      searchQuery: prod.productName,
      isValid: true,
    };

    setForm((p) => ({ ...p, items }));
    setFilteredProducts([]);
  };

  const addItem = () => {
    setForm((p) => ({
      ...p,
      items: [
        ...p.items,
        {
          productId: null,
          productName: "",
          productImage: "",
          sku: "",
          code: "",
          referenceNumber: "",
          quantity: 1,
          searchQuery: "",
          isValid: false,
        },
      ],
    }));
  };

  const removeItem = (idx: number) => {
    setForm((p) => ({ ...p, items: p.items.filter((_, i) => i !== idx) }));
  };

  const handleQtyChange = (idx: number, delta: number) => {
    const items = [...form.items];
    items[idx].quantity = Math.max(1, items[idx].quantity + delta);
    setForm((p) => ({ ...p, items }));
  };

  /* ---------- ACTIONS ---------- */
  const handleGenerateQr = () => {
    if (!form.warehouseId || !form.storeId) {
      alert("Please select warehouse and store.");
      return;
    }

    // Use `isValid` instead of `productId`
    const validItems = form.items.filter((i) => i.isValid);
    if (validItems.length === 0) {
      alert("Please add at least one valid product.");
      return;
    }

    setIsPreviewOpen(true);
  };

  const handlePrintQr = () => {
    if (previewRef.current) {
      const printWindow = window.open("", "", "width=1000,height=800");
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Print QR Codes</title>
              <style>
                body { font-family: sans-serif; padding: 20px; }
                .item { page-break-inside: avoid; margin-bottom: 30px; }
                .qr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
                .qr-box { border: 2px dashed #ccc; padding: 16px; text-align: center; border-radius: 8px; }
                .qr-placeholder { background: #eee; width: 96px; height: 96px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; font-size: 48px; }
                .ref { font-family: monospace; font-size: 12px; }
                @media print { .no-print { display: none; } }
              </style>
            </head>
            <body>
              <h2>QR Code Printout - ${form.paperSize}</h2>
              ${previewRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
      }
    }
    setIsPreviewOpen(false);
  };

  const handleReset = () => {
    setForm({
      warehouseId: "",
      warehouseName: "",
      storeId: "",
      storeName: "",
      paperSize: "A4",
      generateReferenceNumber: true,
      items: [],
    });
    setIsPreviewOpen(false);
  };

  const handleReport = () => alert("PDF Report Generated!");

  /* ---------- MAIN FORM ---------- */
  const formContent = (
    <div className="bg-card rounded-lg shadow p-6 space-y-8">
      {/* Warehouse & Store */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Warehouse <span className="text-red-500">*</span>
          </label>
          <AutoCompleteTextBox
            value={form.warehouseName}
            onSearch={handleWarehouseSearch}
            onSelect={handleWarehouseSelect}
            items={filteredWarehouses.map((w) => ({
              id: w.id,
              display: w.warehouseName,
            }))}
            placeholder="Select"
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Store <span className="text-red-500">*</span>
          </label>
          <AutoCompleteTextBox
            value={form.storeName}
            onSearch={handleStoreSearch}
            onSelect={handleStoreSelect}
            items={filteredStores.map((s) => ({
              id: s.id,
              display: s.storeName,
            }))}
            placeholder="Select"
            className="w-full"
          />
        </div>
      </div>

      {/* Product Table */}
      <div>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">
                Product <span className="text-red-500">*</span>
              </th>
              <th className="px-3 py-2 text-center">SKU</th>
              <th className="px-3 py-2 text-center">Code</th>
              <th className="px-3 py-2 text-center">Reference Number</th>
              <th className="px-3 py-2 text-center">Qty</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {form.items.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-4 text-muted-foreground"
                >
                  No products added.
                </td>
              </tr>
            ) : (
              form.items.map((item, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-3 py-2">
                    <AutoCompleteTextBox
                      value={item.searchQuery}
                      onSearch={(q) => handleProductSearch(q, idx)}
                      onSelect={(sel) => handleProductSelect(idx, sel)}
                      items={filteredProducts.map((p) => ({
                        id: p.id,
                        display: p.productName,
                        extra: { SKU: p.sku, Code: p.code },
                      }))}
                      placeholder="Search Product by Code"
                      className="w-full"
                    />
                    {item.productName && (
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        {item.productImage && (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-6 h-6 object-cover rounded"
                          />
                        )}
                        <span>{item.productName}</span>
                      </div>
                    )}
                  </td>
                  <td className="text-center">{item.sku}</td>
                  <td className="text-center">{item.code}</td>
                  <td className="text-center">{item.referenceNumber}</td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(idx, -1)}
                        className="w-6 h-6 rounded-full border border-gray-300 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="mx-2 w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(idx, 1)}
                        className="w-6 h-6 rounded-full border border-gray-300 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <button
          type="button"
          onClick={addItem}
          className="mt-2 flex items-center text-blue-600 hover:text-blue-800 text-sm"
        >
          Add Product
        </button>
      </div>

      {/* Paper Size & Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Paper Size <span className="text-red-500">*</span>
          </label>
          <select
            value={form.paperSize}
            onChange={(e) =>
              setForm((p) => ({ ...p, paperSize: e.target.value }))
            }
            className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option>A3</option>
            <option>A4</option>
            <option>A5</option>
            <option>A6</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Reference Number
          </label>
          <button
            type="button"
            onClick={() =>
              setForm((p) => ({
                ...p,
                generateReferenceNumber: !p.generateReferenceNumber,
              }))
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              form.generateReferenceNumber ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                form.generateReferenceNumber ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleGenerateQr}
          className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 flex items-center gap-2"
        >
          Generate QR Code
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 flex items-center gap-2"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handlePrintQr}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 flex items-center gap-2"
          disabled={!isPreviewOpen}
        >
          Print QRcode
        </button>
      </div>
    </div>
  );

  /* ---------- RENDER ---------- */
  return (
    <>
      <PageBase1
        title="Print QR Code"
        description="Manage your QR code"
        icon="fa-light fa-qrcode"
        onAddClick={null}
        onRefresh={handleReset}
        onReport={handleReport}
        search=""
        onSearchChange={null}
        currentPage={1}
        itemsPerPage={10}
        totalItems={0}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        tableColumns={[]}
        tableData={[]}
        formMode={null}
        setFormMode={() => {}}
        modalTitle=""
        modalForm={null}
        onFormSubmit={null}
        customFilters={null}
        
      >
        {formContent}
      </PageBase1>

      {isPreviewOpen && (
        <QrPreviewModal
          items={form.items.filter((i) => i.isValid)}
          paperSize={form.paperSize}
          onClose={() => setIsPreviewOpen(false)}
          onPrint={handlePrintQr}
        />
      )}
    </>
  );
}
