/**
 * Password Strength Indicator Component
 * Visual meter showing password strength in real-time
 */

import { calculatePasswordStrength } from "../../types/password";

interface PasswordStrengthIndicatorProps {
  password: string;
  showFeedback?: boolean;
}

export default function PasswordStrengthIndicator({
  password,
  showFeedback = true,
}: PasswordStrengthIndicatorProps) {
  const strength = calculatePasswordStrength(password);

  const getColorClass = () => {
    switch (strength.color) {
      case "red":
        return "bg-red-500";
      case "orange":
        return "bg-orange-500";
      case "yellow":
        return "bg-yellow-500";
      case "lightgreen":
        return "bg-green-400";
      case "green":
        return "bg-green-600";
      default:
        return "bg-gray-300";
    }
  };

  const getTextColorClass = () => {
    switch (strength.color) {
      case "red":
        return "text-red-600";
      case "orange":
        return "text-orange-600";
      case "yellow":
        return "text-yellow-600";
      case "lightgreen":
        return "text-green-500";
      case "green":
        return "text-green-700";
      default:
        return "text-gray-500";
    }
  };

  if (!password) return null;

  return (
    <div className="space-y-2">
      {/* Strength meter */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Password Strength:</span>
          <span className={`font-medium ${getTextColorClass()}`}>{strength.label}</span>
        </div>
        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${getColorClass()} transition-all duration-300`}
            style={{ width: `${strength.percentage}%` }}
          />
        </div>
      </div>

      {/* Feedback */}
      {showFeedback && strength.feedback.length > 0 && (
        <div className="text-xs text-gray-600 dark:text-gray-400">
          <ul className="list-disc list-inside space-y-0.5">
            {strength.feedback.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
