import React, { useState, useEffect } from "react";
import { PageBase1 } from "@/pages/PageBase1";
import { apiService } from "@/services/ApiService";

interface PreferenceForm {
  maintenanceMode: boolean;
  coupon: boolean;
  offers: boolean;
  multiLanguage: boolean;
  multiCurrency: boolean;
  sms: boolean;
  stores: boolean;
  warehouses: boolean;
  barcode: boolean;
  qrCode: boolean;
  hrms: boolean;
}

export default function Preference() {
  const [form, setForm] = useState<PreferenceForm>({
    maintenanceMode: true,
    coupon: true,
    offers: true,
    multiLanguage: true,
    multiCurrency: true,
    sms: true,
    stores: true,
    warehouses: true,
    barcode: true,
    qrCode: true,
    hrms: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await apiService.get<{ result: PreferenceForm }>("Preference");
        if (response.status.code === "S") {
          setForm(response.result);
        }
      } catch (err) {
        setError("Failed to load preference settings.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleToggle = (key: keyof PreferenceForm) => {
    setForm(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.post("PreferenceSettings", form);
      alert("Preferences saved successfully!");
    } catch (err) {
      setError("Failed to save preferences.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  const toggleItems: { key: keyof PreferenceForm; label: string }[] = [
    { key: "maintenanceMode", label: "Maintenance Mode" },
    { key: "coupon", label: "Coupon" },
    { key: "offers", label: "Offers" },
    { key: "multiLanguage", label: "MultiLanguage" },
    { key: "multiCurrency", label: "Multicurrency" },
    { key: "sms", label: "SMS" },
    { key: "stores", label: "Stores" },
    { key: "warehouses", label: "Warehouses" },
    { key: "barcode", label: "Barcode" },
    { key: "qrCode", label: "QR Code" },
    { key: "hrms", label: "HRMS" },
  ];

  return (
    <PageBase1
      title="Preference Settings"
      description="Enable or disable system modules and features"
      icon="fa fa-cogs"
      loading={loading}
    >
       <div className="min-h-screen bg-background">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {toggleItems.map(({ key, label }) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-800">{label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form[key]}
                      onChange={() => handleToggle(key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              ))}
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