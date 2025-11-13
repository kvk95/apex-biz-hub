import { apiService } from "@/services/ApiService";
import React, { useEffect, useState } from "react";
import { PageBase1 } from "@/pages/PageBase1";

interface PaymentGateway {
  id: string;
  name: string;
  logo: string; // URL
  description: string;
  enabled: boolean;
  connected: boolean;
  integrationUrl?: string;
  merchantId?: string;
  apiKey?: string;
  redirectUrl?: string;
}

export default function PaymentGatewaySettings() {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await apiService.get<{ result: PaymentGateway[] }>(
          "PaymentGatewaySettings"
        );
        if (response.status.code === "S") {
          setGateways(response.result);
        }
      } catch (err) {
        setError("Failed to load payment gateway settings.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleToggleEnable = (id: string) => {
    setGateways((prev) =>
      prev.map((g) => (g.id === id ? { ...g, enabled: !g.enabled } : g))
    );
  };

  const handleInputChange = (
    id: string,
    field: "merchantId" | "apiKey" | "redirectUrl",
    value: string
  ) => {
    setGateways((prev) =>
      prev.map((g) => (g.id === id ? { ...g, [field]: value } : g))
    );
  };

  const handleConnectNow = (id: string) => {
    const gateway = gateways.find((g) => g.id === id);
    if (!gateway?.merchantId || !gateway?.apiKey) {
      alert("Please enter Merchant ID and API Key first.");
      return;
    }
    alert(`Connecting to ${gateway.name}...`);
  };

  const handleViewIntegration = (url?: string) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      alert("No integration URL configured.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.post("PaymentGatewaySettings", { gateways });
      alert("Payment gateway settings saved successfully!");
    } catch {
      setError("Failed to save payment gateway settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <PageBase1
      title="Payment Gateway Settings"
      description="Configure and manage payment gateway integrations"
      icon="fa fa-credit-card"
      loading={loading}
    >
      <div className="w-full mx-auto mt-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gateways.map((gateway) => (
              <div
                key={gateway.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={gateway.logo}
                      alt={gateway.name}
                      className="h-8 w-auto object-contain"
                    />
                    <h3 className="font-semibold text-lg">{gateway.name}</h3>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      gateway.connected
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {gateway.connected ? "Connected" : "Not Connected"}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {gateway.description}
                </p>

                {/* Toggle Enable */}
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium">Enabled</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={gateway.enabled}
                      onChange={() => handleToggleEnable(gateway.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                {/* Connect / View Button */}
                <div className="flex items-center justify-between mb-4">
                  {gateway.connected ? (
                    <button
                      type="button"
                      onClick={() =>
                        handleViewIntegration(gateway.integrationUrl)
                      }
                      className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 border border-primary rounded-md px-3 py-1"
                    >
                      <i className="fa fa-external-link-alt text-xs"></i>
                      View Integration
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleConnectNow(gateway.id)}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 border border-blue-600 rounded-md px-3 py-1"
                    >
                      <i className="fa fa-plug text-xs"></i>
                      Connect Now
                    </button>
                  )}
                </div>

                {/* Configuration Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Merchant ID
                    </label>
                    <input
                      type="text"
                      value={gateway.merchantId || ""}
                      onChange={(e) =>
                        handleInputChange(
                          gateway.id,
                          "merchantId",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder={`Enter ${gateway.name} Merchant ID`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      API Key / Secret
                    </label>
                    <input
                      type="password"
                      value={gateway.apiKey || ""}
                      onChange={(e) =>
                        handleInputChange(gateway.id, "apiKey", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder={`Enter ${gateway.name} API Key`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Redirect URL
                    </label>
                    <input
                      type="url"
                      value={gateway.redirectUrl || ""}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use this URL in your {gateway.name} dashboard.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
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
