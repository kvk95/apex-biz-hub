import React, { useState, useMemo } from "react";

const localizationData = {
  languages: [
    { id: 1, language: "English", code: "en", currency: "USD", timezone: "America/New_York", dateFormat: "MM/DD/YYYY", timeFormat: "12-hour" },
    { id: 2, language: "French", code: "fr", currency: "EUR", timezone: "Europe/Paris", dateFormat: "DD/MM/YYYY", timeFormat: "24-hour" },
    { id: 3, language: "Spanish", code: "es", currency: "EUR", timezone: "Europe/Madrid", dateFormat: "DD/MM/YYYY", timeFormat: "24-hour" },
    { id: 4, language: "German", code: "de", currency: "EUR", timezone: "Europe/Berlin", dateFormat: "DD.MM.YYYY", timeFormat: "24-hour" },
    { id: 5, language: "Japanese", code: "ja", currency: "JPY", timezone: "Asia/Tokyo", dateFormat: "YYYY/MM/DD", timeFormat: "24-hour" },
    { id: 6, language: "Chinese", code: "zh", currency: "CNY", timezone: "Asia/Shanghai", dateFormat: "YYYY/MM/DD", timeFormat: "24-hour" },
    { id: 7, language: "Russian", code: "ru", currency: "RUB", timezone: "Europe/Moscow", dateFormat: "DD.MM.YYYY", timeFormat: "24-hour" },
    { id: 8, language: "Arabic", code: "ar", currency: "AED", timezone: "Asia/Dubai", dateFormat: "DD/MM/YYYY", timeFormat: "12-hour" },
    { id: 9, language: "Portuguese", code: "pt", currency: "EUR", timezone: "Europe/Lisbon", dateFormat: "DD/MM/YYYY", timeFormat: "24-hour" },
    { id: 10, language: "Hindi", code: "hi", currency: "INR", timezone: "Asia/Kolkata", dateFormat: "DD-MM-YYYY", timeFormat: "12-hour" },
    { id: 11, language: "Italian", code: "it", currency: "EUR", timezone: "Europe/Rome", dateFormat: "DD/MM/YYYY", timeFormat: "24-hour" },
    { id: 12, language: "Korean", code: "ko", currency: "KRW", timezone: "Asia/Seoul", dateFormat: "YYYY-MM-DD", timeFormat: "24-hour" },
    { id: 13, language: "Dutch", code: "nl", currency: "EUR", timezone: "Europe/Amsterdam", dateFormat: "DD-MM-YYYY", timeFormat: "24-hour" },
    { id: 14, language: "Swedish", code: "sv", currency: "SEK", timezone: "Europe/Stockholm", dateFormat: "YYYY-MM-DD", timeFormat: "24-hour" },
    { id: 15, language: "Turkish", code: "tr", currency: "TRY", timezone: "Europe/Istanbul", dateFormat: "DD.MM.YYYY", timeFormat: "24-hour" },
  ],
  currencies: [
    { id: 1, name: "US Dollar", code: "USD", symbol: "$" },
    { id: 2, name: "Euro", code: "EUR", symbol: "€" },
    { id: 3, name: "Japanese Yen", code: "JPY", symbol: "¥" },
    { id: 4, name: "British Pound", code: "GBP", symbol: "£" },
    { id: 5, name: "Australian Dollar", code: "AUD", symbol: "A$" },
    { id: 6, name: "Canadian Dollar", code: "CAD", symbol: "C$" },
    { id: 7, name: "Swiss Franc", code: "CHF", symbol: "CHF" },
    { id: 8, name: "Chinese Yuan", code: "CNY", symbol: "¥" },
    { id: 9, name: "Swedish Krona", code: "SEK", symbol: "kr" },
    { id: 10, name: "New Zealand Dollar", code: "NZD", symbol: "NZ$" },
  ],
  timezones: [
    "America/New_York",
    "Europe/Paris",
    "Europe/Madrid",
    "Europe/Berlin",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Europe/Moscow",
    "Asia/Dubai",
    "Europe/Lisbon",
    "Asia/Kolkata",
    "Europe/Rome",
    "Asia/Seoul",
    "Europe/Amsterdam",
    "Europe/Stockholm",
    "Europe/Istanbul",
  ],
  dateFormats: [
    "MM/DD/YYYY",
    "DD/MM/YYYY",
    "DD.MM.YYYY",
    "YYYY/MM/DD",
    "YYYY-MM-DD",
    "DD-MM-YYYY",
  ],
  timeFormats: ["12-hour", "24-hour"],
};

const ITEMS_PER_PAGE = 5;

