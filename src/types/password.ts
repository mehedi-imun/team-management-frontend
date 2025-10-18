/**
 * Password Management Types & Utilities
 * Handles password validation, strength checking, and change requests
 */

export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumber: boolean;
  requireSpecial: boolean;
  specialChars: string;
}

export const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
  specialChars: "@$!%*?&#",
};

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4; // 0 = very weak, 4 = very strong
  label: "Very Weak" | "Weak" | "Fair" | "Strong" | "Very Strong";
  color: "red" | "orange" | "yellow" | "lightgreen" | "green";
  percentage: number;
  feedback: string[];
}

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength?: PasswordStrength;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForceChangePasswordRequest {
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

// Regex pattern matching backend validation
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

/**
 * Validate password against requirements
 */
export const validatePassword = (
  password: string,
  requirements: PasswordRequirements = DEFAULT_PASSWORD_REQUIREMENTS
): PasswordValidationResult => {
  const errors: string[] = [];

  if (password.length < requirements.minLength) {
    errors.push(
      `Password must be at least ${requirements.minLength} characters long`
    );
  }

  if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (requirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (requirements.requireNumber && !/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (requirements.requireSpecial) {
    const specialCharsRegex = new RegExp(
      `[${requirements.specialChars.replace(
        /[-[\]{}()*+?.,\\^$|#\s]/g,
        "\\$&"
      )}]`
    );
    if (!specialCharsRegex.test(password)) {
      errors.push(
        `Password must contain at least one special character (${requirements.specialChars})`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength:
      errors.length === 0 ? calculatePasswordStrength(password) : undefined,
  };
};

/**
 * Calculate password strength score
 */
export const calculatePasswordStrength = (
  password: string
): PasswordStrength => {
  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) {
    score++;
    feedback.push("Excellent length");
  }

  // Character variety
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score++;
    feedback.push("Mixed case");
  }
  if (/\d/.test(password)) {
    feedback.push("Contains numbers");
  }
  if (/[@$!%*?&#]/.test(password)) {
    feedback.push("Contains special characters");
  }

  // Complexity patterns
  if (/[A-Z].*[A-Z]/.test(password)) feedback.push("Multiple uppercase");
  if (/\d.*\d/.test(password)) feedback.push("Multiple numbers");

  // Penalize common patterns
  if (/^[a-zA-Z]+$/.test(password)) {
    score = Math.max(0, score - 1);
    feedback.push("Add numbers or special characters");
  }
  if (/^[0-9]+$/.test(password)) {
    score = Math.max(0, score - 1);
    feedback.push("Add letters or special characters");
  }

  // Cap score at 4
  score = Math.min(4, score) as 0 | 1 | 2 | 3 | 4;

  const strengthMap: Record<
    number,
    { label: PasswordStrength["label"]; color: PasswordStrength["color"] }
  > = {
    0: { label: "Very Weak", color: "red" },
    1: { label: "Weak", color: "orange" },
    2: { label: "Fair", color: "yellow" },
    3: { label: "Strong", color: "lightgreen" },
    4: { label: "Very Strong", color: "green" },
  };

  const finalScore = score as 0 | 1 | 2 | 3 | 4;

  return {
    score: finalScore,
    label: strengthMap[finalScore].label,
    color: strengthMap[finalScore].color,
    percentage: (finalScore / 4) * 100,
    feedback: feedback.length > 0 ? feedback : ["Enter a password"],
  };
};

/**
 * Check if password meets minimum requirements (quick check)
 */
export const meetsMinimumRequirements = (password: string): boolean => {
  return PASSWORD_REGEX.test(password);
};
