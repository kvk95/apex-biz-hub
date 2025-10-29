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

export const PURCHASE_STATUSES = [
  "Received",
  "Pending",
  "Partial",
  "Ordered",
  "Cancelled",
  "Returned",
] as const;

export const PAYMENT_STATUSES = [
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

//from screen - to be removed later
export const CATEGORIES = ["Computers", "Groceries", "Electronics", "Apparel", "Books", "Furniture"] as const;

//from screen - to be removed later
export const UNITS = ["Piece", "Box", "Packet", "Kg"] as const;

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

export const WAREHOUSES = ["Main Warehouse", "Secondary Warehouse", "Remote Warehouse"] as const;

export const STORES = ["Main Store", "Outlet 1", "Outlet 2", "Outlet 3"] as const;

export const PAYMENT_TYPES = ["Cash", "Cheque", "Cheque", "Bank Transfer",] as const;

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

export const SORT_OPTIONS = [
  "Last 7 Days",
  "Recently Added",
  "This Month",
  "Last Month",
  "Ascending",
  "Descending",
  "All Time",
] as const;

export const ORDER_TYPES = ["ONLINE", "POS"] as const;