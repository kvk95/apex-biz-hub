import React, { useState, useEffect } from "react";

interface Biller {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  gstNo: string;
  createdAt: string;
}

const billersData: Biller[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    address: "123 Main St",
    city: "New York",
    country: "USA",
    postalCode: "10001",
    gstNo: "GST123456",
    createdAt: "2023-01-01",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "987-654-3210",
    address: "456 Elm St",
    city: "Los Angeles",
    country: "USA",
    postalCode: "90001",
    gstNo: "GST654321",
    createdAt: "2023-02-15",
  },
  {
    id: 3,
    name: "Acme Corp",
    email: "contact@acmecorp.com",
    phone: "555-555-5555",
    address: "789 Oak St",
    city: "Chicago",
    country: "USA",
    postalCode: "60601",
    gstNo: "GST789123",
    createdAt: "2023-03-10",
  },
  {
    id: 4,
    name: "Beta LLC",
    email: "info@betallc.com",
    phone: "444-444-4444",
    address: "321 Pine St",
    city: "Houston",
    country: "USA",
    postalCode: "77001",
    gstNo: "GST321987",
    createdAt: "2023-04-05",
  },
  {
    id: 5,
    name: "Gamma Inc",
    email: "sales@gammainc.com",
    phone: "333-333-3333",
    address: "654 Cedar St",
    city: "Phoenix",
    country: "USA",
    postalCode: "85001",
    gstNo: "GST456789",
    createdAt: "2023-05-20",
  },
  {
    id: 6,
    name: "Delta Traders",
    email: "contact@deltatraders.com",
    phone: "222-222-2222",
    address: "987 Spruce St",
    city: "Philadelphia",
    country: "USA",
    postalCode: "19019",
    gstNo: "GST987654",
    createdAt: "2023-06-18",
  },
  {
    id: 7,
    name: "Epsilon Services",
    email: "support@epsilonservices.com",
    phone: "111-111-1111",
    address: "159 Maple St",
    city: "San Antonio",
    country: "USA",
    postalCode: "78201",
    gstNo: "GST654987",
    createdAt: "2023-07-22",
  },
  {
    id: 8,
    name: "Zeta Solutions",
    email: "info@zetasolutions.com",
    phone: "666-666-6666",
    address: "753 Birch St",
    city: "San Diego",
    country: "USA",
    postalCode: "92101",
    gstNo: "GST321654",
    createdAt: "2023-08-30",
  },
  {
    id: 9,
    name: "Eta Enterprises",
    email: "contact@etaenterprises.com",
    phone: "777-777-7777",
    address: "852 Walnut St",
    city: "Dallas",
    country: "USA",
    postalCode: "75201",
    gstNo: "GST789456",
    createdAt: "2023-09-12",
  },
  {
    id: 10,
    name: "Theta Group",
    email: "sales@thetagroup.com",
    phone: "888-888-8888",
    address: "951 Chestnut St",
    city: "San Jose",
    country: "USA",
    postalCode: "95101",
    gstNo: "GST456123",
    createdAt: "2023-10-01",
  },
];

const ITEMS_PER_PAGE = 5;

