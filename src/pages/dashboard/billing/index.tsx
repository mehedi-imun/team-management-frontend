import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Download,
  DollarSign,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Dummy data - replace with real API
const currentPlan = {
  name: "Professional",
  price: "$49",
  period: "month",
  features: [
    "50 Team members",
    "Unlimited teams",
    "Advanced analytics",
    "Priority support",
  ],
  status: "active",
  nextBilling: "2025-11-17",
};

const invoices = [
  {
    id: "INV-001",
    date: "2025-10-17",
    amount: "$49.00",
    status: "paid",
  },
  {
    id: "INV-002",
    date: "2025-09-17",
    amount: "$49.00",
    status: "paid",
  },
  {
    id: "INV-003",
    date: "2025-08-17",
    amount: "$49.00",
    status: "paid",
  },
];

export default function BillingPage() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Trial Banner */}
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                  Trial ending in 5 days
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Upgrade now to continue using all features without interruption
                </p>
              </div>
            </div>
            <Button>Upgrade Plan</Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            Manage your subscription and billing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="space-y-4 flex-1">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    {currentPlan.status}
                  </Badge>
                </div>
                <p className="text-3xl font-bold">
                  {currentPlan.price}
                  <span className="text-lg text-muted-foreground font-normal">
                    /{currentPlan.period}
                  </span>
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Plan includes:</p>
                <ul className="space-y-1">
                  {currentPlan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Next billing date:{" "}
                  <span className="font-medium text-foreground">
                    {new Date(currentPlan.nextBilling).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button variant="outline">
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Button>
              <Button variant="outline">Manage Subscription</Button>
              <Button variant="outline" className="text-red-600">
                Cancel Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>
            Manage your payment methods and billing details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/2026</p>
              </div>
            </div>
            <Button variant="outline">Update</Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                View and download your past invoices
              </CardDescription>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>
                      {new Date(invoice.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        {invoice.amount}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Usage This Month</CardTitle>
          <CardDescription>Track your organization's usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Team Members</p>
              <p className="text-2xl font-bold">24 / 50</p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[48%]" />
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Teams</p>
              <p className="text-2xl font-bold">8 / ∞</p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[20%]" />
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Storage Used</p>
              <p className="text-2xl font-bold">2.4 GB / 10 GB</p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-[24%]" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
