import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";

interface SupplierDue {
  id: number; // Added for unique key in table rendering
  supplierName: string;
  phone: string;
  email: string;
  dueAmount: number;
  paidAmount: number;
  totalAmount: number;
  action: string;
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any, idx?: number) => JSX.Element;
  align?: "left" | "center" | "right";
}

export default function SupplierDueReport() {
  const [data, setData] = useState<SupplierDue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supplierName, setSupplierName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<SupplierDue[]>("SupplierDueReport");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("SupplierDueReport loadData:", { data: response.result });
  };

  const filteredData = useMemo(() => {
    const result = data.filter((item) => {
      const matchesSupplierName = item.supplierName
        .toLowerCase()
        .includes(supplierName.toLowerCase());
      const matchesPhone = item.phone.includes(phone);
      const matchesEmail = item.email.toLowerCase().includes(email.toLowerCase());
      return matchesSupplierName && matchesPhone && matchesEmail;
    });
    console.log("SupplierDueReport filteredData:", result, {
      supplierName,
      phone,
      email,
    });
    return result;
  }, [data, supplierName, phone, email]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("SupplierDueReport paginatedData:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
      totalItems: filteredData.length,
    });
    return result;
  }, [filteredData, currentPage, itemsPerPage]);

  const handleClear = () => {
    setSupplierName("");
    setPhone("");
    setEmail("");
    setCurrentPage(1);
    loadData();
    console.log("SupplierDueReport handleClear");
  };

  const handleReport = () => {
    alert("Supplier Due Report:\n\n" + JSON.stringify(filteredData, null, 2));
    console.log("SupplierDueReport handleReport:", { filteredData });
  };

  const columns: Column[] = [
    {
      key: "supplierName",
      label: "Supplier Name",
      align: "left",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "phone", label: "Phone", align: "left" },
    { key: "email", label: "Email", align: "left" },
    {
      key: "dueAmount",
      label: "Due Amount",
      align: "right",
      render: (value) => `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      key: "paidAmount",
      label: "Paid Amount",
      align: "right",
      render: (value) => `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      key: "totalAmount",
      label: "Total Amount",
      align: "right",
      render: (value) => `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
  ];

  const tableFooter = () => (
    <tfoot className="bg-muted font-semibold text-foreground">
      <tr>
        <td className="px-4 py-3 text-right" colSpan={3}>
          Total
        </td>
        <td className="px-4 py-3 text-right">{`₹${filteredData
          .reduce((acc, cur) => acc + cur.dueAmount, 0)
          .toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
        <td className="px-4 py-3 text-right">{`₹${filteredData
          .reduce((acc, cur) => acc + cur.paidAmount, 0)
          .toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
        <td className="px-4 py-3 text-right">{`₹${filteredData
          .reduce((acc, cur) => acc + cur.totalAmount, 0)
          .toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
      </tr>
    </tfoot>
  );

  const customFilters = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        type="text"
        placeholder="Supplier Name"
        value={supplierName}
        onChange={(e) => {
          setSupplierName(e.target.value);
          setCurrentPage(1);
          console.log("SupplierDueReport handleSearchSupplierNameChange:", {
            supplierName: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search by supplier name"
      />
      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value);
          setCurrentPage(1);
          console.log("SupplierDueReport handleSearchPhoneChange:", {
            phone: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search by phone"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setCurrentPage(1);
          console.log("SupplierDueReport handleSearchEmailChange:", {
            email: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search by email"
      />
    </div>
  );

  return (
    <PageBase1
      title="Supplier Due Report"
      description="View and filter supplier due records."
      icon="fa fa-truck-supplier"
      onRefresh={handleClear}
      onReport={handleReport}
      search={supplierName}
      onSearchChange={(e) => {
        setSupplierName(e.target.value);
        setCurrentPage(1);
        console.log("SupplierDueReport handleSearchSupplierNameChange:", {
          supplierName: e.target.value,
        });
      }}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      tableFooter={tableFooter}
      customFilters={customFilters}
    />
  );
}