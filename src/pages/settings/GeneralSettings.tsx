import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";
import { TAX_TYPES } from "@/constants/constants"; // Assuming TAX_TYPES is defined in constants

const currencyPositions = [
  { label: "Left ($100)", value: "left" },
  { label: "Right (100$)", value: "right" },
];

interface GeneralSettingsForm {
  firstName: string; // Maps to companyName (split for firstName)
  lastName: string; // Maps to companyName (split for lastName)
  userName: string; // Optional, can be unused or mapped to a new field
  phoneNumber: string; // Maps to companyPhone
  email: string; // Maps to companyEmail
  address: string; // Maps to companyAddress
  country: string;
  state: string;
  city: string;
  postalCode: string;
  image: File | null; // For companyLogoUrl 
}

export default function GeneralSettings() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [mode, setMode] = useState<"edit" | "view">("edit");
  const [form, setForm] = useState<GeneralSettingsForm>({
    firstName: "",
    lastName: "",
    userName: "",
    phoneNumber: "",
    email: "",
    address: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
    image: null, 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await apiService.get<[]>("GeneralSettings");
        if (response.status.code === "S" && response.result.length > 0) {
          const settings = response.result[0];
          const companyNameParts = settings.companyInfo.companyName.split(" ");
          setForm({
            firstName: companyNameParts[0] || "",
            lastName: companyNameParts.slice(1).join(" ") || "",
            userName: "",
            phoneNumber: settings.companyInfo.companyPhone,
            email: settings.companyInfo.companyEmail,
            address: settings.companyInfo.companyAddress,
            country: "",
            state: "",
            city: "",
            postalCode: "",
            image: null, 
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

  useEffect(() => {
    if (state?.mode) {
      setMode(state.mode);
    }
  }, [state]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "taxRate" ||
        name === "numberOfDecimals" ||
        name === "invoiceStartNumber"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be below 2 MB.");
        return;
      }
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        setError("Only JPG and PNG formats are accepted.");
        return;
      }
      setForm((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "view") return;

    // Validation
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.phoneNumber.trim() ||
      !form.email.trim() ||
      !form.address.trim()  
    ) {
      setError(
        "Please fill all required fields and ensure numerical values are valid."
      );
      return;
    }

    setLoading(true);
    try {
      const settingsData = {
        companyInfo: {
          companyName: `${form.firstName} ${form.lastName}`.trim(),
          companyEmail: form.email,
          companyPhone: form.phoneNumber,
          companyAddress: form.address,
          companyLogoUrl: form.image ? URL.createObjectURL(form.image) : "",
        }, 
      };
      await apiService.put("GeneralSettings", settingsData);
      navigate("/dashboard"); // Adjust as needed
    } catch (err) {
      setError("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      firstName: "",
      lastName: "",
      userName: "",
      phoneNumber: "",
      email: "",
      address: "",
      country: "",
      state: "",
      city: "",
      postalCode: "",
      image: null, 
    });
    navigate("/dashboard"); // Adjust as needed
  };

  const isDisabled = mode === "view";

  return (
    <PageBase1
      title={mode === "edit" ? "Profile Settings" : "View Profile Settings"}
      description="Manage Profile settings"
      icon="fa fa-user-circle"
    >
      <div className="w-full mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-700">
                Basic Information
              </h3>
              <div className="mt-4 flex items-center space-x-4">
                <div className="border-2 border-dashed border-gray-300 p-4 rounded-md">
                  <div className="text-center">
                    {form.image ? (
                      <img
                        src={URL.createObjectURL(form.image)}
                        alt="company logo"
                        className="w-24 h-24 rounded-full mx-auto"
                      />
                    ) : (
                      <div className="text-gray-500">Add Image</div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isDisabled}
                    className="mt-2 text-sm text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload an image below 2 MB. Accepted formats: JPG, PNG
                  </p>
                </div>
                <div className="flex flex-col space-y-4 w-full">
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Company Name (First Part)"
                    className="px-4 py-2 border rounded-md w-full"
                    required={!isDisabled}
                    disabled={isDisabled}
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Company Name (Second Part)"
                    className="px-4 py-2 border rounded-md w-full"
                    required={!isDisabled}
                    disabled={isDisabled}
                  />
                  <input
                    type="text"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="Company Phone"
                    className="px-4 py-2 border rounded-md w-full"
                    required={!isDisabled}
                    disabled={isDisabled}
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Company Email"
                    className="px-4 py-2 border rounded-md w-full"
                    required={!isDisabled}
                    disabled={isDisabled}
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-700">
                Address Information
              </h3>
              <div className="mt-4 flex flex-col space-y-4">
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Company Address"
                  className="px-4 py-2 border rounded-md w-full"
                  required={!isDisabled}
                  disabled={isDisabled}
                />
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="px-4 py-2 border rounded-md w-full"
                  required={!isDisabled}
                  disabled={isDisabled}
                >
                  <option value="">Select Country</option>
                  {/* Add country options as needed */}
                </select>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="px-4 py-2 border rounded-md w-full"
                  required={!isDisabled}
                  disabled={isDisabled}
                >
                  <option value="">Select State</option>
                  {/* Add state options as needed */}
                </select>
                <select
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="px-4 py-2 border rounded-md w-full"
                  required={!isDisabled}
                  disabled={isDisabled}
                >
                  <option value="">Select City</option>
                  {/* Add city options as needed */}
                </select>
                <input
                  type="text"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="Postal Code"
                  className="px-4 py-2 border rounded-md w-full"
                  required={!isDisabled}
                  disabled={isDisabled}
                />
              </div>
            </div>
 

            {/* Buttons */}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                className="px-6 py-2 border rounded-md bg-gray-200 text-gray-700"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 border rounded-md bg-green-600 text-white"
                disabled={loading || isDisabled}
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </PageBase1>
  );
}