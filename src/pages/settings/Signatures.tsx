import { apiService } from "@/services/ApiService";
import React, { useEffect, useMemo, useState } from "react";
import { PageBase1, Column } from "@/pages/PageBase1";
import { STATUSES } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";

interface Signature {
  id: number;
  signatureName: string;
  signatureImage: string;
  status: (typeof STATUSES)[number];
  isDefault: boolean;
}

export default function Signatures() {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState({
    id: null as number | null,
    signatureName: "",
    signatureImage: "",
    status: STATUSES[0],
    isDefault: false,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredSignatures = useMemo(() => {
    const result = !search.trim()
      ? signatures
      : signatures.filter((s) =>
          s.signatureName.toLowerCase().includes(search.toLowerCase())
        );
    console.log("Signatures filteredSignatures:", result, { search });
    return result;
  }, [search, signatures]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredSignatures.slice(start, end);
    console.log("Signatures paginatedData:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
      totalItems: filteredSignatures.length,
    });
    return result;
  }, [currentPage, itemsPerPage, filteredSignatures]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<Signature[]>("Signatures");
    if (response.status.code === "S") {
      setSignatures(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("Signatures loadData:", { data: response.result });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm((prev) => ({
          ...prev,
          signatureImage: ev.target?.result as string,
        }));
        setImagePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm((f) => ({ ...f, [name]: checked }));
  };

  const handleAddClick = () => {
    setFormMode("add");
    setForm({
      id: null,
      signatureName: "",
      signatureImage: "",
      status: STATUSES[0],
      isDefault: false,
    });
    setImagePreview(null);
    console.log("Signatures handleAddClick: Modal opened for add");
  };

  const handleEdit = (signature: Signature) => {
    setFormMode("edit");
    setForm({ ...signature });
    setImagePreview(signature.signatureImage);
    console.log("Signatures handleEdit: Modal opened for edit", { signature });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.signatureName.trim() || !form.signatureImage.trim()) {
      alert("Please fill all required fields.");
      return;
    }
    if (formMode === "add") {
      const newId = signatures.length
        ? Math.max(...signatures.map((s) => s.id)) + 1
        : 1;
      setSignatures((prev) => [...prev, { ...form, id: newId }]);
      const totalPages = Math.ceil(
        (filteredSignatures.length + 1) / itemsPerPage
      );
      setCurrentPage(totalPages);
    } else if (formMode === "edit" && form.id !== null) {
      setSignatures((prev) =>
        prev.map((s) => (s.id === form.id ? { ...form, id: form.id } : s))
      );
    }
    setFormMode(null);
    console.log("Signatures handleFormSubmit:", { form, formMode });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this signature?")) {
      setSignatures((prev) => prev.filter((s) => s.id !== id));
      const totalPages = Math.ceil(
        (filteredSignatures.length - 1) / itemsPerPage
      );
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
        console.log("Signatures handleDelete: Adjusted to last page", {
          id,
          currentPage,
          totalPages,
        });
      } else if (totalPages === 0) {
        setCurrentPage(1);
        console.log("Signatures handleDelete: Reset to page 1 (no data)", {
          id,
          currentPage,
          totalPages,
        });
      }
      console.log("Signatures handleDelete:", { id, totalPages });
    }
  };

  const handleClear = () => {
    loadData();
    setFormMode(null);
    setSearch("");
    setCurrentPage(1);
    console.log("Signatures handleClear");
  };

  const handleReport = () => {
    alert("Signature Report:\n\n" + JSON.stringify(signatures, null, 2));
  };

  const handleSearchChange = (search: string) => {
    setSearch(search );
    setCurrentPage(1); 
  };
 


  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(filteredSignatures.length / itemsPerPage);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      console.log("Signatures handlePageChange:", {
        page,
        totalPages,
        currentPage,
      });
    } else {
      console.warn("Signatures handlePageChange: Invalid page or same page", {
        page,
        totalPages,
        currentPage,
      });
    }
  };

  const columns: Column[] = [
    {
      key: "signatureName",
      label: "Signature Name",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      key: "signatureImage",
      label: "Signature Image",
      render: (value) => (
        <img
          src={value}
          alt="Signature"
          className="w-12 h-12 rounded object-cover"
        />
      ),
      align: "center",
    },
    {
      key: "isDefault",
      label: "Default",
      render: (value) => (
        <i
          className={`fa ${
            value ? "fa-check text-green-500" : "fa-times text-red-500"
          }`}
        />
      ),
      align: "center",
    },
    {
      key: "signatureStatus",
      label: "Status",
      render: renderStatusBadge,
      align: "center",
    },
  ];

  const rowActions = (row: Signature) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit signature ${row.signatureName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit signature</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete signature ${row.signatureName}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete signature</span>
      </button>
    </>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label
          htmlFor="signatureName"
          className="block text-sm font-medium mb-1"
        >
          Signature Name <span className="text-destructive">*</span>
        </label>
        <input
          id="signatureName"
          name="signatureName"
          type="text"
          value={form.signatureName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter signature name"
          required
        />
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium mb-1">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={form.status}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <label
          htmlFor="signatureImage"
          className="block text-sm font-medium mb-1"
        >
          Signature Image <span className="text-destructive">*</span>
        </label>
        <input
          id="signatureImage"
          name="signatureImage"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required={!form.signatureImage}
        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 rounded object-cover border"
            />
          </div>
        )}
      </div>
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="isDefault"
            checked={form.isDefault}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          Make Default
        </label>
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Signatures"
      description="Manage signatures for your application."
      icon="fa fa-signature"
      onAddClick={handleAddClick}
      onRefresh={handleClear}
      onReport={handleReport}
      search={search}
      onSearchChange={handleSearchChange}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredSignatures.length}
      onPageChange={handlePageChange}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={formMode === "add" ? "Add Signature" : "Edit Signature"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
    />
  );
}
