/**
 * Trial Status Banner Component
 * Displays trial countdown with color-coded urgency
 */

import { AlertTriangle, Clock, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetTrialStatusQuery } from "../../redux/features/trial/trialApi";
import { getTrialWarningLevel } from "../../types/trial";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";

export default function TrialBanner() {
  const { data: trialResponse, isLoading, error } = useGetTrialStatusQuery();
  const navigate = useNavigate();

  // Don't show if loading, error, or not on trial
  if (isLoading || error || !trialResponse?.data) return null;

  const trialStatus = trialResponse.data;

  // Don't show if not on trial or trial not expired
  if (!trialStatus.isOnTrial && trialStatus.subscriptionStatus === "active") {
    return null;
  }

  const warningLevel = getTrialWarningLevel(trialStatus.daysLeft);

  const getIcon = () => {
    if (warningLevel.severity === "expired") {
      return <XCircle className="h-5 w-5" />;
    } else if (warningLevel.severity === "danger") {
      return <AlertTriangle className="h-5 w-5" />;
    } else {
      return <Clock className="h-5 w-5" />;
    }
  };

  const getVariant = () => {
    if (
      warningLevel.severity === "expired" ||
      warningLevel.severity === "danger"
    ) {
      return "destructive";
    }
    return "default";
  };

  const handleUpgrade = () => {
    navigate("/dashboard/organization/billing?upgrade=true");
  };

  return (
    <Alert variant={getVariant()} className="mb-4">
      <div className="flex items-center gap-3">
        {getIcon()}
        <AlertDescription className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-medium">{warningLevel.message}</span>
            {warningLevel.showUpgradeButton && (
              <Button onClick={handleUpgrade} size="sm" variant="outline">
                Upgrade Now
              </Button>
            )}
          </div>
        </AlertDescription>
      </div>
    </Alert>
  );
}
