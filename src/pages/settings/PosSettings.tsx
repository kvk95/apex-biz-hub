import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";
import { PAYMENT_TYPES } from "@/constants/constants";

interface PosSettingsForm {
  posPrinter: string;
  paymentMethods: string[];
  enableSoundEffect: boolean;
}

export default function PosSettings() {
  const navigate = useNavigate();
  const [form, setForm] = useState<PosSettingsForm>({
    posPrinter: "A4",
    paymentMethods: ["COD", "Cheque", "Paypal"], // Default selected payment methods
    enableSoundEffect: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await apiService.get<{ result: PosSettingsForm }>(
          "PosSettings"
        );
        if (response.status.code === "S") {
          const loadedForm = response.result;
          // Ensure paymentMethods is always an array
          setForm({
            ...loadedForm,
            paymentMethods: Array.isArray(loadedForm.paymentMethods)
              ? loadedForm.paymentMethods
              : [],
          });
          setError(null);
        } else {
          setError("Failed to load settings.");
        }
      } catch (err) {
        setError("Failed to load settings. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox" && name !== "paymentMethods") {
      setForm((prev) => ({ ...prev, [name]: e.target.checked }));
    } else if (type === "select-one") {
      setForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePaymentMethodChange = (method: string, checked: boolean) => {
    setForm((prev) => {
      if (checked) {
        if (!prev.paymentMethods.includes(method)) {
          return { ...prev, paymentMethods: [...prev.paymentMethods, method] };
        }
      } else {
        return {
          ...prev,
          paymentMethods: prev.paymentMethods.filter((m) => m !== method),
        };
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.post("PosSettings", form);
      alert("Settings saved successfully!");
      navigate("/dashboard"); // Adjust as needed
    } catch (err) {
      setError("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.reload(); // Reload to reset
  };

  return (
    <PageBase1
      title="POS Settings"
      description="Manage POS settings for your system"
      icon="fa fa-cash-register"
    >
      <div className="w-full mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* POS Printer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col justify-between">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  POS Printer
                </h3>
                <p className="text-sm text-gray-500">
                  Select the default printer size for the POS system.
                </p>
              </div>
              <div>
                <select
                  name="posPrinter"
                  value={form.posPrinter}
                  onChange={handleChange}
                  className="px-4 py-2 border rounded-md w-48"
                >
                  <option value="A4">A4</option>
                  <option value="POS">POS</option>
                </select>
              </div>
            </div>
            {/* Payment Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col justify-between">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Payment Method
                </h3>
                <p className="text-sm text-gray-500">
                  Select the available payment methods for the POS.
                </p>
              </div>
              <div>
                <div className="flex flex-wrap gap-4">
                  {PAYMENT_TYPES.map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={method}
                        checked={form.paymentMethods.includes(method)}
                        onChange={(e) =>
                          handlePaymentMethodChange(method, e.target.checked)
                        }
                        className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                      />
                      <label className="text-sm">{method}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Enable Sound Effect */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col justify-between">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Enable Sound Effect
                </h3>
                <p className="text-sm text-gray-500">
                  Toggle to enable sound effects for the POS system.
                </p>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="enableSoundEffect"
                  checked={form.enableSoundEffect}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                />
              </div>
            </div>
            {/* Buttons */}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                className="px-6 py-2 border rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 border rounded-md bg-orange-500 text-white hover:bg-orange-600"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </PageBase1>
  );
}
