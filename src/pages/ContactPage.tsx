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
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSuccess(true);
    setIsSubmitting(false);
    setFormData({ name: "", email: "", subject: "", message: "" });

    // Reset success message after 5 seconds
    setTimeout(() => setIsSuccess(false), 5000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "support@teammanager.com",
      link: "mailto:support@teammanager.com",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+1 (555) 123-4567",
      link: "tel:+15551234567",
    },
    {
      icon: MapPin,
      title: "Office",
      value: "123 Business St, San Francisco, CA 94102",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* PatternCraft-inspired animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-600 dark:to-cyan-600 rounded-full mix-blend-multiply dark:mix-blend-plus-lighter filter blur-3xl opacity-20 dark:opacity-10 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-600 dark:to-pink-600 rounded-full mix-blend-multiply dark:mix-blend-plus-lighter filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-r from-pink-400 to-rose-400 dark:from-pink-600 dark:to-rose-600 rounded-full mix-blend-multiply dark:mix-blend-plus-lighter filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Get in{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 pb-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="bg-card/50 dark:bg-card/30 backdrop-blur-xl border-primary/10 hover:border-primary/30 transition-all duration-500">
            <CardHeader>
              <CardTitle className="text-2xl">Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 24
                hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess && (
                <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-300">
                    Thank you! Your message has been sent successfully.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    value={formData.message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="bg-card/50 dark:bg-card/30 backdrop-blur-xl border-primary/10 hover:border-primary/30 transition-all duration-500">
              <CardHeader>
                <CardTitle className="text-2xl">Contact Information</CardTitle>
                <CardDescription>
                  Reach out to us through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <a
                      key={index}
                      href={info.link}
                      className="flex items-start space-x-4 p-4 rounded-lg bg-secondary/50 dark:bg-secondary/20 hover:bg-secondary/70 dark:hover:bg-secondary/30 transition-colors group"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{info.title}</h3>
                        <p className="text-muted-foreground">{info.value}</p>
                      </div>
                    </a>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-card/50 dark:bg-card/30 backdrop-blur-xl border-primary/10">
              <CardHeader>
                <CardTitle>Business Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="font-medium text-foreground">
                      9:00 AM - 6:00 PM PST
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-medium text-foreground">
                      10:00 AM - 4:00 PM PST
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="font-medium text-foreground">Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="relative overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />

              <CardContent className="relative pt-6 z-10">
                <h3 className="text-xl font-bold mb-2 text-white">
                  Need Immediate Help?
                </h3>
                <p className="mb-4 text-blue-100">
                  Check out our Help Center for instant answers to common
                  questions.
                </p>
                <Button className="w-full bg-white text-blue-600 hover:bg-gray-50 shadow-lg">
                  Visit Help Center
                </Button>
              </CardContent>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Common Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "Sales Inquiries",
                a: "Contact our sales team for demos and quotes",
              },
              {
                q: "Technical Support",
                a: "Get help with technical issues and bugs",
              },
              {
                q: "Billing Questions",
                a: "Questions about invoices and payments",
              },
              { q: "Partnership", a: "Interested in partnering with us?" },
            ].map((item, index) => (
              <Card
                key={index}
                className="bg-card/50 dark:bg-card/30 backdrop-blur-xl border-primary/10 hover:border-primary/30 transition-all duration-500 hover:scale-105"
              >
                <CardContent className="pt-6">
                  <h3 className="font-bold mb-2">{item.q}</h3>
                  <p className="text-muted-foreground text-sm">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer spacing */}
      <div className="h-20" />
    </div>
  );
};

export default ContactPage;
