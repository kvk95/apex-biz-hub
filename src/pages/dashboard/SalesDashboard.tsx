import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiService } from "@/services/ApiService";
import { renderStatusBadge } from "@/utils/tableUtils";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Define proper TypeScript interfaces
interface BestSellingItem {
  name: string;
  price: number;
  sales: number;
  icon: string;
}

interface RecentTransaction {
  product: string;
  time?: string;
  paymentMethod: string;
  orderId: string;
  status: string;
  amount: number;
}

interface SalesAnalytic {
  month: string;
  sales: number;
}

interface DashboardData {
  weeklyEarnings: number;
  totalSales: number;
  totalAmountSales: number;
  bestSelling: BestSellingItem[];
  recentTransactions: RecentTransaction[];
  salesAnalytics: SalesAnalytic[];
}

const SalesDashboard = () => {
  const [data, setData] = useState<DashboardData>({
    weeklyEarnings: 0,
    totalSales: 0,
    totalAmountSales: 0,
    bestSelling: [],
    recentTransactions: [],
    salesAnalytics: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await apiService.get("SalesDashboard");
      if (response.status && response.status.code === "S") {
        setData(response.result);
      } else {
        // Handle API success/fail logic based on your apiService structure
        setError(
          response.status
            ? response.status.description
            : "An unknown error occurred."
        );
      }
    } catch (e) {
      console.error("API Fetch Error:", e);
      setError(
        "Failed to fetch dashboard data. Please check network connection."
      );
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-4 bg-gray-100">
      {/* Row 1: Welcome Greeting */}
      <div className="flex items-start justify-between flex-col md:flex-row gap-4">
        <div className="font-poppins">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Hi John Smilga
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            here's what's happening with your store today.
          </p>
        </div>

        {/* Date Filters - More button-like */}
        <div className="flex gap-2 p-1 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-inner">
          ...
        </div>
      </div>

      {/* Row 2: Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-2">
          {/* Weekly Earning Card */}
          <Card className="shadow-sm bg-white border rounded-md p-4 flex items-center justify-between mb-1">
            {/* Left side content */}
            <div>
              <h6 className="text-sm font-semibold text-orange-500">
                Weekly Earning
              </h6>
              <h3 className="text-3xl font-bold text-gray-900">
                ₹
                <CountUp delay={0} end={data.weeklyEarnings.toFixed(2)} />
              </h3>
              <p className="sales-range text-sm text-gray-600">
                <span className="text-success flex items-center">
                  <i className="fa fa-arrow-up text-green-500 mr-2" />
                  +48% increase compared to last week
                </span>
              </p>
            </div>
            {/* Font Awesome Icon */}
            <div>
              <i
                className="fa fa-arrow-up-right-dots text-green-500 "
                style={{ fontSize: "6em" }}
              />
            </div>
          </Card>
        </div>
        <div className="">
          {/* Total Sales Card */}
          <Card className="shadow-sm bg-teal-500 text-white rounded-md py-2 px-4 relative mb-4">
            {/* Top Section - Icon and Refresh */}
            <div className="flex items-start justify-between mb-2">
              {/* Left Icon */}
              <div className="">
                <i className="fa fa-chart-line text-5xl" />
              </div>
              <i className="fa fa-refresh fa-light text-sm" />
            </div>
            {/* Center Content */}
            <div className="flex flex-col items-center justify-center">
              {/* Value */}
              <h3 className="text-2xl text-white font-bold mb-2">
                <CountUp delay={1} end={data.totalSales} />
              </h3>
              {/* Label */}
              <p className="text-sm">No of Total Sales</p>
            </div>
          </Card>
        </div>
        <div className="">
          {/* Total Amount of Sales Card */}
          <Card className="shadow-sm bg-indigo-900 text-white rounded-md py-2 px-4 relative mb-4">
            {/* Top Section - Icon and Refresh */}
            <div className="flex items-start justify-between mb-2">
              {/* Left Icon */}
              <div className="">
                <i className="fa fa-money-bill-wave text-5xl" />
              </div>
              <i className="fa fa-refresh fa-light text-sm" />
            </div>
            {/* Center Content */}
            <div className="flex flex-col items-center justify-center">
              {/* Value */}
              <h3 className="text-2xl text-white font-bold mb-2">
                ₹<CountUp delay={1} end={data.totalAmountSales} />
              </h3>
              {/* Label */}
              <p className="text-sm">Total Amount of Sales</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Row 3: Best Seller and Recent Transactions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="shadow-sm mb-1">
          <CardHeader className="grid grid-cols-3 gap-1 border-b-2 p-1 mt-2 mb-2">
            <CardTitle className="col-span-2">Best Seller</CardTitle>
            <button className=" btn text-gray-400 btn-outline-light btn-sm">
              View All
            </button>
          </CardHeader>
          <CardContent className="pb-0">
            <div className="table-responsive">
              <table className="table table-borderless">
                <tbody>
                  {data.bestSelling.map((item, index) => (
                    <tr key={index}>
                      <td className="pt-0 ps-0">
                        <div className="d-flex align-items-center">
                          {/* Avatar/Icon */}
                          <a
                            href="product-list.html"
                            className="avatar avatar-lg me-2 "
                          >
                            <i className={`fa ${item.icon} text-2xl me-3 `} />
                          </a>
                          <div>
                            <h6>
                              <a href="product-list.html" className="fw-bold">
                                {item.name}
                              </a>
                            </h6>
                            <p>₹{item.price}</p>
                          </div>
                        </div>
                      </td>
                      <td className="pt-0">
                        <p className="text-gray-9 mb-1">Sales</p>
                        <p className="text-gray-9 fw-medium">{item.sales}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="grid grid-cols-3 gap-1 border-b-2 p-1 mt-2 mb-2">
            <CardTitle className="col-span-2">Recent Transactions</CardTitle>
            <button className=" btn text-gray-400 btn-outline-light btn-sm">
              View All
            </button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="table-responsive">
              <table className="table table-borderless recent-transactions">
                <thead className="thead-light">
                  <tr>
                    <th>#</th>
                    <th>Order Details</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentTransactions.map((transaction, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <a
                            href="/product-list"
                            className="avatar avatar-lg me-2"
                          >
                            {/* Placeholder for product image */}
                            <img
                              className="h-5 w-5 bordered bg-background"
                              src={`assets/img/products/stock-img-${
                                index + 1
                              }.png`}
                              alt="product"
                            />
                          </a>
                          <div>
                            <h6>
                              <a href="/product-list" className="fw-bold">
                                {transaction.product}
                              </a>
                            </h6>
                            <span className="d-flex align-items-center">
                              <i className="fa fa-clock fa-light text-sm me-2" />
                              {transaction.time || "15 Mins"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="d-block head-text">
                          {transaction.paymentMethod}
                        </span>
                        <span className="text-blue">{transaction.orderId}</span>
                      </td>
                      <td>{renderStatusBadge(transaction.status)}</td>
                      <td className="fs-16 fw-bold text-gray-9">
                        ₹{transaction.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Sales Analytics Graph */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Sales Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data.salesAnalytics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="sales"
                fill="hsl(var(--primary))"
                barSize={30}
                radius={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesDashboard;
