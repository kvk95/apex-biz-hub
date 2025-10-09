// src/pages/UserManagement/RolesPermissionsPage.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample data—what permissions align with your menu sections?
const sampleRoles = [
  { id: 1, name: "Admin", permissions: { dashboard: true, sales: true, inventory: true /* etc. */ } },
  { id: 2, name: "Manager", permissions: { dashboard: true, sales: true, inventory: false } },
  // Add more...
];

const modules = ["Dashboard", "Sales", "Inventory", "Finance", "HRM", "Reports", "Settings"];

export default function RolesPermissionsPage() {
  const [roles, setRoles] = useState(sampleRoles);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editRole, setEditRole] = useState({ name: "", permissions: {} });

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setEditRole({ ...role });
    setIsEditModalOpen(true);
  };

  const savePermissions = () => {
    setRoles(roles.map(r => r.id === selectedRole.id ? { ...r, ...editRole } : r));
    setIsEditModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Roles & Permissions</h1>
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogTrigger asChild>
            <Button disabled={!selectedRole}><Edit className="mr-2 h-4 w-4" /> Edit Permissions</Button>
          </DialogTrigger>
          {selectedRole && (
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit {selectedRole.name} Permissions</DialogTitle>
                <DialogDescription>Toggle access for each module.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="role-name">Role Name</Label>
                  <Input id="role-name" value={editRole.name} onChange={(e) => setEditRole({...editRole, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {modules.map(module => (
                    <div key={module} className="flex items-center space-x-2">
                      <Checkbox
                        id={module}
                        checked={editRole.permissions[module.toLowerCase()] || false}
                        onCheckedChange={(checked) => setEditRole({...editRole, permissions: {...editRole.permissions, [module.toLowerCase()]: checked}})}
                      />
                      <Label htmlFor={module}>{module}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button onClick={savePermissions}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role Name</TableHead>
            <TableHead>Users Assigned</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>{role.name}</TableCell>
              <TableCell>5</TableCell> {/* Dynamic count? */}
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => handleEditRole(role)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}