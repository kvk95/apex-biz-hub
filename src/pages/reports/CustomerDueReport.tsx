import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

export default function CustomerDueReport() {
  const [data, setData] = useState([]);
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

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("CustomerDueReport");
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

  // Filter customers based on search fields
  const filteredCustomers = useMemo(() => {
    return data.filter((c: any) => {
      const matchName = c.name.toLowerCase().includes(searchName.toLowerCase());
      const matchPhone = c.phone
        .toLowerCase()
        .includes(searchPhone.toLowerCase());
      const matchEmail = c.email
        .toLowerCase()
        .includes(searchEmail.toLowerCase());
      const matchAddress = c.address
        .toLowerCase()
        .includes(searchAddress.toLowerCase());
      const dueFromNum = parseFloat(searchDueFrom);
      const dueToNum = parseFloat(searchDueTo);
      const matchDueFrom = isNaN(dueFromNum) ? true : c.dueAmount >= dueFromNum;
      const matchDueTo = isNaN(dueToNum) ? true : c.dueAmount <= dueToNum;
      return (
        matchName &&
        matchPhone &&
        matchEmail &&
        matchAddress &&
        matchDueFrom &&
        matchDueTo
      );
    });
  }, [
    data,
    searchName,
    searchPhone,
    searchEmail,
    searchAddress,
    searchDueFrom,
    searchDueTo,
  ]);

  // Paginated data
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [
    searchName,
    searchPhone,
    searchEmail,
    searchAddress,
    searchDueFrom,
    searchDueTo,
  ]);

  // Handlers
  const handleReset = () => {
    setSearchName("");
    setSearchPhone("");
    setSearchEmail("");
    setSearchAddress("");
    setSearchDueFrom("");
    setSearchDueTo("");
  };

  const handleClear = () => {
    handleReset();
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generated (placeholder)");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Title */}
      <h1 className="text-lg font-semibold mb-6"> Customer Due Report </h1>

      {/* Filter Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6"
          aria-label="Filter Customer Due Report"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Customer Name
            </label>
            <input
              id="name"
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter name"
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
              placeholder="Enter phone"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              Address
            </label>
            <input
              id="address"
              type="text"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter address"
            />
          </div>

          <div>
            <label htmlFor="dueFrom" className="block text-sm font-medium mb-1">
              Due Amount From
            </label>
            <input
              id="dueFrom"
              type="number"
              min="0"
              step="0.01"
              value={searchDueFrom}
              onChange={(e) => setSearchDueFrom(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Min due"
            />
          </div>

          <div>
            <label htmlFor="dueTo" className="block text-sm font-medium mb-1">
              Due Amount To
            </label>
            <input
              id="dueTo"
              type="number"
              min="0"
              step="0.01"
              value={searchDueTo}
              onChange={(e) => setSearchDueTo(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Max due"
            />
          </div>

          {/* Buttons row spanning full width */}
          <div className="md:col-span-3 lg:col-span-6 flex flex-wrap gap-3 mt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Search"
            >
              <i className="fa fa-search fa-light" aria-hidden="true"></i>{" "}
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Reset"
            >
              <i className="fa fa-undo fa-light" aria-hidden="true"></i> Reset
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Clear"
            >
              <i className="fa fa-eraser fa-light" aria-hidden="true"></i> Clear
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 ml-auto"
              aria-label="Generate Report"
            >
              <i className="fa fa-file-alt fa-light" aria-hidden="true"></i>{" "}
              Report
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
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Customer Name
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
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Due Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-muted-foreground italic"
                  >
                    No customers found.
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((customer: any, idx: number) => (
                  <tr
                    key={customer.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {customer.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {customer.phone}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {customer.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {customer.address}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-red-600 font-semibold">
                      ${customer.dueAmount.toFixed(2)}
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
          totalItems={filteredCustomers.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
      </section>
    </div>
  );
}
