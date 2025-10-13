import React, { useState, useEffect } from "react";
import { useApiService } from "@/hooks/useApiService";
import { apiService } from "@/services/ApiService";

const pageSize = 5;

interface OtpSetting {
  id: number;
  otpType: string;
  otpLength: number;
  otpValidity: number;
  otpResendTime: number;
  otpMessage: string;
  status: string;
}

export default function OtpSettings() {
  const [otpType, setOtpType] = useState("Numeric");
  const [otpLength, setOtpLength] = useState(6);
  const [otpValidity, setOtpValidity] = useState(5);
  const [otpResendTime, setOtpResendTime] = useState(1);
  const [otpMessage, setOtpMessage] = useState(
    "Your OTP is {{otp}}. Please do not share it with anyone."
  );
  const [status, setStatus] = useState("Active");
  const [data, setData] = useState<OtpSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<OtpSetting[]>("OtpSettings");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSave = () => {
    const existingIndex = data.findIndex(
      (item) =>
        item.otpType === otpType &&
        item.otpLength === otpLength &&
        item.otpValidity === otpValidity &&
        item.otpResendTime === otpResendTime
    );
    if (existingIndex !== -1) {
      const newData = [...data];
      newData[existingIndex] = {
        ...newData[existingIndex],
        otpMessage,
        status,
      };
      setData(newData);
      alert("OTP Setting updated successfully.");
    } else {
      const newEntry = {
        id: data.length + 1,
        otpType,
        otpLength,
        otpValidity,
        otpResendTime,
        otpMessage,
        status,
      };
      setData([newEntry, ...data]);
      alert("OTP Setting added successfully.");
    }
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setOtpType("Numeric");
    setOtpLength(6);
    setOtpValidity(5);
    setOtpResendTime(1);
    setOtpMessage("Your OTP is {{otp}}. Please do not share it with anyone.");
    setStatus("Active");
  };

  const handleEdit = (item: OtpSetting) => {
    setOtpType(item.otpType);
    setOtpLength(item.otpLength);
    setOtpValidity(item.otpValidity);
    setOtpResendTime(item.otpResendTime);
    setOtpMessage(item.otpMessage);
    setStatus(item.status);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReport = () => {
    alert("Report Data:\n" + JSON.stringify(data, null, 2));
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <title>OTP Settings</title>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-semibold mb-6">OTP Settings</h1>

        <section className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add / Edit OTP Settings</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="otpType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  OTP Type
                </label>
                <select
                  id="otpType"
                  value={otpType}
                  onChange={(e) => setOtpType(e.target.value)}
                  className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option>Numeric</option>
                  <option>Alphanumeric</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="otpLength"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  OTP Length
                </label>
                <input
                  type="number"
                  id="otpLength"
                  min={1}
                  max={10}
                  value={otpLength}
                  onChange={(e) => setOtpLength(Number(e.target.value))}
                  className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="otpValidity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  OTP Validity (Minutes)
                </label>
                <input
                  type="number"
                  id="otpValidity"
                  min={1}
                  max={60}
                  value={otpValidity}
                  onChange={(e) => setOtpValidity(Number(e.target.value))}
                  className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="otpResendTime"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  OTP Resend Time (Minutes)
                </label>
                <input
                  type="number"
                  id="otpResendTime"
                  min={1}
                  max={60}
                  value={otpResendTime}
                  onChange={(e) => setOtpResendTime(Number(e.target.value))}
                  className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="otpMessage"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  OTP Message
                </label>
                <textarea
                  id="otpMessage"
                  rows={3}
                  value={otpMessage}
                  onChange={(e) => setOtpMessage(e.target.value)}
                  className="block w-full rounded border border-gray-300 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter OTP message template"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use <code className="font-mono bg-gray-100 px-1 rounded">{"{{otp}}"}</code> as placeholder for OTP code.
                </p>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <i className="fa fa-save mr-2" aria-hidden="true"></i> Save
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <i className="fa fa-refresh mr-2" aria-hidden="true"></i> Refresh
              </button>
              <button
                type="button"
                onClick={handleReport}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <i className="fa fa-file-text-o mr-2" aria-hidden="true"></i> Report
              </button>
            </div>
          </form>
        </section>

        <section className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">OTP Settings List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">#</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">OTP Type</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">OTP Length</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">OTP Validity (min)</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">OTP Resend Time (min)</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">OTP Message</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="px-4 py-3">{item.otpType}</td>
                    <td className="px-4 py-3">{item.otpLength}</td>
                    <td className="px-4 py-3">{item.otpValidity}</td>
                    <td className="px-4 py-3">{item.otpResendTime}</td>
                    <td className="px-4 py-3 truncate max-w-xs" title={item.otpMessage}>
                      {item.otpMessage}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                          item.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                        aria-label={`Edit OTP setting ${item.id}`}
                        title="Edit"
                      >
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-gray-500">
                      No OTP settings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-semibold">
                {(currentPage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold">
                {Math.min(currentPage * pageSize, data.length)}
              </span>{" "}
              of <span className="font-semibold">{data.length}</span> entries
            </div>
            <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}
                aria-label="Previous"
              >
                <i className="fa fa-chevron-left" aria-hidden="true"></i>
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                      currentPage === page
                        ? "z-10 bg-indigo-600 border-indigo-600 text-white"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                  currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
                }`}
                aria-label="Next"
              >
                <i className="fa fa-chevron-right" aria-hidden="true"></i>
              </button>
            </nav>
          </div>
        </section>
      </div>
    </div>
  );
}