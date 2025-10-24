import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";

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

  const totalSalary = data.salaryDetails?.reduce((acc, cur) => acc + cur.amount, 0) ?? 0;
  const totalDeductions = data.deductions?.reduce((acc, cur) => acc + cur.amount, 0) ?? 0;
  const netSalary = totalSalary - totalDeductions;

  const handleBack = () => {
    navigate("/employee-salary"); // Adjust route as per your app
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
    > 
      <div className="min-h-screen bg-background">
        {/* Header Info */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-foreground">Payslip</h2>
          <p className="text-sm text-muted-foreground">{data.employee?.payslipMonth}</p>
          <p className="text-xs text-muted-foreground">Generated on: October 24, 2025, 12:00 PM IST</p>
        </div>

        {/* Company Info */}
        <section className="mb-6 p-4 bg-background border border-border rounded-md" aria-label="Company information">
          <h3 className="text-lg font-semibold text-foreground mb-2">Company Information</h3>
          <p className="text-foreground font-semibold">{data.company?.name}</p>
          <p className="text-muted-foreground">{data.company?.addressLine1}</p>
          <p className="text-muted-foreground">{data.company?.addressLine2}</p>
          <p className="text-muted-foreground">Phone: {data.company?.phone}</p>
          <p className="text-muted-foreground">Email: {data.company?.email}</p>
          <p className="text-muted-foreground">Website: {data.company?.website}</p>
        </section>

        {/* Employee Info */}
        <section className="mb-6 p-4 bg-background border border-border rounded-md" aria-label="Employee information">
          <h3 className="text-lg font-semibold text-foreground mb-2">Employee Information</h3>
          <div className="grid grid-cols-2 gap-4 text-foreground">
            <div><span className="font-semibold">Name:</span> {data.employee?.name}</div>
            <div><span className="font-semibold">Employee ID:</span> {data.employee?.employeeId}</div>
            <div><span className="font-semibold">Designation:</span> {data.employee?.designation}</div>
            <div><span className="font-semibold">Department:</span> {data.employee?.department}</div>
            <div><span className="font-semibold">Joining Date:</span> {data.employee?.joiningDate}</div>
          </div>
        </section>

        {/* Salary Details */}
        <section className="mb-6 p-4 bg-background border border-border rounded-md" aria-label="Salary details">
          <h3 className="text-lg font-semibold text-foreground mb-2">Salary Details</h3>
          <table className="w-full text-left">
            <thead className="bg-muted/20">
              <tr>
                <th className="py-2 px-3 border-b border-border font-semibold text-muted-foreground">Description</th>
                <th className="py-2 px-3 border-b border-border font-semibold text-muted-foreground text-right">Amount ($)</th>
              </tr>
            </thead>
            <tbody>
              {data.salaryDetails?.map(({ id, description, amount }) => (
                <tr key={id} className="odd:bg-background even:bg-muted/50">
                  <td className="py-2 px-3 border-b border-border">{description}</td>
                  <td className="py-2 px-3 border-b border-border text-right font-mono">{amount.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="bg-muted/20 font-semibold text-foreground">
                <td className="py-2 px-3 border-t border-border">Total Salary</td>
                <td className="py-2 px-3 border-t border-border text-right font-mono">{totalSalary.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Deductions */}
        <section className="mb-6 p-4 bg-background border border-border rounded-md" aria-label="Deductions">
          <h3 className="text-lg font-semibold text-foreground mb-2">Deductions</h3>
          <table className="w-full text-left">
            <thead className="bg-muted/20">
              <tr>
                <th className="py-2 px-3 border-b border-border font-semibold text-muted-foreground">Description</th>
                <th className="py-2 px-3 border-b border-border font-semibold text-muted-foreground text-right">Amount ($)</th>
              </tr>
            </thead>
            <tbody>
              {data.deductions?.map(({ id, description, amount }) => (
                <tr key={id} className="odd:bg-background even:bg-muted/50">
                  <td className="py-2 px-3 border-b border-border">{description}</td>
                  <td className="py-2 px-3 border-b border-border text-right font-mono">{amount.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="bg-muted/20 font-semibold text-foreground">
                <td className="py-2 px-3 border-t border-border">Total Deductions</td>
                <td className="py-2 px-3 border-t border-border text-right font-mono">{totalDeductions.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Net Salary */}
        <section className="p-4 bg-background border border-border rounded-md" aria-label="Net salary">
          <div className="bg-green-100 border border-green-400 rounded-md px-6 py-4 text-green-900 font-semibold text-xl text-center">
            Net Salary: ${netSalary.toFixed(2)}
          </div>
        </section>
      </div>
    </PageBase1>
  );
}