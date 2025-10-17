import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { useCreateCheckoutMutation } from "../redux/features/billing/billingApi";
import { useGetSubscriptionQuery } from "../redux/features/billing/billingApi";

const plans = [
  {
    name: "FREE",
    price: 0,
    interval: "forever",
    features: [
      "5 users",
      "3 teams",
      "1GB storage",
      "Basic features",
      "Email support",
    ],
    color: "gray",
    current: true,
  },
  {
    name: "Professional",
    price: 29,
    priceAnnual: 290,
    interval: "monthly",
    features: [
      "50 users",
      "20 teams",
      "50GB storage",
      "Analytics dashboard",
      "Export capabilities",
      "Priority support",
    ],
    color: "blue",
    popular: true,
  },
  {
    name: "Business",
    price: 99,
    priceAnnual: 990,
    interval: "monthly",
    features: [
      "200 users",
      "100 teams",
      "500GB storage",
      "Advanced analytics",
      "API access",
      "Priority support",
      "Custom integrations",
    ],
    color: "purple",
  },
  {
    name: "Enterprise",
    price: 299,
    priceAnnual: 2990,
    interval: "monthly",
    features: [
      "Unlimited users",
      "Unlimited teams",
      "2TB storage",
      "Custom features",
      "SLA guarantee",
      "Dedicated support",
      "On-premise option",
    ],
    color: "indigo",
  },
];

export default function Billing() {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);
  const { data: subscription } = useGetSubscriptionQuery();
  const [createCheckout, { isLoading }] = useCreateCheckoutMutation();

  const handleUpgrade = async (
    plan: "professional" | "business" | "enterprise"
  ) => {
    try {
      const result = await createCheckout({
        plan,
        interval: isAnnual ? "annual" : "monthly",
      }).unwrap();

      // Redirect to Stripe Checkout
      window.location.href = result.data.url;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(
        err?.data?.message || "Failed to create checkout session"
      );
    }
  };

  const currentPlan = subscription?.data?.plan || "free";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Start free, upgrade when you're ready
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-md">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full transition-colors ${
                !isAnnual
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full transition-colors ${
                isAnnual
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => {
            const isCurrent =
              plan.name.toLowerCase() === currentPlan.toLowerCase();
            const price = isAnnual && plan.priceAnnual ? plan.priceAnnual : plan.price;
            const savings = plan.priceAnnual
              ? plan.price * 12 - plan.priceAnnual
              : 0;

            return (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-xl p-8 ${
                  plan.popular ? "ring-2 ring-indigo-600" : ""
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Current Plan Badge */}
                {isCurrent && (
                  <div className="absolute -top-4 right-4">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Current
                    </span>
                  </div>
                )}

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ${price}
                  </span>
                  <span className="text-gray-600 ml-2">
                    / {isAnnual && plan.price > 0 ? "year" : plan.interval}
                  </span>
                  {isAnnual && savings > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      Save ${savings}/year
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                {plan.name === "FREE" ? (
                  <Button
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white"
                    disabled={isCurrent}
                  >
                    {isCurrent ? "Current Plan" : "Get Started"}
                  </Button>
                ) : (
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-gray-800 hover:bg-gray-900"
                    } text-white`}
                    onClick={() =>
                      handleUpgrade(
                        plan.name.toLowerCase() as
                          | "professional"
                          | "business"
                          | "enterprise"
                      )
                    }
                    disabled={isLoading || isCurrent}
                  >
                    {isCurrent
                      ? "Current Plan"
                      : isLoading
                      ? "Processing..."
                      : "Upgrade Now"}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4 text-left">
            <details className="bg-white p-6 rounded-lg shadow-md">
              <summary className="font-semibold cursor-pointer">
                Can I change plans later?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes
                will be reflected in your next billing cycle.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg shadow-md">
              <summary className="font-semibold cursor-pointer">
                What payment methods do you accept?
              </summary>
              <p className="mt-2 text-gray-600">
                We accept all major credit cards (Visa, MasterCard, American
                Express) via Stripe's secure payment platform.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg shadow-md">
              <summary className="font-semibold cursor-pointer">
                Can I cancel anytime?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes! You can cancel your subscription at any time. You'll
                continue to have access until the end of your billing period.
              </p>
            </details>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Button
            onClick={() => navigate("/teams")}
            variant="outline"
            className="px-8"
          >
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
