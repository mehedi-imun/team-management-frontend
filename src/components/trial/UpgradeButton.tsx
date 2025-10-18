/**
 * Upgrade Button Component
 * Call-to-action button for upgrading subscription
 */

import { Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

interface UpgradeButtonProps {
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "secondary";
  text?: string;
  showIcon?: boolean;
}

export default function UpgradeButton({
  size = "default",
  variant = "default",
  text = "Upgrade",
  showIcon = true,
}: UpgradeButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dashboard/organization/billing?upgrade=true");
  };

  return (
    <Button onClick={handleClick} size={size} variant={variant}>
      {showIcon && <Zap className="h-4 w-4 mr-2" />}
      {text}
    </Button>
  );
}
