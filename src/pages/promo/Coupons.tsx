import { apiService } from "@/services/ApiService";
import React, { useEffect, useMemo, useState } from "react";
import { Pagination } from "@/components/Pagination/Pagination";

const couponTypes = ["Percentage", "Flat"];
const couponStatuses = ["Active", "Inactive"];

export default function Coupons() {
  const [form, setForm] = useState({
    couponCode: "",
    couponType: couponTypes[0],
    discountAmount: "",
    maxDiscountAmount: "",
    minPurchaseAmount: "",
    startDate: "",
    endDate: "",
    status: couponStatuses[0],
  });

  const [coupons, setCoupons] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    couponCode: "",
    couponType: couponTypes[0],
    discountAmount: "",
    maxDiscountAmount: "",
    minPurchaseAmount: "",
    startDate: "",
    endDate: "",
    status: couponStatuses[0],
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Pagination calculation with filtering
  const filteredCoupons = useMemo(() => {
    if (!search.trim()) return coupons;
    return coupons.filter((c) =>
      c.couponCode.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, coupons]);

  // Paginated data slice
  const paginatedData = filteredCoupons.slice(
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
      setCoupons(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  // Handlers for Add Section form inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Add Section (Add new coupon)
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
    const newId = coupons.length ? Math.max(...coupons.map((c) => c.id)) + 1 : 1;
    setCoupons((prev) => [...prev, { ...form, id: newId }]);
    setForm({
      couponCode: "",
      couponType: couponTypes[0],
      discountAmount: "",
      maxDiscountAmount: "",
      minPurchaseAmount: "",
      startDate: "",
      endDate: "",
      status: couponStatuses[0],
    });
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const coupon = coupons.find((c) => c.id === id);
    if (coupon) {
      setEditForm({ ...coupon });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (
      !editForm.couponCode.trim() ||
      !editForm.discountAmount.trim() ||
      !editForm.startDate.trim() ||
      !editForm.endDate.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    if (editId !== null) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === editId ? { ...editForm, id: editId } : c))
      );
      setEditId(null);
      setIsEditModalOpen(false);
    }
  };

  // Cancel editing modal
  const handleEditCancel = () => {
    setEditId(null);
    setIsEditModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      if (editId === id) {
        setEditId(null);
        setForm({
          couponCode: "",
          couponType: couponTypes[0],
          discountAmount: "",
          maxDiscountAmount: "",
          minPurchaseAmount: "",
          startDate: "",
          endDate: "",
          status: couponStatuses[0],
        });
      }
      // Adjust current page if needed
      if (
        (currentPage - 1) * itemsPerPage >= filteredCoupons.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setForm({
      couponCode: "",
      couponType: couponTypes[0],
      discountAmount: "",
      maxDiscountAmount: "",
      minPurchaseAmount: "",
      startDate: "",
      endDate: "",
      status: couponStatuses[0],
    });
    setEditId(null);
    setCurrentPage(1);
  };

  const handleReport = () => {
    // For demo, just alert JSON data
    alert("Coupon Report:\n\n" + JSON.stringify(coupons, null, 2));
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > Math.ceil(filteredCoupons.length / itemsPerPage)) return;
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      <title>Coupons - Dreams POS</title>

      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6">Coupons</h1>

      {/* Coupon Form Section (Add Section) - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coupon Code */}
          <div>
            <label
              htmlFor="couponCode"
              className="block text-sm font-medium mb-1"
            >
              Coupon Code <span className="text-destructive">*</span>
            </label>
            <input
              id="couponCode"
              name="couponCode"
              type="text"
              value={form.couponCode}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter coupon code"
              required
            />
          </div>

          {/* Coupon Type */}
          <div>
            <label
              htmlFor="couponType"
              className="block text-sm font-medium mb-1"
            >
              Coupon Type
            </label>
            <select
              id="couponType"
              name="couponType"
              value={form.couponType}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {couponTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Discount Amount */}
          <div>
            <label
              htmlFor="discountAmount"
              className="block text-sm font-medium mb-1"
            >
              Discount Amount <span className="text-destructive">*</span>
            </label>
            <input
              id="discountAmount"
              name="discountAmount"
              type="number"
              min={0}
              value={form.discountAmount}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter discount amount"
              required
            />
          </div>

          {/* Max Discount Amount */}
          <div>
            <label
              htmlFor="maxDiscountAmount"
              className="block text-sm font-medium mb-1"
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter max discount amount"
            />
          </div>

          {/* Min Purchase Amount */}
          <div>
            <label
              htmlFor="minPurchaseAmount"
              className="block text-sm font-medium mb-1"
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter min purchase amount"
            />
          </div>

          {/* Start Date */}
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

          {/* End Date */}
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

          {/* Status */}
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
              {couponStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-save" aria-hidden="true"></i> Save
          </button>

          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-refresh" aria-hidden="true"></i> Clear
          </button>

          <button
            onClick={handleReport}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-file-text-o" aria-hidden="true"></i> Report
          </button>
        </div>
      </section>

      {/* Coupons List Section */}
      <section className="bg-card rounded shadow py-6">
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
            className="border border-input rounded px-3 py-2 w-full md:w-64 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Search coupons"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Coupon Code
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Coupon Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Discount Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Max Discount Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Min Purchase Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Start Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  End Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No coupons found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((coupon, idx) => (
                  <tr
                    key={coupon.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-foreground">
                      {coupon.couponCode}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {coupon.couponType}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {coupon.discountAmount}
                      {coupon.couponType === "Percentage" ? "%" : ""}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {coupon.maxDiscountAmount || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {coupon.minPurchaseAmount || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {coupon.startDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {coupon.endDate}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${coupon.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                      >
                        {coupon.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm space-x-3">
                      <button
                        onClick={() => handleEdit(coupon.id)}
                        className="text-primary hover:text-primary/80 transition-colors"
                        aria-label={`Edit coupon ${coupon.couponCode}`}
                        type="button"
                      >
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                        aria-label={`Delete coupon ${coupon.couponCode}`}
                        type="button"
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
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredCoupons.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizes={[5, 10, 20, 50]}
        />
      </section>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-modal-title"
        >
          <div className="bg-white rounded shadow-lg max-w-xl w-full p-6 relative">
            <h2
              id="edit-modal-title"
              className="text-xl font-semibold mb-4 text-center"
            >
              Edit Coupon
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Coupon Code */}
              <div>
                <label
                  htmlFor="editCouponCode"
                  className="block text-sm font-medium mb-1"
                >
                  Coupon Code <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="editCouponCode"
                  name="couponCode"
                  value={editForm.couponCode}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter coupon code"
                />
              </div>

              {/* Coupon Type */}
              <div>
                <label
                  htmlFor="editCouponType"
                  className="block text-sm font-medium mb-1"
                >
                  Coupon Type
                </label>
                <select
                  id="editCouponType"
                  name="couponType"
                  value={editForm.couponType}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {couponTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Discount Amount */}
              <div>
                <label
                  htmlFor="editDiscountAmount"
                  className="block text-sm font-medium mb-1"
                >
                  Discount Amount <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  id="editDiscountAmount"
                  name="discountAmount"
                  value={editForm.discountAmount}
                  onChange={handleEditInputChange}
                  min={0}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter discount amount"
                />
              </div>

              {/* Max Discount Amount */}
              <div>
                <label
                  htmlFor="editMaxDiscountAmount"
                  className="block text-sm font-medium mb-1"
                >
                  Max Discount Amount
                </label>
                <input
                  type="number"
                  id="editMaxDiscountAmount"
                  name="maxDiscountAmount"
                  value={editForm.maxDiscountAmount}
                  onChange={handleEditInputChange}
                  min={0}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter max discount amount"
                />
              </div>

              {/* Min Purchase Amount */}
              <div>
                <label
                  htmlFor="editMinPurchaseAmount"
                  className="block text-sm font-medium mb-1"
                >
                  Min Purchase Amount
                </label>
                <input
                  type="number"
                  id="editMinPurchaseAmount"
                  name="minPurchaseAmount"
                  value={editForm.minPurchaseAmount}
                  onChange={handleEditInputChange}
                  min={0}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter min purchase amount"
                />
              </div>

              {/* Start Date */}
              <div>
                <label
                  htmlFor="editStartDate"
                  className="block text-sm font-medium mb-1"
                >
                  Start Date <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  id="editStartDate"
                  name="startDate"
                  value={editForm.startDate}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* End Date */}
              <div>
                <label
                  htmlFor="editEndDate"
                  className="block text-sm font-medium mb-1"
                >
                  End Date <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  id="editEndDate"
                  name="endDate"
                  value={editForm.endDate}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="editStatus"
                  className="block text-sm font-medium mb-1"
                >
                  Status
                </label>
                <select
                  id="editStatus"
                  name="status"
                  value={editForm.status}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {couponStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleEditCancel}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}