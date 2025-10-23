import { STATUSES, LEAVE_STATUSES } from "@/constants/constants";

// Define the colors and styles for each possible status
const STATUS_STYLES: Record<(typeof STATUSES)[number], string> = {
  Active: "bg-green-600 text-white dark:bg-green-900 dark:text-green-200",
  Inactive: "bg-red-500 text-white dark:bg-red-900 dark:text-red-200",
  // Pending: "bg-yellow-100 text-white dark:bg-yellow-900 dark:text-yellow-200",
};

export const renderStatusBadge = (
  value: (typeof STATUSES)[number]
): JSX.Element => {
  const classString =
    STATUS_STYLES[value] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";

  return (
    <span
      className={`inline-block px-2 rounded font-semibold whitespace-nowrap ${classString}`}
      style={{ fontSize: "11px" }}
    >
      &bull; {value}
    </span>
  );
};

const LEAVE_STYLES: Record<(typeof LEAVE_STATUSES)[number], string> = {
  Present: "bg-green-600 text-white dark:bg-green-900 dark:text-green-200",
  Absent: "bg-red-500 text-white dark:bg-red-900 dark:text-red-200",
  Leave: "bg-pink-500 text-white dark:bg-pink-900 dark:text-pink-200",
  Late: "bg-yellow-500 text-white dark:bg-yellow-900 dark:text-yellow-200",
};

export const renderLeaveStatusBadge = (
  value: (typeof LEAVE_STATUSES)[number]
): JSX.Element => {
  const classString =
    LEAVE_STYLES[value] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";

  return (
    <span
      className={`inline-block px-2 rounded font-semibold whitespace-nowrap ${classString}`}
      style={{ fontSize: "11px" }}
    >
      &bull; {value}
    </span>
  );
};
