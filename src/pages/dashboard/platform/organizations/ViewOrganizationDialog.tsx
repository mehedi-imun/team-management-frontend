import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Organization } from "@/redux/features/platform/platformApi";
import { format } from "date-fns";
import {
  Building2,
  Calendar,
  CreditCard,
  FolderKanban,
  Users,
} from "lucide-react";

interface ViewOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization: Organization | null;
}

export function ViewOrganizationDialog({
  open,
  onOpenChange,
  organization,
}: ViewOrganizationDialogProps) {
  if (!organization) return null;

  const getStatusColor = (
    status: string
  ): "secondary" | "default" | "destructive" | "outline" => {
    const colors: Record<
      string,
      "secondary" | "default" | "destructive" | "outline"
    > = {
      trial: "secondary",
      active: "default",
      suspended: "destructive",
      cancelled: "outline",
    };
    return colors[status] || "outline";
  };

  const getPlanColor = (
    plan: string
  ): "secondary" | "default" | "destructive" | "outline" => {
    const colors: Record<
      string,
      "secondary" | "default" | "destructive" | "outline"
    > = {
      free: "outline",
      professional: "default",
      business: "secondary",
      enterprise: "default",
    };
    return colors[plan] || "outline";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Organization Details</DialogTitle>
          <DialogDescription>
            View detailed information about this organization
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{organization.name}</h3>
              <p className="text-sm text-muted-foreground">
                Slug: {organization.slug}
              </p>
            </div>

            <div className="flex gap-2">
              <Badge variant={getPlanColor(organization.plan)}>
                {organization.plan.toUpperCase()}
              </Badge>
              <Badge variant={getStatusColor(organization.status)}>
                {organization.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Owner Info */}
          <div className="border-t pt-4">
            <div className="flex items-start gap-2">
              <Building2 className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Owner</p>
                <p className="text-sm text-muted-foreground">
                  {organization.ownerName || "N/A"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {organization.ownerEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="border-t pt-4 grid grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <FolderKanban className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Teams</p>
                <p className="text-sm text-muted-foreground">
                  {organization.currentTeamCount} / {organization.teamLimit}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Members</p>
                <p className="text-sm text-muted-foreground">
                  {organization.currentMemberCount} / {organization.memberLimit}
                </p>
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          {organization.currentPeriodEnd && (
            <div className="border-t pt-4">
              <div className="flex items-start gap-2">
                <CreditCard className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Subscription</p>
                  <p className="text-sm text-muted-foreground">
                    Valid until:{" "}
                    {format(new Date(organization.currentPeriodEnd), "PPP")}
                  </p>
                  {organization.stripeCustomerId && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Stripe Customer ID: {organization.stripeCustomerId}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="border-t pt-4">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
              <div className="space-y-1">
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(organization.createdAt), "PPP")}
                  </p>
                </div>
                {organization.trialEndsAt && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Trial Ends</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(organization.trialEndsAt), "PPP")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
