import React, { useState, useEffect } from "react";
import { PageBase1 } from "@/pages/PageBase1";
import { apiService } from "@/services/ApiService";

interface LocalizationSettingsForm {
  // Existing
  language: string;
  showLanguageSwitcher: boolean;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  financialYear: string;
  startingMonth: string;
  currency: string;

  // New from screenshot
  currencySymbol: string;
  currencyPosition: string;
  decimalSeparator: string;
  thousandSeparator: string;
  countryRestriction: string;
  allowedFileTypes: string[];
  maxFileSize: number;
}

const timezones = [
  "UTC-12:00",
  "UTC-11:00",
  "UTC-10:00",
  "UTC-09:00",
  "UTC-08:00",
  "UTC-07:00",
  "UTC-06:00",
  "UTC-05:30",
  "UTC-05:00",
  "UTC-04:00",
  "UTC-03:00",
  "UTC-02:00",
  "UTC-01:00",
  "UTC+00:00",
  "UTC+01:00",
  "UTC+02:00",
  "UTC+03:00",
  "UTC+03:30",
  "UTC+04:00",
  "UTC+04:30",
  "UTC+05:00",
  "UTC+05:30",
  "UTC+05:45",
  "UTC+06:00",
  "UTC+06:30",
  "UTC+07:00",
  "UTC+08:00",
  "UTC+09:00",
  "UTC+09:30",
  "UTC+10:00",
  "UTC+11:00",
  "UTC+12:00",
];

const dateFormats = [
  "01 Jan 2025",
  "Jan 01, 2025",
  "2025-01-01",
  "01/01/2025",
  "01-01-2025",
];

