import { DataTable } from "@/components/DataTable/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import React from "react";
import { Badge } from "@/components/ui/badge"; // Assuming you have a Badge component for statuses

// Assuming these are Shadcn UI or similar component libraries
import { Button } from "@/components/ui/button";

// Dummy Data for the dashboard
const dummyData = {
  ordersToday: 200,
  stockAlert: {
    product: "Apple Iphone 15",
    stock: 5,
  },
  totalPurchaseDue: "$307144",
  totalSalesDue: "$4385",
  totalSaleAmount: "$385656.5",
  totalExpenseAmount: "$40000",
  customers: 100,
  suppliers: 110,
  purchaseInvoice: 150,
  salesInvoice: 170,
  purchasesSalesData: [
    { month: "Jan", sales: 200, purchases: -100 },
    { month: "Feb", sales: 250, purchases: -130 },
    { month: "Mar", sales: 300, purchases: 150 },
    { month: "Apr", sales: 350, purchases: -200 },
    { month: "May", sales: 180, purchases: -90 },
    { month: "Jun", sales: 150, purchases: -70 },
    { month: "Jul", sales: 380, purchases: -250 },
    { month: "Aug", sales: 320, purchases: -200 },
    { month: "Sep", sales: 400, purchases: -210 },
  ],
  recentlyAddedProducts: [
    { id: 1, product: "Lenovo 3rd Generation", price: "$12500" },
    { id: 2, product: "Bold V3.2", price: "$1600" },
    { id: 3, product: "Nike Jordan", price: "$2000" },
    { id: 4, product: "Apple Series 5 Watch", price: "$800" },
  ],
  expiredProducts: [
    { product: "Red Premium Handy", sku: "PT006", expiredDate: "29 Mar 2023" },
    { product: "Iphone 14 Pro", sku: "PT007", expiredDate: "04 Apr 2023" },
    { product: "Black Slim 200", sku: "PT008", expiredDate: "13 May 2023" },
    { product: "Woodcraft Sandal", sku: "PT009", expiredDate: "27 May 2023" },
    {
      product: "Apple Series 5 Watch",
      sku: "PT010",
      expiredDate: "26 May 2023",
    },
  ],
  topSellingProducts: [
    {
      name: "Charger Cable - Lighting",
      sales: 247,
      price: "$187",
      percentage: "+25%",
    },
    {
      name: "Yves Saint Eau De Parfum",
      sales: 289,
      price: "$145",
      percentage: "+25%",
    },
    { name: "Apple Airpods 2", sales: 300, price: "$458", percentage: "+25%" },
    { name: "Vacuum Cleaner", sales: 225, price: "$139", percentage: "-21%" },
  ],
  lowStockProducts: [
    { name: "Dell XPS 13", sku: "#665814", stock: 8, minStock: 10 },
    { name: "Vacuum Cleaner Robot", sku: "#940004", stock: 14, minStock: 20 },
    { name: "KitchenAid Stand Mixer", sku: "#325569", stock: 21, minStock: 15 },
    { name: "Levi's Trucker Jacket", sku: "#124588", stock: 12, minStock: 10 },
  ],
  recentSales: [
    {
      product: "Apple Watch Series 9",
      price: "$640",
      status: "Processing",
      date: "Today",
    },
    {
      product: "Gold Bracelet",
      price: "$126",
      status: "Cancelled",
      date: "Today",
    },
    {
      product: "Parachute Down Duvet",
      price: "$69",
      status: "On Hold",
      date: "15 Jan 2025",
    },
    {
      product: "YETI Rambler Tumbler",
      price: "$65",
      status: "Processing",
      date: "12 Jan 2025",
    },
  ],
  topCustomers: [
    { name: "Carlos Curran", orders: 24, total: "$8964.5" },
    { name: "Stan Gaunter", orders: 22, total: "$16985" },
    { name: "Richard Wilson", orders: 14, total: "$5366" },
    { name: "Mary Bronson", orders: 8, total: "$4569" },
  ],
  topCategories: [
    { name: "Electronics", sales: 698 },
    { name: "Sports", sales: 545 },
    { name: "Lifestyles", sales: 456 },
  ],
  orderStatistics: [
    { hour: "2 AM", orders: 5 },
    { hour: "4 AM", orders: 3 },
    { hour: "6 AM", orders: 6 },
    { hour: "8 AM", orders: 7 },
    { hour: "10 AM", orders: 9 },
    { hour: "12 PM", orders: 8 },
    { hour: "2 PM", orders: 12 },
    { hour: "4 PM", orders: 10 },
    { hour: "6 PM", orders: 5 },
    { hour: "8 PM", orders: 3 },
    { hour: "10 PM", orders: 4 },
    { hour: "12 AM", orders: 6 },
  ],
};

