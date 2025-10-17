import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle,
  Clock,
  CreditCard,
  Globe,
  Shield,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const FeaturesPage = () => {
  const mainFeatures = [
    {
      icon: Users,
      title: "Team Management",
      description:
        "Organize and manage your teams efficiently with our intuitive interface. Create unlimited teams and manage members with ease.",
      benefits: [
        "Unlimited team creation",
        "Drag-and-drop member organization",
        "Team performance tracking",
        "Custom team roles and permissions",
      ],
    },
    {
      icon: Shield,
      title: "Role-Based Access Control",
      description:
        "Secure your organization with granular role-based permissions. Control who can access what with flexible role management.",
      benefits: [
        "Custom role creation",
        "Granular permission settings",
        "Admin, Manager, Director roles",
        "Audit logs for security",
      ],
    },
    {
      icon: Zap,
      title: "Real-time Collaboration",
      description:
        "Work together seamlessly with real-time updates and notifications. Stay in sync with your team members.",
      benefits: [
        "Instant notifications",
        "Live team updates",
        "Collaborative workflows",
        "Activity feeds",
      ],
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Get insights into team performance with detailed analytics and reports. Make data-driven decisions.",
      benefits: [
        "Team performance metrics",
        "Custom reports",
        "Visual dashboards",
        "Export capabilities",
      ],
    },
    {
      icon: UserPlus,
      title: "Invitation System",
      description:
        "Easily invite team members via email. Manage invitations and track acceptance status.",
      benefits: [
        "Email invitations",
        "Bulk invite support",
        "Invitation tracking",
        "Custom welcome messages",
      ],
    },
    {
      icon: CreditCard,
      title: "Flexible Billing",
      description:
        "Choose from multiple plans that scale with your needs. Transparent pricing with no hidden fees.",
      benefits: [
        "Multiple pricing tiers",
        "Monthly/annual billing",
        "Easy plan upgrades",
        "Secure payment processing",
      ],
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description:
        "Stay informed with intelligent notifications. Customize what you want to be notified about.",
      benefits: [
        "Email notifications",
        "In-app alerts",
        "Custom notification rules",
        "Digest options",
      ],
    },
    {
      icon: Clock,
      title: "Activity Tracking",
      description:
        "Track all activities across your organization. Complete audit trail of all actions.",
      benefits: [
        "Activity logs",
        "User action tracking",
        "Timeline views",
        "Search and filter",
      ],
    },
    {
      icon: Globe,
      title: "Multi-Organization Support",
      description:
        "Manage multiple organizations from a single account. Perfect for agencies and consultants.",
      benefits: [
        "Unlimited organizations",
        "Easy switching",
        "Separate billing per org",
        "Isolated data",
      ],
    },
  ];

  const integrations = [
    "Slack",
    "Microsoft Teams",
    "Google Workspace",
    "Zoom",
    "Jira",
    "Trello",
    "Asana",
    "GitHub",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Powerful Features for Modern Teams
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Everything you need to manage, collaborate, and grow your teams
            effectively
          </p>
          <Link to="/register">
            <Button size="lg" className="text-lg px-8">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mb-4 h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, bIndex) => (
                      <li key={bIndex} className="flex items-start text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Integrations Section */}
      <section className="container mx-auto px-4 py-20 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Integrations</h2>
          <p className="text-xl text-gray-600">
            Connect with the tools you already use
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="px-6 py-3 rounded-lg border-2 border-gray-200 hover:border-primary hover:shadow-md transition-all text-gray-700 font-medium"
            >
              {integration}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-primary text-white shadow-2xl">
          <CardContent className="text-center py-16">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Experience These Features?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Start your free trial today and see the difference
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default FeaturesPage;
