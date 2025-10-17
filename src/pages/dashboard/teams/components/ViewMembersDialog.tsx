import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ITeam } from "@/types";
import { Mail, User, Calendar, Trash2 } from "lucide-react";
import { useDeleteMemberMutation } from "@/redux/features/team/teamApi";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ViewMembersDialogProps {
  team: ITeam | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewMembersDialog({
  team,
  open,
  onOpenChange,
}: ViewMembersDialogProps) {
  const [deleteMember, { isLoading }] = useDeleteMemberMutation();
  const { toast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState<{
    memberId: string;
    name: string;
  } | null>(null);

  const handleDeleteMember = async () => {
    if (!team || !confirmDelete) return;

    try {
      await deleteMember({
        teamId: team._id,
        memberId: confirmDelete.memberId,
      }).unwrap();

      toast({
        title: "Success",
        description: `Member removed from team`,
      });
      setConfirmDelete(null);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.data?.message || "Failed to remove member",
      });
    }
  };

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Team Members - {team?.name}</DialogTitle>
            <DialogDescription>
              View and manage all members in this team
            </DialogDescription>
          </DialogHeader>

          {team?.members && team.members.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.members.map((member) => (
                    <TableRow key={member._id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {member.name || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {member.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {member.role || "Member"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {formatDate(member.joinedAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={member.isActive ? "default" : "destructive"}
                        >
                          {member.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setConfirmDelete({
                              memberId: member._id || "",
                              name: member.name || member.email || "Unknown",
                            })
                          }
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No members in this team yet
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!confirmDelete}
        onOpenChange={() => setConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <strong>{confirmDelete?.name}</strong> from this team?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMember}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
