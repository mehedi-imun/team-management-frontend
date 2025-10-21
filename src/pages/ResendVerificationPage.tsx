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
import { Building2, CheckCircle2, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const ResendVerificationPage = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(
          data.message ||
            "Verification email sent successfully. Please check your inbox."
        );
      } else {
        setStatus("error");
        setMessage(
          data.message || "Failed to send verification email. Please try again."
        );
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      setStatus("error");
      setMessage("Something went wrong. Please try again later.");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
        <Card className="w-full max-w-xl shadow-xl">
          <CardContent className="pt-8 pb-8 px-8">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-6">
                <CheckCircle2 className="h-20 w-20 text-green-600 dark:text-green-400" />
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-bold">Email Sent!</h2>
                <p className="text-muted-foreground text-base">
                  We've sent a new verification link to:
                </p>
                <p className="text-xl font-semibold text-primary break-all">
                  {email}
                </p>
              </div>

              <Alert className="text-left w-full">
                <AlertDescription>
                  <div className="space-y-3">
                    <p className="font-medium text-base">Next steps:</p>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Open your email inbox</li>
                      <li>Look for our verification email</li>
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
                  onClick={() => (window.location.href = "mailto:")}
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
                Still didn't receive it? Check your spam folder or{" "}
                <button
                  onClick={() => {
                    setStatus("idle");
                    setEmail("");
                    setMessage("");
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  try a different email
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Building2 className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">
            Resend Verification Email
          </CardTitle>
          <CardDescription>
            Enter your email address to receive a new verification link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === "error" && message && (
              <Alert variant="destructive">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your-email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === "loading"}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                We'll send a new verification link to this email address
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-11"
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Verification Email
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <div className="px-8 pb-6">
          <div className="text-center text-sm space-y-2">
            <div>
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
            <div>
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResendVerificationPage;
