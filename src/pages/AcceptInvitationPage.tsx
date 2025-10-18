/**
 * Accept Invitation Page
 * Allows new users to accept team invitations and create their account
 */

import {
  AlertTriangle,
  Building2,
  CheckCircle,
  Loader2,
  Mail,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
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
import { Input } from "../components/ui/input";
import { setUser } from "../redux/features/auth/authSlice";
import {
  useAcceptInvitationMutation,
  useValidateInvitationQuery,
} from "../redux/features/invitation/invitationApi";
import { getDaysUntilExpiry } from "../types/invitation";
import { validatePassword } from "../types/password";

export default function AcceptInvitationPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ name?: string; password?: string }>(
    {}
  );

  const {
    data: invitationData,
    isLoading: isValidating,
    error: validationError,
  } = useValidateInvitationQuery(token || "", {
    skip: !token,
  });

  const [acceptInvitation, { isLoading: isAccepting }] =
    useAcceptInvitationMutation();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: { name?: string; password?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const result = await acceptInvitation({
        token: token!,
        name: name.trim(),
        password,
      }).unwrap();

      // Set user in Redux store
      if (result.data?.user) {
        dispatch(setUser(result.data.user));
      }

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to accept invitation";
      setErrors({ password: errorMessage });
    }
  };

  // Loading state
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-gray-600 dark:text-gray-400">
                Validating invitation...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state - Invalid or expired invitation
  if (validationError || invitationData?.data?.isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-xl">Invalid Invitation</CardTitle>
            </div>
            <CardDescription>
              {invitationData?.data?.isExpired
                ? "This invitation link has expired."
                : "This invitation link is invalid or has already been used."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/login")} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const invitation = invitationData?.data;
  const daysLeft = invitation?.expiresAt
    ? getDaysUntilExpiry(invitation.expiresAt)
    : 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle className="text-2xl">You're Invited!</CardTitle>
              <CardDescription>
                Complete your profile to join the team
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Invitation Details */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <Mail className="h-4 w-4" />
              <span className="font-medium">Email:</span>
              <span>{invitation?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <Building2 className="h-4 w-4" />
              <span className="font-medium">Organization:</span>
              <span>{invitation?.organizationName}</span>
            </div>
            {invitation?.teamName && (
              <div className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <Users className="h-4 w-4" />
                <span className="font-medium">Team:</span>
                <span>{invitation.teamName}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <span className="font-medium">Role:</span>
              <span>{invitation?.teamRole || invitation?.role}</span>
            </div>
          </div>

          {/* Expiry Warning */}
          {daysLeft > 0 && daysLeft <= 3 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This invitation expires in {daysLeft}{" "}
                {daysLeft === 1 ? "day" : "days"}. Accept it soon!
              </AlertDescription>
            </Alert>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-4">
              <PasswordInput
                id="password"
                name="password"
                value={password}
                onChange={setPassword}
                label="Password"
                placeholder="Create a strong password"
                autoComplete="new-password"
                required
                error={errors.password}
              />

              {/* Password Strength Indicator */}
              {password && <PasswordStrengthIndicator password={password} />}

              {/* Password Requirements */}
              <PasswordRequirements password={password} />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isAccepting}>
              {isAccepting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Accepting Invitation...
                </>
              ) : (
                "Accept Invitation & Join"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => navigate("/login")}
            >
              Sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
