import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";

interface InvoiceSettingsForm {
  logo: File | null;
  logoUrl: string;
  prefix: string;
  dueDays: number;
  roundOff: "Round Off" | "Round Up";
  showCompanyDetails: boolean;
  headerTerms: string;
  footerTerms: string;
}

export default function InvoiceSettings() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [mode, setMode] = useState<"edit" | "view">("edit");
  const [form, setForm] = useState<InvoiceSettingsForm>({
    logo: null,
    logoUrl: "",
    prefix: "INV-",
    dueDays: 5,
    roundOff: "Round Off",
    showCompanyDetails: true,
    headerTerms: "",
    footerTerms: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await apiService.get<{ result: InvoiceSettingsForm }>(
          "InvoiceSettings"
        );
        if (response.status.code === "S") {
          const settings = response.result;
          setForm(settings);
          setImagePreview(settings.logoUrl);
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

  useEffect(() => {
    if (state?.mode) {
      setMode(state.mode);
    }
  }, [state]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be below 5 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string);
        setForm((prev) => ({
          ...prev,
          logo: file,
          logoUrl: ev.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "view") return;

    setLoading(true);
    try {
      const settingsData = {
        logoUrl: form.logoUrl,
        prefix: form.prefix,
        dueDays: form.dueDays,
        roundOff: form.roundOff,
        showCompanyDetails: form.showCompanyDetails,
        headerTerms: form.headerTerms,
        footerTerms: form.footerTerms,
      };
      await apiService.post("InvoiceSettings", settingsData);
      alert("Settings saved successfully!");
      navigate("/dashboard"); // Adjust as needed
    } catch (err) {
      setError("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reload to reset
    window.location.reload();
  };

  const isDisabled = mode === "view";
  const dueOptions = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <PageBase1
      title={mode === "edit" ? "Invoice Settings" : "View Invoice Settings"}
      description="Manage invoice settings"
      icon="fa fa-file-invoice"
    >
      <div className="w-full mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Invoice Logo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col justify-between">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Invoice Logo
                </h3>
                <p className="text-sm text-gray-500">
                  Upload Logo of your Company to display in Invoice
                </p>
              </div>
              <div>
                <div className="border-2 border-dashed border-gray-300 p-4 rounded-md">
                  <div className="text-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Invoice Logo"
                        className="w-20 h-20 rounded object-cover mx-auto"
                      />
                    ) : (
                      <div className="text-gray-500">Add Image</div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={isDisabled}
                    className="mt-2 text-sm text-gray-500 hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
                    disabled={isDisabled}
                  >
                    <i className="fa fa-upload mr-2"></i> Upload Photo
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    For better preview recommended size is 450px × 450px. Max
                    size 5mb.
                  </p>
                </div>
              </div>
            </div>

            {/* Invoice Prefix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col justify-between">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Invoice Prefix
                </h3>
                <p className="text-sm text-gray-500">Add prefix to your invoice</p>
              </div>
              <div>
                <input
                  type="text"
                  name="prefix"
                  value={form.prefix}
                  onChange={handleChange}
                  placeholder="e.g. INV-"
                  className="px-4 py-2 border rounded-md w-48"
                  required={!isDisabled}
                  disabled={isDisabled}
                />
              </div>
            </div>

            {/* Invoice Due */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col justify-between">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Invoice Due
                </h3>
                <p className="text-sm text-gray-500">Select due date to display in invoice</p>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  name="dueDays"
                  value={form.dueDays}
                  onChange={handleChange}
                  className="px-4 py-2 border rounded-md w-24"
                  disabled={isDisabled}
                >
                  {dueOptions.map((days) => (
                    <option key={days} value={days}>
                      {days}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-gray-700">Days</span>
              </div>
            </div>

            {/* Invoice Round Off */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col justify-between">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Invoice Round Off
                </h3>
                <p className="text-sm text-gray-500">Value Roundoff in Invoice</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="roundOff"
                    name="roundOff"
                    value="Round Off"
                    checked={form.roundOff === "Round Off"}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                    disabled={isDisabled}
                  />
                  <label htmlFor="roundOff" className="text-sm font-medium">
                    Round Off
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="roundUp"
                    name="roundOff"
                    value="Round Up"
                    checked={form.roundOff === "Round Up"}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                    disabled={isDisabled}
                  />
                  <label htmlFor="roundUp" className="text-sm font-medium">
                    Round Up
                  </label>
                </div>
              </div>
            </div>

            {/* Show Company Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col justify-between">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Show Company Details
                </h3>
                <p className="text-sm text-gray-500">Show / Hide Company Details in Invoice</p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="showCompanyDetails"
                  checked={form.showCompanyDetails}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                  disabled={isDisabled}
                />
              </div>
            </div>

            {/* Invoice Header Terms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col justify-between">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Invoice Header Terms
                </h3>
                <p className="text-sm text-gray-500">Enter any header terms</p>
              </div>
              <div>
                <textarea
                  name="headerTerms"
                  value={form.headerTerms}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-md resize-none"
                  placeholder="Type your message..."
                  disabled={isDisabled}
                />
              </div>
            </div>

            {/* Invoice Footer Terms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col justify-between">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Invoice Footer Terms
                </h3>
                <p className="text-sm text-gray-500">Enter any footer terms</p>
              </div>
              <div>
                <textarea
                  name="footerTerms"
                  value={form.footerTerms}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-md resize-none"
                  placeholder="Type your message..."
                  disabled={isDisabled}
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
                className="px-6 py-2 border rounded-md bg-green-600 text-white hover:bg-green-700"
                disabled={loading || isDisabled}
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
