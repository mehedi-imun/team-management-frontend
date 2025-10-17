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
import { useToast } from "@/hooks/use-toast";
import { useDeleteTeamMutation } from "@/redux/features/team/teamApi";
import type { ITeam } from "@/types";
import { Loader2 } from "lucide-react";

interface DeleteTeamDialogProps {
  team: ITeam | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTeamDialog({
  team,
  open,
  onOpenChange,
}: DeleteTeamDialogProps) {
  const [deleteTeam, { isLoading }] = useDeleteTeamMutation();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!team) return;

    try {
      await deleteTeam(team._id).unwrap();
      toast({
        title: "Success",
        description: `Team "${team.name}" deleted successfully`,
      });
      onOpenChange(false);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.data?.message || "Failed to delete team",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Team</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{team?.name}</strong>? This
            action cannot be undone. All team data will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
