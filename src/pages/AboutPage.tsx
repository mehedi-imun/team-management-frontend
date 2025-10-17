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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Building the Future of Team Management
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We're on a mission to make team collaboration effortless and
            enjoyable for everyone.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
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
      <section className="container mx-auto px-4 py-20 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Values</h2>
          <p className="text-xl text-gray-600">
            The principles that guide everything we do
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-8">
                  <div className="mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-600">The people behind TeamManager</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {team.map((member, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-shadow"
            >
              <CardContent className="pt-8">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="container mx-auto px-4 py-20 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Journey</h2>
          <p className="text-xl text-gray-600">Key milestones in our growth</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center">
                <div className="flex-shrink-0 w-24 text-2xl font-bold text-primary">
                  {milestone.year}
                </div>
                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary"></div>
                <div className="flex-grow h-0.5 bg-gray-200 mx-4"></div>
                <div className="flex-shrink-0 text-lg font-medium">
                  {milestone.event}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-primary text-white shadow-2xl">
          <CardContent className="text-center py-16">
            <h2 className="text-4xl font-bold mb-4">
              Want to Join Our Journey?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Start using TeamManager today and be part of our story
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AboutPage;
