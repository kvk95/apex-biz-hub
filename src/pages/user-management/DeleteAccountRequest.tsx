import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { formatDate } from "@/utils/tableUtils";

interface DeleteAccountRecord {
  id: number;
  requestNo: string;
  userName: string;
  email: string;
  phone: string;
  requestDate: string;
  role: string; // ← NEW
  image: string;
}

export default function DeleteAccountRequest() {
  const [data, setData] = useState<DeleteAccountRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingRecord, setDeletingRecord] =
    useState<DeleteAccountRecord | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<{
        status: { code: string };
        result: DeleteAccountRecord[];
      }>("DeleteAccountRequest");

      if (response.status.code === "S") {
        setData(response.result || []);
        setError(null);
      } else {
        setError(response.status.description || "Failed to fetch data");
        setData([]);
      }
    } catch (err) {
      setError("Error fetching data: " + (err as Error).message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const handleRefresh = () => {
    loadData();
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report:\n" + JSON.stringify(data, null, 2));
  };

  const handleDeleteClick = (row: DeleteAccountRecord) => {
    setDeletingRecord(row);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!deletingRecord) return;

    setData((prev) => prev.filter((r) => r.id !== deletingRecord.id));

    const remaining = data.length - 1;
    const maxPage = Math.max(1, Math.ceil(remaining / itemsPerPage));
    if (currentPage > maxPage) setCurrentPage(maxPage);

    setShowDeleteModal(false);
    setDeletingRecord(null);
  };

  /* ------------------------------------------------------------------ */
  const columns: Column[] = [
    {
      key: "userName",
      label: "User Name",
      render: (_, row: DeleteAccountRecord) => (
        <div className="flex items-center gap-3">
          {row.image ? (
            <img
              src={row.image}
              alt={row.userName}
              className="w-8 h-8 rounded-full object-cover border"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-white">
              {row.userName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="font-medium">{row.userName}</span>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (v) => v || "N/A",
    },
    {
      key: "role",
      label: "Role",
      render: (role: string) => (
        <span
          className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${
              role === "Admin"
                ? "bg-purple-100 text-purple-800"
                : role === "Manager"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }
          `}
        >
          {role}
        </span>
      ),
    },
    {
      key: "requestDate",
      label: "Delete Request Date",
      align:"center",
      render: (v) => formatDate(v, "dd MMM yyyy"),
    },
  ];

  const rowActions = (row: DeleteAccountRecord) => (
    <button
      onClick={() => handleDeleteClick(row)}
      aria-label={`Delete request ${row.requestNo}`}
      className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white rounded-lg text-xs p-2 inline-flex items-center"
    >
      <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
    </button>
  );
  /* ------------------------------------------------------------------ */

  return (
    <>
      <PageBase1
        title="Delete Account Requests"
        description="View and manage account deletion requests."
        onRefresh={handleRefresh}
        onReport={handleReport}
        search=""
        onSearchChange={() => {}}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={data.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setItemsPerPage}
        tableColumns={columns}
        tableData={paginatedData}
        rowActions={rowActions}
        loading={loading}
        error={error}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <i className="fa fa-trash text-red-500 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Request Account
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete request account?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingRecord(null);
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