// Row 1 - White Cards for Total Stats
const TotalStatsCards = ({ data }) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {[
      {
        title: "Total Purchase Due",
        value: data.totalPurchaseDue,
        icon: "fa-shopping-bag",
        color: "yellow",
      },
      {
        title: "Total Sales Due",
        value: data.totalSalesDue,
        icon: "fa-money-bill",
        color: "green",
      },
      {
        title: "Total Sale Amount",
        value: data.totalSaleAmount,
        icon: "fa-down-from-line",
        color: "blue",
      },
      {
        title: "Total Expense Amount",
        value: data.totalExpenseAmount,
        icon: "fa-up-from-line",
        color: "red",
      },
    ].map((item, index) => (
      <Card
        key={index}
        className="shadow-sm bg-white border-sm border-gray-200 rounded-md p-3 "
      >
        <CardContent className="flex items-center p-1">
          <div
            className={`dash-imgs me-3 rounded-full w-12 h-12 flex justify-center items-center bg-${item.color}-100`} // Dynamically set light background
          >
            <i
              className={`fa ${item.icon} text-3xl text-${item.color}-500`}
              aria-hidden="true"
            ></i>
          </div>
          <div className="dash-counts">
            <h4 className="mb-1 text-2xl font-bold">{item.value}</h4>
            <p className="mb-0 text-sm text-gray-600">{item.title}</p>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Row 2 - Colorful Cards for Customers, Suppliers, Invoices
const ColorfulStatsCards = ({ data }) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {[
      {
        title: "Customers",
        value: data.customers,
        color: "bg-green-500",
        icon: "user",
      },
      {
        title: "Suppliers",
        value: data.suppliers,
        color: "bg-blue-500",
        icon: "users",
      },
      {
        title: "Purchase Invoice",
        value: data.purchaseInvoice,
        color: "bg-indigo-500",
        icon: "file-alt",
      },
      {
        title: "Sales Invoice",
        value: data.salesInvoice,
        color: "bg-teal-500",
        icon: "file-invoice",
      },
    ].map((item, index) => (
      <Card
        key={index}
        className={`${item.color} shadow-sm rounded-md text-white border-sm border-gray-200`}
      >
        <CardContent className="flex justify-between items-center p-4">
          <div className="dash-counts">
            <h4 className="mb-1 text-white text-2xl font-bold">{item.value}</h4>
            <p className="text-white mb-0">{item.title}</p>
          </div>
          <div className="dash-imgs">
            <i
              className={` fa fa-${item.icon} text-4xl ${item.color}`}
              aria-hidden="true"
            ></i>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Row 3 - Graph for Purchases & Sales, List of Recently Added Products
const PurchasesSalesGraphAndRecentProducts = ({ data }) => (
  <Card className="shadow-sm col-span-1">
    <CardHeader>
      <CardTitle>Purchases & Sales</CardTitle>
    </CardHeader>
    <CardContent>
      <BarChart
        style={{
          width: "100%",
          maxWidth: "700px",
          maxHeight: "70vh",
          aspectRatio: 1.618,
        }}
        data={data} // Replace with data passed to the component
        stackOffset="sign"
        margin={{
          top: 25,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis width="auto" />
        <Tooltip />
        <Legend />
        <ReferenceLine y={0} stroke="#000" />
        <Bar dataKey="sales" fill="#00c853" stackId="stack" />
        <Bar dataKey="purchases" fill="#f44336" stackId="stack" width="4" />
      </BarChart>
    </CardContent>
  </Card>
);

const RecentlyAddedProducts = ({ data }) => (
  <Card className="shadow-sm w-full h-full">
    <CardHeader>
      <CardTitle>Recently Added Products</CardTitle>
    </CardHeader>
    <CardContent className="w-full">
      <DataTable
        columns={[
          { key: "product", label: "Product" },
          { key: "price", label: "Price" },
        ]}
        data={data || []}
        pageSize={5}
      />
    </CardContent>
  </Card>
);

// Row 4 - Expired Products List
const ExpiredProducts = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Expired Products</CardTitle>
    </CardHeader>
    <CardContent>
      <DataTable
        columns={[
          { key: "product", label: "Product" },
          { key: "expiredDate", label: "Expired Date" },
        ]}
        data={data.expiredProducts || []}
        pageSize={5}
      />
    </CardContent>
  </Card>
);

// Row 5 - Top Selling Products, Low Stock Products, Recent Sales

const TopSellingLowStockRecentSales = ({ data }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
    {/* Top Selling Products */}
    <Card className="shadow-sm w-full">
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={[
            { key: "name", label: "Product" },
            { key: "price", label: "Price" },
            { key: "sales", label: "Sales" },
            { key: "percentage", label: "Change" },
          ]}
          data={data.topSellingProducts || []}
          pageSize={5}
          renderRow={({ row }) => (
            <div className="flex items-center space-x-2">
              <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                <img
                  src={row.image}
                  alt={row.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div>
                <h5 className="text-lg font-bold">{row.name}</h5>
                <p className="text-sm text-gray-600">{row.price}</p>
                <Badge
                  variant={
                    row.percentage.includes("-") ? "destructive" : "success"
                  }
                >
                  {row.percentage}
                </Badge>
              </div>
            </div>
          )}
        />
      </CardContent>
    </Card>

    {/* Low Stock Products */}
    <Card className="shadow-sm w-full">
      <CardHeader>
        <CardTitle>Low Stock Products</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={[
            { key: "name", label: "Product" },
            { key: "sku", label: "SKU" },
            { key: "stock", label: "Stock" },
            { key: "minStock", label: "Min Stock" },
          ]}
          data={data.lowStockProducts || []}
          pageSize={5}
          renderRow={({ row }) => (
            <div className="flex items-center space-x-2">
              <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                <img
                  src={row.image}
                  alt={row.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div>
                <h5 className="text-lg font-bold">{row.name}</h5>
                <p className="text-sm text-gray-600">{row.sku}</p>
                <p className="text-sm text-gray-600">Stock: {row.stock}</p>
                <p className="text-sm text-gray-600">
                  Min Stock: {row.minStock}
                </p>
              </div>
            </div>
          )}
        />
      </CardContent>
    </Card>

    {/* Recent Sales */}
    <Card className="shadow-sm w-full">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={[
            { key: "product", label: "Product" },
            { key: "price", label: "Price" },
            { key: "status", label: "Status" },
            { key: "date", label: "Date" },
          ]}
          data={data.recentSales || []}
          pageSize={5}
          renderRow={({ row }) => (
            <div className="flex items-center space-x-2">
              <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                <img
                  src={row.image}
                  alt={row.product}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div>
                <h5 className="text-lg font-bold">{row.product}</h5>
                <p className="text-sm text-gray-600">{row.price}</p>
                <Badge
                  variant={
                    row.status === "Processing"
                      ? "secondary"
                      : row.status === "Cancelled"
                      ? "destructive"
                      : "success"
                  }
                >
                  {row.status}
                </Badge>
                <p className="text-xs text-gray-500">{row.date}</p>
              </div>
            </div>
          )}
        />
      </CardContent>
    </Card>
  </div>
);

// Row 6 - Top Customers, Top Categories, Order Statistics
const TopCustomersCategoriesOrderStats = ({ data }) => (
  <div className="grid gap-6 lg:grid-cols-3">
    {["Top Customers", "Top Categories", "Order Statistics"].map(
      (title, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={[
                { key: "name", label: "Name" },
                { key: "sales", label: "Sales" },
              ]}
              data={data[title.replace(/ /g, "").toLowerCase()] || []}
              pageSize={5}
            />
          </CardContent>
        </Card>
      )
    )}
  </div>
);

// Main Dashboard Container
export default function AdminDashboard() {
  const [data] = useState(dummyData);

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8 animate-fade-in">
      {/* Header and Quick Alerts */}
      <div className="flex items-start justify-between flex-col md:flex-row gap-4">
        <div className="font-poppins">
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
                You have{" "}
                <span className="text-xl font-bold">
                  {data.ordersToday}+
                </span>{" "}
                Orders Today.
              </p>
            </div>
            <div className="p-3 rounded-lg shadow-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <p className="font-semibold text-yellow-700 dark:text-yellow-300">
                <i className="fa fa-exclamation-circle text-lg mr-2" />
                <span className="font-bold">{data.stockAlert.product}</span> is
                Low in Stock (&lt; {data.stockAlert.stock} Pcs).
                <Button
                  variant="link"
                  size="sm"
                  className="ml-2 p-0 h-auto text-yellow-700 dark:text-yellow-300 hover:text-yellow-800"
                  onClick={() => console.log("Add Stock")}
                >
                  <i className="fa fa-plus-circle mr-1" /> Add Stock
                </Button>
              </p>
            </div>
          </div>
        </div>

        {/* Date Filters - More button-like */}
        <div className="flex gap-2 p-1 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-inner">
          <Button variant="outline" className="text-sm">
            Today
          </Button>
          <Button variant="outline" className="text-sm">
            This Week
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-md text-sm">
            This Month
          </Button>
        </div>
      </div>

      <hr className="my-6 border-gray-200 dark:border-gray-700" />

      {/* Row 1 */}
      <TotalStatsCards data={data} />

      {/* Row 2 */}
      <ColorfulStatsCards data={data} />

      {/* Row 3 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="">
          <PurchasesSalesGraphAndRecentProducts
            data={data.purchasesSalesData}
          />
        </div>
        <div className="">
          <RecentlyAddedProducts data={data.recentlyAddedProducts} />
        </div>
        {/* Add a third div.grow for a third content block/card here if required */}
      </div>

      {/* Row 4 */}
      <ExpiredProducts data={data} />

      {/* Row 5 */}
      <TopSellingLowStockRecentSales data={data} />

      {/* Row 6 */}
      <TopCustomersCategoriesOrderStats data={data} />
    </div>
  );
}
