/* -------------------------------------------------
   SaleDetailModal – PRODUCTION FINAL VERSION
   EXACTLY LIKE YOUR SCREENSHOT (GRAY HEADER + BLUE BUTTONS)
   ------------------------------------------------- */
import React, { useRef } from "react";
import { format } from "date-fns";
import QRCode from "react-qr-code";

interface SaleDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: any;
}

const SaleDetailModal: React.FC<SaleDetailModalProps> = ({ isOpen, onClose, order }) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const printContent = printRef.current;
        if (!printContent) return;

        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${order.reference}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; background: white; }
            .container { max-width: 800px; margin: 0 auto; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background: #f3f4f6; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">${printContent.innerHTML}</div>
        </body>
      </html>
    `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    if (!isOpen || !order) return null;

    const subTotal = order.items.reduce((sum: number, i: any) => sum + i.unitCost * i.quantity, 0);
    const totalDiscount = subTotal * (order.discount / 100);
    const totalTax = order.items.reduce((sum: number, i: any) => sum + i.taxAmount, 0);

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />

            {/* MODAL - EXACTLY LIKE PRODUCTION */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div
                    className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-screen flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* GRAY HEADER - SAME AS AddSalesModal */}
                    <div className="bg-gray-100 border-b border-gray-300 px-6 py-4 flex justify-between items-center rounded-t-lg">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Sale Invoice - {order.reference}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-600 hover:text-gray-900 text-3xl font-light"
                        >
                            ×
                        </button>
                    </div>

                    {/* Printable Content */}
                    <div ref={printRef} className="flex-1 overflow-y-auto p-6">
                        <div className="bg-white rounded-lg p-8 max-w-4xl mx-auto space-y-8">

                            {/* Company Header */}
                            <div className="flex justify-between items-start border-b pb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">{order.companyInfo.name}</h1>
                                    <p className="text-sm text-gray-600 mt-2">
                                        {order.companyInfo.address}<br />
                                        Email: {order.companyInfo.email}<br />
                                        Phone: {order.companyInfo.phone}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <QRCode value={order.reference} size={80} />
                                    <p className="text-xs text-gray-500 mt-2">Scan to view</p>
                                </div>
                            </div>

                            {/* Invoice Info */}
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2">Bill To:</h3>
                                    <p className="font-medium">{order.customerName}</p>
                                    <p className="text-sm text-gray-600">
                                        {order.customerAddress}<br />
                                        Email: {order.customerEmail}<br />
                                        Phone: {order.customerPhone}
                                    </p>
                                </div>
                                <div className="text-right text-sm">
                                    <p><span className="font-semibold">Invoice #:</span> {order.reference}</p>
                                    <p><span className="font-semibold">Date:</span> {format(new Date(order.date), "dd MMM yyyy")}</p>
                                    <p><span className="font-semibold">Supplier:</span> {order.supplierName || "-"}</p>
                                    <p><span className="font-semibold">Status:</span>
                                        <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${order.status === "Completed" ? "bg-green-100 text-green-800" :
                                                order.status === "Overdue" ? "bg-red-100 text-red-800" :
                                                    "bg-yellow-100 text-yellow-800"
                                            }`}>
                                            {order.status}
                                        </span>
                                    </p>
                                    <p><span className="font-semibold">Payment:</span>
                                        <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${order.paymentStatus === "Paid" ? "bg-green-100 text-green-800" :
                                                order.paymentStatus === "Overdue" ? "bg-red-100 text-red-800" :
                                                    "bg-yellow-100 text-yellow-800"
                                            }`}>
                                            {order.paymentStatus}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Items Table */}
                            <table className="w-full border border-gray-300 text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="text-left py-3 px-4 border-b">Product</th>
                                        <th className="text-center py-3 px-4 border-b">Qty</th>
                                        <th className="text-right py-3 px-4 border-b">Price</th>
                                        <th className="text-right py-3 px-4 border-b">Discount</th>
                                        <th className="text-right py-3 px-4 border-b">Tax</th>
                                        <th className="text-right py-3 px-4 border-b font-bold">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="py-3 px-4 border">
                                                <div className="flex items-center gap-3">
                                                    {item.productImage ? (
                                                        <img src={item.productImage} alt="" className="w-10 h-10 rounded object-cover" />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-gray-200 rounded" />
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{item.productName}</p>
                                                        <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-center py-3 px-4 border">{item.quantity}</td>
                                            <td className="text-right py-3 px-4 border">₹{Number(item.unitCost).toFixed(2)}</td>
                                            <td className="text-right py-3 px-4 border">₹{(item.unitCost * item.quantity * item.discount / 100).toFixed(2)}</td>
                                            <td className="text-right py-3 px-4 border">₹{Number(item.taxAmount).toFixed(2)}</td>
                                            <td className="text-right py-3 px-4 border font-bold">₹{Number(item.totalCost).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Totals */}
                            <div className="flex justify-end">
                                <div className="w-64 bg-gray-50 p-4 rounded space-y-2 text-sm">
                                    <div className="flex justify-between"><span>Subtotal:</span> <span>₹{subTotal.toFixed(2)}</span></div>
                                    <div className="flex justify-between"><span>Discount:</span> <span>₹{totalDiscount.toFixed(2)}</span></div>
                                    <div className="flex justify-between"><span>Tax:</span> <span>₹{totalTax.toFixed(2)}</span></div>
                                    <div className="flex justify-between"><span>Shipping:</span> <span>₹{Number(order.shipping).toFixed(2)}</span></div>
                                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                        <span>Grand Total:</span> <span>₹{order.grandTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Paid:</span> <span className="text-green-600">₹{order.paid.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold">
                                        <span>Due:</span> <span className={order.due > 0 ? "text-red-600" : "text-green-600"}>
                                            ₹{order.due.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="text-center text-gray-500 text-sm border-t pt-4">
                                Thank you for your business! For support: {order.companyInfo.email}
                            </div>
                        </div>
                    </div>

                    {/* FOOTER - SAME AS AddSalesModal */}
                    <div className="bg-white border-t border-gray-300 px-6 py-4 flex justify-end gap-4 rounded-b-lg">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handlePrint}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                            Print Invoice
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SaleDetailModal;