import React from "react";
import { Pagination } from "@/components/Pagination/Pagination";
import { useTheme } from "@/components/theme/theme-provider";
import { SearchInput } from "@/components/Search/SearchInput";

export interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any, idx?: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

interface ThemeStyles {
  selectionBg: string;
  hoverColor: string;
}

interface PageBase1Props {
  title: string;
  description: string;
  icon: string;
  onAddClick?: () => void;
  onRefresh: () => void;
  onReport?: () => void;
  onExcelReport?: () => void;
  search: string;
  onSearchChange: (query: string) => void;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  tableColumns: Column[];
  tableData: any[];
  tableFooter?: () => JSX.Element;
  rowActions?: (row: any) => JSX.Element;
  formMode: "add" | "edit" | string | null;
  setFormMode: React.Dispatch<
    React.SetStateAction<"add" | "edit" | string | null>
  >;
  modalTitle: string;
  modalForm: () => JSX.Element;
  onFormSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  customFilters?: () => JSX.Element;
  customHeaderFields?: () => JSX.Element;
  customHeaderRow?: () => JSX.Element;
  children?: React.ReactNode;
}

function adjustColor(hex: string, percent: number): string {
  try {
    const cleanHex = hex.replace("#", "");
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    const factor = 1 + percent / 100;
    const newR = Math.max(0, Math.min(255, Math.round(r * factor)));
    const newG = Math.max(0, Math.min(255, Math.round(g * factor)));
    const newB = Math.max(0, Math.min(255, Math.round(b * factor)));
    return `#${newR.toString(16).padStart(2, "0")}${newG
      .toString(16)
      .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
  } catch (e) {
    console.error("Invalid hex color:", hex, e);
    return hex;
  }
}

function hexToHsl(hex: string): string {
  try {
    const cleanHex = hex.replace("#", "");
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(
      l * 100
    )}%)`;
  } catch (e) {
    console.error("Invalid hex color for HSL conversion:", hex, e);
    return hex; // Fallback to hex
  }
}

const pluralToSingular = (word: string): string => {
  const lowerWord = word.toLowerCase();

  // Handle irregular/common cases first
  const irregulars: { [key: string]: string } = {
    children: "child",
    expenses: "expense",
    categories: "category",
    classes: "class",
    boxes: "box",
    knives: "knife",
    wolves: "wolf",
    // Add more as needed
  };
  if (irregulars[lowerWord]) {
    return irregulars[lowerWord];
  }

  // Handle words ending with 'ies' (e.g., categories → category)
  if (lowerWord.endsWith("ies")) {
    return lowerWord.slice(0, -3) + "y";
  }

  // Handle words ending with 'es'
  if (lowerWord.endsWith("es")) {
    // Special cases
    if (lowerWord.endsWith("sses")) return lowerWord.slice(0, -2); // classes → class (now handled in irregulars)
    if (lowerWord.endsWith("shes")) return lowerWord.slice(0, -2); // dishes → dish
    if (lowerWord.endsWith("ches")) return lowerWord.slice(0, -2); // watches → watch
    if (lowerWord.endsWith("xes")) return lowerWord.slice(0, -2); // boxes → box (irregular)
    if (lowerWord.endsWith("zes")) return lowerWord.slice(0, -2); // quizzes → quiz
    return lowerWord.slice(0, -2); // General: tomatoes → tomato
  }

  // Handle words ending with 's' (simple plural)
  if (lowerWord.endsWith("s")) {
    return lowerWord.slice(0, -1);
  }

  // Handle words ending with 'ves' (e.g., wolves → wolf)
  if (lowerWord.endsWith("ves")) {
    return lowerWord.slice(0, -3) + "f";
  }

  // Handle words ending with 'f' or 'fe' (e.g., leaf → leaf, but typically unchanged or to 'ves' reverse)
  if (lowerWord.endsWith("f") || lowerWord.endsWith("fe")) {
    // Often unchanged or special; fallback to slice for 'fe' → 'f' but keep simple
    return lowerWord.endsWith("fe") ? lowerWord.slice(0, -2) + "f" : lowerWord;
  }

  return word; // No change
};

