/* -------------------------------------------------
   Products - FINAL: NO ERRORS + REAL DROPDOWNS + EXACT DESIGN
   ------------------------------------------------- */
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { renderStatusBadge } from "@/utils/tableUtils";
import { SearchInput } from "@/components/Search/SearchInput";

type Product = {
  id: number;
  sku: string;
  code: string;
  productName: string;
  productImage: string;
  categoryName: string;
  subCategoryName: string;
  brandName: string;
  unit: string;
  quantity: number;
  price: number;
  createdBy: string;
  status: "Active" | "Inactive";
  quantityAlert: number;
  storeName?: string;
  warehouseName?: string;
};

type Store = { id: number; storeName: string; status: string };
type Warehouse = { id: number; warehouseName: string; warehouseStatus: string };
type Category = { id: number; categoryName: string; status: string };
type SubCategory = { id: number; category: string; subCategory: string; status: string };
type Brand = { id: number; brandName: string; brandStatus: string };

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const [
          prodRes,
          storeRes,
          whRes,
          catRes,
          subCatRes,
          brandRes,
        ] = await Promise.all([
          apiService.get("Products"),
          apiService.get("Stores"),
          apiService.get("Warehouses"),
          apiService.get("Category"),
          apiService.get("SubCategory"),
          apiService.get("Brands"),
        ]);

        const get = (res: any) => (res?.result || res?.data || res || []);

        setProducts(get(prodRes));
        setStores(get(storeRes).filter((s: Store) => s.status === "Active"));
        setWarehouses(get(whRes).filter((w: Warehouse) => w.warehouseStatus === "Active"));
        setCategories(get(catRes).filter((c: Category) => c.status === "Active"));
        setSubCategories(get(subCatRes).filter((sc: SubCategory) => sc.status === "Active"));
        setBrands(get(brandRes).filter((b: Brand) => b.brandStatus === "Active"));

      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const categoryOptions = useMemo(() => ["All Categories", ...categories.map(c => c.categoryName)].sort(), [categories]);
  const brandOptions = useMemo(() => ["All Brands", ...brands.map(b => b.brandName)].sort(), [brands]);

  const filteredData = useMemo(() => {
    return products.filter(item => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = item.productName?.toLowerCase().includes(search) || item.sku?.toLowerCase().includes(search);
      const matchesCat = selectedCategory === "All Categories" || item.categoryName === selectedCategory;
      const matchesBrand = selectedBrand === "All Brands" || item.brandName === selectedBrand;
      return matchesSearch && matchesCat && matchesBrand;
    });
  }, [products, searchTerm, selectedCategory, selectedBrand]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleClear = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setSelectedBrand("All Brands");
    setCurrentPage(1);
  };

  const handleAddClick = () => {
    navigate("/inventory/products/create", {
      state: { mode: "create", masterData: { categories, brands, stores, warehouses, subCategories } }
    });
  };

  const handleEdit = (row: Product) => {
    navigate("/inventory/products/create", {
      state: { mode: "edit", productRecord: row, masterData: { categories, brands, stores, warehouses, subCategories } }
    });
  };

  const handleView = (row: Product) => {
    navigate("/inventory/products/create", {
      state: { mode: "view", productRecord: row, masterData: { categories, brands, stores, warehouses, subCategories } }
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this product?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const columns: Column[] = [
    { key: "sku", label: "SKU", align: "left" },
    {
      key: "productName",
      label: "Product Name",
      align: "left",
      render: (_v, row: Product) => (
        <div className="flex items-center gap-3">
          <img
            src={row.productImage || "/assets/images/placeholder.jpg"}
            alt={row.productName}
            className="w-10 h-10 rounded object-cover border"
            onError={(e) => (e.target as HTMLImageElement).src = "/assets/images/placeholder.jpg"}
          />
          <span className="font-medium">{row.productName}</span>
        </div>
      ),
    },
    { key: "categoryName", label: "Category", align: "left" },
    { key: "subCategoryName", label: "Sub Category", align: "left" },
    { key: "brandName", label: "Brand", align: "left" },
    { key: "price", label: "Price", align: "right", render: v => `$${Number(v).toFixed(2)}` },
    { key: "unit", label: "Unit", align: "left" },
    {
      key: "quantity",
      label: "Qty",
      align: "right",
      render: (v: number, row: Product) => (
        <span className={v <= row.quantityAlert ? "text-red-600 font-bold" : ""}>{v}</span>
      ),
    },
    {
      key: "createdBy",
      label: "Created By",
      align: "left",
      render: (name: string) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-dashed border-gray-400" />
          <span>{name || "Unknown"}</span>
        </div>
      ),
    },
    { key: "status", label: "Status", align: "center", render: renderStatusBadge },
  ];

  const rowActions = (row: Product) => (
    <>
      <button onClick={() => handleView(row)} className="text-gray-700 hover:text-blue-600 p-1">
        <i className="fa fa-eye"></i>
      </button>
      <button onClick={() => handleEdit(row)} className="text-gray-700 hover:text-green-600 p-1">
        <i className="fa fa-edit"></i>
      </button>
      <button onClick={() => handleDelete(row.id)} className="text-gray-700 hover:text-red-600 p-1">
        <i className="fa fa-trash"></i>
      </button>
    </>
  );

  const customFilters = () => (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full px-3">
      <div className="w-full md:w-auto md:max-w-md">
        <SearchInput
          value={searchTerm}
          placeholder="Search"
          onSearch={(q) => { setSearchTerm(q); setCurrentPage(1); }}
          className="w-full"
        />
      </div>
      <div className="flex gap-3">
        <select
          value={selectedCategory}
          onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm min-w-[160px] focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="All Categories" disabled>Select Category</option>
          {categoryOptions.filter(c => c !== "All Categories").map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={selectedBrand}
          onChange={(e) => { setSelectedBrand(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm min-w-[160px] focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="All Brands" disabled>Select Brand</option>
          {brandOptions.filter(b => b !== "All Brands").map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Product List"
      description="Manage your products"
      icon="fa-light fa-boxes"
      onAddClick={handleAddClick}
      onRefresh={handleClear}
      onReport={null}
      search={searchTerm}
      onSearchChange={(q) => { setSearchTerm(q); setCurrentPage(1); }}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      formMode={null}
      setFormMode={() => { }}
      modalTitle=""
      modalForm={() => null}
      onFormSubmit={() => { }}
      customFilters={customFilters}
    >
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 border rounded text-sm flex items-center gap-2 hover:bg-gray-50">
            <i className="fa fa-file-pdf text-red-600"></i> PDF
          </button>
          <button className="px-3 py-2 border rounded text-sm flex items-center gap-2 hover:bg-gray-50">
            <i className="fa fa-file-excel text-green-600"></i> XLS
          </button>
          <button className="px-3 py-2 border rounded text-sm hover:bg-gray-50">
            <i className="fa fa-print"></i>
          </button>
          <button className="px-3 py-2 border rounded text-sm hover:bg-gray-50">
            <i className="fa fa-sync"></i>
          </button>
          <button onClick={handleAddClick} className="bg-orange-500 text-white px-4 py-2 rounded font-medium flex items-center gap-2 hover:bg-orange-600">
            <i className="fa fa-plus-circle"></i> Add Product
          </button>
          <button onClick={() => alert("Import Products (XLS) - Coming Soon")} className="bg-blue-900 text-white px-4 py-2 rounded font-medium flex items-center gap-2 hover:bg-blue-800">
            <i className="fa fa-upload"></i> Import Product
          </button>
        </div>
      )}
    </PageBase1>
  );
}