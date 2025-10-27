import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";
import { CATEGORIES , STATUSES } from "@/constants/constants";

interface ProductRecord {
  id: number;
  productName: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  status: string;
  image: string;
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any, idx?: number) => JSX.Element;
  align?: "left" | "center" | "right";
}  
const BRANDS = ["All Brands", "Brand A", "Brand B", "Brand C"];

export default function Products() {
  const [data, setData] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const response = await apiService.get<ProductRecord[]>("Products");
      if (response.status.code === "S") {
        setData(response.result);
        setError(null);
      } else {
        setError(response.status.description);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = item.productName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All Categories" ||
        item.category === selectedCategory;
      const matchesBrand =
        selectedBrand === "All Brands" || item.brand === selectedBrand;
      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [data, searchTerm, selectedCategory, selectedBrand]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleView = (record: ProductRecord) => {
    navigate("/inventory/products/create", {
      state: { mode: "view", productRecord: record },
    });
  };

  const handleEdit = (record: ProductRecord) => {
    navigate("/inventory/products/create", {
      state: { mode: "edit", productRecord: record },
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setData((prev) => prev.filter((item) => item.id !== id));
      if (
        (currentPage - 1) * itemsPerPage >= filteredData.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setSelectedBrand("All Brands");
    setCurrentPage(1);
    loadData();
  };

  const handleAddClick = () => {
    navigate("/inventory/products/create");
  };

  const columns: Column[] = [
    {
      key: "productName",
      label: "Product",
      align: "left",
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <img
            src={row.image}
            alt={row.productName}
            className="w-12 h-12 rounded object-contain"
          />
          <span>{row.productName}</span>
        </div>
      ),
    },
    { key: "category", label: "Category", align: "left" },
    {
      key: "price",
      label: "Price ($)",
      align: "right",
      render: (value) => value.toFixed(2),
    },
    { key: "stock", label: "Stock", align: "right" },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (value) => (
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
            value === "Active"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  const rowActions = (row: ProductRecord) => (
    <>
      <button
        onClick={() => handleView(row)}
        aria-label={`View ${row.productName}`}
        className="text-gray-700 border border-gray-700 hover:bg-blue-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-eye" aria-hidden="true"></i>
        <span className="sr-only">View</span>
      </button>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit ${row.productName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete ${row.productName}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete</span>
      </button>
    </>
  );

  const customFilters = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        type="text"
        placeholder="Search Product"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search by product name"
      />
      <select
        value={selectedCategory}
        onChange={(e) => {
          setSelectedCategory(e.target.value);
          setCurrentPage(1);
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
        value={selectedBrand}
        onChange={(e) => {
          setSelectedBrand(e.target.value);
          setCurrentPage(1);
        }}
        className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter by brand"
      >
        {BRANDS.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <PageBase1
      title="Products"
      description="View and manage products."
      icon="fa fa-boxes"
      onAddClick={handleAddClick}
      onRefresh={handleClear}
      onReport={null}
      search={searchTerm}
      onSearchChange={(e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
      }}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      formMode={null}
      setFormMode={() => {}}
      modalTitle=""
      modalForm={() => null}
      onFormSubmit={() => {}}
      customFilters={customFilters}
    />
  );
}
