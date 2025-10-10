import React, { useState, useMemo } from "react";

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

const supplierDataJSON: SupplierData[] = [
  {
    supplierName: "Supplier 1",
    supplierCode: "SUP001",
    contactPerson: "John Doe",
    phone: "123-456-7890",
    email: "supplier1@example.com",
    address: "123 Main St",
    city: "New York",
    country: "USA",
    totalPurchase: 10000,
    paidAmount: 7000,
    dueAmount: 3000,
  },
  {
    supplierName: "Supplier 2",
    supplierCode: "SUP002",
    contactPerson: "Jane Smith",
    phone: "234-567-8901",
    email: "supplier2@example.com",
    address: "456 Market St",
    city: "Los Angeles",
    country: "USA",
    totalPurchase: 15000,
    paidAmount: 15000,
    dueAmount: 0,
  },
  {
    supplierName: "Supplier 3",
    supplierCode: "SUP003",
    contactPerson: "Alice Johnson",
    phone: "345-678-9012",
    email: "supplier3@example.com",
    address: "789 Broadway",
    city: "Chicago",
    country: "USA",
    totalPurchase: 20000,
    paidAmount: 12000,
    dueAmount: 8000,
  },
  {
    supplierName: "Supplier 4",
    supplierCode: "SUP004",
    contactPerson: "Bob Brown",
    phone: "456-789-0123",
    email: "supplier4@example.com",
    address: "321 Center Rd",
    city: "Houston",
    country: "USA",
    totalPurchase: 5000,
    paidAmount: 5000,
    dueAmount: 0,
  },
  {
    supplierName: "Supplier 5",
    supplierCode: "SUP005",
    contactPerson: "Carol White",
    phone: "567-890-1234",
    email: "supplier5@example.com",
    address: "654 Lakeview Dr",
    city: "Phoenix",
    country: "USA",
    totalPurchase: 12000,
    paidAmount: 9000,
    dueAmount: 3000,
  },
  {
    supplierName: "Supplier 6",
    supplierCode: "SUP006",
    contactPerson: "David Green",
    phone: "678-901-2345",
    email: "supplier6@example.com",
    address: "987 Hill St",
    city: "Philadelphia",
    country: "USA",
    totalPurchase: 8000,
    paidAmount: 8000,
    dueAmount: 0,
  },
  {
    supplierName: "Supplier 7",
    supplierCode: "SUP007",
    contactPerson: "Eva Black",
    phone: "789-012-3456",
    email: "supplier7@example.com",
    address: "159 River Rd",
    city: "San Antonio",
    country: "USA",
    totalPurchase: 11000,
    paidAmount: 6000,
    dueAmount: 5000,
  },
  {
    supplierName: "Supplier 8",
    supplierCode: "SUP008",
    contactPerson: "Frank Blue",
    phone: "890-123-4567",
    email: "supplier8@example.com",
    address: "753 Oak Ln",
    city: "San Diego",
    country: "USA",
    totalPurchase: 9000,
    paidAmount: 9000,
    dueAmount: 0,
  },
  {
    supplierName: "Supplier 9",
    supplierCode: "SUP009",
    contactPerson: "Grace Yellow",
    phone: "901-234-5678",
    email: "supplier9@example.com",
    address: "852 Pine St",
    city: "Dallas",
    country: "USA",
    totalPurchase: 13000,
    paidAmount: 11000,
    dueAmount: 2000,
  },
  {
    supplierName: "Supplier 10",
    supplierCode: "SUP010",
    contactPerson: "Henry Orange",
    phone: "012-345-6789",
    email: "supplier10@example.com",
    address: "951 Cedar Ave",
    city: "San Jose",
    country: "USA",
    totalPurchase: 14000,
    paidAmount: 14000,
    dueAmount: 0,
  },
];

const ITEMS_PER_PAGE = 5;

const SupplierReport: React.FC = () => {
  const [searchSupplier, setSearchSupplier] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [searchContact, setSearchContact] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [page, setPage] = useState(1);

  // Filtered and paginated data
  const filteredData = useMemo(() => {
    return supplierDataJSON.filter((item) => {
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
    searchSupplier,
    searchCode,
    searchContact,
    searchPhone,
    searchEmail,
    searchCity,
    searchCountry,
  ]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, page]);

  // Reset page to 1 if filteredData changes and current page is out of range
  React.useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [totalPages, page]);

  // Handlers for buttons (Report, Refresh)
  const handleReport = () => {
    alert("Report generated (simulated).");
  };

  const handleRefresh = () => {
    setSearchSupplier("");
    setSearchCode("");
    setSearchContact("");
    setSearchPhone("");
    setSearchEmail("");
    setSearchCity("");
    setSearchCountry("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Supplier Report</h1>

      {/* Filters Section */}
      <section className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filter Suppliers</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
          }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
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
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Country"
            />
          </div>
          <div className="flex items-end space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Report
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-white shadow rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-3 py-2 font-semibold">
                  Supplier Name
                </th>
                <th className="border border-gray-300 px-3 py-2 font-semibold">
                  Supplier Code
                </th>
                <th className="border border-gray-300 px-3 py-2 font-semibold">
                  Contact Person
                </th>
                <th className="border border-gray-300 px-3 py-2 font-semibold">
                  Phone
                </th>
                <th className="border border-gray-300 px-3 py-2 font-semibold">
                  Email
                </th>
                <th className="border border-gray-300 px-3 py-2 font-semibold">
                  Address
                </th>
                <th className="border border-gray-300 px-3 py-2 font-semibold">
                  City
                </th>
                <th className="border border-gray-300 px-3 py-2 font-semibold">
                  Country
                </th>
                <th className="border border-gray-300 px-3 py-2 font-semibold">
                  Total Purchase
                </th>
                <th className="border border-gray-300 px-3 py-2 font-semibold">
                  Paid Amount
                </th>
                <th className="border border-gray-300 px-3 py-2 font-semibold">
                  Due Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="text-center py-4 text-gray-500 italic"
                  >
                    No suppliers found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((supplier, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border border-gray-300 px-3 py-2">
                      {supplier.supplierName}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      {supplier.supplierCode}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      {supplier.contactPerson}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      {supplier.phone}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      {supplier.email}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      {supplier.address}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      {supplier.city}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      {supplier.country}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      ${supplier.totalPurchase.toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      ${supplier.paidAmount.toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      ${supplier.dueAmount.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <nav
          aria-label="Supplier table pagination"
          className="flex justify-between items-center mt-4"
        >
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-semibold">
              {paginatedData.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold">
              {(page - 1) * ITEMS_PER_PAGE + paginatedData.length}
            </span>{" "}
            of <span className="font-semibold">{filteredData.length}</span>{" "}
            results
          </div>
          <div className="inline-flex -space-x-px rounded-md shadow-sm">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                page === 1
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
              aria-label="Previous page"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setPage(pg)}
                aria-current={pg === page ? "page" : undefined}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                  pg === page
                    ? "z-10 bg-blue-600 text-white border-blue-600"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                }`}
              >
                {pg}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages || totalPages === 0}
              className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                page === totalPages || totalPages === 0
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
              aria-label="Next page"
            >
              &gt;
            </button>
          </div>
        </nav>
      </section>
    </div>
  );
};

export default SupplierReport;