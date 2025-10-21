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
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
    },
    {
      icon: Target,
      title: "Innovation",
      description: "Constantly improving and innovating our platform.",
      gradient: "from-purple-500 via-pink-500 to-rose-500",
    },
    {
      icon: Heart,
      title: "Transparency",
      description: "Open and honest communication with our community.",
      gradient: "from-orange-500 via-red-500 to-pink-500",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to delivering the highest quality product.",
      gradient: "from-green-500 via-emerald-500 to-teal-500",
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
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-600 dark:to-cyan-600 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-600 dark:to-pink-600 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-pink-400 to-rose-400 dark:from-pink-600 dark:to-rose-600 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-primary/20 backdrop-blur-sm mb-6">
            <span className="text-sm font-bold uppercase tracking-wider text-primary">
              Our Story
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            Building the{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Future
            </span>{" "}
            of
            <br />
            Team Management
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
          <Card className="bg-card/50 dark:bg-card/30 backdrop-blur-xl border-primary/10 shadow-2xl hover:shadow-primary/20 transition-all duration-500">
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
          <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-primary/20 backdrop-blur-sm mb-6">
            <span className="text-sm font-bold uppercase tracking-wider text-primary">
              Our Values
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            The{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Principles
            </span>{" "}
            We Live By
          </h2>
          <p className="text-xl text-muted-foreground">
            The values that guide everything we do
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card
                key={index}
                className="group relative text-center bg-card/50 dark:bg-card/30 backdrop-blur-xl border-primary/10 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden"
              >
                {/* Corner gradient glow */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500`}
                />

                <CardContent className="pt-8 relative z-10">
                  <div
                    className={`mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-br ${value.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 transition-all duration-300">
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
          <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-primary/20 backdrop-blur-sm mb-6">
            <span className="text-sm font-bold uppercase tracking-wider text-primary">
              Meet The Team
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            The People Behind{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              TeamManager
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Passionate experts dedicated to your success
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {team.map((member, index) => (
            <Card
              key={index}
              className="text-center bg-card/50 dark:bg-card/30 backdrop-blur-xl border-primary/10 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 hover:scale-105 group"
            >
              <CardContent className="pt-8">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {member.image}
                </div>
                <h3 className="text-xl font-bold mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 transition-all duration-300">
                  {member.name}
                </h3>
                <p className="text-muted-foreground">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-primary/20 backdrop-blur-sm mb-6">
            <span className="text-sm font-bold uppercase tracking-wider text-primary">
              Our Journey
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Key{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Milestones
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Our growth journey over the years
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="flex items-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="flex-shrink-0 w-24 text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  {milestone.year}
                </div>
                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-primary/50 group-hover:scale-125 transition-transform duration-300"></div>
                <div className="flex-grow h-0.5 bg-gradient-to-r from-primary/50 to-transparent mx-4"></div>
                <div className="flex-shrink-0 text-lg font-bold text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 transition-all duration-300">
                  {milestone.event}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="relative overflow-hidden rounded-3xl">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 animate-gradient bg-[length:200%_200%]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />

          {/* Floating orbs */}
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/20 rounded-full filter blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/20 rounded-full filter blur-3xl animate-float animation-delay-2000" />

          <CardContent className="relative text-center py-16 px-8 z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">
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
    </div>
  );
};

export default AboutPage;
