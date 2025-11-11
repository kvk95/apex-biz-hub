import React, { useState, useEffect } from "react";
import { PageBase1 } from "@/pages/PageBase1";
import { apiService } from "@/services/ApiService";

interface PrefixesForm {
  productSKU: string;
  supplier: string;
  purchase: string;
  purchaseReturn: string;
  sales: string;
  salesReturn: string;
  customer: string;
  expense: string;
  stockTransfer: string;
  stockAdjustment: string;
  salesOrder: string;
  posInvoice: string;
  estimation: string;
  transaction: string;
  employee: string;
}

export default function PrefixesSettings() {
  const [form, setForm] = useState<PrefixesForm>({
    productSKU: "SKU-",
    supplier: "SUP-",
    purchase: "PU-",
    purchaseReturn: "PR-",
    sales: "SA-",
    salesReturn: "SR-",
    customer: "CT-",
    expense: "EX-",
    stockTransfer: "ST-",
    stockAdjustment: "SA-",
    salesOrder: "SO-",
    posInvoice: "PINV-",
    estimation: "EST-",
    transaction: "TRN-",
    employee: "EMP-",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await apiService.get<{ result: PrefixesForm }>(
          "PrefixesSettings"
        );
        if (response.status.code === "S") {
          setForm(response.result);
        }
      } catch (err) {
        setError("Failed to load prefix settings.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.post("PrefixesSettings", form);
      alert("Prefixes saved successfully!");
    } catch (err) {
      setError("Failed to save prefixes.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset or navigate
    window.history.back();
  };

  return (
    <PageBase1
      title="Prefixes Settings"
      description="Configure prefixes for various modules"
      icon="fa fa-hashtag"
    >
      <div className="w-full mx-auto mt-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Product (SKU) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product (SKU)
                </label>
                <input
                  type="text"
                  name="productSKU"
                  value={form.productSKU}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Supplier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier
                </label>
                <input
                  type="text"
                  name="supplier"
                  value={form.supplier}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Purchase */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase
                </label>
                <input
                  type="text"
                  name="purchase"
                  value={form.purchase}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Purchase Return */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Return
                </label>
                <input
                  type="text"
                  name="purchaseReturn"
                  value={form.purchaseReturn}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Sales */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sales
                </label>
                <input
                  type="text"
                  name="sales"
                  value={form.sales}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Sales Return */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sales Return
                </label>
                <input
                  type="text"
                  name="salesReturn"
                  value={form.salesReturn}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Customer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer
                </label>
                <input
                  type="text"
                  name="customer"
                  value={form.customer}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Expense */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expense
                </label>
                <input
                  type="text"
                  name="expense"
                  value={form.expense}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Stock Transfer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Transfer
                </label>
                <input
                  type="text"
                  name="stockTransfer"
                  value={form.stockTransfer}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Stock Adjustment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Adjustment
                </label>
                <input
                  type="text"
                  name="stockAdjustment"
                  value={form.stockAdjustment}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Sales Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sales Order
                </label>
                <input
                  type="text"
                  name="salesOrder"
                  value={form.salesOrder}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* POS Invoice */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  POS Invoice
                </label>
                <input
                  type="text"
                  name="posInvoice"
                  value={form.posInvoice}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Estimation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimation
                </label>
                <input
                  type="text"
                  name="estimation"
                  value={form.estimation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Transaction */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction
                </label>
                <input
                  type="text"
                  name="transaction"
                  value={form.transaction}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Employee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee
                </label>
                <input
                  type="text"
                  name="employee"
                  value={form.employee}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </PageBase1>
  );
}
