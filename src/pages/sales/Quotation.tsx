import React, { useState, useMemo } from "react";

const customersData = [
  {
    id: 1,
    name: "John Doe",
    phone: "123-456-7890",
    email: "john@example.com",
    address: "123 Main St, Cityville",
  },
  {
    id: 2,
    name: "Jane Smith",
    phone: "987-654-3210",
    email: "jane@example.com",
    address: "456 Elm St, Townsville",
  },
  {
    id: 3,
    name: "Michael Johnson",
    phone: "555-123-4567",
    email: "michael@example.com",
    address: "789 Oak St, Villagetown",
  },
  {
    id: 4,
    name: "Emily Davis",
    phone: "444-555-6666",
    email: "emily@example.com",
    address: "321 Pine St, Hamlet",
  },
  {
    id: 5,
    name: "William Brown",
    phone: "222-333-4444",
    email: "william@example.com",
    address: "654 Maple St, Borough",
  },
  {
    id: 6,
    name: "Olivia Wilson",
    phone: "111-222-3333",
    email: "olivia@example.com",
    address: "987 Birch St, Metropolis",
  },
  {
    id: 7,
    name: "James Taylor",
    phone: "777-888-9999",
    email: "james@example.com",
    address: "159 Cedar St, Capital City",
  },
  {
    id: 8,
    name: "Sophia Martinez",
    phone: "888-999-0000",
    email: "sophia@example.com",
    address: "753 Spruce St, Downtown",
  },
  {
    id: 9,
    name: "Benjamin Anderson",
    phone: "666-777-8888",
    email: "benjamin@example.com",
    address: "852 Walnut St, Uptown",
  },
  {
    id: 10,
    name: "Isabella Thomas",
    phone: "333-444-5555",
    email: "isabella@example.com",
    address: "951 Chestnut St, Suburbia",
  },
];

const productsData = [
  {
    id: 1,
    name: "Product A",
    code: "PA-001",
    price: 25.0,
    unit: "pcs",
  },
  {
    id: 2,
    name: "Product B",
    code: "PB-002",
    price: 40.0,
    unit: "pcs",
  },
  {
    id: 3,
    name: "Product C",
    code: "PC-003",
    price: 15.5,
    unit: "pcs",
  },
  {
    id: 4,
    name: "Product D",
    code: "PD-004",
    price: 60.0,
    unit: "pcs",
  },
  {
    id: 5,
    name: "Product E",
    code: "PE-005",
    price: 100.0,
    unit: "pcs",
  },
];

const pageSize = 5;

