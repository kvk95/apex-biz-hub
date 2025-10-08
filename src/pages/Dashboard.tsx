import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
  Users,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const salesData = [
  { month: "Jan", sales: 45000, purchases: 32000, profit: 13000 },
  { month: "Feb", sales: 52000, purchases: 35000, profit: 17000 },
  { month: "Mar", sales: 48000, purchases: 33000, profit: 15000 },
  { month: "Apr", sales: 61000, purchases: 40000, profit: 21000 },
  { month: "May", sales: 55000, purchases: 38000, profit: 17000 },
  { month: "Jun", sales: 67000, purchases: 42000, profit: 25000 },
];

const categoryData = [
  { name: "Electronics", sales: 28000 },
  { name: "Clothing", sales: 22000 },
  { name: "Food", sales: 18000 },
  { name: "Books", sales: 15000 },
  { name: "Sports", sales: 12000 },
];

const recentOrders = [
  { id: "#ORD-2024-001", customer: "John Doe", product: "iPhone 15 Pro", amount: "$1,299", status: "Completed", date: "2024-01-15" },
  { id: "#ORD-2024-002", customer: "Jane Smith", product: "MacBook Pro", amount: "$2,499", status: "Processing", date: "2024-01-15" },
  { id: "#ORD-2024-003", customer: "Mike Johnson", product: "AirPods Pro", amount: "$249", status: "Completed", date: "2024-01-14" },
  { id: "#ORD-2024-004", customer: "Sarah Williams", product: "iPad Air", amount: "$599", status: "Pending", date: "2024-01-14" },
  { id: "#ORD-2024-005", customer: "Tom Brown", product: "Apple Watch", amount: "$399", status: "Completed", date: "2024-01-13" },
];

const lowStockProducts = [
  { name: "iPhone 15 Pro", sku: "IPH-15-PRO", stock: 5, minStock: 20 },
  { name: "Samsung Galaxy S24", sku: "SAM-S24", stock: 8, minStock: 15 },
  { name: "Sony WH-1000XM5", sku: "SONY-WH5", stock: 3, minStock: 10 },
  { name: "Dell XPS 15", sku: "DELL-XPS15", stock: 4, minStock: 10 },
];

const topCustomers = [
  { name: "John Doe", email: "john@example.com", orders: 24, total: "$12,450" },
  { name: "Jane Smith", email: "jane@example.com", orders: 18, total: "$9,870" },
  { name: "Mike Johnson", email: "mike@example.com", orders: 15, total: "$8,320" },
  { name: "Sarah Williams", email: "sarah@example.com", orders: 12, total: "$6,540" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Today</Button>
          <Button variant="outline">This Week</Button>
          <Button>This Month</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Orders"
          value="1,234"
          change={12.5}
          icon={<ShoppingCart className="h-6 w-6 text-primary" />}
          iconBg="bg-primary-light"
        />
        <StatsCard
          title="Total Sales"
          value="$67,432"
          change={8.2}
          icon={<DollarSign className="h-6 w-6 text-success" />}
          iconBg="bg-success-light"
        />
        <StatsCard
          title="Total Profit"
          value="$25,890"
          change={15.3}
          icon={<TrendingUp className="h-6 w-6 text-accent" />}
          iconBg="bg-accent-light"
        />
        <StatsCard
          title="Low Stock Items"
          value="24"
          change={-5.7}
          icon={<AlertCircle className="h-6 w-6 text-warning" />}
          iconBg="bg-warning-light"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorSales)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell>{order.amount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "Completed"
                            ? "default"
                            : order.status === "Processing"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                {lowStockProducts.map((product) => (
                  <div key={product.sku} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sku}</p>
                      </div>
                      <Badge variant="destructive">{product.stock} left</Badge>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-warning transition-all"
                        style={{ width: `${(product.stock / product.minStock) * 100}%` }}
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
                {topCustomers.map((customer, index) => (
                  <div key={customer.email} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">{customer.orders} orders</p>
                    </div>
                    <p className="font-semibold text-success">{customer.total}</p>
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
