import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );

  // Real pricing plans matching the billing system
  const plans = [
    {
      name: "Free",
      description: "Perfect for small teams getting started",
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        "Up to 5 team members",
        "3 teams maximum",
        "5GB storage",
        "Basic support",
        "Email notifications",
        "14-day trial",
      ],
      limits: {
        maxUsers: 5,
        maxTeams: 3,
        maxStorage: "5GB",
      },
      highlighted: false,
      cta: "Start Free",
    },
    {
      name: "Professional",
      description: "Best for growing teams and businesses",
      monthlyPrice: 49,
      annualPrice: 470, // Save $118/year (17% discount)
      features: [
        "Up to 50 team members",
        "20 teams",
        "100GB storage",
        "Priority support",
        "Advanced analytics",
        "Custom branding",
        "API access",
      ],
      limits: {
        maxUsers: 50,
        maxTeams: 20,
        maxStorage: "100GB",
      },
      highlighted: true,
      cta: "Start Free Trial",
    },
    {
      name: "Business",
      description: "For established teams with growing needs",
      monthlyPrice: 99,
      annualPrice: 950, // Save $238/year (20% discount)
      features: [
        "Up to 200 team members",
        "Unlimited teams",
        "500GB storage",
        "24/7 premium support",
        "Advanced analytics",
        "Custom branding",
        "API access",
        "SSO/SAML",
        "Dedicated account manager",
      ],
      limits: {
        maxUsers: 200,
        maxTeams: 999,
        maxStorage: "500GB",
      },
      highlighted: false,
      cta: "Start Free Trial",
    },
    {
      name: "Enterprise",
      description: "For large organizations with advanced needs",
      monthlyPrice: 299,
      annualPrice: 2870, // Save $718/year (20% discount)
      features: [
        "Unlimited team members",
        "Unlimited teams",
        "Unlimited storage",
        "24/7 dedicated support",
        "Advanced analytics",
        "Custom branding",
        "API access",
        "SSO/SAML",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantees",
        "On-premise deployment option",
      ],
      limits: {
        maxUsers: 99999,
        maxTeams: 99999,
        maxStorage: "Unlimited",
      },
      highlighted: false,
      cta: "Contact Sales",
    },
  ];

  const faqs = [
    {
      q: "Can I change my plan later?",
      a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
    },
    {
      q: "Is there a free trial?",
      a: "Yes, all plans come with a 14-day free trial. No credit card required.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.",
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes, you can cancel your subscription at any time. No long-term contracts required.",
    },
    {
      q: "Do you offer discounts for nonprofits?",
      a: "Yes! We offer 50% discount for registered nonprofits and educational institutions.",
    },
    {
      q: "What happens when I exceed my plan limits?",
      a: "We'll notify you and help you upgrade to a higher plan that fits your needs.",
    },
  ];

  const getPrice = (plan: (typeof plans)[0]) => {
    return billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;
  };

  const getSavings = (plan: (typeof plans)[0]) => {
    const monthlyCost = plan.monthlyPrice * 12;
    const annualCost = plan.annualPrice;
    return monthlyCost - annualCost;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the perfect plan for your team's needs. No hidden fees.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-1 mb-12">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-md transition-colors ${
                billingCycle === "monthly"
                  ? "bg-white shadow-sm font-medium"
                  : "text-gray-600"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-6 py-2 rounded-md transition-colors ${
                billingCycle === "annual"
                  ? "bg-white shadow-sm font-medium"
                  : "text-gray-600"
              }`}
            >
              Annual
              <span className="ml-2 text-xs text-green-600 font-semibold">
                Save up to 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative flex flex-col ${
                plan.highlighted
                  ? "border-primary shadow-xl lg:scale-105"
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
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
                  {plan.description}
                </p>
                <div className="mb-2">
                  <span className="text-4xl font-bold">${getPrice(plan)}</span>
                  <span className="text-gray-600 text-sm">
                    /{billingCycle === "monthly" ? "mo" : "yr"}
                  </span>
                </div>
                {billingCycle === "annual" && plan.monthlyPrice > 0 && (
                  <p className="text-sm text-green-600 font-medium">
                    Save ${getSavings(plan)}/year
                  </p>
                )}
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <ul className="space-y-2 mb-6 flex-grow">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-xs">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.name === "Enterprise" ? "/contact" : "/register"}
                  className="mt-auto"
                >
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Plan Comparison Table */}
      <section className="container mx-auto px-4 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Compare Plans
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Features</th>
                  {plans.map((plan, index) => (
                    <th key={index} className="text-center p-4 font-semibold">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">Team Members</td>
                  {plans.map((plan, index) => (
                    <td key={index} className="text-center p-4">
                      {plan.limits.maxUsers === 99999
                        ? "Unlimited"
                        : `Up to ${plan.limits.maxUsers}`}
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">Teams</td>
                  {plans.map((plan, index) => (
                    <td key={index} className="text-center p-4">
                      {plan.limits.maxTeams === 99999
                        ? "Unlimited"
                        : `${plan.limits.maxTeams} teams`}
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">Storage</td>
                  {plans.map((plan, index) => (
                    <td key={index} className="text-center p-4">
                      {plan.limits.maxStorage}
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">Support</td>
                  <td className="text-center p-4">Email</td>
                  <td className="text-center p-4">Priority</td>
                  <td className="text-center p-4">24/7 Premium</td>
                  <td className="text-center p-4">24/7 Dedicated</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">Analytics</td>
                  <td className="text-center p-4">Basic</td>
                  <td className="text-center p-4">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center p-4">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center p-4">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">API Access</td>
                  <td className="text-center p-4">-</td>
                  <td className="text-center p-4">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center p-4">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center p-4">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">SSO/SAML</td>
                  <td className="text-center p-4">-</td>
                  <td className="text-center p-4">-</td>
                  <td className="text-center p-4">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center p-4">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-medium">SLA Guarantee</td>
                  <td className="text-center p-4">-</td>
                  <td className="text-center p-4">-</td>
                  <td className="text-center p-4">-</td>
                  <td className="text-center p-4">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-primary text-white shadow-2xl">
          <CardContent className="text-center py-16">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Start your 14-day free trial today. No credit card required.
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

export default PricingPage;
