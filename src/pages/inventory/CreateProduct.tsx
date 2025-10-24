import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";
import {
  STOCK_STATUSES,
  DISCOUNT_TYPES,
  TAX_OPTIONS,
  TAX_TYPE_OPTIONS,
  CATEGORIES,
} from "@/constants/constants";

interface Product {
  id: number;
  productName: string;
  productCode: string;
  category: string;
  price: number;
  stockQuantity: number;
  description: string;
  status: (typeof STOCK_STATUSES)[number];
  productType: "Single Product";
  quantity: 0;
  taxType: "";
  tax: "";
  discountType: "";
  discountValue: 0;
  quantityAlert: 0;
}

const images = [];

export default function ProductDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"create" | "edit" | "view">("create");
  const [form, setForm] = useState<Product>({
    id: 0,
    productName: "",
    productCode: "",
    category: "",
    price: 0,
    stockQuantity: 0,
    description: "",
    status: "In Stock",
    productType: "Single Product",
    quantity: 0,
    taxType: "",
    tax: "",
    discountType: "",
    discountValue: 0,
    quantityAlert: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state?.productRecord) {
      setForm(state.productRecord);
      setMode(state.mode === "view" ? "view" : "edit");
    }
  }, [state]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stockQuantity"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "view") return;
    if (
      !form.productName.trim() ||
      !form.productCode.trim() ||
      !form.category ||
      form.price < 0 ||
      form.stockQuantity < 0
    ) {
      alert(
        "Please fill all required fields and ensure price and stock quantity are non-negative."
      );
      return;
    }

    setLoading(true);
    try {
      if (mode === "create") {
        await apiService.post("Products", form);
      } else if (mode === "edit") {
        await apiService.put(`Products/${form.id}`, form);
      }
      navigate("/inventory/products");
    } catch (err) {
      setError("Failed to save product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/inventory/products");
  };

  const generateReport = () => {
    alert(`Product Report:\n\n${JSON.stringify(form, null, 2)}`);
  };

  const isDisabled = mode === "view";

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
      icon="fa fa-box"
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
      onReport={generateReport}
    >
      <div
        className="min-h-screen bg-card rounded shadow-md border border-border p-6"
        role="region"
        aria-label="Product details"
      >
        <div className="flex justify-between items-center px-6 py-3 bg-white sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-gray-900">
            {mode === "create"
              ? "Create New Product"
              : mode === "edit"
              ? `Edit Product: ${form.productName}`
              : `View Product: ${form.productName}`}
            <p className="text-xs text-muted-foreground">
              Generated on: October 24, 2025, 4:33 PM IST
            </p>
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={handleBack}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-1.5 px-3 rounded-lg text-sm transition-colors"
            >
              <i className="fa fa-arrow-left me-2"></i> Back
            </button>
            <button
              onClick={generateReport}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-1.5 px-3 rounded-lg text-sm transition-colors"
            >
              <i className="fa fa-print me-2"></i> Print / Report
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <section className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Product Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="store"
                  className="block text-sm font-medium mb-1"
                >
                  Store <span className="text-destructive">*</span>
                </label>
                <select
                  id="store"
                  name="store"
                  value={form.store}
                  onChange={handleInputChange}
                  disabled={isDisabled}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required={!isDisabled}
                  aria-label="Select store"
                >
                  <option value="">Select Store</option>
                  {/* Add store options */}
                </select>
              </div>

              <div>
                <label
                  htmlFor="warehouse"
                  className="block text-sm font-medium mb-1"
                >
                  Warehouse <span className="text-destructive">*</span>
                </label>
                <select
                  id="warehouse"
                  name="warehouse"
                  value={form.warehouse}
                  onChange={handleInputChange}
                  disabled={isDisabled}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required={!isDisabled}
                  aria-label="Select warehouse"
                >
                  <option value="">Select Warehouse</option>
                  {/* Add warehouse options */}
                </select>
              </div>

              <div>
                <label
                  htmlFor="productName"
                  className="block text-sm font-medium mb-1"
                >
                  Product Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={form.productName}
                  onChange={handleInputChange}
                  disabled={isDisabled}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter product name"
                  required={!isDisabled}
                  aria-label="Enter product name"
                />
              </div>

              <div>
                <label
                  htmlFor="slug"
                  className="block text-sm font-medium mb-1"
                >
                  Slug <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={form.slug}
                  onChange={handleInputChange}
                  disabled={isDisabled}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter slug"
                  required={!isDisabled}
                  aria-label="Enter slug"
                />
              </div>

              <div>
                <label htmlFor="sku" className="block text-sm font-medium mb-1">
                  SKU <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={form.sku}
                  onChange={handleInputChange}
                  disabled={isDisabled}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter SKU"
                  required={!isDisabled}
                  aria-label="Enter SKU"
                />
              </div>

              <div>
                <label
                  htmlFor="sellingType"
                  className="block text-sm font-medium mb-1"
                >
                  Selling Type <span className="text-destructive">*</span>
                </label>
                <select
                  id="sellingType"
                  name="sellingType"
                  value={form.sellingType}
                  onChange={handleInputChange}
                  disabled={isDisabled}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required={!isDisabled}
                  aria-label="Select selling type"
                >
                  <option value="">Select Selling Type</option>
                  {/* Add selling type options */}
                </select>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium mb-1"
                >
                  Category <span className="text-destructive">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  disabled={isDisabled}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required={!isDisabled}
                  aria-label="Select product category"
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="subCategory"
                  className="block text-sm font-medium mb-1"
                >
                  Sub Category <span className="text-destructive">*</span>
                </label>
                <select
                  id="subCategory"
                  name="subCategory"
                  value={form.subCategory}
                  onChange={handleInputChange}
                  disabled={isDisabled}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required={!isDisabled}
                  aria-label="Select sub category"
                >
                  <option value="">Select Sub Category</option>
                  {/* Add sub category options */}
                </select>
              </div>

              <div>
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium mb-1"
                >
                  Brand <span className="text-destructive">*</span>
                </label>
                <select
                  id="brand"
                  name="brand"
                  value={form.brand}
                  onChange={handleInputChange}
                  disabled={isDisabled}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required={!isDisabled}
                  aria-label="Select brand"
                >
                  <option value="">Select Brand</option>
                  {/* Add brand options */}
                </select>
              </div>

              <div>
                <label
                  htmlFor="barcodeSymbology"
                  className="block text-sm font-medium mb-1"
                >
                  Barcode Symbology <span className="text-destructive">*</span>
                </label>
                <select
                  id="barcodeSymbology"
                  name="barcodeSymbology"
                  value={form.barcodeSymbology}
                  onChange={handleInputChange}
                  disabled={isDisabled}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required={!isDisabled}
                  aria-label="Select barcode symbology"
                >
                  <option value="">Select Barcode Symbology</option>
                  {/* Add barcode symbology options */}
                </select>
              </div>

              <div>
                <label
                  htmlFor="itemBarcode"
                  className="block text-sm font-medium mb-1"
                >
                  Item Barcode <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="itemBarcode"
                  name="itemBarcode"
                  value={form.itemBarcode}
                  onChange={handleInputChange}
                  disabled={isDisabled}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter item barcode"
                  required={!isDisabled}
                  aria-label="Enter item barcode"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  disabled={isDisabled}
                  rows={3}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter product description"
                  aria-label="Enter product description"
                />
              </div>
            </div>
          </section>

          {/* Pricing and Inventory Section */}
          <section className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Pricing and Inventory
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label className="block text-base font-medium">
                  Product Type <span className="text-red-600">*</span>
                </label>
                <div className="flex items-center gap-8">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="productType"
                      value="Single Product"
                      checked={form.productType === "Single Product"}
                      onChange={handleInputChange}
                      className="accent-orange-500 w-5 h-5 mr-2"
                      required
                    />
                    <span className="text-gray-700 font-medium">
                      Single Product
                    </span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="productType"
                      value="Variable Product"
                      checked={form.productType === "Variable Product"}
                      onChange={handleInputChange}
                      className="accent-gray-400 w-5 h-5 mr-2"
                    />
                    <span className="text-gray-700 font-medium">
                      Variable Product
                    </span>
                  </label>
                </div>
              </div>
              {/* Grid Inputs */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-medium mb-1">
                    Quantity <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min={0}
                    value={form.quantity}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
                    placeholder="Enter quantity"
                    required
                  />
                </div>
                <div>
                  <label className="block text-base font-medium mb-1">
                    Price <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    min={0}
                    value={form.price}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
                    placeholder="Enter price"
                    required
                  />
                </div>
                <div>
                  <label className="block text-base font-medium mb-1">
                    Tax Type <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="taxType"
                    value={form.taxType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white"
                    required
                  >
                    <option value="">Select</option>
                    {TAX_TYPE_OPTIONS.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-base font-medium mb-1">
                    Tax <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="tax"
                    value={form.tax}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white"
                    required
                  >
                    <option value="">Select</option>
                    {TAX_OPTIONS.map((tax) => (
                      <option key={tax} value={tax}>
                        {tax}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-base font-medium mb-1">
                    Discount Type <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="discountType"
                    value={form.discountType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white"
                    required
                  >
                    <option value="">Select</option>
                    {DISCOUNT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-base font-medium mb-1">
                    Discount Value <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    name="discountValue"
                    min={0}
                    value={form.discountValue}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
                    placeholder="Enter discount value"
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-base font-medium mb-1">
                  Quantity Alert <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  name="quantityAlert"
                  min={0}
                  value={form.quantityAlert}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
                  placeholder="Enter minimum quantity for alert"
                  required
                />
              </div>
            </div>
          </section>

          <section className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <i className="fa fa-image text-[#ce1126]" />
              Images
            </h2>
            <div className="flex items-center space-x-4">
              <div className="border-dashed border-2 border-gray-300 p-6 w-32 h-32 flex justify-center items-center">
                <span className="text-gray-400">Add Images</span>
              </div>
              <div className="flex space-x-2">
                <div className="relative w-32 h-32 bg-gray-200">
                  <img
                    src="https://via.placeholder.com/150"
                    alt="product"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs">
                    X
                  </button>
                </div>
                <div className="relative w-32 h-32 bg-gray-200">
                  <img
                    src="https://via.placeholder.com/150"
                    alt="product"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs">
                    X
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Custom Fields
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Warranty *
                </label>
                <select className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                  <option>Select</option>
                  {/* Add options here */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Manufactured Date *
                </label>
                <input
                  type="text"
                  placeholder="dd/mm/yyyy"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Manufacturer *
                </label>
                <input
                  type="text"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Expiry On *
                </label>
                <input
                  type="text"
                  placeholder="dd/mm/yyyy"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-300">
            <button
              type="button"
              onClick={handleBack}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-1.5 px-3 rounded-lg text-sm transition-colors"
            >
              <i className="fa fa-arrow-left me-2"></i> Back
            </button>
            {!isDisabled && (
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-1.5 px-3 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                <i className="fa fa-save me-2"></i>{" "}
                {mode === "create" ? "Save" : "Update"}
              </button>
            )}
          </div>
        </form>
      </div>
    </PageBase1>
  );
}
