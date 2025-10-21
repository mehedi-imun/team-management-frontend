import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Check, Palette, X } from "lucide-react";

const ThemePreview = () => {
  const colorGroups = [
    {
      title: "Primary Colors",
      colors: [
        { name: "Primary", class: "bg-primary text-primary-foreground" },
        { name: "Secondary", class: "bg-secondary text-secondary-foreground" },
        { name: "Accent", class: "bg-accent text-accent-foreground" },
      ],
    },
    {
      title: "Surface Colors",
      colors: [
        {
          name: "Background",
          class: "bg-background text-foreground border border-border",
        },
        {
          name: "Card",
          class: "bg-card text-card-foreground border border-border",
        },
        { name: "Muted", class: "bg-muted text-muted-foreground" },
      ],
    },
    {
      title: "Semantic Colors",
      colors: [{ name: "Destructive", class: "bg-destructive text-white" }],
    },
    {
      title: "Chart Colors",
      colors: [
        { name: "Chart 1", class: "bg-chart-1 text-white" },
        { name: "Chart 2", class: "bg-chart-2 text-white" },
        { name: "Chart 3", class: "bg-chart-3 text-white" },
        { name: "Chart 4", class: "bg-chart-4 text-white" },
        { name: "Chart 5", class: "bg-chart-5 text-white" },
      ],
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Palette className="h-10 w-10 text-primary" />
            Theme Preview
          </h1>
          <p className="text-muted-foreground mt-2">
            Professional Team Management Color Palette
          </p>
        </div>
        <ModeToggle />
      </div>

      {/* Color Swatches */}
      {colorGroups.map((group) => (
        <Card key={group.title}>
          <CardHeader>
            <CardTitle>{group.title}</CardTitle>
            <CardDescription>
              Visual representation of {group.title.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.colors.map((color) => (
                <div
                  key={color.name}
                  className={`${color.class} p-6 rounded-lg flex items-center justify-center font-semibold text-lg shadow-sm`}
                >
                  {color.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Buttons Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Button Variants</CardTitle>
          <CardDescription>All available button styles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="default">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="destructive">Destructive Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="link">Link Button</Button>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </CardContent>
      </Card>

      {/* Badges Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Badge Variants</CardTitle>
          <CardDescription>Status indicators and labels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Status Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Status Cards</CardTitle>
          <CardDescription>Common UI patterns with icons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-green-500/50">
              <CardContent className="pt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold">Success</p>
                  <p className="text-sm text-muted-foreground">
                    Operation completed
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardContent className="pt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <X className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="font-semibold">Error</p>
                  <p className="text-sm text-muted-foreground">
                    Something went wrong
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-500/50">
              <CardContent className="pt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold">Warning</p>
                  <p className="text-sm text-muted-foreground">
                    Needs attention
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>Text styles and hierarchy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold">Heading 1 - Team Management</h1>
            <h2 className="text-3xl font-bold mt-4">
              Heading 2 - Dashboard Overview
            </h2>
            <h3 className="text-2xl font-semibold mt-4">
              Heading 3 - Section Title
            </h3>
            <h4 className="text-xl font-semibold mt-4">
              Heading 4 - Subsection
            </h4>
          </div>

          <div className="space-y-2">
            <p className="text-foreground">
              This is body text with normal foreground color. Lorem ipsum dolor
              sit amet, consectetur adipiscing elit.
            </p>
            <p className="text-muted-foreground">
              This is muted text used for less important information or
              descriptions.
            </p>
            <p className="text-sm text-muted-foreground">
              This is small muted text, often used for helper text or captions.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Form Elements</CardTitle>
          <CardDescription>Input fields and form components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <textarea
              placeholder="Enter your message"
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemePreview;
