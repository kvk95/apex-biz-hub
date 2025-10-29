import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";

const CATEGORIES = [
  "All",
  "Beverages",
  "Dairy",
  "Condiments",
  "Spices",
]; // Replace with PRODUCT_CATEGORIES from constants.ts if available
const BRANDS = [
  "All",
  "FreshFarms",
  "DairyBest",
  "CheeseCo",
  "ButterKing",
  "SauceMaster",
  "SpiceWorld",
]; // Replace with BRANDS from constants.ts if available
const WAREHOUSES = [
  "All",
  "Main Warehouse",
  "Secondary Warehouse",
]; // Replace with WAREHOUSES from constants.ts if available
const SUPPLIERS = [
  "All",
  "Supplier A",
  "Supplier B",
  "Supplier C",
  "Supplier D",
  "Supplier E",
]; // Replace with SUPPLIERS from constants.ts if available
const STATUS_OPTIONS = [
  "All",
  "Expired",
  "Expiring",
  "Safe",
]; // Replace with EXPIRY_STATUSES from constants.ts if available

interface ProductExpiry {
  productName: string;
  productCode: string;
  barcode: string;
  category: string;
  subCategory: string;
  brand: string;
  unit: string;
  quantity: number;
  expiryDate: string; // ISO string yyyy-mm-dd
  purchasePrice: number;
  salePrice: number;
  warehouse: string;
  supplier: string;
  status: "Expired" | "Expiring" | "Safe";
}

