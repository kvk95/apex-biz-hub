import React, { useState, useEffect } from "react";
import { PageBase1 } from "@/pages/PageBase1";
import { apiService } from "@/services/ApiService";

interface StorageForm {
  localStorage: boolean;
  aws: boolean;
}

export default function StorageSettings() {
  const [form, setForm] = useState<StorageForm>({
    localStorage: true,
    aws: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await apiService.get<{ result: StorageForm }>("StorageSettings");
        if (response.status.code === "S") {
          setForm(response.result);
        }
      } catch (err) {
        setError("Failed to load storage settings.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleToggle = (key: keyof StorageForm) => {
    setForm(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.post("StorageSettings", form);
      alert("Storage settings saved successfully!");
    } catch (err) {
      setError("Failed to save storage settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  const storageOptions = [
    {
      key: "localStorage" as const,
      label: "Local Storage",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14H7v-2h3v2zm0-4H7v-2h3v2zm0-4H7V7h3v2zm5 8h-3v-2h3v2zm0-4h-3v-2h3v2zm0-4h-3V7h3v2z"/>
        </svg>
      ),
    },
    {
      key: "aws" as const,
      label: "AWS",
      icon: (
        <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.837 3.75l-7.776 4.5 7.776 4.5 7.776-4.5-7.776-4.5zM4.287 8.25l7.776 4.5v9l-7.776-4.5v-9zm15.426 0v9l-7.776 4.5v-9l7.776-4.5z"/>
        </svg>
      ),
    },
  ];

  return (
    <PageBase1
      title="Storage Settings"
      description="Choose where your data is stored"
      icon="fa fa-database"
      loading={loading}
    >
       <div className="min-h-screen bg-background">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {storageOptions.map(({ key, label, icon }) => (
              <div
                key={key}
                className="flex items-center justify-between p-5 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  {icon}
                  <span className="text-base font-medium text-gray-800">{label}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => alert(`Configure ${label} settings`)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label={`Settings for ${label}`}
                  >
                    <i className="fas fa-cog text-lg"></i>
                  </button>
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