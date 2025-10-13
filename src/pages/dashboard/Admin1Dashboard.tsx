import { apiService } from "@/services/ApiService";
import React, { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/KPI/KPICard";
import { Chart } from "@/components/Chart/Chart";
import { DataTable, Column, RowAction } from "@/components/DataTable/DataTable";

interface data {
  stats: Array<{
    id: string;
    title: string;
    value: string;
    change: number;
    icon: string;
    gradient: string;
  }>;
  salesData: Array<{
    month: string;
    sales: number;
    purchases: number;
    profit: number;
  }>;
  categoryData: Array<{ name: string; sales: number }>;
  recentOrders: Array<any>;
  lowStockProducts: Array<any>;
  topCustomers: Array<any>;
  roomAvailability: Array<any>;
  reservationData: Array<any>;
  visitorsData: Array<any>;
  guestList: Array<any>;
  bookingSource: Array<any>;
}

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lowStockColumns: Column[] = [
    { key: "name", label: "Product", sortable: true },
    { key: "sku", label: "SKU", sortable: true },
    { key: "stock", label: "Stock", sortable: true },
    {
      key: "status",
      label: "Status",
      render: (value) => <Badge variant="destructive">{value} left</Badge>,
    },
  ];

  const recentOrderColumns: Column[] = [
    { key: "id", label: "Order ID", sortable: true },
    { key: "customer", label: "Customer", sortable: true },
    { key: "product", label: "Product" },
    { key: "amount", label: "Amount", sortable: true },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <Badge
          variant={
            value === "Completed"
              ? "default"
              : value === "Processing"
              ? "secondary"
              : "outline"
          }
        >
          {value}
        </Badge>
      ),
    },
    { key: "date", label: "Date" },
  ];

  useEffect(() => {
    document.title = "Discount - Dreams POS";
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Admin1Dashboard");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  const rowActions: RowAction[] = [
    {
      label: "View Details",
      onClick: (row) => console.log("View", row),
    },
    {
      label: "Edit",
      onClick: (row) => console.log("Edit", row),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-destructive">
        Error: {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        No data available
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Today</Button>
          <Button variant="outline">This Week</Button>
          <Button>This Month</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Orders"
          value="1,234"
          trend={12.5}
          icon={<ShoppingCart className="h-6 w-6" />}
          iconBg="bg-primary/10"
        />
        <KPICard
          title="Total Sales"
          value="$67,432"
          trend={8.2}
          icon={<DollarSign className="h-6 w-6" />}
          iconBg="bg-success/10"
        />
        <KPICard
          title="Total Profit"
          value="$25,890"
          trend={15.3}
          icon={<TrendingUp className="h-6 w-6" />}
          iconBg="bg-accent/10"
        />
        <KPICard
          title="Low Stock Items"
          value="24"
          trend={-5.7}
          icon={<AlertCircle className="h-6 w-6" />}
          iconBg="bg-warning/10"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              type="area"
              data={data.salesData}
              dataKey="sales"
              xAxisKey="month"
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              type="bar"
              data={data.categoryData}
              dataKey="sales"
              xAxisKey="name"
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={recentOrderColumns}
              data={data.recentOrders}
              rowActions={rowActions}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.lowStockProducts.map((product) => (
                  <div key={product.sku} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.sku}
                        </p>
                      </div>
                      <Badge variant="destructive">{product.stock} left</Badge>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-warning transition-all"
                        style={{
                          width: `${(product.stock / product.minStock) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topCustomers.map((customer, index) => (
                  <div key={customer.email} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {customer.orders} orders
                      </p>
                    </div>
                    <p className="font-semibold text-success">
                      {customer.total}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
