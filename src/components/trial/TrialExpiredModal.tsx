/**
 * Trial Expired Modal Component
 * Blocking modal when trial has expired
 */

import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface TrialExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

export default function TrialExpiredModal({
  isOpen,
  onClose,
  feature,
}: TrialExpiredModalProps) {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate("/dashboard/organization/billing?upgrade=true");
    onClose();
  };

  const blockedFeatures = [
    "Create new teams",
    "Invite new members",
    "Advanced analytics",
    "Custom branding",
    "Priority support",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-xl">Trial Expired</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            {feature
              ? `You cannot ${feature} because your trial has expired.`
              : "Your trial period has ended. Upgrade to continue using all features."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-2">
              Features currently blocked:
            </h4>
            <ul className="space-y-1.5">
              {blockedFeatures.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Upgrade now</strong> to unlock all features and continue
              managing your teams without interruption.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleUpgrade}>View Plans & Upgrade</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
