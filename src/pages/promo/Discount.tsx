import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { DataTable } from "@/components/DataTable/DataTable";
import { Column, RowAction } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface Discount {
  id: number;
  discountName: string;
  discountType: string;
  discountAmount: string;
  startDate: string;
  endDate: string;
  status: string;
}

const discountTypes = ["Percentage", "Fixed"];
const statuses = ["Active", "Inactive"];

export default function Discount() {
  const [data, setData] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    discountName: "",
    discountType: "Percentage",
    discountAmount: "",
    startDate: "",
    endDate: "",
    status: "Active",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    document.title = "Discount - Dreams POS";
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<Discount[]>("discounts");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  const handleInputChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!form.discountName.trim() || !form.discountAmount.trim() || !form.startDate || !form.endDate) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (editingId !== null) {
      setData((prev) =>
        prev.map((item) => (item.id === editingId ? { ...item, ...form } : item))
      );
      toast.success("Discount updated successfully");
      setEditingId(null);
    } else {
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [...prev, { id: newId, ...form }]);
      toast.success("Discount created successfully");
    }

    setForm({
      discountName: "",
      discountType: "Percentage",
      discountAmount: "",
      startDate: "",
      endDate: "",
      status: "Active",
    });
  };

  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setForm({
        discountName: item.discountName,
        discountType: item.discountType,
        discountAmount: item.discountAmount,
        startDate: item.startDate,
        endDate: item.endDate,
        status: item.status,
      });
      setEditingId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((d) => d.id !== id));
    toast.success("Discount deleted successfully");
    if (editingId === id) {
      setEditingId(null);
      setForm({
        discountName: "",
        discountType: "Percentage",
        discountAmount: "",
        startDate: "",
        endDate: "",
        status: "Active",
      });
    }
  };

  const handleRefresh = () => {
    setForm({
      discountName: "",
      discountType: "Percentage",
      discountAmount: "",
      startDate: "",
      endDate: "",
      status: "Active",
    });
    setEditingId(null);
  };

  const columns: Column[] = [
    { key: "id", label: "#", sortable: false },
    { key: "discountName", label: "Discount Name", sortable: true },
    { key: "discountType", label: "Discount Type", sortable: true },
    {
      key: "discountAmount",
      label: "Discount Amount",
      sortable: true,
      render: (row: Discount) =>
        row.discountType === "Percentage" ? `${row.discountAmount}%` : `$${row.discountAmount}`,
    },
    { key: "startDate", label: "Start Date", sortable: true },
    { key: "endDate", label: "End Date", sortable: true },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row: Discount) => (
        <span
          className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
            row.status === "Active"
              ? "bg-success-light text-success"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const rowActions: RowAction[] = [
    {
      label: "Edit",
      onClick: (row: Discount) => handleEdit(row.id),
      icon: "fa fa-pencil",
    },
    {
      label: "Delete",
      onClick: (row: Discount) => {
        if (window.confirm("Are you sure you want to delete this discount?")) {
          handleDelete(row.id);
        }
      },
      icon: "fa fa-trash",
      variant: "destructive",
    },
  ];

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          <i className="fa fa-exclamation-triangle mr-2" />
          Error loading discounts: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-semibold mb-6 text-foreground">Discount Management</h1>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="discountName">Discount Name</Label>
                <Input
                  id="discountName"
                  value={form.discountName}
                  onChange={(e) => handleInputChange("discountName", e.target.value)}
                  placeholder="Enter Discount Name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="discountType">Discount Type</Label>
                <Select
                  value={form.discountType}
                  onValueChange={(value) => handleInputChange("discountType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {discountTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="discountAmount">Discount Amount</Label>
                <Input
                  id="discountAmount"
                  type="number"
                  value={form.discountAmount}
                  onChange={(e) => handleInputChange("discountAmount", e.target.value)}
                  placeholder="Enter Discount Amount"
                  min="0"
                  step="any"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit">
                <i className="fa fa-save mr-2" />
                {editingId ? "Update" : "Save"}
              </Button>
              <Button type="button" variant="outline" onClick={handleRefresh}>
                <i className="fa fa-refresh mr-2" />
                Refresh
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            data={data}
            loading={loading}
            page={currentPage}
            pageSize={pageSize}
            total={data.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            rowActions={rowActions}
          />
        </CardContent>
      </Card>
    </div>
  );
}
