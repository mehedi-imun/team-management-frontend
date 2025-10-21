/**
 * Force Password Change Page
 * Requires users to change their password on first login
 */

import { CheckCircle, Loader2, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/password/PasswordInput";
import PasswordRequirements from "../components/password/PasswordRequirements";
import PasswordStrengthIndicator from "../components/password/PasswordStrengthIndicator";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useForceChangePasswordMutation } from "../redux/features/auth/authApi";
import { clearMustChangePassword } from "../redux/features/auth/authSlice";
import type { RootState } from "../redux/store";
import { validatePassword } from "../types/password";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState("");

  const [forceChangePassword, { isLoading }] = useForceChangePasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    // Validation
    const newErrors: { newPassword?: string; confirmPassword?: string } = {};

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      newErrors.newPassword = passwordValidation.errors[0];
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await forceChangePassword({ newPassword }).unwrap();

      // Clear the mustChangePassword flag
      dispatch(clearMustChangePassword());

      setSuccessMessage(
        "Password changed successfully! Redirecting to dashboard..."
      );

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to change password";
      setErrors({ newPassword: errorMessage });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
              <ShieldAlert className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-2xl">
                Change Password Required
              </CardTitle>
              <CardDescription>
                You must change your password before continuing
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Info Alert */}
          <Alert>
            <AlertDescription>
              <strong>Welcome, {user?.name}!</strong> For security reasons, you
              must change your temporary password before accessing your account.
            </AlertDescription>
          </Alert>

          {/* Success Message */}
          {successMessage && (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Password Change Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div className="space-y-4">
              <PasswordInput
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={setNewPassword}
                label="New Password"
                placeholder="Enter your new password"
                autoComplete="new-password"
                required
                error={errors.newPassword}
              />

              {/* Password Strength Indicator */}
              {newPassword && (
                <PasswordStrengthIndicator password={newPassword} />
              )}

              {/* Password Requirements */}
              <PasswordRequirements password={newPassword} />
            </div>

            {/* Confirm Password */}
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={setConfirmPassword}
              label="Confirm New Password"
              placeholder="Re-enter your new password"
              autoComplete="new-password"
              required
              error={errors.confirmPassword}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !!successMessage}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing Password...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </form>

          {/* Security Notice */}
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Password Security Tips:
            </h4>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Use a unique password you don't use elsewhere</li>
              <li>• Avoid common words or personal information</li>
              <li>• Consider using a password manager</li>
              <li>• Never share your password with anyone</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
