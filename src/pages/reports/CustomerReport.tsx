import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";
import { renderStatusBadge } from "@/utils/tableUtils";
import { STATUSES } from "@/constants/constants";

interface CustomerData {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalPurchase: number;
  lastPurchaseDate: string;
  status: string;
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any, idx?: number) => JSX.Element;
  align?: "left" | "center" | "right";
}

export default function CustomerReport() {
  const [data, setData] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<CustomerData[]>("CustomerReport");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("CustomerReport loadData:", { data: response.result });
  };

  const filteredData = useMemo(() => {
    const result = data.filter((item) => {
      return (
        item.name.toLowerCase().includes(searchName.toLowerCase()) &&
        item.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
        item.phone.toLowerCase().includes(searchPhone.toLowerCase()) &&
        (filterStatus === "" || item.status === filterStatus)
      );
    });
    console.log("CustomerReport filteredData:", result, {
      searchName,
      searchEmail,
      searchPhone,
      filterStatus,
    });
    return result;
  }, [data, searchName, searchEmail, searchPhone, filterStatus]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("CustomerReport paginatedData:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
      totalItems: filteredData.length,
    });
    return result;
  }, [filteredData, currentPage, itemsPerPage]);

  const handleClear = () => {
    setSearchName("");
    setSearchEmail("");
    setSearchPhone("");
    setFilterStatus("");
    setCurrentPage(1);
    setItemsPerPage(10);
    loadData();
    console.log("CustomerReport handleClear");
  };

  const handleReport = () => {
    alert("Customer Report:\n\n" + JSON.stringify(filteredData, null, 2));
    console.log("CustomerReport handleReport:", { filteredData });
  };

  const columns: Column[] = [
    {
      key: "name",
      label: "Name",
      align: "left",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "email", label: "Email", align: "left" },
    { key: "phone", label: "Phone", align: "left" },
    {
      key: "totalPurchase",
      label: "Total Purchase",
      align: "right",
      render: (value) => `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    { key: "lastPurchaseDate", label: "Last Purchase Date", align: "left" },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: renderStatusBadge,
    }, 
  ];

  const customFilters = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        type="text"
        placeholder="Name"
        value={searchName}
        onChange={(e) => {
          setSearchName(e.target.value);
          setCurrentPage(1);
          console.log("CustomerReport handleSearchNameChange:", {
            searchName: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search by name"
      />
      <input
        type="email"
        placeholder="Email"
        value={searchEmail}
        onChange={(e) => {
          setSearchEmail(e.target.value);
          setCurrentPage(1);
          console.log("CustomerReport handleSearchEmailChange:", {
            searchEmail: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search by email"
      />
      <input
        type="text"
        placeholder="Phone"
        value={searchPhone}
        onChange={(e) => {
          setSearchPhone(e.target.value);
          setCurrentPage(1);
          console.log("CustomerReport handleSearchPhoneChange:", {
            searchPhone: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search by phone"
      />
      <select
        value={filterStatus}
        onChange={(e) => {
          setFilterStatus(e.target.value);
          setCurrentPage(1);
          console.log("CustomerReport handleFilterStatusChange:", {
            filterStatus: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by status"
      >
        <option value="">All Statuses</option>
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );

  // Optional: Add tableFooter for totalPurchase if desired
  const tableFooter = () => (
    <tfoot className="bg-muted font-semibold text-foreground">
      <tr>
        <td className="px-4 py-3 text-right" colSpan={3}>
          Total
        </td>
        <td className="px-4 py-3 text-right">{`₹${filteredData
          .reduce((acc, cur) => acc + cur.totalPurchase, 0)
          .toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
        <td className="px-4 py-3" colSpan={2}></td>
      </tr>
    </tfoot>
  );

  return (
    <PageBase1
      title="Customer Report"
      description="View and filter customer records."
      icon="fa fa-user"
      onRefresh={handleClear}
      onReport={handleReport}
      search={searchName}
      onSearchChange={(e) => {
        setSearchName(e.target.value);
        setCurrentPage(1);
        console.log("CustomerReport handleSearchNameChange:", {
          searchName: e.target.value,
        });
      }}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      tableFooter={tableFooter} // Optional: Omit if totals are not needed
      customFilters={customFilters}
    />
  );
}