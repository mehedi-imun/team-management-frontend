import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface ChangeRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (role: string) => void;
  userName: string;
  currentRole: string;
  isLoading?: boolean;
}

export function ChangeRoleDialog({
  open,
  onOpenChange,
  onConfirm,
  userName,
  currentRole,
  isLoading,
}: ChangeRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState<string>(currentRole);

  const handleSubmit = () => {
    onConfirm(selectedRole);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            Update the role for{" "}
            <span className="font-semibold text-foreground">"{userName}"</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="role">New Role</Label>
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
              disabled={isLoading}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Member">Member</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Director">Director</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="SuperAdmin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Current role: <span className="font-medium">{currentRole}</span>
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || selectedRole === currentRole}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