export default function Quotation() {
  // Pagination state for customers table
  const [currentPage, setCurrentPage] = useState(1);

  // Form state
  const [quotationNo, setQuotationNo] = useState("QTN-0001");
  const [quotationDate, setQuotationDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [customer, setCustomer] = useState(customersData[0].id);
  const [customerDetails, setCustomerDetails] = useState(customersData[0]);
  const [productRows, setProductRows] = useState([
    {
      id: 1,
      productId: productsData[0].id,
      code: productsData[0].code,
      price: productsData[0].price,
      quantity: 1,
      unit: productsData[0].unit,
      total: productsData[0].price * 1,
    },
  ]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);

  // Update customer details on customer change
  const onCustomerChange = (id: number) => {
    setCustomer(id);
    const cust = customersData.find((c) => c.id === id);
    if (cust) setCustomerDetails(cust);
  };

  // Update product row data on product change
  const onProductChange = (rowId: number, productId: number) => {
    const product = productsData.find((p) => p.id === productId);
    setProductRows((rows) =>
      rows.map((row) =>
        row.id === rowId && product
          ? {
              ...row,
              productId,
              code: product.code,
              price: product.price,
              unit: product.unit,
              total: product.price * row.quantity,
            }
          : row
      )
    );
  };

  // Update quantity on change
  const onQuantityChange = (rowId: number, quantity: number) => {
    setProductRows((rows) =>
      rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              quantity,
              total: row.price * quantity,
            }
          : row
      )
    );
  };

  // Add new product row
  const addProductRow = () => {
    const newId = productRows.length
      ? Math.max(...productRows.map((r) => r.id)) + 1
      : 1;
    const firstProduct = productsData[0];
    setProductRows((rows) => [
      ...rows,
      {
        id: newId,
        productId: firstProduct.id,
        code: firstProduct.code,
        price: firstProduct.price,
        quantity: 1,
        unit: firstProduct.unit,
        total: firstProduct.price * 1,
      },
    ]);
  };

  // Remove product row
  const removeProductRow = (rowId: number) => {
    setProductRows((rows) => rows.filter((r) => r.id !== rowId));
  };

  // Calculate totals
  const subTotal = useMemo(() => {
    return productRows.reduce((acc, row) => acc + row.total, 0);
  }, [productRows]);

  const discountAmount = useMemo(() => {
    return (subTotal * discount) / 100;
  }, [subTotal, discount]);

  const taxAmount = useMemo(() => {
    return ((subTotal - discountAmount) * tax) / 100;
  }, [subTotal, discountAmount, tax]);

  const grandTotal = useMemo(() => {
    return subTotal - discountAmount + taxAmount;
  }, [subTotal, discountAmount, taxAmount]);

  // Pagination logic for customers table
  const totalPages = Math.ceil(customersData.length / pageSize);
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return customersData.slice(start, start + pageSize);
  }, [currentPage]);

  // Handlers for pagination buttons
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Handlers for buttons (report, refresh, save)
  const onReportClick = () => {
    alert("Report button clicked - Implement report generation");
  };
  const onRefreshClick = () => {
    // Reset form to initial state
    setQuotationNo("QTN-0001");
    setQuotationDate(new Date().toISOString().slice(0, 10));
    setCustomer(customersData[0].id);
    setCustomerDetails(customersData[0]);
    setProductRows([
      {
        id: 1,
        productId: productsData[0].id,
        code: productsData[0].code,
        price: productsData[0].price,
        quantity: 1,
        unit: productsData[0].unit,
        total: productsData[0].price * 1,
      },
    ]);
    setDiscount(0);
    setTax(0);
    setCurrentPage(1);
  };
  const onSaveClick = () => {
    alert("Save button clicked - Implement save functionality");
  };

  return (
    <>
      <title>Quotation - Dreams POS</title>
      <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900">
        <div className="max-w-7xl mx-auto bg-white shadow rounded-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Quotation</h1>
            <div className="flex space-x-3">
              <button
                onClick={onReportClick}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                title="Report"
                type="button"
              >
                <i className="fas fa-file-alt mr-2"></i> Report
              </button>
              <button
                onClick={onRefreshClick}
                className="flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md text-sm font-medium"
                title="Refresh"
                type="button"
              >
                <i className="fas fa-sync-alt mr-2"></i> Refresh
              </button>
              <button
                onClick={onSaveClick}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium"
                title="Save"
                type="button"
              >
                <i className="fas fa-save mr-2"></i> Save
              </button>
            </div>
          </div>

          {/* Quotation Info Section */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="quotationNo"
                  className="block text-sm font-semibold mb-1"
                >
                  Quotation No
                </label>
                <input
                  id="quotationNo"
                  type="text"
                  value={quotationNo}
                  onChange={(e) => setQuotationNo(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="quotationDate"
                  className="block text-sm font-semibold mb-1"
                >
                  Quotation Date
                </label>
                <input
                  id="quotationDate"
                  type="date"
                  value={quotationDate}
                  onChange={(e) => setQuotationDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="customerSelect"
                  className="block text-sm font-semibold mb-1"
                >
                  Customer
                </label>
                <select
                  id="customerSelect"
                  value={customer}
                  onChange={(e) => onCustomerChange(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {customersData.map((cust) => (
                    <option key={cust.id} value={cust.id}>
                      {cust.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Customer Details Section */}
          <section className="mb-8 bg-gray-50 border border-gray-200 rounded p-4">
            <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Name
                </label>
                <input
                  type="text"
                  readOnly
                  value={customerDetails.name}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  readOnly
                  value={customerDetails.phone}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  readOnly
                  value={customerDetails.email}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Address
                </label>
                <input
                  type="text"
                  readOnly
                  value={customerDetails.address}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </section>

          {/* Products Table Section */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Products</h2>
            <div className="overflow-x-auto border border-gray-300 rounded">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Product</th>
                    <th className="px-4 py-2 text-left font-semibold">Code</th>
                    <th className="px-4 py-2 text-left font-semibold">Price</th>
                    <th className="px-4 py-2 text-left font-semibold">Quantity</th>
                    <th className="px-4 py-2 text-left font-semibold">Unit</th>
                    <th className="px-4 py-2 text-left font-semibold">Total</th>
                    <th className="px-4 py-2 text-center font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {productRows.map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-2">
                        <select
                          value={row.productId}
                          onChange={(e) =>
                            onProductChange(row.id, Number(e.target.value))
                          }
                          className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {productsData.map((prod) => (
                            <option key={prod.id} value={prod.id}>
                              {prod.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">{row.code}</td>
                      <td className="px-4 py-2">${row.price.toFixed(2)}</td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min={1}
                          value={row.quantity}
                          onChange={(e) =>
                            onQuantityChange(row.id, Number(e.target.value))
                          }
                          className="w-20 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2">{row.unit}</td>
                      <td className="px-4 py-2">${row.total.toFixed(2)}</td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => removeProductRow(row.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Remove product"
                          type="button"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                onClick={addProductRow}
                type="button"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
              >
                <i className="fas fa-plus mr-2"></i> Add Product
              </button>
            </div>
          </section>

          {/* Summary Section */}
          <section className="mb-8 max-w-md ml-auto bg-gray-50 border border-gray-200 rounded p-4">
            <div className="grid grid-cols-2 gap-4 mb-3 items-center">
              <label
                htmlFor="subtotal"
                className="text-sm font-semibold text-gray-700"
              >
                Sub Total:
              </label>
              <div className="text-right text-gray-900 font-semibold">
                ${subTotal.toFixed(2)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3 items-center">
              <label
                htmlFor="discount"
                className="text-sm font-semibold text-gray-700"
              >
                Discount (%):
              </label>
              <input
                id="discount"
                type="number"
                min={0}
                max={100}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3 items-center">
              <label
                htmlFor="tax"
                className="text-sm font-semibold text-gray-700"
              >
                Tax (%):
              </label>
              <input
                id="tax"
                type="number"
                min={0}
                max={100}
                value={tax}
                onChange={(e) => setTax(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-300 items-center">
              <span className="text-lg font-semibold">Grand Total:</span>
              <span className="text-lg font-semibold text-right">
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          </section>

          {/* Customers Table with Pagination */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Customers List</h2>
            <div className="overflow-x-auto border border-gray-300 rounded">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Name</th>
                    <th className="px-4 py-2 text-left font-semibold">Phone</th>
                    <th className="px-4 py-2 text-left font-semibold">Email</th>
                    <th className="px-4 py-2 text-left font-semibold">Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {paginatedCustomers.map((cust) => (
                    <tr key={cust.id}>
                      <td className="px-4 py-2">{cust.name}</td>
                      <td className="px-4 py-2">{cust.phone}</td>
                      <td className="px-4 py-2">{cust.email}</td>
                      <td className="px-4 py-2">{cust.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            <nav
              className="mt-4 flex justify-center items-center space-x-2"
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
                aria-label="Previous Page"
                type="button"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 rounded border border-gray-300 ${
                      page === currentPage
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                    aria-current={page === currentPage ? "page" : undefined}
                    type="button"
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded border border-gray-300 ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                aria-label="Next Page"
                type="button"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </nav>
          </section>
        </div>
      </div>
    </>
  );
}