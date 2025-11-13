import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";

interface Holiday {
  id: number;
  holidayName: string;
  holidayDate: string;
  day: string;
  description: string;
}

export default function Holidays() {
  const [data, setData] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<Holiday>({
    id: 0,
    holidayName: "",
    holidayDate: "",
    day: "",
    description: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<Holiday[]>("Holidays");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("Holidays loadData:", { data: response.result });
  };

  // Auto-calculate day based on holidayDate
  useEffect(() => {
    if (form.holidayDate) {
      const dateObj = new Date(form.holidayDate);
      if (!isNaN(dateObj.getTime())) {
        const dayName = dateObj.toLocaleDateString("en-US", {
          weekday: "long",
        });
        setForm((prev) => ({ ...prev, day: dayName }));
      }
    } else {
      setForm((prev) => ({ ...prev, day: "" }));
    }
  }, [form.holidayDate]);

  const filteredData = useMemo(() => {
    const result = data.filter((holiday) => {
      const matchesName = holiday.holidayName
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const matchesDate = !searchDate || holiday.holidayDate === searchDate;
      return matchesName && matchesDate;
    });
    console.log("Holidays filteredData:", result, { searchName, searchDate });
    return result;
  }, [data, searchName, searchDate]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("Holidays paginatedData:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
      totalItems: filteredData.length,
    });
    return result;
  }, [filteredData, currentPage, itemsPerPage]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.holidayName.trim() || !form.holidayDate || !form.day) {
      alert("Please fill in Holiday Name, Date, and Day.");
      return;
    }
    if (formMode === "add") {
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [...prev, { id: newId, ...form }]);
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
      holidayName: "",
      holidayDate: "",
      day: "",
      description: "",
    });
    console.log("Holidays handleFormSubmit:", { form, formMode });
  };

  const handleEdit = (holiday: Holiday) => {
    setForm(holiday);
    setFormMode("edit");
    console.log("Holidays handleEdit:", { holiday });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this holiday?")) {
      setData((prev) => prev.filter((h) => h.id !== id));
      if (
        (currentPage - 1) * itemsPerPage >= filteredData.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
      console.log("Holidays handleDelete:", { id });
    }
  };

  const handleClear = () => {
    setSearchName("");
    setSearchDate("");
    setCurrentPage(1);
    setForm({
      id: 0,
      holidayName: "",
      holidayDate: "",
      day: "",
      description: "",
    });
    setFormMode(null);
    loadData();
    console.log("Holidays handleClear");
  };

  const handleReport = () => {
    alert("Holidays Report:\n\n" + JSON.stringify(filteredData, null, 2));
  };

  const columns: Column[] = [
    {
      key: "holidayName",
      label: "Holiday Name",
      align: "left",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "holidayDate", label: "Holiday Date", align: "left" },
    { key: "day", label: "Day", align: "left" },
    { key: "description", label: "Description", align: "left" },
  ];

  const rowActions = (row: Holiday) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit  ${row.holidayName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit employee</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete  ${row.holidayName}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete employee</span>
      </button>
    </>
  );

  const customFilters = () => (
    <div className="grid grid-cols-2 w-full justify-stretch px-3">
      <div className="flex justify-start  gap-2">
        <SearchInput
          className=""
          placeholder="Search Holiday Name"
          value={searchName}
          onSearch={(query) => {
            setSearchName(query);
            setCurrentPage(1);
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <SearchInput
          className=""
          type="date"
          value={searchDate}
          onSearch={(query) => {
            setSearchDate(query);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="holidayName" className="block text-sm font-medium mb-1">
          Holiday Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="holidayName"
          name="holidayName"
          value={form.holidayName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter holiday name"
          required
          aria-label="Enter holiday name"
        />
      </div>
      <div>
        <label htmlFor="holidayDate" className="block text-sm font-medium mb-1">
          Holiday Date <span className="text-destructive">*</span>
        </label>
        <input
          type="date"
          id="holidayDate"
          name="holidayDate"
          value={form.holidayDate}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
          aria-label="Select holiday date"
        />
      </div>
      <div>
        <label htmlFor="day" className="block text-sm font-medium mb-1">
          Day <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="day"
          name="day"
          value={form.day}
          readOnly
          className="w-full border border-input rounded bg-muted px-3 py-2 cursor-not-allowed"
          placeholder="Day auto-filled"
          required
          aria-label="Holiday day (auto-filled)"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleInputChange}
          rows={2}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          placeholder="Enter description"
          aria-label="Enter holiday description"
        />
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Holidays"
      description="Manage holiday records."
      icon="fa fa-calendar-day"
      onAddClick={() => {
        setForm({
          id: 0,
          holidayName: "",
          holidayDate: "",
          day: "",
          description: "",
        });
        setFormMode("add");
      }}
      onRefresh={handleClear}
      onReport={handleReport}
      search={searchName}
      onSearchChange={(e) => {
        setSearchName(e.target.value);
        setCurrentPage(1);
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
      modalTitle={formMode === "add" ? "Add Holiday" : "Edit Holiday"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
      loading={loading}
    />
  );
}
