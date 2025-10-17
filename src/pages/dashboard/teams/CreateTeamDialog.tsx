import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateTeamMutation } from "@/redux/features/team/teamApi";
import { useToast } from "@/hooks/use-toast";

interface CreateTeamDialogProps {
  open: boolean;
  onClose: () => void;
}

interface Member {
  email: string;
  name: string;
  role: "TeamLead" | "Member";
}

export function CreateTeamDialog({ open, onClose }: CreateTeamDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState<Member[]>([
    { email: "", name: "", role: "Member" },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createTeam, { isLoading }] = useCreateTeamMutation();
  const { toast } = useToast();

  const handleAddMember = () => {
    setMembers([...members, { email: "", name: "", role: "Member" }]);
  };

  const handleRemoveMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const handleMemberChange = (
    index: number,
    field: keyof Member,
    value: string
  ) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Team name is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    members.forEach((member, index) => {
      if (!member.email.trim()) {
        newErrors[`member_${index}_email`] = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(member.email)) {
        newErrors[`member_${index}_email`] = "Invalid email format";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting",
        variant: "destructive",
      });
      return;
    }

    try {
      await createTeam({
        name,
        description,
        members: members.filter((m) => m.email.trim()),
      }).unwrap();

      toast({
        title: "Success",
        description: "Team created successfully",
      });

      handleClose();
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast({
        title: "Error",
        description: err?.data?.message || "Failed to create team",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setMembers([{ email: "", name: "", role: "Member" }]);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Add a new team to your organization
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Team Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Team Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter team name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter team description"
              className={errors.description ? "border-red-500" : ""}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Team Members */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Team Members</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddMember}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </div>

            <div className="space-y-3">
              {members.map((member, index) => (
                <div
                  key={index}
                  className="flex gap-2 p-3 border rounded-lg bg-gray-50"
                >
                  <div className="flex-1 space-y-2">
                    <Input
                      value={member.email}
                      onChange={(e) =>
                        handleMemberChange(index, "email", e.target.value)
                      }
                      placeholder="Email *"
                      className={
                        errors[`member_${index}_email`] ? "border-red-500" : ""
                      }
                    />
                    {errors[`member_${index}_email`] && (
                      <p className="text-sm text-red-500">
                        {errors[`member_${index}_email`]}
                      </p>
                    )}

                    <Input
                      value={member.name}
                      onChange={(e) =>
                        handleMemberChange(index, "name", e.target.value)
                      }
                      placeholder="Name (optional)"
                    />

                    <Select
                      value={member.role}
                      onValueChange={(value) =>
                        handleMemberChange(
                          index,
                          "role",
                          value as "TeamLead" | "Member"
                        )
                      }
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

                  {members.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMember(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Team"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
