import { apiService } from "@/services/ApiService";
import React, { useEffect, useState } from "react";

// Assuming these are Shadcn UI or similar component libraries
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Custom components
import { KPICard } from "@/components/KPI/KPICard";
import { Chart } from "@/components/Chart/Chart";
import { DataTable, Column, RowAction } from "@/components/DataTable/DataTable";

// Font Awesome Icons - assuming a global setup or import
// e.g., import { FaShoppingCart, FaUsers, FaArrowUp, FaMoneyBillWave } from 'react-icons/fa';

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
    change: number; // For trend, e.g., 5.2 (percentage)
    icon: string; // Font Awesome class, e.g., 'fa-shopping-cart'
    gradient: string; // Tailwind gradient class, e.g., 'bg-gradient-to-r from-blue-400 to-blue-600'
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
  lowStockProducts: Array<{ name: string; sku: string; stock: number; minStock: number }>; // Added minStock for progress bar
  topCustomers: Array<{ name: string; email: string; orders: number; total: string }>;
  topSellingProducts: Array<{ name: string; sales: number; price: string; percentage: string }>;
  recentSales: Array<any>;
  revenue: { value: string; percentage: number };
  expense: { value: string; percentage: number };
  customerTransactions: Array<any>;
  supplierTransactions: Array<any>;
  expenses: Array<any>;
  invoices: Array<any>;
  topCategories: Array<{ name: string; sales: number }>;
  recentlyAddedProducts: Array<any>;
  expiredProducts: Array<any>;
}

