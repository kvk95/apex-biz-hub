/* -------------------------------------------------
   AddSalesModal
   ------------------------------------------------- */
import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { ProductSearchCell } from "@/components/Search/ProductSearchCell";
import { Product } from "@/types/Product";
import {
    ORDER_STATUSES,
    ORDER_TYPES,
} from "@/constants/constants";

type Customer = {
    id: number;
    name: string;
};

type Supplier = {
    id: number;
    supplierName: string;
};

type SaleItem = {
    productId: number;
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
    orderType: (typeof ORDER_TYPES)[number];
}

type NumericSaleItemField = "quantity" | "price" | "discount" | "tax" | "total";

const AddSalesModal: React.FC<AddSalesModalProps> = ({
    isOpen,
    onClose,
    onSave,
    orderType,
}) => {
    /* ---------- state ---------- */
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [saleItems, setSaleItems] = useState<SaleItem[]>([
        {
            productId: 0,
            productName: "",
            sku: "",
            quantity: 1,
            price: 0,
            discount: 0,
            tax: 0,
            taxAmount: 0,
            total: 0,
        },
    ]);

    const [formData, setFormData] = useState({
        customerId: "",
        date: "",
        supplierId: "",
        orderTax: 0,
        discount: 0,
        shipping: 0,
        status: "Inprogress" as (typeof ORDER_STATUSES)[number],
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    /* ---------- fetch data ---------- */
    useEffect(() => {
        if (!isOpen) {
            resetForm();
            return;
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
                    console.log("AddSalesModal fetch Customers:", custRes.result);
                }
                if (suppRes?.status?.code === "S") {
                    setSuppliers(suppRes.result);
                    console.log("AddSalesModal fetch Suppliers:", suppRes.result);
                }
                if (prodRes?.status?.code === "S") {
                    setProducts(prodRes.result);
                    setFilteredProducts(prodRes.result);
                    console.log("AddSalesModal fetch Products:", prodRes.result);
                }
            } catch (err) {
                console.error("AddSalesModal fetch error:", err);
            }
        };

        fetchAll();
    }, [isOpen]);

    /* ---------- helpers ---------- */
    const resetForm = () => {
        setFormData({
            customerId: "",
            supplierId: "",
            date: "",
            orderTax: 0,
            discount: 0,
            shipping: 0,
            status: "Inprogress" as (typeof ORDER_STATUSES)[number],
        });
        setSaleItems([
            {
                productId: 0,
                productName: "",
                sku: "",
                quantity: 1,
                price: 0,
                discount: 0,
                tax: 0,
                taxAmount: 0,
                total: 0,
            },
        ]);
        setErrors({});
        console.log("AddSalesModal resetForm");
    };

    /* ---------- product search ---------- */
    const handleProductSearch = (query: string, index: number) => {
        const filtered = products.filter(
            (p) =>
                p.productName.toLowerCase().includes(query.toLowerCase()) ||
                p.sku.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(filtered);

        const updated = [...saleItems];
        updated[index].productName = query;
        updated[index].productId = 0;
        setSaleItems(updated);
        console.log("AddSalesModal handleProductSearch:", { query, index });
    };

    /* ---------- item logic ---------- */
    const addItem = () => {
        setSaleItems([
            ...saleItems,
            {
                productId: 0,
                productName: "",
                sku: "",
                quantity: 1,
                price: 0,
                discount: 0,
                tax: 0,
                taxAmount: 0,
                total: 0,
            },
        ]);
        console.log("AddSalesModal addItem");
    };

    const removeItem = (index: number) => {
        setSaleItems(saleItems.filter((_, i) => i !== index));
        console.log("AddSalesModal removeItem:", { index });
    };

    const handleProductSelect = (index: number, product: Product) => {
        const updated = [...saleItems];
        const price = Number(product.price) || 0;
        const discount = Number(product.discount) || 0;
        const tax = Number(product.tax) || 0;
        const quantity = updated[index].quantity || 1;

        const subtotal = price * quantity;
        const discountAmount = (subtotal * discount) / 100;
        const taxable = subtotal - discountAmount;
        const taxAmount = (taxable * tax) / 100;
        const total = taxable + taxAmount;

        updated[index] = {
            ...updated[index],
            productId: product.id,
            productName: product.productName,
            sku: product.sku,
            price,
            discount,
            tax,
            taxAmount: parseFloat(taxAmount.toFixed(2)),
            total: parseFloat(total.toFixed(2)),
        };

        setSaleItems(updated);
        setFilteredProducts(products);
        console.log("AddSalesModal handleProductSelect:", { index, product });
    };

    const handleItemChange = (
        index: number,
        field: NumericSaleItemField,
        value: string
    ) => {
        const updated = [...saleItems];
        const numericValue = Number(value) || 0;
        updated[index][field] = numericValue;

        const product = updated[index];
        const price = Number(product.price) || 0;
        const quantity = Number(product.quantity) || 0;
        const discount = Number(product.discount) || 0;
        const tax = Number(product.tax) || 0;

        const subtotal = price * quantity;
        const discountAmount = (subtotal * discount) / 100;
        const taxable = subtotal - discountAmount;
        const taxAmount = (taxable * tax) / 100;
        const total = taxable + taxAmount;

        updated[index].taxAmount = parseFloat(taxAmount.toFixed(2));
        updated[index].total = parseFloat(total.toFixed(2));

        setSaleItems(updated);
        console.log("AddSalesModal handleItemChange:", { index, field, value });
    };

    /* ---------- totals ---------- */
    const totals = {
        subTotal: saleItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        orderTax: formData.orderTax,
        discount: formData.discount,
        shipping: formData.shipping,
    };

    const taxAmount = (totals.subTotal * totals.orderTax) / 100;
    const discountAmount = (totals.subTotal * totals.discount) / 100;
    const grandTotal =
        totals.subTotal - discountAmount + taxAmount + totals.shipping;

    /* ---------- validation ---------- */
    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.customerId) newErrors.customerId = "Customer is required";
        if (!formData.date) newErrors.date = "Date is required";
        if (!formData.supplierId) newErrors.supplierId = "Supplier is required";

        const emptyProducts = saleItems.filter((i) => !i.productId || i.productId === 0);
        if (emptyProducts.length > 0)
            newErrors.items = "Product is required for all rows";

        if (!formData.status) newErrors.status = "Status required";

        setErrors(newErrors);
        console.log("AddSalesModal validate:", { valid: Object.keys(newErrors).length === 0, newErrors });
        return Object.keys(newErrors).length === 0;
    };

    /* ---------- save ---------- */
    const handleSave = () => {
        if (!validate()) return;

        const customerName =
            customers.find((c) => c.id === Number(formData.customerId))?.name || "";
        const supplierName =
            suppliers.find((s) => s.id === Number(formData.supplierId))?.supplierName || "";

        const newOrder = {
            id: Date.now(),
            orderId: "S" + Math.floor(1000 + Math.random() * 9000),
            orderType,
            date: formData.date,
            customerId: formData.customerId,
            supplierId: formData.supplierId,
            customerName,
            supplierName,
            paymentMethod: "Cash",
            status: formData.status,
            items: saleItems,
            totals: {
                subTotal: totals.subTotal,
                tax: totals.orderTax,
                discount: totals.discount,
                shipping: totals.shipping,
                grandTotal: parseFloat(grandTotal.toFixed(2)),
            },
        };

        onSave(newOrder);
        onClose();
        console.log("AddSalesModal handleSave:", { newOrder });
    };

    const handleFormChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            const newErrors = { ...errors };
            delete newErrors[field];
            setErrors(newErrors);
        }
        console.log("AddSalesModal handleFormChange:", { field, value });
    };

    if (!isOpen) return null;

    /* ---------- render ---------- */
    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-y-auto">
            <div className="bg-white w-full max-w-6xl rounded-xl shadow-lg p-6 relative">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Add {orderType === "POS" ? "POS" : "Online"} Sale
                    </h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-red-600">
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </button>
                </div>

                {/* Customer, Date, Supplier */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="text-sm font-medium">Customer Name *</label>
                        <select
                            className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.customerId ? "border-red-500" : ""}`}
                            value={formData.customerId}
                            onChange={(e) => handleFormChange("customerId", e.target.value)}
                        >
                            <option value="">Select</option>
                            {customers.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        {errors.customerId && (
                            <p className="text-xs text-red-500">{errors.customerId}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium">Date *</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleFormChange("date", e.target.value)}
                            className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.date ? "border-red-500" : ""}`}
                        />
                        {errors.date && (
                            <p className="text-xs text-red-500">{errors.date}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium">Supplier *</label>
                        <select
                            className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.supplierId ? "border-red-500" : ""}`}
                            value={formData.supplierId}
                            onChange={(e) => handleFormChange("supplierId", e.target.value)}
                        >
                            <option value="">Select</option>
                            {suppliers.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.supplierName}
                                </option>
                            ))}
                        </select>
                        {errors.supplierId && (
                            <p className="text-xs text-red-500">{errors.supplierId}</p>
                        )}
                    </div>
                </div>

                {/* Product Table */}
                <table className="w-full border text-sm mb-3">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-3 py-2 text-left">Product</th>
                            <th className="px-3 py-2 text-center">SKU</th>
                            <th>Qty</th>
                            <th>Price($)</th>
                            <th>Discount(%)</th>
                            <th>Tax(%)</th>
                            <th>Tax Amt($)</th>
                            <th>Total($)</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {saleItems.map((item, idx) => (
                            <tr key={idx} className="border-t">
                                <td className="px-3 py-2 relative">
                                    <ProductSearchCell
                                        value={item.productName}
                                        onSearch={(query) => handleProductSearch(query, idx)}
                                        onSelect={(product) => handleProductSelect(idx, product)}
                                        products={filteredProducts}
                                    />
                                </td>
                                <td className="text-center">{item.sku || "-"}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            handleItemChange(idx, "quantity", e.target.value)
                                        }
                                        className="border rounded px-2 py-1 w-16 text-right"
                                        min="1"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={item.price}
                                        onChange={(e) =>
                                            handleItemChange(idx, "price", e.target.value)
                                        }
                                        className="border rounded px-2 py-1 w-20 text-right"
                                        step="0.01"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={item.discount}
                                        onChange={(e) =>
                                            handleItemChange(idx, "discount", e.target.value)
                                        }
                                        className="border rounded px-2 py-1 w-20 text-right"
                                        step="0.01"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={item.tax}
                                        onChange={(e) =>
                                            handleItemChange(idx, "tax", e.target.value)
                                        }
                                        className="border rounded px-2 py-1 w-20 text-right"
                                        step="0.01"
                                    />
                                </td>
                                <td className="text-right pr-3">
                                    {item.taxAmount.toFixed(2)}
                                </td>
                                <td className="text-right pr-3">{item.total.toFixed(2)}</td>
                                <td className="text-center">
                                    <button
                                        onClick={() => removeItem(idx)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <i className="fa fa-trash" aria-hidden="true"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {errors.items && (
                    <p className="text-xs text-red-500 mb-2">{errors.items}</p>
                )}

                <button
                    onClick={addItem}
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm mb-4"
                >
                    <i className="fa fa-plus-circle mr-1" aria-hidden="true"></i> Add
                    Product
                </button>

                {/* Totals */}
                <div className="grid grid-cols-2 gap-6 mt-4">
                    <div></div>
                    <div className="bg-gray-50 rounded-lg p-4 text-right space-y-2 text-sm">
                        <p>Order Tax: ${totals.orderTax.toFixed(2)}</p>
                        <p>Discount: ${totals.discount.toFixed(2)}</p>
                        <p>Shipping: ${totals.shipping.toFixed(2)}</p>
                        <p className="text-lg font-semibold">
                            Grand Total: ${grandTotal.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Footer Inputs */}
                <div className="grid grid-cols-4 gap-4 mt-6">
                    {["orderTax", "discount", "shipping"].map((f) => (
                        <div key={f}>
                            <label className="text-sm font-medium">
                                {f.charAt(0).toUpperCase() + f.slice(1)} *
                            </label>
                            <input
                                type="number"
                                value={
                                    formData[f as "orderTax" | "discount" | "shipping"]
                                }
                                onChange={(e) =>
                                    handleFormChange(f, Number(e.target.value))
                                }
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                                step="0.01"
                            />
                        </div>
                    ))}
                    <div>
                        <label className="text-sm font-medium">Status *</label>
                        <select
                            value={formData.status}
                            onChange={(e) =>
                                handleFormChange("status", e.target.value as any)
                            }
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        >
                            {ORDER_STATUSES.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-6 flex justify-end gap-3 border-t pt-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100 text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddSalesModal;