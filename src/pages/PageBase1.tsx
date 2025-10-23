import React from "react";
import { Pagination } from "@/components/Pagination/Pagination";
import { useTheme } from "@/components/theme/theme-provider";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any, idx?: number) => JSX.Element;
}

interface ThemeStyles {
  selectionBg: string;
  hoverColor: string;
}

interface PageBase1Props {
  title: string;
  description: string;
  icon: string;
  onAddClick: () => void;
  onRefresh: () => void;
  onReport: () => void;
  search: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  tableColumns: Column[];
  tableData: any[];
  rowActions: (row: any) => JSX.Element;
  formMode: "add" | "edit" | null;
  setFormMode: React.Dispatch<React.SetStateAction<"add" | "edit" | null>>;
  modalTitle: string;
  modalForm: (themeStyles: ThemeStyles) => JSX.Element;
  onFormSubmit: (e: React.FormEvent) => void;
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
    return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
  } catch (e) {
    console.error("Invalid hex color:", hex, e);
    return hex;
  }
}

export function PageBase1({
  title,
  description,
  icon,
  onAddClick,
  onRefresh,
  onReport,
  search,
  onSearchChange,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  onPageSizeChange,
  tableColumns,
  tableData,
  rowActions,
  formMode,
  setFormMode,
  modalTitle,
  modalForm,
  onFormSubmit,
}: PageBase1Props) {
  const { theme } = useTheme();
  const primaryColor = theme.primaryColor || "#f97316";
  const hoverColor = adjustColor(primaryColor, -20);
  const selectionBg = `hsl(${primaryColor})`;
  const themeStyles: ThemeStyles = { selectionBg, hoverColor };

  console.log("PageBase1 theme:", { primaryColor, hoverColor, selectionBg });

  return (
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
          <button
            onClick={onReport}
            className="bg-white hover:bg-gray-300 text-danger py-1 px-3 rounded border transition-colors text-lg"
            type="button"
            aria-label="Generate Report"
          >
            <i className="fa fa-file-pdf" aria-hidden="true"></i>
          </button>
          <button
            onClick={onRefresh}
            className="bg-white hover:bg-gray-300 text-gray-500 py-2 px-3 rounded border transition-colors"
            type="button"
            aria-label="Refresh"
          >
            <i className="fa fa-refresh text-muted" aria-hidden="true"></i>
          </button>
        </div>
        <div className="flex-none">
          <button
            onClick={onAddClick}
            className="text-white font-semibold py-2 px-3 rounded transition-colors"
            style={{ backgroundColor: selectionBg, "--hover-bg": hoverColor } as React.CSSProperties}
            type="button"
            aria-label="Add"
          >
            <i className="fa fa-plus-circle me-2 text-xs" aria-hidden="true"></i>
            Add
          </button>
        </div>
      </div>

      <section className="bg-card rounded shadow py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 px-4">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={onSearchChange}
            className="border border-input rounded px-3 py-2 w-full md:w-64 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Search"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr className="border-b border-border">
                {tableColumns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tableData.length === 0 ? (
                <tr>
                  <td
                    colSpan={tableColumns.length + 1}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No items found.
                  </td>
                </tr>
              ) : (
                tableData.map((row, idx) => (
                  <tr
                    key={row.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors text-sm text-gray-500"
                  >
                    {tableColumns.map((col) => (
                      <td key={col.key} className="px-4 py-2">
                        {col.render
                          ? col.render(row[col.key], row, idx)
                          : row[col.key]}
                      </td>
                    ))}
                    <td className="px-3 py-2 whitespace-nowrap text-center space-x-2">
                      {rowActions(row)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
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

      {formMode && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white rounded shadow-lg w-full max-w-4xl max-h-full">
            <div className="flex justify-between items-center border-b border-border px-4 py-2 ">
              <h2 id="modal-title" className="text-xl font-semibold text-left">
                {modalTitle}
              </h2>
              <button
                onClick={() => {
                  setFormMode(null);
                  console.log("PageBase1: Modal closed via close button");
                }}
                className="text-white bg-red-500 hover:bg-red-800 focus:ring-2 focus:ring-red-500 rounded-full px-2 py-1 text-xs"
                aria-label="Close modal"
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </button>
            </div>
            <form onSubmit={onFormSubmit} className="px-4 py-4">
              {modalForm(themeStyles)}
            </form>
            <div className="border-t border-border px-4 pt-2 pb-3 flex justify-end gap-4">
              <button
                onClick={() => {
                  setFormMode(null);
                  console.log("PageBase1: Modal closed via cancel button");
                }}
                className="inline-flex items-center gap-2 bg-gray-600 hover:bg-secondary/80 text-white font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={onFormSubmit}
                className="inline-flex items-center gap-2 text-white font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                style={{ backgroundColor: themeStyles.selectionBg, "--hover-bg": themeStyles.hoverColor } as React.CSSProperties}
                type="button"
              >
                {formMode === "add" ? "Save" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}