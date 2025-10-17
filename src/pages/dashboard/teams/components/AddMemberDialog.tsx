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
import type { ITeam } from "@/types";
import { Loader2, Mail, User, UserPlus } from "lucide-react";
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
        title: "Success",
        description: `Member added to ${team.name}`,
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
            Add a new member to <strong>{team?.name}</strong>. They will receive
            an invitation email.
          </DialogDescription>
        </DialogHeader>

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
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Member
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
