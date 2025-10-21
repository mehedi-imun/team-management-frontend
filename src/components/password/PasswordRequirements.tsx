/**
 * Password Requirements Display Component
 * Shows checklist of password requirements with validation status
 */

import { Check, X } from "lucide-react";
import { DEFAULT_PASSWORD_REQUIREMENTS } from "../../types/password";

interface PasswordRequirementsProps {
  password: string;
}

export default function PasswordRequirements({
  password,
}: PasswordRequirementsProps) {
  const requirements = DEFAULT_PASSWORD_REQUIREMENTS;

  const checks = [
    {
      label: `At least ${requirements.minLength} characters`,
      met: password.length >= requirements.minLength,
    },
    {
      label: "One uppercase letter (A-Z)",
      met: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter (a-z)",
      met: /[a-z]/.test(password),
    },
    {
      label: "One number (0-9)",
      met: /\d/.test(password),
    },
    {
      label: `One special character (${requirements.specialChars})`,
      met: new RegExp(
        `[${requirements.specialChars.replace(
          /[-[\]{}()*+?.,\\^$|#\s]/g,
          "\\$&"
        )}]`
      ).test(password),
    },
  ];

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Password must contain:
      </p>
      <ul className="space-y-1.5">
        {checks.map((check, index) => (
          <li
            key={index}
            className={`flex items-center gap-2 text-sm transition-colors ${
              check.met
                ? "text-green-600 dark:text-green-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {check.met ? (
              <Check className="h-4 w-4 flex-shrink-0" />
            ) : (
              <X className="h-4 w-4 flex-shrink-0" />
            )}
            <span>{check.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
