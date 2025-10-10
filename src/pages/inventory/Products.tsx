import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Filter, Download, Edit, Trash2, Eye } from "lucide-react";
import { useApiService } from "@/hooks/useApiService";
import { DataTable, Column, RowAction } from "@/components/DataTable/DataTable";
import { SearchInput } from "@/components/Search/SearchInput";

interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  brand: string;
  unit: string;
  stock: number;
  price: number;
  status: string;
}

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: products, loading, error } = useApiService<Product[]>('products');

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const columns: Column[] = [
    {
      key: "name",
      label: "Product",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-2xl">
            📦
          </div>
          <div>
            <p className="font-medium">{value}</p>
          </div>
        </div>
      ),
    },
    { key: "sku", label: "SKU", sortable: true },
    { key: "category", label: "Category", sortable: true },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (value) => `$${value.toLocaleString()}`,
    },
    { key: "stock", label: "Stock", sortable: true },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <Badge
          variant={
            value === "In Stock"
              ? "default"
              : value === "Low Stock"
              ? "secondary"
              : "destructive"
          }
        >
          {value}
        </Badge>
      ),
    },
  ];

  const rowActions: RowAction[] = [
    {
      label: "View Details",
      icon: <Eye className="mr-2 h-4 w-4" />,
      onClick: (row) => console.log("View", row),
    },
    {
      label: "Edit",
      icon: <Edit className="mr-2 h-4 w-4" />,
      onClick: (row) => console.log("Edit", row),
    },
    {
      label: "Delete",
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      onClick: (row) => console.log("Delete", row),
      variant: "destructive",
    },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-destructive">Error: {error}</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Products ({filteredProducts.length})</CardTitle>
            <div className="flex gap-2">
              <SearchInput
                placeholder="Search products..."
                onSearch={setSearchTerm}
                className="w-[300px]"
              />
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredProducts}
            rowActions={rowActions}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
