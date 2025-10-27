import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";

interface CustomerDueData {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  dueAmount: number;
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any, idx?: number) => JSX.Element;
  align?: "left" | "center" | "right";
}

export default function CustomerDueReport() {
  const [data, setData] = useState<CustomerDueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [searchDueFrom, setSearchDueFrom] = useState("");
  const [searchDueTo, setSearchDueTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<CustomerDueData[]>("CustomerDueReport");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("CustomerDueReport loadData:", { data: response.result });
  };

  const filteredData = useMemo(() => {
    const result = data.filter((item) => {
      const matchName = item.name.toLowerCase().includes(searchName.toLowerCase());
      const matchPhone = item.phone.toLowerCase().includes(searchPhone.toLowerCase());
      const matchEmail = item.email.toLowerCase().includes(searchEmail.toLowerCase());
      const matchAddress = item.address.toLowerCase().includes(searchAddress.toLowerCase());
      const dueFromNum = parseFloat(searchDueFrom);
      const dueToNum = parseFloat(searchDueTo);
      const matchDueFrom = isNaN(dueFromNum) ? true : item.dueAmount >= dueFromNum;
      const matchDueTo = isNaN(dueToNum) ? true : item.dueAmount <= dueToNum;
      return matchName && matchPhone && matchEmail && matchAddress && matchDueFrom && matchDueTo;
    });
    console.log("CustomerDueReport filteredData:", result, {
      searchName,
      searchPhone,
      searchEmail,
      searchAddress,
      searchDueFrom,
      searchDueTo,
    });
    return result;
  }, [data, searchName, searchPhone, searchEmail, searchAddress, searchDueFrom, searchDueTo]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("CustomerDueReport paginatedData:", result, {
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
    setSearchPhone("");
    setSearchEmail("");
    setSearchAddress("");
    setSearchDueFrom("");
    setSearchDueTo("");
    setCurrentPage(1);
    loadData();
    console.log("CustomerDueReport handleClear");
  };

  const handleReport = () => {
    alert("Customer Due Report:\n\n" + JSON.stringify(filteredData, null, 2));
    console.log("CustomerDueReport handleReport:", { filteredData });
  };

  const columns: Column[] = [
    {
      key: "index",
      label: "#",
      align: "left",
      render: (_, __, idx) => (currentPage - 1) * itemsPerPage + (idx ?? 0) + 1,
    },
    {
      key: "name",
      label: "Customer Name",
      align: "left",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "phone", label: "Phone", align: "left" },
    { key: "email", label: "Email", align: "left" },
    { key: "address", label: "Address", align: "left" },
    {
      key: "dueAmount",
      label: "Due Amount",
      align: "right",
      render: (value) => (
        <span className="text-red-600 font-semibold">{`₹${value.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}</span>
      ),
    },
  ];

  const tableFooter = () => (
    <tfoot className="bg-muted font-semibold text-foreground">
      <tr>
        <td className="px-4 py-3 text-right" colSpan={5}>
          Total
        </td>
        <td className="px-4 py-3 text-right text-red-600 font-semibold">{`₹${filteredData
          .reduce((acc, cur) => acc + cur.dueAmount, 0)
          .toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
      </tr>
    </tfoot>
  );

  const customFilters = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        type="text"
        placeholder="Customer Name"
        value={searchName}
        onChange={(e) => {
          setSearchName(e.target.value);
          setCurrentPage(1);
          console.log("CustomerDueReport handleSearchNameChange:", {
            searchName: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search by customer name"
      />
      <input
        type="text"
        placeholder="Phone"
        value={searchPhone}
        onChange={(e) => {
          setSearchPhone(e.target.value);
          setCurrentPage(1);
          console.log("CustomerDueReport handleSearchPhoneChange:", {
            searchPhone: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search by phone"
      />
      <input
        type="email"
        placeholder="Email"
        value={searchEmail}
        onChange={(e) => {
          setSearchEmail(e.target.value);
          setCurrentPage(1);
          console.log("CustomerDueReport handleSearchEmailChange:", {
            searchEmail: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search by email"
      />
      <input
        type="text"
        placeholder="Address"
        value={searchAddress}
        onChange={(e) => {
          setSearchAddress(e.target.value);
          setCurrentPage(1);
          console.log("CustomerDueReport handleSearchAddressChange:", {
            searchAddress: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search by address"
      />
      <input
        type="number"
        placeholder="Min Due"
        value={searchDueFrom}
        onChange={(e) => {
          setSearchDueFrom(e.target.value);
          setCurrentPage(1);
          console.log("CustomerDueReport handleSearchDueFromChange:", {
            searchDueFrom: e.target.value,
          });
        }}
        min="0"
        step="0.01"
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search by minimum due amount"
      />
      <input
        type="number"
        placeholder="Max Due"
        value={searchDueTo}
        onChange={(e) => {
          setSearchDueTo(e.target.value);
          setCurrentPage(1);
          console.log("CustomerDueReport handleSearchDueToChange:", {
            searchDueTo: e.target.value,
          });
        }}
        min="0"
        step="0.01"
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search by maximum due amount"
      />
    </div>
  );

  return (
    <PageBase1
      title="Customer Due Report"
      description="View and filter customer due records."
      icon="fa fa-user-clock"
      onRefresh={handleClear}
      onReport={handleReport}
      search={searchName}
      onSearchChange={(e) => {
        setSearchName(e.target.value);
        setCurrentPage(1);
        console.log("CustomerDueReport handleSearchNameChange:", {
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
      tableFooter={tableFooter}
      customFilters={customFilters}
    />
  );
}