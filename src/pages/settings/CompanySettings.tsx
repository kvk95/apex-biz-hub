import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";
import { COUNTRIES } from "@/constants/constants"; // Assume you have a list of countries

interface CompanySettingsForm {
  companyName: string;
  companyEmail: string;
  phoneNumber: string;
  fax: string;
  website: string;
  address: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  companyIcon: string; // URL or base64
  favicon: string;
  companyLogo: string;
  companyDarkLogo: string;
}

export default function CompanySettings() {
  const navigate = useNavigate();
  const [form, setForm] = useState<CompanySettingsForm>({
    companyName: "",
    companyEmail: "",
    phoneNumber: "",
    fax: "",
    website: "",
    address: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
    companyIcon: "",
    favicon: "",
    companyLogo: "",
    companyDarkLogo: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState({
    companyIcon: "",
    favicon: "",
    companyLogo: "",
    companyDarkLogo: "",
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await apiService.get<{ result: CompanySettingsForm }>(
          "CompanySettings"
        );
        if (response.status.code === "S") {
          const loadedForm = response.result;
          setForm(loadedForm);
          // Set image previews if URLs exist
          setImagePreviews({
            companyIcon: loadedForm.companyIcon || "",
            favicon: loadedForm.favicon || "",
            companyLogo: loadedForm.companyLogo || "",
            companyDarkLogo: loadedForm.companyDarkLogo || "",
          });
          setError(null);
        } else {
          setError("Failed to load company settings.");
        }
      } catch (err) {
        setError("Failed to load company settings. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof imagePreviews
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setForm((prev) => ({ ...prev, [field]: result }));
        setImagePreviews((prev) => ({ ...prev, [field]: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = ( 
    field: keyof typeof imagePreviews
  ) => {
    const file = field;
    if (file) {
      //const reader = new FileReader();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.companyName.trim() ||
      !form.companyEmail.trim() ||
      !form.address.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
    setLoading(true);
    try {
      await apiService.post("CompanySettings", form);
      alert("Company settings saved successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to save company settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.reload();
  };

  return (
    <PageBase1
      title="Company Settings"
      description="Manage company information and branding"
      
      loading={loading}
    >
      <div className="w-full mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Company Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={form.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter company name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="companyEmail"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Company Email Address{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="companyEmail"
                    name="companyEmail"
                    type="email"
                    value={form.companyEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label
                    htmlFor="fax"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Fax
                  </label>
                  <input
                    id="fax"
                    name="fax"
                    type="text"
                    value={form.fax}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter fax number"
                  />
                </div>
                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Website
                  </label>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    value={form.website}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
            <hr className="border-t-2 border-solid border-primary" />
            {/* Address Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter full address"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    State
                  </label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label
                    htmlFor="postalCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Postal Code
                  </label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    value={form.postalCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
            </div>
            <hr className="border-t-2 border-solid border-primary" />
            <div>
              <h3 className="text-xl font-semibold flex items-center mb-4 gap-2">
                <i className="fa fa-image text-teal-500" /> Company Images
              </h3>
              <div className="space-y-6">
                {/* Row for each field */}
                {[
                  {
                    label: "Company Icon",
                    desc: "Upload Icon of your Company",
                    field: "companyIcon" as const,
                  },
                  {
                    label: "Favicon",
                    desc: "Upload Favicon of your Company",
                    field: "favicon" as const,
                  },
                  {
                    label: "Company Logo",
                    desc: "Upload Logo of your Company",
                    field: "companyLogo" as const,
                  },
                  {
                    label: "Company Dark Logo",
                    desc: "Upload Logo of your Company",
                    field: "companyDarkLogo" as const,
                  },
                ].map(({ label, desc, field }) => (
                  <div key={field} className="flex items-center gap-2">
                    {/* Left column: label and description */}
                    <div className="w-1/3 min-w-[180px]">
                      <div className="font-medium text-gray-900">{label}</div>
                      <div className="text-sm text-gray-500">{desc}</div>
                    </div>

                    {/* Right column: button and image */}
                    <div className="flex flex-col w-2/3 md:flex-row md:items-center gap-2">
                      {/* Upload Button */}
                      <label className="w-[155px]">
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => handleImageChange(e, field)}
                        />
                        <div className="bg-teal-500 flex items-center justify-center text-white font-semibold py-2 px-4 rounded cursor-pointer hover:bg-teal-600">
                          <i className="fa fa-upload mr-2" />
                          Upload Image
                        </div>
                      </label>
                      {/* Description and image preview, with delete icon */}
                      <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <div className="text-sm text-gray-500 min-w-[220px]">
                          Recommended size is 450px x 450px. Max size 5mb.
                        </div>
                        <div className="relative">
                          {imagePreviews?.[field] ? (
                            <>
                              <img
                                src={imagePreviews[field]}
                                alt={label}
                                className="object-contain border border-gray-200 rounded bg-white w-[72px] h-[72px] md:w-[98px] md:h-[98px]"
                              />
                              <button
                                type="button"
                                onClick={() => handleImageRemove(field)}
                                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 border border-white shadow hover:bg-red-600"
                              >
                                <i className="fa fa-times text-white text-xs" />
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center justify-center border border-gray-300 bg-white rounded w-[72px] h-[72px] md:w-[98px] md:h-[98px]">
                              <i className="fa fa-image text-gray-300 text-2xl" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-t-2 border-solid border-primary" />
            {/* Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                className="px-6 py-2 border rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 border rounded-md bg-orange-500 text-white hover:bg-orange-600 transition-colors disabled:opacity-50"
                disabled={loading}
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
