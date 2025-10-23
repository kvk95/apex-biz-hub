import { apiService } from "@/services/ApiService";
import React, { useEffect, useMemo, useState } from "react";
import { PageBase1 } from "@/pages/PageBase1";

const statusOptions = ["Active", "Expired"];

interface GiftCard {
  id: number;
  cardNumber: string;
  cardHolder: string;
  issueDate: string;
  expiryDate: string;
  balance: number;
  status: string;
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any, idx?: number) => JSX.Element;
}

interface ThemeStyles {
  selectionBg: string;
  hoverColor: string;
}

export default function GiftCards() {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState({
    id: null as number | null,
    cardNumber: "",
    cardHolder: "",
    issueDate: "",
    expiryDate: "",
    balance: "",
    status: statusOptions[0],
  });
  const [data, setData] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<GiftCard[]>("GiftCards");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("GiftCards loadData:", { data: response.result });
  };

  const filteredData = useMemo(() => {
    const result = !search.trim()
      ? data
      : data.filter(
          (card) =>
            card.cardNumber.toLowerCase().includes(search.toLowerCase()) ||
            card.cardHolder.toLowerCase().includes(search.toLowerCase())
        );
    console.log("GiftCards filteredData:", result, { search });
    return result;
  }, [data, search]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("GiftCards paginatedData:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
      totalItems: filteredData.length,
    });
    return result;
  }, [filteredData, currentPage, itemsPerPage]);

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
      cardNumber: "",
      cardHolder: "",
      issueDate: "",
      expiryDate: "",
      balance: "",
      status: statusOptions[0],
    });
    console.log("GiftCards handleAddClick: Modal opened for add" );
  };

  const handleEdit = (card: GiftCard) => {
    setFormMode("edit");
    setForm({
      id: card.id,
      cardNumber: card.cardNumber,
      cardHolder: card.cardHolder,
      issueDate: card.issueDate,
      expiryDate: card.expiryDate,
      balance: card.balance.toString(),
      status: card.status,
    });
    console.log("GiftCards handleEdit: Modal opened for edit", { card });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.cardNumber.trim() ||
      !form.cardHolder.trim() ||
      !form.issueDate ||
      !form.expiryDate ||
      !form.balance
    ) {
      alert("Please fill all required fields.");
      return;
    }
    const balance = Number(form.balance);
    if (isNaN(balance) || balance < 0) {
      alert("Balance must be a valid number greater than or equal to 0");
      return;
    }
    if (
      data.some(
        (card) =>
          card.cardNumber.toLowerCase() === form.cardNumber.toLowerCase() &&
          (formMode === "edit" && card.id !== form.id)
      )
    ) {
      alert("Card Number must be unique.");
      return;
    }
    if (form.issueDate && form.expiryDate && form.issueDate > form.expiryDate) {
      alert("Expiry Date must be after Issue Date.");
      return;
    }
    if (formMode === "edit" && form.id !== null) {
      setData((prev) =>
        prev.map((card) =>
          card.id === form.id ? { ...form, id: form.id, balance } : card
        )
      );
    }
    setFormMode(null);
    console.log("GiftCards handleFormSubmit:", { form, formMode });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this gift card?")) {
      setData((prev) => prev.filter((card) => card.id !== id));
      const totalPages = Math.ceil((filteredData.length - 1) / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
        console.log("GiftCards handleDelete: Adjusted to last page", {
          id,
          currentPage,
          totalPages,
        });
      } else if (totalPages === 0) {
        setCurrentPage(1);
        console.log("GiftCards handleDelete: Reset to page 1 (no data)", {
          id,
          currentPage,
          totalPages,
        });
      }
      console.log("GiftCards handleDelete:", { id, totalPages });
    }
  };

  const handleClear = () => {
    loadData();
    setFormMode(null);
    setSearch("");
    setCurrentPage(1);
    setForm({
      id: null,
      cardNumber: "",
      cardHolder: "",
      issueDate: "",
      expiryDate: "",
      balance: "",
      status: statusOptions[0],
    });
    console.log("GiftCards handleClear");
  };

  const handleReport = () => {
    alert("Gift Cards Report:\n\n" + JSON.stringify(data, null, 2));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    console.log("GiftCards handleSearchChange:", {
      search: e.target.value,
      currentPage: 1,
    });
  };

  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      console.log("GiftCards handlePageChange:", {
        page,
        totalPages,
        currentPage,
      });
    } else {
      console.warn("GiftCards handlePageChange: Invalid page or same page", {
        page,
        totalPages,
        currentPage,
      });
    }
  };

  const columns: Column[] = [
    {
      key: "index",
      label: "#",
      render: (_, __, idx) => (currentPage - 1) * itemsPerPage + (idx ?? 0) + 1,
    },
    {
      key: "cardNumber",
      label: "Card Number",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "cardHolder", label: "Card Holder" },
    { key: "issueDate", label: "Issue Date" },
    { key: "expiryDate", label: "Expiry Date" },
    {
      key: "balance",
      label: "Balance",
      render: (value) => `$${Number(value).toFixed(2)}`,
    },
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

  const rowActions = (row: GiftCard) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit gift card ${row.cardNumber}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit gift card</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete gift card ${row.cardNumber}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete gift card</span>
      </button>
    </>
  );

  const modalForm = (themeStyles: ThemeStyles) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label
          htmlFor="cardNumber"
          className="block text-sm font-medium mb-1"
        >
          Card Number <span className="text-destructive">*</span>
        </label>
        <input
          id="cardNumber"
          name="cardNumber"
          type="text"
          value={form.cardNumber}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="XXXX XXXX XXXX XXXX"
          required
          maxLength={19}
          pattern="[\d\s]+"
          title="Card number format: digits and spaces only"
        />
      </div>
      <div>
        <label
          htmlFor="cardHolder"
          className="block text-sm font-medium mb-1"
        >
          Card Holder <span className="text-destructive">*</span>
        </label>
        <input
          id="cardHolder"
          name="cardHolder"
          type="text"
          value={form.cardHolder}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Full Name"
          required
        />
      </div>
      <div>
        <label
          htmlFor="issueDate"
          className="block text-sm font-medium mb-1"
        >
          Issue Date <span className="text-destructive">*</span>
        </label>
        <input
          id="issueDate"
          name="issueDate"
          type="date"
          value={form.issueDate}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>
      <div>
        <label
          htmlFor="expiryDate"
          className="block text-sm font-medium mb-1"
        >
          Expiry Date <span className="text-destructive">*</span>
        </label>
        <input
          id="expiryDate"
          name="expiryDate"
          type="date"
          value={form.expiryDate}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>
      <div>
        <label
          htmlFor="balance"
          className="block text-sm font-medium mb-1"
        >
          Balance <span className="text-destructive">*</span>
        </label>
        <input
          id="balance"
          name="balance"
          type="number"
          min="0"
          step="0.01"
          value={form.balance}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="0.00"
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
    </div>
  );

  return (
    <PageBase1
      title="Gift Cards"
      description="Manage gift cards for your application."
      icon="fa fa-gift"
      onAddClick={handleAddClick}
      onRefresh={handleClear}
      onReport={handleReport}
      search={search}
      onSearchChange={handleSearchChange}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={handlePageChange}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={formMode === "add" ? "Add Discount" : "Edit Discount"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
    />
  );
}
