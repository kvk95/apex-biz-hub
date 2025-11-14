import React, { useState, useEffect } from "react";
import { PageBase1 } from "@/pages/PageBase1";
import { apiService } from "@/services/ApiService";

interface SocialAuth {
  id: string; // e.g., 'facebook', 'google'
  name: string;
  icon: string; // Font Awesome class
  description: string;
  connected: boolean;
  enabled: boolean;
  appId?: string;
  appSecret?: string;
  redirectUrl?: string;
}

export default function SocialAuthentication() {
  const [socials, setSocials] = useState<SocialAuth[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await apiService.get<{ result: SocialAuth[] }>(
          "SocialAuthentication"
        );
        if (response.status.code === "S") {
          setSocials(response.result);
        }
      } catch (err) {
        setError("Failed to load social authentication settings.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleToggleEnable = (id: string) => {
    setSocials((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleViewIntegration = (url?: string) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      alert("No integration URL configured.");
    }
  };

  const handleConnectNow = (id: string) => {
    // In real app, this would open OAuth flow or modal
    alert(`Connecting ${id}... (Redirect to OAuth flow)`);
    // You could also trigger a modal here for App ID / Secret input
  };

  const handleInputChange = (
    id: string,
    field: "appId" | "appSecret" | "redirectUrl",
    value: string
  ) => {
    setSocials((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.post("SocialAuthentication", { socials });
      alert("Social authentication settings saved successfully!");
    } catch (err) {
      setError("Failed to save social authentication settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <PageBase1
      title="Social Authentication"
      description="Configure social login integrations for your platform"
      
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
            {socials.map((social) => (
              <div
                key={social.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <i
                      className={`fa-brands ${social.icon} text-2xl text-primary`}
                      aria-hidden="true"
                    ></i>
                    <h3 className="font-semibold text-lg">{social.name}</h3>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      social.connected
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {social.connected ? "Connected" : "Not Connected"}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {social.description}
                </p>

                {/* Toggle Enable */}
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium">Enabled</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={social.enabled}
                      onChange={() => handleToggleEnable(social.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                {/* View Integration / Connect Now Button */}
                <div className="flex items-center justify-between">
                  {social.connected ? (
                    <button
                      type="button"
                      onClick={() => handleViewIntegration(social.redirectUrl)}
                      className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 border border-primary rounded-md px-3 py-1"
                    >
                      <i className="fa fa-external-link-alt text-xs"></i>
                      View Integration
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleConnectNow(social.id)}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 border border-blue-600 rounded-md px-3 py-1"
                    >
                      <i className="fa fa-plug text-xs"></i>
                      Connect Now
                    </button>
                  )}

                  {/* Toggle Switch (Optional - if you want separate toggle for connection) */}
                  {/* <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={social.connected}
                      onChange={() => {}}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label> */}
                </div>

                {/* App ID & Secret Fields (Hidden by default, show on click or always visible) */}
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      App ID
                    </label>
                    <input
                      type="text"
                      value={social.appId || ""}
                      onChange={(e) =>
                        handleInputChange(social.id, "appId", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder={`Enter ${social.name} App ID`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      App Secret
                    </label>
                    <input
                      type="password"
                      value={social.appSecret || ""}
                      onChange={(e) =>
                        handleInputChange(
                          social.id,
                          "appSecret",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder={`Enter ${social.name} App Secret`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Redirect URL
                    </label>
                    <input
                      type="url"
                      value={social.redirectUrl || ""}
                      onChange={(e) =>
                        handleInputChange(
                          social.id,
                          "redirectUrl",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="https://yourdomain.com/auth/callback"
                    />
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
