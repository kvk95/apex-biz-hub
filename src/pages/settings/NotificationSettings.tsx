import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";

interface NotificationSettingsForm {
  mobilePushNotifications: boolean;
  desktopNotifications: boolean;
  emailNotifications: boolean;
  msmsNotifications: boolean;
  generalNotifications: {
    [key: string]: {
      push: boolean;
      sms: boolean;
      email: boolean;
    };
  };
}

const categories = [
  { key: "payment", label: "Payment" },
  { key: "transaction", label: "Transaction" },
  { key: "emailVerification", label: "Email Verification" },
  { key: "otp", label: "OTP" },
  { key: "activity", label: "Activity" },
  { key: "account", label: "Account" },
];

export default function Notification() {
  const navigate = useNavigate();
  const [form, setForm] = useState<NotificationSettingsForm>({
    mobilePushNotifications: true,
    desktopNotifications: true,
    emailNotifications: true,
    msmsNotifications: true,
    generalNotifications: {
      payment: { push: true, sms: true, email: true },
      transaction: { push: true, sms: true, email: true },
      emailVerification: { push: true, sms: true, email: true },
      otp: { push: true, sms: true, email: true },
      activity: { push: true, sms: true, email: true },
      account: { push: true, sms: true, email: true },
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await apiService.get<{
          result: NotificationSettingsForm;
        }>("NotificationSettings");
        if (response.status.code === "S") {
          setForm(response.result);
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

  const handleMasterToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleGeneralToggle = (
    category: string,
    type: "push" | "sms" | "email",
    checked: boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      generalNotifications: {
        ...prev.generalNotifications,
        [category]: {
          ...prev.generalNotifications[category],
          [type]: checked,
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.post("NotificationSettings", form);
      alert("Settings saved successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.reload();
  };

  return (
    <PageBase1
      title="Notification Settings"
      description="Manage your notification preferences"
      icon="fa fa-bell"
      loading={loading}
    >
      <div className="p-6 bg-card rounded shadow">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Top Master Toggles */}
          <div className="space-y-3">
            {[
              {
                name: "mobilePushNotifications",
                label: "Mobile Push Notifications",
              },
              { name: "desktopNotifications", label: "Desktop Notifications" },
              { name: "emailNotifications", label: "Email Notifications" },
              { name: "msmsNotifications", label: "MSMS Notifications" },
            ].map((item) => (
              <div
                key={item.name}
                className="flex justify-between items-center py-1"
              >
                <span className="text-sm font-medium text-gray-700">
                  {item.label}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name={item.name}
                    checked={form[item.name as keyof typeof form]}
                    onChange={handleMasterToggle}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
                </label>
              </div>
            ))}
          </div>

          {/* General Notification Table */}
          <div className="border-t pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs text-gray-500 bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-medium">
                      General Notification
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      Push
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      SMS
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr
                      key={cat.key}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-2 font-medium text-gray-900">
                        {cat.label}
                      </td>
                      {["push", "sms", "email"].map((type) => (
                        <td key={type} className="px-6 py-2 text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={
                                form.generalNotifications[cat.key][
                                  type as keyof typeof form.generalNotifications.payment
                                ]
                              }
                              onChange={(e) =>
                                handleGeneralToggle(
                                  cat.key,
                                  type as "push" | "sms" | "email",
                                  e.target.checked
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-7 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
                          </label>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </PageBase1>
  );
}
