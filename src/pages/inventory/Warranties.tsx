import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { EXPIRED_STATUSES } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";

interface WarrantyRecord {
  id: number;
  warrantyNo: string;
  customerName: string;
  productName: string;
  purchaseDate: string;
  warrantyPeriod: string;
  status: typeof EXPIRED_STATUSES[number];
}

export default function Warranties() {
  const [data, setData] = useState<WarrantyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<WarrantyRecord>({
    id: 0,
    warrantyNo: "",
    customerName: "",
    productName: "",
    purchaseDate: "",
    warrantyPeriod: "",
    status: EXPIRED_STATUSES[0],
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const response = await apiService.get<WarrantyRecord[]>("Warranties");
      if (response.status.code === "S") {
        setData(response.result);
        setError(null);
      } else {
        setError(response.status.description);
      }
      setLoading(false);
      console.log("Warranties loadData:", { data: response.result });
    };
    loadData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.warrantyNo.toLowerCase().includes(searchText.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = !filterStatus || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [data, searchText, filterStatus]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.warrantyNo.trim() ||
      !form.customerName.trim() ||
      !form.productName.trim() ||
      !form.purchaseDate ||
      !form.warrantyPeriod.trim() ||
      !form.status
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (formMode === "add") {
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [...prev, { ...form, id: newId }]);
      const totalPages = Math.ceil((filteredData.length + 1) / itemsPerPage);
      setCurrentPage(totalPages);
    } else if (formMode === "edit" && form.id !== 0) {
      setData((prev) =>
        prev.map((item) => (item.id === form.id ? { ...item, ...form } : item))
      );
    }
    setFormMode(null);
    setForm({
      id: 0,
      warrantyNo: "",
      customerName: "",
      productName: "",
      purchaseDate: "",
      warrantyPeriod: "",
      status: EXPIRED_STATUSES[0],
    });
    console.log("Warranties handleFormSubmit:", { form, formMode });
  };

  const handleEdit = (record: WarrantyRecord) => {
    setForm(record);
    setFormMode("edit");
    console.log("Warranties handleEdit:", { record });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this warranty?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      if ((currentPage - 1) * itemsPerPage >= filteredData.length - 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      console.log("Warranties handleDelete:", { id });
    }
  };

  const handleClear = () => {
    setSearchText("");
    setFilterStatus("");
    setCurrentPage(1);
    setFormMode(null);
    setForm({
      id: 0,
      warrantyNo: "",
      customerName: "",
      productName: "",
      purchaseDate: "",
      warrantyPeriod: "",
      status: EXPIRED_STATUSES[0],
    });
    loadData();
    console.log("Warranties handleClear");
  };

  const handleReport = () => {
    alert("Warranty Report:\n\n" + JSON.stringify(filteredData, null, 2));
    console.log("Warranties handleReport:", { filteredData });
  };

  const columns: Column[] = [
    { key: "warrantyNo", label: "Warranty No", align: "left" },
    {
      key: "customerName",
      label: "Customer Name",
      align: "left",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "productName", label: "Product Name", align: "left" },
    {
      key: "purchaseDate",
      label: "Purchase Date",
      align: "left",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    { key: "warrantyPeriod", label: "Warranty Period", align: "left" },
    { key: "status", label: "Status", align: "center", render: renderStatusBadge },
  ];

  const rowActions = (row: WarrantyRecord) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit ${row.warrantyNo}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete ${row.warrantyNo}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete</span>
      </button>
    </>
  );

  const customFilters = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        type="text"
        placeholder="Search Warranty No/Customer Name"
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          setCurrentPage(1);
          console.log("Warranties handleSearchChange:", { searchText: e.target.value });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search by warranty number or customer name"
      />
      <select
        value={filterStatus}
        onChange={(e) => {
          setFilterStatus(e.target.value);
          setCurrentPage(1);
          console.log("Warranties handleFilterStatusChange:", { filterStatus: e.target.value });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by status"
      >
        <option value="">All Status</option>
        {EXPIRED_STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="warrantyNo" className="block text-sm font-medium mb-1">
          Warranty No <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="warrantyNo"
          name="warrantyNo"
          value={form.warrantyNo}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter warranty number"
          required
          aria-label="Enter warranty number"
        />
      </div>
      <div>
        <label htmlFor="customerName" className="block text-sm font-medium mb-1">
          Customer Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="customerName"
          name="customerName"
          value={form.customerName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter customer name"
          required
          aria-label="Enter customer name"
        />
      </div>
      <div>
        <label htmlFor="productName" className="block text-sm font-medium mb-1">
          Product Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="productName"
          name="productName"
          value={form.productName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter product name"
          required
          aria-label="Enter product name"
        />
      </div>
      <div>
        <label htmlFor="purchaseDate" className="block text-sm font-medium mb-1">
          Purchase Date <span className="text-destructive">*</span>
        </label>
        <input
          type="date"
          id="purchaseDate"
          name="purchaseDate"
          value={form.purchaseDate}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
          aria-label="Select purchase date"
        />
      </div>
      <div>
        <label htmlFor="warrantyPeriod" className="block text-sm font-medium mb-1">
          Warranty Period <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="warrantyPeriod"
          name="warrantyPeriod"
          value={form.warrantyPeriod}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g., 1 year"
          required
          aria-label="Enter warranty period"
        />
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium mb-1">
          Status <span className="text-destructive">*</span>
        </label>
        <select
          id="status"
          name="status"
          value={form.status}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
          aria-label="Select status"
        >
          <option value="">Select Status</option>
          {EXPIRED_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Warranties"
      description="Manage warranty records."
      icon="fa fa-shield-alt"
      onAddClick={() => {
        setForm({
          id: 0,
          warrantyNo: "",
          customerName: "",
          productName: "",
          purchaseDate: "",
          warrantyPeriod: "",
          status: EXPIRED_STATUSES[0],
        });
        setFormMode("add");
      }}
      onRefresh={handleClear}
      onReport={handleReport}
      search={searchText}
      onSearchChange={(e) => {
        setSearchText(e.target.value);
        setCurrentPage(1);
        console.log("Warranties handleSearchChange:", { searchText: e.target.value });
      }}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={formMode === "add" ? "Add Warranty" : "Edit Warranty"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
    />
  );
}