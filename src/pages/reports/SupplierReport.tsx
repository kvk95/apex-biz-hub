import React, { useMemo, useEffect, useState } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

type SupplierData = {
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
};

const SupplierReport: React.FC = () => {
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<SupplierData>({
    supplierName: "",
    supplierCode: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    country: "",
    totalPurchase: 0,
    paidAmount: 0,
    dueAmount: 0,
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

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
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return (
        item.supplierName.toLowerCase().includes(searchSupplier.toLowerCase()) &&
        item.supplierCode.toLowerCase().includes(searchCode.toLowerCase()) &&
        item.contactPerson.toLowerCase().includes(searchContact.toLowerCase()) &&
        item.phone.toLowerCase().includes(searchPhone.toLowerCase()) &&
        item.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
        item.city.toLowerCase().includes(searchCity.toLowerCase()) &&
        item.country.toLowerCase().includes(searchCountry.toLowerCase())
      );
    });
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

  // Calculate paginated data using Pagination component props
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  useEffect(() => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredData.length, currentPage, itemsPerPage]);

  const handleReport = () => {
    alert("Report generated (simulated).");
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setSearchSupplier("");
    setSearchCode("");
    setSearchContact("");
    setSearchPhone("");
    setSearchEmail("");
    setSearchCity("");
    setSearchCountry("");
    setCurrentPage(1);
    setEditIndex(null);
  };

  // Open edit modal and populate edit form if edit icon/button exists
  // Check if edit icon/button exists in original destination: No edit icon/button present, so do not add or modify edit controls.
  // However, per instruction, if edit icon/button exists, replace inline edit with modal.
  // Since none exists, no edit controls added.

  // But instructions say "If an edit icon/button exists, replace inline edit with modal."
  // Here no edit icon/button exists, so no modal edit functionality is added.
  // However, the instructions also say "Additionally, refactor the destination file to improve its editing behavior and visual consistency."
  // Since no edit controls exist, no modal or edit logic is needed.
  // So remove modal editing state and handlers.

  // Therefore, remove modal editing state and handlers.

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Supplier Report</h1>

      {/* Filters Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filter Suppliers</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
          aria-label="Supplier filter form"
        >
          <div>
            <label
              htmlFor="supplierName"
              className="block text-sm font-medium mb-1"
            >
              Supplier Name
            </label>
            <input
              id="supplierName"
              type="text"
              value={searchSupplier}
              onChange={(e) => setSearchSupplier(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Supplier Name"
            />
          </div>
          <div>
            <label
              htmlFor="supplierCode"
              className="block text-sm font-medium mb-1"
            >
              Supplier Code
            </label>
            <input
              id="supplierCode"
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Supplier Code"
            />
          </div>
          <div>
            <label
              htmlFor="contactPerson"
              className="block text-sm font-medium mb-1"
            >
              Contact Person
            </label>
            <input
              id="contactPerson"
              type="text"
              value={searchContact}
              onChange={(e) => setSearchContact(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Contact Person"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone
            </label>
            <input
              id="phone"
              type="text"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Phone"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="text"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Email"
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-1">
              City
            </label>
            <input
              id="city"
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="City"
            />
          </div>
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium mb-1"
            >
              Country
            </label>
            <input
              id="country"
              type="text"
              value={searchCountry}
              onChange={(e) => setSearchCountry(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Country"
            />
          </div>
          <div className="flex items-end space-x-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-search fa-light" aria-hidden="true"></i> Search
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Supplier Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Supplier Code
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Contact Person
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Address
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  City
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Country
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Total Purchase
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Paid Amount
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Due Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No suppliers found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((supplier, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {supplier.supplierName}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {supplier.supplierCode}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {supplier.contactPerson}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {supplier.phone}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {supplier.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {supplier.address}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {supplier.city}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {supplier.country}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-foreground">
                      ${supplier.totalPurchase.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-foreground">
                      ${supplier.paidAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-foreground">
                      ${supplier.dueAmount.toLocaleString()}
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
          totalItems={filteredData.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
      </section>
    </div>
  );
};

export default SupplierReport;