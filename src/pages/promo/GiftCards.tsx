import { apiService } from "@/services/ApiService";
import React, { useEffect, useMemo, useState } from "react";
import { PageBase1 } from "@/pages/PageBase1";

const discountTypes = ["Percentage", "Fixed"];
const statusOptions = ["Active", "Inactive"];

interface Discount {
  id: number;
  discountName: string;
  discountType: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  status: string;
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => JSX.Element;
}

interface ThemeStyles {
  selectionBg: string;
  hoverColor: string;
}

export default function Discount() {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState({
    id: null as number | null,
    discountName: "",
    discountType: discountTypes[0],
    discountValue: "",
    startDate: "",
    endDate: "",
    status: statusOptions[0],
  });

  const [data, setData] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredData = useMemo(() => {
    const result = !search.trim()
      ? data
      : data.filter((d) =>
          d.discountName.toLowerCase().includes(search.toLowerCase())
        );
    console.log("filteredData:", result, { search });
    return result;
  }, [data, search]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("paginatedData:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
    });
    return result;
  }, [filteredData, currentPage, itemsPerPage]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<Discount[]>("Discount");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("loadData:", { data: response.result });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setFormMode("add");
    setForm({
      id: null,
      discountName: "",
      discountType: discountTypes[0],
      discountValue: "",
      startDate: "",
      endDate: "",
      status: statusOptions[0],
    });
  };

  const handleEdit = (item: Discount) => {
    setFormMode("edit");
    setForm({
      id: item.id,
      discountName: item.discountName,
      discountType: item.discountType,
      discountValue: item.discountValue.toString(),
      startDate: item.startDate,
      endDate: item.endDate,
      status: item.status,
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.discountName.trim() ||
      !form.discountValue ||
      !form.startDate ||
      !form.endDate
    ) {
      alert("Please fill all required fields.");
      return;
    }
    const discountValue = Number(form.discountValue);
    if (isNaN(discountValue) || discountValue < 0) {
      alert("Discount value must be a valid number greater than or equal to 0");
      return;
    }
    if (formMode === "add") {
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [...prev, { ...form, id: newId, discountValue }]);
      const totalPages = Math.ceil((filteredData.length + 1) / itemsPerPage);
      setCurrentPage(totalPages);
    } else if (formMode === "edit" && form.id !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === form.id ? { ...form, id: form.id, discountValue } : item
        )
      );
    }
    setFormMode(null);
    console.log("handleFormSubmit:", { form, formMode });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this discount?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      const totalPages = Math.ceil((filteredData.length - 1) / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      } else if (totalPages === 0) {
        setCurrentPage(1);
      }
      console.log("handleDelete:", { id, totalPages });
    }
  };

  const handleClear = () => {
    loadData();
    setFormMode(null);
    setSearch("");
    setCurrentPage(1);
    console.log("handleClear");
  };

  const handleReport = () => {
    alert("Discounts Report:\n\n" + JSON.stringify(data, null, 2));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    console.log("handleSearchChange:", { search: e.target.value });
  };

  const columns: Column[] = [
    {
      key: "index",
      label: "#",
      render: (_, row, idx) => (currentPage - 1) * itemsPerPage + idx + 1,
    },
    {
      key: "discountName",
      label: "Discount Name",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "discountType", label: "Discount Type" },
    {
      key: "discountValue",
      label: "Discount Value",
      render: (value, row) =>
        row.discountType === "Percentage" ? `${value}%` : `$${value}`,
    },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
            value === "Active"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  const rowActions = (row: Discount) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit discount ${row.discountName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit discount</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete discount ${row.discountName}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete discount</span>
      </button>
    </>
  );

  const modal = (themeStyles: ThemeStyles) => {
    return formMode === "add" || formMode === "edit" ? (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="bg-white rounded shadow-lg max-w-xl w-full p-6">
          <h2
            id="modal-title"
            className="text-xl font-semibold mb-4 text-center"
          >
            {formMode === "add" ? "Add Discount" : "Edit Discount"}
          </h2>
          <form
            onSubmit={handleFormSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div>
              <label
                htmlFor="discountName"
                className="block text-sm font-medium mb-1"
              >
                Discount Name <span className="text-destructive">*</span>
              </label>
              <input
                id="discountName"
                name="discountName"
                type="text"
                value={form.discountName}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter discount name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="discountType"
                className="block text-sm font-medium mb-1"
              >
                Discount Type
              </label>
              <select
                id="discountType"
                name="discountType"
                value={form.discountType}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {discountTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="discountValue"
                className="block text-sm font-medium mb-1"
              >
                Discount Value <span className="text-destructive">*</span>
              </label>
              <input
                id="discountValue"
                name="discountValue"
                type="number"
                min={0}
                value={form.discountValue}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter discount value"
                required
              />
            </div>
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium mb-1"
              >
                Start Date <span className="text-destructive">*</span>
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium mb-1"
              >
                End Date <span className="text-destructive">*</span>
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </form>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setFormMode(null)}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleFormSubmit}
              className="inline-flex items-center gap-2 text-white font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              style={
                {
                  backgroundColor: themeStyles.selectionBg,
                  "--hover-bg": themeStyles.hoverColor,
                } as React.CSSProperties
              }
              type="button"
            >
              {formMode === "add" ? "Save" : "Update"}
            </button>
          </div>
        </div>
      </div>
    ) : null;
  };

  return (
    <PageBase1
      title="Discounts"
      description="Manage discounts for your application."
      icon="fa fa-credit-card"
      onAddClick={handleAddClick}
      onRefresh={handleClear}
      onReport={handleReport}
      search={search}
      onSearchChange={handleSearchChange}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      modal={modal}
    />
  );
}
