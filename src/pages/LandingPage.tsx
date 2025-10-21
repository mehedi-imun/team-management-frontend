import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle,
  Globe,
  Zap as Lightning,
  Lock,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const features = [
    {
      icon: Users,
      title: "Team Management",
      description:
        "Organize and manage your teams efficiently with our intuitive interface.",
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description:
        "Secure your organization with granular role-based permissions.",
      gradient: "from-purple-500 via-pink-500 to-rose-500",
    },
    {
      icon: Lightning,
      title: "Real-time Collaboration",
      description:
        "Work together seamlessly with real-time updates and notifications.",
      gradient: "from-yellow-500 via-orange-500 to-red-500",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Get insights into team performance with detailed analytics and reports.",
      gradient: "from-green-500 via-emerald-500 to-teal-500",
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Access your platform from anywhere in the world, anytime.",
      gradient: "from-indigo-500 via-blue-500 to-cyan-500",
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description:
        "Bank-level encryption and security for your sensitive data.",
      gradient: "from-red-500 via-orange-500 to-yellow-500",
    },
    {
      icon: Rocket,
      title: "Lightning Fast",
      description: "Optimized performance for the smoothest user experience.",
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    },
    {
      icon: Sparkles,
      title: "AI-Powered",
      description:
        "Smart automation and insights powered by artificial intelligence.",
      gradient: "from-pink-500 via-rose-500 to-red-500",
    },
  ];

  const stats = [
    { label: "Active Teams", value: "10K+" },
    { label: "Team Members", value: "50K+" },
    { label: "Organizations", value: "2K+" },
    { label: "Satisfaction", value: "98%" },
  ];

  const pricing = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      features: [
        "Up to 5 team members",
        "3 teams maximum",
        "5GB storage",
        "Basic support",
        "Email notifications",
      ],
      highlighted: false,
    },
    {
      name: "Professional",
      price: "$49",
      period: "/month",
      features: [
        "Up to 50 team members",
        "20 teams",
        "100GB storage",
        "Priority support",
        "Advanced analytics",
        "Custom branding",
      ],
      highlighted: true,
    },
    {
      name: "Business",
      price: "$99",
      period: "/month",
      features: [
        "Up to 200 team members",
        "Unlimited teams",
        "500GB storage",
        "24/7 premium support",
        "Advanced analytics",
        "SSO/SAML",
      ],
      highlighted: false,
    },
    {
      name: "Enterprise",
      price: "$299",
      period: "/month",
      features: [
        "Unlimited team members",
        "Unlimited teams",
        "Unlimited storage",
        "24/7 dedicated support",
        "Custom integrations",
        "SLA guarantee",
      ],
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* PatternCraft-inspired animated background */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950" />

        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-600 dark:to-cyan-600 rounded-full mix-blend-multiply dark:mix-blend-plus-lighter filter blur-3xl opacity-20 dark:opacity-10 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-600 dark:to-pink-600 rounded-full mix-blend-multiply dark:mix-blend-plus-lighter filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-r from-pink-400 to-rose-400 dark:from-pink-600 dark:to-rose-600 rounded-full mix-blend-multiply dark:mix-blend-plus-lighter filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* Hero Section with PatternCraft style */}
      <section className="container mx-auto px-4 pt-32 pb-20 relative">
        {/* Floating elements effect */}
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-primary/20 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-16 h-16 border-2 border-purple-500/20 rounded-lg rotate-45 animate-float animation-delay-2000" />
        <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-pink-500/20 rounded-full animate-float animation-delay-4000" />

        <div className="text-center max-w-5xl mx-auto relative z-10">
          {/* Animated icon with glow */}
          <div className="flex justify-center mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full filter blur-2xl opacity-30 animate-pulse" />
            <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-6 rounded-3xl shadow-2xl">
              <Building2 className="h-16 w-16 text-white" />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-primary/20 backdrop-blur-sm mb-6">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Trusted by 10,000+ teams worldwide
            </span>
          </div>

          {/* Main heading with gradient */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Manage Teams
            </span>
            <br />
            <span className="text-foreground">Like Never Before</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Streamline team collaboration, track progress in real-time, and
            boost productivity with our{" "}
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              AI-powered
            </span>{" "}
            management platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/register">
              <Button
                size="lg"
                className="text-lg px-10 py-7 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-7 border-2 hover:bg-secondary/50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                Login
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with glass morphism */}
      <section className="container mx-auto px-4 mb-20 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="relative overflow-hidden group bg-card/50 dark:bg-card/30 backdrop-blur-xl border-primary/10 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <CardContent className="pt-8 text-center relative z-10">
                <p className="text-4xl lg:text-5xl font-black mb-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section with PatternCraft gradients */}
      <section className="container mx-auto px-4 py-32 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-primary/20 backdrop-blur-sm mb-6">
            <span className="text-sm font-bold uppercase tracking-wider text-primary">
              Powerful Features
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black mb-6">
            Everything You Need to
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Succeed Together
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful tools designed to help your team collaborate, communicate,
            and achieve more
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="group relative overflow-hidden bg-card/50 dark:bg-card/30 backdrop-blur-xl border-primary/10 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              >
                {/* Animated gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-all duration-500`}
                />

                {/* Corner gradient glow */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-20 blur-3xl group-hover:opacity-40 transition-opacity duration-500`}
                />

                <CardHeader className="relative z-10">
                  <div className="mb-4 inline-flex">
                    <div
                      className={`p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 transition-all duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Pricing Section with modern cards */}
      <section className="container mx-auto px-4 py-32 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-primary/20 backdrop-blur-sm mb-6">
            <span className="text-sm font-bold uppercase tracking-wider text-primary">
              Pricing Plans
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black mb-6">
            Simple, Transparent
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect plan for your team's needs. No hidden fees,
            cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {pricing.map((plan, index) => (
            <Card
              key={index}
              className={`relative flex flex-col overflow-hidden backdrop-blur-xl transition-all duration-500 hover:scale-105 ${
                plan.highlighted
                  ? "bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border-2 border-primary shadow-2xl shadow-primary/20 lg:scale-110 z-10"
                  : "bg-card/50 dark:bg-card/30 border-primary/10 hover:border-primary/30 hover:shadow-2xl"
              }`}
            >
              {plan.highlighted && (
                <>
                  {/* Animated glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />

                  {/* Popular badge */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                      <Star className="h-4 w-4 fill-current" />
                      Most Popular
                    </div>
                  </div>
                </>
              )}

              <CardHeader className="relative text-center pb-8 z-10">
                <CardTitle
                  className={`text-2xl font-bold mb-6 ${
                    plan.highlighted ? "text-primary" : ""
                  }`}
                >
                  {plan.name}
                </CardTitle>
                <div className="mb-2">
                  <span
                    className={`text-5xl font-black ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
                        : "text-foreground"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground text-base ml-1">
                    {plan.period}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="relative flex-grow flex flex-col z-10">
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, fIndex) => (
                    <li
                      key={fIndex}
                      className="flex items-start gap-3 group/item"
                    >
                      <div
                        className={`mt-0.5 flex-shrink-0 p-1 rounded-full ${
                          plan.highlighted
                            ? "bg-gradient-to-r from-blue-600 to-purple-600"
                            : "bg-primary/20"
                        }`}
                      >
                        <CheckCircle
                          className={`h-3.5 w-3.5 ${
                            plan.highlighted ? "text-white" : "text-primary"
                          }`}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link to="/register" className="mt-auto">
                  <Button
                    className={`w-full py-6 font-bold transition-all duration-300 hover:scale-105 ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link to="/pricing">
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 border-2 hover:bg-secondary/50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              View Full Pricing Details
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section with stunning gradient */}
      <section className="container mx-auto px-4 py-32 relative z-10">
        <div className="relative overflow-hidden rounded-3xl">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 animate-gradient bg-[length:200%_200%]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />

          {/* Floating orbs */}
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/20 rounded-full filter blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/20 rounded-full filter blur-3xl animate-float animation-delay-2000" />

          <CardContent className="relative text-center py-24 px-8 z-10">
            <div className="inline-block mb-6">
              <Sparkles className="h-16 w-16 text-white animate-pulse" />
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white leading-tight">
              Ready to Transform Your
              <br />
              Team Management?
            </h2>

            <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Join <span className="font-bold">10,000+</span> teams already
              using our platform to achieve incredible results
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/register">
                <Button
                  size="lg"
                  className="text-lg px-10 py-7 bg-white text-blue-600 hover:bg-gray-50 shadow-2xl hover:scale-105 transition-all duration-300 font-bold"
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-7 border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  Login to Dashboard
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-blue-100 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </CardContent>
        </div>
      </section>

      {/* Footer spacing */}
      <div className="h-20" />
    </div>
  );
};

export default LandingPage;
