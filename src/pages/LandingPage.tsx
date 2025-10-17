import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle,
  Shield,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const features = [
    {
      icon: Users,
      title: "Team Management",
      description:
        "Organize and manage your teams efficiently with our intuitive interface.",
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description:
        "Secure your organization with granular role-based permissions.",
    },
    {
      icon: Zap,
      title: "Real-time Collaboration",
      description:
        "Work together seamlessly with real-time updates and notifications.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Get insights into team performance with detailed analytics and reports.",
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
      name: "Starter",
      price: "$9",
      period: "/month",
      features: [
        "Up to 10 team members",
        "5 teams",
        "Basic analytics",
        "Email support",
      ],
      highlighted: false,
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      features: [
        "Up to 50 team members",
        "Unlimited teams",
        "Advanced analytics",
        "Priority support",
        "Custom integrations",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      features: [
        "Unlimited team members",
        "Unlimited teams",
        "Advanced analytics & reports",
        "24/7 dedicated support",
        "Custom integrations",
        "SLA guarantee",
      ],
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Building2 className="h-20 w-20 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Manage Your Teams Like Never Before
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline team collaboration, track progress, and boost
            productivity with our comprehensive team management platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Login
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            No credit card required • 14-day free trial
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 -mt-16 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center shadow-lg">
              <CardContent className="pt-6">
                <p className="text-3xl font-bold text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage and grow your teams effectively
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your team's needs
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricing.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.highlighted
                  ? "border-primary shadow-xl scale-105"
                  : "shadow-lg"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-primary text-white shadow-2xl">
          <CardContent className="text-center py-16">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your Team Management?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of teams already using TeamManager
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default LandingPage;
