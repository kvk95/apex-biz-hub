import { format, parse, parseISO, isValid } from "date-fns";
import {
  enUS,
  hi, // Hindi
  ta, // Tamil (India & Sri Lanka)
  te, // Telugu
  kn, // Kannada
  ml, // Malayalam
  bn, // Bengali
  pa, // Punjabi
  gu, // Gujarati
  // add more as needed
} from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";

// ──────────────────────────────────────────────────────────────
// Locale mapping
// ──────────────────────────────────────────────────────────────
const localeMap: Record<string, Locale> = {
  English: enUS,
  Tamil: ta, //ta-IN (Tamil in India) or ta-LK (Tamil in Sri Lanka)
  // Hindi: hi,
  // Spanish: es,
  // French: fr,
  // Add more languages here
};

// ──────────────────────────────────────────────────────────────
// Global cache for non-React usage (services, utils, etc.)
// ──────────────────────────────────────────────────────────────
let globalSettings: any = {
  language: "enUS",
  showLanguageSwitcher: true,
  timezone: "UTC+05:30",
  dateFormat: "dd MMM yyyy",
  timeFormat: "hh:mm a",
  financialYear: "2025",
  startingMonth: "January",
  currency: "India",
  currencySymbol: "₹",
  currencyPosition: "₹100",
  decimalSeparator: ".",
  thousandSeparator: ",",
  countryRestriction: "Allow All Countries",
  allowedFileTypes: ["JPG", "PNG", "GIF"],
  maxFileSize: 5,
};
export const setGlobalLocalizationSettings = (settings: any) => {
  globalSettings = settings;
};

// ──────────────────────────────────────────────────────────────
// Main Hook – use in components
// ──────────────────────────────────────────────────────────────
export const useLocalization = () => {
  const { appsSettings } = useAuth();
  const settings = appsSettings || globalSettings;

  const locale = localeMap[settings?.language || "English"] || enUS;

  // Default formats from admin settings (real date-fns tokens)
  const defaultDateFormat = settings?.dateFormat || "dd MMM yyyy"; // e.g. "01 Jan 2025"
  const defaultTimeFormat =
    settings?.timeFormat === "12 Hours" ? "hh:mm a" : "HH:mm";
  const defaultDateTimeFormat = `${defaultDateFormat}, ${defaultTimeFormat}`;

  // ──────────────────────────────────────────────────────────
  // Smart input parser (your existing logic – 100% preserved)
  // ──────────────────────────────────────────────────────────
  const getDateObj = (value: string): Date | null => {
    let date = new Date(value);
    if (isValid(date)) return date;

    const formats = [
      "yyyy-MM-dd",
      "dd/MM/yyyy",
      "dd-MM-yyyy",
      "dd MMM yyyy",
      "yyyy-MM-dd'T'HH:mm:ss'Z'",
      "yyyy-MM-dd HH:mm:ss",
      "HH:mm:ss",
      "HH:mm",
    ];

    for (const fmt of formats) {
      date = parse(value, fmt, new Date());
      if (isValid(date)) return date;
    }
    return null;
  };

  // ──────────────────────────────────────────────────────────
  // Token converter: DD → dd, YYYY → yyyy, MM → MM, etc.
  // ──────────────────────────────────────────────────────────
  const convertTokens = (pattern: string): string => {
    return pattern
      .replace(/DD/g, "dd")
      .replace(/YYYY/g, "yyyy")
      .replace(/MMM/g, "MMM")
      .replace(/MM/g, "MM")
      .replace(/HH/g, "HH")
      .replace(/mm/g, "mm")
      .replace(/ss/g, "ss")
      .replace(/A/g, "a") // for AM/PM
      .replace(/a/g, "a");
  };

  // ──────────────────────────────────────────────────────────
  // Core formatters – with override support
  // ──────────────────────────────────────────────────────────
  const formatDate = (value: string, outputFormat?: string): string => {
    const date = getDateObj(value);
    if (!date) return value || "";
    const fmt = outputFormat ? convertTokens(outputFormat) : defaultDateFormat;
    console.log(value + " " + fmt);
    return format(date, fmt, { locale });
  };

  const formatDateTime = (value: string, outputFormat?: string): string => {
    const date = getDateObj(value);
    if (!date) return value || "";
    const fmt = outputFormat
      ? convertTokens(outputFormat)
      : defaultDateTimeFormat;
    return format(date, fmt, { locale });
  };

  const formatTime = (value: string, outputFormat?: string): string => {
    const date = getDateObj(value);
    if (!date) return value || "";
    const fmt = outputFormat ? convertTokens(outputFormat) : defaultTimeFormat;
    return format(date, fmt, { locale });
  };

  // ──────────────────────────────────────────────────────────
  // Currency formatter using admin settings
  // ──────────────────────────────────────────────────────────
  const formatCurrency = (amount: number | string): string => {
    if (amount === null || amount === undefined || amount === "") return "";

    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(num)) return String(amount);

    const symbol = settings?.currencySymbol || "₹";
    const position = settings?.currencyPosition || "₹100";
    const decimal = settings?.decimalSeparator || ".";
    const thousand = settings?.thousandSeparator || ",";

    // Format number with Indian grouping (or fallback)
    const formatted = num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
    const [integer, fraction = ""] = formatted.split(".");
    const finalNumber = `${integer}${decimal}${fraction}`;

    return position.includes(symbol)
      ? position.replace("100", finalNumber)
      : finalNumber + symbol;
  };

  return {
    formatDate,
    formatDateTime,
    formatTime,
    formatCurrency,
    settings,
    locale,
    // For debugging or advanced use
    defaultDateFormat,
    defaultTimeFormat,
    defaultDateTimeFormat,
  };
};

// ──────────────────────────────────────────────────────────────
// Direct exports (for non-React files like services, API helpers)
// ──────────────────────────────────────────────────────────────
const getSettings = () => globalSettings;

export const formatDateGlobal = (
  value: string,
  outputFormat?: string
): string => {
  const { formatDate } = useLocalization();
  return formatDate(value, outputFormat);
};

export const formatDateTimeGlobal = (
  value: string,
  outputFormat?: string
): string => {
  const { formatDateTime } = useLocalization();
  return formatDateTime(value, outputFormat);
};

export const formatTimeGlobal = (
  value: string,
  outputFormat?: string
): string => {
  const { formatTime } = useLocalization();
  return formatTime(value, outputFormat);
};

export const formatCurrencyGlobal = (amount: number | string): string => {
  const { formatCurrency } = useLocalization();
  return formatCurrency(amount);
};

export const generateUniqueId = (
  prefix: string = "XXXX",
  length: number = 10
): string => {
  // Generate a cryptographically secure UUID
  const uuid = crypto.randomUUID();

  // Remove non-alphanumeric characters
  const alphanumeric = uuid.replace(/[^a-zA-Z0-9]/g, "");

  // Ensure we have enough characters by repeating if needed
  const requiredLength = length - prefix.length;
  const padded = (alphanumeric + alphanumeric).slice(0, requiredLength);

  return `${prefix}${padded}`;
};
