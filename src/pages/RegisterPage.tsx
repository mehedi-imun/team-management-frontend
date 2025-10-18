import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

// Zod validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  organizationName: z.string().min(2, "Organization name must be at least 2 characters"),
  organizationSlug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      organizationName: "",
      organizationSlug: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register({
        name: data.name,
        email: data.email,
        password: data.password,
        organizationName: data.organizationName,
        organizationSlug: data.organizationSlug,
      }).unwrap();

      // Registration successful - show email verification message
      setUserEmail(data.email);
      setSuccess(true);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setFormError("root", {
        message: error?.data?.message || "Registration failed. Please try again.",
      });
    }
  };

  // Auto-generate slug from organization name
  const handleOrgNameChange = (value: string) => {
    setValue("organizationName", value);
    const slug = value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setValue("organizationSlug", slug);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
        <Card className="w-full max-w-xl shadow-xl">
          <CardContent className="pt-8 pb-8 px-8">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-6">
                <Mail className="h-20 w-20 text-blue-600 dark:text-blue-400" />
              </div>
              
              <div className="space-y-3">
                <h2 className="text-3xl font-bold">Check Your Email</h2>
                <p className="text-muted-foreground text-base">
                  We've sent a verification link to:
                </p>
                <p className="text-xl font-semibold text-primary break-all">{userEmail}</p>
              </div>

              <Alert className="text-left w-full">
                <AlertDescription>
                  <div className="space-y-3">
                    <p className="font-medium text-base">Next steps:</p>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Open your email inbox</li>
                      <li>Click the verification link</li>
                      <li>You'll be automatically logged in</li>
                    </ol>
                    <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
                      ⚠️ The verification link will expire in 24 hours.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
                <Button
                  variant="default"
                  onClick={() => window.location.href = "mailto:"}
                  className="flex-1 h-11"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Open Email App
                </Button>
                <Link to="/login" className="flex-1">
                  <Button variant="outline" className="w-full h-11">
                    Back to Login
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-muted-foreground pt-2">
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => setSuccess(false)}
                  className="text-primary hover:underline font-medium"
                >
                  try again
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4 py-8">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardHeader className="space-y-1 text-center pb-6">
          <div className="flex justify-center mb-4">
            <Building2 className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Start your 14-day free trial. No credit card required.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {errors.root && (
              <Alert variant="destructive">
                <AlertDescription>{errors.root.message}</AlertDescription>
              </Alert>
            )}

            {/* Organization Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b pb-2">
                Organization Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Organization Name */}
                <div className="space-y-2">
                  <Label htmlFor="organizationName">
                    Organization Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="organizationName"
                    type="text"
                    placeholder="Acme Inc"
                    {...formRegister("organizationName", {
                      onChange: (e) => handleOrgNameChange(e.target.value),
                    })}
                    disabled={isLoading}
                    className="h-11"
                  />
                  {errors.organizationName && (
                    <p className="text-sm text-destructive">{errors.organizationName.message}</p>
                  )}
                </div>

                {/* Organization Slug */}
                <div className="space-y-2">
                  <Label htmlFor="organizationSlug">
                    Organization Slug <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="organizationSlug"
                    type="text"
                    placeholder="acme-inc"
                    {...formRegister("organizationSlug")}
                    disabled={isLoading}
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">
                    Only lowercase letters, numbers, and hyphens
                  </p>
                  {errors.organizationSlug && (
                    <p className="text-sm text-destructive">{errors.organizationSlug.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b pb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    {...formRegister("name")}
                    disabled={isLoading}
                    className="h-11"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...formRegister("email")}
                    disabled={isLoading}
                    className="h-11"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b pb-2">
                Security
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...formRegister("password")}
                      disabled={isLoading}
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Min 6 chars with uppercase, lowercase & number
                  </p>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...formRegister("confirmPassword")}
                      disabled={isLoading}
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Re-enter your password to confirm
                  </p>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Create Account
            </Button>
          </form>
        </CardContent>
        <div className="px-8 pb-6">
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
