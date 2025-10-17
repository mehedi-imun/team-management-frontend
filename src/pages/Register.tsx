import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useRegisterMutation } from "../redux/features/auth/authApi";
import { setUser } from "../redux/features/auth/authSlice";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  organizationName: z
    .string()
    .min(2, "Organization name must be at least 2 characters"),
  organizationSlug: z
    .string()
    .min(2, "Organization slug must be at least 2 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Auto-generate slug from organization name
  const handleOrgNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setValue("organizationSlug", slug);
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await register(data).unwrap();

      // Save user to Redux store and localStorage
      dispatch(setUser(result.data.user));

      toast.success(result.message || "Registration successful!");
      navigate("/teams");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(
        err?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🚀 TeamHub</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Create Your Account
          </h2>
          <p className="text-gray-600">
            Start with our{" "}
            <span className="font-bold text-green-600">FREE</span> plan
          </p>
          <p className="text-sm text-gray-500 mt-1">
            No credit card required • 5 users • 3 teams
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Personal Information */}
          <div className="space-y-2">
            <Label htmlFor="name">Your Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              {...registerField("name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...registerField("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...registerField("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Organization Information */}
          <div className="border-t pt-4 mt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Organization Details
            </p>

            <div className="space-y-2">
              <Label htmlFor="organizationName">Organization Name *</Label>
              <Input
                id="organizationName"
                type="text"
                placeholder="Acme Inc."
                {...registerField("organizationName")}
                onChange={(e) => {
                  registerField("organizationName").onChange(e);
                  handleOrgNameChange(e);
                }}
                className={errors.organizationName ? "border-red-500" : ""}
              />
              {errors.organizationName && (
                <p className="text-sm text-red-600">
                  {errors.organizationName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizationSlug">Organization Slug *</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">teamhub.com/</span>
                <Input
                  id="organizationSlug"
                  type="text"
                  placeholder="acme-inc"
                  {...registerField("organizationSlug")}
                  className={errors.organizationSlug ? "border-red-500" : ""}
                />
              </div>
              {errors.organizationSlug && (
                <p className="text-sm text-red-600">
                  {errors.organizationSlug.message}
                </p>
              )}
              <p className="text-xs text-gray-500">
                This will be your organization's unique URL
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Creating Account...
              </>
            ) : (
              "Create Free Account"
            )}
          </Button>
        </form>

        {/* Terms & Privacy */}
        <p className="text-xs text-center text-gray-500">
          By signing up, you agree to our{" "}
          <Link to="/terms" className="text-indigo-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-indigo-600 hover:underline">
            Privacy Policy
          </Link>
        </p>

        {/* Login Link */}
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
