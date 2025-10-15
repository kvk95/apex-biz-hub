import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const pageSize = 5;

export default function Quotation() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Quotation");
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

  // Pagination state for customers table
  const [currentPage, setCurrentPage] = useState(1);

  // Form state
  const [quotationNo, setQuotationNo] = useState("QTN-0001");
  const [quotationDate, setQuotationDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });

  // Since customersData and productsData are removed, 
  // we need to handle initial states carefully.
  // For now, keep customer and customerDetails as null or empty objects.
  const [customer, setCustomer] = useState<number | null>(null);
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [productRows, setProductRows] = useState<
    {
      id: number;
      productId: number;
      code: string;
      price: number;
      quantity: number;
      unit: string;
      total: number;
    }[]
  >([]);

  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);

  // Because customersData and productsData no longer exist,
  // onCustomerChange, onProductChange, addProductRow, and other related functions
  // cannot function properly without data.
  // We keep their definitions but they will need to be adapted once data shape is known.

  const onCustomerChange = (id: number) => {
    setCustomer(id);
    if (data && Array.isArray(data.customers)) {
      const cust = data.customers.find((c: any) => c.id === id);
      if (cust) setCustomerDetails(cust);
    }
  };

  const onProductChange = (rowId: number, productId: number) => {
    if (!data || !Array.isArray(data.products)) return;
    const product = data.products.find((p: any) => p.id === productId);
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

  const addProductRow = () => {
    if (!data || !Array.isArray(data.products) || data.products.length === 0)
      return;
    const newId = productRows.length
      ? Math.max(...productRows.map((r) => r.id)) + 1
      : 1;
    const firstProduct = data.products[0];
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

  const removeProductRow = (rowId: number) => {
    setProductRows((rows) => rows.filter((r) => r.id !== rowId));
  };

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
  const totalPages = data && Array.isArray(data.customers)
    ? Math.ceil(data.customers.length / pageSize)
    : 0;

  const paginatedCustomers = useMemo(() => {
    if (!data || !Array.isArray(data.customers)) return [];
    const start = (currentPage - 1) * pageSize;
    return data.customers.slice(start, start + pageSize);
  }, [currentPage, data]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const onReportClick = () => {
    alert("Report button clicked - Implement report generation");
  };
  const onRefreshClick = () => {
    setQuotationNo("QTN-0001");
    setQuotationDate(new Date().toISOString().slice(0, 10));
    if (data && Array.isArray(data.customers) && data.customers.length > 0) {
      setCustomer(data.customers[0].id);
      setCustomerDetails(data.customers[0]);
    } else {
      setCustomer(null);
      setCustomerDetails(null);
    }
    if (data && Array.isArray(data.products) && data.products.length > 0) {
      setProductRows([
        {
          id: 1,
          productId: data.products[0].id,
          code: data.products[0].code,
          price: data.products[0].price,
          quantity: 1,
          unit: data.products[0].unit,
          total: data.products[0].price * 1,
        },
      ]);
    } else {
      setProductRows([]);
    }
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
                  value={customer ?? ""}
                  onChange={(e) => onCustomerChange(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {data &&
                    Array.isArray(data.customers) &&
                    data.customers.map((cust: any) => (
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
                  value={customerDetails?.name ?? ""}
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
                  value={customerDetails?.phone ?? ""}
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
                  value={customerDetails?.email ?? ""}
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
                  value={customerDetails?.address ?? ""}
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
                          {data &&
                            Array.isArray(data.products) &&
                            data.products.map((prod: any) => (
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
                  {paginatedCustomers.map((cust: any) => (
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