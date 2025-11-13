import React, { useState, useEffect } from "react";
import { PageBase1 } from "@/pages/PageBase1";
import { apiService } from "@/services/ApiService";

interface OtpForm {
  otpType: "SMS" | "Email";
  digitLimit: 4 | 6 | 8;
  expireTime: 5 | 10 | 15; // minutes
}

export default function OtpSettings() {
  const [form, setForm] = useState<OtpForm>({
    otpType: "SMS",
    digitLimit: 4,
    expireTime: 5,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await apiService.get<{ result: OtpForm }>("OtpSettings");
        if (response.status.code === "S") {
          setForm(response.result);
        }
      } catch (err) {
        setError("Failed to load OTP settings.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "digitLimit" || name === "expireTime" 
        ? parseInt(value) as any 
        : value as any,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.post("OtpSettings", form);
      alert("OTP settings saved successfully!");
    } catch (err) {
      setError("Failed to save OTP settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <PageBase1
      title="OTP Settings"
      description="Configure one-time password verification"
      icon="fa fa-key"
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
            {/* OTP Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="md:col-span-1">
                <label htmlFor="otpType" className="block text-sm font-medium text-gray-700 mb-1">
                  OTP Type
                </label>
                <p className="text-xs text-gray-500 mb-2">You can configure the type</p>
                <select
                  id="otpType"
                  name="otpType"
                  value={form.otpType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="SMS">SMS</option>
                  <option value="Email">Email</option>
                </select>
              </div>
              <div></div>
            </div>

            {/* OTP Digit Limit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="md:col-span-1">
                <label htmlFor="digitLimit" className="block text-sm font-medium text-gray-700 mb-1">
                  OTP Digit Limit
                </label>
                <p className="text-xs text-gray-500 mb-2">Select size of the format</p>
                <select
                  id="digitLimit"
                  name="digitLimit"
                  value={form.digitLimit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value={4}>4</option>
                  <option value={6}>6</option>
                  <option value={8}>8</option>
                </select>
              </div>
              <div></div>
            </div>

            {/* OTP Expire Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="md:col-span-1">
                <label htmlFor="expireTime" className="block text-sm font-medium text-gray-700 mb-1">
                  OTP Expire Time
                </label>
                <p className="text-xs text-gray-500 mb-2">Select expire time of OTP</p>
                <select
                  id="expireTime"
                  name="expireTime"
                  value={form.expireTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value={5}>5 mins</option>
                  <option value={10}>10 mins</option>
                  <option value={15}>15 mins</option>
                </select>
              </div>
              <div></div>
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