const timeFormats = ["12 Hours", "24 Hours"];
const years = ["2024", "2025", "2026", "2027", "2028"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const currencies = ["USA", "India", "Euro", "UK", "Japan", "Australia"];
const currencySymbols = ["$", "₹", "€", "£", "¥", "A$"];
const currencyPositions = ["$100", "100$"];
const separators = [".", ",", " ", "·"];
const countryRestrictions = ["Allow All Countries", "Restrict to Selected"];

export default function LocalizationSettings() {
  const [form, setForm] = useState<LocalizationSettingsForm>({
    language: "English",
    showLanguageSwitcher: true,
    timezone: "UTC+05:30",
    dateFormat: "01 Jan 2025",
    timeFormat: "12 Hours",
    financialYear: "2025",
    startingMonth: "January",
    currency: "USA",
    currencySymbol: "$",
    currencyPosition: "$100",
    decimalSeparator: ".",
    thousandSeparator: ",",
    countryRestriction: "Allow All Countries",
    allowedFileTypes: ["JPG", "GIF", "PNG"],
    maxFileSize: 5000,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await apiService.get<{
          result: LocalizationSettingsForm;
        }>("LocalizationSettings");
        if (response.status.code === "S") {
          setForm(response.result);
        }
      } catch (err) {
        setError("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name === "maxFileSize") {
      setForm((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleToggle = () => {
    setForm((prev) => ({
      ...prev,
      showLanguageSwitcher: !prev.showLanguageSwitcher,
    }));
  };

  const handleFileTypeRemove = (type: string) => {
    setForm((prev) => ({
      ...prev,
      allowedFileTypes: prev.allowedFileTypes.filter((t) => t !== type),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.post("LocalizationSettings", form);
      alert("Localization settings saved successfully!");
    } catch (err) {
      setError("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageBase1
      title="Localization Settings"
      description="Configure language, timezone, currency, and file settings"
      
      loading={loading}
    >
      <div className="w-full mx-auto mt-2">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-6">
              <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs mr-2">
                i
              </span>
              Basic Information
            </h3>

            <div className="space-y-6">
              {/* Language */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <p className="text-xs text-gray-500">
                    Select Language of the Website
                  </p>
                </div>
                <div>
                  <select
                    name="language"
                    value={form.language}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>

              {/* Language Switcher */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language Switcher
                  </label>
                  <p className="text-xs text-gray-500">
                    To display in all the pages
                  </p>
                </div>
                <div className="flex justify-end">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.showLanguageSwitcher}
                      onChange={handleToggle}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </div>

              {/* Timezone */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timezone
                  </label>
                  <p className="text-xs text-gray-500">
                    Select Time zone in website
                  </p>
                </div>
                <div>
                  <select
                    name="timezone"
                    value={form.timezone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {timezones.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date Format */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date format
                  </label>
                  <p className="text-xs text-gray-500">
                    Select date format to display in website
                  </p>
                </div>
                <div>
                  <select
                    name="dateFormat"
                    value={form.dateFormat}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {dateFormats.map((fmt) => (
                      <option key={fmt} value={fmt}>
                        {fmt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time Format */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Format
                  </label>
                  <p className="text-xs text-gray-500">
                    Select time format to display in website
                  </p>
                </div>
                <div>
                  <select
                    name="timeFormat"
                    value={form.timeFormat}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {timeFormats.map((fmt) => (
                      <option key={fmt} value={fmt}>
                        {fmt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Financial Year */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Financial Year
                  </label>
                  <p className="text-xs text-gray-500">
                    Select year for finance
                  </p>
                </div>
                <div>
                  <select
                    name="financialYear"
                    value={form.financialYear}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Starting Month */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Starting Month
                  </label>
                  <p className="text-xs text-gray-500">
                    Select starting month to display
                  </p>
                </div>
                <div>
                  <select
                    name="startingMonth"
                    value={form.startingMonth}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Currency Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-6">
              <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs mr-2">
                i
              </span>
              Currency Settings
            </h3>

            <div className="space-y-6">
              {/* Currency */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <p className="text-xs text-gray-500">
                    Select Time zone in website
                  </p>
                </div>
                <div>
                  <select
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {currencies.map((curr) => (
                      <option key={curr} value={curr}>
                        {curr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Currency Symbol */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency Symbol
                  </label>
                  <p className="text-xs text-gray-500">
                    Select date format to display in website
                  </p>
                </div>
                <div>
                  <select
                    name="currencySymbol"
                    value={form.currencySymbol}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {currencySymbols.map((sym) => (
                      <option key={sym} value={sym}>
                        {sym}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Currency Position */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency Position
                  </label>
                  <p className="text-xs text-gray-500">
                    Select time format to display in website
                  </p>
                </div>
                <div>
                  <select
                    name="currencyPosition"
                    value={form.currencyPosition}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {currencyPositions.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Decimal Separator */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Decimal Separator
                  </label>
                  <p className="text-xs text-gray-500">
                    Select year for finance
                  </p>
                </div>
                <div>
                  <select
                    name="decimalSeparator"
                    value={form.decimalSeparator}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {separators.map((sep) => (
                      <option key={sep} value={sep}>
                        {sep}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Thousand Separator */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thousand Separator
                  </label>
                  <p className="text-xs text-gray-500">
                    Select starting month to display
                  </p>
                </div>
                <div>
                  <select
                    name="thousandSeparator"
                    value={form.thousandSeparator}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {separators.map((sep) => (
                      <option key={sep} value={sep}>
                        {sep}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Country Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-6">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2">
                i
              </span>
              Country Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Countries Restriction
                </label>
                <p className="text-xs text-gray-500">
                  Select countries restriction
                </p>
              </div>
              <div>
                <select
                  name="countryRestriction"
                  value={form.countryRestriction}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {countryRestrictions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* File Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-6">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs mr-2">
                i
              </span>
              File Settings
            </h3>

            <div className="space-y-6">
              {/* Allowed Files */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allowed Files
                  </label>
                  <p className="text-xs text-gray-500">Select files</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.allowedFileTypes.map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                    >
                      {type}
                      <button
                        type="button"
                        onClick={() => handleFileTypeRemove(type)}
                        className="ml-2 text-gray-500 hover:text-red-600"
                      >
                        <i className="fas fa-times text-xs"></i>
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Max File Size */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max File Size
                  </label>
                  <p className="text-xs text-gray-500">File size</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    name="maxFileSize"
                    value={form.maxFileSize}
                    onChange={handleChange}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="1"
                  />
                  <span className="text-sm text-gray-600">MB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
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
