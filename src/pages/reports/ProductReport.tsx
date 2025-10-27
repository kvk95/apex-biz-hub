import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";
import { UNITS,CATEGORIES } from "@/constants/constants";
 
interface ProductData {
  productCode: string;
  productName: string;
  category: string;
  unit: string;
  purchasePrice: number;
  salePrice: number;
  stockQty: number;
  stockValue: number;
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any, idx?: number) => JSX.Element;
  align?: "left" | "center" | "right";
}

export default function ProductReport() {
  const [data, setData] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("All");
  const [unit, setUnit] = useState("PCS");
  const [minStock, setMinStock] = useState("");
  const [maxStock, setMaxStock] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<ProductData[]>("ProductReport");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("ProductReport loadData:", { data: response.result });
  };

  const filteredData = useMemo(() => {
    const result = data.filter((item) => {
      const matchProductCode = productCode.trim()
        ? item.productCode.toLowerCase().includes(productCode.trim().toLowerCase())
        : true;
      const matchProductName = productName.trim()
        ? item.productName.toLowerCase().includes(productName.trim().toLowerCase())
        : true;
      const matchCategory = category === "All" ? true : item.category === category;
      const matchUnit = unit ? item.unit === unit : true;
      const matchMinStock = minStock.trim() ? item.stockQty >= Number(minStock) : true;
      const matchMaxStock = maxStock.trim() ? item.stockQty <= Number(maxStock) : true;
      return (
        matchProductCode &&
        matchProductName &&
        matchCategory &&
        matchUnit &&
        matchMinStock &&
        matchMaxStock
      );
    });
    console.log("ProductReport filteredData:", result, {
      productCode,
      productName,
      category,
      unit,
      minStock,
      maxStock,
    });
    return result;
  }, [data, productCode, productName, category, unit, minStock, maxStock]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("ProductReport paginatedData:", result, {
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
    setUnit("PCS");
    setMinStock("");
    setMaxStock("");
    setCurrentPage(1);
    loadData();
    console.log("ProductReport handleClear");
  };

  const handleReport = () => {
    alert("Product Report:\n\n" + JSON.stringify(filteredData, null, 2));
    console.log("ProductReport handleReport:", { filteredData });
  };

  const columns: Column[] = [
    {
      key: "productCode",
      label: "Product Code",
      align: "left",
    },
    {
      key: "productName",
      label: "Product Name",
      align: "left",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      key: "category",
      label: "Category",
      align: "left",
    },
    {
      key: "unit",
      label: "Unit",
      align: "left",
    },
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
    {
      key: "stockQty",
      label: "Stock Qty",
      align: "right",
    },
    {
      key: "stockValue",
      label: "Stock Value",
      align: "right",
      render: (value) => `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
  ];

  const tableFooter = () => (
    <tfoot className="bg-muted font-semibold text-foreground">
      <tr>
        <td className="px-4 py-3 text-right" colSpan={4}>
          Total
        </td>
        <td className="px-4 py-3 text-right">{`₹${filteredData
          .reduce((acc, cur) => acc + cur.purchasePrice, 0)
          .toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
        <td className="px-4 py-3 text-right">{`₹${filteredData
          .reduce((acc, cur) => acc + cur.salePrice, 0)
          .toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
        <td className="px-4 py-3 text-right">{filteredData
          .reduce((acc, cur) => acc + cur.stockQty, 0)
          .toLocaleString("en-IN", { minimumFractionDigits: 0 })}</td>
        <td className="px-4 py-3 text-right">{`₹${filteredData
          .reduce((acc, cur) => acc + cur.stockValue, 0)
          .toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
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
          console.log("ProductReport handleProductCodeChange:", {
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
          console.log("ProductReport handleProductNameChange:", {
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
          console.log("ProductReport handleCategoryChange:", {
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
        value={unit}
        onChange={(e) => {
          setUnit(e.target.value);
          setCurrentPage(1);
          console.log("ProductReport handleUnitChange:", {
            unit: e.target.value,
          });
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by unit"
      >
        <option value="">All Units</option>
        {UNITS.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Min Stock Qty"
        value={minStock}
        onChange={(e) => {
          setMinStock(e.target.value);
          setCurrentPage(1);
          console.log("ProductReport handleMinStockChange:", {
            minStock: e.target.value,
          });
        }}
        min="0"
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by minimum stock quantity"
      />
      <input
        type="number"
        placeholder="Max Stock Qty"
        value={maxStock}
        onChange={(e) => {
          setMaxStock(e.target.value);
          setCurrentPage(1);
          console.log("ProductReport handleMaxStockChange:", {
            maxStock: e.target.value,
          });
        }}
        min="0"
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by maximum stock quantity"
      />
    </div>
  );

  return (
    <PageBase1
      title="Product Report"
      description="View and filter product records."
      icon="fa fa-cube"
      onRefresh={handleClear}
      onReport={handleReport}
      search={productName}
      onSearchChange={(e) => {
        setProductName(e.target.value);
        setCurrentPage(1);
        console.log("ProductReport handleProductNameChange:", {
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