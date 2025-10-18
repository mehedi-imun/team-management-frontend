import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAddMemberMutation } from "@/redux/features/team/teamApi";
import { useGetTrialStatusQuery } from "@/redux/features/trial/trialApi";
import type { ITeam } from "@/types";
import {
  AlertTriangle,
  Info,
  Loader2,
  Mail,
  User,
  UserPlus,
} from "lucide-react";
import { useState } from "react";

interface AddMemberDialogProps {
  team: ITeam | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMemberDialog({
  team,
  open,
  onOpenChange,
}: AddMemberDialogProps) {
  const [addMember, { isLoading }] = useAddMemberMutation();
  const { toast } = useToast();

  // Trial status check
  const { data: trialResponse } = useGetTrialStatusQuery();
  const trialStatus = trialResponse?.data;
  const canInviteMembers = trialStatus?.canAccessFeatures ?? true;

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "Member",
  });

  const resetForm = () => {
    setFormData({
      email: "",
      name: "",
      role: "Member",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;

    if (!formData.email.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Email is required",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter a valid email address",
      });
      return;
    }

    try {
      await addMember({
        teamId: team._id,
        data: {
          email: formData.email,
          name: formData.name || undefined,
          role: formData.role as "TeamLead" | "Member",
        },
      }).unwrap();

      toast({
        title: "Invitation Sent! 📧",
        description: `${formData.email} will receive an email to set up their account`,
      });
      resetForm();
      onOpenChange(false);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.data?.message || "Failed to add member",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm();
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add Team Member
          </DialogTitle>
          <DialogDescription>
            Invite a new member to <strong>{team?.name}</strong>. They will
            receive an email to set up their account and create their own
            password.
          </DialogDescription>
        </DialogHeader>

        {/* Invitation Info */}
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-blue-800">
            <strong>Member Invitation Process:</strong>
            <ol className="mt-2 ml-4 list-decimal space-y-1">
              <li>Member receives an invitation email</li>
              <li>They click the setup link (valid for 7 days)</li>
              <li>They create their own secure password</li>
              <li>Their account is automatically activated</li>
            </ol>
          </AlertDescription>
        </Alert>

        {/* Trial Warning */}
        {!canInviteMembers && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your trial has expired. Please upgrade to invite new members.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="member@example.com"
                disabled={isLoading}
                required
              />
              <p className="text-xs text-muted-foreground">
                📧 Setup link will be sent to this email
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Name (Optional)
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="John Doe"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Optional: Member can update later
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Member">Member</SelectItem>
                  <SelectItem value="TeamLead">Team Lead</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Defines member permissions in the team
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !canInviteMembers}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Member
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
