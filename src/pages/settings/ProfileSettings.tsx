import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";
import { PATH_HOMESCREEN } from "@/constants/constants";

interface ProfileSettingsForm {
  firstName: string;
  lastName: string;
  userName: string;
  phoneNumber: string;
  email: string;
  address: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  image: File | null;
}

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [mode] = useState<"edit" | "view">("edit"); // Assuming edit mode
  const [form, setForm] = useState<ProfileSettingsForm>({
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await apiService.get<any>("ProfileSettings");
        if (response.status.code === "S" && response.result) {
          const data = response.result;
          setForm({
            firstName: data.firstName,
            lastName: data.lastName,
            userName: data.userName,
            phoneNumber: data.phoneNumber,
            email: data.email,
            address: data.address || "",
            country: data.country,
            state: data.state,
            city: data.city,
            postalCode: data.postalCode,
            image: data.image,
          });
          if (data.image) setImagePreview(data.image);
        }
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be below 2 MB.");
      return;
    }
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Only JPG and PNG are allowed.");
      return;
    }

    setForm((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.firstName ||
      !form.lastName ||
      !form.phoneNumber ||
      !form.email ||
      !form.address
    ) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        companyInfo: {
          companyName: `${form.firstName} ${form.lastName}`.trim(),
          companyPhone: form.phoneNumber,
          companyEmail: form.email,
          companyAddress: form.address,
          companyLogoUrl: form.image
            ? URL.createObjectURL(form.image)
            : imagePreview || "",
        },
      };
      await apiService.put("GeneralSettings", payload);
      alert("Profile saved!");
      navigate(PATH_HOMESCREEN);
    } catch (err) {
      setError("Failed to save. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate(PATH_HOMESCREEN);

  const isDisabled = mode === "view";

  return (
    <PageBase1
      title="Profile Settings"
      description="Manage your profile information"
      icon="fa fa-user-circle"
      loading={loading}
    >
      <div className="p-6 bg-card rounded shadow">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-6">
              <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs mr-2">
                i
              </span>
              Basic Information
            </h3>

            <div className="flex gap-8">
              {/* Image Upload */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 text-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <div className="w-8 h-8 bg-gray-200 rounded-full mb-2 flex items-center justify-center">
                        <i className="fas fa-camera text-gray-400 text-sm"></i>
                      </div>
                      <p className="text-xs text-gray-500">Add Image</p>
                    </>
                  )}
                </div>
                <label className="block mt-3">
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleImageUpload}
                    disabled={isDisabled}
                    className="hidden"
                  />
                  <span className="block px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md cursor-pointer hover:bg-green-700 text-center">
                    Upload Image
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Upload an image below 2 MB, Accepted File format JPG, PNG
                </p>
              </div>

              {/* Form Fields */}
              <div className="flex-1 space-y-5">
                {/* Row 1: First, Last, User Name */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      disabled={isDisabled}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      disabled={isDisabled}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="userName"
                      value={form.userName}
                      onChange={handleChange}
                      disabled={isDisabled}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Phone, Email */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      disabled={isDisabled}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      disabled={isDisabled}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="border-t pt-8">
            <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-6">
              <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs mr-2">
                i
              </span>
              Address Information
            </h3>

            <div className="space-y-5">
              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  disabled={isDisabled}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                  required
                />
              </div>

              {/* Country & State */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    disabled={isDisabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                    required
                  >
                    <option>Select</option>
                    <option value="IN">India</option>
                    {/* Add more */}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    disabled={isDisabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                    required
                  >
                    <option>Select</option>
                    <option value="MH">Maharashtra</option>
                    {/* Add more */}
                  </select>
                </div>
              </div>

              {/* City & Postal Code */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    disabled={isDisabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                    required
                  >
                    <option>Select</option>
                    <option value="Mumbai">Mumbai</option>
                    {/* Add more */}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    disabled={isDisabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || isDisabled}
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
