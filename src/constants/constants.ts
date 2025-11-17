export const PATH_HOMESCREEN: string = "/dashboard/admindb";
export const DEFAULT_PAGE_SIZE: number = 10;
export const CURRENCY_SYMBOL = "₹";

export const STATUSES = [
  "Active",
  "Inactive",
  "Pending",
  "Suspended",
  "Archived",
  "Deleted",
] as const;

export const EXPIRED_STATUSES = [
  "Active",
  "Expired",
  "Renewed",
  "Cancelled",
  "Grace Period",
] as const;

export const BRAND_STATUSES = ["Active", "Inactive"] as const;

export const STORE_TYPES = [
  "Retail",
  "Wholesale",
  "Department Store",
  "Specialty Store",
  "Convenience Store",
  "Supermarket",
  "Warehouse Store",
  "Boutique",
  "Discount Store",
  "Online Store",
  "Franchise",
  "Chain Store",
  "Pop-up Store",
] as const;

export const COUPEN_TYPES = [
  "Percentage",
  "Flat",
  "Buy One Get One",
  "Cashback",
  "Free Shipping",
  "Seasonal Offer",
  "Loyalty Reward",
] as const;

export const DISCOUNT_TYPES = [
  "Percentage",
  "Fixed",
  "Tiered",
  "Bulk Purchase",
  "Seasonal",
  "Member Exclusive",
] as const;

export const PURCHASE_STATUSES = [
  "Received",
  "Pending",
  "Partial",
  "Ordered",
  "Cancelled",
  "Returned",
] as const;

export const PAYMENT_STATUSES = [
  /**
   * @deprecated For Search Drop down.
   * Need to inject using API.
   */
  "All", // For Search Drop down
  "Paid",
  "UnPaid",
  "Due",
  "Partial",
  "Refunded",
  "Overdue",
  "In Progress",
  "Failed",
] as const;

export const STOCK_STATUSES = [
  "In Stock",
  "Low Stock",
  "Out of Stock",
  "Discontinued",
  "Pre-Order",
] as const;

export const ORDER_STATUSES = [
  "Completed",
  "Pending",
  "Cancelled",
  "Processing",
  "On Hold",
  "Returned",
  "Refunded",
  "Shipped",
  "Delivered",
  "Partially Fulfilled",
] as const;

export const LEAVE_STATUSES = [
  "Present",
  "Absent",
  "Leave",
  "Late",
  "Half Day",
  "On Duty",
  "Work From Home",
  "Holiday",
] as const;

export const LEAVE_TYPES = [
  "Casual Leave",
  "Sick Leave",
  "Maternity Leave",
  "Paternity Leave",
  "Bereavement Leave",
  "Unpaid Leave",
] as const;

export const APPROVAL_STATUSES = [
  "Pending",
  "Approved",
  "Rejected",
  "Cancelled",
  "Forwarded",
  "Reviewed",
  "Escalated",
  "Withdrawn",
  "Deferred",
  "Auto Approved",
] as const;

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const ACCOUNT_TYPES = ["Savings", "Current"] as const;

export const TAX_TYPES = ["VAT", "GST", "Sales Tax"] as const;

export const TAX_OPTIONS = ["Exclusive", "Inclusive"] as const;

export const WAREHOUSES = [
  "Main Warehouse",
  "Secondary Warehouse",
  "Remote Warehouse",
] as const;

export const STORES = [
  "Main Store",
  "Outlet 1",
  "Outlet 2",
  "Outlet 3",
] as const;

export const PAYMENT_TYPES = [
  "Cash",
  "Card",
  "Cheque",
  "Bank Transfer",
  "UPI",
] as const;

export const EXPENSE_HEADS = [
  "Office Rent",
  "Electricity Bill",
  "Internet",
  "Stationery",
  "Travel",
  "Maintenance",
  "Software Subscription",
  "Cleaning",
  "Miscellaneous",
  "Snacks",
  "Printing",
  "Courier",
] as const;

export const INCOME_CATEGORIES = ["Sales", "Service"] as const;

export const ACCOUNTS = ["Cash", "Bank"] as const;

export const CURRENCIES = ["USD", "INR", "EUR"] as const;

export const COUNTRIES = ["India"] as const;

export type Country = (typeof COUNTRIES)[number]; // "India"

