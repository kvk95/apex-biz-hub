import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye, Download } from "lucide-react";

const companies = [
  {
    id: 1,
    name: "TechCorp Solutions",
    email: "admin@techcorp.com",
    phone: "+1 234 567 8900",
    plan: "Enterprise",
    status: "Active",
    employees: 150,
    subscriptionDate: "2024-01-15",
  },
  {
    id: 2,
    name: "RetailMax Inc",
    email: "contact@retailmax.com",
    phone: "+1 234 567 8901",
    plan: "Professional",
    status: "Active",
    employees: 75,
    subscriptionDate: "2024-02-20",
  },
  {
    id: 3,
    name: "FoodChain Ltd",
    email: "info@foodchain.com",
    phone: "+1 234 567 8902",
    plan: "Basic",
    status: "Active",
    employees: 30,
    subscriptionDate: "2024-03-10",
  },
  {
    id: 4,
    name: "QuickMart Express",
    email: "support@quickmart.com",
    phone: "+1 234 567 8903",
    plan: "Professional",
    status: "Suspended",
    employees: 45,
    subscriptionDate: "2023-11-05",
  },
];

export default function Companies() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
          <p className="text-muted-foreground">Manage all registered companies</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Company
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Companies ({filteredCompanies.length})</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[300px] pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscription Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{company.name}</p>
                      <p className="text-sm text-muted-foreground">{company.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{company.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{company.plan}</Badge>
                  </TableCell>
                  <TableCell>{company.employees}</TableCell>
                  <TableCell>
                    <Badge variant={company.status === "Active" ? "default" : "destructive"}>
                      {company.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{company.subscriptionDate}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
