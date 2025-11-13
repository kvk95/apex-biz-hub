/* -------------------------------------------------
   AddSalesModal – PRODUCTION FINAL VERSION
   EXACTLY LIKE YOUR SCREENSHOT
   ------------------------------------------------- */
import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { AutoCompleteTextBox } from "@/components/Search/AutoCompleteTextBox";
import { Product } from "@/types/Product";
import { ORDER_STATUSES, ORDER_TYPES } from "@/constants/constants";

type Customer = { id: number; name: string };
type Supplier = { id: number; supplierName: string };

type SaleItem = {
  productId: string | number;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  taxAmount: number;
  total: number;
};

interface AddSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  orderType: (typeof ORDER_TYPES)[number];
}

type CustomerOption = { id: number; display: string };
type ProductOption = { id: number; display: string; extra: { SKU: string; Price: string } };

const CustomerAutoComplete = AutoCompleteTextBox<CustomerOption>;
const ProductAutoComplete = AutoCompleteTextBox<ProductOption>;

const AddSalesModal: React.FC<AddSalesModalProps> = ({
  isOpen,
  onClose,
  onSave,
  orderType,
  initialData,
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    date: "",
    supplierId: "",
    supplierName: "",
    orderTax: 0,
    discount: 0,
    shipping: 0,
    status: "Inprogress" as (typeof ORDER_STATUSES)[number],
  });

  useEffect(() => {
    if (!isOpen) return;

    const today = new Date().toISOString().split("T")[0];

    if (initialData) {
      setFormData({
        customerId: initialData.customerId || "",
        customerName: initialData.customerName || "",
        date: initialData.date || today,
        supplierId: initialData.supplierId || "",
        supplierName: initialData.supplierName || "",
        orderTax: Number(initialData.orderTax) || 0,
        discount: Number(initialData.discount) || 0,
        shipping: Number(initialData.shipping) || 0,
        status: (initialData.status as any) || "Inprogress",
      });

      setSaleItems(
        initialData.items?.map((i: any) => ({
          productId: i.productId || "",
          productName: i.productName || "",
          sku: i.sku || "",
          quantity: Number(i.quantity) || 1,
          price: Number(i.unitCost) || Number(i.purchasePrice) || 0,
          discount: Number(i.discount) || 0,
          tax: Number(i.taxPercent) || 0,
          taxAmount: Number(i.taxAmount) || 0,
          total: Number(i.totalCost) || 0,
        })) || []
      );
    } else {
      setFormData(prev => ({ ...prev, date: today }));
      setSaleItems([{
        productId: "", productName: "", sku: "", quantity: 1,
        price: 0, discount: 0, tax: 0, taxAmount: 0, total: 0
      }]);
    }

    const fetchAll = async () => {
      try {
        const [custRes, suppRes, prodRes] = await Promise.all([
          apiService.get<any>("Customers"),
          apiService.get<any>("Suppliers"),
          apiService.get<any>("Products"),
        ]);
        if (custRes?.status?.code === "S") {
          setCustomers(custRes.result);
          setFilteredCustomers(custRes.result);
        }
        if (suppRes?.status?.code === "S") {
          setSuppliers(suppRes.result);
        }
        if (prodRes?.status?.code === "S") {
          setProducts(prodRes.result);
          setFilteredProducts(prodRes.result);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, [isOpen, initialData]);

  const recalculateItem = (item: SaleItem): SaleItem => {
    const subtotal = item.price * item.quantity;
    const discountAmt = (subtotal * item.discount) / 100;
    const taxable = subtotal - discountAmt;
    const taxAmt = (taxable * item.tax) / 100;
    const total = taxable + taxAmt;
    return {
      ...item,
      taxAmount: Number(taxAmt.toFixed(2)),
      total: Number(total.toFixed(2)),
    };
  };

  const totals = useMemo(() => {
    const subTotal = saleItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const orderTaxAmt = (subTotal * Number(formData.orderTax)) / 100;
    const discountAmt = (subTotal * Number(formData.discount)) / 100;
    const grandTotal = subTotal - discountAmt + orderTaxAmt + Number(formData.shipping);
    return {
      subTotal,
      orderTaxAmt,
      discountAmt,
      grandTotal: Number(grandTotal.toFixed(2)),
    };
  }, [saleItems, formData]);

  const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const selected = suppliers.find(s => s.id.toString() === id);
    setFormData(prev => ({
      ...prev,
      supplierId: id,
      supplierName: selected?.supplierName || "",
    }));
  };

  const handleSave = () => {
    const savedData = {
      ...formData,
      orderType: orderType,
      items: saleItems,
      grandTotal: totals.grandTotal,
      paid: initialData?.paid || 0,
      due: totals.grandTotal - (initialData?.paid || 0),
      paymentStatus: initialData?.paymentStatus || "Unpaid",
    };
    onSave(savedData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />

      {/* MODAL - EXACTLY LIKE SCREENSHOT */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-screen flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* GRAY HEADER */}
          <div className="bg-gray-100 border-b border-gray-300 px-6 py-4 flex justify-between items-center rounded-t-lg">
            <h2 className="text-xl font-semibold text-gray-800">
              {initialData ? "Edit "
                : "Add "}
              {orderType === "POS" ? "POS" : "Online"} Sale
            </h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 text-3xl font-light"
            >
              ×
            </button>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">

              {/* Top Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                  <CustomerAutoComplete
                    value={formData.customerName}
                    onSearch={q => {
                      const filtered = customers.filter(c => c.name.toLowerCase().includes(q.toLowerCase()));
                      setFilteredCustomers(filtered);
                      setFormData(prev => ({ ...prev, customerName: q }));
                    }}
                    onSelect={sel => setFormData(prev => ({ ...prev, customerId: sel.id.toString(), customerName: sel.display }))}
                    items={filteredCustomers.map(c => ({ id: c.id, display: c.name }))}
                    placeholder="Search customer..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier *</label>
                  <select
                    value={formData.supplierId}
                    onChange={handleSupplierChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.supplierName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table */}
              <table className="w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left py-3 px-4 border-b">Product</th>
                    <th className="text-center py-3 px-4 border-b">SKU</th>
                    <th className="text-center py-3 px-4 border-b">Qty</th>
                    <th className="text-center py-3 px-4 border-b">Price(₹)</th>
                    <th className="text-center py-3 px-4 border-b">Discount(%)</th>
                    <th className="text-center py-3 px-4 border-b">Tax(%)</th>
                    <th className="text-right py-3 px-4 border-b">Tax Amt(₹)</th>
                    <th className="text-right py-3 px-4 border-b">Total(₹)</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {saleItems.map((item, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="py-3 px-4">
                        <ProductAutoComplete
                          value={item.productName}
                          onSearch={q => {
                            const filtered = products.filter(p =>
                              p.productName.toLowerCase().includes(q.toLowerCase()) ||
                              p.sku.toLowerCase().includes(q.toLowerCase())
                            );
                            setFilteredProducts(filtered);
                            const updated = [...saleItems];
                            updated[idx].productName = q;
                            updated[idx].productId = "";
                            setSaleItems(updated.map(recalculateItem));
                          }}
                          onSelect={sel => {
                            const prod = products.find(p => p.id === sel.id);
                            if (prod) {
                              const updated = [...saleItems];
                              updated[idx] = {
                                ...updated[idx],
                                productId: prod.id,
                                productName: prod.productName,
                                sku: prod.sku,
                                price: Number(prod.price) || 0,
                                discount: 0,
                                tax: Number(prod.tax) || 0,
                              };
                              setSaleItems(updated.map(recalculateItem));
                            }
                          }}
                          items={filteredProducts.map(p => ({
                            id: p.id,
                            display: p.productName,
                            extra: { SKU: p.sku, Price: `₹${p.price}` },
                          }))}
                          placeholder="Search product..."
                        />
                      </td>
                      <td className="text-center py-3">{item.sku || "-"}</td>
                      <td className="text-center py-3">
                        <input type="number" value={item.quantity} min="1"
                          onChange={e => {
                            const num = Number(e.target.value) || 1;
                            setSaleItems(prev => {
                              const updated = [...prev];
                              updated[idx].quantity = num;
                              return updated.map(recalculateItem);
                            });
                          }}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-right"
                        />
                      </td>
                      <td className="text-center py-3">
                        <input type="number" value={item.price} step="0.01"
                          onChange={e => {
                            const num = Number(e.target.value) || 0;
                            setSaleItems(prev => {
                              const updated = [...prev];
                              updated[idx].price = num;
                              return updated.map(recalculateItem);
                            });
                          }}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-right"
                        />
                      </td>
                      <td className="text-center py-3">
                        <input type="number" value={item.discount} step="0.01"
                          onChange={e => {
                            const num = Number(e.target.value) || 0;
                            setSaleItems(prev => {
                              const updated = [...prev];
                              updated[idx].discount = num;
                              return updated.map(recalculateItem);
                            });
                          }}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-right"
                        />
                      </td>
                      <td className="text-center py-3">
                        <input type="number" value={item.tax} step="0.01"
                          onChange={e => {
                            const num = Number(e.target.value) || 0;
                            setSaleItems(prev => {
                              const updated = [...prev];
                              updated[idx].tax = num;
                              return updated.map(recalculateItem);
                            });
                          }}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-right"
                        />
                      </td>
                      <td className="text-right pr-4 py-3">₹{item.taxAmount.toFixed(2)}</td>
                      <td className="text-right pr-4 py-3 font-medium">₹{item.total.toFixed(2)}</td>
                      <td className="text-center py-3">
                        <button onClick={() => setSaleItems(prev => prev.filter((_, i) => i !== idx))}
                          className="text-red-600 hover:text-red-800">
                          <i className="fa fa-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                onClick={() => setSaleItems(prev => [...prev, {
                  productId: "", productName: "", sku: "", quantity: 1,
                  price: 0, discount: 0, tax: 0, taxAmount: 0, total: 0
                }])}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                <i className="fa fa-plus-circle" /> Add Product
              </button>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-80 bg-gray-50 p-4 rounded space-y-2 text-sm">
                  <div className="flex justify-between"><span>Order Tax:</span> <span>₹{totals.orderTaxAmt.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Discount:</span> <span>₹{totals.discountAmt.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Shipping:</span> <span>₹{Number(formData.shipping).toFixed(2)}</span></div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Grand Total:</span> <span>₹{totals.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Fields */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {["orderTax", "discount", "shipping"].map(f => (
                  <div key={f}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {f === "orderTax" ? "OrderTax *" : f.charAt(0).toUpperCase() + f.slice(1) + " *"}
                    </label>
                    <input
                      type="number"
                      value={formData[f as keyof typeof formData]}
                      onChange={e => setFormData(prev => ({ ...prev, [f]: Number(e.target.value) || 0 }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      step="0.01"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  >
                    {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER - BLUE SUBMIT */}
          <div className="bg-white border-t border-gray-300 px-6 py-4 flex justify-end gap-4 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddSalesModal;