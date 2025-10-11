import { apiService } from "@/services/ApiService";
import React, { useEffect, useMemo, useState } from "react";

const couponTypes = ["Percentage", "Flat"];
const couponStatuses = ["Active", "Inactive"];

export default function Coupons() {
  const [form, setForm] = useState({
    couponCode: "",
    couponType: "Percentage",
    discountAmount: "",
    maxDiscountAmount: "",
    minPurchaseAmount: "",
    startDate: "",
    endDate: "",
    status: "Active",
  });

  const [coupons, setCoupons] = useState([]);

  const [data, setData] = useState<>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination calculation
  const filteredCoupons = useMemo(() => {
    if (!search.trim()) return coupons;
    return coupons.filter((c) =>
      c.couponCode.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, coupons]);

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const currentCoupons = filteredCoupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    document.title = "Coupons - Dreams POS";
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Coupons");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = () => {
    // Validate required fields (couponCode, discountAmount, startDate, endDate)
    if (
      !form.couponCode.trim() ||
      !form.discountAmount.trim() ||
      !form.startDate.trim() ||
      !form.endDate.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    if (editId !== null) {
      // Edit existing
      setCoupons((prev) =>
        prev.map((c) => (c.id === editId ? { ...form, id: editId } : c))
      );
      setEditId(null);
    } else {
      // Add new
      const newId = coupons.length
        ? Math.max(...coupons.map((c) => c.id)) + 1
        : 1;
      setCoupons((prev) => [...prev, { ...form, id: newId }]);
    }
    setForm({
      couponCode: "",
      couponType: "Percentage",
      discountAmount: "",
      maxDiscountAmount: "",
      minPurchaseAmount: "",
      startDate: "",
      endDate: "",
      status: "Active",
    });
  };

  const handleEdit = (id: number) => {
    const coupon = coupons.find((c) => c.id === id);
    if (coupon) {
      setForm({ ...coupon });
      setEditId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      if (editId === id) {
        setEditId(null);
        setForm({
          couponCode: "",
          couponType: "Percentage",
          discountAmount: "",
          maxDiscountAmount: "",
          minPurchaseAmount: "",
          startDate: "",
          endDate: "",
          status: "Active",
        });
      }
    }
  };

  const handleRefresh = () => {
    setForm({
      couponCode: "",
      couponType: "Percentage",
      discountAmount: "",
      maxDiscountAmount: "",
      minPurchaseAmount: "",
      startDate: "",
      endDate: "",
      status: "Active",
    });
    setEditId(null);
  };

  const handleReport = () => {
    // For demo, just alert JSON data
    alert("Coupon Report:\n\n" + JSON.stringify(coupons, null, 2));
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-800">
      <title>Coupons - Dreams POS</title>

      {/* Page Title */}
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">Coupons</h1>

      {/* Coupon Form Section */}
      <section className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add / Edit Coupon</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          noValidate
        >
          {/* Coupon Code */}
          <div className="flex flex-col">
            <label
              htmlFor="couponCode"
              className="mb-1 font-medium text-gray-700"
            >
              Coupon Code <span className="text-red-600">*</span>
            </label>
            <input
              id="couponCode"
              name="couponCode"
              type="text"
              value={form.couponCode}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter coupon code"
              required
            />
          </div>

          {/* Coupon Type */}
          <div className="flex flex-col">
            <label
              htmlFor="couponType"
              className="mb-1 font-medium text-gray-700"
            >
              Coupon Type
            </label>
            <select
              id="couponType"
              name="couponType"
              value={form.couponType}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {couponTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Discount Amount */}
          <div className="flex flex-col">
            <label
              htmlFor="discountAmount"
              className="mb-1 font-medium text-gray-700"
            >
              Discount Amount <span className="text-red-600">*</span>
            </label>
            <input
              id="discountAmount"
              name="discountAmount"
              type="number"
              min={0}
              value={form.discountAmount}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter discount amount"
              required
            />
          </div>

          {/* Max Discount Amount */}
          <div className="flex flex-col">
            <label
              htmlFor="maxDiscountAmount"
              className="mb-1 font-medium text-gray-700"
            >
              Max Discount Amount
            </label>
            <input
              id="maxDiscountAmount"
              name="maxDiscountAmount"
              type="number"
              min={0}
              value={form.maxDiscountAmount}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter max discount amount"
            />
          </div>

          {/* Min Purchase Amount */}
          <div className="flex flex-col">
            <label
              htmlFor="minPurchaseAmount"
              className="mb-1 font-medium text-gray-700"
            >
              Min Purchase Amount
            </label>
            <input
              id="minPurchaseAmount"
              name="minPurchaseAmount"
              type="number"
              min={0}
              value={form.minPurchaseAmount}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter min purchase amount"
            />
          </div>

          {/* Start Date */}
          <div className="flex flex-col">
            <label
              htmlFor="startDate"
              className="mb-1 font-medium text-gray-700"
            >
              Start Date <span className="text-red-600">*</span>
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col">
            <label htmlFor="endDate" className="mb-1 font-medium text-gray-700">
              End Date <span className="text-red-600">*</span>
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label htmlFor="status" className="mb-1 font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {couponStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-end space-x-4 md:col-span-3">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow flex items-center"
              title={editId !== null ? "Update Coupon" : "Save Coupon"}
            >
              <i className="fa fa-save mr-2" aria-hidden="true"></i>
              {editId !== null ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded shadow flex items-center"
              title="Refresh Form"
            >
              <i className="fa fa-refresh mr-2" aria-hidden="true"></i>
              Refresh
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow flex items-center ml-auto"
              title="Generate Report"
            >
              <i className="fa fa-file-text-o mr-2" aria-hidden="true"></i>
              Report
            </button>
          </div>
        </form>
      </section>

      {/* Coupons List Section */}
      <section className="bg-white rounded shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="text-xl font-semibold mb-3 md:mb-0">Coupons List</h2>
          <input
            type="text"
            placeholder="Search by Coupon Code"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-3 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search coupons"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">#</th>
                <th className="border border-gray-300 px-4 py-2">
                  Coupon Code
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Coupon Type
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Discount Amount
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Max Discount Amount
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Min Purchase Amount
                </th>
                <th className="border border-gray-300 px-4 py-2">Start Date</th>
                <th className="border border-gray-300 px-4 py-2">End Date</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentCoupons.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="border border-gray-300 px-4 py-4 text-center text-gray-500"
                  >
                    No coupons found.
                  </td>
                </tr>
              ) : (
                currentCoupons.map((coupon, idx) => (
                  <tr
                    key={coupon.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">
                      {coupon.couponCode}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {coupon.couponType}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {coupon.discountAmount}
                      {coupon.couponType === "Percentage" ? "%" : ""}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {coupon.maxDiscountAmount || "-"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {coupon.minPurchaseAmount || "-"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {coupon.startDate}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {coupon.endDate}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          coupon.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {coupon.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(coupon.id)}
                        title="Edit Coupon"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        title="Delete Coupon"
                        className="text-red-600 hover:text-red-800"
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <nav
          className="flex justify-between items-center mt-4"
          aria-label="Pagination"
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border border-gray-300 ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Previous page"
          >
            <i className="fa fa-chevron-left" aria-hidden="true"></i>
          </button>
          <ul className="inline-flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page}>
                <button
                  onClick={() => handlePageChange(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`px-3 py-1 rounded border border-gray-300 ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border border-gray-300 ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Next page"
          >
            <i className="fa fa-chevron-right" aria-hidden="true"></i>
          </button>
        </nav>
      </section>
    </div>
  );
}