export default function Admin1Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- DataTable Column Definitions (Simplified for brevity, assuming standard formatting) ---

  const lowStockColumns: Column[] = [
    { key: "name", label: "Product", sortable: true },
    { key: "sku", label: "SKU", sortable: true },
    {
      key: "stock",
      label: "Stock",
      sortable: true,
      render: (value) => <Badge variant="destructive">{value} left</Badge>,
    },
  ];

  const recentOrderColumns: Column[] = [
    { key: "id", label: "Order ID" },
    { key: "customer", label: "Customer" },
    { key: "amount", label: "Amount" },
    {
      key: "status",
      label: "Status",
      render: (value) => {
        let variant: 'default' | 'secondary' | 'destructive' | 'outline' = "outline";
        if (value === "Completed") variant = "default";
        else if (value === "Processing") variant = "secondary";
        else if (value === "Cancelled") variant = "destructive";
        return <Badge variant={variant}>{value}</Badge>;
      },
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
    { key: "product", label: "Product" },
    { key: "price", label: "Price" },
  ];

  const expiredColumns: Column[] = [
    { key: "product", label: "Product" },
    { key: "sku", label: "SKU" },
    { key: "expiredDate", label: "Expired Date" },
  ];

  // --- Data Fetching Logic ---

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    // Simulating a more robust API call for better loading state
    try {
      const response = await apiService.get<DashboardData>("Admin1Dashboard");
      if (response.status.code === "S") {
        setData(response.result);
        setError(null);
      } else {
        setError(response.status.description);
      }
    } catch (err) {
      setError("Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const rowActions: RowAction[] = [
    { label: "View Details", onClick: (row) => console.log("View", row) },
    { label: "Edit", onClick: (row) => console.log("Edit", row) },
  ];

  // --- Loading/Error States ---

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-primary">
        <i className="fa fa-spinner fa-spin mr-2" /> Loading Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl text-red-600">
        <i className="fa fa-exclamation-triangle mr-2" /> Error: {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-muted-foreground">
        No data available to display.
      </div>
    );
  }

  // --- Main Dashboard Render ---

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8 animate-fade-in font-poppins">
      {/* Header and Quick Alerts */}
      <div className="flex items-start justify-between flex-col md:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            <i className="fa fa-tachometer-alt text-primary mr-2" />
            Admin Dashboard
          </h1>
          <p className="text-lg text-muted-foreground mt-1">
            Welcome back! Here's a snapshot of your business today.
          </p>

          {/* Alert Cards - Enhanced Visuals */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="p-3 rounded-lg shadow-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className="font-semibold text-green-700 dark:text-green-300">
                <i className="fa fa-truck text-lg mr-2" />
                You have <span className="text-xl font-bold">{data.ordersToday}+</span> Orders Today.
              </p>
            </div>
            <div className="p-3 rounded-lg shadow-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <p className="font-semibold text-yellow-700 dark:text-yellow-300">
                <i className="fa fa-exclamation-circle text-lg mr-2" />
                <span className="font-bold">{data.stockAlert.product}</span> is Low in Stock (&lt; {data.stockAlert.stock} Pcs).
                <Button variant="link" size="sm" className="ml-2 p-0 h-auto text-yellow-700 dark:text-yellow-300 hover:text-yellow-800" onClick={() => console.log("Add Stock")}>
                  <i className="fa fa-plus-circle mr-1" /> Add Stock
                </Button>
              </p>
            </div>
          </div>
        </div>

        {/* Date Filters - More button-like */}
        <div className="flex gap-2 p-1 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-inner">
          <Button variant="outline" className="text-sm">Today</Button>
          <Button variant="outline" className="text-sm">This Week</Button>
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-md text-sm">This Month</Button>
        </div>
      </div>

      <hr className="my-6 border-gray-200 dark:border-gray-700" />

      {/* Primary KPI Cards - Richer Look */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {data.stats.map((stat) => (
          <KPICard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            trend={stat.change} // Assuming KPICard handles rendering trend color/icon
            icon={<i className={`fa-fw ${stat.icon} h-8 w-8 text-white`} aria-hidden="true" />}
            // Applying distinct colors/gradients for a richer look
            className={`shadow-xl hover:shadow-2xl transition-shadow duration-300 ${stat.gradient}`}
            iconBg={stat.gradient}
          />
        ))}
      </div>

      {/* Sales, Overall, and Invoice Counts - Simple Card Layout */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-indigo-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold text-indigo-700 dark:text-indigo-300">
              Sales & Purchase
            </CardTitle>
            <i className="fa fa-chart-line text-indigo-400 h-6 w-6" />
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-2xl font-bold">{data.counts.totalSalesCount}</p>
            <p className="text-sm text-muted-foreground">Total Sales</p>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Purchase: {data.counts.totalPurchaseCount}</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold text-green-700 dark:text-green-300">
              Key Counts
            </CardTitle>
            <i className="fa fa-users text-green-400 h-6 w-6" />
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p><span className="font-medium">Suppliers:</span> <Badge variant="secondary">{data.counts.suppliers}</Badge></p>
            <p><span className="font-medium">Customers:</span> <Badge variant="secondary">{data.counts.customers}</Badge></p>
            <p><span className="font-medium">Orders:</span> <Badge variant="secondary">{data.counts.orders}</Badge></p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold text-orange-700 dark:text-orange-300">
              Invoices
            </CardTitle>
            <i className="fa fa-file-invoice text-orange-400 h-6 w-6" />
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-2xl font-bold">{data.counts.salesInvoice}</p>
            <p className="text-sm text-muted-foreground">Sales Invoices</p>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Purchase Invoices: {data.counts.purchaseInvoice}</p>
          </CardContent>
        </Card>
      </div>

      <hr className="my-6 border-gray-200 dark:border-gray-700" />

      {/* Charts - Sales Overview & Category Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Sales Overview <i className="fa fa-chart-area ml-2 text-primary" /></CardTitle>
          </CardHeader>
          <CardContent>
            {/* Assuming 'area' chart component supports multi-series for Sales/Purchases/Profit and gradient fills */}
            <Chart
              type="area"
              data={data?.salesData || []}
              dataKey="sales"
              xAxisKey="month"
              height={350} // Increased height for better visibility
              seriesKeys={["sales", "purchases", "profit"]} // Include multiple series
              gradientColor="#3b82f6" // Custom prop for gradient start color
            />
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Category Performance <i className="fa fa-chart-bar ml-2 text-primary" /></CardTitle>
          </CardHeader>
          <CardContent>
            {/* Assuming 'bar' chart supports vibrant, distinct colors */}
            <Chart
              type="bar"
              data={data?.categoryData || []}
              dataKey="sales"
              xAxisKey="name"
              height={350}
              barColor="#10b981" // Custom prop for bar color
            />
          </CardContent>
        </Card>
      </div>

      <hr className="my-6 border-gray-200 dark:border-gray-700" />

      {/* Recent Orders, Low Stock, and Top Customers - 2/3 & 1/3 Split */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Recent Orders <i className="fa fa-receipt ml-2 text-primary" /></CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={recentOrderColumns}
              data={data?.recentOrders || []}
              rowActions={rowActions}
              pageSize={5} // Limit table size on dashboard
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Low Stock Card - Prominent Warning Style */}
          <Card className="border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-950 shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-yellow-700 dark:text-yellow-300">
                <i className="fa fa-exclamation-triangle h-6 w-6" aria-hidden="true" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(data?.lowStockProducts || []).slice(0, 3).map((product) => ( // Limiting to top 3
                  <div key={product.sku} className="space-y-1 p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sku}</p>
                      </div>
                      <Badge variant="destructive" className="animate-pulse">{product.stock} left</Badge>
                    </div>
                    {/* Stock Progress Bar */}
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-full bg-yellow-500 transition-all"
                        style={{
                          width: `${Math.min(100, (product.stock / (product.minStock || 1)) * 100)}%`, // Ensure max 100%
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Customers Card - Ranked List Style */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Top Customers <i className="fa fa-crown ml-2 text-yellow-500" /></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(data?.topCustomers || []).slice(0, 5).map((customer, index) => (
                  <div key={customer.email} className="flex items-center gap-4 border-b pb-2 last:border-b-0 last:pb-0">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full font-extrabold shadow-md
                      ${index === 0 ? 'bg-yellow-400 text-yellow-900 text-lg' : index === 1 ? 'bg-gray-300 text-gray-800' : index === 2 ? 'bg-orange-300 text-orange-900' : 'bg-primary/10 text-primary'}`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-semibold">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {customer.orders} orders
                      </p>
                    </div>
                    <p className="font-bold text-lg text-green-600 dark:text-green-400">
                      {customer.total}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <hr className="my-6 border-gray-200 dark:border-gray-700" />

      {/* Revenue, Expense, Top Selling & Recent Sales */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Revenue Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-teal-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold text-teal-700 dark:text-teal-300">
              <i className="fa fa-dollar-sign mr-2" /> Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold">{data.revenue.value}</p>
            <p className={`text-sm mt-1 ${data.revenue.percentage >= 0 ? 'text-success' : 'text-destructive'}`}>
              <i className={`fa ${data.revenue.percentage >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`} />
              {data.revenue.percentage}% vs last period
            </p>
          </CardContent>
        </Card>

        {/* Expense Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold text-red-700 dark:text-red-300">
              <i className="fa fa-hand-holding-usd mr-2" /> Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold">{data.expense.value}</p>
            <p className={`text-sm mt-1 ${data.expense.percentage >= 0 ? 'text-success' : 'text-destructive'}`}>
              <i className={`fa ${data.expense.percentage >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`} />
              {data.expense.percentage}% vs last period
            </p>
          </CardContent>
        </Card>

        {/* Top Selling Products - List */}
        <Card className="lg:col-span-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Top Selling Products <i className="fa fa-fire ml-2 text-red-500" /></CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {(data.topSellingProducts || []).slice(0, 4).map((product) => (
              <div key={product.name} className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-xs text-muted-foreground"><Badge variant="outline">{product.sales} Sales</Badge></p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{product.price}</p>
                  <p className="text-xs text-success">{product.percentage}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <hr className="my-6 border-gray-200 dark:border-gray-700" />

      {/* Transactions and Invoices - Full Width DataTables */}
      <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-1">
        {/* Customer Transactions */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Recent Customer Transactions <i className="fa fa-exchange-alt ml-2 text-blue-500" /></CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={customerTransactionColumns}
              data={data.customerTransactions || []}
              rowActions={rowActions}
              pageSize={5}
            />
          </CardContent>
        </Card>

        {/* Supplier Transactions */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Recent Supplier Transactions <i className="fa fa-handshake ml-2 text-purple-500" /></CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={supplierTransactionColumns}
              data={data.supplierTransactions || []}
              rowActions={rowActions}
              pageSize={5}
            />
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Recent Invoices <i className="fa fa-file-alt ml-2 text-orange-500" /></CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={invoiceColumns}
              data={data.invoices || []}
              rowActions={rowActions}
              pageSize={5}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recently Added Products */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Recently Added Products <i className="fa fa-box-open ml-2 text-green-500" /></CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={recentlyAddedColumns}
              data={data.recentlyAddedProducts || []}
              rowActions={rowActions}
              pageSize={5}
            />
          </CardContent>
        </Card>

        {/* Expired Products */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Expired Products <i className="fa fa-calendar-times ml-2 text-red-500" /></CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={expiredColumns}
              data={data.expiredProducts || []}
              rowActions={rowActions}
              pageSize={5}
            />
          </CardContent>
        </Card>

        {/* Top Categories - Simple list with sales */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Top Categories <i className="fa fa-tags ml-2 text-pink-500" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(data.topCategories || []).slice(0, 5).map((category) => (
                <div key={category.name} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <p className="font-medium text-gray-800 dark:text-gray-200">{category.name}</p>
                  <Badge variant="default" className="bg-pink-500 hover:bg-pink-600">{category.sales} Sales</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
