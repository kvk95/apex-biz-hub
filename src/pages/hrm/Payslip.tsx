import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";

interface SalaryDetail {
  id: number;
  description: string;
  amount: number;
}

interface Employee {
  name: string;
  employeeId: string;
  designation: string;
  department: string;
  joiningDate: string;
  payslipMonth: string;
}

interface Company {
  name: string;
  addressLine1: string;
  addressLine2: string;
  phone: string;
  email: string;
  website: string;
}

interface PayslipData {
  employee?: Employee;
  company?: Company;
  salaryDetails?: SalaryDetail[];
  deductions?: SalaryDetail[];
}

export default function Payslip() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState<PayslipData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const salaryRecord = state?.salaryRecord;
    if (salaryRecord) {
      setData({
        employee: {
          name: salaryRecord.employeeName,
          employeeId: salaryRecord.employeeId,
          designation: "N/A", // Placeholder; adjust as needed
          department: "N/A", // Placeholder; adjust as needed
          joiningDate: "N/A", // Placeholder; adjust as needed
          payslipMonth: `${salaryRecord.month} ${salaryRecord.year}`,
        },
        company: {
          name: "Sample Company", // Placeholder; fetch from API or config
          addressLine1: "123 Business St",
          addressLine2: "City, Country",
          phone: "+1-234-567-890",
          email: "info@sample.com",
          website: "www.sample.com",
        },
        salaryDetails: [
          { id: 1, description: "Basic Salary", amount: salaryRecord.salary },
          { id: 2, description: "Bonus", amount: 0 }, // Placeholder; adjust as needed
        ],
        deductions: [
          { id: 1, description: "Advance", amount: salaryRecord.advance },
          { id: 2, description: "Deduction", amount: salaryRecord.deduction },
        ],
      });
    }
    loadData();
  }, [state]);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<PayslipData>("Payslip");
    if (response.status.code === "S") {
      setData((prev) => ({ ...prev, ...response.result }));
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  const totalSalary =
    data.salaryDetails?.reduce((acc, cur) => acc + cur.amount, 0) ?? 0;
  const totalDeductions =
    data.deductions?.reduce((acc, cur) => acc + cur.amount, 0) ?? 0;
  const netSalary = totalSalary - totalDeductions;

  const handleBack = () => {
    navigate("/hrm/payroll/salary"); // Adjust route as per your app
  };

  const savePayslip = () => {
    alert("Payslip saved (dummy action).");
  };

  const generateReport = () => {
    alert("Report generated (dummy action).");
  };

  const handleClear = () => {
    // No pagination to clear; can be used for future enhancements
  };

  return (
    <PageBase1
      title="Payslip"
      description={data.employee?.payslipMonth || "Loading..."}
      icon="fa fa-file-invoice"
      onRefresh={handleClear}
      onReport={generateReport}
      loading={loading}
    >
      <div
        className="min-h-screen  bg-card rounded shadow-md border border-border p-6"
        role="region"
        aria-label="Payslip details"
      >
        <div className="flex justify-between items-center px-6 py-3 bg-white   sticky top-0 z-10  ">
          <h1 className="text-lg font-semibold text-gray-900">
            Payslip for the Month of{" "}
            <span className="text-gray-500 font-normal  ">
              {data.employee?.payslipMonth || "Loading..."}
            </span>
            <p className="text-xs text-muted-foreground">
              Generated on: October 24, 2025, 12:00 PM IST
            </p>
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={handleBack}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-1.5 px-3 rounded-lg text-sm transition-colors"
            >
              <i className="fa fa-arrow-left me-2"></i> Back
            </button>
            <button
              onClick={generateReport}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-1.5 px-3 rounded-lg text-sm transition-colors"
            >
              <i className="fa fa-print me-2"></i> Print / Report
            </button>
          </div>
        </div>

        {/* Employee Info */}
        <section className="mb-2 p-4" aria-label="Employee information">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            <span className="font-semibold">Name:</span> {data.employee?.name}
          </h3>
          <div className="grid grid-cols-2 gap-1 text-foreground">
            <div>
              <span className="font-semibold">Employee ID:</span>{" "}
              {data.employee?.employeeId}
            </div>
            <div>
              <span className="font-semibold">Designation:</span>{" "}
              {data.employee?.designation}
            </div>
            <div>
              <span className="font-semibold">Joining Date:</span>{" "}
              {data.employee?.joiningDate}
            </div>
            <div>
              <span className="font-semibold">Department:</span>{" "}
              {data.employee?.department}
            </div>
          </div>
        </section>

        {/* 3. Earnings & Deductions Tables */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Earnings Table */}
          <div className="earnings-section border border-gray-300 rounded-lg overflow-hidden">
            <h3 className="bg-green-100 text-green-800 font-bold py-2 px-4 text-lg">
              Earnings
            </h3>
            <table className="w-full text-left">
              <thead className="bg-muted/20">
                <tr>
                  <th className="py-2 px-3 border-b border-border font-semibold text-muted-foreground">
                    Description
                  </th>
                  <th className="py-2 px-3 border-b border-border font-semibold text-muted-foreground text-right">
                    Amount (₹)
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.salaryDetails?.map(({ id, description, amount }) => (
                  <tr key={id} className="odd:bg-background even:bg-muted/50">
                    <td className="py-2 px-3 border-b border-border">
                      {description}
                    </td>
                    <td className="py-2 px-3 border-b border-border text-right font-mono">
                      {amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-muted/20 font-semibold text-foreground">
                  <td className="py-2 px-3 border-t border-border">
                    Total Salary
                  </td>
                  <td className="py-2 px-3 border-t border-border text-right font-mono">
                    {totalSalary.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Deductions Table */}
          <div className="deductions-section border border-gray-300 rounded-lg overflow-hidden">
            <h3 className="bg-red-100 text-red-800 font-bold py-2 px-4 text-lg">
              Deductions
            </h3>
            <table className="w-full text-left">
              <thead className="bg-muted/20">
                <tr>
                  <th className="py-2 px-3 border-b border-border font-semibold text-muted-foreground">
                    Description
                  </th>
                  <th className="py-2 px-3 border-b border-border font-semibold text-muted-foreground text-right">
                    Amount (₹)
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.deductions?.map(({ id, description, amount }) => (
                  <tr key={id} className="odd:bg-background even:bg-muted/50">
                    <td className="py-2 px-3 border-b border-border">
                      {description}
                    </td>
                    <td className="py-2 px-3 border-b border-border text-right font-mono">
                      {amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-muted/20 font-semibold text-foreground">
                  <td className="py-2 px-3 border-t border-border">
                    Total Deductions
                  </td>
                  <td className="py-2 px-3 border-t border-border text-right font-mono">
                    {totalDeductions.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Total Summary and Net Pay */}
        <footer className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 mt-5 border-t border-gray-300">
          {/* Totals Summary */}
          <div className="totals-summary text-sm font-semibold space-y-1"> 
          </div>

          {/* Net Pay Highlight */}
          <div className="net-pay-highlight">
            <div className="bg-green-600 text-white font-extrabold p-4 rounded-lg shadow-xl flex justify-between items-center">
              <span className="text-xl uppercase">Net Payable</span>
              <span className="text-3xl font-mono">
                ₹ {netSalary.toFixed(2)}
              </span>
            </div>
          </div>
        </footer>
        <hr className="mt-5 mb-3" />
        <section className=" text-center" aria-label="Company information">
          <h3 className="text-lg font-semibold text-foreground">
            {data.company?.name}
          </h3>
          <div className="text-muted-foreground">{data.company?.addressLine1}</div>
          <div className="text-muted-foreground">{data.company?.addressLine2}</div>
          <div className="text-muted-foreground">Phone: {data.company?.phone}</div>
          <div className="text-muted-foreground">Email: {data.company?.email}</div>
          <div className="text-muted-foreground">
            Website: {data.company?.website}
          </div>
        </section>
      </div>
    </PageBase1>
  );
}
