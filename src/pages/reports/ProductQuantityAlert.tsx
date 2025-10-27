import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";

import { CATEGORIES } from "@/constants/constants";
 
const BRANDS = [
  "All",
  "Apple",
  "Samsung",
  "Sony",
  "Dell",
  "Logitech",
  "HP",
  "Canon",
  "Nike",
  "Adidas",
  "KitchenAid",
  "Bose",
  "Microsoft",
]; // Replace with BRANDS from constants.ts if available

interface Product {
  productCode: string;
  productName: string;
  category: string;
  subCategory: string;
  brand: string;
  unit: string;
  alertQuantity: number;
  quantity: number;
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any, idx?: number) => JSX.Element;
  align?: "left" | "center" | "right";
}

export default function ProductQuantityAlert() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<Product[]>("ProductQuantityAlert");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("ProductQuantityAlert loadData:", { data: response.result });
  };

  const filteredData = useMemo(() => {
    const result = data.filter((item) => {
      const matchProductCode = productCode
        ? item.productCode.toLowerCase().includes(productCode.toLowerCase())
        : true;
      const matchProductName = productName
        ? item.productName.toLowerCase().includes(productName.toLowerCase())
        : true;
      const matchCategory = category !== "All" ? item.category === category : true;
      const matchBrand = brand !== "All" ? item.brand === brand : true;
      const matchAlert = item.quantity <= item.alertQuantity;
      return matchProductCode && matchProductName && matchCategory && matchBrand && matchAlert;
    });
    console.log("ProductQuantityAlert filteredData:", result, {
      productCode,
      productName,
      category,
      brand,
    });
    return result;
  }, [data, productCode, productName, category, brand]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("ProductQuantityAlert paginatedData:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
      totalItems: filteredData.length,
    });
    return result;
  }, [filteredData, currentPage, itemsPerPage]);

  const handleClear = () => {
    setProductCode("");
    setProductName("");
    setCategory("All");
    setBrand("All");
    setCurrentPage(1);
    loadData();
    console.log("ProductQuantityAlert handleClear");
  };

  const handleReport = () => {
    alert("Product Quantity Alert Report:\n\n" + JSON.stringify(filteredData, null, 2));
    console.log("ProductQuantityAlert handleReport:", { filteredData });
  };

  const columns: Column[] = [
    { key: "productCode", label: "Product Code", align: "left" },
    {
      key: "productName",
      label: "Product Name",
      align: "left",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: "category", label: "Category", align: "left" },
    { key: "subCategory", label: "Sub Category", align: "left" },
    { key: "brand", label: "Brand", align: "left" },
    { key: "unit", label: "Unit", align: "left" },
    { key: "alertQuantity", label: "Alert Quantity", align: "right" },
    { key: "quantity", label: "Quantity", align: "right" },
  ];

  const tableFooter = () => (
    <tfoot className="bg-muted font-semibold text-foreground">
      <tr>
        <td className="px-4 py-3 text-right" colSpan={6}>
          Total
        </td>
        <td className="px-4 py-3 text-right">{filteredData
          .reduce((acc, cur) => acc + cur.alertQuantity, 0)
          .toLocaleString("en-IN", { minimumFractionDigits: 0 })}</td>
        <td className="px-4 py-3 text-right">{filteredData
          .reduce((acc, cur) => acc + cur.quantity, 0)
          .toLocaleString("en-IN", { minimumFractionDigits: 0 })}</td>
      </tr>
    </tfoot>
  );

  const customFilters = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        type="text"
        placeholder="Product Code"
        value={productCode}
        onChange={(e) => {
          setProductCode(e.target.value);
          setCurrentPage(1);
          console.log("ProductQuantityAlert handleProductCodeChange:", {
            productCode: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search by product code"
      />
      <input
        type="text"
        placeholder="Product Name"
        value={productName}
        onChange={(e) => {
          setProductName(e.target.value);
          setCurrentPage(1);
          console.log("ProductQuantityAlert handleProductNameChange:", {
            productName: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search by product name"
      />
      <select
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          setCurrentPage(1);
          console.log("ProductQuantityAlert handleCategoryChange:", {
            category: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by category"
      >
        <option value="All">All Categories</option>
        {CATEGORIES.slice(1).map((cat) => (
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
          console.log("ProductQuantityAlert handleBrandChange:", {
            brand: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by brand"
      >
        <option value="All">All Brands</option>
        {BRANDS.slice(1).map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <PageBase1
      title="Product Quantity Alert"
      description="View products with quantities at or below alert levels."
      icon="fa fa-bell"
      onRefresh={handleClear}
      onReport={handleReport}
      search={productName}
      onSearchChange={(e) => {
        setProductName(e.target.value);
        setCurrentPage(1);
        console.log("ProductQuantityAlert handleProductNameChange:", {
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