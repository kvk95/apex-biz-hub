import { PageBase1 } from "@/pages/PageBase1";
import { apiService } from "@/services/ApiService";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Variant {
  id: number;
  variation: string;
  variantValue: string;
  sku: string;
  quantity: number;
  price: number;
}

interface Product {
  id: number;
  productName: string;
  productCode: string;
  sku: string;
  slug: string;
  category: string;
  subCategory: string;
  brand: string;
  store: string;
  warehouse: string;
  sellingType: string;
  barcodeSymbology: string;
  itemBarcode: string;
  price: number;
  quantity: number;
  description: string;
  status: "In Stock" | "Out of Stock";
  productType: "Single Product" | "Variable Product";
  taxType: string;
  tax: string;
  discountType: string;
  discountValue: number;
  quantityAlert: number;
  warranty?: string;
  manufacturedDate?: string;
  manufacturer?: string;
  expiryDate?: string;
  variants: Variant[];
  images: string[];
  customFields: {
    warranties: boolean;
    manufacturer: boolean;
    expiry: boolean;
  };
}

export default function ProductDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [mode] = useState<"create" | "edit" | "view">(state?.mode || "create");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const masterData = state?.masterData || {};
  const productRecord = state?.productRecord || {};
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Product>({
    id: productRecord.id || 0,
    productName: productRecord.productName || "",
    productCode: productRecord.productCode || "",
    sku: productRecord.sku || "",
    slug: productRecord.slug || "",
    category: productRecord.categoryName || "",
    subCategory: productRecord.subCategoryName || "",
    brand: productRecord.brandName || "",
    store: productRecord.storeName || "",
    warehouse: productRecord.warehouseName || "",
    sellingType: productRecord.sellingType || "",
    barcodeSymbology: productRecord.barcodeSymbology || "CODE128",
    itemBarcode: productRecord.itemBarcode || "",
    price: productRecord.price || 0,
    quantity: productRecord.quantity || 0,
    description: productRecord.description || "",
    status: productRecord.status || "In Stock",
    productType: productRecord.productType || "Single Product",
    taxType: productRecord.taxType || "",
    tax: productRecord.tax || "",
    discountType: productRecord.discountType || "",
    discountValue: productRecord.discountValue || 0,
    quantityAlert: productRecord.quantityAlert || 10,
    warranty: productRecord.warranty || "",
    manufacturedDate: productRecord.manufacturedDate || "",
    manufacturer: productRecord.manufacturer || "",
    expiryDate: productRecord.expiryDate || "",
    variants: productRecord.variants || [],
    images: productRecord.images || [],
    customFields: {
      warranties: true,
      manufacturer: true,
      expiry: true,
    },
  });

  const [variantAttr, setVariantAttr] = useState("");
  const [variantValue, setVariantValue] = useState("");
  const [variantSKU, setVariantSKU] = useState("");
  const [variantQty, setVariantQty] = useState(1);
  const [variantPrice, setVariantPrice] = useState(0);

  const [stores, setStores] = useState<any[]>(masterData.stores || []);
  const [warehouses, setWarehouses] = useState<any[]>(
    masterData.warehouses || []
  );
  const [subCategories, setSubCategories] = useState<any[]>(
    masterData.subCategories || []
  );

  useEffect(() => {
    const load = async () => {
      try {
        const [storeRes, whRes, subCatRes] = await Promise.all(
          [
            !stores.length && apiService.get("Stores"),
            !warehouses.length && apiService.get("Warehouses"),
            !subCategories.length && apiService.get("SubCategory"),
          ].filter(Boolean)
        );

        const get = (res: any) => res?.result || res?.data || res || [];

        if (!stores.length)
          setStores(get(storeRes).filter((s: any) => s.status === "Active"));
        if (!warehouses.length)
          setWarehouses(
            get(whRes).filter((w: any) => w.warehouseStatus === "Active")
          );
        if (!subCategories.length)
          setSubCategories(
            get(subCatRes).filter((sc: any) => sc.status === "Active")
          );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["price", "quantity", "quantityAlert", "discountValue"].includes(
        name
      )
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleCustomFieldToggle = (field: keyof Product["customFields"]) => {
    setForm((prev) => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [field]: !prev.customFields[field],
      },
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, reader.result as string],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addVariant = () => {
    if (!variantAttr || !variantValue) return;
    const newVariant: Variant = {
      id: Date.now(),
      variation: variantAttr,
      variantValue,
      sku: variantSKU || `VAR-${Date.now()}`,
      quantity: variantQty,
      price: variantPrice,
    };
    setForm((prev) => ({ ...prev, variants: [...prev.variants, newVariant] }));
    setVariantAttr("");
    setVariantValue("");
    setVariantSKU("");
    setVariantQty(1);
    setVariantPrice(0);
  };

  const removeVariant = (id: number) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((v) => v.id !== id),
    }));
  };

  const updateVariantQty = (id: number, delta: number) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((v) =>
        v.id === id ? { ...v, quantity: Math.max(0, v.quantity + delta) } : v
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "view") return;
    setSaving(true);
    try {
      const payload = { ...form };
      if (mode === "create") await apiService.post("Products", payload);
      else await apiService.put(`Products/${form.id}`, payload);
      navigate("/inventory/products");
    } catch (err) {
      setError("Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate("/inventory/products");
  };

  const customHeaderFields = () => (
    <div className="">
      <button
        onClick={handleBack}
        className="bg-blue-950 text-white px-4 py-2 rounded font-medium flex items-center gap-2 hover:bg-blue-800"
      >
        <i className="fa fa-arrow-left me-2"></i> Back to Product
      </button>
    </div>
  );

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
      </div>
    );

  return (
    <PageBase1
      title={
        mode === "create"
          ? "Create Product"
          : mode === "edit"
          ? "Edit Product"
          : "View Product"
      }
      description={`Manage product details for ${
        form.productName || "a new product"
      }`}
      icon="fa fa-plus-square"
      onRefresh={() => {
        if (mode !== "view") {
          setForm({
            id: 0,
            productName: "",
            productCode: "",
            category: "",
            price: 0,
            stockQuantity: 0,
            description: "",
            status: "In Stock",
          });
          setMode("create");
        }
      }}
      customHeaderFields={customHeaderFields}
    >
      <div className=" ">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. PRODUCT INFORMATION - FULLY RESTORED */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-orange-600">
                Product Information
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ALL YOUR ORIGINAL FIELDS ARE HERE */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Store *
                </label>
                <select
                  name="store"
                  value={form.store}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                >
                  <option>Select Store</option>
                  {stores.map((s) => (
                    <option key={s.id} value={s.storeName}>
                      {s.storeName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Warehouse *
                </label>
                <select
                  name="warehouse"
                  value={form.warehouse}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                >
                  <option>Select Warehouse</option>
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.warehouseName}>
                      {w.warehouseName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="productName"
                  value={form.productName}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">SKU *</label>
                <input
                  type="text"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Selling Type *
                </label>
                <select
                  name="sellingType"
                  value={form.sellingType}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                >
                  <option>Select</option>
                  <option>Retail</option>
                  <option>Wholesale</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                >
                  <option>Select Category</option>
                  {masterData.categories?.map((c: any) => (
                    <option key={c.id} value={c.categoryName}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Sub Category *
                </label>
                <select
                  name="subCategory"
                  value={form.subCategory}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                >
                  <option>Select Sub Category</option>
                  {subCategories.map((sc) => (
                    <option key={sc.id} value={sc.subCategory}>
                      {sc.subCategory}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Brand *
                </label>
                <select
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                >
                  <option>Select Brand</option>
                  {masterData.brands?.map((b: any) => (
                    <option key={b.id} value={b.brandName}>
                      {b.brandName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Barcode Symbology *
                </label>
                <select
                  name="barcodeSymbology"
                  value={form.barcodeSymbology}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                >
                  <option>CODE128</option>
                  <option>EAN13</option>
                  <option>UPC</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Item Barcode *
                </label>
                <input
                  type="text"
                  name="itemBarcode"
                  value={form.itemBarcode}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          {/* 2. PRICING & STOCKS - FULLY RESTORED + VARIABLE SUPPORT */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-orange-600">
                Pricing & Stocks
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Type *
                </label>
                <div className="flex gap-8">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="productType"
                      value="Single Product"
                      checked={form.productType === "Single Product"}
                      onChange={handleChange}
                      disabled={mode === "view"}
                      className="text-orange-500"
                    />
                    <span>Single Product</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="productType"
                      value="Variable Product"
                      checked={form.productType === "Variable Product"}
                      onChange={handleChange}
                      disabled={mode === "view"}
                      className="text-orange-500"
                    />
                    <span>Variable Product</span>
                  </label>
                </div>
              </div>

              {form.productType === "Variable Product" && (
                <div className="border-t pt-6 space-y-6">
                  <div className="flex gap-3 flex-wrap">
                    <select
                      value={variantAttr}
                      onChange={(e) => setVariantAttr(e.target.value)}
                      className="px-4 py-2 border rounded-md"
                      disabled={mode === "view"}
                    >
                      <option>Choose</option>
                      <option value="color">Color</option>
                      <option value="size">Size</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Value"
                      value={variantValue}
                      onChange={(e) => setVariantValue(e.target.value)}
                      className="px-4 py-2 border rounded-md"
                      disabled={mode === "view"}
                    />
                    <input
                      type="text"
                      placeholder="SKU"
                      value={variantSKU}
                      onChange={(e) => setVariantSKU(e.target.value)}
                      className="px-4 py-2 border rounded-md"
                      disabled={mode === "view"}
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={variantQty}
                      onChange={(e) =>
                        setVariantQty(parseInt(e.target.value) || 0)
                      }
                      className="w-24 px-4 py-2 border rounded-md"
                      disabled={mode === "view"}
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={variantPrice}
                      onChange={(e) =>
                        setVariantPrice(parseFloat(e.target.value) || 0)
                      }
                      className="w-32 px-4 py-2 border rounded-md"
                      disabled={mode === "view"}
                    />
                    <button
                      type="button"
                      onClick={addVariant}
                      disabled={mode === "view"}
                      className="px-4 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                    >
                      +
                    </button>
                  </div>

                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left">Variation</th>
                        <th className="px-4 py-3 text-left">Value</th>
                        <th className="px-4 py-3 text-left">SKU</th>
                        <th className="px-4 py-3 text-left">Qty</th>
                        <th className="px-4 py-3 text-left">Price</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.variants.map((v) => (
                        <tr key={v.id} className="border-b">
                          <td className="px-4 py-3">{v.variation}</td>
                          <td className="px-4 py-3">{v.variantValue}</td>
                          <td className="px-4 py-3">{v.sku}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateVariantQty(v.id, -1)}
                                disabled={mode === "view"}
                                className="w-8 h-8 rounded-full border"
                              >
                                -
                              </button>
                              <span className="w-12 text-center">
                                {v.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateVariantQty(v.id, 1)}
                                disabled={mode === "view"}
                                className="w-8 h-8 rounded-full border"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3">{v.price}</td>
                          <td className="px-4 py-3 flex gap-2">
                            <button type="button" className="text-green-600">
                              Check
                            </button>
                            <button type="button" className="text-blue-600">
                              Plus
                            </button>
                            <button
                              type="button"
                              onClick={() => removeVariant(v.id)}
                              disabled={mode === "view"}
                              className="text-red-600"
                            >
                              Trash
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {form.productType === "Single Product" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={form.quantity}
                      onChange={handleChange}
                      disabled={mode === "view"}
                      className="w-full px-4 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Price *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      disabled={mode === "view"}
                      className="w-full px-4 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tax Type *
                    </label>
                    <select
                      name="taxType"
                      value={form.taxType}
                      onChange={handleChange}
                      disabled={mode === "view"}
                      className="w-full px-4 py-2 border rounded-md"
                      required
                    >
                      <option>Select</option>
                      <option>GST</option>
                      <option>VAT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tax *
                    </label>
                    <select
                      name="tax"
                      value={form.tax}
                      onChange={handleChange}
                      disabled={mode === "view"}
                      className="w-full px-4 py-2 border rounded-md"
                      required
                    >
                      <option>Select</option>
                      <option>18%</option>
                      <option>12%</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Discount Type *
                    </label>
                    <select
                      name="discountType"
                      value={form.discountType}
                      onChange={handleChange}
                      disabled={mode === "view"}
                      className="w-full px-4 py-2 border rounded-md"
                      required
                    >
                      <option>Select</option>
                      <option>Percentage</option>
                      <option>Fixed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Discount Value *
                    </label>
                    <input
                      type="number"
                      name="discountValue"
                      value={form.discountValue}
                      onChange={handleChange}
                      disabled={mode === "view"}
                      className="w-full px-4 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium mb-1">
                      Quantity Alert *
                    </label>
                    <input
                      type="number"
                      name="quantityAlert"
                      value={form.quantityAlert}
                      onChange={handleChange}
                      disabled={mode === "view"}
                      className="w-full px-4 py-2 border rounded-md"
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. IMAGES - EXACT MATCH */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-orange-600">Images</h3>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-6 items-center">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-500"
                >
                  <i className="fa fa-plus text-3xl text-gray-400"></i>
                  <span className="text-sm text-gray-500 mt-2">Add Images</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {form.images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={img}
                      alt={`Product ${i + 1}`}
                      className="w-32 h-32 object-cover rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full text-xs opacity-0 group-hover:opacity-100 transition"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. CUSTOM FIELDS - EXACT MATCH */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-orange-600">
                Custom Fields
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex gap-8 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.customFields.warranties}
                    onChange={() => handleCustomFieldToggle("warranties")}
                    disabled={mode === "view"}
                  />
                  <span>Warranties</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.customFields.manufacturer}
                    onChange={() => handleCustomFieldToggle("manufacturer")}
                    disabled={mode === "view"}
                  />
                  <span>Manufacturer</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.customFields.expiry}
                    onChange={() => handleCustomFieldToggle("expiry")}
                    disabled={mode === "view"}
                  />
                  <span>Expiry</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {form.customFields.warranties && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Warranty *
                    </label>
                    <select
                      name="warranty"
                      value={form.warranty}
                      onChange={handleChange}
                      disabled={mode === "view"}
                      className="w-full px-4 py-2 border rounded-md"
                    >
                      <option>Select</option>
                      <option>1 Year</option>
                      <option>2 Years</option>
                    </select>
                  </div>
                )}
                {form.customFields.manufacturer && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Manufacturer *
                      </label>
                      <input
                        type="text"
                        name="manufacturer"
                        value={form.manufacturer}
                        onChange={handleChange}
                        disabled={mode === "view"}
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Manufactured Date *
                      </label>
                      <input
                        type="text"
                        placeholder="dd/mm/yyyy"
                        name="manufacturedDate"
                        value={form.manufacturedDate}
                        onChange={handleChange}
                        disabled={mode === "view"}
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    </div>
                  </>
                )}
                {form.customFields.expiry && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Expiry On *
                    </label>
                    <input
                      type="text"
                      placeholder="dd/mm/yyyy"
                      name="expiryDate"
                      value={form.expiryDate}
                      onChange={handleChange}
                      disabled={mode === "view"}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* FINAL BUTTONS - EXACT MATCH */}
          <div className="flex justify-end gap-4 pt-8 pb-10">
            <button
              type="button"
              onClick={handleBack}
              className="bg-gray-300 hover:bg-gray-200 text-gray-600 font-medium py-1.5 px-3 rounded-lg text-sm transition-colors"
            >
              <i className="fa fa-arrow-left me-2"></i> Cancel
            </button>
            {mode !== "view" && (
              <button
                type="submit"
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-1.5 px-3 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                <i className="fa fa-save me-2"></i>{" "}
                {saving
                  ? "Saving..."
                  : mode === "create"
                  ? "Add Product"
                  : "Update Product"}
              </button>
            )}
          </div>
        </form>
      </div>
    </PageBase1>
  );
}
