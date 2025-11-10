import { apiService } from "@/services/ApiService";
import React, { useEffect, useMemo, useState } from "react";
import { PageBase1, Column } from "@/pages/PageBase1";
import { STATUSES } from "@/constants/constants"; // Assuming STATUSES includes 'Active', 'Inactive'
import { renderStatusBadge } from "@/utils/tableUtils"; // Assuming this exists or adapt

const MODULES = ["Product", "Customer", "Supplier", "Biller"] as const;
const INPUT_TYPES = ["Number", "Select", "Text", "Date", "Email"] as const; // Extended based on common types

type ModuleType = (typeof MODULES)[number];
type InputType = (typeof INPUT_TYPES)[number];
type RequirementType = "Required" | "Disabled";

interface CustomField {
  id: number;
  module: ModuleType;
  label: string;
  type: InputType;
  defaultValue: string;
  required: RequirementType;
  active: boolean;
}

export default function CustomFields() {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState({
    id: null as number | null,
    module: MODULES[0],
    label: "",
    type: INPUT_TYPES[0],
    defaultValue: "",
    required: "Required" as RequirementType,
    active: true,
  });
  const [fields, setFields] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredFields = useMemo(() => {
    const result = !search.trim()
      ? fields
      : fields.filter(
          (f) =>
            f.label.toLowerCase().includes(search.toLowerCase()) ||
            f.module.toLowerCase().includes(search.toLowerCase())
        );
    return result;
  }, [search, fields]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredFields.slice(start, end);
  }, [currentPage, itemsPerPage, filteredFields]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<{ result: CustomField[] }>(
        "CustomFields"
      );
      if (response.status.code === "S") {
        setFields(response.result || []);
        setError(null);
      } else {
        setError(response.status.description);
      }
    } catch (err) {
      setError("Failed to load custom fields.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleRadioChange = (value: RequirementType) => {
    setForm((f) => ({ ...f, required: value }));
  };

  const handleAddClick = () => {
    setFormMode("add");
    setForm({
      id: null,
      module: MODULES[0],
      label: "",
      type: INPUT_TYPES[0],
      defaultValue: "",
      required: "Required",
      active: true,
    });
  };

  const handleEdit = (field: CustomField) => {
    setFormMode("edit");
    setForm({ ...field });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.label.trim() || !form.defaultValue.trim()) {
      alert("Please fill all required fields.");
      return;
    }
    if (formMode === "add") {
      const newId = fields.length
        ? Math.max(...fields.map((f) => f.id)) + 1
        : 1;
      setFields((prev) => [...prev, { ...form, id: newId }]);
    } else if (formMode === "edit" && form.id !== null) {
      setFields((prev) =>
        prev.map((f) => (f.id === form.id ? { ...form } : f))
      );
    }
    setFormMode(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this custom field?")) {
      setFields((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const handleClear = () => {
    loadData();
    setFormMode(null);
    setSearch("");
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: Column[] = [
    { key: "module", label: "Module" },
    { key: "label", label: "Label" },
    { key: "type", label: "Type" },
    {
      key: "defaultValue",
      label: "Default Value",
      render: (value) => value || "-",
    },
    {
      key: "required",
      label: "Required/Disable",
      render: (value) => <span className="capitalize">{value}</span>,
    },
    {
      key: "active",
      label: "Status",
      render: (value) =>
        renderStatusBadge(value ? "Active" : "Inactive") ||
        (value ? "Active" : "Inactive"),
    },
  ];

  const rowActions = (row: CustomField) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit coupon ${row.label}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit coupon</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete coupon ${row.label}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete coupon</span>
      </button>
    </>
  );

  const modalForm = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="module" className="block text-sm font-medium mb-1">
          Custom Fields For <span className="text-destructive">*</span>
        </label>
        <select
          id="module"
          name="module"
          value={form.module}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
        >
          {MODULES.map((mod) => (
            <option key={mod} value={mod}>
              {mod}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="label" className="block text-sm font-medium mb-1">
          Label <span className="text-destructive">*</span>
        </label>
        <input
          id="label"
          name="label"
          type="text"
          value={form.label}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter label"
          required
        />
      </div>
      <div>
        <label
          htmlFor="defaultValue"
          className="block text-sm font-medium mb-1"
        >
          Default Value <span className="text-destructive">*</span>
        </label>
        <input
          id="defaultValue"
          name="defaultValue"
          type="text"
          value={form.defaultValue}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter default value"
          required
        />
      </div>
      <div>
        <label htmlFor="type" className="block text-sm font-medium mb-1">
          Input Type <span className="text-destructive">*</span>
        </label>
        <select
          id="type"
          name="type"
          value={form.type}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
        >
          {INPUT_TYPES.map((typ) => (
            <option key={typ} value={typ}>
              {typ}
            </option>
          ))}
        </select>
      </div>
      <div className="flex space-x-4 items-center">
        <label className="text-sm font-medium">Required/Disable</label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="required"
            value="Required"
            checked={form.required === "Required"}
            onChange={() => handleRadioChange("Required")}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span>Required</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="required"
            value="Disabled"
            checked={form.required === "Disabled"}
            onChange={() => handleRadioChange("Disabled")}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span>Disable</span>
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <label htmlFor="active" className="text-sm font-medium">
          Status
        </label>
        <input
          id="active"
          name="active"
          type="checkbox"
          checked={form.active}
          onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
          className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
        />
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Custom Fields"
      description="Manage custom fields for your modules."
      icon="fa fa-columns"
      onAddClick={handleAddClick}
      onRefresh={handleClear}
      search={search}
      onSearchChange={handleSearchChange}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredFields.length}
      onPageChange={handlePageChange}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={formMode === "add" ? "Add Custom Field" : "Edit Custom Field"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
    />
  );
}