export function PageBase1({
  title,
  description,
  icon,
  onAddClick,
  onRefresh,
  onReport,
  onExcelReport,
  search,
  onSearchChange,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  onPageSizeChange,
  tableColumns,
  tableData,
  tableFooter,
  rowActions,
  formMode,
  setFormMode,
  modalTitle,
  modalForm,
  onFormSubmit,
  loading,
  customFilters,
  customHeaderFields,
  customHeaderRow,
  children,
}: PageBase1Props) {
  const { theme } = useTheme();
  const primaryColor = theme.primaryColor || "#f97316";
  const hoverColor = adjustColor(primaryColor, -20);
  const selectionBg = `hsl(${primaryColor})`;
  const themeStyles: ThemeStyles = { selectionBg, hoverColor };

  return (
    <>
      {/* Full-screen loader (on top of everything) */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-[1000]">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div className="min-h-screen bg-background">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex-1 flex items-center gap-3">
            <i
              className={`${icon} fa-light text-4xl`}
              style={{ color: selectionBg }}
              aria-hidden="true"
            ></i>
            <div>
              <h1 className="text-lg font-semibold">{title}</h1>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className="flex-none ml-auto flex gap-2">
            {onReport && (
              <button
                onClick={onReport}
                className="bg-white hover:bg-gray-300 text-danger py-1 px-3 rounded border transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                type="button"
                aria-label="Generate Report"
                role="button"
              >
                <i className="fa fa-file-pdf" aria-hidden="true"></i>
              </button>
            )}
            {onExcelReport && (
              <button
                onClick={onExcelReport}
                className="bg-white hover:bg-gray-300 text-green-700 py-1 px-3 rounded border transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                type="button"
                aria-label="Export as Excel"
                role="button"
              >
                <i className="fa fa-file-excel" aria-hidden="true"></i>
              </button>
            )}
            <button
              onClick={onRefresh}
              className="bg-white hover:bg-gray-300 text-gray-500 py-2 px-3 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              type="button"
              aria-label="Refresh"
              role="button"
            >
              <i className="fa fa-refresh text-muted" aria-hidden="true"></i>
            </button>
            {onAddClick && (
              <button
                onClick={onAddClick}
                className="text-white font-semibold py-2 px-3 rounded shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={
                  {
                    backgroundColor: selectionBg,
                    "--hover-bg": hoverColor,
                  } as React.CSSProperties
                }
                type="button"
                aria-label="Add"
              >
                <i
                  className="fa fa-plus-circle me-2 text-xs"
                  aria-hidden="true"
                ></i>
                Add {pluralToSingular(title)}
              </button>
            )}
          </div>
          {customHeaderFields ? (
            <div className="flex-none flex gap-2">{customHeaderFields()}</div>
          ) : null}
        </div>
        {customHeaderRow ? (
          <div className="w-full">{customHeaderRow()}</div>
        ) : null}
        {tableColumns && (
          <section className="bg-card rounded shadow pt-2 pb-6">
            {customFilters ? (
              <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-2 p-2">
                {customFilters()}
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 px-4">
                <SearchInput
                  className=""
                  value={search}
                  placeholder="Search"
                  onSearch={onSearchChange}
                />
              </div>
            )}
            <div className="overflow-x-auto max-w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr className="border-b border-border">
                    {tableColumns.map((col) => (
                      <th
                        key={col.key}
                        className={`px-4 py-3 text-sm font-medium text-muted-foreground ${
                          col.align ? `text-${col.align}` : "text-left"
                        } ${col.className || ""}`}
                      >
                        {col.label}
                      </th>
                    ))}
                    {rowActions && (
                      <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground gap-1">
                        {/* Actions  */}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tableData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={tableColumns.length + (rowActions ? 1 : 0)}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No items found.
                      </td>
                    </tr>
                  ) : (
                    tableData.map((row, idx) => (
                      <tr
                        key={row.id || idx} // Fallback to index if no id
                        className="border-b border-border hover:bg-muted/50 transition-colors text-sm text-gray-500"
                      >
                        {tableColumns.map((col) => (
                          <td
                            key={col.key}
                            className={`px-4 py-2 text-sm ${
                              col.align ? `text-${col.align}` : "text-left"
                            } ${col.className || ""}`}
                            style={{ fontSize: "14px" }}
                          >
                            {col.render
                              ? col.render(row[col.key], row, idx)
                              : row[col.key]}
                          </td>
                        ))}
                        {rowActions && (
                          <td className="px-3 py-2 whitespace-nowrap text-right space-x-2">
                            {rowActions(row)}
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
                {tableFooter?.()}
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </section>
        )}
        {children}

        {formMode && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div
              className={`bg-white rounded shadow-lg w-full max-w-4xl max-h-full transition-all duration-300 
                  ${
                    formMode === "add"
                      ? "border-l-4 border-green-500"
                      : "border-l-4 border-gray-300"
                  }`}
            >
              <div className="flex justify-between items-center border-b border-border px-4 py-2">
                <h2
                  id="modal-title"
                  className="text-xl font-semibold text-left"
                >
                  {formMode === "add" ? (
                    <i
                      className="fa fa-plus-circle text-sm me-2 text-green-500"
                      aria-hidden="true"
                    ></i>
                  ) : (
                    <i
                      className="fa fa-edit text-sm me-2 text-primary"
                      aria-hidden="true"
                    ></i>
                  )}
                  {modalTitle}
                </h2>
                <button
                  onClick={() => setFormMode(null)}
                  className="text-red-500 hover:text-red-800 focus:ring-2 focus:ring-red-500 rounded-full text-xl focus:outline-none"
                  aria-label="Close modal"
                  type="button"
                >
                  <i className="fa fa-window-close" aria-hidden="true"></i>
                </button>
              </div>
              <form onSubmit={onFormSubmit} className="px-4 py-4">
                {modalForm()}
              </form>
              <div className="border-t border-border px-4 pt-2 pb-3 flex justify-end gap-4">
                <button
                  onClick={() => setFormMode(null)}
                  className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-white font-semibold px-3 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                  type="button"
                >
                  <i className="fa fa-times me-2"></i> Cancel
                </button>
                <button
                  type="submit" // Changed to submit; removes onClick
                  className="inline-flex items-center gap-2 text-white font-semibold px-3 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                  style={
                    {
                      backgroundColor: themeStyles.selectionBg,
                      "--hover-bg": themeStyles.hoverColor,
                    } as React.CSSProperties
                  }
                >
                  <i className="fa fa-save me-2"></i>{" "}
                  {formMode === "add" ? "Save" : "Update"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
