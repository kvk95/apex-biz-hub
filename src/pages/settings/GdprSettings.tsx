import React, { useState, useEffect } from "react";
import { PageBase1 } from "@/pages/PageBase1";
import { apiService } from "@/services/ApiService";

interface GdprForm {
  consentText: string;
  position: "Left" | "Right" | "Center";
  agreeButtonText: string;
  declineButtonText: string;
  showDeclineButton: boolean;
  cookiesPageLink: string;
}

export default function GdprSettings() {
  const [form, setForm] = useState<GdprForm>({
    consentText: "Type your message",
    position: "Left",
    agreeButtonText: "Agree",
    declineButtonText: "Decline",
    showDeclineButton: true,
    cookiesPageLink: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await apiService.get<{ result: GdprForm }>("GdprSettings");
        if (response.status.code === "S") {
          setForm(response.result);
        }
      } catch (err) {
        setError("Failed to load GDPR settings.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = () => {
    setForm((prev) => ({ ...prev, showDeclineButton: !prev.showDeclineButton }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.post("GdprSettings", form);
      alert("GDPR settings saved successfully!");
    } catch (err) {
      setError("Failed to save GDPR settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <PageBase1
      title="GDPR Settings"
      description="Configure cookie consent banner and privacy settings"
      icon="fa fa-cookie-bite"
      loading={loading}
    >
      
      <div className="w-full mx-auto mt-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            {/* Cookies Consent Text */}
            <div>
              <label htmlFor="consentText" className="block text-sm font-medium text-gray-700 mb-2">
                Cookies Consent Text
              </label>
              <p className="text-xs text-gray-500 mb-2">Your can configure the text here</p>
              <textarea
                id="consentText"
                name="consentText"
                value={form.consentText}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                placeholder="We use cookies to enhance your experience..."
              />
            </div>

            {/* Cookies Position */}
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                Cookies Position
              </label>
              <p className="text-xs text-gray-500 mb-2">Your can configure the type</p>
              <select
                id="position"
                name="position"
                value={form.position}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Left">Left</option>
                <option value="Right">Right</option>
                <option value="Center">Center</option>
              </select>
            </div>

            {/* Agree Button Text */}
            <div>
              <label htmlFor="agreeButtonText" className="block text-sm font-medium text-gray-700 mb-2">
                Agree Button Text
              </label>
              <p className="text-xs text-gray-500 mb-2">Your can configure the text here</p>
              <input
                id="agreeButtonText"
                name="agreeButtonText"
                type="text"
                value={form.agreeButtonText}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Agree"
              />
            </div>

            {/* Decline Button Text */}
            <div>
              <label htmlFor="declineButtonText" className="block text-sm font-medium text-gray-700 mb-2">
                Decline Button Text
              </label>
              <p className="text-xs text-gray-500 mb-2">Your can configure the text here</p>
              <input
                id="declineButtonText"
                name="declineButtonText"
                type="text"
                value={form.declineButtonText}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Decline"
              />
            </div>

            {/* Show Decline Button */}
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="showDeclineButton" className="block text-sm font-medium text-gray-700">
                  Show Decline Button
                </label>
                <p className="text-xs text-gray-500">Your can configure the text here</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.showDeclineButton}
                  onChange={handleToggleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            {/* Link for Cookies Page */}
            <div>
              <label htmlFor="cookiesPageLink" className="block text-sm font-medium text-gray-700 mb-2">
                Link for Cookies Page
              </label>
              <p className="text-xs text-gray-500 mb-2">Your can configure the link here</p>
              <input
                id="cookiesPageLink"
                name="cookiesPageLink"
                type="url"
                value={form.cookiesPageLink}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="https://yoursite.com/cookies"
              />
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