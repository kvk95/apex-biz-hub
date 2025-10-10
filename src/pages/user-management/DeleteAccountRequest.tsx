// src/pages/UserManagement/DeleteAccountPage.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar as CalendarIcon, Check, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Sample data—how would you query pending requests from a backend?
const sampleRequests = [
  { id: 1, userName: "Alice Johnson", requisitionDate: "2025-10-01", requestDate: "2025-10-05", status: "Pending" },
  { id: 2, userName: "Bob Wilson", requisitionDate: "2025-10-03", requestDate: "2025-10-07", status: "Approved" },
  // Add more...
];

export default function DeleteAccountPage() {
  const [requests, setRequests] = useState(sampleRequests);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [action, setAction] = useState(""); // "approve" or "reject"
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();

  const handleAction = (requestId: number, act: string) => {
    setSelectedRequest(requests.find(r => r.id === requestId));
    setAction(act);
    setIsActionModalOpen(true);
  };

  const confirmAction = () => {
    setRequests(requests.map(r => 
      r.id === selectedRequest.id 
        ? { ...r, status: action === "approve" ? "Approved" : "Rejected" } 
        : r
    ));
    setIsActionModalOpen(false);
    // Question: Integrate with API or email service here?
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Delete Account Requests</h1>
      {/* Date filter row */}
      <div className="flex space-x-4">
        <div>
          <Label>From Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-[240px] justify-start text-left font-normal", !fromDate && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label>To Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-[240px] justify-start text-left font-normal", !toDate && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Name</TableHead>
            <TableHead>Requisition Date</TableHead>
            <TableHead>Delete Request Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.userName}</TableCell>
              <TableCell>{request.requisitionDate}</TableCell>
              <TableCell>{request.requestDate}</TableCell>
              <TableCell>
                <Badge variant={request.status === "Pending" ? "default" : request.status === "Approved" ? "secondary" : "destructive"}>
                  {request.status}
                </Badge>
              </TableCell>
              <TableCell className="flex space-x-2">
                {request.status === "Pending" && (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => handleAction(request.id, "approve")}>
                      <Check className="h-4 w-4" /> Approve
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleAction(request.id, "reject")}>
                      <X className="h-4 w-4" /> Reject
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isActionModalOpen} onOpenChange={setIsActionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{action === "approve" ? "Approve" : "Reject"} Request</DialogTitle>
            <DialogDescription>
              Are you sure? This will {action === "approve" ? "permanently delete the account" : "deny the request"} for {selectedRequest?.userName}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionModalOpen(false)}>Cancel</Button>
            <Button onClick={confirmAction}>{action === "approve" ? "Approve" : "Reject"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}