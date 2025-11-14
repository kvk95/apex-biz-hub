import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";

interface SupplierData {
  id: number; // Added for unique key in table rendering
  supplierName: string;
  supplierCode: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  totalPurchase: number;
  paidAmount: number;
  dueAmount: number;
}

export default function SupplierReport() {
  const [data, setData] = useState<SupplierData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchSupplier, setSearchSupplier] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [searchContact, setSearchContact] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<SupplierData[]>("SupplierReport");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("SupplierReport loadData:", { data: response.result });
  };

  const filteredData = useMemo(() => {
    const result = data.filter((item) => {
      return (
        item.supplierName
          .toLowerCase()
          .includes(searchSupplier.toLowerCase()) &&
        item.supplierCode.toLowerCase().includes(searchCode.toLowerCase()) &&
        item.contactPerson
          .toLowerCase()
          .includes(searchContact.toLowerCase()) &&
        item.phone.toLowerCase().includes(searchPhone.toLowerCase()) &&
        item.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
        item.city.toLowerCase().includes(searchCity.toLowerCase()) &&
        item.country.toLowerCase().includes(searchCountry.toLowerCase())
      );
    });
    console.log("SupplierReport filteredData:", result, {
      searchSupplier,
      searchCode,
      searchContact,
      searchPhone,
      searchEmail,
      searchCity,
      searchCountry,
    });
    return result;
  }, [
    data,
    searchSupplier,
    searchCode,
    searchContact,
    searchPhone,
    searchEmail,
    searchCity,
    searchCountry,
  ]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("SupplierReport paginatedData:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
      totalItems: filteredData.length,
    });
    return result;
  }, [filteredData, currentPage, itemsPerPage]);

  const handleClear = () => {
    setSearchSupplier("");
    setSearchCode("");
    setSearchContact("");
    setSearchPhone("");
    setSearchEmail("");
    setSearchCity("");
    setSearchCountry("");
    setCurrentPage(1);
    loadData();
    console.log("SupplierReport handleClear");
  };

  const handleReport = () => {
    alert("Supplier Report:\n\n" + JSON.stringify(filteredData, null, 2));
    console.log("SupplierReport handleReport:", { filteredData });
  };

  const columns: Column[] = [
    {
      key: "supplierName",
      label: "Supplier Name",
      align: "left",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "supplierCode", label: "Supplier Code", align: "left" },
    { key: "contactPerson", label: "Contact Person", align: "left" },
    { key: "phone", label: "Phone", align: "left" },
    { key: "email", label: "Email", align: "left" },
    {
      key: "address",
      label: "Address",
      render: (value, row) => (
        <span>
          {row.address},<br /> {row.city}, {row.country}
        </span>
      ),
    },
    {
      key: "totalPurchase",
      label: "Total Purchase",
      align: "right",
      render: (value) => `₹${value.toLocaleString()}`,
    },
    {
      key: "paidAmount",
      label: "Paid Amount",
      align: "right",
      render: (value) => `₹${value.toLocaleString()}`,
    },
    {
      key: "dueAmount",
      label: "Due Amount",
      align: "right",
      render: (value) => `₹${value.toLocaleString()}`,
    },
  ];

  const customFilters = () => (
    <div className="grid grid-cols-2 w-full justify-stretch px-3">
      <div className="flex justify-start  gap-2">
        <SearchInput
          className=""
          value={searchSupplier}
          placeholder="Supplier Name"
          onSearch={(query) => {
            setSearchSupplier(query);
            setCurrentPage(1);
          }}
        />
        <SearchInput
          className=""
          value={searchContact}
          placeholder="Contact Person"
          onSearch={(query) => {
            setSearchContact(query);
            setCurrentPage(1);
          }}
        />
        <SearchInput
          className=""
          value={searchPhone}
          placeholder="Phone"
          onSearch={(query) => {
            setSearchPhone(query);
            setCurrentPage(1);
          }}
        />
        <SearchInput
          className=""
          value={searchEmail}
          placeholder="Email"
          onSearch={(query) => {
            setSearchEmail(query);
            setCurrentPage(1);
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <input
          type="text"
          placeholder="City"
          value={searchCity}
          onChange={(e) => {
            setSearchCity(e.target.value);
            setCurrentPage(1);
            console.log("SupplierReport handleSearchCityChange:", {
              searchCity: e.target.value,
            });
          }}
          className="px-3 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Search by city"
        />
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Supplier Report"
      description="View and filter supplier records."
      
      onRefresh={handleClear}
      onReport={handleReport}
      search={searchSupplier}
      onSearchChange={(e) => {
        setSearchSupplier(e.target.value);
        setCurrentPage(1);
        console.log("SupplierReport handleSearchSupplierChange:", {
          searchSupplier: e.target.value,
        });
      }}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      customFilters={customFilters}  loading={loading}
    />
  );
}
