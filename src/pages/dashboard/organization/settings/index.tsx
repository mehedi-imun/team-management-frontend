import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Bell, Building2, Globe, Mail, Shield, Users } from "lucide-react";
import { useState } from "react";

export default function OrganizationSettingsPage() {
  const { toast } = useToast();
  const [orgData, setOrgData] = useState({
    name: "Acme Corporation",
    email: "contact@acme.com",
    website: "https://acme.com",
    description: "Leading software development company",
    logo: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    teamUpdates: true,
    memberInvites: true,
    billingAlerts: true,
  });

  const handleSaveGeneral = () => {
    toast({
      title: "Settings saved",
      description: "Organization settings have been updated successfully",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Preferences saved",
      description: "Notification preferences have been updated",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Organization Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization's settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="members">Member Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
              <CardDescription>
                Update your organization's public information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={orgData.logo} />
                  <AvatarFallback className="text-2xl">
                    {orgData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline">Upload Logo</Button>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>

              {/* Organization Name */}
              <div className="space-y-2">
                <Label htmlFor="orgName" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Organization Name
                </Label>
                <Input
                  id="orgName"
                  value={orgData.name}
                  onChange={(e) =>
                    setOrgData({ ...orgData, name: e.target.value })
                  }
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="orgEmail" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Email
                </Label>
                <Input
                  id="orgEmail"
                  type="email"
                  value={orgData.email}
                  onChange={(e) =>
                    setOrgData({ ...orgData, email: e.target.value })
                  }
                />
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="orgWebsite" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Website
                </Label>
                <Input
                  id="orgWebsite"
                  type="url"
                  value={orgData.website}
                  onChange={(e) =>
                    setOrgData({ ...orgData, website: e.target.value })
                  }
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="orgDescription">Description</Label>
                <Textarea
                  id="orgDescription"
                  value={orgData.description}
                  onChange={(e) =>
                    setOrgData({ ...orgData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <Button onClick={handleSaveGeneral}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Member Settings */}
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Member Management</CardTitle>
              <CardDescription>
                Configure how members can join and interact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Allow self-registration</p>
                      <p className="text-sm text-muted-foreground">
                        Let users join with email verification
                      </p>
                    </div>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Require admin approval</p>
                      <p className="text-sm text-muted-foreground">
                        New members need approval before joining
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email domain restriction</p>
                      <p className="text-sm text-muted-foreground">
                        Only allow specific email domains
                      </p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Allowed Email Domains</Label>
                <Input placeholder="example.com, company.com" />
                <p className="text-sm text-muted-foreground">
                  Comma-separated list of allowed domains
                </p>
              </div>

              <Button onClick={handleSaveGeneral}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive organization notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        emailNotifications: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Team updates</p>
                      <p className="text-sm text-muted-foreground">
                        Notify when teams are created or updated
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.teamUpdates}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        teamUpdates: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Member invitations</p>
                      <p className="text-sm text-muted-foreground">
                        Notify when new members are invited
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.memberInvites}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        memberInvites: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Billing alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Important billing and payment updates
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.billingAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        billingAlerts: checked,
                      })
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSaveNotifications}>
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage security and access control
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-factor authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for all members
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Session timeout</p>
                    <p className="text-sm text-muted-foreground">
                      Auto-logout after inactivity
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Session Timeout (minutes)</Label>
                <Input type="number" defaultValue="30" />
              </div>

              <Button onClick={handleSaveGeneral}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
