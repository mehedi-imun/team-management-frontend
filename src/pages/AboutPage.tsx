import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Award, Heart, Target, Users } from "lucide-react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  const values = [
    {
      icon: Users,
      title: "Customer First",
      description: "We put our customers at the heart of everything we do.",
    },
    {
      icon: Target,
      title: "Innovation",
      description: "Constantly improving and innovating our platform.",
    },
    {
      icon: Heart,
      title: "Transparency",
      description: "Open and honest communication with our community.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to delivering the highest quality product.",
    },
  ];

  const team = [
    { name: "John Smith", role: "CEO & Founder", image: "👨‍💼" },
    { name: "Sarah Johnson", role: "CTO", image: "👩‍💻" },
    { name: "Mike Davis", role: "Head of Product", image: "👨‍🎨" },
    { name: "Emily Chen", role: "Head of Customer Success", image: "👩‍💼" },
  ];

  const milestones = [
    { year: "2020", event: "Company Founded" },
    { year: "2021", event: "1,000 Users" },
    { year: "2022", event: "Series A Funding" },
    { year: "2023", event: "10,000+ Teams" },
    { year: "2024", event: "50,000+ Users" },
    { year: "2025", event: "Global Expansion" },
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
            Building the Future of{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Team Management
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            We're on a mission to make team collaboration effortless and
            enjoyable for everyone.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/50 dark:bg-card/30 backdrop-blur-xl border-primary/10 hover:border-primary/30 transition-all duration-500">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  TeamManager was born out of frustration with existing team
                  management tools. In 2020, our founders were managing multiple
                  teams across different projects and realized there wasn't a
                  single platform that made team collaboration truly seamless.
                </p>
                <p>
                  We set out to build something better – a platform that
                  combines powerful features with an intuitive interface. A tool
                  that teams actually enjoy using, not just endure.
                </p>
                <p>
                  Today, TeamManager serves thousands of teams worldwide, from
                  startups to Fortune 500 companies. But our mission remains the
                  same: make team management effortless for everyone.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Values</h2>
          <p className="text-xl text-muted-foreground">
            The principles that guide everything we do
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card
                key={index}
                className="text-center bg-card/50 dark:bg-card/30 backdrop-blur-xl border-primary/10 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 hover:scale-105 group"
              >
                <CardContent className="pt-8">
                  <div className="mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg group-hover:scale-110 transition-transform">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 transition-all">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-xl text-muted-foreground">
            The people behind TeamManager
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {team.map((member, index) => (
            <Card
              key={index}
              className="text-center bg-card/50 dark:bg-card/30 backdrop-blur-xl border-primary/10 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 hover:scale-105"
            >
              <CardContent className="pt-8">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Journey</h2>
          <p className="text-xl text-muted-foreground">
            Key milestones in our growth
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/50 dark:bg-card/30 backdrop-blur-xl border-primary/10 p-8">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center group">
                  <div className="flex-shrink-0 w-24 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                    {milestone.year}
                  </div>
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"></div>
                  <div className="flex-grow h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 mx-4"></div>
                  <div className="flex-shrink-0 text-lg font-medium">
                    {milestone.event}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 animate-gradient bg-[length:200%_200%]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/20 rounded-full filter blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/20 rounded-full filter blur-3xl animate-float animation-delay-2000" />

          <CardContent className="relative text-center py-16 px-8 z-10">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Want to Join Our Journey?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Start using TeamManager today and be part of our story
            </p>
            <Link to="/register">
              <Button
                size="lg"
                className="text-lg px-10 py-7 bg-white text-blue-600 hover:bg-gray-50 shadow-2xl hover:scale-105 transition-all duration-300 font-bold"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </div>
      </section>

      {/* Footer spacing */}
      <div className="h-20" />
    </div>
  );
};

export default AboutPage;
