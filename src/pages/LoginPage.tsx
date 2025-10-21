import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { setUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hook";
import { Building2, Copy, Loader2, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | React.ReactNode>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login(formData).unwrap();
      dispatch(setUser(response.data.user));

      if (
        response.data.mustChangePassword ||
        response.data.user.mustChangePassword
      ) {
        navigate("/change-password");
      } else {
        navigate("/dashboard");
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string; statusCode?: number } };
      const errorMessage =
        error?.data?.message || "Login failed. Please try again.";

      if (
        (error?.data?.statusCode === 403 &&
          errorMessage.toLowerCase().includes("verify")) ||
        errorMessage.toLowerCase().includes("pending")
      ) {
        setError(
          <>
            Please verify your email address before logging in.{" "}
            <Link
              to="/resend-verification"
              className="text-primary hover:underline font-medium"
            >
              Resend verification email
            </Link>
          </>
        );
      } else {
        setError(errorMessage);
      }
    }
  };

  // Demo credentials provided
  const demoCredentials = [
    {
      label: "Super Admin",
      email: "superadmin@teammanagement.com",
      password: "superadmin123",
    },
    {
      label: "Organization Owner",
      email: "mehediimun@gmail.com",
      password: "Pa$$w0rd!",
    },
  ];

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // optionally you can show a toast/snackbar here if you have one
    } catch {
      // ignore copy failures silently
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gap-8 relative overflow-hidden">
      {/* PatternCraft-inspired animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-600 dark:to-cyan-600 rounded-full mix-blend-multiply dark:mix-blend-plus-lighter filter blur-3xl opacity-20 dark:opacity-10 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-600 dark:to-pink-600 rounded-full mix-blend-multiply dark:mix-blend-plus-lighter filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-r from-pink-400 to-rose-400 dark:from-pink-600 dark:to-rose-600 rounded-full mix-blend-multiply dark:mix-blend-plus-lighter filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* Left-side Demo Credentials Card (desktop only) */}
      <Card className="hidden md:flex flex-col justify-center items-start w-80 shadow-xl bg-card/80 dark:bg-card/60 backdrop-blur-xl border-primary/10 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-primary">
            Demo Credentials
          </CardTitle>
          <CardDescription>Use these to test the app instantly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 w-full">
          {demoCredentials.map((c) => (
            <div key={c.label} className="space-y-2 w-full">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{c.label}</div>
                <div className="text-xs text-muted-foreground">click to copy</div>
              </div>

              <div className="flex items-center justify-between bg-muted/40 p-2 rounded-md">
                <div className="flex items-center gap-2 text-sm truncate">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{c.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(c.email)}
                    title="Copy email"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-muted/40 p-2 rounded-md">
                <div className="flex items-center gap-2 text-sm truncate">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{c.password}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(c.password)}
                    title="Copy password"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Main Login Card (unchanged) */}
      <Card className="w-full max-w-md shadow-2xl bg-card/80 dark:bg-card/60 backdrop-blur-xl border-primary/10">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
              <Building2 className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">
            Welcome{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Back
            </span>
          </CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </div>
          <div className="text-sm text-center">
            <Link to="/" className="text-gray-600 hover:text-primary">
              ← Back to home
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
