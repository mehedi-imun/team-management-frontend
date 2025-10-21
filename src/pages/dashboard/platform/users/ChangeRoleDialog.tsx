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
import { Loader2, Shield, ShieldCheck } from "lucide-react";
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Change User Role</DialogTitle>
          <DialogDescription className="text-base">
            Update the system role for{" "}
            <span className="font-semibold text-foreground">"{userName}"</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Info Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900">
                  Platform Level Roles Only
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  This dialog only manages platform-level roles (SuperAdmin,
                  Admin). Organization roles are managed within each
                  organization's member settings.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="role" className="text-base font-medium">
              Select Platform Role
            </Label>
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
              disabled={isLoading}
            >
              <SelectTrigger id="role" className="h-11">
                <SelectValue placeholder="Select platform role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SuperAdmin">
                  <div className="flex items-center gap-2 py-1">
                    <Shield className="h-4 w-4 text-red-500" />
                    <div>
                      <div className="font-medium">Super Admin</div>
                      <div className="text-xs text-muted-foreground">
                        Full platform access - highest privilege
                      </div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="Admin">
                  <div className="flex items-center gap-2 py-1">
                    <ShieldCheck className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="font-medium">Admin</div>
                      <div className="text-xs text-muted-foreground">
                        Manage all organizations and users
                      </div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-2">
              <p className="text-sm text-blue-900">
                <span className="font-medium">Current role:</span>{" "}
                <span className="font-semibold">{currentRole}</span>
              </p>
              {currentRole !== selectedRole && (
                <p className="text-xs text-blue-700 mt-1">
                  ⚠️ Platform role changes take effect immediately and
                  grant/revoke system-wide permissions
                </p>
              )}
            </div>

            {/* Note for org users */}
            {(currentRole === "OrgOwner" ||
              currentRole === "OrgAdmin" ||
              currentRole === "OrgMember") && (
              <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                <p className="text-xs text-orange-800">
                  <span className="font-semibold">Note:</span> This user
                  currently has an organization role ({currentRole}). Changing
                  to a platform role will remove their organization affiliation.
                  Manage organization roles from the organization's member page
                  instead.
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            size="lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || selectedRole === currentRole}
            size="lg"
          >
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Update Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
