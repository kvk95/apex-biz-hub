import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Icons replaced with Font Awesome
import { Pagination } from "@/components/Pagination/Pagination";

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface RowAction {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: any) => void;
  variant?: "default" | "destructive";
}

export interface BulkAction {
  label: string;
  onClick: (selectedRows: any[]) => void;
  variant?: "default" | "destructive";
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSort?: (key: string, direction: "asc" | "desc") => void;
  rowActions?: RowAction[];
  bulkActions?: BulkAction[];
  selectable?: boolean;
  loading?: boolean;
}

export function DataTable({
  columns,
  data,
  total,
  page = 1,
  pageSize = 20,
  onPageChange,
  onPageSizeChange,
  onSort,
  rowActions,
  bulkActions,
  selectable = false,
  loading = false,
}: DataTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<any>>(new Set());
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    const newDirection = sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortDirection(newDirection);
    onSort?.(key, newDirection);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(data.map((_, idx) => idx)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (idx: number, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(idx);
    } else {
      newSelected.delete(idx);
    }
    setSelectedRows(newSelected);
  };

  const selectedData = data.filter((_, idx) => selectedRows.has(idx));

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {selectable && bulkActions && selectedRows.size > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {selectedRows.size} row(s) selected
          </span>
          {bulkActions.map((action, idx) => (
            <Button
              key={idx}
              variant={action.variant || "default"}
              size="sm"
              onClick={() => action.onClick(selectedData)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.size === data.length && data.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={column.key}>
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort(column.key)}
                      className="h-8 px-2"
                    >
                      {column.label}
                      {sortKey === column.key && (
                        sortDirection === "asc" ? (
                          <i className="fa fa-chevron-up ml-2 h-4 w-4" aria-hidden="true" />
                        ) : (
                          <i className="fa fa-chevron-down ml-2 h-4 w-4" aria-hidden="true" />
                        )
                      )}
                    </Button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
              {rowActions && <TableHead className="w-12">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)}
                  className="h-24 text-center"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow key={idx}>
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(idx)}
                        onCheckedChange={(checked) => handleSelectRow(idx, !!checked)}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </TableCell>
                  ))}
                  {rowActions && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <i className="fa fa-ellipsis-v h-4 w-4" aria-hidden="true" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {rowActions.map((action, actionIdx) => (
                            <DropdownMenuItem
                              key={actionIdx}
                              onClick={() => action.onClick(row)}
                              className={action.variant === "destructive" ? "text-destructive" : ""}
                            >
                              {action.icon}
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {total && onPageChange && (
        <Pagination
          currentPage={page}
          totalItems={total}
          itemsPerPage={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}
