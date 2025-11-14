import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";

interface CustomerDueData {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  dueAmount: number;
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
    const response = await apiService.get<CustomerDueData[]>(
      "CustomerDueReport"
    );
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
      const matchName = item.name
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const matchPhone = item.phone
        .toLowerCase()
        .includes(searchPhone.toLowerCase());
      const matchEmail = item.email
        .toLowerCase()
        .includes(searchEmail.toLowerCase());
      const matchAddress = item.address
        .toLowerCase()
        .includes(searchAddress.toLowerCase());
      const dueFromNum = parseFloat(searchDueFrom);
      const dueToNum = parseFloat(searchDueTo);
      const matchDueFrom = isNaN(dueFromNum)
        ? true
        : item.dueAmount >= dueFromNum;
      const matchDueTo = isNaN(dueToNum) ? true : item.dueAmount <= dueToNum;
      return (
        matchName &&
        matchPhone &&
        matchEmail &&
        matchAddress &&
        matchDueFrom &&
        matchDueTo
      );
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
  }, [
    data,
    searchName,
    searchPhone,
    searchEmail,
    searchAddress,
    searchDueFrom,
    searchDueTo,
  ]);

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
        <span className="text-red-600 font-semibold">{`₹${value.toLocaleString(
          "en-IN",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        )}`}</span>
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
          .toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}</td>
      </tr>
    </tfoot>
  );

  const customFilters = () => (
    <div className="grid grid-cols-2 w-full justify-stretch px-3">
      <div className="flex justify-start  gap-2">
        <SearchInput
          className=""
          value={searchName}
          placeholder="Customer Name"
          onSearch={(query) => {
            setSearchName(query);
            setCurrentPage(1);
          }}
        />
        <SearchInput
          className=""
          type="number"
          value={searchPhone}
          placeholder="Phone"
          onSearch={(query) => {
            setSearchPhone(query);
            setCurrentPage(1);
          }}
        />
        <SearchInput
          className=""
          type="email"
          value={searchEmail}
          placeholder="Email"
          onSearch={(query) => {
            setSearchEmail(query);
            setCurrentPage(1);
          }}
        />
        <SearchInput
          className=""
          type="text"
          value={searchAddress}
          placeholder="Address"
          onSearch={(query) => {
            setSearchAddress(query);
            setCurrentPage(1);
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <SearchInput
          className="w-32"
          type="number"
          value={searchDueFrom}
          placeholder="Min Due"
          onSearch={(query) => {
            setSearchDueFrom(query);
            setCurrentPage(1);
          }}
          min={0}
          step={0.01}
        />
        <SearchInput
          className="w-32"
          type="number"
          value={searchDueTo}
          placeholder="Max Due"
          onSearch={(query) => {
            setSearchDueTo(query);
            setCurrentPage(1);
          }}
          min={0}
          step={0.01}
        />
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Customer Due Report"
      description="View and filter customer due records."
      
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
      loading={loading}
    />
  );
}
