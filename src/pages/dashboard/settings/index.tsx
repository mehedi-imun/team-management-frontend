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
import { Bell, Database, Globe, Lock, Mail, Save, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SettingsPage = () => {
  const [isSaving, setIsSaving] = useState(false);

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    platformName: "Team Management System",
    platformUrl: "https://teammanagement.com",
    supportEmail: "support@teammanagement.com",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    requireEmailVerification: true,
    enableTwoFactorAuth: false,
    passwordMinLength: 8,
    sessionTimeout: 480, // minutes
    maxLoginAttempts: 5,
    lockoutDuration: 30, // minutes
  });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "noreply@teammanagement.com",
    fromName: "Team Management",
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    organizationCreated: true,
    userRegistered: true,
    subscriptionUpdated: true,
    paymentReceived: true,
    systemAlerts: true,
  });

  // Database Settings
  const [databaseSettings, setDatabaseSettings] = useState({
    backupEnabled: true,
    backupFrequency: "daily",
    backupRetention: 30, // days
    maintenanceMode: false,
  });

  const handleSaveGeneralSettings = async () => {
    setIsSaving(true);
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("General settings saved successfully");
    } catch {
      toast.error("Failed to save general settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSecuritySettings = async () => {
    setIsSaving(true);
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Security settings saved successfully");
    } catch {
      toast.error("Failed to save security settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEmailSettings = async () => {
    setIsSaving(true);
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Email settings saved successfully");
    } catch {
      toast.error("Failed to save email settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotificationSettings = async () => {
    setIsSaving(true);
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Notification settings saved successfully");
    } catch {
      toast.error("Failed to save notification settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDatabaseSettings = async () => {
    setIsSaving(true);
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Database settings saved successfully");
    } catch {
      toast.error("Failed to save database settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">
          Manage platform configuration and settings
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Globe className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="mr-2 h-4 w-4" />
            Database
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic platform settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input
                    id="platformName"
                    value={generalSettings.platformName}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        platformName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="platformUrl">Platform URL</Label>
                  <Input
                    id="platformUrl"
                    type="url"
                    value={generalSettings.platformUrl}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        platformUrl: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={generalSettings.supportEmail}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        supportEmail: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      value={generalSettings.timezone}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          timezone: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Input
                      id="dateFormat"
                      value={generalSettings.dateFormat}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          dateFormat: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveGeneralSettings} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure authentication and security policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Verification Required</Label>
                    <p className="text-sm text-muted-foreground">
                      Require users to verify their email address
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.requireEmailVerification}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({
                        ...securitySettings,
                        requireEmailVerification: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable 2FA for all users
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.enableTwoFactorAuth}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({
                        ...securitySettings,
                        enableTwoFactorAuth: checked,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="passwordMinLength">
                      Minimum Password Length
                    </Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      min={6}
                      max={32}
                      value={securitySettings.passwordMinLength}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          passwordMinLength: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="sessionTimeout">
                      Session Timeout (minutes)
                    </Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          sessionTimeout: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      min={3}
                      max={10}
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          maxLoginAttempts: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="lockoutDuration">
                      Lockout Duration (minutes)
                    </Label>
                    <Input
                      id="lockoutDuration"
                      type="number"
                      value={securitySettings.lockoutDuration}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          lockoutDuration: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveSecuritySettings}
                  disabled={isSaving}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>
                Configure SMTP and email delivery settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={emailSettings.smtpHost}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          smtpHost: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      value={emailSettings.smtpPort}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          smtpPort: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input
                    id="smtpUser"
                    value={emailSettings.smtpUser}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        smtpUser: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        smtpPassword: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fromEmail">From Email</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={emailSettings.fromEmail}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          fromEmail: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="fromName">From Name</Label>
                    <Input
                      id="fromName"
                      value={emailSettings.fromName}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          fromName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Test Email
                </Button>
                <Button onClick={handleSaveEmailSettings} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Email Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure system notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable all email notifications
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Organization Created</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when new organization is created
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.organizationCreated}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        organizationCreated: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>User Registered</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when new user registers
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.userRegistered}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        userRegistered: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Subscription Updated</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when subscription changes
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.subscriptionUpdated}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        subscriptionUpdated: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Payment Received</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when payment is received
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.paymentReceived}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        paymentReceived: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>System Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify for critical system alerts
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.systemAlerts}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        systemAlerts: checked,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveNotificationSettings}
                  disabled={isSaving}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Settings */}
        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Settings</CardTitle>
              <CardDescription>
                Configure database backup and maintenance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automatic Backups</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable automated database backups
                    </p>
                  </div>
                  <Switch
                    checked={databaseSettings.backupEnabled}
                    onCheckedChange={(checked) =>
                      setDatabaseSettings({
                        ...databaseSettings,
                        backupEnabled: checked,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Input
                      id="backupFrequency"
                      value={databaseSettings.backupFrequency}
                      onChange={(e) =>
                        setDatabaseSettings({
                          ...databaseSettings,
                          backupFrequency: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="backupRetention">
                      Retention Period (days)
                    </Label>
                    <Input
                      id="backupRetention"
                      type="number"
                      value={databaseSettings.backupRetention}
                      onChange={(e) =>
                        setDatabaseSettings({
                          ...databaseSettings,
                          backupRetention: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Put system in maintenance mode
                    </p>
                  </div>
                  <Switch
                    checked={databaseSettings.maintenanceMode}
                    onCheckedChange={(checked) =>
                      setDatabaseSettings({
                        ...databaseSettings,
                        maintenanceMode: checked,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Database className="mr-2 h-4 w-4" />
                  Backup Now
                </Button>
                <Button
                  onClick={handleSaveDatabaseSettings}
                  disabled={isSaving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Database Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
