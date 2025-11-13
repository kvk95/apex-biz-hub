/* -------------------------------------------------
   PaymentModal – PRODUCTION FINAL VERSION
   EXACTLY LIKE YOUR SCREENSHOT (GRAY + BLUE THEME)
   ------------------------------------------------- */
import React, { useState } from "react";
import { format } from "date-fns";

type Payment = {
    id: string;
    date: string;
    reference: string;
    receivedAmount: number;
    payingAmount: number;
    method: string;
    description?: string;
    amount?: number;
};

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: any;
    mode: "show" | "create";
    onPaymentAdded: (payment: Payment) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
    isOpen,
    onClose,
    order,
    mode,
    onPaymentAdded,
}) => {
    const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [reference, setReference] = useState(order?.reference || "");
    const [receivedAmount, setReceivedAmount] = useState("");
    const [payingAmount, setPayingAmount] = useState("");
    const [method, setMethod] = useState("Cash");
    const [description, setDescription] = useState("");

    if (!isOpen || !order) return null;

    const remaining = order.grandTotal - order.paid;
    const payments: Payment[] = order.payments || [];

    const handleSubmit = () => {
        if (!payingAmount || parseFloat(payingAmount) <= 0) return;

        const newPayment: Payment = {
            id: `PAY${Date.now()}`,
            date,
            reference: reference || order.reference,
            receivedAmount: parseFloat(receivedAmount) || 0,
            payingAmount: parseFloat(payingAmount),
            method,
            description: description || undefined,
        };

        onPaymentAdded(newPayment);
        onClose();
    };

    const getAmount = (p: Payment) => p.payingAmount ?? p.amount ?? 0;
    const getMethod = (p: Payment) => p.method || "Cash";
    const getRef = (p: Payment) => p.reference || order.reference;
    const getDate = (p: Payment) => p.date || new Date().toISOString();

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />

            {/* MODAL - EXACTLY LIKE PRODUCTION */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div
                    className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-screen flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* GRAY HEADER - SAME AS ALL MODALS */}
                    <div className="bg-gray-100 border-b border-gray-300 px-6 py-4 flex justify-between items-center rounded-t-lg">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {mode === "show" ? "Show Payments" : "Create Payment"}
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
                        {mode === "show" ? (
                            /* SHOW PAYMENTS */
                            <div className="bg-white rounded-lg border border-gray-300">
                                <div className="bg-gray-100 px-6 py-3 grid grid-cols-4 text-sm font-semibold text-gray-700 border-b">
                                    <div>Date</div>
                                    <div>Reference</div>
                                    <div>Amount</div>
                                    <div>Paid By</div>
                                </div>

                                {payments.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">No payments recorded</div>
                                ) : (
                                    payments.map((p) => (
                                        <div
                                            key={p.id || Date.now()}
                                            className="px-6 py-4 grid grid-cols-4 text-sm border-b hover:bg-gray-50 transition"
                                        >
                                            <div>{format(new Date(getDate(p)), "dd MMM yyyy")}</div>
                                            <div className="font-medium">{getRef(p)}</div>
                                            <div className="font-bold text-green-600">
                                                ₹{Number(getAmount(p)).toFixed(2)}
                                            </div>
                                            <div>{getMethod(p)}</div>
                                        </div>
                                    ))
                                )}

                                {/* Progress Bar */}
                                <div className="mt-6 bg-gray-200 h-3 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 transition-all duration-700"
                                        style={{
                                            width: `${order.grandTotal > 0 ? (order.paid / order.grandTotal) * 100 : 0}%`,
                                        }}
                                    />
                                </div>
                                <div className="text-center mt-2 text-sm text-gray-600">
                                    {order.paid.toFixed(2)} / {order.grandTotal.toFixed(2)} paid
                                </div>
                            </div>
                        ) : (
                            /* CREATE PAYMENT */
                            <div className="bg-white rounded-lg border border-gray-300 p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Reference *</label>
                                        <input
                                            type="text"
                                            value={reference}
                                            onChange={(e) => setReference(e.target.value)}
                                            placeholder={order.reference}
                                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Received Amount *</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">₹</span>
                                            <input
                                                type="number"
                                                value={receivedAmount}
                                                onChange={(e) => setReceivedAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Paying Amount *</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">₹</span>
                                            <input
                                                type="number"
                                                value={payingAmount}
                                                onChange={(e) => setPayingAmount(e.target.value)}
                                                placeholder="0.00"
                                                max={remaining}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Remaining: ₹{remaining.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment type *</label>
                                        <select
                                            value={method}
                                            onChange={(e) => setMethod(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="">Select</option>
                                            <option>Cash</option>
                                            <option>UPI</option>
                                            <option>Card</option>
                                            <option>Bank Transfer</option>
                                            <option>Cheque</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={3}
                                        placeholder="Add description..."
                                        maxLength={60}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
                                    />
                                    <p className="text-xs text-gray-500 text-right mt-1">
                                        {description.length}/60 characters
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FOOTER - SAME AS ALL MODALS */}
                    {mode === "create" && (
                        <div className="bg-white border-t border-gray-300 px-6 py-4 flex justify-end gap-4 rounded-b-lg">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={
                                    !payingAmount ||
                                    parseFloat(payingAmount) <= 0 ||
                                    parseFloat(payingAmount) > remaining
                                }
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
                            >
                                Submit
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export { PaymentModal };
export type { Payment };