const Billers: React.FC = () => {
  // State for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  // State for billers list and pagination
  const [billers, setBillers] = useState<Biller[]>(billersData);
  const [currentPage, setCurrentPage] = useState(1);

  // State for editing
  const [editingId, setEditingId] = useState<number | null>(null);

  // Calculate pagination
  const totalPages = Math.ceil(billers.length / ITEMS_PER_PAGE);
  const paginatedBillers = billers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset form fields
  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setCity("");
    setCountry("");
    setPostalCode("");
    setGstNo("");
    setCreatedAt("");
    setEditingId(null);
  };

  // Handle Save (Add or Update)
  const handleSave = () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim() ||
      !country.trim() ||
      !postalCode.trim() ||
      !gstNo.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (editingId !== null) {
      // Update existing biller
      setBillers((prev) =>
        prev.map((b) =>
          b.id === editingId
            ? {
                ...b,
                name,
                email,
                phone,
                address,
                city,
                country,
                postalCode,
                gstNo,
                createdAt: createdAt || b.createdAt,
              }
            : b
        )
      );
    } else {
      // Add new biller
      const newBiller: Biller = {
        id: billers.length ? billers[billers.length - 1].id + 1 : 1,
        name,
        email,
        phone,
        address,
        city,
        country,
        postalCode,
        gstNo,
        createdAt: createdAt || new Date().toISOString().split("T")[0],
      };
      setBillers((prev) => [...prev, newBiller]);
      setCurrentPage(totalPages); // Go to last page if new added
    }
    resetForm();
  };

  // Handle Edit
  const handleEdit = (biller: Biller) => {
    setEditingId(biller.id);
    setName(biller.name);
    setEmail(biller.email);
    setPhone(biller.phone);
    setAddress(biller.address);
    setCity(biller.city);
    setCountry(biller.country);
    setPostalCode(biller.postalCode);
    setGstNo(biller.gstNo);
    setCreatedAt(biller.createdAt);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle Delete
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this biller?")) {
      setBillers((prev) => prev.filter((b) => b.id !== id));
      // Adjust page if needed
      if (
        (billers.length - 1) % ITEMS_PER_PAGE === 0 &&
        currentPage === totalPages &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Handle Refresh (reset form)
  const handleRefresh = () => {
    resetForm();
  };

  // Handle Report (dummy alert)
  const handleReport = () => {
    alert("Report generated (dummy action).");
  };

  // Pagination controls
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-800">
      <title>Billers - Dreams POS</title>

      {/* Page Title */}
      <h1 className="text-3xl font-semibold mb-6">Billers</h1>

      {/* Form Section */}
      <section className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add / Edit Biller</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          noValidate
        >
          {/* Name */}
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-1 font-medium">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              id="name"
              type="text"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              id="email"
              type="email"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label htmlFor="phone" className="mb-1 font-medium">
              Phone <span className="text-red-600">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col">
            <label htmlFor="address" className="mb-1 font-medium">
              Address <span className="text-red-600">*</span>
            </label>
            <input
              id="address"
              type="text"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          {/* City */}
          <div className="flex flex-col">
            <label htmlFor="city" className="mb-1 font-medium">
              City <span className="text-red-600">*</span>
            </label>
            <input
              id="city"
              type="text"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          {/* Country */}
          <div className="flex flex-col">
            <label htmlFor="country" className="mb-1 font-medium">
              Country <span className="text-red-600">*</span>
            </label>
            <input
              id="country"
              type="text"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          {/* Postal Code */}
          <div className="flex flex-col">
            <label htmlFor="postalCode" className="mb-1 font-medium">
              Postal Code <span className="text-red-600">*</span>
            </label>
            <input
              id="postalCode"
              type="text"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          {/* GST No */}
          <div className="flex flex-col">
            <label htmlFor="gstNo" className="mb-1 font-medium">
              GST No <span className="text-red-600">*</span>
            </label>
            <input
              id="gstNo"
              type="text"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={gstNo}
              onChange={(e) => setGstNo(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          {/* Created At */}
          <div className="flex flex-col">
            <label htmlFor="createdAt" className="mb-1 font-medium">
              Created At
            </label>
            <input
              id="createdAt"
              type="date"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={createdAt}
              onChange={(e) => setCreatedAt(e.target.value)}
              autoComplete="off"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-end space-x-4 md:col-span-3">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded transition"
            >
              {editingId !== null ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded transition"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded transition"
            >
              Report
            </button>
          </div>
        </form>
      </section>

      {/* Billers Table Section */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Billers List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-r border-gray-300">
                  #
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-r border-gray-300">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-r border-gray-300">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-r border-gray-300">
                  Phone
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-r border-gray-300">
                  Address
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-r border-gray-300">
                  City
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-r border-gray-300">
                  Country
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-r border-gray-300">
                  Postal Code
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-r border-gray-300">
                  GST No
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-r border-gray-300">
                  Created At
                </th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedBillers.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="text-center py-4 text-gray-500 italic"
                  >
                    No billers found.
                  </td>
                </tr>
              ) : (
                paginatedBillers.map((biller, idx) => (
                  <tr key={biller.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300 text-sm text-gray-700">
                      {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300 text-sm text-gray-700">
                      {biller.name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300 text-sm text-gray-700">
                      {biller.email}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300 text-sm text-gray-700">
                      {biller.phone}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300 text-sm text-gray-700">
                      {biller.address}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300 text-sm text-gray-700">
                      {biller.city}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300 text-sm text-gray-700">
                      {biller.country}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300 text-sm text-gray-700">
                      {biller.postalCode}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300 text-sm text-gray-700">
                      {biller.gstNo}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300 text-sm text-gray-700">
                      {biller.createdAt}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-center text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(biller)}
                        className="text-indigo-600 hover:text-indigo-900 font-semibold"
                        aria-label={`Edit biller ${biller.name}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(biller.id)}
                        className="text-red-600 hover:text-red-900 font-semibold"
                        aria-label={`Delete biller ${biller.name}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <nav
          className="mt-6 flex justify-center items-center space-x-2"
          aria-label="Pagination"
        >
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border border-gray-300 ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Previous page"
          >
            &laquo;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-1 rounded border border-gray-300 ${
                page === currentPage
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              aria-current={page === currentPage ? "page" : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border border-gray-300 ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Next page"
          >
            &raquo;
          </button>
        </nav>
      </section>
    </div>
  );
};

export default Billers;