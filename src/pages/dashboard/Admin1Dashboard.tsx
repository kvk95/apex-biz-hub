import { apiService } from "@/services/ApiService";
import React, { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Icons replaced with Font Awesome
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/KPI/KPICard";
import { Chart } from "@/components/Chart/Chart";
import { DataTable, Column, RowAction } from "@/components/DataTable/DataTable";

interface DashboardData {
  ordersToday: number;
  stockAlert: {
    product: string;
    stock: number;
  };
  stats: Array<{
    id: string;
    title: string;
    value: string;
    change: number;
    icon: string;
    gradient: string;
  }>;
  counts: {
    totalPurchaseCount: string;
    totalSalesCount: string;
    suppliers: number;
    customers: number;
    orders: number;
    purchaseInvoice: number;
    salesInvoice: number;
  };
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
  topSellingProducts: Array<any>;
  recentSales: Array<any>;
  revenue: { value: string; percentage: number };
  expense: { value: string; percentage: number };
  customerTransactions: Array<any>;
  supplierTransactions: Array<any>;
  expenses: Array<any>;
  invoices: Array<any>;
  topCategories: Array<any>;
  recentlyAddedProducts: Array<any>;
  expiredProducts: Array<any>;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
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

  const customerTransactionColumns: Column[] = [
    { key: "date", label: "Date" },
    { key: "customer", label: "Customer" },
    { key: "status", label: "Status" },
    { key: "total", label: "Total" },
  ];

  const supplierTransactionColumns: Column[] = [
    { key: "date", label: "Date" },
    { key: "supplier", label: "Supplier" },
    { key: "status", label: "Status" },
    { key: "total", label: "Total" },
  ];

  const expenseColumns: Column[] = [
    { key: "date", label: "Date" },
    { key: "expense", label: "Expense" },
    { key: "status", label: "Status" },
    { key: "total", label: "Total" },
  ];

  const invoiceColumns: Column[] = [
    { key: "customer", label: "Customer" },
    { key: "dueDate", label: "Due Date" },
    { key: "status", label: "Status" },
    { key: "amount", label: "Amount" },
  ];

  const recentlyAddedColumns: Column[] = [
    { key: "id", label: "#" },
    { key: "product", label: "Products" },
    { key: "price", label: "Price" },
  ];

  const expiredColumns: Column[] = [
    { key: "product", label: "Product" },
    { key: "sku", label: "SKU" },
    { key: "manufacturedDate", label: "Manufactured Date" },
    { key: "expiredDate", label: "Expired Date" },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<DashboardData>("Admin1Dashboard");
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
          <h1 className="text-lg font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening today.
          </p>
          <p className="text-info">
            You have {data.ordersToday}+ Orders, Today.
          </p>
          <p className="text-warning">
            Your Product {data.stockAlert.product} is running Low, already below {data.stockAlert.stock} Pcs.{" "}
            <Button variant="link" onClick={() => console.log("Add Stock")}>
              Add Stock
            </Button>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Today</Button>
          <Button variant="outline">This Week</Button>
          <Button>This Month</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {data.stats.map((stat) => (
          <KPICard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            trend={stat.change}
            icon={<i className={`${stat.icon} h-6 w-6`} aria-hidden="true" />}
            iconBg={stat.gradient}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Sales & Purchase</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Total Purchase: {data.counts.totalPurchaseCount}</p>
            <p>Total Sales: {data.counts.totalSalesCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Overall Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Suppliers: {data.counts.suppliers}</p>
            <p>Customers: {data.counts.customers}</p>
            <p>Orders: {data.counts.orders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Purchase Invoices: {data.counts.purchaseInvoice}</p>
            <p>Sales Invoices: {data.counts.salesInvoice}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              type="area"
              data={data?.salesData || []}
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
              data={data?.categoryData || []}
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
              data={data?.recentOrders || []}
              rowActions={rowActions}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fa fa-exclamation-circle h-5 w-5 text-warning" aria-hidden="true" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(data?.lowStockProducts || []).map((product) => (
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
                {(data?.topCustomers || []).map((customer, index) => (
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

      {/* New sections from templates */}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(data.topSellingProducts || []).map((product) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sales} Sales</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{product.price}</p>
                    <p className="text-xs text-success">{product.percentage}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(data.recentSales || []).map((sale) => (
                <div key={sale.name} className="space-y-1">
                  <p className="font-medium">{sale.name}</p>
                  <p className="text-xs text-muted-foreground">{sale.category} - {sale.date}</p>
                  <div className="flex justify-between">
                    <Badge variant="outline">{sale.status}</Badge>
                    <p className="font-semibold">{sale.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.revenue.value}</p>
            <p className="text-success">{data.revenue.percentage}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.expense.value}</p>
            <p className="text-success">{data.expense.percentage}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Customer Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={customerTransactionColumns}
              data={data.customerTransactions || []}
              rowActions={rowActions}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Supplier Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={supplierTransactionColumns}
              data={data.supplierTransactions || []}
              rowActions={rowActions}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={expenseColumns}
              data={data.expenses || []}
              rowActions={rowActions}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={invoiceColumns}
              data={data.invoices || []}
              rowActions={rowActions}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(data.topCategories || []).map((category) => (
              <div key={category.name} className="flex justify-between">
                <p>{category.name}</p>
                <p>{category.sales} Sales</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recently Added Products</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={recentlyAddedColumns}
              data={data.recentlyAddedProducts || []}
              rowActions={rowActions}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expired Products</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={expiredColumns}
              data={data.expiredProducts || []}
              rowActions={rowActions}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}