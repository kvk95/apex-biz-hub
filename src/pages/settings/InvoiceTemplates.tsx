import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";

interface Template {
  id: string;
  name: string;
  imageUrl: string;
  type: "invoice" | "purchase" | "receipt";
  isDefault: boolean;
}

export default function InvoiceTemplates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [currentTab, setCurrentTab] = useState<
    "invoice" | "purchase" | "receipt"
  >("invoice");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await apiService.get<{ result: Template[] }>(
          "InvoiceTemplates"
        );
        if (response.status.code === "S") {
          setTemplates(response.result || []);
          setError(null);
        } else {
          setError("Failed to load templates.");
        }
      } catch (err) {
        setError("Failed to load templates. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredTemplates = templates.filter((t) => t.type === currentTab);

  const handleDefaultToggle = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.type === currentTab
          ? t.id === id
            ? { ...t, isDefault: true }
            : { ...t, isDefault: false }
          : t
      )
    );
  };

  const handleTabChange = (tab: "invoice" | "purchase" | "receipt") => {
    setCurrentTab(tab);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiService.post("InvoiceTemplates", { templates });
      alert("Templates updated successfully!");
      // Optionally navigate or reload
    } catch (err) {
      setError("Failed to save templates. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    window.location.reload(); // Reload to reset
  };

  const tabLabels: Record<"invoice" | "purchase" | "receipt", string> = {
    invoice: "Invoices",
    purchase: "Purchases",
    receipt: "Receipts",
  };

  if (loading) {
    return (
      <PageBase1
        title="Invoice Templates"
        description="Manage invoice templates"
        
      >
        <div className="flex justify-center items-center h-64">
          <p>Loading templates...</p>
        </div>
      </PageBase1>
    );
  }

  return (
    <PageBase1
      title="Invoice Templates"
      description="Manage and select default templates for invoices, purchases, and receipts"
      
      loading={loading}
    >
      <div className="w-full mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {(["invoice", "purchase", "receipt"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    currentTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tabLabels[tab]}
                </button>
              ))}
            </nav>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredTemplates.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No templates found for this category.
            </p>
          ) : (
            filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="relative bg-gray-50 rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={template.imageUrl}
                  alt={template.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2 truncate">
                    {template.name}
                  </h3>
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => handleDefaultToggle(template.id)}
                      className="text-yellow-400 hover:text-yellow-500"
                      aria-label={`Set ${template.name} as default`}
                    >
                      <i
                        className={`fa fa-star ${
                          template.isDefault
                            ? "text-yellow-400"
                            : "text-gray-500 fa-light hover:text-yellow-600 "
                        }`}
                      />
                    </button>
                    <button
                      className="text-green-500 hover:text-green-600"
                      aria-label={`Edit ${template.name}`}
                      // Add onClick for edit if needed
                    >
                      <i className="fa fa-cog"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 border rounded-md bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </PageBase1>
  );
}
