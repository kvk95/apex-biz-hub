import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

type EmployeeSalaryRecord = {
  id: number;
  employeeName: string;
  employeeId: string;
  month: string;
  year: string;
  salary: number;
  advance: number;
  deduction: number;
  netSalary: number;
  paymentStatus: "Paid" | "Unpaid";
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = ["2023", "2022", "2021", "2020"];

export default function EmployeeSalary() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state for Add Section (preserved exactly)
  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [salary, setSalary] = useState("");
  const [advance, setAdvance] = useState("");
  const [deduction, setDeduction] = useState("");
  const [netSalary, setNetSalary] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"Paid" | "Unpaid">("Paid");

  // Data state and API loading state
  const [data, setData] = useState<EmployeeSalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    employeeName: "",
    employeeId: "",
    month: "",
    year: "",
    salary: "",
    advance: "",
    deduction: "",
    netSalary: "",
    paymentStatus: "Paid" as "Paid" | "Unpaid",
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<EmployeeSalaryRecord[]>("EmployeeSalary");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  // Calculate net salary automatically when salary, advance or deduction changes in Add Section
  useEffect(() => {
    const sal = parseFloat(salary) || 0;
    const adv = parseFloat(advance) || 0;
    const ded = parseFloat(deduction) || 0;
    const net = sal - adv - ded;
    setNetSalary(net > 0 ? net.toFixed(2) : "0.00");
  }, [salary, advance, deduction]);

  // Calculate net salary automatically when salary, advance or deduction changes in Edit Modal
  useEffect(() => {
    if (isEditModalOpen) {
      const sal = parseFloat(editForm.salary) || 0;
      const adv = parseFloat(editForm.advance) || 0;
      const ded = parseFloat(editForm.deduction) || 0;
      const net = sal - adv - ded;
      setEditForm((prev) => ({
        ...prev,
        netSalary: net > 0 ? net.toFixed(2) : "0.00",
      }));
    }
  }, [editForm.salary, editForm.advance, editForm.deduction, isEditModalOpen]);

  // Handlers for Add Section form inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "employeeName":
        setEmployeeName(value);
        break;
      case "employeeId":
        setEmployeeId(value);
        break;
      case "month":
        setMonth(value);
        break;
      case "year":
        setYear(value);
        break;
      case "salary":
        setSalary(value);
        break;
      case "advance":
        setAdvance(value);
        break;
      case "deduction":
        setDeduction(value);
        break;
      case "paymentStatus":
        setPaymentStatus(value as "Paid" | "Unpaid");
        break;
    }
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save handler for Add Section (Add new record)
  const handleSave = () => {
    if (
      !employeeName.trim() ||
      !employeeId.trim() ||
      !month ||
      !year ||
      !salary
    ) {
      alert("Please fill all required fields.");
      return;
    }
    const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
    const salNum = parseFloat(salary) || 0;
    const advNum = parseFloat(advance) || 0;
    const dedNum = parseFloat(deduction) || 0;
    const netNum = salNum - advNum - dedNum > 0 ? salNum - advNum - dedNum : 0;
    setData((prev) => [
      ...prev,
      {
        id: newId,
        employeeName: employeeName.trim(),
        employeeId: employeeId.trim(),
        month,
        year,
        salary: salNum,
        advance: advNum,
        deduction: dedNum,
        netSalary: netNum,
        paymentStatus,
      },
    ]);
    // Reset form
    setEmployeeName("");
    setEmployeeId("");
    setMonth("");
    setYear("");
    setSalary("");
    setAdvance("");
    setDeduction("");
    setNetSalary("");
    setPaymentStatus("Paid");
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        employeeName: item.employeeName,
        employeeId: item.employeeId,
        month: item.month,
        year: item.year,
        salary: item.salary.toString(),
        advance: item.advance.toString(),
        deduction: item.deduction.toString(),
        netSalary: item.netSalary.toFixed(2),
        paymentStatus: item.paymentStatus,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (
      !editForm.employeeName.trim() ||
      !editForm.employeeId.trim() ||
      !editForm.month ||
      !editForm.year ||
      !editForm.salary
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      const salNum = parseFloat(editForm.salary) || 0;
      const advNum = parseFloat(editForm.advance) || 0;
      const dedNum = parseFloat(editForm.deduction) || 0;
      const netNum = salNum - advNum - dedNum > 0 ? salNum - advNum - dedNum : 0;
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                employeeName: editForm.employeeName.trim(),
                employeeId: editForm.employeeId.trim(),
                month: editForm.month,
                year: editForm.year,
                salary: salNum,
                advance: advNum,
                deduction: dedNum,
                netSalary: netNum,
                paymentStatus: editForm.paymentStatus,
              }
            : item
        )
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

  // Delete handler
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      // If deleting last item on page, go to previous page if needed
      if ((currentPage - 1) * itemsPerPage >= data.length - 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setEmployeeName("");
    setEmployeeId("");
    setMonth("");
    setYear("");
    setSalary("");
    setAdvance("");
    setDeduction("");
    setNetSalary("");
    setPaymentStatus("Paid");
    setEditId(null);
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report Data:\n" + JSON.stringify(data, null, 2));
  };

  // Paginated data slice using Pagination component props
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6">Employee Salary</h1>

      {/* Form Section (Add Section) - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Employee Name */}
          <div>
            <label
              htmlFor="employeeName"
              className="block text-sm font-medium mb-1"
            >
              Employee Name
            </label>
            <input
              id="employeeName"
              name="employeeName"
              type="text"
              value={employeeName}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Employee Name"
              required
            />
          </div>

          {/* Employee ID */}
          <div>
            <label
              htmlFor="employeeId"
              className="block text-sm font-medium mb-1"
            >
              Employee ID
            </label>
            <input
              id="employeeId"
              name="employeeId"
              type="text"
              value={employeeId}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Employee ID"
              required
            />
          </div>

          {/* Month */}
          <div>
            <label
              htmlFor="month"
              className="block text-sm font-medium mb-1"
            >
              Month
            </label>
            <select
              id="month"
              name="month"
              value={month}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              <option value="" disabled>
                Select Month
              </option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label
              htmlFor="year"
              className="block text-sm font-medium mb-1"
            >
              Year
            </label>
            <select
              id="year"
              name="year"
              value={year}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              <option value="" disabled>
                Select Year
              </option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Salary */}
          <div>
            <label
              htmlFor="salary"
              className="block text-sm font-medium mb-1"
            >
              Salary
            </label>
            <input
              id="salary"
              name="salary"
              type="number"
              min={0}
              step="0.01"
              value={salary}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Salary"
              required
            />
          </div>

          {/* Advance */}
          <div>
            <label
              htmlFor="advance"
              className="block text-sm font-medium mb-1"
            >
              Advance
            </label>
            <input
              id="advance"
              name="advance"
              type="number"
              min={0}
              step="0.01"
              value={advance}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Advance"
            />
          </div>

          {/* Deduction */}
          <div>
            <label
              htmlFor="deduction"
              className="block text-sm font-medium mb-1"
            >
              Deduction
            </label>
            <input
              id="deduction"
              name="deduction"
              type="number"
              min={0}
              step="0.01"
              value={deduction}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Deduction"
            />
          </div>

          {/* Net Salary (readonly) */}
          <div>
            <label
              htmlFor="netSalary"
              className="block text-sm font-medium mb-1"
            >
              Net Salary
            </label>
            <input
              id="netSalary"
              name="netSalary"
              type="text"
              value={netSalary}
              readOnly
              className="w-full border border-input rounded px-3 py-2 bg-background cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Net Salary"
            />
          </div>

          {/* Payment Status */}
          <div>
            <label
              htmlFor="paymentStatus"
              className="block text-sm font-medium mb-1"
            >
              Payment Status
            </label>
            <select
              id="paymentStatus"
              name="paymentStatus"
              value={paymentStatus}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
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
            <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
          </button>

          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
          </button>

          <button
            onClick={handleReport}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
          </button>
        </div>
      </section>

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Employee Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Employee ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Month
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Year
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Salary
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Advance
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Deduction
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Net Salary
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Payment Status
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No records found.
                  </td>
                </tr>
              )}
              {paginatedData.map((record, idx) => (
                <tr
                  key={record.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {record.employeeName}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {record.employeeId}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {record.month}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {record.year}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-foreground">
                    ${record.salary.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-foreground">
                    ${record.advance.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-foreground">
                    ${record.deduction.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-foreground">
                    ${record.netSalary.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        record.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {record.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(record.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit record ${record.employeeName}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete record ${record.employeeName}`}
                      type="button"
                    >
                      <i className="fa fa-trash fa-light" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={data.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
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
              Edit Employee Salary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Employee Name */}
              <div>
                <label
                  htmlFor="editEmployeeName"
                  className="block text-sm font-medium mb-1"
                >
                  Employee Name
                </label>
                <input
                  type="text"
                  id="editEmployeeName"
                  name="employeeName"
                  value={editForm.employeeName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Employee Name"
                />
              </div>

              {/* Employee ID */}
              <div>
                <label
                  htmlFor="editEmployeeId"
                  className="block text-sm font-medium mb-1"
                >
                  Employee ID
                </label>
                <input
                  type="text"
                  id="editEmployeeId"
                  name="employeeId"
                  value={editForm.employeeId}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Employee ID"
                />
              </div>

              {/* Month */}
              <div>
                <label
                  htmlFor="editMonth"
                  className="block text-sm font-medium mb-1"
                >
                  Month
                </label>
                <select
                  id="editMonth"
                  name="month"
                  value={editForm.month}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="" disabled>
                    Select Month
                  </option>
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label
                  htmlFor="editYear"
                  className="block text-sm font-medium mb-1"
                >
                  Year
                </label>
                <select
                  id="editYear"
                  name="year"
                  value={editForm.year}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="" disabled>
                    Select Year
                  </option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* Salary */}
              <div>
                <label
                  htmlFor="editSalary"
                  className="block text-sm font-medium mb-1"
                >
                  Salary
                </label>
                <input
                  type="number"
                  id="editSalary"
                  name="salary"
                  min={0}
                  step="0.01"
                  value={editForm.salary}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Salary"
                />
              </div>

              {/* Advance */}
              <div>
                <label
                  htmlFor="editAdvance"
                  className="block text-sm font-medium mb-1"
                >
                  Advance
                </label>
                <input
                  type="number"
                  id="editAdvance"
                  name="advance"
                  min={0}
                  step="0.01"
                  value={editForm.advance}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Advance"
                />
              </div>

              {/* Deduction */}
              <div>
                <label
                  htmlFor="editDeduction"
                  className="block text-sm font-medium mb-1"
                >
                  Deduction
                </label>
                <input
                  type="number"
                  id="editDeduction"
                  name="deduction"
                  min={0}
                  step="0.01"
                  value={editForm.deduction}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Deduction"
                />
              </div>

              {/* Net Salary (readonly) */}
              <div>
                <label
                  htmlFor="editNetSalary"
                  className="block text-sm font-medium mb-1"
                >
                  Net Salary
                </label>
                <input
                  type="text"
                  id="editNetSalary"
                  name="netSalary"
                  value={editForm.netSalary}
                  readOnly
                  className="w-full border border-input rounded px-3 py-2 bg-background cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Net Salary"
                />
              </div>

              {/* Payment Status */}
              <div>
                <label
                  htmlFor="editPaymentStatus"
                  className="block text-sm font-medium mb-1"
                >
                  Payment Status
                </label>
                <select
                  id="editPaymentStatus"
                  name="paymentStatus"
                  value={editForm.paymentStatus}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
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