export default function ProductExpiryReport() {
  const [data, setData] = useState<ProductExpiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [productCode, setProductCode] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [warehouse, setWarehouse] = useState("All");
  const [supplier, setSupplier] = useState("All");
  const [status, setStatus] = useState("All");
  const [expiryFrom, setExpiryFrom] = useState("");
  const [expiryTo, setExpiryTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
    document.title = "Product Expiry Report";
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<ProductExpiry[]>("ProductExpiryReport");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("ProductExpiryReport loadData:", { data: response.result });
  };

  const filteredData = useMemo(() => {
    const result = data.filter((item) => {
      const matchProductName = productName
        ? item.productName.toLowerCase().includes(productName.toLowerCase())
        : true;
      const matchProductCode = productCode
        ? item.productCode.toLowerCase().includes(productCode.toLowerCase())
        : true;
      const matchCategory = category !== "All" ? item.category === category : true;
      const matchBrand = brand !== "All" ? item.brand === brand : true;
      const matchWarehouse = warehouse !== "All" ? item.warehouse === warehouse : true;
      const matchSupplier = supplier !== "All" ? item.supplier === supplier : true;
      const matchStatus = status !== "All" ? item.status === status : true;
      const matchExpiryFrom = expiryFrom ? item.expiryDate >= expiryFrom : true;
      const matchExpiryTo = expiryTo ? item.expiryDate <= expiryTo : true;
      return (
        matchProductName &&
        matchProductCode &&
        matchCategory &&
        matchBrand &&
        matchWarehouse &&
        matchSupplier &&
        matchStatus &&
        matchExpiryFrom &&
        matchExpiryTo
      );
    });
    console.log("ProductExpiryReport filteredData:", result, {
      productName,
      productCode,
      category,
      brand,
      warehouse,
      supplier,
      status,
      expiryFrom,
      expiryTo,
    });
    return result;
  }, [
    data,
    productName,
    productCode,
    category,
    brand,
    warehouse,
    supplier,
    status,
    expiryFrom,
    expiryTo,
  ]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("ProductExpiryReport paginatedData:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
      totalItems: filteredData.length,
    });
    return result;
  }, [filteredData, currentPage, itemsPerPage]);

  const handleClear = () => {
    setProductName("");
    setProductCode("");
    setCategory("All");
    setBrand("All");
    setWarehouse("All");
    setSupplier("All");
    setStatus("All");
    setExpiryFrom("");
    setExpiryTo("");
    setCurrentPage(1);
    loadData();
    console.log("ProductExpiryReport handleClear");
  };

  const handleReport = () => {
    alert("Product Expiry Report:\n\n" + JSON.stringify(filteredData, null, 2));
    console.log("ProductExpiryReport handleReport:", { filteredData });
  };

  const columns: Column[] = [
    {
      key: "productName",
      label: "Product Name",
      align: "left",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "productCode", label: "Product Code", align: "left" },
    { key: "barcode", label: "Barcode", align: "left" },
    { key: "category", label: "Category", align: "left" },
    { key: "subCategory", label: "Sub Category", align: "left" },
    { key: "brand", label: "Brand", align: "left" },
    { key: "unit", label: "Unit", align: "left" },
    { key: "quantity", label: "Quantity", align: "right" },
    { key: "expiryDate", label: "Expiry Date", align: "left" },
    {
      key: "purchasePrice",
      label: "Purchase Price",
      align: "right",
      render: (value) => `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      key: "salePrice",
      label: "Sale Price",
      align: "right",
      render: (value) => `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    { key: "warehouse", label: "Warehouse", align: "left" },
    { key: "supplier", label: "Supplier", align: "left" },
    {
      key: "status",
      label: "Status",
      align: "left",
      render: (value) => (
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
            value === "Expired"
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              : value === "Expiring"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  const tableFooter = () => (
    <tfoot className="bg-muted font-semibold text-foreground">
      <tr>
        <td className="px-4 py-3 text-right" colSpan={7}>
          Total
        </td>
        <td className="px-4 py-3 text-right">{filteredData
          .reduce((acc, cur) => acc + cur.quantity, 0)
          .toLocaleString("en-IN", { minimumFractionDigits: 0 })}</td>
        <td className="px-4 py-3"></td>
        <td className="px-4 py-3 text-right">{`₹${filteredData
          .reduce((acc, cur) => acc + cur.purchasePrice, 0)
          .toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
        <td className="px-4 py-3 text-right">{`₹${filteredData
          .reduce((acc, cur) => acc + cur.salePrice, 0)
          .toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
        <td className="px-4 py-3" colSpan={3}></td>
      </tr>
    </tfoot>
  );

  const customFilters = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        type="text"
        placeholder="Product Name"
        value={productName}
        onChange={(e) => {
          setProductName(e.target.value);
          setCurrentPage(1);
          console.log("ProductExpiryReport handleProductNameChange:", {
            productName: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search by product name"
      />
      <input
        type="text"
        placeholder="Product Code"
        value={productCode}
        onChange={(e) => {
          setProductCode(e.target.value);
          setCurrentPage(1);
          console.log("ProductExpiryReport handleProductCodeChange:", {
            productCode: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search by product code"
      />
      <select
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          setCurrentPage(1);
          console.log("ProductExpiryReport handleCategoryChange:", {
            category: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by category"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <select
        value={brand}
        onChange={(e) => {
          setBrand(e.target.value);
          setCurrentPage(1);
          console.log("ProductExpiryReport handleBrandChange:", {
            brand: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by brand"
      >
        {BRANDS.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>
      <select
        value={warehouse}
        onChange={(e) => {
          setWarehouse(e.target.value);
          setCurrentPage(1);
          console.log("ProductExpiryReport handleWarehouseChange:", {
            warehouse: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by warehouse"
      >
        {WAREHOUSES.map((w) => (
          <option key={w} value={w}>
            {w}
          </option>
        ))}
      </select>
      <select
        value={supplier}
        onChange={(e) => {
          setSupplier(e.target.value);
          setCurrentPage(1);
          console.log("ProductExpiryReport handleSupplierChange:", {
            supplier: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by supplier"
      >
        {SUPPLIERS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
          setCurrentPage(1);
          console.log("ProductExpiryReport handleStatusChange:", {
            status: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by status"
      >
        {STATUS_OPTIONS.map((st) => (
          <option key={st} value={st}>
            {st}
          </option>
        ))}
      </select>
      <input
        type="date"
        placeholder="Expiry Date From"
        value={expiryFrom}
        onChange={(e) => {
          setExpiryFrom(e.target.value);
          setCurrentPage(1);
          console.log("ProductExpiryReport handleExpiryFromChange:", {
            expiryFrom: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by expiry date from"
      />
      <input
        type="date"
        placeholder="Expiry Date To"
        value={expiryTo}
        onChange={(e) => {
          setExpiryTo(e.target.value);
          setCurrentPage(1);
          console.log("ProductExpiryReport handleExpiryToChange:", {
            expiryTo: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by expiry date to"
      />
    </div>
  );

  return (
    <PageBase1
      title="Product Expiry Report"
      description="View and filter product expiry records."
      icon="fa fa-calendar-times"
      onRefresh={handleClear}
      onReport={handleReport}
      search={productName}
      onSearchChange={(e) => {
        setProductName(e.target.value);
        setCurrentPage(1);
        console.log("ProductExpiryReport handleProductNameChange:", {
          productName: e.target.value,
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