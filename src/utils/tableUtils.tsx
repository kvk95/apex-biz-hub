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
 * Raw Tailwind color mapping for all known status constants.
 * Keys may contain inconsistent casing or spacing.
 * This map is normalized before export to ensure consistent lookup.
 */
const RAW_STATUS_COLORS: Record<string, string> = {
  // General Statuses
  Active: "bg-green-600 text-white dark:bg-green-800",
  Inactive: "bg-red-500 text-white dark:bg-red-800",
  Pending: "bg-yellow-500 text-white dark:bg-yellow-700",
  Suspended: "bg-orange-600 text-white dark:bg-orange-800",
  Archived: "bg-gray-500 text-white dark:bg-gray-700",
  Deleted: "bg-gray-700 text-white dark:bg-gray-900",

  // Expiry & Renewal
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
  UnPaid: "bg-red-600 text-white dark:bg-red-800", // Will be normalized to "Unpaid"
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
  // Returned and Refunded reused from above
  Shipped: "bg-cyan-500 text-white dark:bg-cyan-700",
  Delivered: "bg-green-500 text-white dark:bg-green-700",
  "Partially Fulfilled": "bg-indigo-500 text-white dark:bg-indigo-700",

  // Leave Approval
  Approved: "bg-green-600 text-white dark:bg-green-800",
  Rejected: "bg-red-500 text-white dark:bg-red-700",
  Forwarded: "bg-blue-400 text-white dark:bg-blue-600",
  Reviewed: "bg-indigo-500 text-white dark:bg-indigo-700",
  Escalated: "bg-red-600 text-white dark:bg-red-800",
  Withdrawn: "bg-gray-500 text-white dark:bg-gray-700",
  Deferred: "bg-amber-400 text-black dark:bg-amber-700",
  "Auto Approved": "bg-green-500 text-white dark:bg-green-700",

  // Quotation
  Sent: "bg-green-600 text-white dark:bg-green-800",

  // Fallback
  Default: "bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-gray-200",
};

/**
 * Capitalizes the first letter of each word in a string.
 * Ensures consistent formatting for status keys like "in progress" → "In Progress".
 */
function normalizeValue(value: string): string {
  return value
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Normalized export of status colors.
 * All keys are transformed using normalizeValue to ensure consistent lookup.
 */
export const UNIVERSAL_STATUS_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(RAW_STATUS_COLORS).map(([key, val]) => [normalizeValue(key), val])
);

/**
 * Renders a styled badge for any known status value.
 * Automatically normalizes input and falls back to Default if no match is found.
 *
 * @param value - Raw status string (e.g. "pending", "IN progress", "UnPaid")
 * @returns JSX badge element with appropriate Tailwind styling
 */
export const renderStatusBadge = (value: string): JSX.Element => {
  const normalizedValue = normalizeValue(value);

  if (!UNIVERSAL_STATUS_COLORS[normalizedValue]) {
    console.log(`Key not found in UNIVERSAL_STATUS_COLORS: @${value}@`);
  }

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
