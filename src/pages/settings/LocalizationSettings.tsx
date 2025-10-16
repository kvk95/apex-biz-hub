import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

export default function LocalizationSettings() {
  const [languageForm, setLanguageForm] = useState({
    language: "",
    code: "",
    currency: "",
    timezone: "",
    dateFormat: "",
    timeFormat: "",
  });

  const [languages, setLanguages] = useState([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    language: "",
    code: "",
    currency: "",
    timezone: "",
    dateFormat: "",
    timeFormat: "",
  });

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<any>("LocalizationSettings");
    if (response.status.code === "S") {
      setData(response.result);
      setLanguages(response.result.languages || []);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered languages
  const filteredLanguages = useMemo(() => {
    if (!searchTerm.trim()) return languages;
    return languages.filter((l) =>
      l.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.currency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.timezone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [languages, searchTerm]);

  // Paginated languages
  const paginatedLanguages = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLanguages.slice(start, start + itemsPerPage);
  }, [filteredLanguages, currentPage, itemsPerPage]);

  // Handlers for Add Section form inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLanguageForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const lang = languages.find((l) => l.id === id);
    if (lang) {
      setEditForm({
        language: lang.language,
        code: lang.code,
        currency: lang.currency,
        timezone: lang.timezone,
        dateFormat: lang.dateFormat,
        timeFormat: lang.timeFormat,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Add Section (Add new language)
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

  // Save handler for Edit Modal
  const handleEditSave = () => {
    const { language, code, currency, timezone, dateFormat, timeFormat } = editForm;
    if (!language || !code || !currency || !timezone || !dateFormat || !timeFormat) {
      alert("Please fill all fields.");
      return;
    }
    if (editId !== null) {
      setLanguages((prev) =>
        prev.map((l) =>
          l.id === editId
            ? { ...l, language, code, currency, timezone, dateFormat, timeFormat }
            : l
        )
      );
      setEditId(null);
      setIsEditModalOpen(false);
    }
  };

  // Cancel editing modal
  const handleEditCancel = () => {
    setEditId(null);
    setIsEditModalOpen(false);
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
      // If deleting last item on page, go to previous page if needed
      if (
        (currentPage - 1) * itemsPerPage >= languages.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setLanguageForm({
      language: "",
      code: "",
      currency: "",
      timezone: "",
      dateFormat: "",
      timeFormat: "",
    });
    setEditId(null);
    setCurrentPage(1);
  };

  const handleReport = () => {
    // For demonstration, just alert JSON data
    alert(JSON.stringify(languages, null, 2));
  };

  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-lg font-semibold mb-6">Localization Settings</h1>

      {/* Form Section (Add Section) - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add / Edit Language</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="language" className="block text-sm font-medium mb-1">
              Language
            </label>
            <input
              type="text"
              id="language"
              name="language"
              value={languageForm.language}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g. English"
            />
          </div>
          <div>
            <label htmlFor="code" className="block text-sm font-medium mb-1">
              Language Code
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={languageForm.code}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g. en"
            />
          </div>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium mb-1">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={languageForm.currency}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select currency</option>
              {(data.currencies || []).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium mb-1">
              Timezone
            </label>
            <select
              id="timezone"
              name="timezone"
              value={languageForm.timezone}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select timezone</option>
              {(data.timezones || []).map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="dateFormat" className="block text-sm font-medium mb-1">
              Date Format
            </label>
            <select
              id="dateFormat"
              name="dateFormat"
              value={languageForm.dateFormat}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select date format</option>
              {(data.dateFormats || []).map((df) => (
                <option key={df} value={df}>
                  {df}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="timeFormat" className="block text-sm font-medium mb-1">
              Time Format
            </label>
            <select
              id="timeFormat"
              name="timeFormat"
              value={languageForm.timeFormat}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select time format</option>
              {(data.timeFormats || []).map((tf) => (
                <option key={tf} value={tf}>
                  {tf === "12-hour" ? "12-hour (AM/PM)" : "24-hour"}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
          </button>
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
          </button>
          <button
            onClick={handleReport}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
          </button>
        </div>
      </section>

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="mb-4 flex justify-between items-center px-6">
          <input
            type="text"
            placeholder="Search languages..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-input rounded px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Language
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Code
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Currency
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Timezone
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Date Format
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Time Format
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedLanguages.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No languages found.
                  </td>
                </tr>
              )}
              {paginatedLanguages.map((lang, idx) => (
                <tr
                  key={lang.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {lang.language}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {lang.code}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {lang.currency}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {lang.timezone}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {lang.dateFormat}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {lang.timeFormat}
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(lang.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit ${lang.language}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(lang.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete ${lang.language}`}
                      type="button"
                    >
                      <i className="fa fa-trash fa-light" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredLanguages.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
      </section>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-modal-title"
        >
          <div className="bg-white rounded shadow-lg max-w-xl w-full p-6 relative">
            <h2
              id="edit-modal-title"
              className="text-xl font-semibold mb-4 text-center"
            >
              Edit Language
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="editLanguage"
                  className="block text-sm font-medium mb-1"
                >
                  Language
                </label>
                <input
                  type="text"
                  id="editLanguage"
                  name="language"
                  value={editForm.language}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g. English"
                />
              </div>
              <div>
                <label
                  htmlFor="editCode"
                  className="block text-sm font-medium mb-1"
                >
                  Language Code
                </label>
                <input
                  type="text"
                  id="editCode"
                  name="code"
                  value={editForm.code}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g. en"
                />
              </div>
              <div>
                <label
                  htmlFor="editCurrency"
                  className="block text-sm font-medium mb-1"
                >
                  Currency
                </label>
                <select
                  id="editCurrency"
                  name="currency"
                  value={editForm.currency}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select currency</option>
                  {(data.currencies || []).map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="editTimezone"
                  className="block text-sm font-medium mb-1"
                >
                  Timezone
                </label>
                <select
                  id="editTimezone"
                  name="timezone"
                  value={editForm.timezone}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select timezone</option>
                  {(data.timezones || []).map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="editDateFormat"
                  className="block text-sm font-medium mb-1"
                >
                  Date Format
                </label>
                <select
                  id="editDateFormat"
                  name="dateFormat"
                  value={editForm.dateFormat}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select date format</option>
                  {(data.dateFormats || []).map((df) => (
                    <option key={df} value={df}>
                      {df}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="editTimeFormat"
                  className="block text-sm font-medium mb-1"
                >
                  Time Format
                </label>
                <select
                  id="editTimeFormat"
                  name="timeFormat"
                  value={editForm.timeFormat}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select time format</option>
                  {(data.timeFormats || []).map((tf) => (
                    <option key={tf} value={tf}>
                      {tf === "12-hour" ? "12-hour (AM/PM)" : "24-hour"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleEditCancel}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}