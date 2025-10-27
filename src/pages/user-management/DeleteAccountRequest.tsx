import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";
import { APPROVAL_STATUSES } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";

interface DeleteAccountRecord {
  id: number;
  requestNo: string;
  customerName: string;
  email: string;
  phone: string;
  requestDate: string;
  status: (typeof APPROVAL_STATUSES)[number];
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any, idx?: number) => JSX.Element;
  align?: "left" | "center" | "right";
}

interface RowAction {
  label: string;
  onClick: (row: any, idx: number) => void;
  className?: string;
}

export default function DeleteAccountRequest() {
  const [data, setData] = useState<DeleteAccountRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [requestDate, setRequestDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<DeleteAccountRecord[]>(
        "DeleteAccountRequest"
      );
      console.log("DeleteAccountRequest loadData response:", response);
      if (response.status.code === "S") {
        setData(response.result || []);
        setError(null);
      } else {
        setError(response.status.description || "Failed to fetch data");
      }
    } catch (err) {
      setError("Error fetching data: " + (err as Error).message);
    }
    setLoading(false);
  };

  const filteredData = useMemo(() => {
    const result = data.filter((item) => {
      const matchStatus =
        statusFilter !== "All" ? item.status === statusFilter : true;
      const matchDate = requestDate ? item.requestDate === requestDate : true;
      return matchStatus && matchDate;
    });
    console.log("DeleteAccountRequest filteredData:", {
      result,
      count: result.length,
      statusFilter,
      requestDate,
      inputDataCount: data.length,
    });
    // Reset currentPage if it exceeds available pages
    const maxPage = Math.max(1, Math.ceil(result.length / itemsPerPage));
    if (currentPage > maxPage) {
      setCurrentPage(1);
    }
    return result;
  }, [data, statusFilter, requestDate, itemsPerPage, currentPage]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("DeleteAccountRequest paginatedData:", {
      result,
      count: result.length,
      currentPage,
      start,
      end,
      itemsPerPage,
      totalItems: filteredData.length,
    });
    return result;
  }, [filteredData, currentPage, itemsPerPage]);

  const handleClear = () => {
    setStatusFilter("All");
    setRequestDate("");
    setCurrentPage(1);
    loadData();
    console.log("DeleteAccountRequest handleClear");
  };

  const handleReport = () => {
    const reportData = {
      statusFilter,
      requestDate,
      records: filteredData,
    };
    alert(
      "Delete Account Requests Report:\n\n" +
        JSON.stringify(reportData, null, 2)
    );
    console.log("DeleteAccountRequest handleReport:", reportData);
  };

  const handleDelete = (row: DeleteAccountRecord) => {
    if (
      window.confirm(
        `Are you sure you want to delete request ${row.requestNo}?`
      )
    ) {
      setData((prev) => prev.filter((item) => item.id !== row.id));
      console.log("DeleteAccountRequest handleDelete:", {
        id: row.id,
        requestNo: row.requestNo,
      });
      // Reset currentPage if the current page becomes empty
      const maxPage = Math.max(
        1,
        Math.ceil((filteredData.length - 1) / itemsPerPage)
      );
      if (currentPage > maxPage) {
        setCurrentPage(maxPage);
      }
    }
  };

  const columns: Column[] = [
    {
      key: "requestNo",
      label: "Request No",
      align: "left",
      render: (value) => (
        <span className="font-semibold font-mono text-blue-600 dark:text-blue-400">
          {value || "N/A"}
        </span>
      ),
    },
    {
      key: "customerName",
      label: "Customer Name",
      align: "left",
      render: (value) => value || "N/A",
    },
    {
      key: "email",
      label: "Email",
      align: "left",
      render: (value) => value || "N/A",
    },
    {
      key: "phone",
      label: "Phone",
      align: "left",
      render: (value) => value || "N/A",
    },
    {
      key: "requestDate",
      label: "Request Date",
      align: "left",
      render: (value) =>
        value
          ? new Date(value).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A",
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: renderStatusBadge,
    },
  ];

  const rowActions1: RowAction[] = [
    {
      label: "Delete",
      onClick: handleDelete,
      className: "text-red-600 hover:text-red-800",
    },
  ];

  const rowActions = (row: DeleteAccountRecord) => (
    <>
      <button
        onClick={() => handleDelete(row)}
        aria-label={`Delete  ${row.customerName}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete</span>
      </button>
    </>
  );

  const customFilters = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <select
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          setCurrentPage(1);
          console.log("DeleteAccountRequest handleStatusFilterChange:", {
            statusFilter: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by status"
      >
        {["All", ...APPROVAL_STATUSES].map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={requestDate}
        onChange={(e) => {
          setRequestDate(e.target.value);
          setCurrentPage(1);
          console.log("DeleteAccountRequest handleRequestDateChange:", {
            requestDate: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by request date"
      />
    </div>
  );

  return (
    <PageBase1
      title="Delete Account Requests"
      description="View and manage account deletion requests."
      icon="fa fa-user-slash"
      onRefresh={handleClear}
      onReport={handleReport}
      search=""
      onSearchChange={() => {}} // No text-based search field
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      customFilters={customFilters}
      loading={loading}
      error={error}
    />
  );
}