export default function LocalizationSettings() {
  const [languageForm, setLanguageForm] = useState({
    language: "",
    code: "",
    currency: "",
    timezone: "",
    dateFormat: "",
    timeFormat: "",
  });

  const [languages, setLanguages] = useState(localizationData.languages);
  const [editId, setEditId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered and paginated languages
  const filteredLanguages = useMemo(() => {
    if (!searchTerm.trim()) return languages;
    return languages.filter((l) =>
      l.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.currency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.timezone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [languages, searchTerm]);

  const pageCount = Math.ceil(filteredLanguages.length / ITEMS_PER_PAGE);

  const paginatedLanguages = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLanguages.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLanguages, currentPage]);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLanguageForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (id: number) => {
    const lang = languages.find((l) => l.id === id);
    if (lang) {
      setLanguageForm({
        language: lang.language,
        code: lang.code,
        currency: lang.currency,
        timezone: lang.timezone,
        dateFormat: lang.dateFormat,
        timeFormat: lang.timeFormat,
      });
      setEditId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this language?")) {
      setLanguages((prev) => prev.filter((l) => l.id !== id));
      if (editId === id) {
        setEditId(null);
        setLanguageForm({
          language: "",
          code: "",
          currency: "",
          timezone: "",
          dateFormat: "",
          timeFormat: "",
        });
      }
    }
  };

  const handleSave = () => {
    const { language, code, currency, timezone, dateFormat, timeFormat } = languageForm;
    if (!language || !code || !currency || !timezone || !dateFormat || !timeFormat) {
      alert("Please fill all fields.");
      return;
    }
    if (editId !== null) {
      // Update
      setLanguages((prev) =>
        prev.map((l) =>
          l.id === editId
            ? { ...l, language, code, currency, timezone, dateFormat, timeFormat }
            : l
        )
      );
      setEditId(null);
    } else {
      // Add new
      const newId = languages.length ? Math.max(...languages.map((l) => l.id)) + 1 : 1;
      setLanguages((prev) => [
        ...prev,
        { id: newId, language, code, currency, timezone, dateFormat, timeFormat },
      ]);
    }
    setLanguageForm({
      language: "",
      code: "",
      currency: "",
      timezone: "",
      dateFormat: "",
      timeFormat: "",
    });
  };

  const handleRefresh = () => {
    setLanguageForm({
      language: "",
      code: "",
      currency: "",
      timezone: "",
      dateFormat: "",
      timeFormat: "",
    });
    setEditId(null);
  };

  const handleReport = () => {
    // For demonstration, just alert JSON data
    alert(JSON.stringify(languages, null, 2));
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pageCount) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      <h1 className="text-3xl font-semibold mb-6">Localization Settings</h1>

      {/* Form Section */}
      <section className="bg-white rounded shadow p-6 mb-8 max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Add / Edit Language</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="language" className="block font-medium mb-1">
              Language
            </label>
            <input
              type="text"
              id="language"
              name="language"
              value={languageForm.language}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. English"
            />
          </div>
          <div>
            <label htmlFor="code" className="block font-medium mb-1">
              Language Code
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={languageForm.code}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. en"
            />
          </div>
          <div>
            <label htmlFor="currency" className="block font-medium mb-1">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={languageForm.currency}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select currency</option>
              {localizationData.currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="timezone" className="block font-medium mb-1">
              Timezone
            </label>
            <select
              id="timezone"
              name="timezone"
              value={languageForm.timezone}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select timezone</option>
              {localizationData.timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="dateFormat" className="block font-medium mb-1">
              Date Format
            </label>
            <select
              id="dateFormat"
              name="dateFormat"
              value={languageForm.dateFormat}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select date format</option>
              {localizationData.dateFormats.map((df) => (
                <option key={df} value={df}>
                  {df}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="timeFormat" className="block font-medium mb-1">
              Time Format
            </label>
            <select
              id="timeFormat"
              name="timeFormat"
              value={languageForm.timeFormat}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select time format</option>
              {localizationData.timeFormats.map((tf) => (
                <option key={tf} value={tf}>
                  {tf === "12-hour" ? "12-hour (AM/PM)" : "24-hour"}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded flex items-center gap-2"
            type="button"
          >
            <i className="fas fa-save"></i> Save
          </button>
          <button
            onClick={handleRefresh}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded flex items-center gap-2"
            type="button"
          >
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
          <button
            onClick={handleReport}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded flex items-center gap-2 ml-auto"
            type="button"
          >
            <i className="fas fa-file-alt"></i> Report
          </button>
        </div>
      </section>

      {/* Table Section */}
      <section className="bg-white rounded shadow p-6 max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Languages List</h2>

        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search languages..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                  Language
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                  Code
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                  Currency
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                  Timezone
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                  Date Format
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                  Time Format
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedLanguages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No languages found.
                  </td>
                </tr>
              ) : (
                paginatedLanguages.map((lang) => (
                  <tr key={lang.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-r border-gray-300">{lang.language}</td>
                    <td className="px-4 py-2 border-r border-gray-300">{lang.code}</td>
                    <td className="px-4 py-2 border-r border-gray-300">{lang.currency}</td>
                    <td className="px-4 py-2 border-r border-gray-300">{lang.timezone}</td>
                    <td className="px-4 py-2 border-r border-gray-300">{lang.dateFormat}</td>
                    <td className="px-4 py-2 border-r border-gray-300">{lang.timeFormat}</td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(lang.id)}
                        className="text-indigo-600 hover:text-indigo-800"
                        aria-label={`Edit ${lang.language}`}
                        type="button"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(lang.id)}
                        className="text-red-600 hover:text-red-800"
                        aria-label={`Delete ${lang.language}`}
                        type="button"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pageCount > 1 && (
          <nav
            className="mt-6 flex justify-center items-center space-x-2"
            aria-label="Pagination"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border border-gray-300 ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              aria-label="Previous page"
              type="button"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            {[...Array(pageCount)].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded border border-gray-300 ${
                    page === currentPage
                      ? "bg-indigo-600 text-white cursor-default"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                  aria-current={page === currentPage ? "page" : undefined}
                  type="button"
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pageCount}
              className={`px-3 py-1 rounded border border-gray-300 ${
                currentPage === pageCount
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              aria-label="Next page"
              type="button"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </nav>
        )}
      </section>
    </div>
  );
}