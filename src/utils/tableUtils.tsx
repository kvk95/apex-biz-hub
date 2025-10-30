import {
  STATUSES,
  LEAVE_STATUSES,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  PURCHASE_STATUSES,
  STOCK_STATUSES,
  APPROVAL_STATUSES,
} from "@/constants/constants";

/**
 * Universal Tailwind color mapping for all known status constants.
 * Includes dark theme variants for brand consistency.
 */
export const UNIVERSAL_STATUS_COLORS: Record<string, string> = {
  // General Statuses
  Active: "bg-green-600 text-white dark:bg-green-800",
  Inactive: "bg-red-500 text-white dark:bg-red-800",
  Pending: "bg-yellow-500 text-white dark:bg-yellow-700",
  Suspended: "bg-orange-600 text-white dark:bg-orange-800",
  Archived: "bg-gray-500 text-white dark:bg-gray-700",
  Deleted: "bg-gray-700 text-white dark:bg-gray-900",

  // Expired
  Expired: "bg-red-600 text-white dark:bg-red-900",
  Renewed: "bg-green-500 text-white dark:bg-green-700",
  Cancelled: "bg-rose-600 text-white dark:bg-rose-800",
  "Grace Period": "bg-amber-500 text-white dark:bg-amber-700",

  // Leave / Attendance
  Present: "bg-green-500 text-white dark:bg-green-700",
  Absent: "bg-red-500 text-white dark:bg-red-700",
  Leave: "bg-yellow-500 text-white dark:bg-yellow-700",
  Late: "bg-orange-500 text-white dark:bg-orange-700",
  "Half Day": "bg-amber-400 text-black dark:bg-amber-700",
  "On Duty": "bg-cyan-500 text-white dark:bg-cyan-700",
  "Work From Home": "bg-teal-500 text-white dark:bg-teal-700",
  Holiday: "bg-blue-400 text-white dark:bg-blue-600",

  // Purchase
  Received: "bg-green-600 text-white dark:bg-green-800",
  Ordered: "bg-cyan-600 text-white dark:bg-cyan-800",
  Partial: "bg-indigo-600 text-white dark:bg-indigo-800",
  Returned: "bg-rose-500 text-white dark:bg-rose-700",

  // Payment
  Paid: "bg-green-700 text-white dark:bg-green-900",
  UnPaid: "bg-red-600 text-white dark:bg-red-800",
  Due: "bg-amber-600 text-white dark:bg-amber-800",
  Refunded: "bg-violet-500 text-white dark:bg-violet-700",
  Overdue: "bg-orange-700 text-white dark:bg-orange-900",
  "In Progress": "bg-blue-600 text-white dark:bg-blue-800",
  Failed: "bg-red-700 text-white dark:bg-red-900",

  // Stock
  "In Stock": "bg-green-600 text-white dark:bg-green-800",
  "Low Stock": "bg-yellow-400 text-black dark:bg-yellow-700",
  "Out of Stock": "bg-red-500 text-white dark:bg-red-700",
  Discontinued: "bg-gray-600 text-white dark:bg-gray-800",
  "Pre-Order": "bg-indigo-600 text-white dark:bg-indigo-800",

  // Orders
  Completed: "bg-green-600 text-white dark:bg-green-800",
  Processing: "bg-blue-500 text-white dark:bg-blue-800",
  "On Hold": "bg-yellow-600 text-white dark:bg-yellow-800",
  //Returned: "bg-rose-500 text-white dark:bg-rose-700", // from-above
  //Refunded: "bg-violet-600 text-white dark:bg-violet-800", // from-above
  Shipped: "bg-cyan-500 text-white dark:bg-cyan-700",
  Delivered: "bg-green-500 text-white dark:bg-green-700",
  "Partially Fulfilled": "bg-indigo-500 text-white dark:bg-indigo-700",

  // Leave Approval Statuses
  //Pending: "bg-yellow-500 text-white dark:bg-yellow-700",  // from-above
  Approved: "bg-green-600 text-white dark:bg-green-800",
  Rejected: "bg-red-500 text-white dark:bg-red-700",
  //Cancelled: "bg-rose-600 text-white dark:bg-rose-800",  // from-above
  Forwarded: "bg-blue-400 text-white dark:bg-blue-600",
  Reviewed: "bg-indigo-500 text-white dark:bg-indigo-700",
  Escalated: "bg-red-600 text-white dark:bg-red-800",
  Withdrawn: "bg-gray-500 text-white dark:bg-gray-700",
  Deferred: "bg-amber-400 text-black dark:bg-amber-700",
  "Auto Approved": "bg-green-500 text-white dark:bg-green-700",

  //Quotation:
  Sent: "bg-green-600 text-white dark:bg-green-800",

  // Default
  Default: "bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-gray-200",
};

/**
 * Generalized badge renderer for all status groups.
 * Accepts any value from STATUSES, ORDER_STATUSES, PAYMENT_STATUSES, etc.
 */
export const renderStatusBadge = (value: string): JSX.Element => {

  /**
   * Normalizes a string to have only the first letter capitalized.
   * Useful for standardizing status labels like "Pending", "Approved", etc.
   *
   * Examples:
   *   "PENDING" → "Pending"
   *   "peNdiNg" → "Pending"
   *   "approved" → "Approved"
   */
  function normalizeValue(value: string): string {
    // Convert the entire string to lowercase
    const lower = value.toLowerCase();

    // Capitalize the first character and append the rest of the string
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }

  const normalizedValue = normalizeValue(value);

  const classString =
    UNIVERSAL_STATUS_COLORS[normalizedValue] || UNIVERSAL_STATUS_COLORS.Default;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded font-semibold whitespace-nowrap ${classString}`}
      style={{ fontSize: "11px" }}
    >
      • {value}
    </span>
  );
};