export const STATES = {
  AP: "Andhra Pradesh",
  AR: "Arunachal Pradesh",
  AS: "Assam",
  BR: "Bihar",
  CT: "Chhattisgarh",
  GA: "Goa",
  GJ: "Gujarat",
  HR: "Haryana",
  HP: "Himachal Pradesh",
  JK: "Jammu and Kashmir",
  JH: "Jharkhand",
  KA: "Karnataka",
  KL: "Kerala",
  MP: "Madhya Pradesh",
  MH: "Maharashtra",
  MN: "Manipur",
  ML: "Meghalaya",
  MZ: "Mizoram",
  NL: "Nagaland",
  OR: "Odisha",
  PB: "Punjab",
  RJ: "Rajasthan",
  SK: "Sikkim",
  TN: "Tamil Nadu",
  TG: "Telangana",
  TR: "Tripura",
  UT: "Uttarakhand",
  UP: "Uttar Pradesh",
  WB: "West Bengal",
  AN: "Andaman and Nicobar Islands",
  CH: "Chandigarh",
  DN: "Dadra and Nagar Haveli",
  DD: "Daman and Diu",
  DL: "Delhi",
  LD: "Lakshadweep",
  PY: "Puducherry",
} as const;

export type StateCode = keyof typeof STATES;
export type StateName = (typeof STATES)[StateCode];

export const STATE_LIST = Object.entries(STATES).map(([code, name]) => ({
  code,
  name,
}));

export const SORT_OPTIONS = [
  "Last 7 Days",
  "Recently Added",
  "This Month",
  "Last Month",
  "Ascending",
  "Descending",
  "All Time",
] as const;

export const SORT_LAT_ASC_DSC = ["Latest", "Ascending", "Descending"] as const;

export const ORDER_TYPES = ["ONLINE", "POS"] as const;

export const RETURN_STATUSES = ["Pending", "Paid"] as const;

/**
 * @deprecated Use the API call to get data from tables.
 * This component will be removed in a future release.
 */
export const ROLES = [
  "Admin",
  "Manager",
  "Staff",
  "User",
  "Cashier",
  "Supervisor",
  "Accountant",
  "StoreOwner",
  "HR",
  "Support",
  "Guest",
] as const;

/**
 * @deprecated Use the API call to get data from tables.
 * This component will be removed in a future release.
 */
export const DEPARTMENTS = [
  "Sales",
  "Marketing",
  "IT",
  "HR",
  "Finance",
  "Customer Support",
  "Procurement",
  "Operations",
  "Logistics",
  "Maintenance",
] as const;

/**
 * @deprecated Use the API call to get data from tables.
 * This component will be removed in a future release.
 */
export const CATEGORIES = [
  "Computers",
  "Groceries",
  "Electronics",
  "Apparel",
  "Books",
  "Furniture",
] as const;

/**
 * @deprecated Use the API call to get data from tables.
 * This component will be removed in a future release.
 */
export const UNITS = ["Piece", "Box", "Packet", "Kg"] as const;

/**
 * @deprecated Use the API call to get data from tables.
 * This component will be removed in a future release.
 */
export const SUPPLIERS = [
  "All Suppliers",
  "Apple Inc.",
  "Samsung",
  "Sony",
  "Dell",
  "Logitech",
  "Canon",
  "HP",
  "Bose",
  "Microsoft",
  "Google",
  "JBL",
] as const;

/**
 * @deprecated Use the API call to get data from tables.
 * This component will be removed in a future release.
 */
export const BRANDS = [
  "All Brands",
  "Apple",
  "Samsung",
  "Sony",
  "Dell",
  "Logitech",
  "Canon",
  "Bose",
  "Microsoft",
  "Google",
  "JBL",
  "HP",
  "Fitbit",
] as const;

/**
 * @deprecated Use the API call to get data from tables.
 * This component will be removed in a future release.
 */
export const CUSTOMERS = [
  "All",
  "John Doe",
  "Jane Smith",
  "Acme Corp",
  "NyaInfo Technologies",
  "Customer A",
  "Customer B",
] as const;

export const INVOICE_STATUSES = ["All", "Paid", "Unpaid", "Partial"] as const;

export const ONLINE_PAYMENT_STATUSES = ["Paid", "Unpaid", "Overdue"] as const;

export const QUOTATION_STATUSES = ["Ordered", "Pending", "Sent"] as const;

export const EXPENSE_HEADS_STATUSES = ["Pending", "Approved"] as const;

export const DURATION_TYPES = ["Year", "Month"] as const;

export const USER_ROLE_STATUSES = ["Active", "Inactive"] as const;

export const LANGUAGES = ["English", "Tamil"] as const;
